import { createClient } from './client'

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

// Client-side functions
export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient()
  
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

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  return getProfile(user.id)
}

export async function updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile | null> {
  const supabase = createClient()
  
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

export async function updateCurrentProfile(updates: ProfileUpdate): Promise<Profile | null> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  return updateProfile(user.id, updates)
}

// Get public profiles (for leaderboards, etc.)
export async function getPublicProfiles(): Promise<Profile[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('public_profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching public profiles:', error)
    return []
  }

  return data || []
}
