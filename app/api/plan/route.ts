import { NextRequest, NextResponse } from "next/server";

function createId() {
  return Math.random().toString(36).slice(2, 8);
}

function buildPlanFromAnswers(body: any) {
  const { goal, daysPerWeek, equipment } = body;

  const baseDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const workouts: any[] = [];

  for (let i = 0; i < daysPerWeek; i++) {
    const dayName = baseDays[i];
    workouts.push({
      day: dayName,
      focus:
        goal === "muscle_gain"
          ? i % 2 === 0
            ? "Upper body"
            : "Lower body"
          : goal === "fat_loss"
          ? "Full body + cardio"
          : "General fitness",
      exercises:
        equipment === "gym"
          ? ["Barbell squat 4x8", "Bench press 4x8", "Cable row 3x12"]
          : equipment === "home_dumbbells"
          ? ["Goblet squat 3x12", "DB bench 3x10", "DB row 3x12"]
          : ["Bodyweight squat 3x15", "Push-ups 3x12", "Plank 3x30s"],
    });
  }

  return {
    goal,
    daysPerWeek,
    equipment,
    workouts,
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = createId();
  const plan = buildPlanFromAnswers(body);

  // 👇 return plan too
  return NextResponse.json({ id, plan });
}
