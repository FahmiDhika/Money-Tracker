"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import { getCategoryIcon } from "@/components/common/transaction/category-icons";
import { BudgetFormSheet } from "./budget-form-sheet";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

type BudgetItemProps = {
  budget: {
    id: string;
    period_type: "week" | "month";
    category: string | null;
    amount: number;
    spent: number;
    percentage: number;
    status: "ok" | "warning" | "over";
  };
};

export function BudgetItem({ budget }: BudgetItemProps) {
  const [open, setOpen] = useState(false);
  const iconConfig = budget.category
    ? getCategoryIcon(budget.category, "expense")
    : { icon: Wallet, bg: "bg-stone-100", text: "text-stone-600" };
  const Icon = iconConfig.icon;

  const barColor =
    budget.status === "over"
      ? "bg-red-500"
      : budget.status === "warning"
        ? "bg-amber-500"
        : "bg-emerald-600";
  const labelColor =
    budget.status === "over"
      ? "text-red-600"
      : budget.status === "warning"
        ? "text-amber-600"
        : "text-emerald-700";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-stone-200 p-3 text-left hover:bg-stone-50"
      >
        <div className="mb-2 flex items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconConfig.bg}`}
          >
            <Icon className={`h-4 w-4 ${iconConfig.text}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-stone-900">
              {budget.category ?? "Overall"}
            </p>
            <p className="text-xs text-stone-500">
              {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
            </p>
          </div>
          <span className={`text-xs font-semibold ${labelColor}`}>
            {budget.percentage}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-stone-100">
          <div
            className={`h-2 rounded-full ${barColor}`}
            style={{ width: `${Math.min(budget.percentage, 100)}%` }}
          />
        </div>
      </button>

      <BudgetFormSheet
        open={open}
        onOpenChange={setOpen}
        periodType={budget.period_type}
        initialBudget={{
          id: budget.id,
          category: budget.category,
          amount: budget.amount,
        }}
      />
    </>
  );
}
