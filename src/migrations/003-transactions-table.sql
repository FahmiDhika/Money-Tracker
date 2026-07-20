-- ============================================================
-- Money Tracker - Transactions Table
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Create the transactions table
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  type text not null check (type in ('income', 'expense')),
  amount numeric(14, 2) not null check (amount > 0),
  category text not null,
  note text,
  transaction_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.transactions is 'Income and expense records for the money tracker.';
comment on column public.transactions.amount is 'Always stored as a positive value; sign is derived from `type`.';
comment on column public.transactions.transaction_date is 'The date the transaction actually happened (can be backdated), separate from created_at.';

-- 2. Index for the most common query: list transactions newest-first per user
create index if not exists transactions_user_id_transaction_date_idx
  on public.transactions (user_id, transaction_date desc);

-- 3. Enable Row Level Security
alter table public.transactions enable row level security;

-- 4. RLS Policies — a user can only see and manage their own transactions
create policy "Users can view their own transactions"
  on public.transactions
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
  on public.transactions
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own transactions"
  on public.transactions
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own transactions"
  on public.transactions
  for delete
  using (auth.uid() = user_id);

-- 5. Auto-update updated_at on every row change
-- Reuses the handle_updated_at() function created earlier for user_data.
drop trigger if exists set_updated_at on public.transactions;

create trigger set_updated_at
  before update on public.transactions
  for each row
  execute procedure public.handle_updated_at();

-- ============================================================
-- Notes:
-- - `user_id` defaults to auth.uid(), so client inserts don't need
--   to pass it manually — just send type, amount, category, etc.
-- - Balance calculation example:
--     select
--       sum(case when type = 'income' then amount else -amount end) as balance
--     from public.transactions
--     where user_id = auth.uid();
-- ============================================================