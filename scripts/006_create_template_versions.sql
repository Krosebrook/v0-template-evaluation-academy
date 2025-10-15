-- Add version field to templates table
ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS is_latest BOOLEAN DEFAULT TRUE;
ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS parent_template_id UUID REFERENCES public.templates(id) ON DELETE SET NULL;

-- Create template_versions table for tracking changes
CREATE TABLE IF NOT EXISTS public.template_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  preview_image TEXT,
  github_url TEXT,
  demo_url TEXT,
  changelog TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_template_versions_template_id ON public.template_versions(template_id);
CREATE INDEX IF NOT EXISTS idx_template_versions_version ON public.template_versions(version DESC);
CREATE INDEX IF NOT EXISTS idx_templates_parent_id ON public.templates(parent_template_id);

-- Enable RLS
ALTER TABLE public.template_versions ENABLE ROW LEVEL SECURITY;

-- Anyone can view template versions
CREATE POLICY "Anyone can view template versions"
  ON public.template_versions
  FOR SELECT
  USING (true);

-- Template owners can create versions
CREATE POLICY "Template owners can create versions"
  ON public.template_versions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.templates
      WHERE id = template_id AND user_id = auth.uid()
    )
  );

-- Function to create a new template version
CREATE OR REPLACE FUNCTION create_template_version(
  p_template_id UUID,
  p_title TEXT,
  p_description TEXT,
  p_category TEXT,
  p_difficulty TEXT,
  p_tags TEXT[],
  p_preview_image TEXT,
  p_github_url TEXT,
  p_demo_url TEXT,
  p_changelog TEXT
)
RETURNS UUID AS $$
DECLARE
  v_current_version INTEGER;
  v_new_version INTEGER;
  v_new_template_id UUID;
  v_user_id UUID;
BEGIN
  -- Get current version and user
  SELECT version, user_id INTO v_current_version, v_user_id
  FROM public.templates
  WHERE id = p_template_id;
  
  v_new_version := v_current_version + 1;
  
  -- Archive current version
  INSERT INTO public.template_versions (
    template_id, version, title, description, category, difficulty,
    tags, preview_image, github_url, demo_url, changelog, created_by
  )
  SELECT 
    id, version, title, description, category, difficulty,
    tags, preview_image, github_url, demo_url, 'Initial version', user_id
  FROM public.templates
  WHERE id = p_template_id;
  
  -- Mark old version as not latest
  UPDATE public.templates
  SET is_latest = FALSE
  WHERE id = p_template_id;
  
  -- Create new version as a new template entry
  INSERT INTO public.templates (
    user_id, title, description, category, difficulty, tags,
    preview_image, github_url, demo_url, status, version,
    is_latest, parent_template_id
  )
  VALUES (
    v_user_id, p_title, p_description, p_category, p_difficulty, p_tags,
    p_preview_image, p_github_url, p_demo_url, 'pending', v_new_version,
    TRUE, p_template_id
  )
  RETURNING id INTO v_new_template_id;
  
  -- Record the new version
  INSERT INTO public.template_versions (
    template_id, version, title, description, category, difficulty,
    tags, preview_image, github_url, demo_url, changelog, created_by
  )
  VALUES (
    v_new_template_id, v_new_version, p_title, p_description, p_category,
    p_difficulty, p_tags, p_preview_image, p_github_url, p_demo_url,
    p_changelog, v_user_id
  );
  
  RETURN v_new_template_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
