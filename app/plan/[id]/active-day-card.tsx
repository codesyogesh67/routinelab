"use client";

import Link from "next/link";
import type { Plan } from "@/lib/planBuilder";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

type Workout = Plan["workouts"][number];

type ActiveDayCardProps = {
  id: string;
  plan: Plan;
  workout: Workout;
  workoutIndex: number;
  progress: Record<string, boolean>;
  notes: Record<string, string>;
  toggleExercise: (workoutKey: string, idx: number, checked: boolean) => void;
  changeNote: (workoutKey: string, value: string) => void;
  // new: show navigation + handlers
  showNav?: boolean;
  goNext?: () => void;
  goPrev?: () => void;
};

function getWorkoutKey(w: Workout, index: number) {
  return w.id ?? `w-${index}`;
}

export function ActiveDayCard({
  id,
  plan,
  workout,
  workoutIndex,
  progress,
  notes,
  toggleExercise,
  changeNote,
  showNav = false,
  goNext,
  goPrev,
}: ActiveDayCardProps) {
  const workoutKey = getWorkoutKey(workout, workoutIndex);

  const completedCount = workout.exercises.filter(
    (_, i) => progress[`${workoutKey}-${i}`]
  ).length;
  const totalCount = workout.exercises.length;
  const pct =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const cardStateClass =
    pct === 0
      ? "border-slate-800 shadow-lg"
      : pct === 100
      ? "border-emerald-400/80 shadow-[0_0_40px_rgba(16,185,129,0.35)]"
      : "border-sky-400/70 shadow-[0_0_30px_rgba(56,189,248,0.25)]";

  return (
    <Card
      className={[
        "relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 transition-all duration-300",
        cardStateClass,
      ].join(" ")}
    >
      {/* subtle background orbs */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-32 -left-24 h-56 w-56 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute top-10 right-1/3 h-40 w-40 rounded-full bg-violet-500/12 blur-3xl" />
      </div>

      <div className="relative flex flex-col gap-5 p-4 md:p-6">
        {/* HEADER */}
        {/* HEADER TEXT IMPROVED */}
        <CardHeader className="border-b border-slate-800/60 pb-4 px-0 pt-0">
          {/* Navigation */}
          {showNav && (
            <div className="flex justify-center items-center gap-4">
              <button
                type="button"
                onClick={goPrev}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-base text-white transition hover:border-sky-300 hover:bg-sky-400 hover:text-slate-950"
              >
                ←
              </button>
              <span className="rounded-full bg-slate-900/80 px-2 py-1 text-sm font-medium text-slate-200 border border-slate-700/80">
                Day {workoutIndex + 1} of {plan.workouts.length}
              </span>
              <button
                type="button"
                onClick={goNext}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-base text-white transition hover:border-sky-300 hover:bg-sky-400 hover:text-slate-950"
              >
                →
              </button>
            </div>
          )}

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            {/* Day label + focus */}
            <div className="flex items-start gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400 via-sky-400 to-violet-400 opacity-70 blur-sm" />
                <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-950/80 text-sm font-semibold">
                  {workout.day[0]}
                </div>
              </div>

              <div className="space-y-1.5">
                <Link
                  href={`/plan/${id}/${workoutKey}`}
                  className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight hover:underline"
                >
                  {workout.day}
                </Link>
                <p className="text-sm text-slate-300/80">{workout.focus}</p>
              </div>
            </div>

            {/* Right section */}
            <div className="flex flex-col items-end gap-3">
              {/* Circular progress */}
              <div className="flex items-center gap-4">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-[conic-gradient(at_50%_50%,_rgb(16,185,129)_0%,_rgb(56,189,248)_40%,_rgb(129,140,248)_70%,_rgb(15,118,110)_100%)] opacity-90" />
                  <div className="absolute inset-[4px] rounded-full bg-slate-950" />
                  <div className="relative flex flex-col items-center justify-center leading-tight">
                    <span className="text-lg font-bold">{pct}%</span>
                    <span className="text-xs text-slate-400">today</span>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-slate-300">
                  <p className="font-medium uppercase tracking-wide text-slate-400">
                    Day progress
                  </p>
                  <p className="text-slate-300/90">
                    {completedCount}/{totalCount} blocks checked
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* BODY: exercises + notes */}
        <CardContent className="space-y-4 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-4 shadow-inner">
          {/* exercises */}
          <div className="space-y-2">
            {workout.exercises.map((ex, i) => {
              const key = `${workoutKey}-${i}`;
              const checked = !!progress[key];

              return (
                <div
                  key={key}
                  className={[
                    "flex items-start gap-2 rounded-xl border px-3 py-2 text-sm cursor-pointer transition-all",
                    checked
                      ? "border-emerald-300/80 bg-emerald-950/50 shadow-[0_0_0_1px_rgba(45,212,191,0.5)]"
                      : "border-slate-800/90 bg-slate-950/40 hover:border-sky-500/50 hover:bg-slate-900/60",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => toggleExercise(workoutKey, i, !checked)}
                >
                  <Checkbox
                    checked={checked}
                    onClick={(e) => e.stopPropagation()}
                    onCheckedChange={(val) =>
                      toggleExercise(workoutKey, i, Boolean(val))
                    }
                  />
                  <div className="flex flex-col">
                    <span
                      className={
                        checked
                          ? "line-through decoration-emerald-400/80 decoration-2 text-emerald-100"
                          : "text-slate-100"
                      }
                    >
                      {ex}
                    </span>
                    <span className="mt-0.5 text-[11px] text-slate-400">
                      Smooth tempo · breathe · full range of motion
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* notes */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-medium text-slate-300 uppercase tracking-[0.18em]">
              Session log
            </p>
            <Textarea
              value={notes[workoutKey] ?? ""}
              onChange={(e) => changeNote(workoutKey, e.target.value)}
              placeholder="Energy, weights, sleep, small wins… jot down how this day actually felt."
              className="min-h-[90px] resize-none border-slate-800 bg-slate-950/70 text-sm placeholder:text-slate-500 focus-visible:ring-sky-400"
            />
            <p className="text-[11px] text-slate-400">
              Stays on this device only. Over time you’ll see patterns in energy
              and performance.
            </p>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
