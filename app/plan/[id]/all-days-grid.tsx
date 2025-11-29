"use client";

import Link from "next/link";
import type { Plan } from "@/lib/planBuilder";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Workout = Plan["workouts"][number];

type AllDaysGridProps = {
  id: string;
  plan: Plan;
  progress: Record<string, boolean>;
};

function getWorkoutKey(w: Workout, index: number) {
  return w.id ?? `w-${index}`;
}

export function AllDaysGrid({ id, plan, progress }: AllDaysGridProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        All days overview
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {plan.workouts.map((w, wIndex) => {
          const workoutKey = getWorkoutKey(w, wIndex);
          const total = w.exercises.length;
          const done = w.exercises.filter(
            (_, i) => progress[`${workoutKey}-${i}`]
          ).length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;

          return (
            <Card
              key={workoutKey}
              className="border bg-background/60 hover:shadow-sm transition-shadow"
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between gap-2 text-sm">
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                      {w.day[0]}
                    </span>
                    <Link
                      href={`/plan/${id}/${workoutKey}`}
                      className="hover:underline"
                    >
                      {w.day}
                    </Link>
                  </span>
                </CardTitle>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {w.focus}
                </p>
              </CardHeader>
              <CardContent className="space-y-1 pb-3">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Progress</span>
                  <span>
                    {done}/{total} · {pct}%
                  </span>
                </div>
                <Progress value={pct} className="h-1.5" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
