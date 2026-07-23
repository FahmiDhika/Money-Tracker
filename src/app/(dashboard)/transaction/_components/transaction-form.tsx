"use client";

import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common/form-input";
import { TypeToggle } from "@/components/common/transaction/type-toggle";
import { AmountInput } from "@/components/common/transaction/amount-input";
import { CategoryPicker } from "@/components/common/transaction/category-picker";
import { PaymentMethodPicker } from "@/components/common/transaction/payment-method-picker";
import {
  TransactionForm as TransactionFormType,
  transactionSchema,
} from "@/validations/transaction-validation";
import {
  INITIAL_TRANSACTION_FORM,
  INITIAL_STATE_TRANSACTION_FORM,
} from "@/constants/transaction-constant";
import { createTransaction } from "../actions";
import { TagInput } from "@/components/common/transaction/tag-input";

export function TransactionForm() {
  const form = useForm<TransactionFormType>({
    resolver: zodResolver(transactionSchema),
    defaultValues: INITIAL_TRANSACTION_FORM,
  });

  const type = form.watch("type");

  const [state, formAction, isPending] = useActionState(
    createTransaction,
    INITIAL_STATE_TRANSACTION_FORM,
  );

  const handleSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "tags" && Array.isArray(value)) {
        value.forEach((tag) => formData.append("tags", tag));
        return;
      }
      formData.append(key, String(value ?? ""));
    });

    startTransition(() => {
      formAction(formData);
    });
  });

  useEffect(() => {
    if (state?.status === "error") {
      toast.error("Could not save transaction", {
        description: state.errors?._form?.[0],
      });
      startTransition(() => {
        formAction(null);
      });
    }

    if (state?.status === "success") {
      toast.success("Transaction saved");
      form.reset(INITIAL_TRANSACTION_FORM);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div
        className={`rounded-2xl border p-4 transition-colors ${
          type === "income"
            ? "border-emerald-200 bg-emerald-50"
            : "border-red-200 bg-red-50"
        }`}
      >
        <TypeToggle form={form} />
        <AmountInput form={form} />
      </div>

      <CategoryPicker form={form} />
      <PaymentMethodPicker form={form} />
      <FormInput form={form} name="transaction_date" type="date" label="Date" />
      <TagInput form={form} />
      <FormInput
        form={form}
        name="note"
        label="Note (optional)"
        placeholder="Add a note"
        multiline
      />

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-emerald-700 hover:bg-emerald-800"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Save transaction"
        )}
      </Button>
    </form>
  );
}
