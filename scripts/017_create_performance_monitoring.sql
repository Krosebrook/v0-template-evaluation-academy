-- Performance Monitoring System
-- Tracks Core Web Vitals, uptime, and performance metrics for templates

-- Performance metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('lcp', 'fid', 'cls', 'ttfb', 'fcp')),
  value DECIMAL NOT NULL,
  url TEXT NOT NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Uptime monitoring table
CREATE TABLE IF NOT EXISTS uptime_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  status_code INTEGER NOT NULL,
  response_time INTEGER NOT NULL, -- in milliseconds
  is_up BOOLEAN NOT NULL,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance alerts table
CREATE TABLE IF NOT EXISTS performance_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('performance_degradation', 'downtime', 'slow_response')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Performance summary view
CREATE OR REPLACE VIEW performance_summary AS
SELECT 
  t.id as template_id,
  t.title,
  -- Core Web Vitals averages (last 30 days)
  AVG(CASE WHEN pm.metric_type = 'lcp' THEN pm.value END) as avg_lcp,
  AVG(CASE WHEN pm.metric_type = 'fid' THEN pm.value END) as avg_fid,
  AVG(CASE WHEN pm.metric_type = 'cls' THEN pm.value END) as avg_cls,
  AVG(CASE WHEN pm.metric_type = 'ttfb' THEN pm.value END) as avg_ttfb,
  -- Uptime percentage (last 30 days)
  (COUNT(CASE WHEN uc.is_up THEN 1 END)::DECIMAL / NULLIF(COUNT(uc.id), 0) * 100) as uptime_percentage,
  AVG(uc.response_time) as avg_response_time,
  -- Alert counts
  COUNT(DISTINCT CASE WHEN pa.is_resolved = FALSE THEN pa.id END) as active_alerts
FROM templates t
LEFT JOIN performance_metrics pm ON t.id = pm.template_id 
  AND pm.created_at > NOW() - INTERVAL '30 days'
LEFT JOIN uptime_checks uc ON t.id = uc.template_id 
  AND uc.checked_at > NOW() - INTERVAL '30 days'
LEFT JOIN performance_alerts pa ON t.id = pa.template_id
GROUP BY t.id, t.title;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_performance_metrics_template ON performance_metrics(template_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_uptime_checks_template ON uptime_checks(template_id, checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_performance_alerts_template ON performance_alerts(template_id, is_resolved);

-- RLS Policies
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE uptime_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_alerts ENABLE ROW LEVEL SECURITY;

-- Anyone can view performance metrics
CREATE POLICY "Anyone can view performance metrics"
  ON performance_metrics FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view uptime checks"
  ON uptime_checks FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view performance alerts"
  ON performance_alerts FOR SELECT
  USING (true);

-- Only admins can insert/update
CREATE POLICY "Admins can manage performance metrics"
  ON performance_metrics FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage uptime checks"
  ON uptime_checks FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage performance alerts"
  ON performance_alerts FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
