"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { transactionSchema } from "@/validations/transaction-validation";
import { TransactionFormState } from "@/types/transaction";
import { INITIAL_STATE_TRANSACTION_FORM } from "@/constants/transaction-constant";

export async function createTransaction(
  prevState: TransactionFormState,
  formData: FormData | null,
): Promise<TransactionFormState> {
  if (!formData) {
    return INITIAL_STATE_TRANSACTION_FORM;
  }

  const validatedFields = transactionSchema.safeParse({
    type: formData.get("type"),
    amount: formData.get("amount"),
    category: formData.get("category"),
    payment_method: formData.get("payment_method"),
    note: formData.get("note") || undefined,
    transaction_date: formData.get("transaction_date"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      errors: { _form: ["Your session has expired. Please log in again."] },
    };
  }

  const { error } = await supabase.from("transactions").insert({
    type: validatedFields.data.type,
    amount: Number(validatedFields.data.amount),
    category: validatedFields.data.category,
    payment_method: validatedFields.data.payment_method,
    note: validatedFields.data.note || null,
    transaction_date: validatedFields.data.transaction_date,
  });

  if (error) {
    return {
      status: "error",
      errors: { _form: [error.message] },
    };
  }

  revalidatePath("/transaction");
  revalidatePath("/home");

  return { status: "success", errors: {} };
}

export async function updateTransaction(
  prevState: TransactionFormState,
  formData: FormData | null,
): Promise<TransactionFormState> {
  if (!formData) {
    return INITIAL_STATE_TRANSACTION_FORM;
  }

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { status: "error", errors: { _form: ["Invalid transaction."] } };
  }

  const validatedFields = transactionSchema.safeParse({
    type: formData.get("type"),
    amount: formData.get("amount"),
    category: formData.get("category"),
    payment_method: formData.get("payment_method"),
    note: formData.get("note") || undefined,
    transaction_date: formData.get("transaction_date"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] },
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("transactions")
    .update({
      type: validatedFields.data.type,
      amount: Number(validatedFields.data.amount),
      category: validatedFields.data.category,
      payment_method: validatedFields.data.payment_method,
      note: validatedFields.data.note || null,
      transaction_date: validatedFields.data.transaction_date,
    })
    .eq("id", id);

  if (error) {
    return { status: "error", errors: { _form: [error.message] } };
  }

  revalidatePath("/history");
  revalidatePath("/home");

  return { status: "success", errors: {} };
}

export async function deleteTransaction(
  id: string,
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/history");
  revalidatePath("/home");

  return { error: null };
}
