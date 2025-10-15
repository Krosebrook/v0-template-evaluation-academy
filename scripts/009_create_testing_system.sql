-- Create template tests table
CREATE TABLE IF NOT EXISTS template_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  test_type VARCHAR(50) NOT NULL, -- 'lighthouse', 'accessibility', 'security', 'links', 'code_quality'
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'running', 'passed', 'failed'
  score INTEGER, -- 0-100 score for the test
  results JSONB, -- Detailed test results
  error_message TEXT,
  run_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_template_tests_template_id ON template_tests(template_id);
CREATE INDEX idx_template_tests_status ON template_tests(status);
CREATE INDEX idx_template_tests_test_type ON template_tests(test_type);

-- Create test summary view
CREATE OR REPLACE VIEW template_test_summary AS
SELECT 
  template_id,
  COUNT(*) as total_tests,
  COUNT(*) FILTER (WHERE status = 'passed') as passed_tests,
  COUNT(*) FILTER (WHERE status = 'failed') as failed_tests,
  AVG(score) FILTER (WHERE score IS NOT NULL) as average_score,
  MAX(run_at) as last_run_at
FROM template_tests
GROUP BY template_id;

-- Enable RLS
ALTER TABLE template_tests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view test results"
  ON template_tests FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert test results"
  ON template_tests FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'evaluator')
    )
  );

CREATE POLICY "Admins can update test results"
  ON template_tests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'evaluator')
    )
  );
