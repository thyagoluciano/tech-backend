import { z } from 'zod';

/**
 * Schema for a single currency pair response from AwesomeAPI
 */
export const AwesomeApiCurrencySchema = z.object({
  code: z.string(),
  codein: z.string(),
  name: z.string(),
  high: z.string(),
  low: z.string(),
  varBid: z.string(),
  pctChange: z.string(),
  bid: z.string(),
  ask: z.string(),
  timestamp: z.string(),
  create_date: z.string(),
});

/**
 * Schema for the full AwesomeAPI response (Record of currency pairs)
 */
export const AwesomeApiResponseSchema = z.record(z.string(), AwesomeApiCurrencySchema);

/**
 * Schema for CLI conversion inputs
 */
export const ConversionInputSchema = z.object({
  from: z.string().length(3, "Source currency must be 3 characters").toUpperCase(),
  to: z.string().length(3, "Target currency must be 3 characters").toUpperCase(),
  amount: z.coerce.number().positive("Amount must be a positive number"),
});