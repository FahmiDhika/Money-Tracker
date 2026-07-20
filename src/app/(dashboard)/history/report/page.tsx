import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BalanceSummary } from "./_components/balance-summary";
import { NetIncomeCard } from "./_components/net-income-card";
import { CategoryDonut } from "./_components/category-donut";

export const metadata = { title: "Money Tracker | Report" };

type ReportPageProps = {
  searchParams: Promise<{ start?: string; end?: string }>;
};

type CategoryRow = {
  type: "income" | "expense";
  amount: number;
  category: string;
};

function groupByCategory(items: CategoryRow[]) {
  const map = new Map<string, number>();
  items.forEach((t) =>
    map.set(t.category, (map.get(t.category) ?? 0) + Number(t.amount)),
  );
  const total = Array.from(map.values()).reduce((s, v) => s + v, 0);
  return Array.from(map.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export default async function ReportPage({ searchParams }: ReportPageProps) {
  const params = await searchParams;
  const today = new Date().toISOString().split("T")[0];
  const start = params.start ?? today;
  const end = params.end ?? today;

  const supabase = await createClient();

  const { data: priorTransactions } = await supabase
    .from("transactions")
    .select("type, amount")
    .lt("transaction_date", start);

  const openingBalance =
    priorTransactions?.reduce(
      (sum, t) =>
        sum + (t.type === "income" ? Number(t.amount) : -Number(t.amount)),
      0,
    ) ?? 0;

  const { data: transactions } = await supabase
    .from("transactions")
    .select("type, amount, category")
    .gte("transaction_date", start)
    .lte("transaction_date", end);

  const income = (transactions ?? []).filter((t) => t.type === "income");
  const expense = (transactions ?? []).filter((t) => t.type === "expense");

  const totalIncome = income.reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = expense.reduce((s, t) => s + Number(t.amount), 0);
  const net = totalIncome - totalExpense;
  const endingBalance = openingBalance + net;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/history"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="text-xs text-stone-500">Report</p>
          <h1 className="text-lg font-semibold text-stone-900">
            {start} - {end}
          </h1>
        </div>
      </div>

      <BalanceSummary
        openingBalance={openingBalance}
        endingBalance={endingBalance}
      />
      <NetIncomeCard net={net} income={totalIncome} expense={totalExpense} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CategoryDonut
          title="Income"
          data={groupByCategory(income)}
          type="income"
        />
        <CategoryDonut
          title="Expense"
          data={groupByCategory(expense)}
          type="expense"
        />
      </div>
    </div>
  );
}
