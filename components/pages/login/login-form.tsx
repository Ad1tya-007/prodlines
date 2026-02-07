'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Github, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo = '/app/overview' }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  async function onSubmit() {
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${
          window.location.origin
        }/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
        scopes: 'read:user user:email repo',
      },
    });

    if (authError) {
      setError(authError.message);
    }
    setLoading(false);
  }

  return (
    <Card className="hover-card bg-card/50 border-border/50">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full hover-button"
            disabled={loading}
            size="lg">
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
        </form>
      </CardContent>
    </Card>
  );
}
