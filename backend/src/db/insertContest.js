import db from './db.js';

let insertStmt = null;

function getInsertStmt() {
  if (!insertStmt) {
    insertStmt = db.prepare(
      `INSERT OR IGNORE INTO contests
        (platform, contest_id, title, start_time, duration_seconds, end_time, url, status)
       VALUES (@platform, @contest_id, @title, @start_time, @duration_seconds, @end_time, @url, @status)`
    );
  }
  return insertStmt;
}

/**
 * Insert a normalized contest into the DB.
 * Returns true if a row was inserted, false if ignored (duplicate) or on error.
 */
export function insertContest(contest) {
  if (!contest || !contest.platform || !contest.contest_id || !contest.title) {
    return false;
  }

  try {
    const stmt = getInsertStmt();
    const info = stmt.run({
      platform: contest.platform,
      contest_id: String(contest.contest_id),
      title: contest.title,
      start_time: contest.start_time ?? null,
      duration_seconds: contest.duration_seconds ?? null,
      end_time: contest.end_time ?? null,
      url: contest.url ?? null,
      status: contest.status ?? null
    });

    return info.changes === 1;
  } catch (err) {
    console.error('DB insert failed:', err.message || err);
    return false;
  }
}

export default insertContest;
