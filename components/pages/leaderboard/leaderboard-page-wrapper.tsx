'use client';

import { LeaderboardPage } from './leaderboard-page';
import { useGitHubStats } from '@/lib/hooks/use-github-stats';
import { useAppSelector } from '@/lib/store/hooks';
import {
  LeaderboardEmptyState,
  LeaderboardLoadingState,
  LeaderboardErrorState,
} from './leaderboard-states';

export function LeaderboardPageWrapper() {
  const selectedRepository = useAppSelector(
    (state) => state.repository.selectedRepository
  );

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
    { enabled: !!selectedRepository }
  );

  if (!selectedRepository) {
    return <LeaderboardEmptyState />;
  }

  if (isLoading) {
    return (
      <LeaderboardLoadingState
        repoInfo={{
          owner: selectedRepository.owner,
          name: selectedRepository.name,
          full_name: selectedRepository.full_name,
        }}
      />
    );
  }

  if (error) {
    return (
      <LeaderboardErrorState
        repoInfo={{
          owner: selectedRepository.owner,
          name: selectedRepository.name,
          full_name: selectedRepository.full_name,
        }}
        error={error as Error}
      />
    );
  }

  return (
    <LeaderboardPage
      stats={stats || null}
      repoInfo={selectedRepository}
      repoFullName={selectedRepository.full_name}
    />
  );
}
