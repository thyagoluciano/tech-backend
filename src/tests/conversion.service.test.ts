import { describe, it, expect, vi } from "vitest";
import { ConversionService } from "../services/conversion.service.js";
import { IExchangeRateRepository } from "../repositories/exchange-rate.repository.js";
import { IHistoryRepository } from "../repositories/history.repository.js";

describe("ConversionService", () => {
  const mockExchangeRateRepo: IExchangeRateRepository = {
    getRate: vi.fn()
  };

  const mockHistoryRepo: IHistoryRepository = {
    save: vi.fn()
  };

  const service = new ConversionService(mockExchangeRateRepo, mockHistoryRepo);

  it("should return error if validation fails", async () => {
    const result = await service.convert({ from: "USD", to: "BRL", amount: -10 });
    expect(result.success).toBe(false);
    expect(result.error).toContain("Amount must be greater than zero");
  });

  it("should return error if exchange rate fetch fails", async () => {
    vi.mocked(mockExchangeRateRepo.getRate).mockResolvedValueOnce({
      success: false,
      error: "External API Down"
    });

    const result = await service.convert({ from: "USD", to: "BRL", amount: 100 });
    expect(result.success).toBe(false);
    expect(result.error).toBe("External API Down");
  });

  it("should calculate conversion and save to history on success", async () => {
    vi.mocked(mockExchangeRateRepo.getRate).mockResolvedValueOnce({
      success: true,
      data: 5.0
    });
    vi.mocked(mockHistoryRepo.save).mockResolvedValueOnce({
      success: true
    });

    const result = await service.convert({ from: "USD", to: "BRL", amount: 100 });

    expect(result.success).toBe(true);
    expect(result.data?.result).toBe(500);
    expect(result.data?.rate).toBe(5.0);
    expect(mockHistoryRepo.save).toHaveBeenCalled();
  });

  it("should return error if history saving fails", async () => {
    vi.mocked(mockExchangeRateRepo.getRate).mockResolvedValueOnce({
      success: true,
      data: 5.0
    });
    vi.mocked(mockHistoryRepo.save).mockResolvedValueOnce({
      success: false,
      error: "Database connection error"
    });

    const result = await service.convert({ from: "USD", to: "BRL", amount: 100 });
    expect(result.success).toBe(false);
    expect(result.error).toContain("failed to save in history");
  });
});