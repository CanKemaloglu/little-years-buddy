-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their own or shared children" ON public.children;
DROP POLICY IF EXISTS "Users can update their own or shared children" ON public.children;
DROP POLICY IF EXISTS "Users can view shares of their children or shares with them" ON public.child_shares;

DROP POLICY IF EXISTS "Users can view their own or shared milestones" ON public.milestones;
DROP POLICY IF EXISTS "Users can create milestones for owned or shared children" ON public.milestones;
DROP POLICY IF EXISTS "Users can update milestones for owned or shared children" ON public.milestones;
DROP POLICY IF EXISTS "Users can delete milestones for owned or shared children" ON public.milestones;

-- Create security definer functions to break the recursion
CREATE OR REPLACE FUNCTION public.user_has_child_access(_child_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.children 
    WHERE id = _child_id AND user_id = _user_id
  ) OR EXISTS (
    SELECT 1 FROM public.child_shares 
    WHERE child_id = _child_id AND shared_with_user_id = _user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.user_owns_child(_child_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.children 
    WHERE id = _child_id AND user_id = _user_id
  );
$$;

-- Recreate children policies using security definer functions
CREATE POLICY "Users can view their own or shared children"
ON public.children
FOR SELECT
USING (
  auth.uid() = user_id OR
  public.user_has_child_access(id, auth.uid())
);

CREATE POLICY "Users can update their own or shared children"
ON public.children
FOR UPDATE
USING (
  public.user_has_child_access(id, auth.uid())
);

-- Recreate child_shares policies
CREATE POLICY "Users can view shares of their children or shares with them"
ON public.child_shares
FOR SELECT
USING (
  auth.uid() = shared_with_user_id OR
  public.user_owns_child(child_id, auth.uid())
);

-- Recreate milestones policies
CREATE POLICY "Users can view their own or shared milestones"
ON public.milestones
FOR SELECT
USING (
  public.user_has_child_access(child_id, auth.uid())
);

CREATE POLICY "Users can create milestones for owned or shared children"
ON public.milestones
FOR INSERT
WITH CHECK (
  public.user_has_child_access(child_id, auth.uid())
);

CREATE POLICY "Users can update milestones for owned or shared children"
ON public.milestones
FOR UPDATE
USING (
  public.user_has_child_access(child_id, auth.uid())
);

CREATE POLICY "Users can delete milestones for owned or shared children"
ON public.milestones
FOR DELETE
USING (
  public.user_has_child_access(child_id, auth.uid())
);