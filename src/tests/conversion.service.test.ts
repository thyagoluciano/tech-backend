import { describe, it, expect, vi } from 'vitest';
import { ConversionService } from '../services/conversion.service.js';
import { IExchangeRateRepository } from '../repositories/exchange-rate.repository.js';
import { IHistoryRepository } from '../repositories/history.repository.js';

describe('ConversionService', () => {
  const mockExchangeRepo: IExchangeRateRepository = {
    getRate: vi.fn()
  };
  const mockHistoryRepo: IHistoryRepository = {
    save: vi.fn().mockResolvedValue({ success: true }),
    getAll: vi.fn()
  };

  const service = new ConversionService(mockExchangeRepo, mockHistoryRepo);

  it('should return error for invalid amount', async () => {
    const result = await service.convert({ from: 'USD', to: 'BRL', amount: -10 });
    expect(result.success).toBe(false);
    expect(result.error).toContain('Amount must be a positive number');
  });

  it('should perform conversion correctly', async () => {
    vi.mocked(mockExchangeRepo.getRate).mockResolvedValue({ success: true, data: 5.0 });
    
    const result = await service.convert({ from: 'USD', to: 'BRL', amount: 100 });
    
    expect(result.success).toBe(true);
    expect(result.data?.result).toBe(500);
    expect(result.data?.rate).toBe(5.0);
  });
});