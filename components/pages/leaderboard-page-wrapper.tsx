'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { LeaderboardPage } from './leaderboard-page';
import { useGitHubStats } from '@/lib/hooks/use-github-stats';
import { useSavedRepositories } from '@/lib/hooks/use-repositories';

interface LeaderboardPageWrapperProps {
  repoId: string;
}

export function LeaderboardPageWrapper({
  repoId,
}: LeaderboardPageWrapperProps) {
  const searchParams = useSearchParams();
  const repoParam = searchParams.get('repo');

  // Decode URL-encoded repoId
  const decodedRepoId = decodeURIComponent(repoId);
  const repoFullName = repoParam || decodedRepoId;

  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [branch, setBranch] = useState('main');

  // Fetch saved repositories to get repo info
  const { data: savedRepos = [] } = useSavedRepositories();

  // Parse owner/repo and find branch
  useEffect(() => {
    const [repoOwner, repoName] = repoFullName.split('/');
    if (repoOwner && repoName) {
      setOwner(repoOwner);
      setRepo(repoName);

      // Find branch from saved repos
      const savedRepo = savedRepos.find((r) => r.full_name === repoFullName);
      if (savedRepo?.default_branch) {
        setBranch(savedRepo.default_branch);
      }
    }
  }, [repoFullName, savedRepos]);

  // Fetch GitHub stats using React Query
  const {
    data: stats,
    isLoading,
    error,
  } = useGitHubStats({ owner, repo, branch }, { enabled: !!owner && !!repo });

  // Get repo info from saved repos
  const repoInfo = savedRepos.find((r) => r.full_name === repoFullName) || null;

  return (
    <LeaderboardPage
      stats={stats || null}
      repoInfo={repoInfo}
      repoFullName={repoFullName}
    />
  );
}
