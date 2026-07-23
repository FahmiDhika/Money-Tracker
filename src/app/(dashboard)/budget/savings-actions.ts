"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  savingsGoalSchema,
  contributionSchema,
} from "@/validations/savings-validation";
import { SavingsFormState } from "@/types/savings";
import { INITIAL_STATE_SAVINGS_FORM } from "@/constants/savings-constant";

export async function createSavingsGoal(
  prevState: SavingsFormState,
  formData: FormData | null,
): Promise<SavingsFormState> {
  if (!formData) return INITIAL_STATE_SAVINGS_FORM;

  const validatedFields = savingsGoalSchema.safeParse({
    name: formData.get("name"),
    target_amount: formData.get("target_amount"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] },
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("savings_goals").insert({
    name: validatedFields.data.name,
    target_amount: Number(validatedFields.data.target_amount),
  });

  if (error) return { status: "error", errors: { _form: [error.message] } };

  revalidatePath("/budget");
  return { status: "success", errors: {} };
}

export async function updateSavingsGoal(
  prevState: SavingsFormState,
  formData: FormData | null,
): Promise<SavingsFormState> {
  if (!formData) return INITIAL_STATE_SAVINGS_FORM;

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { status: "error", errors: { _form: ["Invalid goal."] } };
  }

  const validatedFields = savingsGoalSchema.safeParse({
    name: formData.get("name"),
    target_amount: formData.get("target_amount"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] },
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("savings_goals")
    .update({
      name: validatedFields.data.name,
      target_amount: Number(validatedFields.data.target_amount),
    })
    .eq("id", id);

  if (error) return { status: "error", errors: { _form: [error.message] } };

  revalidatePath("/budget");
  return { status: "success", errors: {} };
}

export async function deleteSavingsGoal(
  id: string,
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("savings_goals").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/budget");
  return { error: null };
}

export async function addContribution(
  prevState: SavingsFormState,
  formData: FormData | null,
): Promise<SavingsFormState> {
  if (!formData) return INITIAL_STATE_SAVINGS_FORM;

  const goalId = formData.get("goal_id");
  if (typeof goalId !== "string" || !goalId) {
    return { status: "error", errors: { _form: ["Invalid goal."] } };
  }

  const validatedFields = contributionSchema.safeParse({
    amount: formData.get("amount"),
    note: formData.get("note") || undefined,
    contributed_at: formData.get("contributed_at"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] },
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("savings_contributions").insert({
    goal_id: goalId,
    amount: Number(validatedFields.data.amount),
    note: validatedFields.data.note || null,
    contributed_at: validatedFields.data.contributed_at,
  });

  if (error) return { status: "error", errors: { _form: [error.message] } };

  revalidatePath("/budget");
  return { status: "success", errors: {} };
}

export async function deleteContribution(
  id: string,
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("savings_contributions")
    .delete()
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/budget");
  return { error: null };
}