# Database Migrations

## Running Migrations

### Local Development

To run migrations locally with Supabase CLI:

```bash
# Start local Supabase (if not already running)
supabase start

# Run migrations
supabase db reset

# Or apply new migrations only
supabase db push
```

### Production

To run migrations on your hosted Supabase project:

```bash
# Link to your project (first time only)
supabase link --project-ref your-project-ref

# Push migrations to production
supabase db push
```

## Migration: 20260126000000_create_users_profile.sql

This migration creates the user profiles system:

### What it does:

1. **Creates `profiles` table**
   - Stores extended user information
   - Links to `auth.users` via foreign key
   - Includes fields: email, full_name, avatar_url, github_username, company, role, bio

2. **Enables Row Level Security (RLS)**
   - Users can only view/edit their own profile
   - Secure by default

3. **Creates automatic profile creation**
   - Trigger automatically creates profile when user signs up
   - Copies email and metadata from auth.users

4. **Creates helper functions**
   - `handle_new_user()` - Creates profile on signup
   - `handle_updated_at()` - Updates timestamp on changes

5. **Creates indexes**
   - Faster lookups by email and github_username

6. **Creates public_profiles view**
   - Safe view of public profile data
   - For leaderboards and public pages

### Schema

```sql
profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  github_username TEXT,
  company TEXT,
  role TEXT,
  bio TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### RLS Policies

- Users can SELECT their own profile
- Users can UPDATE their own profile
- Users can INSERT their own profile
- Public profiles view is readable by all authenticated users

## Using Profiles in Code

### Client-side

```typescript
import { getCurrentProfile, updateCurrentProfile } from '@/lib/supabase/profiles'

// Get current user's profile
const profile = await getCurrentProfile()

// Update profile
await updateCurrentProfile({
  full_name: 'John Doe',
  company: 'Acme Corp',
  role: 'Developer'
})
```

### Server-side

```typescript
import { getCurrentProfileServer } from '@/lib/supabase/profiles'

// In a server component or API route
const profile = await getCurrentProfileServer()
```

## Testing

After running the migration:

1. Sign up a new user
2. Check that profile is automatically created
3. Try updating profile fields
4. Verify RLS policies work (can't access other users' profiles)

## Rollback

If you need to rollback this migration:

```sql
-- Drop all created objects
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_updated_at();
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP VIEW IF EXISTS public.public_profiles;
DROP TABLE IF EXISTS public.profiles CASCADE;
```

Note: This will delete all profile data!
