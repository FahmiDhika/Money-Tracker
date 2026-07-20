import { createClient } from "@/lib/supabase/server";
import { getPeriodRange, PeriodType, toDateString } from "@/lib/period";
import { PeriodTypeSelector } from "./_components/period-type-selector";
import { PeriodStrip } from "./_components/period-strip";
import { SummaryCard } from "./_components/summary-card";
import { TransactionList } from "./_components/transaction-list";
import { SearchButton } from "./_components/search-button";

export const metadata = { title: "Money Tracker | History" };

type HistoryPageProps = {
  searchParams: Promise<{
    type?: string;
    offset?: string;
    start?: string;
    end?: string;
  }>;
};

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const params = await searchParams;
  const type = (params.type ?? "month") as PeriodType;
  const offset = Number(params.offset ?? 0);

  const isCustomRange = Boolean(params.start && params.end);
  const range = isCustomRange
    ? {
        start: new Date(`${params.start}T00:00:00`),
        end: new Date(`${params.end}T23:59:59`),
        label: `${params.start} - ${params.end}`,
      }
    : getPeriodRange(type, offset);

  const supabase = await createClient();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .gte("transaction_date", toDateString(range.start))
    .lte("transaction_date", toDateString(range.end))
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false });

  const inflow =
    transactions
      ?.filter((t) => t.type === "income")
      .reduce((s, t) => s + Number(t.amount), 0) ?? 0;
  const outflow =
    transactions
      ?.filter((t) => t.type === "expense")
      .reduce((s, t) => s + Number(t.amount), 0) ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-stone-900">History</h1>
        <SearchButton />
      </div>

      <PeriodTypeSelector currentType={type} />
      {!isCustomRange && <PeriodStrip type={type} currentOffset={offset} />}

      <SummaryCard
        inflow={inflow}
        outflow={outflow}
        periodLabel={range.label}
        rangeStart={toDateString(range.start)}
        rangeEnd={toDateString(range.end)}
      />

      <TransactionList transactions={transactions ?? []} />
    </div>
  );
}
