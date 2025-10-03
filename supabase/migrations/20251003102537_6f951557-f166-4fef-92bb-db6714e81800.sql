-- Create children table to store child information
CREATE TABLE public.children (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  birthdate DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own children" 
ON public.children 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own children" 
ON public.children 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own children" 
ON public.children 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own children" 
ON public.children 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_children_user_id ON public.children(user_id);