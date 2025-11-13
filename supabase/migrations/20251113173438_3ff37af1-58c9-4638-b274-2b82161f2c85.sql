-- Add role column to child_shares table
CREATE TYPE public.parent_role AS ENUM ('father', 'mother');

ALTER TABLE public.child_shares 
ADD COLUMN role public.parent_role;