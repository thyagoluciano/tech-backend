import axios from 'axios';
import { ApiResponse } from '../types/api.js';
import { ICurrencyRepository, CurrencyQuote } from './ICurrencyRepository.js';

/**
 * Implementation of ICurrencyRepository using AwesomeAPI
 */
export class AwesomeApiRepository implements ICurrencyRepository {
  private readonly baseUrl = 'https://economia.awesomeapi.com.br/json/last';

  /**
   * Fetches real-time quotes. 
   * Security Note: SSL verification is enabled by default (standard Axios behavior).
   */
  async getQuote(pair: string): Promise<ApiResponse<CurrencyQuote>> {
    try {
      // The API expects pairs like USD-BRL
      const response = await axios.get(`${this.baseUrl}/${pair}`);
      
      // The API returns an object where the key is the pair without the hyphen (e.g., USDBRL)
      const key = pair.replace('-', '');
      const data = response.data[key];

      if (!data) {
        return {
          success: false,
          error: `Quote data for key "${key}" not found in API response.`
        };
      }

      return {
        success: true,
        data: data as CurrencyQuote
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error fetching currency quote';
      return {
        success: false,
        error: errorMessage
      };
    }
  }
}