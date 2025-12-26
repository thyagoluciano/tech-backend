import { APIRequestContext, APIResponse } from "@playwright/test";

export class WeightApiPage {
  constructor(private request: APIRequestContext) {}

  async createWeight(value: number, date?: string): Promise<APIResponse> {
    return this.request.post("/api/weight", {
      data: {
        value,
        date,
      },
    });
  }

  async getWeeklyWeights(): Promise<APIResponse> {
    return this.request.get("/api/weight");
  }
}