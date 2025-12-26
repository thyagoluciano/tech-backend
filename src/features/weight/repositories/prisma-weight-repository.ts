import { prisma } from "@/lib/prisma";
import { Weight } from "@prisma/client";
import { IWeightRepository } from "../interfaces/weight-repository.interface";

export class PrismaWeightRepository implements IWeightRepository {
  async create(userId: string, value: number, date: Date): Promise<Weight> {
    return prisma.weight.create({
      data: {
        userId,
        value,
        date,
      },
    });
  }

  async findByUserAndPeriod(userId: string, startDate: Date, endDate: Date): Promise<Weight[]> {
    return prisma.weight.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    });
  }
}