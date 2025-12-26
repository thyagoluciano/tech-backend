import { PrismaClient } from '@prisma/client';
import { IWeightRepository, CreateWeightInput, WeightRecord } from '../interfaces/weight-repository.interface';

export class PrismaWeightRepository implements IWeightRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(data: CreateWeightInput): Promise<WeightRecord> {
    return this.prisma.weight.create({
      data: {
        userId: data.userId,
        value: data.value,
        date: data.date,
      },
    });
  }

  async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<WeightRecord[]> {
    return this.prisma.weight.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }
}