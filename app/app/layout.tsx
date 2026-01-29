import React, { Suspense } from 'react';
import { AppShell } from '@/components/app-shell';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      }>
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
