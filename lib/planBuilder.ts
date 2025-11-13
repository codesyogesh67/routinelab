// lib/planBuilder.ts

export type Goal = "muscle_gain" | "fat_loss" | "stay_active";
export type Equipment = "gym" | "home_dumbbells" | "bodyweight";
export type TimeOfDay = "morning" | "evening" | "flexible";
export type Experience = "beginner" | "intermediate" | "advanced";

export type Answers = {
  goal: Goal;
  daysPerWeek: number;
  equipment: Equipment;
  timeOfDay: TimeOfDay;
  experience: Experience;
  wantNutrition: boolean;
};

export type WorkoutDay = {
  day: string;
  focus: string;
  exercises: string[];
};

export type Plan = {
  goal: Goal;
  daysPerWeek: number;
  equipment: Equipment;
  workouts: WorkoutDay[];
};

// -------- Exercise templates --------

const gymTemplates = {
  push: [
    "Barbell bench press 4x8",
    "Incline DB press 3x10",
    "Overhead press 3x8",
    "Cable fly 3x12",
    "Triceps pushdown 3x12",
  ],
  pull: [
    "Deadlift 3x5",
    "Pull-ups or Lat pulldown 4x8",
    "Barbell row 3x8",
    "Face pull 3x12",
    "Barbell curl 3x10",
  ],
  legs: [
    "Back squat 4x8",
    "Romanian deadlift 3x10",
    "Leg press 3x12",
    "Lunges 3x10 each leg",
    "Standing calf raises 3x15",
  ],
  upper: [
    "Bench press 4x8",
    "Bent-over row 4x8",
    "Overhead press 3x8",
    "Lat pulldown 3x10",
    "DB curls 3x10",
  ],
  lower: [
    "Front squat 4x8",
    "Leg curl 3x12",
    "Leg extension 3x12",
    "Hip thrust 3x10",
    "Seated calf raise 3x15",
  ],
  fullBody: [
    "Goblet squat 3x12",
    "Push-ups 3x10",
    "DB row 3x12",
    "DB shoulder press 3x10",
    "Plank 3x30s",
  ],
  cardio: [
    "Treadmill incline walk 20–30 min",
    "Bike or rower 10–15 min",
    "Light stretching 5–10 min",
  ],
};

const homeDbTemplates = {
  fullBody: [
    "Goblet squat 3x12",
    "DB bench or floor press 3x10",
    "One-arm DB row 3x12 each side",
    "DB shoulder press 3x10",
    "DB Romanian deadlift 3x12",
  ],
  upper: [
    "DB floor press 3x12",
    "One-arm DB row 3x12",
    "DB shoulder press 3x10",
    "DB curls 3x12",
    "DB triceps extension 3x12",
  ],
  lower: [
    "Goblet squat 4x10",
    "DB lunge 3x10 each leg",
    "DB Romanian deadlift 3x12",
    "Glute bridge 3x15",
  ],
  cardio: [
    "Fast walking or light jog 20–30 min",
    "Jump rope 5–10 min",
    "Stretching 5–10 min",
  ],
};

const bodyweightTemplates = {
  fullBody: [
    "Bodyweight squat 3x15",
    "Push-ups 3x10",
    "Inverted row or table row 3x8",
    "Glute bridge 3x15",
    "Plank 3x30s",
  ],
  upper: [
    "Push-ups 4x8–12",
    "Pike push-ups 3x8",
    "Inverted row 3x8–10",
    "Diamond push-ups 2x10",
  ],
  lower: [
    "Squats 4x15",
    "Reverse lunges 3x10 each leg",
    "Single-leg Romanian deadlift 3x10 each leg",
    "Wall sit 3x30s",
  ],
  cardio: [
    "Jumping jacks 3x30s",
    "High knees 3x30s",
    "Fast walk or light jog 15–20 min",
  ],
};

// -------- helpers --------

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function pickEquipmentTemplates(equipment: Equipment) {
  if (equipment === "gym") return gymTemplates;
  if (equipment === "home_dumbbells") return homeDbTemplates;
  return bodyweightTemplates;
}

function clampDays(days: number) {
  if (days < 2) return 2;
  if (days > 5) return 5;
  return days;
}

// -------- main builder --------

export function buildPlanFromAnswers(answers: Answers): Plan {
  const daysPerWeek = clampDays(answers.daysPerWeek);
  const templates = pickEquipmentTemplates(answers.equipment);
  const workouts: WorkoutDay[] = [];

  if (answers.goal === "muscle_gain") {
    buildMuscleGainPlan(workouts, daysPerWeek, templates);
  } else if (answers.goal === "fat_loss") {
    buildFatLossPlan(workouts, daysPerWeek, templates);
  } else {
    buildStayActivePlan(workouts, daysPerWeek, templates);
  }

  return {
    goal: answers.goal,
    daysPerWeek,
    equipment: answers.equipment,
    workouts,
  };
}

// -------- goal-specific builders --------

function buildMuscleGainPlan(
  workouts: WorkoutDay[],
  daysPerWeek: number,
  templates: any
) {
  if (daysPerWeek === 3) {
    // Push / Pull / Legs
    const focuses = ["Push", "Pull", "Legs"];
    focuses.forEach((focus, i) => {
      const dayName = weekDays[i];
      workouts.push({
        day: dayName,
        focus: `${focus} — muscle gain`,
        exercises:
          focus === "Push"
            ? templates.push ?? templates.fullBody
            : focus === "Pull"
            ? templates.pull ?? templates.fullBody
            : templates.legs ?? templates.fullBody,
      });
    });
  } else if (daysPerWeek === 4) {
    // Upper / Lower / Upper / Lower
    const focuses = ["Upper", "Lower", "Upper", "Lower"];
    focuses.forEach((focus, i) => {
      const dayName = weekDays[i];
      workouts.push({
        day: dayName,
        focus: `${focus} body — strength`,
        exercises:
          focus === "Upper"
            ? templates.upper ?? templates.fullBody
            : templates.lower ?? templates.fullBody,
      });
    });
  } else {
    // 5 days: Push / Pull / Legs / Upper / Lower
    const focuses = ["Push", "Pull", "Legs", "Upper", "Lower"];
    focuses.slice(0, daysPerWeek).forEach((focus, i) => {
      const dayName = weekDays[i];
      let exercises: string[] = [];
      switch (focus) {
        case "Push":
          exercises = templates.push ?? templates.fullBody;
          break;
        case "Pull":
          exercises = templates.pull ?? templates.fullBody;
          break;
        case "Legs":
          exercises = templates.legs ?? templates.fullBody;
          break;
        case "Upper":
          exercises = templates.upper ?? templates.fullBody;
          break;
        case "Lower":
          exercises = templates.lower ?? templates.fullBody;
          break;
      }
      workouts.push({
        day: dayName,
        focus: `${focus} — hypertrophy`,
        exercises,
      });
    });
  }
}

function buildFatLossPlan(
  workouts: WorkoutDay[],
  daysPerWeek: number,
  templates: any
) {
  // Mix of full-body strength + cardio
  for (let i = 0; i < daysPerWeek; i++) {
    const dayName = weekDays[i];
    const isCardioDay = i % 2 === 1; // every 2nd day = more cardio
    if (isCardioDay && templates.cardio) {
      workouts.push({
        day: dayName,
        focus: "Cardio + light conditioning",
        exercises: templates.cardio,
      });
    } else {
      workouts.push({
        day: dayName,
        focus: "Full-body strength for fat loss",
        exercises: templates.fullBody,
      });
    }
  }
}

function buildStayActivePlan(
  workouts: WorkoutDay[],
  daysPerWeek: number,
  templates: any
) {
  // Gentle full-body + optional light cardio
  for (let i = 0; i < daysPerWeek; i++) {
    const dayName = weekDays[i];
    if (i === daysPerWeek - 1 && templates.cardio) {
      workouts.push({
        day: dayName,
        focus: "Light cardio + mobility",
        exercises: templates.cardio,
      });
    } else {
      workouts.push({
        day: dayName,
        focus: "Full-body routine — stay active",
        exercises: templates.fullBody,
      });
    }
  }
}
