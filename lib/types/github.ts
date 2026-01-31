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
  trend: 'up' | 'down' | 'neutral';
  trendValue: number;
  topFiles: string[];
  recentPRs: PullRequest[];
}

export interface GitHubStats {
  productionLOC: number;
  activeContributors: number;
  lastSync: string;
  excludedLOC: number;
  contributors: GitHubContributor[];
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
