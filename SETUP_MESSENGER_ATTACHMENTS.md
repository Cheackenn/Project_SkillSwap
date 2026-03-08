# Quick Setup: Messenger-Style Attachments

## ⚠️ CRITICAL: Fix the Database Error

You're seeing this error:
```
Failed to send message: new row for relation "messages" violates check constraint "messages_content_or_attachment_check"
```

This happens because the database constraint needs to be updated to support the new attachments array.

## 🔧 THE FIX (Run This SQL Now!)

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com
2. Open your SkillSwap project
3. Click "SQL Editor" in the left sidebar

### Step 2: Copy and Run This SQL
Copy the ENTIRE script from `RUN_THIS_SQL_NOW.sql` or paste this:

```sql
-- Add attachments column
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

-- Drop old constraint
ALTER TABLE messages 
DROP CONSTRAINT IF EXISTS messages_content_or_attachment_check;

-- Add new constraint that supports multiple attachments
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

### Step 3: Click "Run"
You should see: `Success. No rows returned`

### Step 4: Test Again
1. Refresh your app
2. Try sending those 2 images again
3. They should now send successfully in ONE message with collage layout!

## What This Fixes

### The Problem
The old constraint only checked for:
- Text content OR
- Single attachment (attachment_url)

### The Solution
The new constraint checks for:
- Text content OR
- Single attachment (attachment_url) OR
- Multiple attachments (attachments array) ✅

Now you can send:
- Text only ✅
- Files only ✅
- Text + files ✅
- Multiple files together ✅

## What Changed?

### Before (Old Way)
```
You: [Image 1]
You: [Image 2]  
You: [Image 3]
You: Text message
```
Each file was a separate message bubble.

### After (Messenger Style)
```
You: ┌─────────────┐
     │ IMG1 │ IMG2 │
     ├──────┼──────┤
     │ IMG3 │      │
     ├─────────────┤
     │ Text message│
     └─────────────┘
```
All files in ONE message bubble with collage layout!

## How to Use

1. Click the attach button (📎)
2. Select multiple images/files
3. See preview of all selected files
4. Add optional text message
5. Click send
6. All files appear together in one beautiful message!

## Image Layouts

### 1 Image
Full width display

### 2 Images  
Side by side (2 columns)

### 3 Images
First image full width, next 2 side by side

### 4+ Images
2x2 grid, with "+X" badge showing remaining count

## That's It!

After running the SQL, the feature is ready to use. No code changes needed on your end!
