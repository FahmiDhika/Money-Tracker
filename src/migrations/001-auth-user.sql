-- ============================================================
-- Money Tracker - User Authentication & User Data Setup
-- Run this in the Supabase SQL Editor
-- ============================================================
 
-- 1. Create the user_data table
-- id is a 1:1 reference to auth.users(id), so deleting the auth
-- user automatically deletes the matching row here.
create table if not exists public.user (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null,
  profile text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.user is 'Additional profile data for each authenticated user.';

-- 2. Enable Row Level Security
alter table public.user enable row level security;

-- 3. RLS Policies
-- Users can only read their own row
create policy "Users can view their own data"
  on public.user
  for select
  using (auth.uid() = id);

-- Users can only update their own row (username & profile)
create policy "Users can update their own data"
  on public.user
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- No insert/delete policy is defined on purpose:
--   - Insert is handled automatically by the trigger below.
--   - Delete happens automatically via ON DELETE CASCADE
--     when the related auth.users row is deleted.

-- 4. Auto-create a user row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user (id, username)
  values (
    new.id,
    coalesce(
      new.raw_user_meta ->> 'username',
      split_part(new.email, '@', 1)
    ),
    '{}'::jsonb
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

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

drop trigger if exists set_updated_at on public.user;

create trigger set_updated_at
  before update on public.user
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