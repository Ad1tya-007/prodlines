-- Remove company, role, and bio columns from profiles table
-- Update trigger to populate github_username from GitHub OAuth metadata

-- Drop the view first since it depends on the columns
DROP VIEW IF EXISTS public.public_profiles;

-- Drop the old trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Remove columns
ALTER TABLE public.profiles 
  DROP COLUMN IF EXISTS company,
  DROP COLUMN IF EXISTS role,
  DROP COLUMN IF EXISTS bio;

-- Recreate function to handle new user creation with github_username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  github_username_value TEXT;
BEGIN
  -- Extract github_username from raw_user_meta_data
  -- GitHub OAuth typically provides: user_name, preferred_username, or login
  github_username_value := COALESCE(
    NEW.raw_user_meta_data->>'user_name',
    NEW.raw_user_meta_data->>'preferred_username',
    NEW.raw_user_meta_data->>'login',
    -- Extract from email if it's a GitHub email
    CASE 
      WHEN NEW.email LIKE '%@users.noreply.github.com' THEN
        SPLIT_PART(NEW.email, '@', 1)
      ELSE NULL
    END
  );

  INSERT INTO public.profiles (id, email, full_name, avatar_url, github_username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name'
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    ),
    github_username_value
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update existing profiles to populate github_username from user metadata
UPDATE public.profiles p
SET github_username = COALESCE(
  (SELECT raw_user_meta_data->>'user_name' FROM auth.users WHERE id = p.id),
  (SELECT raw_user_meta_data->>'preferred_username' FROM auth.users WHERE id = p.id),
  (SELECT raw_user_meta_data->>'login' FROM auth.users WHERE id = p.id),
  CASE 
    WHEN (SELECT email FROM auth.users WHERE id = p.id) LIKE '%@users.noreply.github.com' THEN
      SPLIT_PART((SELECT email FROM auth.users WHERE id = p.id), '@', 1)
    ELSE NULL
  END
)
WHERE github_username IS NULL;

-- Recreate the public_profiles view without removed columns
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  full_name,
  avatar_url,
  github_username,
  created_at
FROM public.profiles;

-- Enable RLS on the view
ALTER VIEW public.public_profiles SET (security_invoker = on);

-- Grant access
GRANT SELECT ON public.public_profiles TO authenticated;
