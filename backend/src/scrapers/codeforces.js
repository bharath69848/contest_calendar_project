import axios from "axios"

const CF_API = "https://codeforces.com/api/contest.list"

export async function getcfcontests(){
  try{
    const response = await axios.get(CF_API);
    const contests = response.data.result;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfnextMonth = new Date(now.getFullYear(), now.getMonth()+1, 1);

    const filtered_contests = contests.filter(contest => {
      const contestDate = new Date(contest.startTimeSeconds * 1000);
      return contestDate >= startOfMonth && contestDate < startOfnextMonth;
    });
    return filtered_contests;
  }
  catch(e){
    console.error("Codeforces fetch failed:", e.message);
    return [];
  }
}