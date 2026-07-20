export type TransactionFormState = {
  status?: "idle" | "error" | "success";
  errors?: {
    type?: string[];
    amount?: string[];
    category?: string[];
    payment_method?: string[];
    note?: string[];
    transaction_date?: string[];
    _form?: string[];
  };
};
