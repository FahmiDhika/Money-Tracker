"use client";

import { useState } from "react";
import { Plus, Target } from "lucide-react";
import { GoalFormSheet } from "./goal-form-sheet";
import { ContributionSheet } from "./contribution-sheet";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export type Contribution = {
  id: string;
  amount: number;
  note: string | null;
  contributed_at: string;
};
export type Goal = {
  id: string;
  name: string;
  target_amount: number;
  saved: number;
  percentage: number;
  contributions: Contribution[];
};

const PREVIEW_COUNT = 3;

export function SavingsGoalItem({ goal }: { goal: Goal }) {
  const [editOpen, setEditOpen] = useState(false);
  const [contributeOpen, setContributeOpen] = useState(false);
  const achieved = goal.percentage >= 100;

  const previewContributions = goal.contributions.slice(0, PREVIEW_COUNT);
  const remainingCount =
    goal.contributions.length - previewContributions.length;

  return (
    <>
      <div className="rounded-xl border border-stone-200 p-3">
        <div className="mb-2 flex items-center gap-3">
          <button
            onClick={() => setEditOpen(true)}
            className="flex flex-1 items-center gap-3 text-left"
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${achieved ? "bg-emerald-100" : "bg-cyan-100"}`}
            >
              <Target
                className={`h-4 w-4 ${achieved ? "text-emerald-700" : "text-cyan-600"}`}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-stone-900">{goal.name}</p>
              <p className="text-xs text-stone-500">
                {formatCurrency(goal.saved)} /{" "}
                {formatCurrency(goal.target_amount)}
              </p>
            </div>
          </button>

          <button
            onClick={() => setContributeOpen(true)}
            className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-800"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>

        <div className="h-2 rounded-full bg-stone-100">
          <div
            className={`h-2 rounded-full ${achieved ? "bg-emerald-600" : "bg-cyan-500"}`}
            style={{ width: `${Math.min(goal.percentage, 100)}%` }}
          />
        </div>
        <p className="mb-2 mt-1 text-right text-xs font-medium text-stone-500">
          {goal.percentage}% {achieved && "🎉 Goal reached!"}
        </p>

        {previewContributions.length > 0 && (
          <div className="space-y-1 border-t border-stone-100 pt-2">
            {previewContributions.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-stone-500">
                  {new Date(`${c.contributed_at}T00:00:00`).toLocaleDateString(
                    "en-US",
                    {
                      day: "numeric",
                      month: "short",
                    },
                  )}
                  {c.note ? ` · ${c.note}` : ""}
                </span>
                <span className="font-medium text-stone-900">
                  {formatCurrency(c.amount)}
                </span>
              </div>
            ))}

            {remainingCount > 0 && (
              <button
                onClick={() => setEditOpen(true)}
                className="pt-1 text-xs font-medium text-emerald-700 hover:underline"
              >
                Lihat semua ({goal.contributions.length})
              </button>
            )}
          </div>
        )}
      </div>

      <GoalFormSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        initialGoal={{
          id: goal.id,
          name: goal.name,
          target_amount: goal.target_amount,
        }}
        contributions={goal.contributions}
      />
      <ContributionSheet
        open={contributeOpen}
        onOpenChange={setContributeOpen}
        goalId={goal.id}
        goalName={goal.name}
      />
    </>
  );
}
