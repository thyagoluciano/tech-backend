import { Weight } from "@prisma/client";
import { CreateWeightInput } from "../schemas/weight-schema";

export interface IWeightRepository {
  create(data: CreateWeightInput): Promise<Weight>;
  findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Weight[]>;
}