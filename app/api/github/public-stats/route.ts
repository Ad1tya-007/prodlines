import { NextResponse } from 'next/server';
import { fetchGitHubStats } from '@/lib/github/stats';
import type { GitHubStats } from '@/lib/types/github';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner') || '';
    const repo = searchParams.get('repo') || '';
    const branch = searchParams.get('branch') || 'main';

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'owner and repo are required' },
        { status: 400 },
      );
    }

    // Use server's GitHub token for public repos
    const githubToken = process.env.GITHUB_TOKEN;

    if (!githubToken) {
      return NextResponse.json(
        { error: 'GitHub token is not configured on the server.' },
        { status: 500 },
      );
    }

    try {
      const stats = await fetchGitHubStats(owner, repo, branch, githubToken);
      return NextResponse.json(stats);
    } catch (error) {
      // Check if it's a 404 error (repo not found or private)
      if (error instanceof Error) {
        if (
          error.message.includes('404') ||
          error.message.includes('Not Found')
        ) {
          return NextResponse.json(
            {
              error:
                'Repository not found or is private. Please ensure the repository is public and the URL is correct.',
              code: 'REPO_NOT_FOUND_OR_PRIVATE',
            },
            { status: 404 },
          );
        }

        if (
          error.message.includes('403') ||
          error.message.includes('Forbidden')
        ) {
          return NextResponse.json(
            {
              error:
                'This repository is private. Only public repositories can be viewed without authentication.',
              code: 'PRIVATE_REPO',
            },
            { status: 403 },
          );
        }
      }

      throw error;
    }
  } catch (error) {
    console.error('Error fetching public GitHub stats:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch GitHub stats',
        code: 'FETCH_ERROR',
      },
      { status: 500 },
    );
  }
}
