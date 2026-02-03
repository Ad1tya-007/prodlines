'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GitPullRequest, ExternalLink } from 'lucide-react';
import type { GitHubContributor } from '@/lib/types/github';

interface ContributorDetailModalProps {
  contributor: GitHubContributor | null;
  open: boolean;
  onClose: () => void;
}

function formatDate(value: string | null) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
}

export function ContributorDetailModal({
  contributor,
  open,
  onClose,
}: ContributorDetailModalProps) {
  if (!contributor) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
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

          <div className="grid grid-cols-3 gap-4">
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
            <div className="text-center p-3 rounded-xl bg-secondary/50">
              <p className="text-2xl font-bold">{contributor.commits}</p>
              <p className="text-xs text-muted-foreground">Commits</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-secondary/50">
              <p className="text-2xl font-bold">{contributor.prsClosed}</p>
              <p className="text-xs text-muted-foreground">PRs closed</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-secondary/50">
              <p className="text-2xl font-bold">{contributor.prsMerged}</p>
              <p className="text-xs text-muted-foreground">PRs merged</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-secondary/50">
              <p className="text-2xl font-bold">
                {formatDate(contributor.lastActivityAt)}
              </p>
              <p className="text-xs text-muted-foreground">Last active</p>
            </div>
          </div>
        </DialogHeader>

        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <GitPullRequest className="h-4 w-4 text-muted-foreground" />
            Activity breakdown
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-secondary/30 p-3">
              <p className="text-xs text-muted-foreground">Additions</p>
              <p className="font-mono">
                {contributor.additions.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-secondary/30 p-3">
              <p className="text-xs text-muted-foreground">Deletions</p>
              <p className="font-mono">
                {contributor.deletions.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-secondary/30 p-3">
              <p className="text-xs text-muted-foreground">Files touched</p>
              <p className="font-mono">{contributor.filesTouchedCount}</p>
            </div>
            <div className="rounded-lg bg-secondary/30 p-3">
              <p className="text-xs text-muted-foreground">Merge rate</p>
              <p className="font-mono">{contributor.prMergeRate}%</p>
            </div>
            <div className="rounded-lg bg-secondary/30 p-3">
              <p className="text-xs text-muted-foreground">Avg PR size</p>
              <p className="font-mono">
                {contributor.avgPrSize.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-secondary/30 p-3">
              <p className="text-xs text-muted-foreground">Avg time to merge</p>
              <p className="font-mono">{contributor.avgTimeToMergeHours}h</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 py-4">
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <GitPullRequest className="h-4 w-4 text-muted-foreground" />
              Recent 3 merged PRs
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
