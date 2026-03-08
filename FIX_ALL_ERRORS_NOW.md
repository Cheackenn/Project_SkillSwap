# 🔧 Fix ALL Errors - Complete Guide

## Your Errors

1. ❌ "Failed to send message: violates check constraint"
2. ❌ "Failed to load image" with StorageUnknownError

## The Complete Fix (5 Minutes)

### Step 1: Run the Master SQL Script

**File:** `MASTER_SETUP_SQL.sql`

1. Open Supabase Dashboard (https://supabase.com)
2. Go to SQL Editor
3. Copy the ENTIRE contents of `MASTER_SETUP_SQL.sql`
4. Paste into SQL Editor
5. Click "Run"
6. Wait for "Success. No rows returned"

This single script fixes BOTH errors:
- ✅ Fixes the constraint error
- ✅ Sets up storage bucket
- ✅ Configures RLS policies
- ✅ Adds performance indexes

### Step 2: Clean Up Failed Messages

The messages showing "Failed to load image" are from failed attempts. Delete them:

**Option A: From the App**
- Go to the conversation
- Swipe or click menu on the conversation
- Delete conversation
- Start fresh

**Option B: From Database** (if you want to keep the conversation)
Just leave them - they won't affect new messages

### Step 3: Test It!

1. Refresh your app (hard refresh: Ctrl+Shift+R or Cmd+Shift+R)
2. Go to Messages
3. Select a conversation
4. Click attach button
5. Select 2-3 images
6. Click send
7. Watch them appear in ONE beautiful message with collage layout! 🎉

## What Each Error Meant

### Error 1: "violates check constraint"
**Cause:** Database constraint only allowed text OR single attachment, not multiple attachments

**Fix:** Updated constraint to allow multiple attachments array

### Error 2: "Failed to load image"
**Cause:** Either:
- Storage bucket didn't exist
- RLS policies weren't configured
- Messages failed to save (due to Error 1)

**Fix:** Created bucket and set up proper RLS policies

## After Running the SQL

### You Get:
✅ Send multiple files in ONE message
✅ Beautiful image collage (1, 2, 3, or 4+ images)
✅ Mixed images + documents
✅ Text + files together
✅ Secure storage with authentication
✅ Fast performance with indexes

### Image Layouts:
- **1 image:** Full width display
- **2 images:** Side by side (2 columns)
- **3 images:** First full width, next 2 side by side
- **4+ images:** 2x2 grid with "+5" badge showing remaining

## Verification

After running the SQL, verify in Supabase:

### Check Database:
```sql
-- Should return the messages table with attachments column
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'messages' AND column_name = 'attachments';
```

### Check Storage:
```sql
-- Should return the message-attachments bucket
SELECT * FROM storage.buckets WHERE id = 'message-attachments';
```

### Check Policies:
```sql
-- Should return 3 policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%attachments%';
```

## Troubleshooting

### Still getting constraint error?
- Make sure you ran the ENTIRE SQL script
- Check that the constraint was dropped and recreated
- Try refreshing your app

### Still getting "Failed to load image"?
- Check that storage bucket exists
- Verify RLS policies are created
- Make sure you're logged in
- Try uploading a new image (old failed ones won't work)

### Images upload but don't display?
- Check browser console for specific error
- Verify file paths in database
- Check RLS policies allow reading

## Success Indicators

You'll know it's working when:
- ✅ No error messages when sending
- ✅ Images appear immediately after sending
- ✅ Multiple images show in collage layout
- ✅ Can click images to view full size
- ✅ Files show as download cards

## That's It!

Run `MASTER_SETUP_SQL.sql` and you're done. Everything will work perfectly!
