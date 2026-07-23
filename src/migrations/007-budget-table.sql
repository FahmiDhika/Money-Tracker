-- ============================================================
-- Money Tracker - Budgets
-- Run this in the Supabase SQL Editor
-- ============================================================

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  period_type text not null check (period_type in ('week', 'month')),
  category text, -- null = overall total budget for that period type
  amount numeric(14, 2) not null check (amount > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.budgets is
  'Spending limit targets per category (or overall) per period. Resets every period automatically — spent amounts are always computed live from transactions, not stored here.';
comment on column public.budgets.category is 'NULL means this is the overall/total budget for the period_type, not tied to a specific category.';

-- Only one overall budget per user per period type
create unique index if not exists budgets_overall_unique_idx
  on public.budgets (user_id, period_type)
  where category is null;

-- Only one budget per user per period type per category
create unique index if not exists budgets_category_unique_idx
  on public.budgets (user_id, period_type, category)
  where category is not null;

alter table public.budgets enable row level security;

create policy "Users can view their own budgets"
  on public.budgets for select
  using (auth.uid() = user_id);

create policy "Users can insert their own budgets"
  on public.budgets for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own budgets"
  on public.budgets for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own budgets"
  on public.budgets for delete
  using (auth.uid() = user_id);

drop trigger if exists set_updated_at on public.budgets;
create trigger set_updated_at
  before update on public.budgets
  for each row
  execute procedure public.handle_updated_at();