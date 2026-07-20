-- ============================================================
-- Money Tracker - Avatar Storage Setup
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Create a public bucket for profile photos
-- file_size_limit is in bytes (2MB = 2 * 1024 * 1024)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2. RLS policies on storage.objects
-- Convention: every file is stored as "{user_id}/avatar.{ext}",
-- so (storage.foldername(name))[1] always equals the owner's user id.

-- Anyone can view avatars (bucket is public)
drop policy if exists "Public read access for avatars" on storage.objects;
create policy "Public read access for avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Users can only upload into their own folder
drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can only overwrite their own avatar
drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can only delete their own avatar
drop policy if exists "Users can delete their own avatar" on storage.objects;
create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );