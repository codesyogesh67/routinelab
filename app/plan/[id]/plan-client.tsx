"use client";

import { useMemo, useState } from "react";
import type { Plan } from "@/lib/planBuilder";

import { usePlanState } from "./use-plan-state";
import { PlanHero } from "./plan-hero";
import { ActiveDayCard } from "./active-day-card";
import { FooterActions } from "./footer-actions";
import { Button } from "@/components/ui/button";

type PlanClientProps = {
  id: string;
  plan: Plan;
};

export function PlanClient({ id, plan }: PlanClientProps) {
  const {
    progress,
    notes,
    toggleExercise,
    changeNote,
    resetAll,
  } = usePlanState(id);

  const [activeIndex, setActiveIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const uniqueFocuses = useMemo(() => {
    const focuses = new Set<string>();
    for (const w of plan.workouts) focuses.add(w.focus);
    return Array.from(focuses);
  }, [plan]);

  const hasWorkouts = plan.workouts.length > 0;

  const goNext = () => {
    if (!hasWorkouts) return;
    setActiveIndex((prev) => (prev + 1) % plan.workouts.length);
  };

  const goPrev = () => {
    if (!hasWorkouts) return;
    setActiveIndex((prev) =>
      prev === 0 ? plan.workouts.length - 1 : prev - 1
    );
  };

  const activeWorkout = hasWorkouts ? plan.workouts[activeIndex] : null;

  return (
    <div className="max-w-5xl mx-auto space-y-2 py-10 px-4 md:px-0">
      <PlanHero plan={plan} uniqueFocuses={uniqueFocuses} />

      {/* SHOW ALL / HIDE ALL TOGGLE (outside carousel) */}
      {hasWorkouts && !showAll && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            className="h-7 px-3 text-[11px] text-sky-300 hover:text-sky-100"
            onClick={() => setShowAll(true)}
          >
            Show all days
          </Button>
        </div>
      )}

      {hasWorkouts && showAll && (
        <div className="flex justify-end">
          {" "}
          <Button
            type="button"
            variant="ghost"
            className="h-7 px-3 text-[11px] text-sky-300 hover:text-sky-100"
            onClick={() => setShowAll(false)}
          >
            Hide all days
          </Button>
        </div>
      )}

      {/* SINGLE-DAY CAROUSEL */}
      {activeWorkout && !showAll && (
        <ActiveDayCard
          id={id}
          plan={plan}
          workout={activeWorkout}
          workoutIndex={activeIndex}
          progress={progress}
          notes={notes}
          toggleExercise={toggleExercise}
          changeNote={changeNote}
          showNav={true}
          goNext={goNext}
          goPrev={goPrev}
        />
      )}

      {/* SHOW ALL: render all the same fancy cards, but without nav */}
      {showAll && (
        <div className="space-y-5">
          {plan.workouts.map((w, idx) => (
            <ActiveDayCard
              key={w.id ?? `w-${idx}`}
              id={id}
              plan={plan}
              workout={w}
              workoutIndex={idx}
              progress={progress}
              notes={notes}
              toggleExercise={toggleExercise}
              changeNote={changeNote}
              showNav={false}
            />
          ))}
        </div>
      )}

      <FooterActions resetAll={resetAll} />
    </div>
  );
}
