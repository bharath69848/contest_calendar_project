import axios from "axios";

const CODECHEF_API =
  "https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all";

export async function cccontest() {
  try {
    const response = await axios.get(CODECHEF_API);

    const contests = [
      ...response.data.past_contests,
      ...response.data.future_contests
    ];

    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const startOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    const filtered = contests.filter((contest) => {
      const contestDate = new Date(
        contest.contest_start_date_iso
      );

      return (
        contestDate >= startOfMonth &&
        contestDate < startOfNextMonth &&
        contest.contest_code.startsWith("START")
      );
    });

    return filtered;
  } catch (error) {
    console.error("CodeChef fetch failed:", error.message);
    return [];
  }
}