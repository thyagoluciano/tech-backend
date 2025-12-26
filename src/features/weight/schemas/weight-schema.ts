import { z } from "zod";

export const createWeightSchema = z.object({
  userId: z.string().uuid(),
  value: z.number().positive(),
  measuredAt: z.coerce.date(),
});

export type CreateWeightInput = z.infer<typeof createWeightSchema>;