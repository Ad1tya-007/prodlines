'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  Search,
  Check,
  GitBranch,
  Settings2,
  Plus,
  Lock,
  Loader2,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useGitHubRepositories,
  useSaveRepositories,
  useSavedRepositories,
  useDeleteRepository,
} from '@/lib/hooks/use-repositories';

function AddRepositories() {
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  // Use React Query to fetch repositories
  const {
    data: repositories = [],
    isLoading,
    error: queryError,
  } = useGitHubRepositories();

  const error = queryError ? (queryError as Error).message : null;

  // Use mutation for saving repositories
  const saveReposMutation = useSaveRepositories();

  const filteredRepos = repositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(search.toLowerCase()) ||
      repo.owner.toLowerCase().includes(search.toLowerCase()) ||
      repo.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleRepo = (repoFullName: string) => {
    setSelectedRepos(
      selectedRepos.includes(repoFullName)
        ? selectedRepos.filter((name) => name !== repoFullName)
        : [...selectedRepos, repoFullName],
    );
  };

  const handleSave = async () => {
    if (selectedRepos.length > 0) {
      try {
        await saveReposMutation.mutateAsync(selectedRepos);
        setSelectedRepos([]); // Clear selection after successful save
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
      <div className="text-center">
        <h2 className="text-2xl font-bold">Add repositories</h2>
        <p className="text-muted-foreground mt-2">
          Choose which repositories to track for production code ownership.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search repositories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-secondary/50 border-border/50"
        />
      </div>

      {/* Error state */}
      {(error || saveReposMutation.error) && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error || (saveReposMutation.error as Error)?.message}
        </div>
      )}

      {/* Success message */}
      {saveReposMutation.isSuccess && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
          <Check className="h-4 w-4" />
          Repositories saved successfully!
        </div>
      )}

      {/* Loading state */}
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

      {/* Repo list */}
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
                    : 'bg-card/50 border-border/50 hover:bg-secondary/50',
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

      {/* Selected count and save button */}
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

function ManageRepositories() {
  const [search, setSearch] = useState('');
  const [deletingRepoId, setDeletingRepoId] = useState<string | null>(null);
  const [repoToDelete, setRepoToDelete] = useState<{
    id: string;
    full_name: string;
  } | null>(null);

  // Fetch saved repositories
  const {
    data: savedRepositories = [],
    isLoading,
    error: queryError,
  } = useSavedRepositories();

  const error = queryError ? (queryError as Error).message : null;

  // Delete mutation
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

      {/* Search */}
      <div className="relative mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search repositories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-secondary/50 border-border/50"
        />
      </div>

      {/* Error state */}
      {(error || deleteRepoMutation.error) && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error || (deleteRepoMutation.error as Error)?.message}
        </div>
      )}

      {/* Loading state */}
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

      {/* Empty state */}
      {!isLoading && !error && savedRepositories.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="font-medium">No repositories connected</p>
          <p className="text-sm mt-2">
            Add repositories from the "Add Repositories" tab
          </p>
        </div>
      )}

      {/* Repo list */}
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

      {/* Count */}
      {!isLoading && !error && savedRepositories.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          {filteredRepos.length}{' '}
          {filteredRepos.length === 1 ? 'repository' : 'repositories'} shown
          {savedRepositories.length > 0 && search && (
            <span className="ml-2">({savedRepositories.length} total)</span>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!repoToDelete} onOpenChange={handleDeleteCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete repository?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-semibold text-foreground">
                {repoToDelete?.full_name}
              </span>
              ? This will:
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Stop tracking this repository</li>
                <li>Remove all synced data and statistics</li>
                <li>Clear it from your leaderboards</li>
              </ul>
              <p className="mt-3 text-destructive font-medium">
                This action cannot be undone.
              </p>
            </AlertDialogDescription>
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

export function ReposPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Repositories</h1>
        <p className="text-muted-foreground mt-1">
          Manage which repositories to track for production code ownership.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="add" className="space-y-6">
        <TabsList className="bg-secondary/50 p-1">
          <TabsTrigger
            value="add"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all duration-200 data-[state=active]:rounded-lg hover:rounded-none">
            <Plus className="h-4 w-4 mr-2" />
            Add Repositories
          </TabsTrigger>
          <TabsTrigger
            value="manage"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all duration-200 data-[state=active]:rounded-lg hover:rounded-none">
            <Settings2 className="h-4 w-4 mr-2" />
            Manage Repositories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="mt-6">
          <Card className="hover-card bg-card/50 border-border/50">
            <CardContent className="p-6 sm:p-8">
              <AddRepositories />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <Card className="hover-card bg-card/50 border-border/50">
            <CardContent className="p-6 sm:p-8">
              <ManageRepositories />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
