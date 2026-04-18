
ALTER TABLE public.child_foods ALTER COLUMN first_tried_date DROP NOT NULL;
ALTER TABLE public.child_foods ALTER COLUMN first_tried_date DROP DEFAULT;
ALTER TABLE public.child_foods ADD COLUMN try_count integer;
