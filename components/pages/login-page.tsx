"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Github, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function LoginPage() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/app/overview'
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleGithubLogin = async () => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
        scopes: 'read:user user:email repo', // Request repo scope for repository access
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center group-hover:rounded-none transition-all duration-200">
              <BarChart3 className="w-6 h-6 text-background" />
            </div>
            <span className="text-xl font-semibold">ProdLines</span>
          </Link>
        </div>

        {/* Login Card */}
        <Card className="hover-card bg-card/50 border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            {/* GitHub Login */}
            <Button
              className="w-full hover-button"
              onClick={handleGithubLogin}
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Github className="h-5 w-5 mr-2" />
                  Continue with GitHub
                </>
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground pt-4">
              New to ProdLines? Click the button above to sign in with GitHub.
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link href="#" className="hover:text-foreground underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="hover:text-foreground underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
