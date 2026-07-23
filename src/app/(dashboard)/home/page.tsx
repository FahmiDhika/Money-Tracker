import { createClient } from "@/lib/supabase/server";
import { getPeriodRange, toDateString } from "@/lib/period";
import { BalanceHeader } from "./_components/balance-header";
import { WalletsCard } from "./_components/wallets-card";
import { ReportCard } from "./_components/report-card";
import { TopSpendingCard } from "./_components/top-spending-card";
import { RecentTransactions } from "./_components/recent-transactions";
import { ReminderBanner } from "./_components/reminder-banner-loader";
import { getBudgetStatus } from "@/lib/budget";
import { BudgetWarningBanner } from "./_components/budget-warning-banner";
import { SpendingHeatmap } from "./_components/spending-heatmap";

export const metadata = { title: "Money Tracker | Home" };

type HomePageProps = {
  searchParams: Promise<{ range?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const range = params.range === "week" ? "week" : "month";

  const supabase = await createClient();

  const { data: allTransactions } = await supabase
    .from("transactions")
    .select("type, amount, payment_method");

  const totalBalance = (allTransactions ?? []).reduce(
    (sum, t) =>
      sum + (t.type === "income" ? Number(t.amount) : -Number(t.amount)),
    0,
  );

  const walletMap = new Map<string, number>();
  (allTransactions ?? []).forEach((t) => {
    const current = walletMap.get(t.payment_method) ?? 0;
    walletMap.set(
      t.payment_method,
      current + (t.type === "income" ? Number(t.amount) : -Number(t.amount)),
    );
  });
  const wallets = Array.from(walletMap.entries()).map(([name, balance]) => ({
    name,
    balance,
  }));

  const thisPeriod = getPeriodRange(range, 0);
  const lastPeriod = getPeriodRange(range, -1);
  const thisPeriodStartStr = thisPeriod.start.toISOString().split("T")[0];

  const { data: periodTransactions } = await supabase
    .from("transactions")
    .select("type, amount, category, transaction_date")
    .gte("transaction_date", toDateString(lastPeriod.start))
    .lte("transaction_date", toDateString(thisPeriod.end))
    .order("transaction_date", { ascending: true });

  const thisPeriodItems = (periodTransactions ?? []).filter(
    (t) => t.transaction_date >= thisPeriodStartStr,
  );
  const lastPeriodItems = (periodTransactions ?? []).filter(
    (t) => t.transaction_date < thisPeriodStartStr,
  );

  const thisPeriodExpense = thisPeriodItems
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);
  const lastPeriodExpense = lastPeriodItems
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);

  const todayStr = toDateString(new Date());
  const hasTransactionToday = thisPeriodItems.some(
    (t) => t.transaction_date === todayStr,
  );

  const { data: recentTransactions } = await supabase
    .from("transactions")
    .select("*")
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: budgets } = await supabase.from("budgets").select("*");

  const weekRangeForBudget = getPeriodRange("week", 0);
  const monthRangeForBudget = getPeriodRange("month", 0);

  const { data: weekExpenses } = await supabase
    .from("transactions")
    .select("category, amount")
    .eq("type", "expense")
    .gte("transaction_date", toDateString(weekRangeForBudget.start))
    .lte("transaction_date", toDateString(weekRangeForBudget.end));

  const { data: monthExpenses } = await supabase
    .from("transactions")
    .select("category, amount")
    .eq("type", "expense")
    .gte("transaction_date", toDateString(monthRangeForBudget.start))
    .lte("transaction_date", toDateString(monthRangeForBudget.end));

  function computeBudgetSpent(
    category: string | null,
    items: { category: string; amount: number }[],
  ) {
    return items
      .filter((t) => (category ? t.category === category : true))
      .reduce((s, t) => s + Number(t.amount), 0);
  }

  const budgetWarnings = (budgets ?? [])
    .map((b) => {
      const items =
        b.period_type === "week" ? (weekExpenses ?? []) : (monthExpenses ?? []);
      const spent = computeBudgetSpent(b.category, items);
      const percentage = Math.round((spent / Number(b.amount)) * 100);
      return {
        label: `${b.category ?? "Overall"} (${b.period_type === "week" ? "This Week" : "This Month"})`,
        percentage,
        status: getBudgetStatus(percentage),
      };
    })
    .filter((w) => w.status !== "ok") as {
    label: string;
    percentage: number;
    status: "warning" | "over";
  }[];

  const heatmapStart = new Date();
  heatmapStart.setDate(heatmapStart.getDate() - 90);

  const { data: heatmapTransactions } = await supabase
    .from("transactions")
    .select("type, amount, transaction_date")
    .gte("transaction_date", toDateString(heatmapStart));

  const heatmapMap = new Map<string, number>();
  (heatmapTransactions ?? []).forEach((t) => {
    const current = heatmapMap.get(t.transaction_date) ?? 0;
    heatmapMap.set(
      t.transaction_date,
      current + (t.type === "income" ? Number(t.amount) : -Number(t.amount)),
    );
  });
  const heatmapDays = Array.from(heatmapMap.entries()).map(([date, net]) => ({
    date,
    net,
  }));

  return (
    <div className="space-y-5">
      <BudgetWarningBanner warnings={budgetWarnings} />
      <ReminderBanner show={!hasTransactionToday} todayStr={todayStr} />
      <BalanceHeader balance={totalBalance} />
      <WalletsCard wallets={wallets} />
      <ReportCard
        range={range}
        thisPeriodItems={thisPeriodItems}
        thisPeriodExpense={thisPeriodExpense}
        lastPeriodExpense={lastPeriodExpense}
      />
      <TopSpendingCard range={range} items={thisPeriodItems} />
      <RecentTransactions transactions={recentTransactions ?? []} />
      <SpendingHeatmap days={heatmapDays} />
    </div>
  );
}
