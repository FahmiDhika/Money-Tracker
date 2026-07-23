import { z } from "zod";

export const savingsGoalSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }).max(50),
  target_amount: z
    .string()
    .min(1, { message: "Target amount is required." })
    .refine((val) => !Number.isNaN(Number(val)), {
      message: "Must be a valid number.",
    })
    .refine((val) => Number(val) > 0, { message: "Must be greater than 0." }),
});
export type SavingsGoalForm = z.infer<typeof savingsGoalSchema>;

export const contributionSchema = z.object({
  amount: z
    .string()
    .min(1, { message: "Amount is required." })
    .refine((val) => !Number.isNaN(Number(val)), {
      message: "Must be a valid number.",
    })
    .refine((val) => Number(val) > 0, { message: "Must be greater than 0." }),
  note: z.string().max(100).optional(),
  contributed_at: z.string().min(1, { message: "Date is required." }),
});
export type ContributionForm = z.infer<typeof contributionSchema>;
