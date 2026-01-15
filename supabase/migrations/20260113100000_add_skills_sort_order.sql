-- Add sort_order to skills table
ALTER TABLE public.skills ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;

-- Update existing skills to have a sort_order based on their created_at if possible, 
-- but for now default is 0.
