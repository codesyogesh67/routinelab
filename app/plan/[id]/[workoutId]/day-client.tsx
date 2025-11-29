// app/plan/[id]/[workoutId]/day-client.tsx
"use client";

import { useEffect, useState } from "react";
import type { Plan } from "@/lib/planBuilder";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type DayClientProps = {
  id: string;
  plan: Plan;
  workout: Plan["workouts"][number];
};

export function DayClient({ id, plan, workout }: DayClientProps) {
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    const progRaw = window.localStorage.getItem(`progress-${id}`);
    if (progRaw && progRaw !== "undefined" && progRaw !== "null") {
      try {
        setProgress(JSON.parse(progRaw));
      } catch {}
    }

    const notesRaw = window.localStorage.getItem(`notes-${id}`);
    if (notesRaw && notesRaw !== "undefined" && notesRaw !== "null") {
      try {
        setNotes(JSON.parse(notesRaw));
      } catch {}
    }
  }, [id]);

  function toggleExercise(idx: number, checked: boolean) {
    const key = `${workout.id}-${idx}`;
    const next = { ...progress, [key]: checked };
    setProgress(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`progress-${id}`, JSON.stringify(next));
    }
  }

  function changeNote(value: string) {
    const next = { ...notes, [workout.id]: value };
    setNotes(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`notes-${id}`, JSON.stringify(next));
    }
  }

  const completedCount = workout.exercises.filter(
    (_, i) => progress[`${workout.id}-${i}`]
  ).length;

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6 px-4 md:px-0">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-[0.18em]">
            routinelab / {plan.goal}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">
            {workout.label}
          </h1>
          <p className="text-sm text-muted-foreground">
            {workout.focus} · {completedCount}/{workout.exercises.length} blocks
            done
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/plan/${id}`}>Back to overview</Link>
        </Button>
      </div>

      <Card className="border bg-background/70 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Today&apos;s blocks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pb-4">
          {workout.exercises.map((ex, i) => {
            const key = `${workout.id}-${i}`;
            const checked = !!progress[key];

            return (
              <label
                key={key}
                className={[
                  "flex items-start gap-2 rounded-xl border px-3 py-2 text-sm cursor-pointer transition-all",
                  checked
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-muted/40 border-muted/60 hover:bg-muted/70",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(val) => toggleExercise(i, Boolean(val))}
                />
                <div className="flex flex-col">
                  <span
                    className={
                      checked
                        ? "line-through decoration-emerald-500/70 decoration-2"
                        : ""
                    }
                  >
                    {ex}
                  </span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">
                    Take 60–90s rest · keep form clean.
                  </span>
                </div>
              </label>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border bg-background/70 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Session log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Textarea
            value={notes[workout.id] ?? ""}
            onChange={(e) => changeNote(e.target.value)}
            placeholder="Weights, energy, sleep, pain, small wins…"
            className="min-h-[120px] text-sm resize-none"
          />
          <p className="text-[11px] text-muted-foreground">
            Your notes stay on this device. Review them weekly to spot patterns.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
