import { Weight } from '@prisma/client';

export interface CreateWeightDTO {
  userId: string;
  value: number;
  measuredAt: Date;
}

export interface IWeightRepository {
  create(data: CreateWeightDTO): Promise<Weight>;
  findByPeriod(userId: string, startDate: Date, endDate: Date): Promise<Weight[]>;
}