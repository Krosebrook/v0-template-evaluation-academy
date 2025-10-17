-- Create template versions table
CREATE TABLE IF NOT EXISTS template_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  version_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  changelog TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_current BOOLEAN DEFAULT FALSE,
  UNIQUE(template_id, version_number)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_template_versions_template ON template_versions(template_id);
CREATE INDEX IF NOT EXISTS idx_template_versions_current ON template_versions(template_id, is_current);

-- Add version tracking to templates table
ALTER TABLE templates 
ADD COLUMN IF NOT EXISTS current_version TEXT DEFAULT '1.0.0',
ADD COLUMN IF NOT EXISTS version_count INTEGER DEFAULT 1;
