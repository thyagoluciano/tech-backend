import { PrismaClient } from '@prisma/client';
import { PrismaWeightRepository } from '../repositories/prisma-weight-repository';
import { CreateWeightInput } from '../interfaces/weight-repository.interface';

export class WeightRepositoryPOM {
  private repository: PrismaWeightRepository;

  constructor(private readonly prisma: PrismaClient) {
    this.repository = new PrismaWeightRepository(this.prisma);
  }

  async cleanup() {
    await this.prisma.weight.deleteMany();
  }

  async saveWeight(data: CreateWeightInput) {
    return await this.repository.save(data);
  }

  async findWeightsInRange(userId: string, start: Date, end: Date) {
    return await this.repository.findByDateRange(userId, start, end);
  }

  generateMockWeight(userId: string, date: Date, value: number): CreateWeightInput {
    return {
      userId,
      date,
      value,
    };
  }
}