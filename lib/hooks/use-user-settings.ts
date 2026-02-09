import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCurrentUserSettings,
  updateCurrentUserSettings,
  type UserSettingsUpdate,
  type SyncFrequency,
} from '@/lib/supabase/user-settings-client';
import { toast } from 'sonner';

export const userSettingsQueryKey = ['user-settings'] as const;

export function useUserSettings() {
  return useQuery({
    queryKey: userSettingsQueryKey,
    queryFn: () => getCurrentUserSettings(),
    staleTime: 2 * 60 * 1000,
    retry: 1,
    gcTime: 5 * 60 * 1000,
  });
}

export interface UpdateRepositorySyncInput {
  autoSync: boolean;
  syncFrequency: SyncFrequency;
}

export function useUpdateRepositorySyncSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateRepositorySyncInput) => {
      const updates: UserSettingsUpdate = {
        auto_sync: input.autoSync,
        sync_frequency: input.syncFrequency,
      };
      const result = await updateCurrentUserSettings(updates);
      if (!result)
        throw new Error('Failed to save repository sync preferences');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userSettingsQueryKey });
    },
  });
}

export interface UpdateNotificationSettingsInput {
  emailNotifications: boolean;
  slackNotifications: boolean;
  discordNotifications: boolean;
  slackWebhookUrl?: string | null;
  discordWebhookUrl?: string | null;
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateNotificationSettingsInput) => {
      const updates: UserSettingsUpdate = {
        email_notifications: input.emailNotifications,
        slack_notifications: input.slackNotifications,
        discord_notifications: input.discordNotifications,
        slack_webhook_url:
          input.slackWebhookUrl?.trim() || null,
        discord_webhook_url:
          input.discordWebhookUrl?.trim() || null,
      };
      const result = await updateCurrentUserSettings(updates);
      if (!result) throw new Error('Failed to save notification preferences');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userSettingsQueryKey });
    },
  });
}

async function deleteAccount(): Promise<void> {
  const response = await fetch('/api/account', { method: 'DELETE' });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error ?? 'Failed to delete account');
  }
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.clear();
      window.location.href = '/';
      toast.success('Account deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete account');
    },
  });
}
