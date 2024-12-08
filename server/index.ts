import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { createServer } from "http";
import { initializeDatabase, closeDatabase } from "../db";

const app = express();

// Add CORS configuration for development
app.use(cors({
  origin: process.env.NODE_ENV === "development" ? "http://localhost:5000" : false,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

(async () => {
  try {
    // Initialize database before starting the server
    await initializeDatabase();
    console.log('Database initialized successfully');

    registerRoutes(app);
    const server = createServer(app);

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Error:', err);
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    // Setup Vite or static serving based on environment
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Start server
    const PORT = 5000;
    server.listen(PORT, "0.0.0.0", () => {
      const formattedTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      console.log(`${formattedTime} [express] serving on port ${PORT}`);
    });

    // Handle graceful shutdown
    const shutdown = async () => {
      console.log('Shutting down gracefully...');
      
      // Close server first to stop accepting new connections
      server.close(async (err) => {
        if (err) {
          console.error('Error closing server:', err);
          process.exit(1);
        }

        try {
          // Close database connections
          await closeDatabase();
          console.log('Server and database shutdown complete');
          process.exit(0);
        } catch (error) {
          console.error('Error during shutdown:', error);
          process.exit(1);
        }
      });
    };

    // Listen for shutdown signals
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
