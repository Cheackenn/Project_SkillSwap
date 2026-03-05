# Fix "Bucket not found" Error - Step by Step

## What Happened?
You tried to upload a file and got this error:
```
StorageApiError: Bucket not found
```

This means the Supabase storage bucket hasn't been created yet.

---

## ✅ SOLUTION (5 minutes)

### Step 1: Open Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Select your project: **zapkszmkuwcalkjnlzfa**

### Step 2: Run the Setup SQL
1. Click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Open this file on your computer:
   ```
   Project_SkillSwap/scripts/complete-messaging-setup.sql
   ```
4. Copy ALL the content (Ctrl+A, Ctrl+C)
5. Paste it into the SQL Editor
6. Click the **"Run"** button (or press Ctrl+Enter)

### Step 3: Verify Success
You should see output showing:
- ✅ 4 columns added to messages table
- ✅ 1 storage bucket created
- ✅ 3 storage policies created

### Step 4: Test Upload
1. Go back to your app
2. Open a conversation
3. Click the attachment icon (📎)
4. Select an image
5. Click send
6. **It should work now!** ✅

---

## What the SQL Does

The script does 4 things:

1. **Adds columns to messages table**
   - `attachment_url` - stores file URL
   - `attachment_type` - 'image' or 'file'
   - `attachment_name` - original filename
   - `attachment_size` - file size in bytes

2. **Creates storage bucket**
   - Name: `message-attachments`
   - Private (not public)
   - 10MB file size limit

3. **Sets up security policies**
   - Users can upload to their own folder
   - Users can view files from their conversations
   - Users can delete their own files

4. **Adds validation**
   - File type checking
   - Size limits
   - Required fields

---

## Alternative: Manual Setup

If you prefer to do it manually:

### Create Bucket via Dashboard
1. Go to **Storage** in Supabase
2. Click **"New bucket"**
3. Name: `message-attachments`
4. Public: **NO** ❌
5. Click **"Create bucket"**

### Then Run SQL
Still need to run the SQL for policies and columns!

---

## Troubleshooting

### "Permission denied" error
- Make sure you're logged in to the app
- The SQL policies might not be set up correctly
- Re-run the SQL script

### "File too large" error
- Images: max 5MB
- Documents: max 10MB

### "File type not supported" error
Supported types:
- Images: JPEG, PNG, GIF, WebP
- Docs: PDF, Word, Excel, ZIP, TXT

---

## Files You Need

All setup files are in the `scripts/` folder:

- **complete-messaging-setup.sql** ← Run this one!
- create-storage-bucket.sql (alternative)
- test-storage.html (test page)

---

## Quick Test

After setup, you can test with this HTML file:
1. Open `scripts/test-storage.html` in your browser
2. It will check if the bucket exists
3. You can test upload/download

---

## Need More Help?

Check these files:
- `QUICK_SETUP.md` - Detailed setup guide
- `MESSAGING_ATTACHMENTS_SETUP.md` - Full documentation

Or check the browser console (F12) for detailed error messages.

---

## Summary

**The fix is simple:**
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Run `scripts/complete-messaging-setup.sql`
4. Done! ✅

Your file uploads will work after this! 🎉
