-- Create github_repos table
CREATE TABLE IF NOT EXISTS github_repos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  repo_url VARCHAR(500) NOT NULL,
  repo_owner VARCHAR(255) NOT NULL,
  repo_name VARCHAR(255) NOT NULL,
  default_branch VARCHAR(100) DEFAULT 'main',
  last_commit_sha VARCHAR(40),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  open_issues INTEGER DEFAULT 0,
  watchers INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(template_id)
);

-- Create github_commits table
CREATE TABLE IF NOT EXISTS github_commits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id UUID NOT NULL REFERENCES github_repos(id) ON DELETE CASCADE,
  commit_sha VARCHAR(40) NOT NULL,
  commit_message TEXT,
  author_name VARCHAR(255),
  author_email VARCHAR(255),
  committed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(repo_id, commit_sha)
);

-- Create indexes
CREATE INDEX idx_github_repos_template_id ON github_repos(template_id);
CREATE INDEX idx_github_commits_repo_id ON github_commits(repo_id);
CREATE INDEX idx_github_commits_committed_at ON github_commits(committed_at DESC);

-- Enable RLS
ALTER TABLE github_repos ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_commits ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view github repos"
  ON github_repos FOR SELECT
  USING (true);

CREATE POLICY "Template owners can manage their repos"
  ON github_repos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM templates
      WHERE templates.id = github_repos.template_id
      AND templates.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view commits"
  ON github_commits FOR SELECT
  USING (true);

CREATE POLICY "System can insert commits"
  ON github_commits FOR INSERT
  WITH CHECK (true);
