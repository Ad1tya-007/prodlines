import { useQuery } from '@tanstack/react-query';
import type { GitHubStats } from '@/lib/types/github';

interface PublicGitHubStatsParams {
  owner: string;
  repo: string;
  branch?: string;
}

export const publicGithubStatsQueryKey = (params: {
  owner: string;
  repo: string;
  branch?: string;
}) =>
  [
    'public-github-stats',
    params.owner,
    params.repo,
    params.branch ?? 'main',
  ] as const;

async function fetchPublicGitHubStats(
  params: PublicGitHubStatsParams,
): Promise<GitHubStats> {
  const { owner, repo, branch = 'main' } = params;
  const searchParams = new URLSearchParams({
    owner,
    repo,
    branch,
  });

  const response = await fetch(`/api/github/public-stats?${searchParams}`);

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: 'Failed to fetch GitHub stats' }));
    const error = new Error(
      errorData.error || 'Failed to fetch GitHub stats',
    ) as Error & { code?: string };
    error.code = errorData.code;
    throw error;
  }

  return response.json();
}

export function usePublicGitHubStats(
  params: PublicGitHubStatsParams,
  options?: {
    enabled?: boolean;
  },
) {
  return useQuery({
    queryKey: publicGithubStatsQueryKey(params),
    queryFn: () => fetchPublicGitHubStats(params),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    enabled: options?.enabled ?? true,
    retry: (failureCount, error) => {
      // Don't retry on 404 or 403 errors (private repos)
      if (error instanceof Error && 'code' in error) {
        const errorCode = (error as Error & { code?: string }).code;
        if (
          errorCode === 'REPO_NOT_FOUND_OR_PRIVATE' ||
          errorCode === 'PRIVATE_REPO'
        ) {
          return false;
        }
      }
      return failureCount < 2;
    },
  });
}
