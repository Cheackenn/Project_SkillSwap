-- Migration: Add support for multiple attachments per message
-- This allows messages to have multiple images/files like Messenger

-- Add new column for storing array of attachments
ALTER TABLE messages 
ADD COLUMN attachments JSONB DEFAULT '[]'::jsonb;

-- The attachments column will store an array of objects like:
-- [
--   {
--     "url": "user-id/filename.jpg",
--     "type": "image",
--     "name": "photo.jpg",
--     "size": 123456
--   },
--   {
--     "url": "user-id/filename2.jpg",
--     "type": "image",
--     "name": "photo2.jpg",
--     "size": 234567
--   }
-- ]

-- Keep the old columns for backward compatibility
-- attachment_url, attachment_type, attachment_name, attachment_size will still work
-- New messages with multiple attachments will use the attachments array

-- Add index for better query performance on attachments
CREATE INDEX IF NOT EXISTS idx_messages_attachments ON messages USING GIN (attachments);

-- Add comment to explain the column
COMMENT ON COLUMN messages.attachments IS 'Array of attachment objects with url, type, name, and size properties';
