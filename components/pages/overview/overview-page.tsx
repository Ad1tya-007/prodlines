'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Code2, Users, Clock, GitBranch, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GitHubStats, KPICard as KPICardType } from '@/lib/types/github';
import { KPICard, KPICardSkeleton } from './kpi-card';
import { OverviewLeaderboard } from './overview-leaderboard';
import { OverviewEmptyState } from './overview-empty-state';
import { OverviewErrorState, OverviewLoadingState } from './overview-states';
import { toast } from 'sonner';

const resultHasError = (result: unknown): result is { error?: unknown } =>
  typeof result === 'object' && result !== null && 'error' in result;

interface OverviewPageProps {
  stats: GitHubStats | null;
  isLoading?: boolean;
  isFetching?: boolean;
  error?: string | null;
  repoOwner?: string;
  repoName?: string;
  onSync?: () => Promise<unknown>;
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

export function OverviewPage({
  stats,
  isLoading: externalLoading = false,
  isFetching = false,
  error,
  repoOwner,
  repoName,
  onSync,
}: OverviewPageProps) {
  const [lastSyncFormatted, setLastSyncFormatted] =
    useState<string>('Just now');

  useEffect(() => {
    if (stats?.lastSync) {
      setLastSyncFormatted(formatLastSync(stats.lastSync));
      const interval = setInterval(() => {
        setLastSyncFormatted(formatLastSync(stats.lastSync));
      }, 60000);
      return () => clearInterval(interval);
    } else {
      setLastSyncFormatted('Never');
    }
  }, [stats?.lastSync]);

  const kpiCards: KPICardType[] = stats
    ? [
        {
          title: 'Production LOC',
          value: stats.productionLOC.toLocaleString(),
          description: 'Lines in production',
          icon: Code2,
          trend: stats.productionLOCTrend?.value ?? null,
          trendUp: stats.productionLOCTrend?.up ?? null,
        },
        {
          title: 'Active Contributors',
          value: stats.activeContributors.toString(),
          description: 'This month',
          icon: Users,
          trend: stats.activeContributorsTrend?.value ?? null,
          trendUp: stats.activeContributorsTrend?.up ?? null,
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
          value: lastSyncFormatted,
          description: 'Auto-sync enabled',
          icon: Clock,
          trend: null,
          trendUp: null,
        },
      ]
    : [];

  const isInitialLoading = externalLoading && !stats;
  const isSyncing = !!stats && isFetching;
  const buttonLoading = isInitialLoading || isSyncing;
  const displayStats = stats && !error && stats.contributors.length > 0;

  const handleSync = async () => {
    if (!onSync) return;

    try {
      const result = await onSync();
      if (resultHasError(result) && result.error) {
        throw result.error;
      }
      toast.success('Repository synced successfully!');
    } catch (syncError) {
      const message =
        syncError instanceof Error
          ? syncError.message
          : 'Failed to sync repository';
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-muted-foreground">
            Production code ownership for {repoOwner}/{repoName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hover-button hidden sm:flex bg-transparent"
            onClick={handleSync}
            disabled={!onSync || buttonLoading}>
            <RefreshCw
              className={cn('h-4 w-4 mr-2', buttonLoading && 'animate-spin')}
            />
            {buttonLoading ? 'Syncing...' : 'Sync'}
          </Button>
          {isSyncing && (
            <span className="hidden sm:inline text-xs text-muted-foreground">
              Refreshing latest stats...
            </span>
          )}
        </div>
      </div>

      {error && <OverviewErrorState error={error} />}

      {isInitialLoading && <OverviewLoadingState />}

      {!stats && !isInitialLoading ? (
        <OverviewEmptyState />
      ) : displayStats ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isInitialLoading
              ? [...Array(4)].map((_, i) => <KPICardSkeleton key={i} />)
              : kpiCards.map((card, index) => (
                  <KPICard key={card.title} card={card} index={index} />
                ))}
          </div>

          <OverviewLeaderboard
            contributors={stats.contributors}
            isLoading={isInitialLoading}
          />
        </>
      ) : null}
    </div>
  );
}
