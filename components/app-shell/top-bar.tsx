'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
import {
  GitBranch,
  Loader2,
  LogOut,
  User,
  Settings,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSavedRepositories } from '@/lib/hooks/use-repositories';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  setSelectedRepository,
  clearSelectedRepository,
} from '@/lib/store/repositorySlice';
import { useTheme } from 'next-themes';
import { useAuth } from '@/lib/providers/auth-provider';
import { MobileNav } from './mobile-nav';
import { NotificationsDropdown } from './notifications-dropdown';

interface TopBarProps {
  sidebarCollapsed: boolean;
}

export function TopBar({ sidebarCollapsed }: TopBarProps) {
  const { user } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dispatch = useAppDispatch();
  const { setTheme } = useTheme();

  const selectedRepository = useAppSelector(
    (state) => state.repository.selectedRepository,
  );
  const { data: repositories = [], isLoading: reposLoading } =
    useSavedRepositories();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (repositories.length > 0 && !selectedRepository) {
      dispatch(setSelectedRepository(repositories[0]));
    } else if (repositories.length === 0 && selectedRepository) {
      dispatch(clearSelectedRepository());
    }
  }, [repositories, selectedRepository, dispatch]);

  const handleRepoChange = (fullName: string) => {
    const repo = repositories.find((r) => r.full_name === fullName);
    if (repo) {
      dispatch(setSelectedRepository(repo));
    }
  };

  const handleSignOut = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setLoggingOut(true);
    window.location.href = '/logout';
  };

  const getUserInitials = () => {
    const name = user?.user_metadata?.full_name;
    if (name) {
      const names = name.split(' ');
      return names.length > 1
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0].slice(0, 2).toUpperCase();
    }
    const email = user?.email;
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getUserName = () => {
    return (
      user?.user_metadata?.github_username ||
      user?.user_metadata?.full_name ||
      'User'
    );
  };

  const getUserEmail = () => {
    return user?.email || '';
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 bg-background/80 backdrop-blur-sm border-b border-border transition-all duration-200',
        sidebarCollapsed ? 'left-0 md:left-16' : 'left-0 md:left-56',
      )}>
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <div className="flex items-center gap-4">
          <MobileNav />

          {reposLoading ? (
            <div className="w-48 md:w-56 h-10 bg-secondary/50 border border-border/50 rounded-md animate-pulse" />
          ) : repositories.length > 0 ? (
            <Select
              value={selectedRepository?.full_name || ''}
              onValueChange={handleRepoChange}>
              <SelectTrigger className="w-64 hover-button bg-secondary/50 border-border/50">
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

        <div className="items-center gap-3 flex">
          <div className="hidden sm:block">
            <NotificationsDropdown />
          </div>

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="hover-button p-0"
                disabled={loggingOut}>
                <Avatar className="h-8 w-8">
                  {user?.user_metadata?.avatar_url && (
                    <AvatarImage src={user.user_metadata.avatar_url} />
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
                onSelect={(e) =>
                  handleSignOut(e as unknown as React.MouseEvent)
                }
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
