'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { getCurrentProfile, type Profile } from '@/lib/supabase/profiles-client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user);
      if (user) {
        const userProfile = await getCurrentProfile();
        setProfile(userProfile);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const userProfile = await getCurrentProfile();
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      </div>
      <TopBar
        sidebarCollapsed={sidebarCollapsed}
        user={user}
        profile={profile}
      />
      <main
        className={cn(
          'pt-16 transition-all duration-200',
          sidebarCollapsed ? 'md:pl-16' : 'md:pl-56',
        )}>
        <div className="p-4 md:p-6 lg:p-8 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
