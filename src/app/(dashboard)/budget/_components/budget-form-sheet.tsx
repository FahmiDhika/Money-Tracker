"use client";

import { startTransition, useActionState, useEffect } from "react";
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
import { FormInput } from "@/components/common/form-input";
import { budgetSchema, BudgetForm } from "@/validations/budget-validation";
import { INITIAL_STATE_BUDGET_FORM } from "@/constants/budget-constant";
import { createBudget, updateBudget, deleteBudget } from "../actions";

const EXPENSE_CATEGORIES = [
  "Membership",
  "Jajan",
  "Makan",
  "Ngopi",
  "Transportasi",
  "Servis",
  "Biaya Admin",
];

type BudgetFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  periodType: "week" | "month";
  initialBudget?: { id: string; category: string | null; amount: number };
};

export function BudgetFormSheet({
  open,
  onOpenChange,
  periodType,
  initialBudget,
}: BudgetFormSheetProps) {
  const isEdit = Boolean(initialBudget);

  const form = useForm<BudgetForm>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: initialBudget?.category ?? "",
      amount: initialBudget ? String(initialBudget.amount) : "",
    },
  });

  const action = isEdit ? updateBudget : createBudget;
  const [state, formAction, isPending] = useActionState(
    action,
    INITIAL_STATE_BUDGET_FORM,
  );

  const handleSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    if (initialBudget) formData.append("id", initialBudget.id);
    formData.append("period_type", periodType);
    formData.append("category", data.category);
    formData.append("amount", data.amount);

    startTransition(() => formAction(formData));
  });

  useEffect(() => {
    if (state?.status === "error") {
      toast.error("Could not save budget", {
        description: state.errors?._form?.[0],
      });
      startTransition(() => formAction(null));
    }
    if (state?.status === "success") {
      toast.success(isEdit ? "Budget updated" : "Budget created");
      onOpenChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const handleDelete = async () => {
    if (!initialBudget) return;
    const { error } = await deleteBudget(initialBudget.id);
    if (error) {
      toast.error("Could not delete budget", { description: error });
      return;
    }
    toast.success("Budget deleted");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit Budget" : "New Budget"}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 px-4 pb-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-900">
              Category
            </label>
            <select
              {...form.register("category")}
              disabled={isEdit}
              className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm disabled:bg-stone-50 disabled:text-stone-400"
            >
              <option value="">Overall (Total)</option>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {form.formState.errors.category && (
              <p className="text-xs text-red-600">
                {form.formState.errors.category.message}
              </p>
            )}
          </div>

          <FormInput
            form={form}
            name="amount"
            type="number"
            label="Amount"
            placeholder="0"
          />

          <div className="flex gap-2">
            {isEdit && (
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  }
                />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this budget?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
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
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-emerald-700 hover:bg-emerald-800"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
