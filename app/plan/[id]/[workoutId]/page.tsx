// app/plan/[id]/[workoutId]/page.tsx
import prisma from "@/lib/db";
import type { Plan } from "@/lib/planBuilder";
import { DayClient } from "./day-client";

export default async function WorkoutPage(props: {
  params: Promise<{ id: string; workoutId: string }>;
}) {
  const { id, workoutId } = await props.params;

  const record = await prisma.plan.findUnique({
    where: { id },
  });

  if (!record) {
    return (
      <div className="max-w-3xl mx-auto py-10 space-y-4 text-center">
        <h1 className="text-2xl font-bold">Plan not found</h1>
        <p className="text-muted-foreground">
          This plan doesn&apos;t exist or was removed. Create a new one in
          routinelab.
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

  const now = new Date();
  const isExpired = now > record.expiresAt;

  if (isExpired) {
    return (
      <div className="max-w-3xl mx-auto py-10 space-y-4 text-center">
        <h1 className="text-2xl font-bold">Plan expired</h1>
        <p className="text-muted-foreground">
          This plan was created more than 7 days ago. Generate a fresh routine
          that matches your current schedule.
        </p>
        <a
          href="/start"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-muted"
        >
          Generate a new plan
        </a>
      </div>
    );
  }

  const plan = record.data as Plan;
  const workout = plan.workouts.find((w) => w.id === workoutId);

  if (!workout) {
    return (
      <div className="max-w-3xl mx-auto py-10 space-y-4 text-center">
        <h1 className="text-2xl font-bold">Workout not found</h1>
        <p className="text-muted-foreground">
          This day isn&apos;t part of this plan. Go back to your routine.
        </p>
        <a
          href={`/plan/${id}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-muted"
        >
          Back to overview
        </a>
      </div>
    );
  }

  return <DayClient id={id} plan={plan} workout={workout} />;
}
