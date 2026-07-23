import { z } from "zod";

export const budgetSchema = z.object({
  category: z.string().max(50),
  amount: z
    .string()
    .min(1, { message: "Amount is required." })
    .refine((val) => !Number.isNaN(Number(val)), {
      message: "Amount must be a valid number.",
    })
    .refine((val) => Number(val) > 0, {
      message: "Amount must be greater than 0.",
    }),
});

export type BudgetForm = z.infer<typeof budgetSchema>;
