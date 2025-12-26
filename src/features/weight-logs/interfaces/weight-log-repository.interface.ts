import { WeightLog } from "@prisma/client";
import { CreateWeightLogInput } from "../schemas/weight-log-schema";

export interface IWeightLogRepository {
  create(data: CreateWeightLogInput): Promise<WeightLog>;
  findByUserId(userId: string): Promise<WeightLog[]>;
}