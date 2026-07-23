import { createClient } from "@/lib/supabase/server";
import { getPeriodRange, toDateString } from "@/lib/period";
import { BalanceHeader } from "./_components/balance-header";
import { WalletsCard } from "./_components/wallets-card";
import { ReportCard } from "./_components/report-card";
import { TopSpendingCard } from "./_components/top-spending-card";
import { RecentTransactions } from "./_components/recent-transactions";
import { ReminderBanner } from "./_components/reminder-banner-loader";

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

  return (
    <div className="space-y-5">
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
    </div>
  );
}
