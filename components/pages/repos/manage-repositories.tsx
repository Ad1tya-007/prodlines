'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, GitBranch, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import {
  useSavedRepositories,
  useDeleteRepository,
} from '@/lib/hooks/use-repositories';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { clearSelectedRepository } from '@/lib/store/repositorySlice';

export function ManageRepositories() {
  const [search, setSearch] = useState('');
  const [deletingRepoId, setDeletingRepoId] = useState<string | null>(null);
  const [repoToDelete, setRepoToDelete] = useState<{
    id: string;
    full_name: string;
  } | null>(null);

  const dispatch = useAppDispatch();
  const selectedRepository = useAppSelector(
    (state) => state.repository.selectedRepository,
  );

  const {
    data: savedRepositories = [],
    isLoading,
    error: queryError,
  } = useSavedRepositories();

  const error = queryError ? (queryError as Error).message : null;
  const deleteRepoMutation = useDeleteRepository();

  const filteredRepos = savedRepositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(search.toLowerCase()) ||
      repo.owner.toLowerCase().includes(search.toLowerCase()) ||
      repo.full_name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDeleteClick = (repo: { id: string; full_name: string }) => {
    setRepoToDelete(repo);
  };

  const handleDeleteConfirm = async () => {
    if (!repoToDelete) return;

    setDeletingRepoId(repoToDelete.id);
    try {
      await deleteRepoMutation.mutateAsync(repoToDelete.id);
      if (selectedRepository?.id === repoToDelete.id) {
        dispatch(clearSelectedRepository());
      }
      setRepoToDelete(null);
    } catch (err) {
      console.error('Error deleting repository:', err);
    } finally {
      setDeletingRepoId(null);
    }
  };

  const handleDeleteCancel = () => {
    setRepoToDelete(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
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
      <h2 className="text-2xl font-bold">Manage repositories</h2>
      <p className="text-muted-foreground">
        Remove repositories you no longer want to track.
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

      {(error || deleteRepoMutation.error) && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error || (deleteRepoMutation.error as Error)?.message}
        </div>
      )}

      {isLoading && (
        <div className="grid gap-2 max-h-96 overflow-y-auto">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-xl border bg-card/50 border-border/50">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-9 w-20" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && savedRepositories.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="font-medium">No repositories connected</p>
          <p className="text-sm mt-2">
            Add repositories from the &quot;Add Repositories&quot; tab
          </p>
        </div>
      )}

      {!isLoading && !error && savedRepositories.length > 0 && (
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
                className="flex items-center justify-between p-4 rounded-xl border bg-card/50 border-border/50 hover:bg-secondary/50 transition-all duration-200 hover:rounded-none group">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="text-xs bg-secondary">
                      {repo.owner.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {repo.full_name}
                      </span>
                      <Badge variant="outline" className="text-xs shrink-0">
                        <GitBranch className="h-3 w-3 mr-1" />
                        {repo.default_branch}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>
                        Last synced: {formatDate(repo.last_synced_at)}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleDeleteClick({
                      id: repo.id,
                      full_name: repo.full_name,
                    })
                  }
                  disabled={deletingRepoId === repo.id}
                  className="hover-button bg-transparent text-destructive hover:text-destructive border-destructive/30 hover:border-destructive shrink-0">
                  {deletingRepoId === repo.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            ))
          )}
        </div>
      )}

      {!isLoading && !error && savedRepositories.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          {filteredRepos.length}{' '}
          {filteredRepos.length === 1 ? 'repository' : 'repositories'} shown
          {savedRepositories.length > 0 && search && (
            <span className="ml-2">({savedRepositories.length} total)</span>
          )}
        </div>
      )}

      <AlertDialog
        open={!!repoToDelete}
        onOpenChange={(open) => !open && handleDeleteCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete repository?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-semibold text-foreground">
                {repoToDelete?.full_name}{' '}
              </span>
              ? This will:
            </AlertDialogDescription>
            <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
              <li>Stop tracking this repository</li>
              <li>Remove all synced data and statistics</li>
              <li>Clear it from your leaderboards</li>
            </ul>
            <p className="mt-3 text-destructive font-medium">
              This action cannot be undone.
            </p>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Repository
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
