import { z } from "zod";

export const ConversionSchema = z.object({
  from: z.string().length(3, "Currency code must be 3 characters (ISO 4217)").toUpperCase(),
  to: z.string().length(3, "Currency code must be 3 characters (ISO 4217)").toUpperCase(),
  amount: z.number().positive("Amount must be greater than zero")
});