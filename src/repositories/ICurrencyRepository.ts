import { ApiResponse } from '../types/api.js';

/**
 * Represents the structure of a currency quote from the external API
 */
export interface CurrencyQuote {
  code: string;
  codein: string;
  name: string;
  high: string;
  low: string;
  varBid: string;
  pctChange: string;
  bid: string;
  ask: string;
  timestamp: string;
  create_date: string;
}

/**
 * Interface for Currency Repository following the Repository Pattern
 */
export interface ICurrencyRepository {
  /**
   * Fetches the latest quote for a given currency pair (e.g., 'USD-BRL')
   * @param pair The currency pair string
   */
  getQuote(pair: string): Promise<ApiResponse<CurrencyQuote>>;
}