"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { TransactionForm } from "@/validations/transaction-validation";
import { getCategoryIcon } from "./category-icons";

const INCOME_CATEGORIES = ["Uang Saku", "Gaji", "Project", "Tabungan", "Saham"];
const EXPENSE_CATEGORIES = ["Membership", "Jajan", "Makan", "Ngopi", "Transportasi", "Servis", "Biaya Admin"];

export function CategoryPicker({ form }: { form: UseFormReturn<TransactionForm> }) {
  const type = form.watch("type");
  const category = form.watch("category");
  const isFirstRender = useRef(true);

  const presets = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const [showCustomInput, setShowCustomInput] = useState(
    Boolean(category) && !presets.includes(category),
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    form.setValue("category", "");
    setShowCustomInput(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  return (
    <Controller
      control={form.control}
      name="category"
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-900">Category</label>

          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => {
              const { icon: Icon, bg, text } = getCategoryIcon(preset, type);
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
                  <Icon className={cn("h-3.5 w-3.5", isActive ? "text-white" : text)} />
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
              placeholder="Type your own category"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}

          {fieldState.error && <p className="text-xs text-red-600">{fieldState.error.message}</p>}
        </div>
      )}
    />
  );
}