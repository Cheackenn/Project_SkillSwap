# Quick Setup Guide - Fix "Bucket not found" Error

## The Problem
You're getting "Bucket not found" error because the Supabase storage bucket hasn't been created yet.

## Solution (Choose ONE method)

### Method 1: Run SQL Script (RECOMMENDED - 2 minutes)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Run the SQL**
   - Open the file: `scripts/complete-messaging-setup.sql`
   - Copy ALL the content
   - Paste it into the SQL Editor
   - Click "Run" button

4. **Verify Success**
   - You should see results showing:
     - 4 attachment columns created
     - 1 storage bucket created
     - 3 storage policies created

5. **Test Upload**
   - Go back to your app
   - Try uploading an image again
   - It should work now! ✅

---

### Method 2: Manual Setup via Dashboard (5 minutes)

#### Part A: Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click **"New bucket"**
3. Fill in:
   - **Name**: `message-attachments`
   - **Public**: ❌ NO (keep it private)
   - **File size limit**: 10 MB
   - **Allowed MIME types**: Leave empty (we'll set via SQL)
4. Click **"Create bucket"**

#### Part B: Run SQL for Policies

1. Go to **SQL Editor**
2. Copy and paste this SQL:

```sql
-- Add attachment columns
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS attachment_url TEXT,
ADD COLUMN IF NOT EXISTS attachment_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS attachment_name TEXT,
ADD COLUMN IF NOT EXISTS attachment_size INTEGER;

-- Add constraints
ALTER TABLE messages DROP CONSTRAINT IF EXISTS valid_attachment_type;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS attachment_fields_complete;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_content_check;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_content_or_attachment_check;

ALTER TABLE messages
ADD CONSTRAINT valid_attachment_type 
CHECK (attachment_type IS NULL OR attachment_type IN ('image', 'file'));

ALTER TABLE messages
ADD CONSTRAINT attachment_fields_complete
CHECK (
  (attachment_url IS NULL AND attachment_type IS NULL AND attachment_name IS NULL AND attachment_size IS NULL) OR
  (attachment_url IS NOT NULL AND attachment_type IS NOT NULL AND attachment_name IS NOT NULL AND attachment_size IS NOT NULL)
);

ALTER TABLE messages
ADD CONSTRAINT messages_content_or_attachment_check
CHECK (
  (char_length(content) > 0 AND char_length(content) <= 5000) OR
  (attachment_url IS NOT NULL)
);

-- Create storage policies
DROP POLICY IF EXISTS "Users can upload message attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can view attachments from their conversations" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own attachments" ON storage.objects;

CREATE POLICY "Users can upload message attachments"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'message-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view attachments from their conversations"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'message-attachments' AND
  (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM messages m
      JOIN conversations c ON c.id = m.conversation_id
      WHERE m.attachment_url LIKE '%' || name || '%'
      AND (c.participant_one_id = auth.uid() OR c.participant_two_id = auth.uid())
    )
  )
);

CREATE POLICY "Users can delete their own attachments"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'message-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

3. Click **"Run"**

---

## Verification

After setup, verify everything works:

1. **Check Storage Bucket**
   - Go to Storage in Supabase Dashboard
   - You should see "message-attachments" bucket

2. **Check Policies**
   - Click on the bucket
   - Go to "Policies" tab
   - You should see 3 policies

3. **Test Upload**
   - Go to your app
   - Open a conversation
   - Click the attachment icon (📎)
   - Select an image
   - Click send
   - Should upload successfully! ✅

---

## Still Having Issues?

### Error: "Permission denied"
- Make sure you're logged in to the app
- Check that storage policies were created correctly
- Verify the user is authenticated

### Error: "File too large"
- Images: max 5MB
- Documents: max 10MB
- Try a smaller file

### Error: "File type not supported"
- Supported images: JPEG, PNG, GIF, WebP
- Supported docs: PDF, Word, Excel, ZIP, TXT

---

## Need Help?

Check the browser console (F12) for detailed error messages.

The complete setup SQL is in: `scripts/complete-messaging-setup.sql`
