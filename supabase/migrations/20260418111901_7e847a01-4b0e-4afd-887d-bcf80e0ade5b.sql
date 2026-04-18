
-- 1. Restrict children UPDATE to owner only
DROP POLICY IF EXISTS "Users can update their own or shared children" ON public.children;

CREATE POLICY "Users can update their own children"
ON public.children
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. Make milestone-photos bucket private
UPDATE storage.buckets SET public = false WHERE id = 'milestone-photos';

-- 3. Replace public SELECT policy with authenticated, user-scoped access
DROP POLICY IF EXISTS "Milestone photos are publicly accessible" ON storage.objects;

CREATE POLICY "Users can view milestone photos in their folder"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'milestone-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
