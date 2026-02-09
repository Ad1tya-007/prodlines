'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  useNotificationsQuery,
  useMarkAllNotificationsSeen,
  notificationsQueryKey,
  type Notification,
} from '@/lib/hooks/use-notifications';
import { useQueryClient } from '@tanstack/react-query';

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAllAsSeen: () => Promise<void>;
  refetch: () => Promise<unknown>;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return ctx;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, refetch, isLoading } = useNotificationsQuery({
    page: 1,
    rows: 50,
  });
  const notifications = data?.notifications ?? [];
  const markAllMutation = useMarkAllNotificationsSeen();

  const unreadCount = notifications.filter((n) => !n.seen).length;

  const markAllAsSeen = async () => {
    await markAllMutation.mutateAsync();
  };

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();
    const channel = supabase
      .channel('notifications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    markAllAsSeen,
    refetch,
    isLoading,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
