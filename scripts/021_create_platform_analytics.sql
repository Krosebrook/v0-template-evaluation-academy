-- Platform Analytics & Reporting System
-- Admin-level analytics for platform monitoring

-- Create platform metrics table
CREATE TABLE IF NOT EXISTS platform_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  total_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  total_templates INTEGER DEFAULT 0,
  new_templates INTEGER DEFAULT 0,
  total_evaluations INTEGER DEFAULT 0,
  new_evaluations INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  new_comments INTEGER DEFAULT 0,
  avg_evaluation_score DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user activity logs
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'login', 'template_view', 'evaluation_submit', etc.
  metadata JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create geographic distribution table
CREATE TABLE IF NOT EXISTS user_geography (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  country TEXT,
  region TEXT,
  city TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create export reports table
CREATE TABLE IF NOT EXISTS export_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL, -- 'platform_overview', 'user_activity', 'template_performance'
  format TEXT NOT NULL, -- 'csv', 'pdf', 'json'
  date_range_start DATE,
  date_range_end DATE,
  file_url TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_platform_metrics_date ON platform_metrics(date);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_type ON user_activity_logs(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created ON user_activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_user_geography_user ON user_geography(user_id);
CREATE INDEX IF NOT EXISTS idx_export_reports_user ON export_reports(user_id);

-- Enable RLS
ALTER TABLE platform_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_geography ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Admin only)
CREATE POLICY "Only admins can view platform metrics"
  ON platform_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'evaluator')
    )
  );

CREATE POLICY "Only admins can view activity logs"
  ON user_activity_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can view their own geography"
  ON user_geography FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their own reports"
  ON export_reports FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own reports"
  ON export_reports FOR INSERT
  WITH CHECK (user_id = auth.uid());
