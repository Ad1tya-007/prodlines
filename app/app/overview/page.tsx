import { OverviewPage } from "@/components/pages/overview-page"
import { createClient } from '@/lib/supabase/server'
import { fetchGitHubStats } from '@/lib/github/stats'
import type { GitHubStats } from '@/lib/types/github'

async function getGitHubStats(repoParam?: string | null): Promise<GitHubStats | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    let owner = 'vercel'
    let repo = 'next.js'
    let branch = 'main'

    if (repoParam) {
      // Parse repo from query param (format: owner/repo)
      const [repoOwner, repoName] = repoParam.split('/')
      if (repoOwner && repoName) {
        owner = repoOwner
        repo = repoName
        
        // Fetch branch from database
        const { data: repoData } = await supabase
          .from('repositories')
          .select('default_branch')
          .eq('user_id', user.id)
          .eq('full_name', repoParam)
          .single()
        
        if (repoData?.default_branch) {
          branch = repoData.default_branch
        }
      }
    } else {
      // Fetch user's first active repository
      const { data: repositories } = await supabase
        .from('repositories')
        .select('owner, name, default_branch')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (repositories) {
        owner = repositories.owner
        repo = repositories.name
        branch = repositories.default_branch || 'main'
      }
    }

    // Get GitHub token
    const { data: { session } } = await supabase.auth.getSession()
    const providerToken = session?.provider_token
    const githubToken = providerToken || process.env.GITHUB_TOKEN

    if (!githubToken) {
      console.error('GitHub token is not available')
      return null
    }

    // Fetch stats directly using the shared utility function
    const stats = await fetchGitHubStats(owner, repo, branch, githubToken)
    return stats
  } catch (error) {
    console.error('Error fetching GitHub stats:', error)
    return null
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ repo?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const repoParam = resolvedSearchParams?.repo || null
  const stats = await getGitHubStats(repoParam)
  const isLoading = false
  const error = stats ? null : 'Failed to load GitHub stats. Please ensure your GitHub account is connected.'

  // Parse repo info for display
  let repoOwner = 'vercel'
  let repoName = 'next.js'
  
  if (repoParam) {
    const [owner, name] = repoParam.split('/')
    if (owner && name) {
      repoOwner = owner
      repoName = name
    }
  }

  return (
    <OverviewPage 
      stats={stats}
      isLoading={isLoading}
      error={error}
      repoOwner={repoOwner}
      repoName={repoName}
    />
  )
}
