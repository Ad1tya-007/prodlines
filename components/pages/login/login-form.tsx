'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Github, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const loginSchema = z.object({
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message:
      'You must agree to the Terms of Service and Privacy Policy to continue',
  }),
});

type LoginValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo = '/app/overview' }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      agreeToTerms: false,
    },
  });

  const supabase = createClient();

  async function onSubmit(_data: LoginValues) {
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0.5"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <span className="text-sm text-muted-foreground">
                      I agree to the{' '}
                      <a
                        href="#"
                        className="text-foreground underline hover:no-underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a
                        href="#"
                        className="text-foreground underline hover:no-underline">
                        Privacy Policy
                      </a>
                    </span>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

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
        </Form>
      </CardContent>
    </Card>
  );
}
