import { PrismaClient, WeightLog } from "@prisma/client";
import { IWeightLogRepository } from "../interfaces/weight-log-repository.interface";
import { CreateWeightLogInput } from "../schemas/weight-log-schema";

export class PrismaWeightLogRepository implements IWeightLogRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateWeightLogInput): Promise<WeightLog> {
    return this.prisma.weightLog.create({
      data,
    });
  }

  async findByUserId(userId: string): Promise<WeightLog[]> {
    return this.prisma.weightLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }
}