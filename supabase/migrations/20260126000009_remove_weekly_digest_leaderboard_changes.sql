ALTER TABLE public.user_settings
  DROP COLUMN IF EXISTS weekly_digest,
  DROP COLUMN IF EXISTS leaderboard_changes;
