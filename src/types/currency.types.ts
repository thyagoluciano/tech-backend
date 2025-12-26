import { z } from 'zod';
import { 
  AwesomeApiCurrencySchema, 
  AwesomeApiResponseSchema, 
  ConversionInputSchema 
} from '../schemas/currency.schema.js';

export type AwesomeApiCurrency = z.infer<typeof AwesomeApiCurrencySchema>;
export type AwesomeApiResponse = z.infer<typeof AwesomeApiResponseSchema>;
export type ConversionInput = z.infer<typeof ConversionInputSchema>;