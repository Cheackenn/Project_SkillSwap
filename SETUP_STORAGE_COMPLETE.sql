-- ============================================================================
-- COMPLETE STORAGE SETUP FOR MESSAGE ATTACHMENTS
-- Run this if you're getting "Failed to load image" errors
-- ============================================================================

-- Step 1: Create the storage bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('message-attachments', 'message-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Drop existing policies (clean slate)
DROP POLICY IF EXISTS "Users can upload their own attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can view attachments in their conversations" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own attachments" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to message-attachments" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads from message-attachments" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own attachments" ON storage.objects;

-- Step 3: Create upload policy
CREATE POLICY "Users can upload their own attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'message-attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Step 4: Create read policy (allows viewing attachments in conversations)
CREATE POLICY "Users can view attachments in their conversations"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'message-attachments' AND
  (
    -- User uploaded it
    (storage.foldername(name))[1] = auth.uid()::text OR
    -- User is in a conversation with the uploader
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE (c.participant_one_id = auth.uid() OR c.participant_two_id = auth.uid())
      AND ((storage.foldername(name))[1] = c.participant_one_id::text 
           OR (storage.foldername(name))[1] = c.participant_two_id::text)
    )
  )
);

-- Step 5: Create delete policy
CREATE POLICY "Users can delete their own attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'message-attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- DONE! Storage is now properly configured
-- ============================================================================

-- To verify, run this query:
-- SELECT * FROM storage.buckets WHERE id = 'message-attachments';
-- You should see one row with the bucket details
