export type SyncFrequency = 'realtime' | 'hourly' | 'daily' | 'weekly';

export interface UserSettings {
  id: string;
  email_notifications: boolean;
  slack_notifications: boolean;
  discord_notifications: boolean;
  discord_webhook_url: string | null;
  auto_sync: boolean;
  sync_frequency: SyncFrequency;
  created_at: string;
  updated_at: string;
}

export interface UserSettingsUpdate {
  email_notifications?: boolean;
  slack_notifications?: boolean;
  discord_notifications?: boolean;
  discord_webhook_url?: string | null;
  auto_sync?: boolean;
  sync_frequency?: SyncFrequency;
}

const FETCH_TIMEOUT_MS = 10_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), ms)
    ),
  ]);
}

export async function getCurrentUserSettings(): Promise<UserSettings | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await withTimeout(
      fetch('/api/user-settings', { signal: controller.signal }),
      FETCH_TIMEOUT_MS
    );
    clearTimeout(timeoutId);

    if (!response.ok) return null;
    return response.json();
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

export async function updateCurrentUserSettings(
  updates: UserSettingsUpdate
): Promise<UserSettings | null> {
  const response = await fetch('/api/user-settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    console.error('Error updating user settings:', response.statusText);
    return null;
  }

  return response.json();
}
