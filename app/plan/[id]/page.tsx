"use client";

import { use, useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type WorkoutDay = {
  day: string;
  focus: string;
  exercises: string[];
};

type Plan = {
  goal: string;
  daysPerWeek: number;
  equipment: string;
  workouts: WorkoutDay[];
};

export default function PlanPage(props: { params: Promise<{ id: string }> }) {
  // unwrap Next's params (in this Next version, params is a Promise)
  const { id } = use(props.params);

  const [plan, setPlan] = useState<Plan | null>(null);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  // Load plan, progress, notes from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const planRaw = window.localStorage.getItem(`plan-${id}`);
    if (planRaw && planRaw !== "undefined" && planRaw !== "null") {
      try {
        setPlan(JSON.parse(planRaw) as Plan);
      } catch (e) {
        console.error("Invalid plan JSON", e);
      }
    }

    const progRaw = window.localStorage.getItem(`progress-${id}`);
    if (progRaw && progRaw !== "undefined" && progRaw !== "null") {
      try {
        setProgress(JSON.parse(progRaw));
      } catch (e) {
        console.error("Invalid progress JSON", e);
      }
    }

    const notesRaw = window.localStorage.getItem(`notes-${id}`);
    if (notesRaw && notesRaw !== "undefined" && notesRaw !== "null") {
      try {
        setNotes(JSON.parse(notesRaw));
      } catch (e) {
        console.error("Invalid notes JSON", e);
      }
    }
  }, [id]);

  // Derived counts for progress bar
  const { totalExercises, completedExercises, percent } = useMemo(() => {
    if (!plan) return { totalExercises: 0, completedExercises: 0, percent: 0 };
    let total = 0;
    let done = 0;
    for (const w of plan.workouts) {
      total += w.exercises.length;
      w.exercises.forEach((_, i) => {
        if (progress[`${w.day}-${i}`]) done += 1;
      });
    }
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { totalExercises: total, completedExercises: done, percent: pct };
  }, [plan, progress]);

  function toggleExercise(day: string, idx: number, checked: boolean) {
    const key = `${day}-${idx}`;
    const next = { ...progress, [key]: checked };
    setProgress(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`progress-${id}`, JSON.stringify(next));
    }
  }

  function changeNote(day: string, value: string) {
    const next = { ...notes, [day]: value };
    setNotes(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`notes-${id}`, JSON.stringify(next));
    }
  }

  function resetAll() {
    setProgress({});
    setNotes({});
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(`progress-${id}`);
      window.localStorage.removeItem(`notes-${id}`);
    }
  }

  if (!plan) {
    return (
      <div className="max-w-3xl mx-auto py-10 space-y-4 text-center">
        <h1 className="text-2xl font-bold">Plan not found</h1>
        <p className="text-muted-foreground">
          This plan isn&apos;t saved on this device yet. Create a new one in
          routinelab.
        </p>
        <Button asChild>
          <a href="/start">Create a new plan</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      {/* Header + progress */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          Your routine — routinelab
        </h1>
        <p className="text-muted-foreground">
          Goal: <span className="font-medium">{plan.goal}</span> ·{" "}
          {plan.daysPerWeek} days/week · {plan.equipment}
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Progress: {completedExercises} / {totalExercises} exercises
            </span>
            <span className="text-xs text-muted-foreground">{percent}%</span>
          </div>
          <Progress value={percent} className="h-2" />
        </div>
      </div>

      {/* Workout cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {plan.workouts.map((w) => {
          const dayDone =
            w.exercises.length > 0 &&
            w.exercises.every((_, i) => progress[`${w.day}-${i}`]);

          return (
            <Card
              key={w.day}
              className={dayDone ? "border-green-400/70" : undefined}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between gap-2">
                  <span>{w.day}</span>
                  {dayDone && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Done
                    </span>
                  )}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{w.focus}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {w.exercises.map((ex, i) => {
                    const key = `${w.day}-${i}`;
                    const checked = !!progress[key];
                    return (
                      <label
                        key={key}
                        className="flex items-start gap-2 rounded-md bg-muted/40 px-2 py-1"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(val) =>
                            toggleExercise(w.day, i, Boolean(val))
                          }
                        />
                        <span
                          className={
                            checked ? "line-through text-muted-foreground" : ""
                          }
                        >
                          {ex}
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Notes / weights / energy
                  </p>
                  <Textarea
                    value={notes[w.day] ?? ""}
                    onChange={(e) => changeNote(w.day, e.target.value)}
                    placeholder="How did this session go?"
                    className="text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer actions */}
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <a href="/start">Generate another plan</a>
        </Button>
        <Button variant="ghost" onClick={resetAll}>
          Reset progress
        </Button>
      </div>
    </div>
  );
}
