import { describe, it, expect } from 'vitest';
import { ConversionInputSchema, AwesomeApiResponseSchema } from '../schemas/currency.schema.js';

describe('Validation Schemas', () => {
  describe('ConversionInputSchema', () => {
    it('should validate correct input and transform strings', () => {
      const input = { from: 'usd', to: 'brl', amount: '100.50' };
      const result = ConversionInputSchema.safeParse(input);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.from).toBe('USD');
        expect(result.data.to).toBe('BRL');
        expect(result.data.amount).toBe(100.50);
      }
    });

    it('should fail on invalid currency code length', () => {
      const inputShort = { from: 'US', to: 'BRL', amount: 100 };
      const inputLong = { from: 'USDT', to: 'BRL', amount: 100 };
      expect(ConversionInputSchema.safeParse(inputShort).success).toBe(false);
      expect(ConversionInputSchema.safeParse(inputLong).success).toBe(false);
    });

    it('should fail on non-positive amount', () => {
      const inputNegative = { from: 'USD', to: 'BRL', amount: -10 };
      const inputZero = { from: 'USD', to: 'BRL', amount: 0 };
      expect(ConversionInputSchema.safeParse(inputNegative).success).toBe(false);
      expect(ConversionInputSchema.safeParse(inputZero).success).toBe(false);
    });

    it('should fail if amount is not a valid number string', () => {
      const input = { from: 'USD', to: 'BRL', amount: 'abc' };
      expect(ConversionInputSchema.safeParse(input).success).toBe(false);
    });
  });

  describe('AwesomeApiResponseSchema', () => {
    const validItem = {
      code: 'USD',
      codein: 'BRL',
      name: 'Dólar Americano/Real Brasileiro',
      high: '5.40',
      low: '5.30',
      varBid: '0.01',
      pctChange: '0.2',
      bid: '5.35',
      ask: '5.36',
      timestamp: '1625000000',
      create_date: '2021-06-29 21:00:00'
    };

    it('should validate valid API response structure with multiple pairs', () => {
      const apiData = {
        USDBRL: validItem,
        EURBRL: { ...validItem, code: 'EUR', name: 'Euro/Real Brasileiro' }
      };
      const result = AwesomeApiResponseSchema.safeParse(apiData);
      expect(result.success).toBe(true);
    });

    it('should fail if required fields are missing in the nested object', () => {
      const apiData = {
        USDBRL: {
          code: 'USD'
        }
      };
      const result = AwesomeApiResponseSchema.safeParse(apiData);
      expect(result.success).toBe(false);
    });

    it('should fail if the response is not an object', () => {
      expect(AwesomeApiResponseSchema.safeParse('invalid').success).toBe(false);
      expect(AwesomeApiResponseSchema.safeParse([]).success).toBe(false);
    });
  });
});