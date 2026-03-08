import { getLeetcodeUpcomingContests } from './scrapers/leetcode.js';
import { getcfcontests } from './scrapers/codeforces.js';
import { getatcodercontest } from './scrapers/atcoder.js';
import { cccontest } from './scrapers/codechef.js';

import {
  normalizeLeetcode,
  normalizeCodeforces,
  normalizeAtcoder,
  normalizeCodechef
} from './utils/normalize.js';

import { insertContest } from './db/insertContest.js';

async function fetchAll() {
  // fetch in parallel, but don't let one failure stop others
  const tasks = [
    getLeetcodeUpcomingContests().catch((e) => { console.error('LeetCode fetch failed:', e?.message || e); return []; }),
    getcfcontests().catch((e) => { console.error('Codeforces fetch failed:', e?.message || e); return []; }),
    getatcodercontest().catch((e) => { console.error('AtCoder fetch failed:', e?.message || e); return []; }),
    cccontest().catch((e) => { console.error('CodeChef fetch failed:', e?.message || e); return []; })
  ];

  const [leetRaw, cfRaw, atRaw, ccRaw] = await Promise.all(tasks);
  return { leetRaw: leetRaw || [], cfRaw: cfRaw || [], atRaw: atRaw || [], ccRaw: ccRaw || [] };
}

function processAndStore(rawArray, normalizer, label) {
  if (!Array.isArray(rawArray)) rawArray = [];
  const normalized = rawArray.map(normalizer).filter(Boolean);
  let stored = 0;
  for (const contest of normalized) {
    try {
      const inserted = insertContest(contest);
      if (inserted) stored += 1;
    } catch (err) {
      console.error(`${label} insert error:`, err.message || err);
    }
  }
  console.log(`Stored ${stored} ${label} contests`);
  return stored;
}

export async function runScrapers() {
  try {
    const { leetRaw, cfRaw, atRaw, ccRaw } = await fetchAll();

    processAndStore(leetRaw, normalizeLeetcode, 'LeetCode');
    processAndStore(cfRaw, normalizeCodeforces, 'Codeforces');
    processAndStore(atRaw, normalizeAtcoder, 'AtCoder');
    processAndStore(ccRaw, normalizeCodechef, 'CodeChef');

    console.log('Scraper run complete.');
  } catch (err) {
    console.error('runScrapers failed:', err.message || err);
    throw err;
  }
}

// If run directly, execute
if (import.meta.url === `file://${process.argv[1]}`) {
  runScrapers().catch(() => process.exit(1));
}

export default runScrapers;
