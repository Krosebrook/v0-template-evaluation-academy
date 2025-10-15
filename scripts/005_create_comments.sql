-- Create comments table for template discussions
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_comments_template_id ON public.comments(template_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Anyone can view comments
CREATE POLICY "Anyone can view comments"
  ON public.comments
  FOR SELECT
  USING (true);

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments"
  ON public.comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON public.comments
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments"
  ON public.comments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to notify on new comment
CREATE OR REPLACE FUNCTION notify_new_comment()
RETURNS TRIGGER AS $$
DECLARE
  template_owner UUID;
  template_name TEXT;
  commenter_name TEXT;
  parent_comment_author UUID;
BEGIN
  -- Get template owner and name
  SELECT user_id, title INTO template_owner, template_name
  FROM public.templates
  WHERE id = NEW.template_id;
  
  -- Get commenter name
  SELECT display_name INTO commenter_name
  FROM public.profiles
  WHERE id = NEW.user_id;
  
  -- If this is a reply, notify the parent comment author
  IF NEW.parent_id IS NOT NULL THEN
    SELECT user_id INTO parent_comment_author
    FROM public.comments
    WHERE id = NEW.parent_id;
    
    IF parent_comment_author != NEW.user_id THEN
      PERFORM create_notification(
        parent_comment_author,
        'comment_added',
        'New Reply',
        commenter_name || ' replied to your comment on "' || template_name || '"',
        '/templates/results/' || NEW.template_id
      );
    END IF;
  END IF;
  
  -- Notify template owner if they're not the commenter
  IF template_owner != NEW.user_id THEN
    PERFORM create_notification(
      template_owner,
      'comment_added',
      'New Comment',
      commenter_name || ' commented on your template "' || template_name || '"',
      '/templates/results/' || NEW.template_id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_notify_comment ON public.comments;
CREATE TRIGGER trigger_notify_comment
  AFTER INSERT ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_comment();
