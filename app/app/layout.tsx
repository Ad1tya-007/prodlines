import React, { Suspense } from 'react';
import { AppShell } from '@/components/app-shell';
import { AuthProvider } from '@/lib/providers/auth-provider';
import { NotificationProvider } from '@/lib/providers/notification-provider';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      }>
      <AuthProvider>
        <NotificationProvider>
          <AppShell>{children}</AppShell>
        </NotificationProvider>
      </AuthProvider>
    </Suspense>
  );
}
