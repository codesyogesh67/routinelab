import { NextRequest, NextResponse } from "next/server";
import { buildPlanFromAnswers, type Answers } from "@/lib/planBuilder";

function createId() {
  return Math.random().toString(36).slice(2, 8);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<Answers>;

  // minimal safety / defaults
  const answers: Answers = {
    goal: (body.goal as Answers["goal"]) ?? "muscle_gain",
    daysPerWeek: body.daysPerWeek ?? 4,
    equipment: (body.equipment as Answers["equipment"]) ?? "gym",
    timeOfDay: (body.timeOfDay as Answers["timeOfDay"]) ?? "flexible",
    experience: (body.experience as Answers["experience"]) ?? "beginner",
    wantNutrition: body.wantNutrition ?? false,
  };

  const id = createId();
  const plan = buildPlanFromAnswers(answers);

  return NextResponse.json({ id, plan });
}
