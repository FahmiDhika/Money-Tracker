"use client";

import { useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { TransactionForm } from "@/validations/transaction-validation";
import { getPaymentMethodIcon } from "./category-icons";

const PRESETS = ["Cash", "E-Wallet", "Bank", "Kartu Kredit"];

export function PaymentMethodPicker({
  form,
}: {
  form: UseFormReturn<TransactionForm>;
}) {
  const currentValue = form.watch("payment_method");
  const [showCustomInput, setShowCustomInput] = useState(
    Boolean(currentValue) && !PRESETS.includes(currentValue),
  );

  return (
    <Controller
      control={form.control}
      name="payment_method"
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-900">
            Payment method
          </label>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => {
              const { icon: Icon, bg, text } = getPaymentMethodIcon(preset);
              const isActive = field.value === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setShowCustomInput(false);
                    field.onChange(preset);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "border-emerald-700 bg-emerald-700 text-white"
                      : `border-stone-200 ${bg} ${text} hover:opacity-80`,
                  )}
                >
                  <Icon
                    className={cn(
                      "h-3.5 w-3.5",
                      isActive ? "text-white" : text,
                    )}
                  />
                  {preset}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setShowCustomInput(true);
                field.onChange("");
              }}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                showCustomInput
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-stone-200 text-stone-600 hover:bg-stone-50",
              )}
            >
              Other
            </button>
          </div>

          {showCustomInput && (
            <Input
              placeholder="e.g. Credit Card"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}

          {fieldState.error && (
            <p className="text-xs text-red-600">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
