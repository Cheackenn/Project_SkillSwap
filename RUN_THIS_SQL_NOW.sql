-- ============================================================================
-- COMPLETE FIX FOR MESSENGER-STYLE ATTACHMENTS
-- Run this entire script in Supabase SQL Editor
-- ============================================================================

-- Step 1: Add attachments column if it doesn't exist
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

-- Step 2: Drop the old constraint that's causing the error
ALTER TABLE messages 
DROP CONSTRAINT IF EXISTS messages_content_or_attachment_check;

-- Step 3: Add new constraint that supports:
-- - Text only messages
-- - Old single attachment (attachment_url)
-- - New multiple attachments (attachments array)
-- - Text + attachments
ALTER TABLE messages
ADD CONSTRAINT messages_content_or_attachment_check
CHECK (
  (char_length(content) > 0 AND char_length(content) <= 5000) OR
  (attachment_url IS NOT NULL) OR
  (attachments IS NOT NULL AND jsonb_array_length(attachments) > 0)
);

-- Step 4: Add index for better performance
CREATE INDEX IF NOT EXISTS idx_messages_attachments 
ON messages USING GIN (attachments);

-- Step 5: Add comment
COMMENT ON COLUMN messages.attachments IS 'Array of attachment objects with url, type, name, and size properties';

-- ============================================================================
-- DONE! You can now send multiple files in one message
-- ============================================================================
