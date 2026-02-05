import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { GitHubStats } from '@/lib/types/github';

interface GitHubStatsParams {
  owner: string;
  repo: string;
  branch?: string;
}

export const githubStatsQueryKey = (params: {
  owner: string;
  repo: string;
  branch?: string;
}) => ['github-stats', params.owner, params.repo, params.branch ?? 'main'] as const;

async function fetchGitHubStats(
  params: GitHubStatsParams,
  sync: boolean
): Promise<GitHubStats | null> {
  const { owner, repo, branch = 'main' } = params;
  const searchParams = new URLSearchParams({
    owner,
    repo,
    branch,
    ...(sync && { sync: 'true' }),
  });

  const response = await fetch(`/api/github/stats?${searchParams}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: 'Failed to fetch GitHub stats' }));
    throw new Error(errorData.error || 'Failed to fetch GitHub stats');
  }

  return response.json();
}

export function useGitHubStats(
  params: GitHubStatsParams,
  options?: {
    enabled?: boolean;
    sync?: boolean;
  }
) {
  const sync = options?.sync ?? false;
  return useQuery({
    queryKey: githubStatsQueryKey(params),
    queryFn: () => fetchGitHubStats(params, sync),
    staleTime: 3 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
}

export function useSyncGitHubStats(params: GitHubStatsParams) {
  const queryClient = useQueryClient();
  const fullParams = { ...params, branch: params.branch ?? 'main' };

  return useMutation({
    mutationFn: async () => {
      const result = await fetchGitHubStats(fullParams, true);
      if (!result) throw new Error('Failed to sync GitHub stats');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: githubStatsQueryKey(fullParams),
      });
    },
  });
}
