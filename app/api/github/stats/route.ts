import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { fetchGitHubStats } from '@/lib/github/stats'
import { syncRepoForUser } from '@/lib/sync/sync-repo-for-user'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const owner = searchParams.get('owner') || ''
    const repo = searchParams.get('repo') || ''
    const branch = searchParams.get('branch') || 'main'
    const sync = searchParams.get('sync') === 'true'

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'owner and repo are required' },
        { status: 400 }
      )
    }

    const { data: cached, error } = await supabase
      .from('github_stats')
      .select('stats')
      .eq('user_id', user.id)
      .eq('owner', owner)
      .eq('repo', repo)
      .eq('branch', branch)
      .single()

    if (!sync && !error && cached?.stats) {
      return NextResponse.json(cached.stats)
    }

    const { data: { session } } = await supabase.auth.getSession()
    const providerToken = session?.provider_token
    const githubToken = providerToken || process.env.GITHUB_TOKEN

    if (!githubToken) {
      return NextResponse.json(
        { error: 'GitHub token is not available. Please reconnect your GitHub account or set GITHUB_TOKEN environment variable.' },
        { status: 400 }
      )
    }

    if (sync) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', user.id)
        .single()
      const recipientEmail = user.email ?? profile?.email ?? null
      const result = await syncRepoForUser(
        supabase,
        user.id,
        owner,
        repo,
        branch,
        githubToken,
        recipientEmail
      )
      if (!result.ok) {
        return NextResponse.json(
          { error: result.error ?? 'Sync failed' },
          { status: 500 }
        )
      }
      return NextResponse.json(result.stats!)
    }

    const stats = await fetchGitHubStats(owner, repo, branch, githubToken)
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching GitHub stats:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch GitHub stats' },
      { status: 500 }
    )
  }
}
