-- Additional performance indexes for common query patterns
-- Run this script to optimize database queries

-- Index for templates ordering by created_at (most common sort)
CREATE INDEX IF NOT EXISTS templates_created_at_idx ON public.templates(created_at DESC);

-- Index for templates ordering by updated_at
CREATE INDEX IF NOT EXISTS templates_updated_at_idx ON public.templates(updated_at DESC);

-- GIN index for tags array searches (for tag filtering)
CREATE INDEX IF NOT EXISTS templates_tags_gin_idx ON public.templates USING GIN(tags);

-- Index for text search on title and description
CREATE INDEX IF NOT EXISTS templates_title_trgm_idx ON public.templates USING GIN(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS templates_description_trgm_idx ON public.templates USING GIN(description gin_trgm_ops);

-- Composite index for common filter combinations
CREATE INDEX IF NOT EXISTS templates_category_created_at_idx ON public.templates(category, created_at DESC);
CREATE INDEX IF NOT EXISTS templates_difficulty_created_at_idx ON public.templates(difficulty, created_at DESC);

-- Index for evaluations ordering by created_at
CREATE INDEX IF NOT EXISTS evaluations_created_at_idx ON public.evaluations(created_at DESC);

-- Composite index for template evaluations lookup
CREATE INDEX IF NOT EXISTS evaluations_template_created_idx ON public.evaluations(template_id, created_at DESC);

-- Index for user preferences lookups
CREATE INDEX IF NOT EXISTS user_preferences_user_id_idx ON public.user_preferences(user_id) WHERE user_preferences IS NOT NULL;

-- Index for user interactions tracking
CREATE INDEX IF NOT EXISTS user_interactions_user_id_idx ON public.user_interactions(user_id, created_at DESC) WHERE user_interactions IS NOT NULL;
CREATE INDEX IF NOT EXISTS user_interactions_template_id_idx ON public.user_interactions(template_id, created_at DESC) WHERE user_interactions IS NOT NULL;

-- Enable pg_trgm extension for fuzzy text search (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Optional: Add materialized view for template statistics (requires manual refresh)
-- This can significantly speed up queries that aggregate evaluation scores
CREATE MATERIALIZED VIEW IF NOT EXISTS template_stats AS
SELECT 
  t.id,
  t.title,
  t.category,
  t.difficulty,
  COUNT(e.id) as evaluation_count,
  AVG(e.overall_score) as average_score,
  MAX(e.created_at) as last_evaluated_at
FROM public.templates t
LEFT JOIN public.evaluations e ON t.id = e.template_id
GROUP BY t.id, t.title, t.category, t.difficulty;

-- Index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS template_stats_id_idx ON template_stats(id);
CREATE INDEX IF NOT EXISTS template_stats_avg_score_idx ON template_stats(average_score DESC);
CREATE INDEX IF NOT EXISTS template_stats_eval_count_idx ON template_stats(evaluation_count DESC);

-- Function to refresh materialized view (can be called via cron or trigger)
CREATE OR REPLACE FUNCTION refresh_template_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY template_stats;
END;
$$ LANGUAGE plpgsql;

-- Note: To use the materialized view, modify queries to join with template_stats
-- instead of aggregating evaluations on every query
-- Remember to refresh the view periodically: SELECT refresh_template_stats();
