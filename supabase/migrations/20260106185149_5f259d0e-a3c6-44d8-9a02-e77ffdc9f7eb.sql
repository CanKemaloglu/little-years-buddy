
-- Create measurements table for tracking child growth
CREATE TABLE public.measurements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  measurement_date DATE NOT NULL,
  height_cm DECIMAL(5,2),
  weight_kg DECIMAL(5,2),
  head_circumference_cm DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;

-- RLS Policies using existing child access function
CREATE POLICY "Users can view measurements for accessible children"
ON public.measurements FOR SELECT
USING (user_has_child_access(child_id, auth.uid()));

CREATE POLICY "Users can create measurements for accessible children"
ON public.measurements FOR INSERT
WITH CHECK (user_has_child_access(child_id, auth.uid()));

CREATE POLICY "Users can update measurements for accessible children"
ON public.measurements FOR UPDATE
USING (user_has_child_access(child_id, auth.uid()));

CREATE POLICY "Users can delete measurements for accessible children"
ON public.measurements FOR DELETE
USING (user_has_child_access(child_id, auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_measurements_updated_at
BEFORE UPDATE ON public.measurements
FOR EACH ROW
EXECUTE FUNCTION public.update_milestone_updated_at();

-- Add index for faster queries
CREATE INDEX idx_measurements_child_date ON public.measurements(child_id, measurement_date DESC);
