'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GitHubContributor } from '@/lib/types/github';

interface LeaderboardRowProps {
  contributor: GitHubContributor;
  rank: number;
  leaderboardHref: string;
}

function LeaderboardRow({
  contributor,
  rank,
  leaderboardHref,
}: LeaderboardRowProps) {
  const isTopThree = rank <= 3;

  return (
    <Link
      href={leaderboardHref}
      className="flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-all duration-200 group rounded-xl hover:rounded-none">
      <div className="flex items-center gap-4">
        <span
          className={cn(
            'w-8 text-center font-bold text-lg',
            rank === 1 && 'text-amber-500',
            rank === 2 && 'text-zinc-400',
            rank === 3 && 'text-amber-700',
            rank > 3 && 'text-muted-foreground',
          )}>
          {rank}
        </span>
        <Avatar
          className={cn(
            'h-9 w-9 transition-all duration-200',
            isTopThree ? 'ring-2 ring-offset-2 ring-offset-background' : '',
            rank === 1 && 'ring-amber-500',
            rank === 2 && 'ring-zinc-400',
            rank === 3 && 'ring-amber-700',
          )}>
          <AvatarImage src={contributor.avatarUrl} alt={contributor.username} />
          <AvatarFallback className="bg-secondary text-foreground text-sm group-hover:rounded-none transition-all duration-200">
            {contributor.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{contributor.username}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right hidden sm:block">
          <p className="font-mono text-sm">
            {contributor.productionLOC.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">LOC</p>
        </div>
        <div className="w-16 text-right">
          <Badge variant="secondary" className="font-mono">
            {contributor.percentShare}%
          </Badge>
        </div>
        <div className="text-right hidden sm:block">
          <p className="font-mono text-sm">{contributor.contributions}</p>
          <p className="text-xs text-muted-foreground">Contributions</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3">
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-8" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-6">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface OverviewLeaderboardProps {
  contributors: GitHubContributor[];
  isLoading?: boolean;
  /** Use /leaderboard for public pages, /app/leaderboard for authenticated app */
  leaderboardHref?: string;
}

export function OverviewLeaderboard({
  contributors,
  isLoading = false,
  leaderboardHref = '/app/leaderboard',
}: OverviewLeaderboardProps) {
  return (
    <Card
      className="lg:col-span-2 hover-card bg-card/50 border-border/50 opacity-0 animate-fade-in animate-delay-200"
      style={{ animationFillMode: 'forwards' }}>
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Leaderboard</CardTitle>
            <CardDescription>Production LOC ownership ranking</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="hover-button bg-transparent"
            asChild>
            {leaderboardHref === '/app/leaderboard' && (
              <Link href={leaderboardHref}>
                View all
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <LeaderboardSkeleton />
        ) : (
          <div className="divide-y divide-border/50">
            {contributors.slice(0, 8).map((contributor, index) => (
              <LeaderboardRow
                key={contributor.id}
                contributor={contributor}
                rank={index + 1}
                leaderboardHref={leaderboardHref}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
