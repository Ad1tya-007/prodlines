import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { GitHubRepository } from '@/lib/types/github';

// Types for saved repositories
interface SavedRepository {
  id: string;
  full_name: string;
  owner: string;
  name: string;
  default_branch: string;
  description?: string;
  private?: boolean;
  language?: string;
  stars?: number;
  forks?: number;
  is_active?: boolean;
  created_at?: string;
  last_synced_at?: string;
}

// Fetch GitHub repositories (from GitHub API)
async function fetchGitHubRepositories(): Promise<GitHubRepository[]> {
  const response = await fetch('/api/github/repositories');
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: 'Failed to fetch repositories' }));
    throw new Error(errorData.error || 'Failed to fetch repositories');
  }
  const data = await response.json();
  return data.repositories || [];
}

// Fetch saved repositories (from database)
async function fetchSavedRepositories(): Promise<SavedRepository[]> {
  const response = await fetch('/api/repositories');
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: 'Failed to fetch saved repositories' }));
    throw new Error(errorData.error || 'Failed to fetch saved repositories');
  }
  const data = await response.json();
  return data.repositories || [];
}

// Save repositories to database
async function saveRepositories(
  repositories: string[],
): Promise<SavedRepository[]> {
  const response = await fetch('/api/repositories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ repositories }),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: 'Failed to save repositories' }));
    throw new Error(errorData.error || 'Failed to save repositories');
  }

  const data = await response.json();
  return data.repositories || [];
}

// Delete repository
async function deleteRepository(repoId: string): Promise<void> {
  const response = await fetch(`/api/repositories?id=${repoId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: 'Failed to delete repository' }));
    throw new Error(errorData.error || 'Failed to delete repository');
  }
}

// Hook to fetch GitHub repositories
export function useGitHubRepositories() {
  return useQuery({
    queryKey: ['github-repositories'],
    queryFn: fetchGitHubRepositories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to fetch saved repositories
export function useSavedRepositories() {
  return useQuery({
    queryKey: ['saved-repositories'],
    queryFn: fetchSavedRepositories,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook to save repositories
export function useSaveRepositories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveRepositories,
    onSuccess: () => {
      // Invalidate and refetch saved repositories
      queryClient.invalidateQueries({ queryKey: ['saved-repositories'] });
    },
  });
}

// Hook to delete repository
export function useDeleteRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRepository,
    onSuccess: () => {
      // Invalidate and refetch saved repositories
      queryClient.invalidateQueries({ queryKey: ['saved-repositories'] });
    },
  });
}
