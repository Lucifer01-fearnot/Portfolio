-- Add pdf_url column to certificates table
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS pdf_url TEXT;
