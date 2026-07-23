"use client";

import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common/form-input";
import {
  contributionSchema,
  ContributionForm,
} from "@/validations/savings-validation";
import { INITIAL_STATE_SAVINGS_FORM } from "@/constants/savings-constant";
import { addContribution } from "../savings-actions";

type ContributionSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalId: string;
  goalName: string;
};

export function ContributionSheet({
  open,
  onOpenChange,
  goalId,
  goalName,
}: ContributionSheetProps) {
  const form = useForm<ContributionForm>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      amount: "",
      note: "",
      contributed_at: new Date().toISOString().split("T")[0],
    },
  });

  const [state, formAction, isPending] = useActionState(
    addContribution,
    INITIAL_STATE_SAVINGS_FORM,
  );

  const handleSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("goal_id", goalId);
    formData.append("amount", data.amount);
    formData.append("note", data.note ?? "");
    formData.append("contributed_at", data.contributed_at);
    startTransition(() => formAction(formData));
  });

  useEffect(() => {
    if (state?.status === "error") {
      toast.error("Could not add contribution", {
        description: state.errors?._form?.[0],
      });
      startTransition(() => formAction(null));
    }
    if (state?.status === "success") {
      toast.success("Contribution added");
      form.reset({
        amount: "",
        note: "",
        contributed_at: new Date().toISOString().split("T")[0],
      });
      onOpenChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Contribution — {goalName}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 px-4 pb-4">
          <FormInput
            form={form}
            name="amount"
            type="number"
            label="Amount"
            placeholder="0"
          />
          <FormInput
            form={form}
            name="contributed_at"
            type="date"
            label="Date"
          />
          <FormInput
            form={form}
            name="note"
            label="Note (optional)"
            placeholder="e.g. Bonus bulan ini"
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-emerald-700 hover:bg-emerald-800"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
