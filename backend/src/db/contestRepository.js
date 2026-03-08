import db from "./db.js";

export function insertContest(contest) {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO contests
    (platform, contest_id, title, start_time, duration_seconds, end_time, url, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    contest.platform,
    contest.contest_id,
    contest.title,
    contest.start_time,
    contest.duration_seconds,
    contest.end_time,
    contest.url,
    contest.status
  );
}