import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z
    .string()
    .min(1, { message: "Amount is required." })
    .refine((val) => !Number.isNaN(Number(val)), {
      message: "Amount must be a valid number.",
    })
    .refine((val) => Number(val) > 0, {
      message: "Amount must be greater than 0.",
    }),
  category: z
    .string()
    .min(1, { message: "Category is required." })
    .max(50, { message: "Category is too long." }),
  payment_method: z
    .string()
    .min(1, { message: "Payment method is required." })
    .max(30, { message: "Payment method is too long." }),
  note: z.string().max(255, { message: "Note is too long." }).optional(),
  transaction_date: z.string().min(1, { message: "Date is required." }),
  tags: z
    .array(z.string().min(1).max(30))
    .max(10, { message: "Maximum 10 tags." })
    .optional(),
});

export type TransactionForm = z.infer<typeof transactionSchema>;
