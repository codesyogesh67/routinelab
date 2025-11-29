"use client";

import type { Plan } from "@/lib/planBuilder";

type PlanHeroProps = {
  plan: Plan;
  uniqueFocuses: string[];
};

export function PlanHero({ plan, uniqueFocuses }: PlanHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 text-slate-50 shadow-xl">
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_top,_#22c55e33,_transparent_60%),radial-gradient(circle_at_bottom,_#38bdf833,_transparent_60%)]" />
      <div className="relative flex flex-col gap-6 p-6 md:p-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3 max-w-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            routinelab · personal program
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Your {plan.daysPerWeek}-day routine for{" "}
            <span className="underline decoration-lime-400 decoration-2 underline-offset-4">
              {plan.goal.toLowerCase()}
            </span>
          </h1>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/80 px-3 py-1 border border-slate-700">
              <span className="text-base">📅</span>
              {plan.daysPerWeek} days / week
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/80 px-3 py-1 border border-slate-700">
              <span className="text-base">🎯</span>
              Goal: <span className="font-medium">{plan.goal}</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/80 px-3 py-1 border border-slate-700">
              <span className="text-base">🏋️</span>
              {plan.equipment}
            </span>
            {uniqueFocuses.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/80 px-3 py-1 border border-slate-700">
                <span className="text-base">🧩</span>
                {uniqueFocuses.join(" · ")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
