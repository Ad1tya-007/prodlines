import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET: Fetch user's saved repositories
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: repositories, error } = await supabase
      .from('repositories')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching repositories:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ repositories: repositories || [] })
  } catch (error) {
    console.error('Error in GET /api/repositories:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch repositories' },
      { status: 500 }
    )
  }
}

// POST: Save repositories to database
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { repositories } = body

    if (!repositories || !Array.isArray(repositories)) {
      return NextResponse.json(
        { error: 'repositories array is required' },
        { status: 400 }
      )
    }

    // Fetch user's GitHub repositories to get full details
    const { data: { session } } = await supabase.auth.getSession()
    const providerToken = session?.provider_token
    const githubToken = providerToken || process.env.GITHUB_TOKEN

    if (!githubToken) {
      return NextResponse.json(
        { error: 'GitHub token is not available' },
        { status: 400 }
      )
    }

    console.log('POST /api/repositories: Using GitHub token:', providerToken ? 'provider_token from session' : 'GITHUB_TOKEN from env');

    // Fetch repository details from GitHub API
    const githubRepos = await Promise.all(
      repositories.map(async (fullName: string) => {
        const [owner, repo] = fullName.split('/')
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch ${fullName}`)
        }

        return await response.json()
      })
    )

    // Prepare repository data for insertion
    const reposToInsert = githubRepos.map((repo) => ({
      user_id: user.id,
      github_repo_id: repo.id,
      full_name: repo.full_name,
      name: repo.name,
      owner: repo.owner.login,
      description: repo.description,
      private: repo.private,
      default_branch: repo.default_branch || 'main',
      language: repo.language,
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      is_active: true,
    }))

    // Use upsert to handle duplicates
    const { data: insertedRepos, error: insertError } = await supabase
      .from('repositories')
      .upsert(reposToInsert, {
        onConflict: 'user_id,github_repo_id',
        ignoreDuplicates: false,
      })
      .select()

    if (insertError) {
      console.error('Error inserting repositories:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ repositories: insertedRepos || [] })
  } catch (error) {
    console.error('Error in POST /api/repositories:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save repositories' },
      { status: 500 }
    )
  }
}

// DELETE: Remove a repository
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const repoId = searchParams.get('id')

    if (!repoId) {
      return NextResponse.json({ error: 'Repository ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('repositories')
      .delete()
      .eq('id', repoId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting repository:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/repositories:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete repository' },
      { status: 500 }
    )
  }
}
