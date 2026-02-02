import { Suspense } from 'react';
import { LoginPage } from '@/components/pages/login/login-page';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          Loading...
        </div>
      }>
      <LoginPage />
    </Suspense>
  );
}
