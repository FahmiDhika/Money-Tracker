"use client";

import { Controller, UseFormReturn } from "react-hook-form";
import { TransactionForm } from "@/validations/transaction-validation";

export function AmountInput({
  form,
}: {
  form: UseFormReturn<TransactionForm>;
}) {
  const type = form.watch("type");

  return (
    <Controller
      control={form.control}
      name="amount"
      render={({ field, fieldState }) => (
        <div className="flex flex-col items-center py-2">
          <div
            className={`flex items-baseline gap-1 text-4xl font-bold ${
              type === "income" ? "text-emerald-700" : "text-red-600"
            }`}
          >
            <span className="text-xl">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              className="w-44 bg-transparent text-center outline-none placeholder:text-stone-300"
              value={
                field.value ? Number(field.value).toLocaleString("id-ID") : ""
              }
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                field.onChange(raw);
              }}
            />
          </div>
          {fieldState.error && (
            <p className="mt-1 text-xs text-red-600">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
