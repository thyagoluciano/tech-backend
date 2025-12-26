import { Weight } from "@prisma/client";

export interface IWeightRepository {
  create(userId: string, value: number, date: Date): Promise<Weight>;
  findByUserAndPeriod(userId: string, startDate: Date, endDate: Date): Promise<Weight[]>;
}