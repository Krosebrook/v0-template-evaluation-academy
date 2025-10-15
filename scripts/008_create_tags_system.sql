-- Create tags and taxonomy system

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('technology', 'feature', 'use-case', 'framework')),
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Template tags junction table
CREATE TABLE IF NOT EXISTS template_tags (
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (template_id, tag_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tags_category ON tags(category);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_template_tags_template ON template_tags(template_id);
CREATE INDEX IF NOT EXISTS idx_template_tags_tag ON template_tags(tag_id);

-- Enable RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage tags" ON tags FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.role = 'admin'
  )
);

CREATE POLICY "Anyone can view template tags" ON template_tags FOR SELECT USING (true);
CREATE POLICY "Template owners can add tags" ON template_tags FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM templates
    WHERE templates.id = template_id
    AND templates.user_id = auth.uid()
  )
);
CREATE POLICY "Template owners can remove tags" ON template_tags FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM templates
    WHERE templates.id = template_id
    AND templates.user_id = auth.uid()
  )
);

-- Insert default tags
INSERT INTO tags (name, slug, category, description, color) VALUES
  -- Technology tags
  ('React', 'react', 'technology', 'React framework', '#61dafb'),
  ('Next.js', 'nextjs', 'technology', 'Next.js framework', '#000000'),
  ('Vue', 'vue', 'technology', 'Vue.js framework', '#42b883'),
  ('Tailwind CSS', 'tailwind', 'technology', 'Tailwind CSS utility framework', '#06b6d4'),
  ('TypeScript', 'typescript', 'technology', 'TypeScript language', '#3178c6'),
  ('JavaScript', 'javascript', 'technology', 'JavaScript language', '#f7df1e'),
  
  -- Feature tags
  ('Authentication', 'authentication', 'feature', 'User authentication system', '#8b5cf6'),
  ('Dark Mode', 'dark-mode', 'feature', 'Dark mode support', '#1f2937'),
  ('Responsive', 'responsive', 'feature', 'Mobile responsive design', '#10b981'),
  ('Animations', 'animations', 'feature', 'Animated components', '#f59e0b'),
  ('Forms', 'forms', 'feature', 'Form handling', '#3b82f6'),
  ('Database', 'database', 'feature', 'Database integration', '#ef4444'),
  
  -- Use case tags
  ('Landing Page', 'landing-page', 'use-case', 'Landing page template', '#ec4899'),
  ('Dashboard', 'dashboard', 'use-case', 'Dashboard template', '#6366f1'),
  ('E-commerce', 'e-commerce', 'use-case', 'E-commerce template', '#14b8a6'),
  ('Blog', 'blog', 'use-case', 'Blog template', '#f97316'),
  ('Portfolio', 'portfolio', 'use-case', 'Portfolio template', '#a855f7'),
  ('SaaS', 'saas', 'use-case', 'SaaS application template', '#0ea5e9'),
  
  -- Framework tags
  ('Supabase', 'supabase', 'framework', 'Supabase backend', '#3ecf8e'),
  ('Firebase', 'firebase', 'framework', 'Firebase backend', '#ffca28'),
  ('Prisma', 'prisma', 'framework', 'Prisma ORM', '#2d3748'),
  ('Stripe', 'stripe', 'framework', 'Stripe payments', '#635bff')
ON CONFLICT (slug) DO NOTHING;
