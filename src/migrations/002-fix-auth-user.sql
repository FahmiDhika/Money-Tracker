-- ============================================================
-- Money Tracker - Fix: User Data Setup
-- Run this in the Supabase SQL Editor
-- This safely removes the broken objects from the previous
-- attempt, then rebuilds everything correctly.
-- ============================================================
 
-- 0. Clean up previous (broken) objects, if they exist
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists set_updated_at on public."user";
drop function if exists public.handle_new_user();
drop function if exists public.handle_updated_at();
drop table if exists public."user";
drop table if exists public.user_data;
 
-- 1. Create the user_data table
-- "user" is a reserved keyword in PostgreSQL, so we use
-- "user_data" to avoid conflicts with built-in USER/CURRENT_USER.
create table public.user_data (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null,
  profile text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
 
comment on table public.user_data is 'Additional profile data for each authenticated user.';
 
-- 2. Enable Row Level Security
alter table public.user_data enable row level security;
 
-- 3. RLS Policies
create policy "Users can view their own data"
  on public.user_data
  for select
  using (auth.uid() = id);
 
create policy "Users can update their own data"
  on public.user_data
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
 
-- No insert/delete policy is defined on purpose:
--   - Insert is handled automatically by the trigger below.
--   - Delete happens automatically via ON DELETE CASCADE
--     when the related auth.users row is deleted.
 
-- 4. Auto-create a user_data row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_data (id, username, profile)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'username',
      split_part(new.email, '@', 1)
    ),
    null
  );
  return new;
end;
$$;
 
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();
 
-- 5. Auto-update the updated_at column whenever a row is updated
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
 
create trigger set_updated_at
  before update on public.user_data
  for each row
  execute procedure public.handle_updated_at();
 
-- ============================================================
-- Notes:
-- - Changing a user's password does NOT need any SQL here.
--   It's done client-side with:
--     supabase.auth.updateUser({ password: 'newPassword' })
-- - To pass a custom username at signup, send it as user metadata:
--     supabase.auth.signUp({
--       email, password,
--       options: { data: { username: 'yourUsername' } }
--     })
-- ============================================================