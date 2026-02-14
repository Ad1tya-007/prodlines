export interface PullRequest {
  title: string;
  url: string;
  number: number;
  linesAdded: number;
  linesDeleted: number;
  mergedAt: string;
}

export interface GitHubContributor {
  id: string;
  username: string;
  avatarUrl: string;
  productionLOC: number;
  percentShare: number;
  commits: number;
  additions: number;
  deletions: number;
  filesTouchedCount: number;
  prsMerged: number;
  prsClosed: number;
  prMergeRate: number;
  avgPrSize: number;
  avgTimeToMergeHours: number;
  lastActivityAt: string | null;
  firstActivityAt: string | null;
  recentCommits: number;
  recentMergedPrs: number;
  contributions: number;
  topFiles: string[];
  recentPRs: PullRequest[];
}

export interface GitHubStatsTrend {
  value: string;
  up: boolean;
}

export interface GitHubStats {
  productionLOC: number;
  activeContributors: number;
  lastSync: string;
  contributors: GitHubContributor[];
  /** Trend vs previous sync (null when no previous snapshot) */
  productionLOCTrend?: GitHubStatsTrend | null;
  /** Trend vs previous sync (null when no previous snapshot) */
  activeContributorsTrend?: GitHubStatsTrend | null;
}

import type { LucideIcon } from 'lucide-react';

export interface KPICard {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend: string | null;
  trendUp: boolean | null;
}

export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  ownerAvatar: string;
  description: string | null;
  private: boolean;
  defaultBranch: string;
  stars: number;
  forks: number;
  language: string | null;
  updatedAt: string;
  pushedAt: string;
}
