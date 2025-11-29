// app/start/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const goals = [
  {
    value: "muscle_gain",
    label: "Build muscle",
    tagline: "Push strength & size",
  },
  { value: "fat_loss", label: "Lose fat", tagline: "Lean out & feel lighter" },
  { value: "stay_active", label: "Stay active", tagline: "Move, stay healthy" },
];

const days = [3, 4, 5];

const equipments = [
  { value: "gym", label: "Full gym", sub: "Racks, barbells, cables" },
  {
    value: "home_dumbbells",
    label: "Home – dumbbells",
    sub: "A few pairs at home",
  },
  {
    value: "bodyweight",
    label: "Home – bodyweight",
    sub: "No equipment needed",
  },
];

const experiences = [
  { value: "beginner", label: "Beginner", sub: "New or coming back" },
  { value: "intermediate", label: "Intermediate", sub: "Training for a while" },
  { value: "advanced", label: "Advanced", sub: "Comfortable pushing heavy" },
];

// 🧠 New questions

const jobActivityOptions = [
  {
    value: "sedentary",
    label: "Mostly sitting",
    sub: "Desk / computer most of the day",
  },
  { value: "mixed", label: "Mixed", sub: "Sit + stand, some walking" },
  { value: "on_feet", label: "On my feet", sub: "On the move most of the day" },
];

const sessionLengthOptions = [
  { value: "20_30", label: "20–30 min", sub: "Short & focused" },
  { value: "30_45", label: "30–45 min", sub: "Solid, realistic session" },
  { value: "45_60", label: "45–60 min", sub: "I enjoy longer workouts" },
];

const focusAreasOptions = [
  { value: "upper", label: "Upper body", sub: "Chest, shoulders, back" },
  { value: "lower", label: "Legs & glutes", sub: "Quads, hamstrings, glutes" },
  { value: "core", label: "Core", sub: "Abs, midline stability" },
  { value: "full", label: "Overall strength", sub: "Balanced whole body" },
];

const consistencyStruggleOptions = [
  { value: "time", label: "Time / schedule", sub: "Days get too busy" },
  { value: "fatigue", label: "Low energy", sub: "I feel tired or drained" },
  { value: "motivation", label: "Motivation", sub: "Hard to get started" },
  {
    value: "overthinking",
    label: "Too many options",
    sub: "I overthink routines",
  },
];

export default function StartPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    goal: "muscle_gain",
    daysPerWeek: 4,
    equipment: "gym",
    timeOfDay: "flexible", // we keep this for the API, but no need to ask directly
    experience: "intermediate",
    wantNutrition: false,

    // new fields (extra info for future logic)
    jobActivity: "mixed",
    sessionLength: "30_45",
    focusAreas: [] as string[],
    consistencyStruggle: "time",
  });

  function toggleFocusArea(value: string) {
    setForm((f) => {
      const exists = f.focusAreas.includes(value);
      return {
        ...f,
        focusAreas: exists
          ? f.focusAreas.filter((v) => v !== value)
          : [...f.focusAreas, value],
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const res = await fetch("/api/plan", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (typeof window !== "undefined" && data?.plan) {
      window.localStorage.setItem(`plan-${data.id}`, JSON.stringify(data.plan));
      window.localStorage.setItem("routinelab-current-plan-id", data.id);
    }

    router.push(`/plan/${data.id}`);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-16 space-y-8">
        {/* Intro */}
        <section className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Answer a few questions · routinelab builds your week
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
              Let&apos;s design a routine that actually fits your life.
            </h1>
            <p className="text-sm md:text-base text-slate-600 max-w-2xl">
              These questions help routinelab understand your goals, lifestyle,
              and what usually gets in the way — so your plan feels realistic,
              not random.
            </p>
          </div>
        </section>

        {/* Form card */}
        <Card className="border border-slate-200 bg-white shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg md:text-xl text-slate-900">
              Your training profile
            </CardTitle>
            <CardDescription>
              Tap through the cards — it should feel more like a quick chat than
              a form.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 1. Goal */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-900">
                  1. What&apos;s your main goal right now?
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  {goals.map((g) => {
                    const active = form.goal === g.value;
                    return (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() =>
                          setForm((f) => ({ ...f, goal: g.value }))
                        }
                        className={`rounded-xl border text-left px-3 py-3 text-sm transition-all ${
                          active
                            ? "border-emerald-500 bg-emerald-50 shadow-sm"
                            : "border-slate-200 bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div className="font-medium text-slate-900">
                          {g.label}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {g.tagline}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Days per week */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-900">
                    2. How many days per week can you realistically train?
                  </p>
                  <p className="text-xs text-slate-500">
                    Be honest — consistency beats perfection.
                  </p>
                </div>
                <div className="flex gap-2">
                  {days.map((d) => {
                    const active = form.daysPerWeek === d;
                    return (
                      <Button
                        key={d}
                        type="button"
                        variant={active ? "default" : "outline"}
                        className={`flex-1 ${
                          active
                            ? "bg-emerald-500 text-white hover:bg-emerald-400 border-emerald-500"
                            : "border-slate-300 text-slate-700 hover:bg-slate-50"
                        }`}
                        onClick={() =>
                          setForm((f) => ({ ...f, daysPerWeek: d }))
                        }
                      >
                        {d} days
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Equipment */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-900">
                  3. What do you have access to?
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  {equipments.map((eq) => {
                    const active = form.equipment === eq.value;
                    return (
                      <button
                        key={eq.value}
                        type="button"
                        onClick={() =>
                          setForm((f) => ({ ...f, equipment: eq.value }))
                        }
                        className={`rounded-xl border text-left px-3 py-3 text-sm transition-all ${
                          active
                            ? "border-emerald-500 bg-emerald-50 shadow-sm"
                            : "border-slate-200 bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div className="font-medium text-slate-900">
                          {eq.label}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {eq.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Day-to-day activity */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-900">
                  4. How active is your day-to-day life?
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  {jobActivityOptions.map((opt) => {
                    const active = form.jobActivity === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setForm((f) => ({ ...f, jobActivity: opt.value }))
                        }
                        className={`rounded-xl border text-left px-3 py-3 text-sm transition-all ${
                          active
                            ? "border-emerald-500 bg-emerald-50 shadow-sm"
                            : "border-slate-200 bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div className="font-medium text-slate-900">
                          {opt.label}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {opt.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Session length */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-900">
                  5. How much time can you realistically spend per workout?
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  {sessionLengthOptions.map((opt) => {
                    const active = form.sessionLength === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setForm((f) => ({ ...f, sessionLength: opt.value }))
                        }
                        className={`rounded-xl border text-left px-3 py-3 text-sm transition-all ${
                          active
                            ? "border-emerald-500 bg-emerald-50 shadow-sm"
                            : "border-slate-200 bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div className="font-medium text-slate-900">
                          {opt.label}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {opt.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Focus areas (multi-select) */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-900">
                  6. Which areas do you want to prioritize a bit more?
                </p>
                <p className="text-xs text-slate-500">
                  You can pick more than one — we&apos;ll still keep the plan
                  balanced.
                </p>
                <div className="flex flex-wrap gap-2">
                  {focusAreasOptions.map((opt) => {
                    const active = form.focusAreas.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleFocusArea(opt.value)}
                        className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                          active
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 7. Experience */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-900">
                  7. What&apos;s your lifting experience?
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  {experiences.map((exp) => {
                    const active = form.experience === exp.value;
                    return (
                      <button
                        key={exp.value}
                        type="button"
                        onClick={() =>
                          setForm((f) => ({ ...f, experience: exp.value }))
                        }
                        className={`rounded-xl border text-left px-3 py-3 text-sm transition-all ${
                          active
                            ? "border-emerald-500 bg-emerald-50 shadow-sm"
                            : "border-slate-200 bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div className="font-medium text-slate-900">
                          {exp.label}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {exp.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 8. Consistency struggle */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-900">
                  8. What usually makes you lose consistency?
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  {consistencyStruggleOptions.map((opt) => {
                    const active = form.consistencyStruggle === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            consistencyStruggle: opt.value,
                          }))
                        }
                        className={`rounded-xl border text-left px-3 py-3 text-sm transition-all ${
                          active
                            ? "border-emerald-500 bg-emerald-50 shadow-sm"
                            : "border-slate-200 bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div className="font-medium text-slate-900">
                          {opt.label}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {opt.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Nutrition toggle */}
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Add a simple nutrition / log section?
                  </p>
                  <p className="text-xs text-slate-500">
                    You&apos;ll be able to jot down meals or notes next to your
                    training.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">No</span>
                  <Switch
                    checked={form.wantNutrition}
                    onCheckedChange={(checked) =>
                      setForm((f) => ({ ...f, wantNutrition: checked }))
                    }
                  />
                  <span className="text-xs text-slate-500">Yes</span>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-500 text-white hover:bg-emerald-400"
                  size="lg"
                >
                  {loading
                    ? "Building your week..."
                    : "Generate my weekly plan"}
                </Button>
                <p className="mt-2 text-xs text-slate-500 text-center">
                  No sign-up needed. Your routine & progress stay on this
                  device.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
