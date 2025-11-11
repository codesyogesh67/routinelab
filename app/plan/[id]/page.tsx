"use client";

import { use, useEffect, useState } from "react";

export default function PlanPage(props: { params: Promise<{ id: string }> }) {
  // unwrap the params promise (your Next.js version wants this)
  const { id } = use(props.params);

  const [plan, setPlan] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const key = `plan-${id}`;
    const stored = window.localStorage.getItem(key);

    // bail out early if null, empty, or the literal string "undefined"
    if (!stored || stored === "undefined" || stored === "null") {
      console.warn("No valid plan found in localStorage for", key, stored);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === "object") {
        setPlan(parsed);
      }
    } catch (err) {
      console.error("Failed to parse stored plan:", err, stored);
    }
  }, [id]);

  // fallback UI if no plan was found
  if (!plan) {
    return (
      <div className="max-w-3xl mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-2">Plan not found</h1>
        <p className="text-muted-foreground mb-4">
          This plan isn&apos;t saved on this device yet. Please create a new
          one.
        </p>
        <a
          href="/start"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-muted"
        >
          Create a new plan
        </a>
      </div>
    );
  }

  // main UI
  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      <header>
        <h1 className="text-3xl font-bold mb-1">Your weekly workout plan</h1>
        <p className="text-muted-foreground">
          Goal: <span className="font-medium">{plan.goal}</span> ·{" "}
          {plan.daysPerWeek} days/week · {plan.equipment}
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {plan.workouts.map((day: any) => (
          <div key={day.day} className="border rounded-lg p-4 bg-white/5">
            <h2 className="font-semibold text-lg mb-1">{day.day}</h2>
            <p className="text-sm text-muted-foreground mb-2">{day.focus}</p>
            <ul className="list-disc pl-4 space-y-1 text-sm">
              {day.exercises.map((ex: string, i: number) => (
                <li key={i}>{ex}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <footer className="pt-4">
        <a
          href="/start"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-muted"
        >
          Generate another plan
        </a>
      </footer>
    </div>
  );
}
