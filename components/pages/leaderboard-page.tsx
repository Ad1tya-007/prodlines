'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  GitBranch,
  Clock,
  Share2,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  FileCode,
  GitPullRequest,
  Users,
  Check,
  ChevronRight,
  ArrowUpDown,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GitHubStats, GitHubContributor } from '@/lib/types/github';

interface LeaderboardPageProps {
  stats: GitHubStats | null;
  repoInfo: {
    id: string;
    full_name: string;
    owner: string;
    name: string;
    default_branch: string;
    last_synced_at?: string;
  } | null;
  repoFullName: string;
}

function ContributorDetailModal({
  contributor,
  open,
  onClose,
}: {
  contributor: GitHubContributor | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!contributor) return null;

  console.log(contributor);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={contributor.avatarUrl}
                alt={contributor.username}
              />
              <AvatarFallback className="bg-secondary text-foreground">
                {contributor.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-row items-center gap-2">
              <span className="text-xl">{contributor.username}</span>
              <a
                href={`https://github.com/${contributor.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                title="View GitHub profile"
                onClick={(e) => e.stopPropagation()}>
                <img
                  src="/GitHub_Invertocat_Black.svg"
                  alt="GitHub"
                  className="h-4 w-4 dark:hidden"
                  aria-hidden
                />
                <img
                  src="/GitHub_Invertocat_White.svg"
                  alt="GitHub"
                  className="h-4 w-4 hidden dark:block"
                  aria-hidden
                />
              </a>
            </div>
          </DialogTitle>
          <DialogDescription>
            Contributor details and ownership breakdown
          </DialogDescription>

          <div className=" gap-4 grid grid-cols-2">
            <div className="text-center p-3 rounded-xl bg-secondary/50">
              <p className="text-2xl font-bold">{contributor.percentShare}%</p>
              <p className="text-xs text-muted-foreground">Ownership</p>
            </div>

            <div className="text-center p-3 rounded-xl bg-secondary/50">
              <p className="text-2xl font-bold">
                {contributor.productionLOC.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Production LOC</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Recent PRs */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <GitPullRequest className="h-4 w-4 text-muted-foreground" />
              Recent merged PRs
            </h4>
            <div className="space-y-2">
              {contributor.recentPRs.map((pr, index) => (
                <a
                  key={index}
                  href={pr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 text-sm transition-all duration-200 hover:rounded-none group">
                  <div className="flex-1 min-w-0 mr-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-xs text-muted-foreground">
                        #{pr.number}
                      </span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="truncate">{pr.title}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ContributorsTab({
  contributors,
}: {
  contributors: GitHubContributor[];
}) {
  const [selectedContributor, setSelectedContributor] =
    useState<GitHubContributor | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('loc');

  let filteredContributors = contributors.filter((c) =>
    c.username.toLowerCase().includes(search.toLowerCase())
  );

  // Sort contributors
  if (sortBy === 'loc') {
    filteredContributors = [...filteredContributors].sort(
      (a, b) => b.productionLOC - a.productionLOC
    );
  } else if (sortBy === 'share') {
    filteredContributors = [...filteredContributors].sort(
      (a, b) => b.percentShare - a.percentShare
    );
  } else if (sortBy === 'name') {
    filteredContributors = [...filteredContributors].sort((a, b) =>
      a.username.localeCompare(b.username)
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contributors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/50 border-border/50"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-40 hover-button bg-secondary/50">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="loc">Production LOC</SelectItem>
            <SelectItem value="share">% Share</SelectItem>
            <SelectItem value="trend">Trend</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leaderboard table */}
      <Card className="hover-card bg-card/50 border-border/50">
        <CardContent className="p-0">
          {/* Header */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-3 border-b border-border/50 text-xs font-medium text-muted-foreground">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Contributor</div>
            <div className="col-span-3 text-right">Production LOC</div>
            <div className="col-span-2 text-right">Share</div>
            <div className="col-span-2 text-right">Trend</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border/50">
            {filteredContributors.map((contributor, index) => {
              const rank = index + 1;
              const isTopThree = rank <= 3;

              return (
                <button
                  key={contributor.id}
                  onClick={() => setSelectedContributor(contributor)}
                  className="w-full grid grid-cols-12 gap-4 px-4 py-3 hover:bg-secondary/50 transition-all duration-200 group text-left items-center">
                  <div className="col-span-1">
                    <span
                      className={cn(
                        'font-bold text-lg',
                        rank === 1 && 'text-amber-500',
                        rank === 2 && 'text-zinc-400',
                        rank === 3 && 'text-amber-700',
                        rank > 3 && 'text-muted-foreground'
                      )}>
                      {rank}
                    </span>
                  </div>
                  <div className="col-span-4 flex items-center gap-3">
                    <Avatar
                      className={cn(
                        'h-9 w-9 transition-all duration-200 group-hover:rounded-none',
                        isTopThree &&
                          'ring-2 ring-offset-2 ring-offset-background',
                        rank === 1 && 'ring-amber-500',
                        rank === 2 && 'ring-zinc-400',
                        rank === 3 && 'ring-amber-700'
                      )}>
                      <AvatarImage
                        src={contributor.avatarUrl}
                        alt={contributor.username}
                      />
                      <AvatarFallback className="bg-secondary text-foreground text-sm">
                        {contributor.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium hover:underline cursor-pointer">
                        {contributor.username}
                      </p>
                      <p className="text-xs text-muted-foreground sm:hidden">
                        {contributor.productionLOC.toLocaleString()} LOC
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:block col-span-3 text-right">
                    <span className="font-mono">
                      {contributor.productionLOC.toLocaleString()}
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <Badge variant="secondary" className="font-mono">
                      {contributor.percentShare}%
                    </Badge>
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-1">
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
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Contributor detail modal */}
      <ContributorDetailModal
        contributor={selectedContributor}
        open={!!selectedContributor}
        onClose={() => setSelectedContributor(null)}
      />
    </div>
  );
}

export function LeaderboardPage({
  stats,
  repoInfo,
  repoFullName,
}: LeaderboardPageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatLastSync = (lastSync: string | undefined) => {
    if (!lastSync) return 'Never';
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

  const [owner, repo] = repoFullName.split('/');
  const contributors = stats?.contributors || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">
              {owner}/{repo}
            </h1>
            {repoInfo && (
              <Badge variant="outline" className="flex items-center gap-1">
                <GitBranch className="h-3 w-3" />
                {repoInfo.default_branch}
              </Badge>
            )}
          </div>
          {stats && (
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Last sync: {formatLastSync(stats.lastSync)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {stats.activeContributors} contributors
              </span>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          className="hover-button bg-transparent"
          onClick={handleCopyLink}>
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </>
          )}
        </Button>
      </div>

      {/* Tabs */}
      {stats && (
        <div className="space-y-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-4 w-4 mr-2" />
            Contributors
          </Badge>

          <ContributorsTab contributors={contributors} />
        </div>
      )}
    </div>
  );
}
