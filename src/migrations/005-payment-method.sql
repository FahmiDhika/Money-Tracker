-- ============================================================
-- Money Tracker - Add payment_method to transactions
-- Run this in the Supabase SQL Editor
-- ============================================================

alter table public.transactions
  add column if not exists payment_method text not null default 'Cash';

comment on column public.transactions.payment_method is
  'Free text field for how the money moved (e.g. Cash, E-Wallet, Bank). Not an enum on purpose, so the user can type a custom value.';