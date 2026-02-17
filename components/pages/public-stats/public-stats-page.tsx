'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Code2,
  Users,
  Clock,
  GitBranch,
  Search,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { KPICard as KPICardType } from '@/lib/types/github';
import { KPICard, KPICardSkeleton } from '../overview/kpi-card';
import { OverviewLeaderboard } from '../overview/overview-leaderboard';
import { OverviewLoadingState } from '../overview/overview-states';
import { ContributorsTab } from '../leaderboard/contributors-tab';
import { usePublicGitHubStats } from '@/lib/hooks/use-public-github-stats';
import { toast } from 'sonner';
import Navbar from '@/components/navbar';

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    // Remove trailing slashes and .git
    const cleanUrl = url
      .trim()
      .replace(/\.git$/, '')
      .replace(/\/$/, '');

    // Match github.com URLs
    const githubRegex = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = cleanUrl.match(githubRegex);

    if (match) {
      return {
        owner: match[1],
        repo: match[2],
      };
    }

    // Try owner/repo format
    const shortFormatRegex = /^([^\/]+)\/([^\/]+)$/;
    const shortMatch = cleanUrl.match(shortFormatRegex);

    if (shortMatch) {
      return {
        owner: shortMatch[1],
        repo: shortMatch[2],
      };
    }

    return null;
  } catch {
    return null;
  }
}

function formatLastSync(lastSync: string) {
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

export function PublicStatsPage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [repoParams, setRepoParams] = useState<{
    owner: string;
    repo: string;
    branch?: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard'>(
    'overview',
  );
  const [copied, setCopied] = useState(false);

  const {
    data: stats,
    isLoading,
    error,
    refetch,
    isFetching,
  } = usePublicGitHubStats(repoParams || { owner: '', repo: '' }, {
    enabled: !!repoParams,
  });

  const handleSearch = () => {
    const parsed = parseGitHubUrl(repoUrl);

    if (!parsed) {
      toast.error(
        'Invalid GitHub URL. Please enter a valid repository URL or owner/repo format.',
      );
      return;
    }

    setRepoParams({
      owner: parsed.owner,
      repo: parsed.repo,
      branch: 'main',
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleResync = async () => {
    try {
      await refetch();
      toast.success('Stats refreshed successfully!');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to refresh stats';
      toast.error(message);
    }
  };

  const kpiCards: KPICardType[] = stats
    ? [
        {
          title: 'Production LOC',
          value: stats.productionLOC.toLocaleString(),
          description: 'Lines in production',
          icon: Code2,
          trend: null,
          trendUp: null,
        },
        {
          title: 'Active Contributors',
          value: stats.activeContributors.toString(),
          description: 'This month',
          icon: Users,
          trend: null,
          trendUp: null,
        },
        {
          title: 'Merged PRs',
          value: stats.contributors
            .reduce((sum, contributor) => sum + contributor.recentMergedPrs, 0)
            .toString(),
          description: 'Last 30 days',
          icon: GitBranch,
          trend: null,
          trendUp: null,
        },
        {
          title: 'Last Sync',
          value: formatLastSync(stats.lastSync),
          description: '',
          icon: Clock,
          trend: null,
          trendUp: null,
        },
      ]
    : [];

  const displayStats = stats && !error && stats.contributors.length > 0;
  const errorMessage = error instanceof Error ? error.message : null;
  const isPrivateRepoError =
    errorMessage?.includes('private') || errorMessage?.includes('Private');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Public Repository Stats</h1>
            <p className="text-muted-foreground text-md">
              View production code ownership for any public GitHub repository
            </p>
          </div>

          {/* Search Input */}
          <div className="mx-auto">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter GitHub URL or owner/repo (e.g., facebook/react)"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={handleSearch}
                disabled={!repoUrl.trim() || isLoading}
                className="px-6">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Examples: https://github.com/vercel/next.js or vercel/next.js
            </p>
          </div>

          {/* Error State */}
          {errorMessage && (
            <div
              className={cn(
                'max-w-2xl mx-auto p-4 rounded-lg border',
                isPrivateRepoError
                  ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-600 dark:text-yellow-400'
                  : 'bg-destructive/10 border-destructive/50 text-destructive',
              )}>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">
                    {isPrivateRepoError ? 'Private Repository' : 'Error'}
                  </p>
                  <p className="text-sm mt-1">{errorMessage}</p>
                  {isPrivateRepoError && (
                    <p className="text-sm mt-2">
                      To view stats for private repositories, please sign in and
                      connect your GitHub account.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && <OverviewLoadingState />}

          {/* Stats Display */}
          {displayStats && repoParams && (
            <>
              {/* Repository Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">
                      {repoParams.owner}/{repoParams.repo}
                    </h1>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1">
                      <GitBranch className="h-3 w-3" />
                      {repoParams.branch || 'main'}
                    </Badge>
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Stats are cached for faster retrieval
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover-button bg-transparent shrink-0"
                  onClick={handleResync}
                  disabled={isLoading || isFetching}>
                  <RefreshCw
                    className={cn('h-4 w-4 mr-2', isFetching && 'animate-spin')}
                  />
                  {isFetching ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 border-b border-border/50">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={cn(
                    'px-4 py-2 text-sm font-medium transition-colors relative',
                    activeTab === 'overview'
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}>
                  Overview
                  {activeTab === 'overview' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={cn(
                    'px-4 py-2 text-sm font-medium transition-colors relative',
                    activeTab === 'leaderboard'
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}>
                  Leaderboard
                  {activeTab === 'leaderboard' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                  )}
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {isLoading
                      ? [...Array(4)].map((_, i) => <KPICardSkeleton key={i} />)
                      : kpiCards.map((card, index) => (
                          <KPICard key={card.title} card={card} index={index} />
                        ))}
                  </div>

                  <OverviewLeaderboard
                    contributors={stats.contributors}
                    isLoading={isLoading}
                    leaderboardHref="/leaderboard"
                  />
                </>
              ) : (
                <ContributorsTab contributors={stats.contributors} />
              )}
            </>
          )}

          {/* Empty State */}
          {!repoParams && !isLoading && (
            <div className="text-center py-12 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                <Code2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  No repository selected
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter a public GitHub repository URL above to view its stats
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
