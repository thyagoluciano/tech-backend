import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConversionService } from '../services/conversion.service.js';
import { IExchangeRateRepository } from '../repositories/exchange-rate.repository.js';
import { IHistoryRepository } from '../repositories/history.repository.js';

describe('ConversionService Unit Tests', () => {
  let service: ConversionService;
  let mockExchangeRateRepo: IExchangeRateRepository;
  let mockHistoryRepo: IHistoryRepository;

  beforeEach(() => {
    mockExchangeRateRepo = {
      getRate: vi.fn()
    };
    mockHistoryRepo = {
      save: vi.fn()
    };
    service = new ConversionService(mockExchangeRateRepo, mockHistoryRepo);
  });

  describe('Validation Scenarios', () => {
    it('should return error for invalid currency codes (length != 3)', async () => {
      const result = await service.convert({ from: 'US', to: 'BRL', amount: 100 });
      expect(result.success).toBe(false);
      expect(result.error).toContain('Currency code must be 3 characters');
    });

    it('should return error for non-positive amounts', async () => {
      const result = await service.convert({ from: 'USD', to: 'BRL', amount: 0 });
      expect(result.success).toBe(false);
      expect(result.error).toContain('Amount must be greater than zero');
    });

    it('should normalize lowercase currency codes to uppercase', async () => {
      vi.mocked(mockExchangeRateRepo.getRate).mockResolvedValue({ success: true, data: 5.0 });
      vi.mocked(mockHistoryRepo.save).mockResolvedValue({ success: true });

      const result = await service.convert({ from: 'usd', to: 'brl', amount: 10 });
      
      expect(result.success).toBe(true);
      expect(mockExchangeRateRepo.getRate).toHaveBeenCalledWith('USD', 'BRL');
    });
  });

  describe('Exchange Rate Repository Integration', () => {
    it('should return error when exchange rate repository fails', async () => {
      vi.mocked(mockExchangeRateRepo.getRate).mockResolvedValue({
        success: false,
        error: 'Provider Timeout'
      });

      const result = await service.convert({ from: 'USD', to: 'BRL', amount: 100 });
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Provider Timeout');
      expect(mockHistoryRepo.save).not.toHaveBeenCalled();
    });

    it('should return error when exchange rate data is missing', async () => {
      vi.mocked(mockExchangeRateRepo.getRate).mockResolvedValue({
        success: true,
        data: undefined
      });

      const result = await service.convert({ from: 'USD', to: 'BRL', amount: 100 });
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to fetch exchange rate');
    });
  });

  describe('History Repository Integration', () => {
    it('should return error when history saving fails', async () => {
      vi.mocked(mockExchangeRateRepo.getRate).mockResolvedValue({ success: true, data: 5.5 });
      vi.mocked(mockHistoryRepo.save).mockResolvedValue({
        success: false,
        error: 'Database Offline'
      });

      const result = await service.convert({ from: 'USD', to: 'BRL', amount: 100 });

      expect(result.success).toBe(false);
      expect(result.error).toContain('failed to save in history: Database Offline');
    });
  });

  describe('Success Flow', () => {
    it('should calculate conversion correctly and return data', async () => {
      const rate = 5.25;
      const amount = 100;
      vi.mocked(mockExchangeRateRepo.getRate).mockResolvedValue({ success: true, data: rate });
      vi.mocked(mockHistoryRepo.save).mockResolvedValue({ success: true });

      const result = await service.convert({ from: 'USD', to: 'BRL', amount });

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        from: 'USD',
        to: 'BRL',
        amount: 100,
        rate: 5.25,
        result: 525
      });
      expect(result.data?.timestamp).toBeInstanceOf(Date);
    });
  });
});