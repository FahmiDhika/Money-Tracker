export type SavingsFormState = {
  status?: "idle" | "error" | "success";
  errors?: {
    name?: string[];
    target_amount?: string[];
    amount?: string[];
    note?: string[];
    contributed_at?: string[];
    _form?: string[];
  };
};
