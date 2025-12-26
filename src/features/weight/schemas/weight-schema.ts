import { z } from 'zod';

export const createWeightSchema = z.object({
  value: z.number().positive('Weight must be a positive number').max(1000, 'Weight value is too high'),
  measuredAt: z.coerce.date().default(() => new Date()),
});

export type CreateWeightInput = z.infer<typeof createWeightSchema>;