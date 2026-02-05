'use client';

import { OverviewPage } from './overview-page';
import {
  useGitHubStats,
  useSyncGitHubStats,
} from '@/lib/hooks/use-github-stats';
import { useAppSelector } from '@/lib/store/hooks';

export function OverviewPageWrapper() {
  const selectedRepository = useAppSelector(
    (state) => state.repository.selectedRepository
  );

  const params = {
    owner: selectedRepository?.owner || '',
    repo: selectedRepository?.name || '',
    branch: selectedRepository?.default_branch || 'main',
  };

  const { data: stats, isLoading, isFetching, error } = useGitHubStats(
    params,
    { enabled: !!selectedRepository, sync: false }
  );

  const syncMutation = useSyncGitHubStats(params);

  return (
    <OverviewPage
      stats={selectedRepository ? stats ?? null : null}
      isLoading={selectedRepository ? isLoading : false}
      isFetching={selectedRepository ? isFetching || syncMutation.isPending : false}
      error={error ? (error as Error).message : null}
      repoOwner={selectedRepository?.owner || 'No repository'}
      repoName={selectedRepository?.name || 'selected'}
      onSync={
        selectedRepository
          ? () => syncMutation.mutateAsync()
          : undefined
      }
    />
  );
}
