import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface GitHubRepository {
  id: number
  name: string
  full_name: string
  owner: {
    login: string
    avatar_url: string
  }
  description: string | null
  private: boolean
  default_branch: string
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  pushed_at: string
}

async function fetchUserRepositories(githubToken: string): Promise<GitHubRepository[]> {
  const baseUrl = 'https://api.github.com'
  const headers = {
    'Authorization': `Bearer ${githubToken}`,
    'Accept': 'application/vnd.github.v3+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  const repositories: GitHubRepository[] = []
  let page = 1
  const perPage = 100

  // Fetch all repositories (including private ones if token has access)
  while (true) {
    const response = await fetch(
      `${baseUrl}/user/repos?per_page=${perPage}&page=${page}&sort=updated&direction=desc&affiliation=owner,collaborator`,
      { headers }
    )

    if (!response.ok) {
      if (response.status === 401) {
        const errorText = await response.text().catch(() => '')
        console.error('GitHub API 401 Error:', errorText)
        throw new Error(`Invalid or expired GitHub token. Status: ${response.status}. Please check your GITHUB_TOKEN environment variable and restart the dev server.`)
      }
      const errorText = await response.text().catch(() => '')
      console.error(`GitHub API Error (${response.status}):`, errorText)
      throw new Error(`Failed to fetch repositories: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.length === 0) {
      break
    }

    repositories.push(...data)
    
    // If we got fewer than perPage results, we've reached the end
    if (data.length < perPage) {
      break
    }

    page++
  }

  return repositories
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Try to get provider token from session (GitHub OAuth token)
    const { data: { session } } = await supabase.auth.getSession()
    const providerToken = session?.provider_token

    // Fallback to environment variable if provider token is not available
    const githubToken = providerToken || process.env.GITHUB_TOKEN

    if (!githubToken) {
      return NextResponse.json(
        { error: 'GitHub token is not available. Please reconnect your GitHub account or set GITHUB_TOKEN environment variable.' },
        { status: 400 }
      )
    }

    console.log('Using GitHub token:', providerToken ? 'provider_token from session' : 'GITHUB_TOKEN from env');

    const repositories = await fetchUserRepositories(githubToken)

    // Transform to a simpler format
    const formattedRepos = repositories.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      owner: repo.owner.login,
      ownerAvatar: repo.owner.avatar_url,
      description: repo.description,
      private: repo.private,
      defaultBranch: repo.default_branch,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      updatedAt: repo.updated_at,
      pushedAt: repo.pushed_at,
    }))

    return NextResponse.json({ repositories: formattedRepos })
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch GitHub repositories' },
      { status: 500 }
    )
  }
}
