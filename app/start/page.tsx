// app/start/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const goals = [
  { value: "muscle_gain", label: "Build muscle" },
  { value: "fat_loss", label: "Lose fat" },
  { value: "stay_active", label: "Stay active" },
];

const days = [3, 4, 5];

const equipments = [
  { value: "gym", label: "Full gym" },
  { value: "home_dumbbells", label: "Home – dumbbells" },
  { value: "bodyweight", label: "Home – bodyweight" },
];

const times = [
  { value: "morning", label: "Morning" },
  { value: "evening", label: "Evening" },
  { value: "flexible", label: "Flexible" },
];

export default function StartPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    goal: "muscle_gain",
    daysPerWeek: 4,
    equipment: "gym",
    timeOfDay: "evening",
    experience: "intermediate",
    wantNutrition: false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/plan", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    // data = { id, plan }

    // ✅ store in browser so the plan page can read it
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`plan-${data.id}`, JSON.stringify(data.plan));
    }

    router.push(`/plan/${data.id}`);
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">Create your workout plan</h1>
      <p className="text-muted-foreground mb-6">
        Answer a few questions and we&apos;ll generate a 7-day view for you.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white/5 p-6 rounded-lg border"
      >
        {/* Goal */}
        <div>
          <label className="block mb-2 font-medium">
            What&apos;s your main goal?
          </label>
          <select
            className="w-full border rounded-md p-2 bg-background"
            value={form.goal}
            onChange={(e) => setForm((f) => ({ ...f, goal: e.target.value }))}
          >
            {goals.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        {/* Days per week */}
        <div>
          <label className="block mb-2 font-medium">
            How many days per week?
          </label>
          <select
            className="w-full border rounded-md p-2 bg-background"
            value={form.daysPerWeek}
            onChange={(e) =>
              setForm((f) => ({ ...f, daysPerWeek: Number(e.target.value) }))
            }
          >
            {days.map((d) => (
              <option key={d} value={d}>
                {d} days
              </option>
            ))}
          </select>
        </div>

        {/* Equipment */}
        <div>
          <label className="block mb-2 font-medium">
            What equipment do you have?
          </label>
          <select
            className="w-full border rounded-md p-2 bg-background"
            value={form.equipment}
            onChange={(e) =>
              setForm((f) => ({ ...f, equipment: e.target.value }))
            }
          >
            {equipments.map((eq) => (
              <option key={eq.value} value={eq.value}>
                {eq.label}
              </option>
            ))}
          </select>
        </div>

        {/* Time of day */}
        <div>
          <label className="block mb-2 font-medium">
            When do you prefer to work out?
          </label>
          <select
            className="w-full border rounded-md p-2 bg-background"
            value={form.timeOfDay}
            onChange={(e) =>
              setForm((f) => ({ ...f, timeOfDay: e.target.value }))
            }
          >
            {times.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Experience */}
        <div>
          <label className="block mb-2 font-medium">
            What is your experience level?
          </label>
          <select
            className="w-full border rounded-md p-2 bg-background"
            value={form.experience}
            onChange={(e) =>
              setForm((f) => ({ ...f, experience: e.target.value }))
            }
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Nutrition toggle */}
        <div className="flex items-center gap-2">
          <input
            id="nutrition"
            type="checkbox"
            checked={form.wantNutrition}
            onChange={(e) =>
              setForm((f) => ({ ...f, wantNutrition: e.target.checked }))
            }
          />
          <label htmlFor="nutrition" className="text-sm">
            I also want a simple nutrition/log section
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-md hover:bg-black/80"
        >
          {loading ? "Generating..." : "Generate my plan"}
        </button>
      </form>
    </div>
  );
}
