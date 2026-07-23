import { createClient } from "@/lib/supabase/server";
import { getPeriodRange, toDateString } from "@/lib/period";
import { getBudgetStatus } from "@/lib/budget";
import { BudgetSection } from "./_components/budget-section";

export const metadata = { title: "Money Tracker | Budget" };

export default async function BudgetPage() {
  const supabase = await createClient();

  const { data: budgets } = await supabase
    .from("budgets")
    .select("*")
    .order("category", { ascending: true, nullsFirst: true });

  const weekRange = getPeriodRange("week", 0);
  const monthRange = getPeriodRange("month", 0);

  const { data: weekTransactions } = await supabase
    .from("transactions")
    .select("category, amount")
    .eq("type", "expense")
    .gte("transaction_date", toDateString(weekRange.start))
    .lte("transaction_date", toDateString(weekRange.end));

  const { data: monthTransactions } = await supabase
    .from("transactions")
    .select("category, amount")
    .eq("type", "expense")
    .gte("transaction_date", toDateString(monthRange.start))
    .lte("transaction_date", toDateString(monthRange.end));

  function computeSpent(category: string | null, items: { category: string; amount: number }[]) {
    return items
      .filter((t) => (category ? t.category === category : true))
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }

  function withProgress(list: typeof budgets, items: { category: string; amount: number }[]) {
    return (list ?? []).map((b) => {
      const spent = computeSpent(b.category, items);
      const percentage = Math.min(Math.round((spent / Number(b.amount)) * 100), 999);
      return { ...b, spent, percentage, status: getBudgetStatus(percentage) };
    });
  }

  const weekBudgets = withProgress(
    (budgets ?? []).filter((b) => b.period_type === "week"),
    weekTransactions ?? [],
  );
  const monthBudgets = withProgress(
    (budgets ?? []).filter((b) => b.period_type === "month"),
    monthTransactions ?? [],
  );

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-stone-900">Budget</h1>
      <BudgetSection title="This Week" periodType="week" budgets={weekBudgets} />
      <BudgetSection title="This Month" periodType="month" budgets={monthBudgets} />
    </div>
  );
}