-- Internal Tool Setup
-- Add any missing indexes and optimize for internal tool usage

-- Add index for faster dashboard queries
CREATE INDEX IF NOT EXISTS idx_templates_user_created ON templates(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evaluations_evaluator_created ON evaluations(evaluator_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_templates_created_at ON templates(created_at DESC);

-- Add function to get user dashboard stats
CREATE OR REPLACE FUNCTION get_user_dashboard_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'templates_count', (SELECT COUNT(*) FROM templates WHERE user_id = user_uuid),
    'evaluations_count', (SELECT COUNT(*) FROM evaluations WHERE evaluator_id = user_uuid),
    'avg_score', (SELECT AVG(overall_score) FROM evaluations WHERE evaluator_id = user_uuid),
    'recent_templates', (
      SELECT json_agg(json_build_object(
        'id', id,
        'title', title,
        'category', category,
        'created_at', created_at
      ))
      FROM (
        SELECT id, title, category, created_at
        FROM templates
        WHERE user_id = user_uuid
        ORDER BY created_at DESC
        LIMIT 5
      ) t
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_user_dashboard_stats(UUID) TO authenticated;

-- Add comment
COMMENT ON FUNCTION get_user_dashboard_stats IS 'Get dashboard statistics for a specific user';
