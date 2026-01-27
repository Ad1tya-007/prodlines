-- Create function to sync github_username from auth user metadata
-- This can be called after OAuth login to ensure github_username is populated

CREATE OR REPLACE FUNCTION public.sync_github_username(user_id UUID)
RETURNS void AS $$
DECLARE
  github_username_value TEXT;
BEGIN
  -- Extract github_username from user metadata
  SELECT COALESCE(
    (SELECT raw_user_meta_data->>'user_name' FROM auth.users WHERE id = user_id),
    (SELECT raw_user_meta_data->>'preferred_username' FROM auth.users WHERE id = user_id),
    (SELECT raw_user_meta_data->>'login' FROM auth.users WHERE id = user_id),
    CASE 
      WHEN (SELECT email FROM auth.users WHERE id = user_id) LIKE '%@users.noreply.github.com' THEN
        SPLIT_PART((SELECT email FROM auth.users WHERE id = user_id), '@', 1)
      ELSE NULL
    END
  ) INTO github_username_value;

  -- Update profile if github_username is found and profile exists
  IF github_username_value IS NOT NULL THEN
    UPDATE public.profiles
    SET github_username = github_username_value
    WHERE id = user_id AND (github_username IS NULL OR github_username != github_username_value);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.sync_github_username(UUID) TO authenticated;
