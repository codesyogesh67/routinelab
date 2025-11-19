// app/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    title: "Tell us your week",
    body:
      "Answer a few quick questions about your goal, days per week, and equipment.",
  },
  {
    title: "Get your routine",
    body:
      "routinelab builds a structured, goal-based workout split that fits your schedule.",
  },
  {
    title: "Track as you go",
    body:
      "Check off exercises, add notes, and watch your progress stack up each week.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/40">
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        {/* Hero */}
        <section className="space-y-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground bg-background/60">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Day-by-day fitness, without overthinking
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Turn 5 questions into a{" "}
              <span className="underline decoration-emerald-500 underline-offset-4">
                weekly workout routine
              </span>
              .
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              routinelab builds a simple, realistic training plan from your
              answers — then helps you track sets, sessions, and notes so you
              stay consistent.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" asChild>
              <a href="/start">Create your routine</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#how-it-works">See how it works</a>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <a href="/demo">View demo week</a>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            No sign-up required. Your plan and progress stay on your device.
          </p>
        </section>

        {/* Preview card */}
        <section>
          <Card className="border-dashed bg-background/70 shadow-sm">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="space-y-2 flex-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Example week
                  </p>
                  <h2 className="text-xl font-semibold">
                    4-day Upper / Lower split
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Tell routinelab you want to train 4 days per week with a gym
                    membership, and it will structure an Upper / Lower routine
                    with balanced volume and built-in rest days.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm flex-1">
                  <div className="rounded-lg border bg-muted/50 p-3 text-left">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Monday
                    </p>
                    <p className="font-medium mb-1">Upper body — strength</p>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Bench press 4×8</li>
                      <li>• Bent-over row 4×8</li>
                      <li>• Overhead press 3×8</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border bg-muted/50 p-3 text-left">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Tuesday
                    </p>
                    <p className="font-medium mb-1">Lower body — strength</p>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Back squat 4×8</li>
                      <li>• Romanian deadlift 3×10</li>
                      <li>• Lunges 3×10 / leg</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              How routinelab works
            </h2>
            <p className="text-muted-foreground text-sm">
              Built for people who already go to the gym — and just want the
              plan written down.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, idx) => (
              <Card key={step.title} className="h-full">
                <CardContent className="pt-6 space-y-2">
                  <div className="text-xs text-muted-foreground">
                    Step {idx + 1}
                  </div>
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t pt-6 mt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>routinelab · built by Yogesh</span>
          <span>v0.1 · MVP — workout planner + tracker</span>
        </footer>
      </div>
    </main>
  );
}
