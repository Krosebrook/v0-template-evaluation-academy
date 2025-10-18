-- Drop the existing foreign key constraint on templates.submitted_by
ALTER TABLE public.templates 
DROP CONSTRAINT IF EXISTS templates_submitted_by_fkey;

-- Add a new foreign key constraint that references profiles instead of auth.users
-- This allows Supabase to properly resolve the relationship in queries
ALTER TABLE public.templates 
ADD CONSTRAINT templates_submitted_by_fkey 
FOREIGN KEY (submitted_by) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- Do the same for evaluations.evaluator_id
ALTER TABLE public.evaluations 
DROP CONSTRAINT IF EXISTS evaluations_evaluator_id_fkey;

ALTER TABLE public.evaluations 
ADD CONSTRAINT evaluations_evaluator_id_fkey 
FOREIGN KEY (evaluator_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
