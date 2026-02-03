'use client';

import { OverviewPage } from './overview-page';
import { useGitHubStats } from '@/lib/hooks/use-github-stats';
import { useAppSelector } from '@/lib/store/hooks';

export function OverviewPageWrapper() {
  // Get selected repository from Redux
  const selectedRepository = useAppSelector(
    (state) => state.repository.selectedRepository
  );

  // Fetch GitHub stats using React Query
  // IMPORTANT: Only fetch if we have a selected repository
  const {
    data: stats,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGitHubStats(
    {
      owner: selectedRepository?.owner || '',
      repo: selectedRepository?.name || '',
      branch: selectedRepository?.default_branch || 'main',
    },
    { enabled: !!selectedRepository }
  );

  return (
    <OverviewPage
      stats={selectedRepository ? stats || null : null}
      isLoading={selectedRepository ? isLoading : false}
      isFetching={selectedRepository ? isFetching : false}
      error={error ? (error as Error).message : null}
      repoOwner={selectedRepository?.owner || 'No repository'}
      repoName={selectedRepository?.name || 'selected'}
      onSync={selectedRepository ? () => refetch() : undefined}
    />
  );
}
