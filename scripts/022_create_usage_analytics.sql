-- Template Usage Analytics System
-- Track template views, downloads, forks, and user journeys

-- Create template views table (already exists from social sharing, enhance it)
CREATE TABLE IF NOT EXISTS template_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'view', 'download', 'fork', 'favorite', 'share'
  session_id TEXT,
  referrer TEXT,
  device_type TEXT, -- 'desktop', 'mobile', 'tablet'
  browser TEXT,
  duration_seconds INTEGER, -- time spent on page
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user journey table
CREATE TABLE IF NOT EXISTS user_journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  journey_steps JSONB[], -- array of {page, timestamp, action}
  conversion_event TEXT, -- 'evaluation_submitted', 'template_downloaded', etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Create conversion funnel table
CREATE TABLE IF NOT EXISTS conversion_funnels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  detail_views INTEGER DEFAULT 0,
  evaluations_started INTEGER DEFAULT 0,
  evaluations_completed INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create A/B test variants table
CREATE TABLE IF NOT EXISTS ab_test_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_name TEXT NOT NULL,
  variant_name TEXT NOT NULL,
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create A/B test results table
CREATE TABLE IF NOT EXISTS ab_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES ab_test_variants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  converted BOOLEAN DEFAULT false,
  conversion_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_template_analytics_template ON template_analytics(template_id);
CREATE INDEX IF NOT EXISTS idx_template_analytics_user ON template_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_template_analytics_event ON template_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_template_analytics_created ON template_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_user_journeys_user ON user_journeys(user_id);
CREATE INDEX IF NOT EXISTS idx_user_journeys_session ON user_journeys(session_id);
CREATE INDEX IF NOT EXISTS idx_conversion_funnels_template ON conversion_funnels(template_id);
CREATE INDEX IF NOT EXISTS idx_conversion_funnels_date ON conversion_funnels(date);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_variant ON ab_test_results(variant_id);

-- Enable RLS
ALTER TABLE template_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Template authors can view their analytics"
  ON template_analytics FOR SELECT
  USING (
    template_id IN (
      SELECT id FROM templates WHERE author_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own journeys"
  ON user_journeys FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Template authors can view their funnels"
  ON conversion_funnels FOR SELECT
  USING (
    template_id IN (
      SELECT id FROM templates WHERE author_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage AB tests"
  ON ab_test_variants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Anyone can view AB test results"
  ON ab_test_results FOR SELECT
  USING (true);
