import { ApiResponse } from "../types/api.js";
import { ConversionResult } from "../types/conversion.js";
import { ConversionSchema } from "../schemas/conversion.schema.js";
import { IExchangeRateRepository } from "../repositories/exchange-rate.repository.js";
import { IHistoryRepository } from "../repositories/history.repository.js";

export class ConversionService {
  constructor(
    private exchangeRateRepo: IExchangeRateRepository,
    private historyRepo: IHistoryRepository
  ) {}

  /**
   * Coordinates the conversion process: validation, fetching rate, calculation, and history logging.
   * Follows the rule of not throwing exceptions for business logic errors.
   */
  async convert(input: unknown): Promise<ApiResponse<ConversionResult>> {
    const validation = ConversionSchema.safeParse(input);

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors.map(e => e.message).join(", ")
      };
    }

    const { from, to, amount } = validation.data;

    const rateResponse = await this.exchangeRateRepo.getRate(from, to);
    if (!rateResponse.success || rateResponse.data === undefined) {
      return {
        success: false,
        error: rateResponse.error || "Failed to fetch exchange rate"
      };
    }

    const rate = rateResponse.data;
    const result = amount * rate;
    const conversionData: ConversionResult = {
      from,
      to,
      amount,
      rate,
      result,
      timestamp: new Date()
    };

    const saveResponse = await this.historyRepo.save(conversionData);
    if (!saveResponse.success) {
      // We log the error but might still return the conversion result depending on business requirements.
      // Here we treat history failure as a service error for consistency.
      return {
        success: false,
        error: "Conversion calculated but failed to save in history: " + saveResponse.error
      };
    }

    return {
      success: true,
      data: conversionData
    };
  }
}