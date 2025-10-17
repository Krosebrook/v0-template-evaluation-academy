-- AI-powered features tables
CREATE TABLE IF NOT EXISTS template_quality_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  completeness_score INTEGER NOT NULL,
  clarity_score INTEGER NOT NULL,
  uniqueness_score INTEGER NOT NULL,
  engagement_score INTEGER NOT NULL,
  ai_analysis JSONB,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(template_id)
);

CREATE TABLE IF NOT EXISTS ai_suggested_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  score DECIMAL(5,4) NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, template_id)
);

CREATE INDEX idx_quality_scores_template ON template_quality_scores(template_id);
CREATE INDEX idx_ai_tags_template ON ai_suggested_tags(template_id);
CREATE INDEX idx_recommendations_user ON user_recommendations(user_id);
CREATE INDEX idx_recommendations_score ON user_recommendations(score DESC);
