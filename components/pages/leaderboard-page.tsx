'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  mockContributors,
  mockFiles,
  mockPRs,
  mockRepos,
} from '@/lib/mock-data';
import { useSearchParams } from 'next/navigation';

// Get first repo as current
const currentRepo = mockRepos[0];

function ContributorDetailModal({
  contributor,
  open,
  onClose,
}: {
  contributor: (typeof mockContributors)[0] | null;
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

function ContributorsTab() {
  const [selectedContributor, setSelectedContributor] = useState<
    (typeof mockContributors)[0] | null
  >(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('loc');

  const filteredContributors = mockContributors.filter((c) =>
    c.username.toLowerCase().includes(search.toLowerCase()),
  );

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
                      <AvatarFallback className="bg-secondary text-foreground text-sm">
                        {contributor.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{contributor.username}</p>
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

function FilesTab() {
  const [search, setSearch] = useState('');

  const filteredFiles = mockFiles.filter(
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
                  {file.lastModified}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PRsTab() {
  const [search, setSearch] = useState('');

  const filteredPRs = mockPRs.filter(
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

export function LeaderboardPage() {
  const [copied, setCopied] = useState(false);
  const searchParams = useSearchParams();

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">
              {currentRepo.owner}/{currentRepo.name}
            </h1>
            <Badge variant="outline" className="flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              {currentRepo.branch}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Last sync: {currentRepo.lastSync}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {currentRepo.contributors} contributors
            </span>
          </div>
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
          <ContributorsTab />
        </TabsContent>

        <TabsContent value="files" className="mt-4">
          <FilesTab />
        </TabsContent>

        <TabsContent value="prs" className="mt-4">
          <PRsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
