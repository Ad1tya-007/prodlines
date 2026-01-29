'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { OverviewPage } from './overview-page';
import { useGitHubStats } from '@/lib/hooks/use-github-stats';
import { useSavedRepositories } from '@/lib/hooks/use-repositories';

export function OverviewPageWrapper() {
  const searchParams = useSearchParams();
  const repoParam = searchParams.get('repo');

  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [branch, setBranch] = useState('');

  // Fetch saved repositories to determine which repo to show
  const { data: savedRepos = [] } = useSavedRepositories();

  // Update owner/repo/branch based on URL param or first saved repo
  useEffect(() => {
    if (repoParam) {
      const [repoOwner, repoName] = repoParam.split('/');
      if (repoOwner && repoName) {
        setOwner(repoOwner);
        setRepo(repoName);

        // Find branch from saved repos
        const savedRepo = savedRepos.find((r) => r.full_name === repoParam);
        if (savedRepo?.default_branch) {
          setBranch(savedRepo.default_branch);
        }
      }
    } else if (savedRepos.length > 0) {
      // Use first saved repo
      const firstRepo = savedRepos[0];
      setOwner(firstRepo.owner);
      setRepo(firstRepo.name);
      setBranch(firstRepo.default_branch || 'main');
    }
  }, [repoParam, savedRepos]);

  // Fetch GitHub stats using React Query
  const {
    data: stats,
    isLoading,
    error,
  } = useGitHubStats({ owner, repo, branch }, { enabled: !!owner && !!repo });

  return (
    <OverviewPage
      stats={stats || null}
      isLoading={isLoading}
      error={error ? (error as Error).message : null}
      repoOwner={owner}
      repoName={repo}
    />
  );
}
