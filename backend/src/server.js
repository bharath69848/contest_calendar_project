import express from "express";
import cors from 'cors';
import { getatcodercontest } from "./scrapers/atcoder.js";
import { cccontest } from "./scrapers/codechef.js";
import { getcfcontests } from "./scrapers/codeforces.js";
import { getLeetcodeUpcomingContests } from "./scrapers/leetcode.js";
import './db/initDB.js';
import db from './db/db.js';
import startScheduler from './scheduler.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
// Enable CORS for frontend requests. By default allow all origins, but
// honor ALLOWED_ORIGIN env var when set (useful for production).
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
app.use(cors({ origin: allowedOrigin }));

app.get("/", (req, res) => {
  res.send("working daaa small boy");
});

app.get("/atcoder", async (req, res) => {
  const contests = await getatcodercontest();
  res.json(contests);
});

app.get("/leetcode", async (req, res) => {
  const contests = await getLeetcodeUpcomingContests();
  res.json(contests);
});

app.get("/codechef", async (req, res) => {
  const contests = await cccontest();
  res.json(contests);
});

app.get("/getcf", async (req, res) => {
  const contests = await getcfcontests();
  res.json(contests);
});

app.get("/storecontestdb", async (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM contests ORDER BY start_time LIMIT 50').all();
    res.json(rows);
  } catch (err) {
    console.error('storecontestdb error:', err?.message || err);
    res.status(500).json({ error: 'Failed to store/read contests' });
  }
});

app.get("/contests", async (req, res) => {
  try {
    const { platform, upcoming, limit } = req.query;

    let query = 'SELECT * FROM contests';
    const conditions = [];
    const params = [];

    if (platform) {
      conditions.push('platform = ?');
      params.push(platform);
    }

    if (upcoming === 'true') {
      conditions.push('start_time > datetime(\'now\')');
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY start_time';

    if (limit) {
      const parsedLimit = parseInt(limit, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        query += ' LIMIT ?';
        params.push(parsedLimit);
      }
    }

    const rows = db.prepare(query).all(...params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching contests:', err?.message || err);
    res.status(500).json({ error: 'Failed to fetch contests' });
  }
});

app.listen(PORT, () => {
  console.log("Server Runningggggg...");
  // start background scheduler that runs scrapers every 30 minutes
  try {
    startScheduler();
    console.log('Scraper scheduler started');
  } catch (err) {
    console.error('Failed to start scraper scheduler:', err?.message || err);
  }
});