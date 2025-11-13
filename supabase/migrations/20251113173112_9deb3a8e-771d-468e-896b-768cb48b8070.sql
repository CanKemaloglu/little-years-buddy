-- Add parent names to children table
ALTER TABLE public.children 
ADD COLUMN father_name TEXT,
ADD COLUMN mother_name TEXT;