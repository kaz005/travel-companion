import type { Express, Request, Response } from "express";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";

// Validation schema for language parameter
const languageSchema = z.enum(['ja', 'en', 'zh']);

// Path to the JSON data file
const SCENES_FILE_PATH = path.join(process.cwd(), "server", "data", "scenes.json");

// Error handling wrapper
const asyncHandler = (fn: (req: Request, res: Response) => Promise<void>) => 
  async (req: Request, res: Response) => {
    try {
      await fn(req, res);
    } catch (error) {
      console.error('Route error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

export function registerRoutes(app: Express) {
  app.get('/api/scenes', async (_req, res) => {
    console.log('GET /api/scenes - Fetching all scenes');
    
    try {
      const data = await fs.readFile(SCENES_FILE_PATH, 'utf-8');
      const scenes = JSON.parse(data);
      console.log(`Successfully retrieved ${scenes.length} scenes`);
      
      res.json(scenes);
    } catch (error) {
      console.error('Error fetching scenes:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to fetch scenes. Please try again later.'
      });
    }
  });

  app.get('/api/scenes/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { lang = 'en' } = req.query;
    console.log(`GET /api/scenes/${id} - Fetching scene with language: ${lang}`);

    try {
      // Verify database connection first
      await db.select({ count: sql`count(*)` }).from(scenes);
      console.log('Database connection verified for scene retrieval');

      // Validate ID parameter
      const sceneId = parseInt(id);
      if (isNaN(sceneId)) {
        console.warn(`Invalid scene ID provided: ${id}`);
        return res.status(400).json({ 
          error: 'Invalid scene ID',
          message: 'Scene ID must be a valid number'
        });
      }

      // Validate language parameter
      const validatedLang = languageSchema.parse(lang);
      
      // Add debug logging for query execution
      console.log(`Executing query for scene ${sceneId}...`);
      const scene = await db.query.scenes.findFirst({
        where: eq(scenes.id, sceneId)
      });
      console.log(`Query executed for scene ${sceneId}:`, {
        found: !!scene,
        sceneData: scene ? { id: scene.id, name: scene.name } : null
      });

      if (!scene) {
        console.warn(`Scene not found: ${sceneId}`);
        return res.status(404).json({ 
          error: 'Scene not found',
          message: `No scene found with ID: ${sceneId}`,
          details: 'The requested scene could not be found in the database'
        });
      }

      const explanation = scene.explanations[validatedLang] || scene.explanations.en;
      console.log(`Returning explanation for scene ${sceneId} in ${validatedLang}`);
      res.json(explanation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.warn('Invalid language parameter:', error.errors);
        return res.status(400).json({ 
          error: 'Invalid language parameter',
          message: 'Language must be one of: ja, en, zh',
          details: error.errors
        });
      }
      console.error('Unexpected error in scene retrieval:', {
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : error,
        sceneId,
        language: validatedLang
      });
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch scene details. Please try again later.',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }));

  app.post('/api/scenes', async (req, res) => {
    try {
      const { name, imageUrl, explanations } = req.body;
      const newScene = await db.insert(scenes).values({
        name,
        imageUrl,
        explanations
      }).returning();
      res.status(201).json(newScene[0]);
    } catch (error) {
      console.error('Error creating scene:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/scenes/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const { name, imageUrl, explanations } = req.body;
      const updatedScene = await db.update(scenes)
        .set({ name, imageUrl, explanations })
        .where(eq(scenes.id, parseInt(id)))
        .returning();
      
      if (!updatedScene.length) {
        return res.status(404).json({ error: 'Scene not found' });
      }
      
      res.json(updatedScene[0]);
    } catch (error) {
      console.error('Error updating scene:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.delete('/api/scenes/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await db.delete(scenes).where(eq(scenes.id, parseInt(id)));
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting scene:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}
