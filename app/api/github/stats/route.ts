import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { fetchGitHubStats } from '@/lib/github/stats'
import { sendStatsSyncedEmail } from '@/lib/email'
import { sendDiscordWebhook } from '@/lib/discord'
import { sendSlackWebhook } from '@/lib/slack'
import type { GitHubStats, GitHubStatsTrend } from '@/lib/types/github'
import type { SupabaseClient } from '@supabase/supabase-js'

async function getStatsWithTrends(
  supabase: SupabaseClient,
  userId: string,
  owner: string,
  repo: string,
  branch: string,
  stats: GitHubStats
): Promise<GitHubStats> {
  const { data: snapshots } = await supabase
    .from('github_stats_snapshots')
    .select('production_loc, active_contributors')
    .eq('user_id', userId)
    .eq('owner', owner)
    .eq('repo', repo)
    .eq('branch', branch)
    .order('created_at', { ascending: false })
    .limit(2)

  if (!snapshots || snapshots.length < 2) {
    return stats
  }

  const [curr, prev] = snapshots
  const productionLOCTrend = formatProductionLOCTrend(
    curr.production_loc,
    prev.production_loc
  )
  const activeContributorsTrend = formatActiveContributorsTrend(
    curr.active_contributors,
    prev.active_contributors
  )

  return {
    ...stats,
    productionLOCTrend: productionLOCTrend ?? undefined,
    activeContributorsTrend: activeContributorsTrend ?? undefined,
  }
}

function formatProductionLOCTrend(
  current: number,
  previous: number
): GitHubStatsTrend | null {
  if (previous === 0) return null
  const changePercent = ((current - previous) / previous) * 100
  const up = changePercent >= 0
  const sign = changePercent >= 0 ? '+' : ''
  return {
    value: `${sign}${changePercent.toFixed(1)}%`,
    up,
  }
}

function formatActiveContributorsTrend(
  current: number,
  previous: number
): GitHubStatsTrend | null {
  const delta = current - previous
  if (delta === 0) return null
  const up = delta > 0
  const sign = delta > 0 ? '+' : ''
  return {
    value: `${sign}${delta}`,
    up,
  }
}

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
      const statsWithTrends = await getStatsWithTrends(
        supabase,
        user.id,
        owner,
        repo,
        branch,
        cached.stats as GitHubStats
      )
      return NextResponse.json(statsWithTrends)
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

    const stats = await fetchGitHubStats(owner, repo, branch, githubToken)

    const mergedPrsCount = stats.contributors.reduce(
      (sum, c) => sum + c.recentMergedPrs,
      0
    )

    await supabase.from('github_stats_snapshots').insert({
      user_id: user.id,
      owner,
      repo,
      branch,
      production_loc: stats.productionLOC,
      active_contributors: stats.activeContributors,
      merged_prs_count: mergedPrsCount,
    })

    const { error: upsertError } = await supabase
      .from('github_stats')
      .upsert(
        {
          user_id: user.id,
          owner,
          repo,
          branch,
          stats,
          last_synced_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,owner,repo,branch',
          ignoreDuplicates: false,
        }
      )

    if (upsertError) {
      console.error('Error saving github_stats:', upsertError)
    } else {
      const fullName = `${owner}/${repo}`
      const message = `Stats synced for ${fullName}`
      await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'github_stats_synced',
        message,
        metadata: { owner, repo, branch },
        seen: false,
      })

      const { data: userSettings } = await supabase
        .from('user_settings')
        .select('email_notifications, slack_notifications, slack_webhook_url, discord_notifications, discord_webhook_url')
        .eq('id', user.id)
        .single()

      if (userSettings?.slack_notifications && userSettings?.slack_webhook_url) {
        await sendSlackWebhook(
          userSettings.slack_webhook_url,
          `📊 *Stats synced*\nYour GitHub stats have been synced for *${fullName}*.\nView your updated leaderboard in ProdLines.`
        )
      }

      if (userSettings?.email_notifications) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', user.id)
          .single()
        const recipientEmail = user.email ?? profile?.email ?? null
        if (recipientEmail) {
          await sendStatsSyncedEmail(recipientEmail, fullName)
        }
      }

      if (
        userSettings?.discord_notifications &&
        userSettings?.discord_webhook_url
      ) {
        await sendDiscordWebhook(
          userSettings.discord_webhook_url,
          `📊 **Stats synced**\nYour GitHub stats have been synced for **${fullName}**.\nView your updated leaderboard in ProdLines.`
        )
      }
    }

    const statsWithTrends = await getStatsWithTrends(
      supabase,
      user.id,
      owner,
      repo,
      branch,
      stats
    )
    return NextResponse.json(statsWithTrends)
  } catch (error) {
    console.error('Error fetching GitHub stats:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch GitHub stats' },
      { status: 500 }
    )
  }
}
