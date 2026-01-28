-- Create repositories table to store user's connected GitHub repositories
CREATE TABLE IF NOT EXISTS public.repositories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  github_repo_id BIGINT NOT NULL,
  full_name TEXT NOT NULL,
  name TEXT NOT NULL,
  owner TEXT NOT NULL,
  description TEXT,
  private BOOLEAN DEFAULT false,
  default_branch TEXT NOT NULL DEFAULT 'main',
  language TEXT,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a user can't add the same repository twice
  UNIQUE(user_id, github_repo_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS repositories_user_id_idx ON public.repositories(user_id);
CREATE INDEX IF NOT EXISTS repositories_user_id_active_idx ON public.repositories(user_id, is_active);
CREATE INDEX IF NOT EXISTS repositories_full_name_idx ON public.repositories(full_name);

-- Enable RLS
ALTER TABLE public.repositories ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own repositories
CREATE POLICY "Users can view their own repositories"
  ON public.repositories
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own repositories
CREATE POLICY "Users can insert their own repositories"
  ON public.repositories
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own repositories
CREATE POLICY "Users can update their own repositories"
  ON public.repositories
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own repositories
CREATE POLICY "Users can delete their own repositories"
  ON public.repositories
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_repositories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_repositories_updated_at
  BEFORE UPDATE ON public.repositories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_repositories_updated_at();

-- Grant access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.repositories TO authenticated;
