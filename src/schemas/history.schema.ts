import { z } from 'zod';

/**
 * Zod schema for validating HistoryEntry objects
 */
export const HistoryEntrySchema = z.object({
  id: z.string().uuid(),
  from: z.string().length(3).toUpperCase(),
  to: z.string().length(3).toUpperCase(),
  amount: z.number().positive(),
  result: z.number().positive(),
  timestamp: z.string().datetime()
});