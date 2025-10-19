-- Create leaderboard table
CREATE TABLE IF NOT EXISTS public.leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  score integer DEFAULT 0,
  badges integer DEFAULT 0,
  completed_modules integer DEFAULT 0,
  completion_rate integer DEFAULT 0,
  rank integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create resources table
CREATE TABLE IF NOT EXISTS public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  type text NOT NULL, -- 'article', 'video', 'tutorial', 'tool', 'template'
  url text,
  content text,
  tags text[],
  author_id uuid REFERENCES public.profiles(id),
  difficulty text, -- 'beginner', 'intermediate', 'advanced'
  duration integer, -- in minutes
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  bookmarks integer DEFAULT 0,
  featured boolean DEFAULT false,
  published boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create resource_bookmarks table
CREATE TABLE IF NOT EXISTS public.resource_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  resource_id uuid REFERENCES public.resources(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, resource_id)
);

-- Create resource_likes table
CREATE TABLE IF NOT EXISTS public.resource_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  resource_id uuid REFERENCES public.resources(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, resource_id)
);

-- Enable RLS
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_likes ENABLE ROW LEVEL SECURITY;

-- Leaderboard policies
CREATE POLICY "Leaderboard is viewable by everyone"
  ON public.leaderboard FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own leaderboard"
  ON public.leaderboard FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own leaderboard"
  ON public.leaderboard FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Resources policies
CREATE POLICY "Published resources are viewable by everyone"
  ON public.resources FOR SELECT
  USING (published = true OR author_id = auth.uid());

CREATE POLICY "Authors can insert resources"
  ON public.resources FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own resources"
  ON public.resources FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own resources"
  ON public.resources FOR DELETE
  USING (auth.uid() = author_id);

-- Resource bookmarks policies
CREATE POLICY "Users can view their own bookmarks"
  ON public.resource_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookmarks"
  ON public.resource_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON public.resource_bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Resource likes policies
CREATE POLICY "Likes are viewable by everyone"
  ON public.resource_likes FOR SELECT
  USING (true);

CREATE POLICY "Users can create likes"
  ON public.resource_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON public.resource_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON public.leaderboard(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON public.leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON public.leaderboard(rank);
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_author_id ON public.resources(author_id);
CREATE INDEX IF NOT EXISTS idx_resources_featured ON public.resources(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_resource_bookmarks_user_id ON public.resource_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_resource_likes_resource_id ON public.resource_likes(resource_id);

-- Function to update leaderboard rank
CREATE OR REPLACE FUNCTION update_leaderboard_ranks()
RETURNS void AS $$
BEGIN
  WITH ranked_users AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (ORDER BY score DESC, completion_rate DESC, badges DESC) as new_rank
    FROM public.leaderboard
  )
  UPDATE public.leaderboard l
  SET rank = r.new_rank, updated_at = now()
  FROM ranked_users r
  WHERE l.id = r.id AND l.rank != r.new_rank;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update ranks when leaderboard changes
CREATE OR REPLACE FUNCTION trigger_update_ranks()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_leaderboard_ranks();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leaderboard_update_ranks
AFTER INSERT OR UPDATE ON public.leaderboard
FOR EACH STATEMENT
EXECUTE FUNCTION trigger_update_ranks();

-- Insert sample resources
INSERT INTO public.resources (title, description, category, type, url, tags, difficulty, duration, featured, published) VALUES
('Getting Started with Template Evaluation', 'Learn the fundamentals of evaluating templates effectively', 'Tutorials', 'article', '/resources/getting-started', ARRAY['beginner', 'evaluation', 'fundamentals'], 'beginner', 15, true, true),
('Advanced Scoring Techniques', 'Master advanced techniques for accurate template scoring', 'Tutorials', 'video', '/resources/advanced-scoring', ARRAY['advanced', 'scoring', 'techniques'], 'advanced', 30, true, true),
('Code Quality Best Practices', 'Essential guidelines for evaluating code quality', 'Best Practices', 'article', '/resources/code-quality', ARRAY['code', 'quality', 'best-practices'], 'intermediate', 20, true, true),
('Design Evaluation Framework', 'Comprehensive framework for assessing design quality', 'Frameworks', 'tutorial', '/resources/design-framework', ARRAY['design', 'framework', 'evaluation'], 'intermediate', 25, false, true),
('Performance Optimization Guide', 'Learn how to evaluate and improve template performance', 'Guides', 'article', '/resources/performance', ARRAY['performance', 'optimization', 'guide'], 'advanced', 35, false, true);
