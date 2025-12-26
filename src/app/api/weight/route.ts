import { auth } from "@/lib/auth";
import * as context from "next/headers";
import { NextResponse } from "next/server";
import { weightSchema } from "@/features/weight/schemas/weight-schema";
import { WeightService } from "@/features/weight/services/weight-service";
import { PrismaWeightRepository } from "@/features/weight/repositories/prisma-weight-repository";

const repository = new PrismaWeightRepository();
const service = new WeightService(repository);

export async function POST(req: Request) {
  const authRequest = auth.handleRequest(req, context);
  const session = await authRequest.validate();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = weightSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(parsed.error.format(), { status: 400 });
    }

    const weight = await service.registerWeight(
      session.user.userId,
      parsed.data.value,
      parsed.data.date
    );

    return NextResponse.json(weight, { status: 201 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  const authRequest = auth.handleRequest(req, context);
  const session = await authRequest.validate();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const weights = await service.getWeeklyWeights(session.user.userId);
    return NextResponse.json(weights);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}