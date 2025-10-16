-- User Reputation & Trust Scores System
-- Calculates and tracks user reputation based on contributions

-- Reputation scores table
CREATE TABLE IF NOT EXISTS user_reputation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_score INTEGER DEFAULT 0,
  evaluation_quality_score INTEGER DEFAULT 0,
  template_submission_score INTEGER DEFAULT 0,
  community_contribution_score INTEGER DEFAULT 0,
  consistency_score INTEGER DEFAULT 0,
  level TEXT DEFAULT 'Bronze',
  rank INTEGER,
  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Reputation history
CREATE TABLE IF NOT EXISTS reputation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  points_change INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievement definitions
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  points_required INTEGER,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default achievements
INSERT INTO achievements (name, description, icon, points_required, category) VALUES
  ('First Template', 'Submit your first template', '🎯', 10, 'templates'),
  ('Template Master', 'Submit 10 templates', '🏆', 100, 'templates'),
  ('First Evaluation', 'Complete your first evaluation', '⭐', 10, 'evaluations'),
  ('Evaluation Expert', 'Complete 50 evaluations', '💎', 250, 'evaluations'),
  ('Community Helper', 'Receive 100 helpful votes', '🤝', 200, 'community'),
  ('Top Contributor', 'Reach 1000 reputation points', '👑', 1000, 'reputation'),
  ('Consistency Champion', 'Maintain 90%+ consistency for 30 days', '🎖️', 300, 'quality')
ON CONFLICT (name) DO NOTHING;

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Trust scores
CREATE TABLE IF NOT EXISTS user_trust_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  accuracy_score DECIMAL(5,2) DEFAULT 0,
  reliability_score DECIMAL(5,2) DEFAULT 0,
  helpfulness_score DECIMAL(5,2) DEFAULT 0,
  overall_trust_score DECIMAL(5,2) DEFAULT 0,
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_reputation_user_id ON user_reputation(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reputation_total_score ON user_reputation(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_reputation_history_user_id ON reputation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_trust_scores_user_id ON user_trust_scores(user_id);

-- RLS Policies
ALTER TABLE user_reputation ENABLE ROW LEVEL SECURITY;
ALTER TABLE reputation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_trust_scores ENABLE ROW LEVEL SECURITY;

-- Reputation is public
CREATE POLICY "User reputation is viewable by everyone"
  ON user_reputation FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own reputation"
  ON user_reputation FOR UPDATE
  USING (auth.uid() = user_id);

-- Reputation history policies
CREATE POLICY "Users can view their own reputation history"
  ON reputation_history FOR SELECT
  USING (auth.uid() = user_id);

-- Achievements are public
CREATE POLICY "Achievements are viewable by everyone"
  ON achievements FOR SELECT
  USING (true);

-- User achievements are public
CREATE POLICY "User achievements are viewable by everyone"
  ON user_achievements FOR SELECT
  USING (true);

-- Trust scores are public
CREATE POLICY "Trust scores are viewable by everyone"
  ON user_trust_scores FOR SELECT
  USING (true);

-- Function to calculate user reputation
CREATE OR REPLACE FUNCTION calculate_user_reputation(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_eval_quality INTEGER;
  v_template_score INTEGER;
  v_community_score INTEGER;
  v_consistency_score INTEGER;
  v_total_score INTEGER;
  v_level TEXT;
BEGIN
  -- Calculate evaluation quality score (40% weight)
  SELECT COALESCE(COUNT(*) * 5, 0) INTO v_eval_quality
  FROM evaluations
  WHERE user_id = p_user_id;

  -- Calculate template submission score (30% weight)
  SELECT COALESCE(COUNT(*) * 10, 0) INTO v_template_score
  FROM templates
  WHERE user_id = p_user_id;

  -- Calculate community contribution score (20% weight)
  SELECT COALESCE(SUM(
    CASE 
      WHEN type = 'comment' THEN 2
      WHEN type = 'helpful_vote' THEN 1
      ELSE 0
    END
  ), 0) INTO v_community_score
  FROM (
    SELECT 'comment' as type FROM comments WHERE user_id = p_user_id
    UNION ALL
    SELECT 'helpful_vote' FROM evaluation_reactions WHERE user_id = p_user_id
  ) contributions;

  -- Calculate consistency score (10% weight) - simplified
  v_consistency_score := LEAST(100, v_eval_quality / 2);

  -- Calculate total score
  v_total_score := v_eval_quality + v_template_score + v_community_score + v_consistency_score;

  -- Determine level
  IF v_total_score >= 1000 THEN
    v_level := 'Platinum';
  ELSIF v_total_score >= 500 THEN
    v_level := 'Gold';
  ELSIF v_total_score >= 200 THEN
    v_level := 'Silver';
  ELSE
    v_level := 'Bronze';
  END IF;

  -- Update or insert reputation
  INSERT INTO user_reputation (
    user_id, total_score, evaluation_quality_score, 
    template_submission_score, community_contribution_score, 
    consistency_score, level, last_calculated_at
  )
  VALUES (
    p_user_id, v_total_score, v_eval_quality,
    v_template_score, v_community_score,
    v_consistency_score, v_level, NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_score = v_total_score,
    evaluation_quality_score = v_eval_quality,
    template_submission_score = v_template_score,
    community_contribution_score = v_community_score,
    consistency_score = v_consistency_score,
    level = v_level,
    last_calculated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
