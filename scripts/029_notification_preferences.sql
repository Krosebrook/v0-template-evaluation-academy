-- Update email_preferences table with new columns

ALTER TABLE email_preferences 
ADD COLUMN IF NOT EXISTS generation_complete BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS marketplace_sales BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS team_invitations BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS version_updates BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS marketing_emails BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS digest_frequency TEXT DEFAULT 'weekly' CHECK (digest_frequency IN ('instant', 'daily', 'weekly', 'never'));
