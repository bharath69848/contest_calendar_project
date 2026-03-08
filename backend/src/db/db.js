import Database from "better-sqlite3";
import { fileURLToPath } from 'url';
import path from 'path';

// Resolve path to contests.db relative to this file so the DB is consistent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'contests.db');

const db = new Database(dbPath);

export default db;