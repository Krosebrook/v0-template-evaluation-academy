-- Evaluation Insights System
-- Provides detailed analytics for template authors

-- Create evaluation insights view
CREATE OR REPLACE VIEW evaluation_insights AS
SELECT 
  t.id as template_id,
  t.title as template_name,
  t.author_id,
  COUNT(DISTINCT e.id) as total_evaluations,
  AVG(e.code_quality) as avg_code_quality,
  AVG(e.documentation) as avg_documentation,
  AVG(e.usability) as avg_usability,
  AVG(e.design) as avg_design,
  AVG(e.performance) as avg_performance,
  AVG(e.innovation) as avg_innovation,
  AVG((e.code_quality + e.documentation + e.usability + e.design + e.performance + e.innovation) / 6.0) as overall_score,
  MAX(e.created_at) as last_evaluation_date,
  MIN(e.created_at) as first_evaluation_date
FROM templates t
LEFT JOIN evaluations e ON t.id = e.template_id
GROUP BY t.id, t.title, t.author_id;

-- Create evaluation trends table
CREATE TABLE IF NOT EXISTS evaluation_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  avg_score DECIMAL(3,2),
  evaluation_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create improvement suggestions table
CREATE TABLE IF NOT EXISTS improvement_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- 'code_quality', 'documentation', 'usability', etc.
  suggestion TEXT NOT NULL,
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'completed', 'dismissed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sentiment analysis table
CREATE TABLE IF NOT EXISTS evaluation_sentiment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id UUID REFERENCES evaluations(id) ON DELETE CASCADE,
  sentiment TEXT NOT NULL, -- 'positive', 'neutral', 'negative'
  confidence DECIMAL(3,2), -- 0.00 to 1.00
  keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_evaluation_trends_template ON evaluation_trends(template_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_trends_date ON evaluation_trends(date);
CREATE INDEX IF NOT EXISTS idx_improvement_suggestions_template ON improvement_suggestions(template_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_sentiment_evaluation ON evaluation_sentiment(evaluation_id);

-- Enable RLS
ALTER TABLE evaluation_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE improvement_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_sentiment ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view trends for their templates"
  ON evaluation_trends FOR SELECT
  USING (
    template_id IN (
      SELECT id FROM templates WHERE author_id = auth.uid()
    )
  );

CREATE POLICY "Users can view suggestions for their templates"
  ON improvement_suggestions FOR SELECT
  USING (
    template_id IN (
      SELECT id FROM templates WHERE author_id = auth.uid()
    )
  );

CREATE POLICY "Users can update suggestions for their templates"
  ON improvement_suggestions FOR UPDATE
  USING (
    template_id IN (
      SELECT id FROM templates WHERE author_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view sentiment"
  ON evaluation_sentiment FOR SELECT
  USING (true);
