import { formatCurrency } from "@/lib/utils";
import { TransactionItem } from "./transaction-item";
import { Calendar } from "lucide-react";

export type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  payment_method: string;
  note: string | null;
  transaction_date: string;
  tags: string[];
};

function groupByDate(transactions: Transaction[]) {
  const groups = new Map<string, Transaction[]>();
  for (const t of transactions) {
    const list = groups.get(t.transaction_date) ?? [];
    list.push(t);
    groups.set(t.transaction_date, list);
  }
  return Array.from(groups.entries());
}

export function TransactionList({
  transactions,
}: {
  transactions: Transaction[];
}) {
  if (transactions.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-stone-500">
        No transactions in this period.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {groupByDate(transactions).map(([date, items]) => {
        const dayInflow = items
          .filter((t) => t.type === "income")
          .reduce((s, t) => s + Number(t.amount), 0);
        const dayOutflow = items
          .filter((t) => t.type === "expense")
          .reduce((s, t) => s + Number(t.amount), 0);
        const dayTotal = dayInflow - dayOutflow;
        const dateObj = new Date(`${date}T00:00:00`);

        return (
          <div key={date}>
            <div className="mb-2 flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {dateObj.toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
              <span
                className={dayTotal < 0 ? "text-red-600" : "text-stone-900"}
              >
                {formatCurrency(dayTotal)}
              </span>
            </div>

            <div className="space-y-1">
              {items.map((t) => (
                <TransactionItem key={t.id} transaction={t} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
