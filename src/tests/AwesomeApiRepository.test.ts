import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { AwesomeApiRepository } from '../repositories/AwesomeApiRepository.js';

vi.mock('axios');

describe('AwesomeApiRepository', () => {
  let repository: AwesomeApiRepository;

  beforeEach(() => {
    repository = new AwesomeApiRepository();
    vi.clearAllMocks();
  });

  it('should return successful ApiResponse when API call succeeds', async () => {
    const mockQuote = {
      code: 'USD',
      codein: 'BRL',
      name: 'Dólar Americano/Real Brasileiro',
      high: '5.10',
      low: '5.00',
      varBid: '0.01',
      pctChange: '0.2',
      bid: '5.05',
      ask: '5.06',
      timestamp: '1621234567',
      create_date: '2021-05-17 12:00:00'
    };

    (axios.get as any).mockResolvedValue({
      data: { USDBRL: mockQuote }
    });

    const result = await repository.getQuote('USD-BRL');

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockQuote);
    expect(result.error).toBeUndefined();
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('USD-BRL'));
  });

  it('should return error ApiResponse when API returns 404 or invalid pair', async () => {
    (axios.get as any).mockRejectedValue({
      response: {
        data: { message: 'Coin not found' }
      }
    });

    const result = await repository.getQuote('INVALID-PAIR');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Coin not found');
    expect(result.data).toBeUndefined();
  });

  it('should return error ApiResponse when network or SSL error occurs', async () => {
    (axios.get as any).mockRejectedValue(new Error('Network Error or SSL Failure'));

    const result = await repository.getQuote('USD-BRL');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Network Error or SSL Failure');
  });

  it('should return error if the expected key is missing in the response body', async () => {
    (axios.get as any).mockResolvedValue({
      data: { SOMEOTHERKEY: {} }
    });

    const result = await repository.getQuote('USD-BRL');

    expect(result.success).toBe(false);
    expect(result.error).toContain('not found in API response');
  });

  it('should correctly transform the pair string to match API key format', async () => {
    (axios.get as any).mockResolvedValue({
      data: { EURBRL: { bid: '5.50' } }
    });

    const result = await repository.getQuote('EUR-BRL');

    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('bid', '5.50');
  });
});