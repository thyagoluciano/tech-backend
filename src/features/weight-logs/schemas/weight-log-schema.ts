import { z } from "zod";

export const createWeightLogSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  weight: z.number({ invalid_type_error: "Weight must be a number" }).positive("Weight must be a positive value"),
});

export type CreateWeightLogInput = z.infer<typeof createWeightLogSchema>;