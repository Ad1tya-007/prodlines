-- Create user_settings table for notification and app preferences
-- One row per user; all booleans default false for new users

CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email_notifications BOOLEAN NOT NULL DEFAULT false,
  weekly_digest BOOLEAN NOT NULL DEFAULT false,
  leaderboard_changes BOOLEAN NOT NULL DEFAULT false,
  slack_notifications BOOLEAN NOT NULL DEFAULT false,
  discord_notifications BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for lookups by user (id is already primary key; optional)
CREATE INDEX IF NOT EXISTS user_settings_id_idx ON public.user_settings(id);

-- Enable RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Users can only see their own settings
CREATE POLICY "Users can view own user_settings"
  ON public.user_settings
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own settings
CREATE POLICY "Users can update own user_settings"
  ON public.user_settings
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own settings (e.g. if row missing)
CREATE POLICY "Users can insert own user_settings"
  ON public.user_settings
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Function to create default user_settings row when a user is created (all false)
CREATE OR REPLACE FUNCTION public.handle_new_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_settings (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: after a new auth user is created, insert default user_settings
DROP TRIGGER IF EXISTS on_auth_user_created_settings ON auth.users;
CREATE TRIGGER on_auth_user_created_settings
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_settings();

-- Function to update updated_at
CREATE OR REPLACE FUNCTION public.update_user_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set updated_at on update
DROP TRIGGER IF EXISTS user_settings_updated_at ON public.user_settings;
CREATE TRIGGER user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_settings_updated_at();

-- Backfill: ensure every existing profile has a user_settings row (all false)
INSERT INTO public.user_settings (id)
SELECT p.id FROM public.profiles p
WHERE NOT EXISTS (SELECT 1 FROM public.user_settings us WHERE us.id = p.id);

-- Grant access
GRANT SELECT, INSERT, UPDATE ON public.user_settings TO authenticated;
