import axios from "axios"
const url = "https://leetcode.com/graphql/";

const headers = {
  "Content-Type": "application/json",
  "Referer": "https://leetcode.com/contest/",
  "User-Agent": "Mozilla/5.0"
};

const payload1 = {
  operationName: "contestV2UpcomingContests",
  query: `
    query contestV2UpcomingContests {
      contestV2UpcomingContests {
        titleSlug
        title
        titleCn
        startTime
        duration
      }
    }
  `,
  variables: {}
};

const payload2 = {
  operationName: "contestV2HistoryContests",
  query: `
    query contestV2HistoryContests($skip: Int!, $limit: Int!) {
      contestV2HistoryContests(skip: $skip, limit: $limit) {
        totalNum
        contests {
          titleSlug
          title
          titleCn
          startTime
          duration
        }
      }
    }
  `,
  variables: {
    skip: 0,
    limit: 20
  }

};

export async function getLeetcodeUpcomingContests() {
  try {
    const response1 = await axios.post(url, payload1, { headers });
    const response2 = await axios.post(url, payload2, { headers });
    const upcoming = response1.data.data.contestV2UpcomingContests;
    const recent = response2.data.data.contestV2HistoryContests.contests;

    const contests = [...recent,...upcoming];
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfnextMonth = new Date(now.getFullYear(), now.getMonth()+1, 1);

    const filtered_contests = contests.filter(contest => {
      const contestDate = new Date(contest.startTime * 1000);
      return contestDate >= startOfMonth && contestDate < startOfnextMonth;
    });
    return filtered_contests;

  } catch (err) {
    console.error("Error fetching contests:", err.message);
  }
}