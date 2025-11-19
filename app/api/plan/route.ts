import { NextRequest, NextResponse } from "next/server";
import { buildPlanFromAnswers, type Answers } from "@/lib/planBuilder";
import prisma from "@/lib/db";

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<Answers>;

  const answers: Answers = {
    goal: (body.goal as Answers["goal"]) ?? "muscle_gain",
    daysPerWeek: body.daysPerWeek ?? 4,
    equipment: (body.equipment as Answers["equipment"]) ?? "gym",
    timeOfDay: (body.timeOfDay as Answers["timeOfDay"]) ?? "flexible",
    experience: (body.experience as Answers["experience"]) ?? "beginner",
    wantNutrition: body.wantNutrition ?? false,
  };

  const plan = buildPlanFromAnswers(answers);

  // Save to DB
  const record = await prisma.plan.create({
    data: {
      data: plan,
      expiresAt: addDays(new Date(), 7),
    },
  });

  return NextResponse.json({
    id: record.id,
    plan,
    expiresAt: record.expiresAt,
  });
}
