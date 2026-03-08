export type Platform = 'leetcode' | 'codeforces' | 'atcoder' | 'codechef' | 'other';

export interface ContestRaw {
  contestUrl?: string;
  link?: string;
  url?: string;
}

export interface ContestEvent {
  platform: string;
  title: string;
  start: string; // ISO timestamp
  end: string;   // ISO timestamp
  raw?: ContestRaw;
}

export interface ApiResponse {
  success: boolean;
  events: ContestEvent[];
}

export interface ThemeColors {
  background: string;
  text: string;
  border: string;
  cardBg: string;
  gridEmpty: string;
  accent: string;
}

export const PLATFORM_COLORS: Record<string, string> = {
  leetcode: '#FFA116',
  codeforces: '#1F8DFF',
  codechef: '#5B4638',
  atcoder: '#444444',
  other: '#9CA3AF',
};
