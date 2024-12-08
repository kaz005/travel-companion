import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import pg from 'pg';
import * as schema from "./schema";
import { seed } from "../migrations/seed";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Connection retry configuration
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 10000; // 10 seconds

// Create connection pool with improved configuration
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000, // 10 second timeout
  idleTimeoutMillis: 30000, // 30 second idle timeout
  max: 20, // Maximum number of clients in the pool
});

// Add error handling for unexpected pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test database connection with retry logic
async function testConnection(retryCount = 0): Promise<boolean> {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to the database');
    client.release();
    return true;
  } catch (error) {
    const delay = Math.min(INITIAL_RETRY_DELAY * Math.pow(2, retryCount), MAX_RETRY_DELAY);
    
    if (retryCount < MAX_RETRIES) {
      console.warn(`Failed to connect to database (attempt ${retryCount + 1}/${MAX_RETRIES}). Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return testConnection(retryCount + 1);
    }
    
    console.error('Error connecting to the database after maximum retries:', error);
    return false;
  }
}

// Export the database instance with initial configuration
export const db = drizzle(pool, { schema });

// Initialize database connection and handle seeding
export const initializeDatabase = async () => {
  console.log('Initializing database connection...');
  const isConnected = await testConnection();
  
  if (!isConnected) {
    throw new Error('Failed to establish database connection after maximum retries');
  }
  
  try {
    // Verify schema access
    await db.select().from(schema.scenes).limit(1);
    console.log('Database schema verified successfully');

    // Always seed the database on initialization
    console.log('Starting database seeding...');
    try {
      const beforeCount = await db.select({ count: sql`count(*)` }).from(schema.scenes);
      await seed();
      const afterCount = await db.select({ count: sql`count(*)` }).from(schema.scenes);
      console.log(`Database seeded successfully. Scene count: ${afterCount[0].count} (was: ${beforeCount[0].count})`);
    } catch (error) {
      console.error('Error seeding database:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
      throw new Error('Failed to seed database. Application requires initial data.');
    }

    return db;
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw new Error('Failed to initialize database');
  }
};

// Enhanced graceful shutdown handler
export const closeDatabase = async () => {
  console.log('Initiating database shutdown...');
  try {
    await pool.end();
    console.log('Database connections closed successfully');
  } catch (error) {
    console.error('Error during database shutdown:', error);
    throw error;
  }
};
