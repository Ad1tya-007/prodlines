'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Skeleton } from '@/components/ui/skeleton';
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
  Filter,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GitHubStats, GitHubContributor } from '@/lib/types/github';
import { useSearchParams } from 'next/navigation';

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
            <div>
              <span className="text-xl">{contributor.username}</span>
              <p className="text-sm text-muted-foreground font-normal">
                {contributor.productionLOC.toLocaleString()} production LOC
              </p>
            </div>
          </DialogTitle>
          <DialogDescription>
            Contributor details and ownership breakdown
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-xl bg-secondary/50">
              <p className="text-2xl font-bold">{contributor.percentShare}%</p>
              <p className="text-xs text-muted-foreground">Ownership</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-secondary/50">
              <p className="text-2xl font-bold">
                {contributor.topFiles.length}
              </p>
              <p className="text-xs text-muted-foreground">Top Files</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-secondary/50">
              <p className="text-2xl font-bold">
                {contributor.recentPRs.length}
              </p>
              <p className="text-xs text-muted-foreground">Recent PRs</p>
            </div>
          </div>

          {/* Top files */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <FileCode className="h-4 w-4 text-muted-foreground" />
              Top owned files
            </h4>
            <div className="space-y-2">
              {contributor.topFiles.map((file) => (
                <div
                  key={file}
                  className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 text-sm">
                  <span className="font-mono text-xs truncate max-w-[250px]">
                    {file}
                  </span>
                  <Badge variant="outline" className="text-xs ml-2">
                    {Math.floor(Math.random() * 500 + 200)} LOC
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Recent PRs */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <GitPullRequest className="h-4 w-4 text-muted-foreground" />
              Recent merged PRs
            </h4>
            <div className="space-y-2">
              {contributor.recentPRs.map((pr, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 text-sm">
                  <span className="truncate max-w-[280px]">{pr}</span>
                </div>
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
    c.username.toLowerCase().includes(search.toLowerCase()),
  );

  // Sort contributors
  if (sortBy === 'loc') {
    filteredContributors = [...filteredContributors].sort(
      (a, b) => b.productionLOC - a.productionLOC,
    );
  } else if (sortBy === 'share') {
    filteredContributors = [...filteredContributors].sort(
      (a, b) => b.percentShare - a.percentShare,
    );
  } else if (sortBy === 'name') {
    filteredContributors = [...filteredContributors].sort((a, b) =>
      a.username.localeCompare(b.username),
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
                        rank > 3 && 'text-muted-foreground',
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
                        rank === 3 && 'ring-amber-700',
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

function FilesTab({ contributors }: { contributors: GitHubContributor[] }) {
  const [search, setSearch] = useState('');
  const [files, setFiles] = useState<
    Array<{ id: string; path: string; owner: string; ownedLOC: number }>
  >([]);
  const [loading, setLoading] = useState(true);

  // Extract files from contributors' topFiles
  useEffect(() => {
    const fileMap = new Map<string, { owner: string; ownedLOC: number }>();

    contributors.forEach((contributor) => {
      contributor.topFiles.forEach((filePath) => {
        if (!fileMap.has(filePath)) {
          fileMap.set(filePath, {
            owner: contributor.username,
            ownedLOC: Math.floor(
              contributor.productionLOC /
                Math.max(contributor.topFiles.length, 1),
            ),
          });
        }
      });
    });

    const filesWithId: Array<{
      id: string;
      path: string;
      owner: string;
      ownedLOC: number;
    }> = Array.from(fileMap.entries()).map(([path, data], index) => ({
      id: `file-${index}`,
      path,
      ...data,
    }));
    setFiles(filesWithId);
    setLoading(false);
  }, [contributors]);

  const filteredFiles = files.filter(
    (f) =>
      f.path.toLowerCase().includes(search.toLowerCase()) ||
      f.owner.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/50 border-border/50"
          />
        </div>
        <Button variant="outline" className="hover-button bg-transparent">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Files table */}
      <Card className="hover-card bg-card/50 border-border/50">
        <CardContent className="p-0">
          {/* Header */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-3 border-b border-border/50 text-xs font-medium text-muted-foreground">
            <div className="col-span-6">File Path</div>
            <div className="col-span-2">Owner</div>
            <div className="col-span-2 text-right">Owned LOC</div>
            <div className="col-span-2 text-right">Last Modified</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border/50">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-secondary/50 transition-all duration-200 group items-center">
                <div className="col-span-6">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-mono text-sm truncate">
                      {file.path}
                    </span>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-secondary text-foreground text-xs">
                        {file.owner.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm hidden md:inline">
                      {file.owner}
                    </span>
                  </div>
                </div>
                <div className="col-span-2 text-right">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {file.ownedLOC.toLocaleString()}
                  </Badge>
                </div>
                <div className="col-span-2 text-right text-sm text-muted-foreground">
                  {/* Last modified not available from current API */}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PRsTab({ contributors }: { contributors: GitHubContributor[] }) {
  const [search, setSearch] = useState('');

  // Extract PRs from contributors' recentPRs
  const prs = contributors.flatMap((contributor) =>
    contributor.recentPRs.map((title, index) => ({
      id: `${contributor.id}-pr-${index}`,
      title,
      author: contributor.username,
      mergedAt: 'recent',
      additions: Math.floor(
        contributor.productionLOC / Math.max(contributor.recentPRs.length, 1),
      ),
      deletions: Math.floor(
        contributor.productionLOC /
          Math.max(contributor.recentPRs.length, 1) /
          2,
      ),
    })),
  );

  const filteredPRs = prs.filter(
    (pr) =>
      pr.title.toLowerCase().includes(search.toLowerCase()) ||
      pr.author.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search PRs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/50 border-border/50"
          />
        </div>
      </div>

      {/* PRs list */}
      <div className="space-y-3">
        {filteredPRs.map((pr) => (
          <Card key={pr.id} className="hover-card bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <GitPullRequest className="h-4 w-4 text-green-500 shrink-0" />
                    <span className="font-medium truncate">{pr.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="bg-secondary text-foreground text-xs">
                          {pr.author.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {pr.author}
                    </span>
                    <span>merged {pr.mergedAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant="outline"
                    className="text-green-500 border-green-500/30 font-mono text-xs">
                    +{pr.additions}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-red-500 border-red-500/30 font-mono text-xs">
                    -{pr.deletions}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
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
  const isLoading = !stats && !repoInfo;

  // Debug logging
  useEffect(() => {
    console.log('LeaderboardPage - stats:', stats);
    console.log('LeaderboardPage - repoInfo:', repoInfo);
    console.log('LeaderboardPage - repoFullName:', repoFullName);
    console.log('LeaderboardPage - isLoading:', isLoading);
  }, [stats, repoInfo, repoFullName, isLoading]);

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
          {isLoading ? (
            <div className="flex items-center gap-3 mt-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          ) : stats ? (
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
          ) : null}
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Loading leaderboard data...
          </p>
          <p className="text-xs text-muted-foreground">
            Fetching from GitHub API...
          </p>
        </div>
      ) : !stats ? (
        <Card className="hover-card bg-card/50 border-border/50">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-destructive font-medium">
              Failed to load leaderboard data.
            </p>
            <p className="text-sm text-muted-foreground">
              Repository: {repoFullName}
            </p>
            <p className="text-xs text-muted-foreground">
              Check the browser console for error details.
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Tabs */
        <Tabs defaultValue="contributors" className="space-y-4">
          <TabsList className="bg-secondary/50 p-1">
            <TabsTrigger
              value="contributors"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all duration-200 data-[state=active]:rounded-lg hover:rounded-none">
              <Users className="h-4 w-4 mr-2" />
              Contributors
            </TabsTrigger>
            <TabsTrigger
              value="files"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all duration-200 data-[state=active]:rounded-lg hover:rounded-none">
              <FileCode className="h-4 w-4 mr-2" />
              Files
            </TabsTrigger>
            <TabsTrigger
              value="prs"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all duration-200 data-[state=active]:rounded-lg hover:rounded-none">
              <GitPullRequest className="h-4 w-4 mr-2" />
              PRs (merged)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contributors" className="mt-4">
            <ContributorsTab contributors={contributors} />
          </TabsContent>

          <TabsContent value="files" className="mt-4">
            <FilesTab contributors={contributors} />
          </TabsContent>

          <TabsContent value="prs" className="mt-4">
            <PRsTab contributors={contributors} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
