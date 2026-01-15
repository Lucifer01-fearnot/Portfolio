-- Add is_available to profiles table
ALTER TABLE public.profiles ADD COLUMN is_available BOOLEAN NOT NULL DEFAULT true;
