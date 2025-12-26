import { IExchangeRateRepository } from './exchange-rate.repository.js';
import { ApiResponse } from '../types/api.js';
import { CONFIG } from '../config/env.js';

export class AwesomeApiRepository implements IExchangeRateRepository {
  async getRate(from: string, to: string): Promise<ApiResponse<number>> {
    try {
      const pair = `${from}-${to}`;
      const response = await fetch(`${CONFIG.AWESOME_API_URL}/${pair}`);
      
      if (!response.ok) {
        return { success: false, error: `Failed to fetch rate for ${pair}` };
      }

      const data = await response.json();
      const key = `${from}${to}`;
      const rate = parseFloat(data[key]?.bid);

      if (isNaN(rate)) {
        return { success: false, error: 'Invalid rate data received' };
      }

      return { success: true, data: rate };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}