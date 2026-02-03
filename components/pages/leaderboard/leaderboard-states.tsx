'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface RepoInfo {
  owner: string;
  name: string;
  full_name: string;
}

export function LeaderboardEmptyState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Leaderboard</h1>
        </div>
      </div>
      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-8 text-center space-y-4">
          <p className="text-muted-foreground">
            No repository selected. Please connect a repository first.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function LeaderboardLoadingState({ repoInfo }: { repoInfo: RepoInfo }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {repoInfo.owner || 'Loading'}/{repoInfo.name || '...'}
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

export function LeaderboardErrorState({
  repoInfo,
  error,
}: {
  repoInfo: RepoInfo;
  error: Error;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {repoInfo.owner || 'Error'}/{repoInfo.name || ''}
          </h1>
        </div>
      </div>
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="p-8 text-center space-y-4">
          <p className="text-destructive font-medium">
            Failed to load leaderboard data
          </p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <p className="text-xs text-muted-foreground">
            Repository: {repoInfo.full_name || 'Unknown'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
