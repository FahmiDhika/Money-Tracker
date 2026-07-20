import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";
import { getCategoryIcon } from "@/components/common/transaction/category-icons";

type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  transaction_date: string;
};

export function RecentTransactions({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <div className="rounded-xl border border-stone-200 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-stone-900">
          Recent Transactions
        </p>
        <Link
          href="/history"
          className="text-xs font-medium text-emerald-700 hover:underline"
        >
          See all
        </Link>
      </div>

      {transactions.length === 0 ? (
        <p className="py-4 text-center text-sm text-stone-400">
          No transactions yet.
        </p>
      ) : (
        <div className="space-y-3">
          {transactions.map((t) => {
            const {
              icon: Icon,
              bg,
              text,
            } = getCategoryIcon(t.category, t.type);
            return (
              <div key={t.id} className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${bg}`}
                >
                  <Icon className={`h-5 w-5 ${text}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-stone-900">
                    {t.category}
                  </p>
                  <p className="text-xs text-stone-500">
                    {new Date(
                      `${t.transaction_date}T00:00:00`,
                    ).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    t.type === "income" ? "text-emerald-700" : "text-red-600",
                  )}
                >
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
