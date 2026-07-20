import { TransactionForm } from "@/validations/transaction-validation";
import { TransactionFormState } from "@/types/transaction";

export const INITIAL_TRANSACTION_FORM: TransactionForm = {
  type: "expense",
  amount: "",
  category: "",
  payment_method: "",
  note: "",
  transaction_date: new Date().toISOString().split("T")[0],
};

export const INITIAL_STATE_TRANSACTION_FORM: TransactionFormState = {
  status: "idle",
  errors: {},
};
