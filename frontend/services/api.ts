// API client for Contest Calendar backend
// In development, calls go through the Vite proxy at /api → http://localhost:8000
// In production, set VITE_API_URL to your hosted backend URL.
const API_BASE = 'https://contest-calendar-project.onrender.com'

export interface BackendContestRow {
  id: number;
  platform: string;
  contest_id: string;
  title: string;
  start_time: number | null; // unix seconds
  duration_seconds: number | null;
  end_time: number | null;   // unix seconds
  url: string | null;
  status: string | null;
}

export interface FetchContestsOptions {
  /** Comma-separated platforms e.g. "leetcode,codeforces" */
  platform?: string;
  /** If true, only return contests starting in the future */
  upcoming?: boolean;
  /** Max rows to return (default 200) */
  limit?: number;
}

export async function fetchContests(opts: FetchContestsOptions = {}): Promise<BackendContestRow[]> {
  const params = new URLSearchParams();
  if (opts.platform) params.set('platform', opts.platform);
  if (opts.upcoming) params.set('upcoming', 'true');
  if (opts.limit) params.set('limit', String(opts.limit));

  const qs = params.toString();
  const url = `${API_BASE}/contests${qs ? '?' + qs : ''}`;

  try {
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('fetchContests non-OK response', res.status, text);
      throw new Error(`API error ${res.status}`);
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      console.warn('fetchContests: unexpected response shape', data);
      return [];
    }
    return data as BackendContestRow[];
  } catch (err) {
    console.error(`fetchContests failed (url=${url}):`, err);
    throw err;
  }
}

/** @deprecated Use fetchContests() instead */
export async function fetchStoredContests(): Promise<BackendContestRow[]> {
  const url = `${API_BASE}/storecontestdb`;
  try {
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data as BackendContestRow[] : [];
  } catch (err) {
    console.error(`fetchStoredContests failed:`, err);
    throw err;
  }
}

export default { fetchContests, fetchStoredContests };
