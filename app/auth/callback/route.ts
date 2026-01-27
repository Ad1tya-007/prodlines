import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('redirectTo') || '/app/overview'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Get the user after session exchange
      const { data: { user } } = await supabase.auth.getUser()
      
      // Sync github_username from user metadata if user exists
      if (user) {
        try {
          await supabase.rpc('sync_github_username', { user_id: user.id })
        } catch (syncError) {
          // Log but don't fail the login if sync fails
          console.error('Failed to sync github_username:', syncError)
        }
      }
      
      return NextResponse.redirect(`${origin}${redirectTo}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
