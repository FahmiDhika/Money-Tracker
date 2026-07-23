"use client";

import { useState, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Trash2, X } from "lucide-react";
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
import {
  savingsGoalSchema,
  SavingsGoalForm,
} from "@/validations/savings-validation";
import { INITIAL_STATE_SAVINGS_FORM } from "@/constants/savings-constant";
import { createSavingsGoal, updateSavingsGoal, deleteSavingsGoal, deleteContribution } from "../savings-actions";
import type { Contribution } from "./savings-goal-item";
import { formatCurrency } from "@/lib/utils";

type GoalFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialGoal?: { id: string; name: string; target_amount: number };
  contributions?: Contribution[];
};

export function GoalFormSheet({
  open,
  onOpenChange,
  initialGoal,
  contributions = [],
}: GoalFormSheetProps) {
  const isEdit = Boolean(initialGoal);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<SavingsGoalForm>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      name: initialGoal?.name ?? "",
      target_amount: initialGoal ? String(initialGoal.target_amount) : "",
    },
  });

  const action = isEdit ? updateSavingsGoal : createSavingsGoal;
  const [state, formAction, isPending] = useActionState(
    action,
    INITIAL_STATE_SAVINGS_FORM,
  );

  const handleSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    if (initialGoal) formData.append("id", initialGoal.id);
    formData.append("name", data.name);
    formData.append("target_amount", data.target_amount);
    startTransition(() => formAction(formData));
  });

  useEffect(() => {
    if (state?.status === "error") {
      toast.error("Could not save goal", {
        description: state.errors?._form?.[0],
      });
      startTransition(() => formAction(null));
    }
    if (state?.status === "success") {
      toast.success(isEdit ? "Goal updated" : "Goal created");
      onOpenChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const handleDelete = async () => {
    if (!initialGoal) return;
    const { error } = await deleteSavingsGoal(initialGoal.id);
    if (error) {
      toast.error("Could not delete goal", { description: error });
      return;
    }
    toast.success("Goal deleted");
    onOpenChange(false);
  };

  const handleDeleteContribution = async (id: string) => {
    setDeletingId(id);
    const { error } = await deleteContribution(id);
    setDeletingId(null);

    if (error) {
      toast.error("Could not delete contribution", { description: error });
      return;
    }
    toast.success("Contribution deleted");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit Goal" : "New Savings Goal"}</SheetTitle>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              form={form}
              name="name"
              label="Goal name"
              placeholder="e.g. Beli Laptop"
            />
            <FormInput
              form={form}
              name="target_amount"
              type="number"
              label="Target amount"
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
                      <AlertDialogTitle>Delete this goal?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will also delete all contributions recorded for
                        this goal. This action cannot be undone.
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

          {isEdit && (
            <div className="space-y-2 border-t border-stone-200 pt-4">
              <p className="text-sm font-semibold text-stone-900">
                Contribution History
              </p>

              {contributions.length === 0 ? (
                <p className="py-4 text-center text-sm text-stone-400">
                  No contributions yet.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {contributions.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between rounded-lg border border-stone-200 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-stone-900">
                          {formatCurrency(c.amount)}
                        </p>
                        <p className="text-xs text-stone-500">
                          {new Date(
                            `${c.contributed_at}T00:00:00`,
                          ).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                          {c.note ? ` · ${c.note}` : ""}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteContribution(c.id)}
                        disabled={deletingId === c.id}
                        className="text-stone-400 hover:text-red-600 disabled:opacity-50"
                      >
                        {deletingId === c.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
