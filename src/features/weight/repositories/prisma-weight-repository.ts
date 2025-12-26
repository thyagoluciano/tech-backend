import { PrismaClient, Weight } from "@prisma/client";
import { IWeightRepository } from "../interfaces/weight-repository.interface";
import { CreateWeightInput, createWeightSchema } from "../schemas/weight-schema";

export class PrismaWeightRepository implements IWeightRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateWeightInput): Promise<Weight> {
    const validatedData = createWeightSchema.parse(data);
    return this.prisma.weight.create({
      data: validatedData,
    });
  }

  async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Weight[]> {
    return this.prisma.weight.findMany({
      where: {
        userId,
        measuredAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        measuredAt: "asc",
      },
    });
  }
}