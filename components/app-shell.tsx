'use client';

import React from 'react';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  BarChart3,
  LayoutDashboard,
  GitBranch,
  Trophy,
  Settings,
  Search,
  RefreshCw,
  ChevronLeft,
  Menu,
  LogOut,
  User,
  Bell,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import {
  getCurrentProfile,
  type Profile,
} from '@/lib/supabase/profiles-client';

function Sidebar({
  collapsed,
  setCollapsed,
  currentRepo,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  currentRepo?: string;
}) {
  const pathname = usePathname();
  
  // Build nav items with dynamic leaderboard link
  const navItems = [
    { id: 'overview', href: '/app/overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'repos', href: '/app/repos', icon: GitBranch, label: 'Repos' },
    { 
      id: 'leaderboards',
      href: currentRepo ? `/app/leaderboard/${encodeURIComponent(currentRepo)}` : '/app/repos', 
      icon: Trophy, 
      label: 'Leaderboards' 
    },
    { id: 'settings', href: '/app/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-200 ease-out',
          collapsed ? 'w-16' : 'w-56',
        )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div
            className={cn(
              'flex items-center h-16 border-b border-sidebar-border px-4',
              collapsed ? 'justify-center' : 'justify-between',
            )}>
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center group-hover:rounded-none transition-all duration-200">
                <BarChart3 className="w-5 h-5 text-background" />
              </div>
              {!collapsed && <span className="font-semibold">ProdLines</span>}
            </Link>
            {!collapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover-button"
                onClick={() => setCollapsed(true)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + '/');
              return collapsed ? (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-200 hover:rounded-none mx-auto',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                      )}>
                      <item.icon className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 h-10 rounded-xl transition-all duration-200 hover:rounded-none group',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  )}>
                  <item.icon className="h-5 w-5 icon-hover" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Collapse toggle (when collapsed) */}
          {collapsed && (
            <div className="p-3 border-t border-sidebar-border">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 mx-auto hover-button"
                    onClick={() => setCollapsed(false)}>
                    <ChevronLeft className="h-4 w-4 rotate-180" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Expand sidebar</TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}

function MobileNav({ currentRepo }: { currentRepo?: string }) {
  const pathname = usePathname();
  
  // Build nav items with dynamic leaderboard link
  const navItems = [
    { id: 'overview', href: '/app/overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'repos', href: '/app/repos', icon: GitBranch, label: 'Repos' },
    { 
      id: 'leaderboards',
      href: currentRepo ? `/app/leaderboard/${encodeURIComponent(currentRepo)}` : '/app/repos', 
      icon: Trophy, 
      label: 'Leaderboards' 
    },
    { id: 'settings', href: '/app/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden hover-button">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-sidebar p-0">
        <div className="flex items-center h-16 border-b border-sidebar-border px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-background" />
            </div>
            <span className="font-semibold">ProdLines</span>
          </Link>
        </div>
        <nav className="py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 h-10 rounded-xl transition-all duration-200 hover:rounded-none',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )}>
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function TopBar({
  sidebarCollapsed,
  user,
  profile,
  currentRepo,
}: {
  sidebarCollapsed: boolean;
  user: SupabaseUser | null;
  profile: Profile | null;
  currentRepo?: string;
}) {
  const [syncing, setSyncing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [repositories, setRepositories] = useState<Array<{ id: string; full_name: string; owner: string; name: string }>>([]);
  const [reposLoading, setReposLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Fetch user's repositories
  useEffect(() => {
    async function fetchRepositories() {
      try {
        const response = await fetch('/api/repositories');
        if (response.ok) {
          const data = await response.json();
          setRepositories(data.repositories || []);
        }
      } catch (error) {
        console.error('Error fetching repositories:', error);
      } finally {
        setReposLoading(false);
      }
    }
    fetchRepositories();
  }, []);

  // Get current repo from URL
  const getCurrentRepo = () => {
    if (pathname === '/app/overview') {
      const repoParam = searchParams.get('repo');
      if (repoParam) {
        return repoParam;
      }
    }
    // Return first repo as default if available
    return repositories.length > 0 ? repositories[0].full_name : '';
  };

  const handleRepoChange = (fullName: string) => {
    router.push(`/app/overview?repo=${encodeURIComponent(fullName)}`);
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  const handleSignOut = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setLoggingOut(true);

    try {
      // Sign out on client side first
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Client signOut error:', error);
      }
    } catch (error) {
      console.error('Client signOut error:', error);
    }

    // Call server-side logout route
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        credentials: 'include',
      });

      // Wait a moment for cookies to be cleared
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Logout route error:', error);
    }

    // Always redirect to login after logout attempt
    window.location.replace('/login');
  };

  const getUserInitials = () => {
    const name = profile?.full_name || user?.user_metadata?.full_name;
    if (name) {
      const names = name.split(' ');
      return names.length > 1
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0].slice(0, 2).toUpperCase();
    }
    const email = profile?.email || user?.email;
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getUserName = () => {
    return profile?.github_username || profile?.full_name || 'User';
  };

  const getUserEmail = () => {
    return profile?.email || user?.email || '';
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 bg-background/80 backdrop-blur-sm border-b border-border transition-all duration-200',
        sidebarCollapsed ? 'left-0 md:left-16' : 'left-0 md:left-56',
      )}>
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <div className="flex items-center gap-4">
          <MobileNav currentRepo={currentRepo} />

          {/* Repo selector */}
          {reposLoading ? (
            <div className="w-48 md:w-56 h-10 bg-secondary/50 border border-border/50 rounded-md animate-pulse" />
          ) : repositories.length > 0 ? (
            <Select value={getCurrentRepo()} onValueChange={handleRepoChange}>
              <SelectTrigger className="w-48 md:w-56 hover-button bg-secondary/50 border-border/50">
                <SelectValue placeholder="Select repository" />
              </SelectTrigger>
              <SelectContent>
                {repositories.map((repo) => (
                  <SelectItem key={repo.id} value={repo.full_name}>
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <span>{repo.full_name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="hover-button bg-transparent">
              <Link href="/app/repos">
                <GitBranch className="h-4 w-4 mr-2" />
                Connect Repository
              </Link>
            </Button>
          )}

          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contributors, files..."
              className="w-64 pl-9 bg-secondary/50 border-border/50 focus:bg-secondary"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sync button */}
          <Button
            variant="outline"
            size="sm"
            className="hover-button hidden sm:flex bg-transparent"
            onClick={handleSync}
            disabled={syncing}>
            <RefreshCw
              className={cn('h-4 w-4 mr-2', syncing && 'animate-spin')}
            />
            {syncing ? 'Syncing...' : 'Sync'}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="hover-button relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="hover-button p-0"
                disabled={loggingOut}>
                <Avatar className="h-8 w-8">
                  {profile?.avatar_url && (
                    <AvatarImage src={profile?.avatar_url as string} />
                  )}
                  <AvatarFallback className="bg-secondary text-foreground text-sm">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{getUserName()}</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    {getUserEmail()}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/app/settings">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/app/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onSelect={(e) => {
                  e.preventDefault();
                  handleSignOut(e as any);
                }}
                disabled={loggingOut}>
                {loggingOut ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing out...
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentRepo, setCurrentRepo] = useState<string>('');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Get current repository from URL or fetch first repo
  useEffect(() => {
    async function getCurrentRepository() {
      // Check if we're on overview page with repo param
      if (pathname === '/app/overview') {
        const repoParam = searchParams.get('repo');
        if (repoParam) {
          setCurrentRepo(repoParam);
          return;
        }
      }
      
      // Check if we're on leaderboard page - extract repo from URL
      if (pathname.startsWith('/app/leaderboard/')) {
        const repoId = pathname.split('/app/leaderboard/')[1];
        if (repoId) {
          // Decode the repo ID (it's URL encoded)
          const decodedRepo = decodeURIComponent(repoId);
          setCurrentRepo(decodedRepo);
          return;
        }
      }
      
      // Fetch first repository as default
      try {
        const response = await fetch('/api/repositories');
        if (response.ok) {
          const data = await response.json();
          if (data.repositories && data.repositories.length > 0) {
            setCurrentRepo(data.repositories[0].full_name);
          }
        }
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
    }
    
    getCurrentRepository();
  }, [pathname, searchParams]);

  useEffect(() => {
    // Get initial user and profile
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user);
      if (user) {
        const userProfile = await getCurrentProfile();
        setProfile(userProfile);
      }
    });

    // Listen for auth changes
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
          currentRepo={currentRepo}
        />
      </div>
      <TopBar
        sidebarCollapsed={sidebarCollapsed}
        user={user}
        profile={profile}
        currentRepo={currentRepo}
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
