import Link from "next/link";
import { AlertTriangle } from "lucide-react";

type Warning = {
  label: string;
  percentage: number;
  status: "warning" | "over";
};

export function BudgetWarningBanner({ warnings }: { warnings: Warning[] }) {
  if (warnings.length === 0) return null;

  return (
    <div className="space-y-2 rounded-xl border border-red-200 bg-red-50 p-3">
      <div className="flex items-center gap-2 text-red-700">
        <AlertTriangle className="h-4 w-4" />
        <p className="text-sm font-medium">Budget alert</p>
      </div>
      <ul className="space-y-1 text-xs text-red-700">
        {warnings.map((w) => (
          <li key={w.label}>
            {w.label}: {w.percentage}%{" "}
            {w.status === "over" ? "over budget" : "of budget used"}
          </li>
        ))}
      </ul>
      <Link
        href="/budget"
        className="text-xs font-medium text-red-700 underline"
      >
        View budgets
      </Link>
    </div>
  );
}
