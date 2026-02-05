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

export const notificationsQueryKey = ['notifications'] as const;

async function fetchNotifications(): Promise<Notification[]> {
  const response = await fetch('/api/notifications');
  if (!response.ok) {
    if (response.status === 401) return [];
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

export function useNotificationsQuery() {
  return useQuery({
    queryKey: notificationsQueryKey,
    queryFn: fetchNotifications,
    staleTime: 60 * 1000,
    retry: false,
  });
}

export function useMarkAllNotificationsSeen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsSeen,
    onSuccess: () => {
      queryClient.setQueryData<Notification[]>(notificationsQueryKey, (old) =>
        old ? old.map((n) => ({ ...n, seen: true })) : []
      );
    },
  });
}
