-- ============================================================
-- Money Tracker - Add tags to transactions
-- Run this in the Supabase SQL Editor
-- ============================================================

alter table public.transactions
  add column if not exists tags text[] not null default '{}';

comment on column public.transactions.tags is
  'Free-form labels for cross-category grouping (e.g. trip or event names). Stored as an array instead of a separate table, for simplicity.';

-- GIN index so filtering/containment queries on tags stay fast as data grows
create index if not exists transactions_tags_gin_idx
  on public.transactions using gin (tags);

-- Helper function: list all distinct tags the current user has used before,
-- for autocomplete suggestions in the tag input.
create or replace function public.get_user_tags()
returns table (tag text)
language sql
stable
as $$
  select distinct unnest(tags) as tag
  from public.transactions
  where user_id = auth.uid()
  order by tag;
$$;

grant execute on function public.get_user_tags() to authenticated;