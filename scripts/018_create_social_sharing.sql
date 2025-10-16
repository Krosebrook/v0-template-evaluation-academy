-- Social Sharing & Embeds System
-- Tracks shares and provides embeddable widgets

-- Social shares tracking table
CREATE TABLE IF NOT EXISTS social_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'linkedin', 'facebook', 'reddit', 'email', 'copy')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Embed views tracking table
CREATE TABLE IF NOT EXISTS embed_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  referrer TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social share counts view
CREATE OR REPLACE VIEW social_share_counts AS
SELECT 
  template_id,
  COUNT(*) as total_shares,
  COUNT(CASE WHEN platform = 'twitter' THEN 1 END) as twitter_shares,
  COUNT(CASE WHEN platform = 'linkedin' THEN 1 END) as linkedin_shares,
  COUNT(CASE WHEN platform = 'facebook' THEN 1 END) as facebook_shares,
  COUNT(CASE WHEN platform = 'reddit' THEN 1 END) as reddit_shares
FROM social_shares
GROUP BY template_id;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_social_shares_template ON social_shares(template_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_embed_views_template ON embed_views(template_id, viewed_at DESC);

-- RLS Policies
ALTER TABLE social_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE embed_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view social shares"
  ON social_shares FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create shares"
  ON social_shares FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can view embed views"
  ON embed_views FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create embed views"
  ON embed_views FOR INSERT
  WITH CHECK (true);
