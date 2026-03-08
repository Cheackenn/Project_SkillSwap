# Quick Setup: Messenger-Style Attachments

## ⚠️ IMPORTANT: Run This SQL First!

Before testing the new feature, you MUST run this SQL in your Supabase SQL Editor:

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com
2. Open your SkillSwap project
3. Click "SQL Editor" in the left sidebar

### Step 2: Run This SQL
Copy and paste this into the SQL Editor and click "Run":

```sql
-- Add support for multiple attachments per message
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_messages_attachments 
ON messages USING GIN (attachments);

-- Add comment
COMMENT ON COLUMN messages.attachments IS 'Array of attachment objects with url, type, name, and size properties';
```

### Step 3: Verify
After running, you should see:
```
Success. No rows returned
```

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
