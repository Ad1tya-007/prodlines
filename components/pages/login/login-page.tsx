'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BarChart3 } from 'lucide-react';
import { LoginForm } from './login-form';

export function LoginPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/app/overview';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center group-hover:rounded-none transition-all duration-200">
              <BarChart3 className="w-6 h-6 text-background" />
            </div>
            <span className="text-xl font-semibold">ProdLines</span>
          </Link>
        </div>

        <LoginForm redirectTo={redirectTo} />

        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our{' '}
          <Link href="#" className="hover:text-foreground underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="hover:text-foreground underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
