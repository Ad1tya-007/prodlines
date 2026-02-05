import { createClient } from './client';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  message: string;
  metadata: Record<string, unknown> | null;
  seen: boolean;
  created_at: string;
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
  return data ?? [];
}

export async function markNotificationSeen(
  notificationId: string,
  userId: string
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('notifications')
    .update({ seen: true })
    .eq('id', notificationId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error marking notification seen:', error);
    return false;
  }
  return true;
}

export async function markAllNotificationsSeen(
  userId: string
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('notifications')
    .update({ seen: true })
    .eq('user_id', userId)
    .eq('seen', false);

  if (error) {
    console.error('Error marking all notifications seen:', error);
    return false;
  }
  return true;
}

export async function createNotification(
  userId: string,
  type: string,
  message: string,
  metadata?: Record<string, unknown>
): Promise<Notification | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type,
      message,
      metadata: metadata ?? null,
      seen: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating notification:', error);
    return null;
  }
  return data;
}
