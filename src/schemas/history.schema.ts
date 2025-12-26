import { z } from 'zod';

export const HistoryEntrySchema = z.object({
  from: z.string().length(3),
  to: z.string().length(3),
  amount: z.number().positive(),
  convertedAmount: z.number().nonnegative(),
  rate: z.number().positive(),
  timestamp: z.string().datetime(),
});