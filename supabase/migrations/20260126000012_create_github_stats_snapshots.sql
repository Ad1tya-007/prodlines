-- Store snapshots on each sync for trend calculation
CREATE TABLE IF NOT EXISTS public.github_stats_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  owner TEXT NOT NULL,
  repo TEXT NOT NULL,
  branch TEXT NOT NULL DEFAULT 'main',
  production_loc BIGINT NOT NULL,
  active_contributors INTEGER NOT NULL,
  merged_prs_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS github_stats_snapshots_lookup_idx
  ON public.github_stats_snapshots(user_id, owner, repo, branch, created_at DESC);

ALTER TABLE public.github_stats_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own github_stats_snapshots"
  ON public.github_stats_snapshots FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own github_stats_snapshots"
  ON public.github_stats_snapshots FOR INSERT
  WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT ON public.github_stats_snapshots TO authenticated;
