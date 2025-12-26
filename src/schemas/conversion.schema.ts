import { z } from 'zod';

export const ConversionSchema = z.object({
  from: z.string().min(3).max(5).transform(v => v.toUpperCase()),
  to: z.string().min(3).max(5).transform(v => v.toUpperCase()),
  amount: z.number().positive("Amount must be a positive number")
});