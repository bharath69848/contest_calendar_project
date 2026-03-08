import { fetchUpcomingContests, fetchRecentContests } from '@qatadaazzeh/atcoder-api';

export async function getatcodercontest(){
  const upcoming = await fetchUpcomingContests();
  const recent = await fetchRecentContests();

  const contests =  [...recent,...upcoming];

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth()+1, 1);

  const filtered_contests = contests.filter(contest => {
    const contestDate = new Date(contest.contestTime);
    return contestDate >= startOfMonth && contestDate < startOfNextMonth;
  });

  return filtered_contests;
}