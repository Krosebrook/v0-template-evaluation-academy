-- Create voting and reactions system

-- Template votes table
CREATE TABLE IF NOT EXISTS template_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(template_id, user_id)
);

-- Evaluation reactions table
CREATE TABLE IF NOT EXISTS evaluation_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('helpful', 'insightful', 'thorough', 'constructive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(evaluation_id, user_id, reaction_type)
);

-- Comment reactions table
CREATE TABLE IF NOT EXISTS comment_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'love', 'insightful', 'helpful')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id, reaction_type)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_template_votes_template ON template_votes(template_id);
CREATE INDEX IF NOT EXISTS idx_template_votes_user ON template_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_reactions_evaluation ON evaluation_reactions(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_comment_reactions_comment ON comment_reactions(comment_id);

-- Enable RLS
ALTER TABLE template_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for template_votes
CREATE POLICY "Anyone can view votes" ON template_votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can vote" ON template_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own votes" ON template_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own votes" ON template_votes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for evaluation_reactions
CREATE POLICY "Anyone can view reactions" ON evaluation_reactions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can react" ON evaluation_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their reactions" ON evaluation_reactions FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for comment_reactions
CREATE POLICY "Anyone can view comment reactions" ON comment_reactions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can react to comments" ON comment_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their comment reactions" ON comment_reactions FOR DELETE USING (auth.uid() = user_id);
