import { AddGoalButton } from "./add-goal-button";
import { SavingsGoalItem, type Goal } from "./savings-goal-item";

export function SavingsSection({ goals }: { goals: Goal[] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-stone-900">Savings Goals</p>
        <AddGoalButton />
      </div>

      {goals.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-200 py-6 text-center text-sm text-stone-400">
          No savings goal yet.
        </p>
      ) : (
        <div className="space-y-2">
          {goals.map((g) => (
            <SavingsGoalItem key={g.id} goal={g} />
          ))}
        </div>
      )}
    </div>
  );
}
