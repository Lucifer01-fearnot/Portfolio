-- Add avatar_url to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
