import { createClient } from './server'

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  github_username: string | null
  created_at: string
  updated_at: string
}

export interface ProfileUpdate {
  full_name?: string
  avatar_url?: string
  github_username?: string
}

// Server-side functions
export async function getProfileServer(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

export async function getCurrentProfileServer(): Promise<Profile | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  return getProfileServer(user.id)
}

export async function updateProfileServer(userId: string, updates: ProfileUpdate): Promise<Profile | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return null
  }

  return data
}
