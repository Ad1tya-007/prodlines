-- Create github_stats table to cache GitHub contributor stats per user per repo
CREATE TABLE IF NOT EXISTS public.github_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  owner TEXT NOT NULL,
  repo TEXT NOT NULL,
  branch TEXT NOT NULL DEFAULT 'main',
  stats JSONB NOT NULL,
  last_synced_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, owner, repo, branch)
);

CREATE INDEX IF NOT EXISTS github_stats_user_repo_idx
  ON public.github_stats(user_id, owner, repo, branch);

ALTER TABLE public.github_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own github_stats"
  ON public.github_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own github_stats"
  ON public.github_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own github_stats"
  ON public.github_stats FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE ON public.github_stats TO authenticated;
