import { formatCurrency } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

export function NetIncomeCard({
  net,
  income,
  expense,
}: {
  net: number;
  income: number;
  expense: number;
}) {
  const max = Math.max(income, expense, 1);

  return (
    <div className="space-y-4 rounded-xl border border-stone-200 p-4 shadow-sm">
      <div>
        <p className="text-sm font-medium text-stone-500">Net Income</p>
        <p
          className={`text-2xl font-semibold ${net < 0 ? "text-red-600" : "text-emerald-700"}`}
        >
          {net < 0 ? "-" : "+"}
          {formatCurrency(Math.abs(net))}
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 font-medium text-emerald-700">
              <TrendingUp className="h-4 w-4" />
              Income
            </span>
            <span className="font-medium text-emerald-700">
              {formatCurrency(income)}
            </span>
          </div>
          <div className="h-3 rounded-full bg-stone-100">
            <div
              className="h-3 rounded-full bg-emerald-600"
              style={{ width: `${(income / max) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 font-medium text-red-600">
              <TrendingDown className="h-4 w-4" />
              Expense
            </span>
            <span className="font-medium text-red-600">
              {formatCurrency(expense)}
            </span>
          </div>
          <div className="h-3 rounded-full bg-stone-100">
            <div
              className="h-3 rounded-full bg-red-500"
              style={{ width: `${(expense / max) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
