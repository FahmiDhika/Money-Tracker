import { AddBudgetButton } from "./add-budget-botton";
import { BudgetItem } from "./budget-item";

type Budget = {
  id: string;
  period_type: "week" | "month";
  category: string | null;
  amount: number;
  spent: number;
  percentage: number;
  status: "ok" | "warning" | "over";
};

export function BudgetSection({
  title,
  periodType,
  budgets,
}: {
  title: string;
  periodType: "week" | "month";
  budgets: Budget[];
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-stone-900">{title}</p>
        <AddBudgetButton periodType={periodType} />
      </div>

      {budgets.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-200 py-6 text-center text-sm text-stone-400">
          No budget set for this period yet.
        </p>
      ) : (
        <div className="space-y-2">
          {budgets.map((b) => (
            <BudgetItem key={b.id} budget={b} />
          ))}
        </div>
      )}
    </div>
  );
}