import { formatCurrency } from "@/lib/utils";
import { getCategoryIcon } from "@/components/common/transaction/category-icons";

type Item = { type: "income" | "expense"; amount: number; category: string };

export function TopSpendingCard({
  range,
  items,
}: {
  range: "week" | "month";
  items: Item[];
}) {
  const map = new Map<string, number>();
  items
    .filter((t) => t.type === "expense")
    .forEach((t) =>
      map.set(t.category, (map.get(t.category) ?? 0) + Number(t.amount)),
    );

  const total = Array.from(map.values()).reduce((s, v) => s + v, 0);
  const ranked = Array.from(map.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-stone-200 p-4 shadow-sm">
      <p className="mb-3 text-sm font-semibold text-stone-900">
        Top Spending ({range === "week" ? "This Week" : "This Month"})
      </p>

      {ranked.length === 0 ? (
        <p className="py-4 text-center text-sm text-stone-400">
          No expenses yet.
        </p>
      ) : (
        <div className="space-y-4">
          {ranked.map((item) => {
            const {
              icon: Icon,
              bg,
              text,
              solid,
            } = getCategoryIcon(item.category, "expense");
            return (
              <div key={item.category} className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${bg}`}
                >
                  <Icon className={`h-4 w-4 ${text}`} />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-stone-900">
                      {item.category}
                    </span>
                    <span className={text}>{item.percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-stone-100">
                    <div
                      className={`h-2 rounded-full ${solid}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className="mt-0.5 text-xs text-stone-500">
                    {formatCurrency(item.amount)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
