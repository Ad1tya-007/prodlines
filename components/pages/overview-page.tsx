'use client';

import { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Code2,
  Users,
  Clock,
  FileX,
  TrendingUp,
  TrendingDown,
  Minus,
  X,
  Plus,
  Info,
  GitBranch,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  GitHubStats,
  GitHubContributor,
  KPICard,
} from '@/lib/types/github';

// Filter chips
const defaultExcludes = [
  '**/node_modules/**',
  '**/dist/**',
  '**/*.min.js',
  '**/vendor/**',
];
const defaultIncludes = ['src/**', 'lib/**', 'components/**'];

function KPICard({ card, index }: { card: KPICard; index: number }) {
  return (
    <Card
      className="hover-card group bg-card/50 border-border/50 opacity-0 animate-fade-in"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'forwards',
      }}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {card.title}
        </CardTitle>
        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center group-hover:rounded-none transition-all duration-200">
          <card.icon className="h-4 w-4 text-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{card.value}</div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-muted-foreground">{card.description}</p>
          {card.trend && (
            <Badge
              variant="outline"
              className={cn(
                'text-xs',
                card.trendUp
                  ? 'text-green-500 border-green-500/30'
                  : 'text-red-500 border-red-500/30',
              )}>
              {card.trendUp ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {card.trend}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function KPICardSkeleton() {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

function LeaderboardRow({
  contributor,
  rank,
}: {
  contributor: GitHubContributor;
  rank: number;
}) {
  const isTopThree = rank <= 3;

  return (
    <Link
      href="/app/leaderboard"
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
          {isTopThree && (
            <p className="text-xs text-muted-foreground">
              {contributor.topFiles[0]?.split('/').pop()}
            </p>
          )}
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
        <div className="w-16 flex items-center justify-end gap-1">
          {contributor.trend === 'up' && (
            <>
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-500">
                +{contributor.trendValue}%
              </span>
            </>
          )}
          {contributor.trend === 'down' && (
            <>
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-xs text-red-500">
                -{contributor.trendValue}%
              </span>
            </>
          )}
          {contributor.trend === 'neutral' && (
            <Minus className="h-4 w-4 text-muted-foreground" />
          )}
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

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove?: () => void;
}) {
  return (
    <Badge variant="secondary" className="text-xs flex items-center gap-1 pr-1">
      <span className="font-mono">{label}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 h-4 w-4 rounded-sm hover:bg-secondary-foreground/20 flex items-center justify-center">
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
}

function EmptyState() {
  return (
    <Card className="hover-card bg-card/50 border-border/50">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
          <GitBranch className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No repository connected</h3>
        <p className="text-muted-foreground text-sm text-center max-w-sm mb-6">
          Connect a GitHub repository to see your production code leaderboard.
        </p>
        <Button className="hover-button" asChild>
          <Link href="/app/repos">
            <Plus className="h-4 w-4 mr-2" />
            Connect a repo
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

interface OverviewPageProps {
  stats: GitHubStats | null;
  isLoading?: boolean;
  error?: string | null;
  repoOwner?: string;
  repoName?: string;
}

export function OverviewPage({
  stats,
  isLoading: externalLoading = false,
  error,
  repoOwner,
  repoName,
}: OverviewPageProps) {
  const [isLoading, setIsLoading] = useState(externalLoading);
  const [showEmpty, setShowEmpty] = useState(false);
  const [excludeBots, setExcludeBots] = useState(true);
  const [excludeTests, setExcludeTests] = useState(true);
  const [excludeDocs, setExcludeDocs] = useState(true);
  const [lastSyncFormatted, setLastSyncFormatted] =
    useState<string>('Just now');

  // Format last sync time (client-side only to avoid hydration mismatch)
  const formatLastSync = (lastSync: string) => {
    try {
      const date = new Date(lastSync);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60)
        return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24)
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } catch {
      return lastSync;
    }
  };

  // Update formatted time on client side only (after hydration)
  useEffect(() => {
    if (stats?.lastSync) {
      setLastSyncFormatted(formatLastSync(stats.lastSync));
      // Update every minute to keep it fresh
      const interval = setInterval(() => {
        setLastSyncFormatted(formatLastSync(stats.lastSync));
      }, 60000);
      return () => clearInterval(interval);
    } else {
      setLastSyncFormatted('Never');
    }
  }, [stats?.lastSync]);

  // Create KPI cards from stats
  const kpiCards: KPICard[] = stats
    ? [
        {
          title: 'Production LOC',
          value: stats.productionLOC.toLocaleString(),
          description: 'Lines in production',
          icon: Code2,
          trend: '+2.3%',
          trendUp: true,
        },
        {
          title: 'Active Contributors',
          value: stats.activeContributors.toString(),
          description: 'This month',
          icon: Users,
          trend: '+1',
          trendUp: true,
        },
        {
          title: 'Last Sync',
          value: lastSyncFormatted,
          description: 'Auto-sync enabled',
          icon: Clock,
          trend: null,
          trendUp: null,
        },
        {
          title: 'Excluded LOC',
          value: stats.excludedLOC.toLocaleString(),
          description: 'Tests, docs, generated',
          icon: FileX,
          trend: '-5.1%',
          trendUp: false,
        },
      ]
    : [];

  const displayLoading = isLoading || externalLoading;
  const displayStats =
    stats && !showEmpty && !error && stats.contributors.length > 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-muted-foreground">
            Production code ownership for {repoOwner}/{repoName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="hover-button bg-transparent">
            {displayLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="p-4">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {displayLoading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      )}

      {showEmpty || (!stats && !displayLoading) ? (
        <EmptyState />
      ) : displayStats ? (
        <>
          {/* KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayLoading
              ? [...Array(4)].map((_, i) => <KPICardSkeleton key={i} />)
              : kpiCards.map((card, index) => (
                  <KPICard key={card.title} card={card} index={index} />
                ))}
          </div>

          {/* Main content */}
          <Card
            className="lg:col-span-2 hover-card bg-card/50 border-border/50 opacity-0 animate-fade-in animate-delay-200"
            style={{ animationFillMode: 'forwards' }}>
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Leaderboard</CardTitle>
                  <CardDescription>
                    Production LOC ownership ranking
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover-button bg-transparent"
                  asChild>
                  <Link href="/app/leaderboard">
                    View all
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {displayLoading ? (
                <LeaderboardSkeleton />
              ) : (
                <div className="divide-y divide-border/50">
                  {stats.contributors.slice(0, 8).map((contributor, index) => (
                    <LeaderboardRow
                      key={contributor.id}
                      contributor={contributor}
                      rank={index + 1}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
