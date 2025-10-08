-- Add gender column to children table
ALTER TABLE public.children 
ADD COLUMN gender TEXT NOT NULL DEFAULT 'neutral' 
CHECK (gender IN ('girl', 'boy', 'neutral'));