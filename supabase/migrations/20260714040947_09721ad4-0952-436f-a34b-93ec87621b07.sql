-- Extend feedback table to support sentiment submissions with selected chips (tags).
ALTER TABLE public.feedback
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';

-- Update the check constraint so 'sentiment' kind is accepted (rating 1..5 required).
ALTER TABLE public.feedback DROP CONSTRAINT IF EXISTS feedback_kind_check;
ALTER TABLE public.feedback DROP CONSTRAINT IF EXISTS feedback_check;

ALTER TABLE public.feedback
  ADD CONSTRAINT feedback_kind_rating_check CHECK (
    (kind = 'rating' AND rating IS NOT NULL)
    OR (kind = 'message' AND rating IS NULL)
    OR (kind = 'sentiment' AND rating IS NOT NULL AND rating BETWEEN 1 AND 5)
  );