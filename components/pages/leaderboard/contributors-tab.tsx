'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, ChevronRight, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GitHubContributor } from '@/lib/types/github';
import { ContributorDetailModal } from './contributor-detail-modal';

interface ContributorsTabProps {
  contributors: GitHubContributor[];
}

export function ContributorsTab({ contributors }: ContributorsTabProps) {
  const [selectedContributor, setSelectedContributor] =
    useState<GitHubContributor | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('loc');

  let filteredContributors = contributors.filter((c) =>
    c.username.toLowerCase().includes(search.toLowerCase())
  );

  if (sortBy === 'loc') {
    filteredContributors = [...filteredContributors].sort(
      (a, b) => b.productionLOC - a.productionLOC
    );
  } else if (sortBy === 'share') {
    filteredContributors = [...filteredContributors].sort(
      (a, b) => b.percentShare - a.percentShare
    );
  } else if (sortBy === 'contributions') {
    filteredContributors = [...filteredContributors].sort(
      (a, b) => b.contributions - a.contributions
    );
  } else if (sortBy === 'name') {
    filteredContributors = [...filteredContributors].sort((a, b) =>
      a.username.localeCompare(b.username)
    );
  }

  return (
    <div className="space-y-4">
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
            <SelectItem value="contributions">Contributions</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="hover-card bg-card/50 border-border/50">
        <CardContent className="p-0">
          <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-3 border-b border-border/50 text-xs font-medium text-muted-foreground">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Contributor</div>
            <div className="col-span-3 text-right">Production LOC</div>
            <div className="col-span-2 text-right">Share</div>
            <div className="col-span-2 text-right">Contributions</div>
          </div>

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
                    <span className="font-mono">
                      {contributor.contributions}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <ContributorDetailModal
        contributor={selectedContributor}
        open={!!selectedContributor}
        onClose={() => setSelectedContributor(null)}
      />
    </div>
  );
}
