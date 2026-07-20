"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TransactionFields } from "@/components/common/transaction/transaction-fields";
import {
  TransactionForm as TransactionFormType,
  transactionSchema,
} from "@/validations/transaction-validation";
import { INITIAL_STATE_TRANSACTION_FORM } from "@/constants/transaction-constant";
import {
  updateTransaction,
  deleteTransaction,
} from "../../transaction/actions";
import { Transaction } from "./transaction-list";

type EditTransactionSheetProps = {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditTransactionSheet({
  transaction,
  open,
  onOpenChange,
}: EditTransactionSheetProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<TransactionFormType>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: transaction.type,
      amount: String(transaction.amount),
      category: transaction.category,
      payment_method: transaction.payment_method,
      note: transaction.note ?? "",
      transaction_date: transaction.transaction_date,
    },
  });

  const [state, formAction, isPending] = useActionState(
    updateTransaction,
    INITIAL_STATE_TRANSACTION_FORM,
  );

  const handleSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("id", transaction.id);
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value ?? ""));
    });

    startTransition(() => {
      formAction(formData);
    });
  });

  useEffect(() => {
    if (state?.status === "error") {
      toast.error("Could not update transaction", {
        description: state.errors?._form?.[0],
      });
      startTransition(() => {
        formAction(null);
      });
    }

    if (state?.status === "success") {
      toast.success("Transaction updated");
      onOpenChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const handleDelete = async () => {
    setIsDeleting(true);
    const { error } = await deleteTransaction(transaction.id);
    setIsDeleting(false);

    if (error) {
      toast.error("Could not delete transaction", { description: error });
      return;
    }

    toast.success("Transaction deleted");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto bg-muted">
        <SheetHeader>
          <SheetTitle>Edit Transaction</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5 px-4 pb-4">
          <TransactionFields form={form} />

          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isDeleting}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this transaction?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This transaction will be
                    permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-emerald-700 hover:bg-emerald-800"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
