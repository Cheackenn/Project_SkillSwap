-- Fix the constraint to support both old and new attachment methods
-- This allows messages with:
-- 1. Text only
-- 2. Old single attachment (attachment_url)
-- 3. New multiple attachments (attachments array)
-- 4. Text + attachments

-- Drop the old constraint
ALTER TABLE messages 
DROP CONSTRAINT IF EXISTS messages_content_or_attachment_check;

-- Add updated constraint that checks for either:
-- - Non-empty content (1-5000 chars)
-- - OR old attachment_url exists
-- - OR new attachments array has items
ALTER TABLE messages
ADD CONSTRAINT messages_content_or_attachment_check
CHECK (
  (char_length(content) > 0 AND char_length(content) <= 5000) OR
  (attachment_url IS NOT NULL) OR
  (attachments IS NOT NULL AND jsonb_array_length(attachments) > 0)
);
