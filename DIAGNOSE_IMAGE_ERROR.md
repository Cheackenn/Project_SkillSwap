# Diagnose: "Failed to load image" Error

## What's Happening
Images show "Failed to load image" with `StorageUnknownError` in console.

## Possible Causes

### 1. Messages Weren't Saved (Most Likely)
Because of the constraint error, the messages failed to save to the database. The images might have uploaded to storage, but the message records don't exist, so the app is trying to load images from paths that don't exist.

### 2. Storage Bucket Not Set Up
The `message-attachments` bucket might not exist or RLS policies aren't configured.

### 3. Wrong File Paths
The file paths in the database might be incorrect.

## How to Fix

### Step 1: Run the SQL Fix First
**This is the most important step!**

Run the SQL from `RUN_THIS_SQL_NOW.sql` in Supabase SQL Editor:

```sql
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

ALTER TABLE messages 
DROP CONSTRAINT IF EXISTS messages_content_or_attachment_check;

ALTER TABLE messages
ADD CONSTRAINT messages_content_or_attachment_check
CHECK (
  (char_length(content) > 0 AND char_length(content) <= 5000) OR
  (attachment_url IS NOT NULL) OR
  (attachments IS NOT NULL AND jsonb_array_length(attachments) > 0)
);

CREATE INDEX IF NOT EXISTS idx_messages_attachments 
ON messages USING GIN (attachments);
```

### Step 2: Check Storage Bucket Exists

Go to Supabase Dashboard → Storage → Check if `message-attachments` bucket exists.

If NOT, run this SQL:

```sql
-- Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('message-attachments', 'message-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies
CREATE POLICY "Users can upload their own attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'message-attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

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

CREATE POLICY "Users can delete their own attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'message-attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Step 3: Clear Failed Messages

The failed messages (that show "Failed to load image") are probably orphaned. You can:

**Option A: Delete them from the UI**
- Swipe or click menu on each failed message
- Delete conversation

**Option B: Clear from database** (if you want to start fresh)
```sql
-- WARNING: This deletes ALL messages in the conversation
-- Only run if you want to clear everything
DELETE FROM messages WHERE conversation_id = 'YOUR_CONVERSATION_ID';
```

### Step 4: Try Sending Again

After running the SQL fixes:
1. Refresh your app
2. Try sending 2 images again
3. They should now:
   - Upload successfully ✓
   - Save to database ✓
   - Display correctly ✓
   - Show in collage layout ✓

## Quick Checklist

- [ ] Run `RUN_THIS_SQL_NOW.sql` to fix constraint
- [ ] Check storage bucket exists
- [ ] Run storage policies SQL if needed
- [ ] Delete failed messages
- [ ] Refresh app
- [ ] Try sending images again

## Expected Result

After fixes:
```
✓ Images upload
✓ Message saves to database
✓ Images display in collage
✓ No "Failed to load image" errors
✓ Beautiful Messenger-style layout
```

## Still Having Issues?

Check the browser console for the exact error message. It should show:
- The file path it's trying to load
- The specific storage error
- Any authentication issues

Common errors:
- "Bucket not found" → Run storage bucket SQL
- "Permission denied" → Run RLS policies SQL
- "File not found" → Message saved but file upload failed
