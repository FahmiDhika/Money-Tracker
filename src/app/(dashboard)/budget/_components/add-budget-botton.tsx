"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { BudgetFormSheet } from "./budget-form-sheet";

export function AddBudgetButton({
  periodType,
}: {
  periodType: "week" | "month";
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 rounded-full border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
      >
        <Plus className="h-3.5 w-3.5" />
        Add
      </button>

      <BudgetFormSheet
        open={open}
        onOpenChange={setOpen}
        periodType={periodType}
      />
    </>
  );
}
