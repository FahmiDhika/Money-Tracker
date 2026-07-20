"use client";

import { Controller, UseFormReturn } from "react-hook-form";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { TransactionForm } from "@/validations/transaction-validation";

export function TypeToggle({ form }: { form: UseFormReturn<TransactionForm> }) {
  return (
    <Controller
      control={form.control}
      name="type"
      render={({ field }) => (
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-white/60 p-1">
          <button
            type="button"
            onClick={() => field.onChange("expense")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors",
              field.value === "expense"
                ? "bg-red-600 text-white shadow-sm"
                : "text-stone-500 hover:text-stone-900",
            )}
          >
            <TrendingDown className="h-4 w-4" />
            Expense
          </button>
          <button
            type="button"
            onClick={() => field.onChange("income")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors",
              field.value === "income"
                ? "bg-emerald-700 text-white shadow-sm"
                : "text-stone-500 hover:text-stone-900",
            )}
          >
            <TrendingUp className="h-4 w-4" />
            Income
          </button>
        </div>
      )}
    />
  );
}
