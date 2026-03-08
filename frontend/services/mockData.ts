import { ApiResponse } from '../types';

const generateMockData = (): ApiResponse => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  // Helper to create ISO date for current month
  const date = (day: number, hour: number) => new Date(year, month, day, hour).toISOString();
  // Helper to create ISO date for next month
  const nextMonthDate = (day: number, hour: number) => new Date(year, month + 1, day, hour).toISOString();

  return {
    success: true,
    events: [
      {
        platform: "leetcode",
        title: "Weekly Contest 380",
        start: date(5, 10), // 10:00 AM
        end: date(5, 11),
        raw: { contestUrl: "https://leetcode.com/contest/weekly-contest-380" }
      },
      {
        platform: "codeforces",
        title: "Round #920 (Div. 2)",
        start: date(7, 14),
        end: date(7, 16),
        raw: { contestUrl: "https://codeforces.com/contests" }
      },
      {
        platform: "atcoder",
        title: "Beginner Contest 336",
        start: date(12, 20),
        end: date(12, 22),
        raw: { contestUrl: "https://atcoder.jp/" }
      },
      {
        platform: "codechef",
        title: "Starters 117",
        start: date(15, 18),
        end: date(15, 21),
        raw: { contestUrl: "https://www.codechef.com/" }
      },
      {
        platform: "leetcode",
        title: "Biweekly Contest 122",
        start: date(18, 14),
        end: date(18, 16),
        raw: { contestUrl: "https://leetcode.com/" }
      },
      {
        platform: "codeforces",
        title: "Educational Round 161",
        start: date(20, 15),
        end: date(20, 17),
        raw: { contestUrl: "https://codeforces.com/" }
      },
      {
        platform: "atcoder",
        title: "Regular Contest 171",
        start: date(25, 21),
        end: date(25, 23),
        raw: { contestUrl: "https://atcoder.jp/" }
      },
      // Next Month teasers
       {
        platform: "leetcode",
        title: "Weekly Contest 381",
        start: nextMonthDate(2, 10),
        end: nextMonthDate(2, 11),
        raw: { contestUrl: "https://leetcode.com/" }
      },
    ]
  };
};

export const MOCK_DATA = generateMockData();