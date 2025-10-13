-- Create table for sharing children with other users
CREATE TABLE public.child_shares (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id uuid NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  shared_with_user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  UNIQUE(child_id, shared_with_user_id)
);

-- Enable RLS
ALTER TABLE public.child_shares ENABLE ROW LEVEL SECURITY;

-- Only the owner of the child can share it
CREATE POLICY "Child owners can share their children"
ON public.child_shares
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.children 
    WHERE id = child_id AND user_id = auth.uid()
  )
);

-- Users can see shares of their children or shares with them
CREATE POLICY "Users can view shares of their children or shares with them"
ON public.child_shares
FOR SELECT
USING (
  auth.uid() = shared_with_user_id OR
  EXISTS (
    SELECT 1 FROM public.children 
    WHERE id = child_id AND user_id = auth.uid()
  )
);

-- Only the owner can delete shares
CREATE POLICY "Child owners can delete shares"
ON public.child_shares
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.children 
    WHERE id = child_id AND user_id = auth.uid()
  )
);

-- Update children policies to allow shared access
DROP POLICY IF EXISTS "Users can view their own children" ON public.children;
CREATE POLICY "Users can view their own or shared children"
ON public.children
FOR SELECT
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.child_shares 
    WHERE child_id = id AND shared_with_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update their own children" ON public.children;
CREATE POLICY "Users can update their own or shared children"
ON public.children
FOR UPDATE
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.child_shares 
    WHERE child_id = id AND shared_with_user_id = auth.uid()
  )
);

-- Update milestones policies to allow shared access
DROP POLICY IF EXISTS "Users can view their own milestones" ON public.milestones;
CREATE POLICY "Users can view their own or shared milestones"
ON public.milestones
FOR SELECT
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.child_shares 
    WHERE child_id = milestones.child_id AND shared_with_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can create their own milestones" ON public.milestones;
CREATE POLICY "Users can create milestones for owned or shared children"
ON public.milestones
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.children 
    WHERE id = child_id AND (
      user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.child_shares 
        WHERE child_id = children.id AND shared_with_user_id = auth.uid()
      )
    )
  )
);

DROP POLICY IF EXISTS "Users can update their own milestones" ON public.milestones;
CREATE POLICY "Users can update milestones for owned or shared children"
ON public.milestones
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.children 
    WHERE id = child_id AND (
      user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.child_shares 
        WHERE child_id = children.id AND shared_with_user_id = auth.uid()
      )
    )
  )
);

DROP POLICY IF EXISTS "Users can delete their own milestones" ON public.milestones;
CREATE POLICY "Users can delete milestones for owned or shared children"
ON public.milestones
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.children 
    WHERE id = child_id AND (
      user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.child_shares 
        WHERE child_id = children.id AND shared_with_user_id = auth.uid()
      )
    )
  )
);