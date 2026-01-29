'use client';

import { LeaderboardPage } from './leaderboard-page';
import { useGitHubStats } from '@/lib/hooks/use-github-stats';
import { useAppSelector } from '@/lib/store/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function LeaderboardPageWrapper() {
  // Get selected repository from Redux
  const selectedRepository = useAppSelector(
    (state) => state.repository.selectedRepository,
  );

  // Fetch GitHub stats using React Query
  const {
    data: stats,
    isLoading,
    error,
  } = useGitHubStats(
    {
      owner: selectedRepository?.owner || '',
      repo: selectedRepository?.name || '',
      branch: selectedRepository?.default_branch || 'main',
    },
    { enabled: !!selectedRepository },
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {selectedRepository?.owner || 'Loading'}/
              {selectedRepository?.name || '...'}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Loading leaderboard data...
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Fetching leaderboard data...
          </p>
          <p className="text-xs text-muted-foreground">
            This may take a few moments
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {selectedRepository?.owner || 'Error'}/
              {selectedRepository?.name || ''}
            </h1>
          </div>
        </div>
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-destructive font-medium">
              Failed to load leaderboard data
            </p>
            <p className="text-sm text-muted-foreground">
              {(error as Error).message}
            </p>
            <p className="text-xs text-muted-foreground">
              Repository: {selectedRepository?.full_name || 'Unknown'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show main content
  return (
    <LeaderboardPage
      stats={stats || null}
      repoInfo={selectedRepository}
      repoFullName={selectedRepository?.full_name || 'No repository selected'}
    />
  );
}
