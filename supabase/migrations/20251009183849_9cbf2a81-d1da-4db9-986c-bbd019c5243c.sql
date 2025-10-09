-- Add animal column to children table
ALTER TABLE children ADD COLUMN animal TEXT NOT NULL DEFAULT 'bunny';

-- Add a check constraint to ensure valid animal values
ALTER TABLE children ADD CONSTRAINT valid_animal CHECK (animal IN ('bunny', 'bear', 'fox', 'panda', 'koala'));