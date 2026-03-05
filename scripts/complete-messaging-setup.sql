-- ============================================================================
-- COMPLETE MESSAGING ATTACHMENTS SETUP
-- Run this ENTIRE script in your Supabase SQL Editor
-- ============================================================================

-- STEP 1: Add attachment columns to messages table
-- ============================================================================

ALTER TABLE messages
ADD COLUMN IF NOT EXISTS attachment_url TEXT,
ADD COLUMN IF NOT EXISTS attachment_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS attachment_name TEXT,
ADD COLUMN IF NOT EXISTS attachment_size INTEGER;

-- STEP 2: Add constraints
-- ============================================================================

-- Drop old constraints if they exist
ALTER TABLE messages DROP CONSTRAINT IF EXISTS valid_attachment_type;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS attachment_fields_complete;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_content_check;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_content_or_attachment_check;

-- Add check constraint for attachment types
ALTER TABLE messages
ADD CONSTRAINT valid_attachment_type 
CHECK (
  attachment_type IS NULL OR 
  attachment_type IN ('image', 'file')
);

-- Add check constraint: if attachment exists, all fields must be present
ALTER TABLE messages
ADD CONSTRAINT attachment_fields_complete
CHECK (
  (attachment_url IS NULL AND attachment_type IS NULL AND attachment_name IS NULL AND attachment_size IS NULL) OR
  (attachment_url IS NOT NULL AND attachment_type IS NOT NULL AND attachment_name IS NOT NULL AND attachment_size IS NOT NULL)
);

-- Modify content constraint to allow empty content if attachment exists
ALTER TABLE messages
ADD CONSTRAINT messages_content_or_attachment_check
CHECK (
  (char_length(content) > 0 AND char_length(content) <= 5000) OR
  (attachment_url IS NOT NULL)
);

-- STEP 3: Create indexes
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_messages_attachment_type 
ON messages(attachment_type) 
WHERE attachment_type IS NOT NULL;

-- STEP 4: Create storage bucket
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'message-attachments',
  'message-attachments',
  false,
  10485760, -- 10MB
  ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'text/plain'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'text/plain'
  ];

-- STEP 5: Drop existing storage policies (if any)
-- ============================================================================

DROP POLICY IF EXISTS "Users can upload message attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can view attachments from their conversations" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own attachments" ON storage.objects;

-- STEP 6: Create storage policies
-- ============================================================================

-- Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload message attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'message-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view attachments from their conversations
CREATE POLICY "Users can view attachments from their conversations"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'message-attachments' AND
  (
    -- User is the uploader
    auth.uid()::text = (storage.foldername(name))[1] OR
    -- User is a participant in a conversation with a message containing this attachment
    EXISTS (
      SELECT 1 FROM messages m
      JOIN conversations c ON c.id = m.conversation_id
      WHERE m.attachment_url LIKE '%' || name || '%'
      AND (c.participant_one_id = auth.uid() OR c.participant_two_id = auth.uid())
    )
  )
);

-- Allow users to delete their own attachments
CREATE POLICY "Users can delete their own attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'message-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- STEP 7: Verify setup
-- ============================================================================

-- Check messages table columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'messages' 
AND column_name LIKE 'attachment%'
ORDER BY ordinal_position;

-- Check storage bucket
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'message-attachments';

-- Check storage policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%message%';

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- You should see:
-- 1. Four attachment columns in messages table
-- 2. One storage bucket named 'message-attachments'
-- 3. Three storage policies for upload, view, and delete
-- ============================================================================
