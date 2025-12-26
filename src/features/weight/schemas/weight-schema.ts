import { z } from "zod";

export const weightSchema = z.object({
  value: z.number().positive("Weight must be a positive number"),
  date: z.string().datetime().optional(),
});

export type WeightInput = z.infer<typeof weightSchema>;