-- AI-Powered Recommendations System
-- Tracks user behavior and generates personalized recommendations

-- User interactions table
CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'evaluate', 'favorite', 'download', 'share')),
  interaction_weight DECIMAL NOT NULL DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Template similarities table (for content-based filtering)
CREATE TABLE IF NOT EXISTS template_similarities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  similar_template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  similarity_score DECIMAL NOT NULL CHECK (similarity_score >= 0 AND similarity_score <= 1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(template_id, similar_template_id)
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_categories TEXT[] DEFAULT '{}',
  preferred_difficulties TEXT[] DEFAULT '{}',
  preferred_tags TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Recommendation scores view (collaborative filtering)
CREATE OR REPLACE VIEW recommendation_scores AS
WITH user_template_scores AS (
  SELECT 
    user_id,
    template_id,
    SUM(
      CASE interaction_type
        WHEN 'view' THEN 1
        WHEN 'evaluate' THEN 5
        WHEN 'favorite' THEN 3
        WHEN 'download' THEN 2
        WHEN 'share' THEN 2
      END
    ) as score
  FROM user_interactions
  WHERE created_at > NOW() - INTERVAL '90 days'
  GROUP BY user_id, template_id
),
similar_users AS (
  SELECT 
    u1.user_id as user_id,
    u2.user_id as similar_user_id,
    COUNT(*) as common_templates,
    CORR(u1.score, u2.score) as similarity
  FROM user_template_scores u1
  JOIN user_template_scores u2 ON u1.template_id = u2.template_id AND u1.user_id != u2.user_id
  GROUP BY u1.user_id, u2.user_id
  HAVING COUNT(*) >= 3
)
SELECT 
  su.user_id,
  uts.template_id,
  AVG(uts.score * su.similarity) as recommendation_score
FROM similar_users su
JOIN user_template_scores uts ON su.similar_user_id = uts.user_id
WHERE NOT EXISTS (
  SELECT 1 FROM user_template_scores uts2 
  WHERE uts2.user_id = su.user_id AND uts2.template_id = uts.template_id
)
GROUP BY su.user_id, uts.template_id;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_interactions_user ON user_interactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_interactions_template ON user_interactions(template_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_template_similarities_template ON template_similarities(template_id, similarity_score DESC);

-- RLS Policies
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_similarities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own interactions"
  ON user_interactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interactions"
  ON user_interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view template similarities"
  ON template_similarities FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage template similarities"
  ON template_similarities FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own preferences"
  ON user_preferences FOR ALL
  USING (auth.uid() = user_id);
