import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function handleLogout(request: Request) {
  console.log('Logout route called:', request.method, request.url)
  
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Server signOut error:', error)
  } else {
    console.log('Server signOut successful')
  }
  
  // Create redirect response
  const url = new URL('/login', request.url)
  const response = NextResponse.redirect(url)
  
  // Clear Supabase auth cookies
  // Supabase uses cookies with pattern: sb-<project-ref>-auth-token
  const cookies = request.headers.get('cookie') || ''
  const cookiePattern = /sb-[^-]+-auth-token/g
  const matches = cookies.match(cookiePattern)
  
  if (matches) {
    matches.forEach(cookieName => {
      response.cookies.delete(cookieName)
      response.cookies.set(cookieName, '', { 
        maxAge: 0, 
        path: '/',
        expires: new Date(0)
      })
    })
  }
  
  // Also clear common cookie names
  const commonCookieNames = [
    'sb-access-token',
    'sb-refresh-token',
    'supabase-auth-token',
  ]
  
  commonCookieNames.forEach(name => {
    response.cookies.delete(name)
    response.cookies.set(name, '', { 
      maxAge: 0, 
      path: '/',
      expires: new Date(0)
    })
  })
  
  return response
}

export async function POST(request: Request) {
  return handleLogout(request)
}

export async function GET(request: Request) {
  return handleLogout(request)
}
