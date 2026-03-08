import db from "./db.js";

db.prepare(`
CREATE TABLE IF NOT EXISTS contests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT NOT NULL,
  contest_id TEXT NOT NULL,
  title TEXT NOT NULL,
  start_time INTEGER,
  duration_seconds INTEGER,
  end_time INTEGER,
  url TEXT,
  status TEXT,
  UNIQUE(platform, contest_id)
)
`).run();

console.log("Database initialized");