export type BudgetFormState = {
  status?: "idle" | "error" | "success";
  errors?: {
    category?: string[];
    amount?: string[];
    _form?: string[];
  };
};
