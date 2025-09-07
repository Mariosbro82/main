import dotenv from "dotenv";
dotenv.config();

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Use the database path directly
const dbPath = process.env.DATABASE_URL;
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });