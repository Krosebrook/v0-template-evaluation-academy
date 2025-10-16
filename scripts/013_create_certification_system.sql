-- Evaluator Certification System
-- Tracks evaluator training progress and certification levels

-- Certification levels
CREATE TABLE IF NOT EXISTS certification_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  requirements_score INTEGER NOT NULL,
  requirements_evaluations INTEGER NOT NULL,
  badge_color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default certification levels
INSERT INTO certification_levels (name, description, requirements_score, requirements_evaluations, badge_color) VALUES
  ('Bronze', 'Entry-level evaluator with basic training', 70, 5, '#CD7F32'),
  ('Silver', 'Intermediate evaluator with proven consistency', 80, 20, '#C0C0C0'),
  ('Gold', 'Advanced evaluator with excellent track record', 90, 50, '#FFD700'),
  ('Platinum', 'Expert evaluator with outstanding contributions', 95, 100, '#E5E4E2')
ON CONFLICT (name) DO NOTHING;

-- Training courses
CREATE TABLE IF NOT EXISTS training_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  duration_minutes INTEGER,
  order_index INTEGER DEFAULT 0,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default courses
INSERT INTO training_courses (title, description, duration_minutes, order_index, is_required) VALUES
  ('Introduction to Template Evaluation', 'Learn the fundamentals of evaluating templates', 30, 1, true),
  ('Evaluation Criteria Deep Dive', 'Understand each evaluation criterion in detail', 45, 2, true),
  ('Consistency and Objectivity', 'How to maintain consistent and objective evaluations', 30, 3, true),
  ('Advanced Evaluation Techniques', 'Advanced strategies for thorough evaluations', 60, 4, false),
  ('Community Guidelines and Ethics', 'Understanding community standards and ethical evaluation', 20, 5, true)
ON CONFLICT DO NOTHING;

-- Course quizzes
CREATE TABLE IF NOT EXISTS course_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES training_courses(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User course progress
CREATE TABLE IF NOT EXISTS user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES training_courses(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  quiz_score INTEGER,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- User certifications
CREATE TABLE IF NOT EXISTS user_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level_id UUID NOT NULL REFERENCES certification_levels(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, level_id)
);

-- Practice evaluations
CREATE TABLE IF NOT EXISTS practice_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  scores JSONB NOT NULL,
  feedback TEXT,
  ai_feedback TEXT,
  score_accuracy DECIMAL(5,2),
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_course_progress_user_id ON user_course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_certifications_user_id ON user_certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_evaluations_user_id ON practice_evaluations(user_id);

-- RLS Policies
ALTER TABLE certification_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_evaluations ENABLE ROW LEVEL SECURITY;

-- Public read access for certification levels and courses
CREATE POLICY "Certification levels are viewable by everyone"
  ON certification_levels FOR SELECT
  USING (true);

CREATE POLICY "Training courses are viewable by everyone"
  ON training_courses FOR SELECT
  USING (true);

CREATE POLICY "Course quizzes are viewable by everyone"
  ON course_quizzes FOR SELECT
  USING (true);

-- User course progress policies
CREATE POLICY "Users can view their own progress"
  ON user_course_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress"
  ON user_course_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_course_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- User certifications policies
CREATE POLICY "Certifications are viewable by everyone"
  ON user_certifications FOR SELECT
  USING (true);

CREATE POLICY "System can create certifications"
  ON user_certifications FOR INSERT
  WITH CHECK (true);

-- Practice evaluations policies
CREATE POLICY "Users can view their own practice evaluations"
  ON practice_evaluations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create practice evaluations"
  ON practice_evaluations FOR INSERT
  WITH CHECK (auth.uid() = user_id);
