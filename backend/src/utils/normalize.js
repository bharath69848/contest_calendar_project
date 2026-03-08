// Normalizers for different contest providers
// Each function returns an object matching the normalized shape:
// { platform, contest_id, title, start_time, duration_seconds, end_time, url, status }

function getStatus(startSec, endSec) {
  const now = Math.floor(Date.now() / 1000);
  if (startSec == null) return 'unknown';
  if (now < startSec) return 'UPCOMING';
  if (now >= startSec && endSec != null && now < endSec) return 'ONGOING';
  return 'FINISHED';
}

export function normalizeLeetcode(contest) {
  if (!contest) return null;
  const platform = 'leetcode';
  const contest_id = contest.titleSlug || String(contest.title || '');
  const title = contest.title || contest.titleCn || contest.titleSlug || '';
  const start_time = contest.startTime != null ? Number(contest.startTime) : null; // already unix seconds
  const duration_seconds = contest.duration != null ? Number(contest.duration) : null;
  const end_time = (start_time != null && duration_seconds != null) ? start_time + duration_seconds : null;
  const url = contest.titleSlug ? `https://leetcode.com/contest/${contest.titleSlug}` : null;
  const status = getStatus(start_time, end_time);

  return { platform, contest_id, title, start_time, duration_seconds, end_time, url, status };
}

export function normalizeCodeforces(contest) {
  if (!contest) return null;
  const platform = 'codeforces';
  const contest_id = contest.id != null ? String(contest.id) : (contest.name || '');
  const title = contest.name || '';
  const start_time = contest.startTimeSeconds != null ? Number(contest.startTimeSeconds) : null;
  const duration_seconds = contest.durationSeconds != null ? Number(contest.durationSeconds) : null;
  const end_time = (start_time != null && duration_seconds != null) ? start_time + duration_seconds : null;
  const url = contest.id != null ? `https://codeforces.com/contest/${contest.id}` : null;

  // Map Codeforces phase to our status when possible
  let status;
  if (contest.phase) {
    const phase = contest.phase.toUpperCase();
    if (phase === 'BEFORE') status = 'UPCOMING';
    else if (phase === 'CODING' || phase === 'RUNNING') status = 'ONGOING';
    else status = 'FINISHED';
  } else {
    status = getStatus(start_time, end_time);
  }

  return { platform, contest_id, title, start_time, duration_seconds, end_time, url, status };
}

function parseHHMMToSeconds(hhmm) {
  if (!hhmm) return null;
  const parts = String(hhmm).split(':').map(p => Number(p));
  if (parts.length === 2) {
    const [hh, mm] = parts;
    if (Number.isFinite(hh) && Number.isFinite(mm)) return hh * 3600 + mm * 60;
  }
  return null;
}

export function normalizeAtcoder(contest) {
  if (!contest) return null;
  const platform = 'atcoder';
  const contest_id = contest.contestId || contest.id || '';
  const title = contest.contestName || contest.title || '';

  // contestTime is like "2026-03-07 21:00:00+0900" — Date can parse this in most engines
  let start_time = null;
  if (contest.contestTime) {
    const d = new Date(contest.contestTime);
    if (!Number.isNaN(d.getTime())) start_time = Math.floor(d.getTime() / 1000);
  }

  const duration_seconds = parseHHMMToSeconds(contest.contestDuration);
  const end_time = (start_time != null && duration_seconds != null) ? start_time + duration_seconds : null;
  const url = contest.contestUrl || (contest_id ? `https://atcoder.jp/contests/${contest_id}` : null);
  const status = getStatus(start_time, end_time);

  return { platform, contest_id, title, start_time, duration_seconds, end_time, url, status };
}

export function normalizeCodechef(contest) {
  if (!contest) return null;
  const platform = 'codechef';
  const contest_id = contest.contest_code || contest.contestCode || '';
  const title = contest.contest_name || contest.contestName || '';

  let start_time = null;
  let end_time = null;
  if (contest.contest_start_date_iso) {
    const sd = new Date(contest.contest_start_date_iso);
    if (!Number.isNaN(sd.getTime())) start_time = Math.floor(sd.getTime() / 1000);
  }
  if (contest.contest_end_date_iso) {
    const ed = new Date(contest.contest_end_date_iso);
    if (!Number.isNaN(ed.getTime())) end_time = Math.floor(ed.getTime() / 1000);
  }

  const duration_seconds = (start_time != null && end_time != null) ? (end_time - start_time) : null;
  const url = contest.contest_url || (contest_id ? `https://www.codechef.com/contests/${contest_id}` : null);
  const status = getStatus(start_time, end_time);

  return { platform, contest_id, title, start_time, duration_seconds, end_time, url, status };
}

export default {
  normalizeLeetcode,
  normalizeCodeforces,
  normalizeAtcoder,
  normalizeCodechef
};
