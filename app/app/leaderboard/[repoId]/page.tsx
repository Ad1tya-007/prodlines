import { Suspense } from 'react';
import { LeaderboardPage } from '@/components/pages/leaderboard-page';
import Loading from './loading';
import { createClient } from '@/lib/supabase/server';
import { fetchGitHubStats } from '@/lib/github/stats';
import type { GitHubStats } from '@/lib/types/github';

async function getGitHubStats(
  repoFullName: string,
): Promise<GitHubStats | null> {
  try {
    console.log('getGitHubStats called with repoFullName:', repoFullName);

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('getGitHubStats: No user found');
      return null;
    }

    // Parse repo from full name (format: owner/repo)
    const [owner, repo] = repoFullName.split('/');
    if (!owner || !repo) {
      console.error('getGitHubStats: Invalid repo format:', repoFullName);
      return null;
    }

    console.log('getGitHubStats: Parsed owner:', owner, 'repo:', repo);

    // Fetch repository info from database to get branch
    const { data: repoData, error: repoError } = await supabase
      .from('repositories')
      .select('default_branch')
      .eq('user_id', user.id)
      .eq('full_name', repoFullName)
      .single();

    if (repoError) {
      console.log(
        'getGitHubStats: Repository not found in DB, using default branch. Error:',
        repoError.message,
      );
    }

    const branch = repoData?.default_branch || 'main';
    console.log('getGitHubStats: Using branch:', branch);

    // Get GitHub token
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const providerToken = session?.provider_token;
    const githubToken = providerToken || process.env.GITHUB_TOKEN;

    if (!githubToken) {
      console.error('getGitHubStats: GitHub token is not available');
      return null;
    }

    console.log('getGitHubStats: Calling fetchGitHubStats with:', {
      owner,
      repo,
      branch,
    });

    // Fetch stats directly using the shared utility function
    const stats = await fetchGitHubStats(owner, repo, branch, githubToken);
    console.log(
      'getGitHubStats: Stats fetched successfully, contributors:',
      stats.contributors.length,
    );
    return stats;
  } catch (error) {
    console.error('getGitHubStats: Error fetching GitHub stats:', error);
    if (error instanceof Error) {
      console.error('getGitHubStats: Error message:', error.message);
      console.error('getGitHubStats: Error stack:', error.stack);
    }
    return null;
  }
}

async function fetchRepositoryInfo(repoId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    // Try to find repository by ID or full_name
    const { data: repo } = await supabase
      .from('repositories')
      .select('*')
      .eq('user_id', user.id)
      .or(`id.eq.${repoId},full_name.eq.${repoId}`)
      .single();

    return repo;
  } catch (error) {
    console.error('Error fetching repository info:', error);
    return null;
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ repoId: string }>;
  searchParams?: Promise<{ repo?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // Try to get repo from searchParams first, then from params
  // Decode URL-encoded repoId (e.g., "Ad1tya-007%2Forbiton-developer-test" -> "Ad1tya-007/orbiton-developer-test")
  const rawRepoParam = resolvedSearchParams?.repo || resolvedParams.repoId;
  const repoParam = decodeURIComponent(rawRepoParam);

  // Try to fetch repository info from database
  const repoInfo = await fetchRepositoryInfo(repoParam);

  // Use repoInfo.full_name if available, otherwise use repoParam directly
  const repoFullName = repoInfo?.full_name || repoParam;

  const stats = await getGitHubStats(repoFullName);

  return (
    <Suspense fallback={<Loading />}>
      <LeaderboardPage
        stats={stats}
        repoInfo={repoInfo}
        repoFullName={repoFullName}
      />
    </Suspense>
  );
}
