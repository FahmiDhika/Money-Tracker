"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { budgetSchema } from "@/validations/budget-validation";
import { BudgetFormState } from "@/types/budget";
import { INITIAL_STATE_BUDGET_FORM } from "@/constants/budget-constant";

export async function createBudget(
  prevState: BudgetFormState,
  formData: FormData | null,
): Promise<BudgetFormState> {
  if (!formData) return INITIAL_STATE_BUDGET_FORM;

  const periodType = formData.get("period_type");
  const categoryRaw = formData.get("category");
  const category =
    typeof categoryRaw === "string" && categoryRaw.length > 0
      ? categoryRaw
      : null;

  const validatedFields = budgetSchema.safeParse({
    category: categoryRaw ?? "",
    amount: formData.get("amount"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] },
    };
  }

  if (periodType !== "week" && periodType !== "month") {
    return { status: "error", errors: { _form: ["Invalid period type."] } };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("budgets").insert({
    period_type: periodType,
    category,
    amount: Number(validatedFields.data.amount),
  });

  if (error) {
    const message =
      error.code === "23505"
        ? "A budget for this category & period already exists."
        : error.message;
    return { status: "error", errors: { _form: [message] } };
  }

  revalidatePath("/budget");
  revalidatePath("/home");

  return { status: "success", errors: {} };
}

export async function updateBudget(
  prevState: BudgetFormState,
  formData: FormData | null,
): Promise<BudgetFormState> {
  if (!formData) return INITIAL_STATE_BUDGET_FORM;

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { status: "error", errors: { _form: ["Invalid budget."] } };
  }

  const validatedFields = budgetSchema.safeParse({
    category: formData.get("category") ?? "",
    amount: formData.get("amount"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] },
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("budgets")
    .update({ amount: Number(validatedFields.data.amount) })
    .eq("id", id);

  if (error) {
    return { status: "error", errors: { _form: [error.message] } };
  }

  revalidatePath("/budget");
  revalidatePath("/home");

  return { status: "success", errors: {} };
}

export async function deleteBudget(
  id: string,
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("budgets").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/budget");
  revalidatePath("/home");

  return { error: null };
}
