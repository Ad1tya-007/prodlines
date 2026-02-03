'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Check, Plus, Lock, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useGitHubRepositories,
  useSavedRepositories,
  useSaveRepositories,
} from '@/lib/hooks/use-repositories';

export function AddRepositories() {
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const {
    data: repositories = [],
    isLoading,
    error: queryError,
  } = useGitHubRepositories();

  const { data: savedRepositories = [] } = useSavedRepositories();
  const savedFullNames = new Set(
    savedRepositories.map((r) => r.full_name.toLowerCase())
  );

  const error = queryError ? (queryError as Error).message : null;
  const saveReposMutation = useSaveRepositories();

  const filteredRepos = repositories.filter(
    (repo) =>
      !savedFullNames.has(repo.fullName.toLowerCase()) &&
      (repo.name.toLowerCase().includes(search.toLowerCase()) ||
        repo.owner.toLowerCase().includes(search.toLowerCase()) ||
        repo.fullName.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleRepo = (repoFullName: string) => {
    setSelectedRepos(
      selectedRepos.includes(repoFullName)
        ? selectedRepos.filter((name) => name !== repoFullName)
        : [...selectedRepos, repoFullName]
    );
  };

  const handleSave = async () => {
    if (selectedRepos.length > 0) {
      try {
        await saveReposMutation.mutateAsync(selectedRepos);
        setSelectedRepos([]);
      } catch (err) {
        console.error('Error saving repositories:', err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Add repositories</h2>
      <p className="text-muted-foreground">
        Choose which repositories to track for production code ownership.
      </p>

      <div className="relative mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search repositories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-secondary/50 border-border/50"
        />
      </div>

      {(error || saveReposMutation.error) && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error || (saveReposMutation.error as Error)?.message}
        </div>
      )}

      {saveReposMutation.isSuccess && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
          <Check className="h-4 w-4" />
          Repositories saved successfully!
        </div>
      )}

      {isLoading && (
        <div className="grid gap-2 max-h-96 overflow-y-auto">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-xl border bg-card/50 border-border/50">
              <Skeleton className="h-4 w-4 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid gap-2 max-h-96 overflow-y-auto">
          {filteredRepos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No repositories found</p>
              {search && (
                <p className="text-sm mt-2">Try a different search term</p>
              )}
            </div>
          ) : (
            filteredRepos.map((repo) => (
              <div
                key={repo.id}
                onClick={() => toggleRepo(repo.fullName)}
                className={cn(
                  'flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:rounded-none group',
                  selectedRepos.includes(repo.fullName)
                    ? 'bg-secondary border-foreground/20'
                    : 'bg-card/50 border-border/50 hover:bg-secondary/50'
                )}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Checkbox
                    checked={selectedRepos.includes(repo.fullName)}
                    className="data-[state=checked]:bg-foreground data-[state=checked]:text-background shrink-0"
                  />
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={repo.ownerAvatar} alt={repo.owner} />
                    <AvatarFallback className="text-xs">
                      {repo.owner.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {repo.fullName}
                      </span>
                      {repo.private && (
                        <Lock className="h-3 w-3 text-muted-foreground shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {repo.language && (
                        <Badge variant="outline" className="text-xs">
                          {repo.language}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {repo.stars} stars
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {repo.forks} forks
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        Updated {formatDate(repo.updatedAt)}
                      </span>
                    </div>
                    {repo.description && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {repo.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!isLoading && !error && (
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            {selectedRepos.length}{' '}
            {selectedRepos.length === 1 ? 'repository' : 'repositories'}{' '}
            selected
            {repositories.length > 0 && (
              <span className="ml-2">({repositories.length} total)</span>
            )}
          </div>
          <Button
            onClick={handleSave}
            disabled={selectedRepos.length === 0 || saveReposMutation.isPending}
            className="hover-button">
            {saveReposMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add{' '}
                {selectedRepos.length > 0 ? `(${selectedRepos.length})` : ''}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
