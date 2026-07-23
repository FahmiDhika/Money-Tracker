"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { GoalFormSheet } from "./goal-form-sheet";

export function AddGoalButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 rounded-full border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Goal
      </button>
      <GoalFormSheet open={open} onOpenChange={setOpen} />
    </>
  );
}
