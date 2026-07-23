export type BudgetStatus = "ok" | "warning" | "over";

export function getBudgetStatus(percentage: number): BudgetStatus {
  if (percentage >= 100) return "over";
  if (percentage >= 80) return "warning";
  return "ok";
}
