# ⚠️ FIX: "violates check constraint" Error

## The Error You're Seeing
```
Failed to send message: new row for relation "messages" violates check constraint "messages_content_or_attachment_check"
```

## Why This Happens
The database has a constraint that requires messages to have either text OR an attachment. But it only knows about the OLD single attachment field, not the NEW multiple attachments array.

## The Fix (2 Minutes)

### 1. Open Supabase SQL Editor
- Go to https://supabase.com
- Open your project
- Click "SQL Editor"

### 2. Copy & Paste This SQL
```sql
-- Add attachments column
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

-- Drop old constraint
ALTER TABLE messages 
DROP CONSTRAINT IF EXISTS messages_content_or_attachment_check;

-- Add new constraint
ALTER TABLE messages
ADD CONSTRAINT messages_content_or_attachment_check
CHECK (
  (char_length(content) > 0 AND char_length(content) <= 5000) OR
  (attachment_url IS NOT NULL) OR
  (attachments IS NOT NULL AND jsonb_array_length(attachments) > 0)
);

-- Add index
CREATE INDEX IF NOT EXISTS idx_messages_attachments 
ON messages USING GIN (attachments);
```

### 3. Click "Run"

### 4. Refresh Your App & Try Again
Your 2 images should now send successfully in ONE message with a beautiful collage layout!

## What You Get After This Fix
✅ Send multiple files in one message
✅ Beautiful image collage (like Messenger)
✅ Text + files together
✅ Files only (no text required)

## That's It!
The error is fixed and you have the full Messenger-style feature working!
