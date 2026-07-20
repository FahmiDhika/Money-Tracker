"use client";

import { UseFormReturn } from "react-hook-form";
import { FormInput } from "@/components/common/form-input";
import { TypeToggle } from "./type-toggle";
import { CategoryPicker } from "./category-picker";
import { PaymentMethodPicker } from "./payment-method-picker";
import { TransactionForm } from "@/validations/transaction-validation";

export function TransactionFields({
  form,
}: {
  form: UseFormReturn<TransactionForm>;
}) {
  return (
    <>
      <TypeToggle form={form} />
      <FormInput
        form={form}
        name="amount"
        type="number"
        label="Amount"
        placeholder="0"
      />
      <CategoryPicker form={form} />
      <PaymentMethodPicker form={form} />
      <FormInput form={form} name="transaction_date" type="date" label="Date" />
      <FormInput
        form={form}
        name="note"
        label="Note (optional)"
        placeholder="Add a note"
        multiline
      />
    </>
  );
}
