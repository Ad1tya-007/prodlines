import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  message: string;
  metadata: Record<string, unknown> | null;
  seen: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
}

export const notificationsQueryKey = ['notifications'] as const;

export function notificationsQueryKeyWithParams(
  page: number,
  rows: number,
  search: string,
) {
  return [...notificationsQueryKey, page, rows, search] as const;
}

async function fetchNotifications(
  page: number,
  rows: number,
  search: string,
): Promise<NotificationsResponse> {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('rows', String(rows));
  if (search) params.set('search', search);

  const response = await fetch(`/api/notifications?${params.toString()}`);
  if (!response.ok) {
    if (response.status === 401) {
      return { notifications: [], total: 0 };
    }
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error ?? 'Failed to fetch notifications');
  }
  return response.json();
}

async function markAllNotificationsSeen(): Promise<void> {
  const response = await fetch('/api/notifications', { method: 'PATCH' });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error ?? 'Failed to mark notifications as read');
  }
}

export interface UseNotificationsQueryOptions {
  page: number;
  rows: number;
  search?: string;
}

export function useNotificationsQuery({
  page,
  rows,
  search = '',
}: UseNotificationsQueryOptions) {
  return useQuery({
    queryKey: notificationsQueryKeyWithParams(page, rows, search),
    queryFn: () => fetchNotifications(page, rows, search),
    staleTime: 60 * 1000,
    retry: false,
  });
}

export function useMarkAllNotificationsSeen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsSeen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
    },
  });
}
