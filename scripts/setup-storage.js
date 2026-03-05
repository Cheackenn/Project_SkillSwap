/**
 * Setup Script for Message Attachments Storage
 * This script creates the storage bucket and verifies the setup
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStorage() {
  console.log('🚀 Setting up message attachments storage...\n');

  try {
    // Check if bucket exists
    console.log('1️⃣ Checking for existing bucket...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError.message);
      console.log('\n⚠️  You may need to use the Supabase Dashboard to create the bucket manually.');
      console.log('   Go to: Storage → New Bucket → Name: "message-attachments" → Public: OFF');
      return;
    }

    const bucketExists = buckets.some(b => b.name === 'message-attachments');

    if (bucketExists) {
      console.log('✅ Bucket "message-attachments" already exists');
    } else {
      console.log('📦 Creating bucket "message-attachments"...');
      
      // Note: Creating buckets requires service role key, not anon key
      // This will likely fail with anon key
      const { data, error } = await supabase.storage.createBucket('message-attachments', {
        public: false,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: [
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
      });

      if (error) {
        console.error('❌ Could not create bucket automatically:', error.message);
        console.log('\n📋 MANUAL SETUP REQUIRED:');
        console.log('   1. Go to your Supabase Dashboard');
        console.log('   2. Navigate to Storage');
        console.log('   3. Click "New bucket"');
        console.log('   4. Name: message-attachments');
        console.log('   5. Public: NO (keep it private)');
        console.log('   6. Click "Create bucket"');
        console.log('\n   Then run the SQL migration from:');
        console.log('   supabase/migrations/002_messaging_attachments.sql');
        return;
      }

      console.log('✅ Bucket created successfully');
    }

    // Test upload
    console.log('\n2️⃣ Testing upload permissions...');
    const testFile = new Blob(['test'], { type: 'text/plain' });
    const testPath = `test-${Date.now()}.txt`;
    
    const { error: uploadError } = await supabase.storage
      .from('message-attachments')
      .upload(testPath, testFile);

    if (uploadError) {
      console.error('❌ Upload test failed:', uploadError.message);
      console.log('\n📋 NEXT STEPS:');
      console.log('   1. Make sure you ran the SQL migration');
      console.log('   2. Check storage policies in Supabase Dashboard');
      console.log('   3. Verify you are logged in as an authenticated user');
    } else {
      console.log('✅ Upload test successful');
      
      // Clean up test file
      await supabase.storage
        .from('message-attachments')
        .remove([testPath]);
      console.log('✅ Cleanup completed');
    }

    console.log('\n✨ Setup verification complete!');
    console.log('\n📝 Remember to run the SQL migration if you haven\'t:');
    console.log('   File: supabase/migrations/002_messaging_attachments.sql');

  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

setupStorage();
