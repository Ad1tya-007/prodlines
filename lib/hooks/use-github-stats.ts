import { useQuery } from '@tanstack/react-query';
import type { GitHubStats } from '@/lib/types/github';

interface GitHubStatsParams {
  owner: string;
  repo: string;
  branch?: string;
}

async function fetchGitHubStats({
  owner,
  repo,
  branch = 'main',
}: GitHubStatsParams): Promise<GitHubStats> {
  const params = new URLSearchParams({
    owner,
    repo,
    branch,
  });

  const response = await fetch(`/api/github/stats?${params}`);

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: 'Failed to fetch GitHub stats' }));
    throw new Error(errorData.error || 'Failed to fetch GitHub stats');
  }

  const data = await response.json();
  return data;
}

export function useGitHubStats(
  params: GitHubStatsParams,
  options?: {
    enabled?: boolean;
  },
) {
  return useQuery({
    queryKey: ['github-stats', params.owner, params.repo, params.branch],
    queryFn: () => fetchGitHubStats(params),
    staleTime: 3 * 60 * 1000, // 3 minutes
    enabled: options?.enabled ?? true,
  });
}
