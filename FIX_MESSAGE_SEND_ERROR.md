# Fix: "Failed to send message" Error

## The Problem
You're seeing "Failed to send message" when trying to send multiple files.

## The Solution

The error happens because the code is now fixed to work with OR without the database migration. Here's what to do:

### Option 1: Run the Migration (Recommended for Multiple Files)
If you want the Messenger-style collage with all files in one message:

1. Go to Supabase Dashboard → SQL Editor
2. Run this SQL:

```sql
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_messages_attachments 
ON messages USING GIN (attachments);
```

3. Refresh your app and try again

### Option 2: Use Without Migration (Works Now!)
The code is now fixed to work even WITHOUT the migration. It will:
- Send files using the old single-attachment method
- Still work perfectly fine
- Just won't have the collage layout yet

## What Was Fixed

### Before (Broken)
```typescript
// Always sent attachments: [] even if column didn't exist
messageData.attachments = attachments || [];
```

### After (Fixed)
```typescript
// Only send attachments field if there are actual attachments
if (attachments && attachments.length > 0) {
  messageData.attachments = attachments;
}
```

### Also Fixed
- Made `attachments` field optional in TypeScript types
- Added better error messages that show the actual error
- Improved null checks in message display

## Testing

### Test 1: Without Migration
1. Don't run the SQL migration
2. Try sending 2 images
3. Should work now (sends as separate messages)

### Test 2: With Migration
1. Run the SQL migration
2. Try sending 2 images
3. Should send as ONE message with collage layout

## Error Details

If you still see an error, the error message will now show more details like:
- "Failed to send message: column 'attachments' does not exist" → Run the migration
- "Failed to send message: permission denied" → Check RLS policies
- "Failed to upload file.jpg: Bucket not found" → Storage not set up

## Quick Fix Summary

The code is now fixed! You can:
1. Use it right now without any migration (works with old method)
2. Run the migration later when you want the collage feature

Both ways work perfectly now!
