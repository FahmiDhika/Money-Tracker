"use server";

import { createClient } from "@/lib/supabase/server";

export async function searchTransactions(query: string) {
  if (!query.trim()) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .or(
      `category.ilike.%${query}%,note.ilike.%${query}%,payment_method.ilike.%${query}%`,
    )
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}
