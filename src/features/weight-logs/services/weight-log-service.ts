import { IWeightLogRepository } from "../interfaces/weight-log-repository.interface";
import { createWeightLogSchema, CreateWeightLogInput } from "../schemas/weight-log-schema";

export class WeightLogService {
  constructor(private repository: IWeightLogRepository) {}

  async logWeight(data: CreateWeightLogInput) {
    const validatedData = createWeightLogSchema.parse(data);
    return this.repository.create(validatedData);
  }

  async getUserHistory(userId: string) {
    return this.repository.findByUserId(userId);
  }
}