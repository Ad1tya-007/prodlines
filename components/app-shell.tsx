'use client';

import React from 'react';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useSavedRepositories } from '@/lib/hooks/use-repositories';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  setSelectedRepository,
  clearSelectedRepository,
} from '@/lib/store/repositorySlice';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import {
  getCurrentProfile,
  type Profile,
} from '@/lib/supabase/profiles-client';
import { useTheme } from 'next-themes';

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
    {
      id: 'overview',
      href: '/app/overview',
      icon: LayoutDashboard,
      label: 'Overview',
    },
    { id: 'repos', href: '/app/repos', icon: GitBranch, label: 'Repos' },
    {
      id: 'leaderboards',
      href: '/app/leaderboard',
      icon: Trophy,
      label: 'Leaderboards',
    },
    {
      id: 'settings',
      href: '/app/settings',
      icon: Settings,
      label: 'Settings',
    },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-200 ease-out',
          collapsed ? 'w-16' : 'w-56'
        )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div
            className={cn(
              'flex items-center h-16 border-b border-sidebar-border px-4',
              collapsed ? 'justify-center' : 'justify-between'
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
                          : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
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
                      : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
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

function MobileNav() {
  const pathname = usePathname();

  // Build nav items with dynamic leaderboard link
  const navItems = [
    {
      id: 'overview',
      href: '/app/overview',
      icon: LayoutDashboard,
      label: 'Overview',
    },
    { id: 'repos', href: '/app/repos', icon: GitBranch, label: 'Repos' },
    {
      id: 'leaderboards',
      href: '/app/leaderboard',
      icon: Trophy,
      label: 'Leaderboards',
    },
    {
      id: 'settings',
      href: '/app/settings',
      icon: Settings,
      label: 'Settings',
    },
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
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
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
}: {
  sidebarCollapsed: boolean;
  user: SupabaseUser | null;
  profile: Profile | null;
  currentRepo?: string;
}) {
  const [syncing, setSyncing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dispatch = useAppDispatch();
  const { setTheme } = useTheme();

  // Prevent hydration mismatch for theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get selected repository from Redux
  const selectedRepository = useAppSelector(
    (state) => state.repository.selectedRepository
  );

  // Use React Query for repositories
  const { data: repositories = [], isLoading: reposLoading } =
    useSavedRepositories();

  // Set initial repository when repositories are loaded, or clear if none
  useEffect(() => {
    if (repositories.length > 0 && !selectedRepository) {
      // Auto-select first repository if none selected
      dispatch(setSelectedRepository(repositories[0]));
    } else if (repositories.length === 0 && selectedRepository) {
      // Clear selected repository if no repositories exist
      dispatch(clearSelectedRepository());
    }
  }, [repositories, selectedRepository, dispatch]);

  const handleRepoChange = (fullName: string) => {
    const repo = repositories.find((r) => r.full_name === fullName);
    if (repo) {
      dispatch(setSelectedRepository(repo));
    }
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  const handleSignOut = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setLoggingOut(true);

    // Immediately redirect to login page
    // The logout will happen in the background
    window.location.href = '/logout';
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
        sidebarCollapsed ? 'left-0 md:left-16' : 'left-0 md:left-56'
      )}>
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <div className="flex items-center gap-4">
          <MobileNav />

          {/* Repo selector */}
          {reposLoading ? (
            <div className="w-48 md:w-56 h-10 bg-secondary/50 border border-border/50 rounded-md animate-pulse" />
          ) : repositories.length > 0 ? (
            <Select
              value={selectedRepository?.full_name || ''}
              onValueChange={handleRepoChange}>
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
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="hover-button relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </Button>

          {/* Theme toggle */}
          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

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
  const supabase = createClient();

  // Get selected repository from Redux
  const selectedRepository = useAppSelector(
    (state) => state.repository.selectedRepository
  );

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
          currentRepo={selectedRepository?.full_name}
        />
      </div>
      <TopBar
        sidebarCollapsed={sidebarCollapsed}
        user={user}
        profile={profile}
        currentRepo={selectedRepository?.full_name}
      />
      <main
        className={cn(
          'pt-16 transition-all duration-200',
          sidebarCollapsed ? 'md:pl-16' : 'md:pl-56'
        )}>
        <div className="p-4 md:p-6 lg:p-8 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
