import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { fetchGitHubStats } from '@/lib/github/stats'

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

    const { searchParams } = new URL(request.url)
    const owner = searchParams.get('owner') || 'vercel'
    const repo = searchParams.get('repo') || 'next.js'
    const branch = searchParams.get('branch') || 'main'

    const stats = await fetchGitHubStats(owner, repo, branch, githubToken as string)

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching GitHub stats:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch GitHub stats' },
      { status: 500 }
    )
  }
}
