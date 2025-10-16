-- Dispute Resolution System
-- Allows template authors to dispute evaluation scores

-- Disputes table
CREATE TABLE IF NOT EXISTS evaluation_disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  evidence_urls TEXT[],
  status TEXT DEFAULT 'submitted',
  resolution TEXT,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dispute review panel assignments
CREATE TABLE IF NOT EXISTS dispute_reviewers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL REFERENCES evaluation_disputes(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote TEXT,
  comments TEXT,
  voted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(dispute_id, reviewer_id)
);

-- Dispute comments
CREATE TABLE IF NOT EXISTS dispute_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL REFERENCES evaluation_disputes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_evaluation_disputes_author_id ON evaluation_disputes(author_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_disputes_status ON evaluation_disputes(status);
CREATE INDEX IF NOT EXISTS idx_dispute_reviewers_dispute_id ON dispute_reviewers(dispute_id);
CREATE INDEX IF NOT EXISTS idx_dispute_comments_dispute_id ON dispute_comments(dispute_id);

-- RLS Policies
ALTER TABLE evaluation_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_reviewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_comments ENABLE ROW LEVEL SECURITY;

-- Evaluation disputes policies
CREATE POLICY "Authors can view their own disputes"
  ON evaluation_disputes FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY "Admins and evaluators can view all disputes"
  ON evaluation_disputes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'evaluator')
    )
  );

CREATE POLICY "Authors can create disputes"
  ON evaluation_disputes FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Admins can update disputes"
  ON evaluation_disputes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Dispute reviewers policies
CREATE POLICY "Reviewers can view their assignments"
  ON dispute_reviewers FOR SELECT
  USING (auth.uid() = reviewer_id);

CREATE POLICY "Admins can view all reviewer assignments"
  ON dispute_reviewers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Reviewers can update their votes"
  ON dispute_reviewers FOR UPDATE
  USING (auth.uid() = reviewer_id);

-- Dispute comments policies
CREATE POLICY "Users can view comments on their disputes"
  ON dispute_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM evaluation_disputes
      WHERE evaluation_disputes.id = dispute_comments.dispute_id
      AND (evaluation_disputes.author_id = auth.uid() OR is_internal = false)
    )
  );

CREATE POLICY "Admins and evaluators can view all comments"
  ON dispute_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'evaluator')
    )
  );

CREATE POLICY "Users can create comments on disputes"
  ON dispute_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);
