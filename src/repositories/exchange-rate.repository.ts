import { ApiResponse } from "../types/api.js";

export interface IExchangeRateRepository {
  getRate(from: string, to: string): Promise<ApiResponse<number>>;
}