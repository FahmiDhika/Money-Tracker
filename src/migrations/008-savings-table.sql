-- ============================================================
-- Money Tracker - Savings Goals
-- Run this in the Supabase SQL Editor
-- ============================================================

create table if not exists public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  name text not null,
  target_amount numeric(14, 2) not null check (target_amount > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.savings_contributions (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.savings_goals (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  amount numeric(14, 2) not null check (amount > 0),
  note text,
  contributed_at date not null default current_date,
  created_at timestamptz not null default now()
);

comment on table public.savings_goals is 'Savings targets the user sets manually (e.g. "Buy a laptop").';
comment on table public.savings_contributions is 'Manual deposits toward a savings goal, entered separately from regular transactions.';

alter table public.savings_goals enable row level security;
alter table public.savings_contributions enable row level security;

create policy "Users can view their own goals"
  on public.savings_goals for select using (auth.uid() = user_id);
create policy "Users can insert their own goals"
  on public.savings_goals for insert with check (auth.uid() = user_id);
create policy "Users can update their own goals"
  on public.savings_goals for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own goals"
  on public.savings_goals for delete using (auth.uid() = user_id);

create policy "Users can view their own contributions"
  on public.savings_contributions for select using (auth.uid() = user_id);
create policy "Users can insert their own contributions"
  on public.savings_contributions for insert with check (auth.uid() = user_id);
create policy "Users can delete their own contributions"
  on public.savings_contributions for delete using (auth.uid() = user_id);

drop trigger if exists set_updated_at on public.savings_goals;
create trigger set_updated_at
  before update on public.savings_goals
  for each row
  execute procedure public.handle_updated_at();