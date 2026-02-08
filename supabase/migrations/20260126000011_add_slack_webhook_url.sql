ALTER TABLE public.user_settings
  ADD COLUMN IF NOT EXISTS slack_webhook_url TEXT;
