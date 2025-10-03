-- Create storage bucket for milestone photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('milestone-photos', 'milestone-photos', true);

-- Create milestones table
CREATE TABLE public.milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  milestone_date DATE NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for milestones
CREATE POLICY "Users can view their own milestones"
ON public.milestones
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own milestones"
ON public.milestones
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own milestones"
ON public.milestones
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own milestones"
ON public.milestones
FOR DELETE
USING (auth.uid() = user_id);

-- Create storage policies for milestone photos
CREATE POLICY "Milestone photos are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'milestone-photos');

CREATE POLICY "Users can upload their own milestone photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'milestone-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own milestone photos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'milestone-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own milestone photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'milestone-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_milestone_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_milestones_updated_at
BEFORE UPDATE ON public.milestones
FOR EACH ROW
EXECUTE FUNCTION public.update_milestone_updated_at();

-- Add index for better query performance
CREATE INDEX idx_milestones_child_id ON public.milestones(child_id);
CREATE INDEX idx_milestones_milestone_date ON public.milestones(milestone_date);