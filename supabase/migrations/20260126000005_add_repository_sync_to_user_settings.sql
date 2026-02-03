-- Add repository sync preferences to user_settings
ALTER TABLE public.user_settings
  ADD COLUMN IF NOT EXISTS auto_sync BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS sync_frequency TEXT NOT NULL DEFAULT 'hourly'
    CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'weekly'));
