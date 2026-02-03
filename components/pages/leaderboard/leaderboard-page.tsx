'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Clock, Share2, Users, Check } from 'lucide-react';
import type { GitHubStats } from '@/lib/types/github';
import { ContributorsTab } from './contributors-tab';

export interface RepoInfo {
  id: string;
  full_name: string;
  owner: string;
  name: string;
  default_branch: string;
  last_synced_at?: string;
}

interface LeaderboardPageProps {
  stats: GitHubStats | null;
  repoInfo: RepoInfo | null;
  repoFullName: string;
}

function formatLastSync(lastSync: string | undefined) {
  if (!lastSync) return 'Never';
  try {
    const date = new Date(lastSync);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } catch {
    return lastSync;
  }
}

export function LeaderboardPage({
  stats,
  repoInfo,
  repoFullName,
}: LeaderboardPageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [owner, repo] = repoFullName.split('/');
  const contributors = stats?.contributors || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">
              {owner}/{repo}
            </h1>
            {repoInfo && (
              <Badge variant="outline" className="flex items-center gap-1">
                <GitBranch className="h-3 w-3" />
                {repoInfo.default_branch}
              </Badge>
            )}
          </div>
          {stats && (
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Last sync: {formatLastSync(stats.lastSync)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {stats.activeContributors} contributors
              </span>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          className="hover-button bg-transparent"
          onClick={handleCopyLink}>
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </>
          )}
        </Button>
      </div>

      {stats && (
        <div className="space-y-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-4 w-4 mr-2" />
            Contributors
          </Badge>

          <ContributorsTab contributors={contributors} />
        </div>
      )}
    </div>
  );
}
