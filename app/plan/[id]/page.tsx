// app/plan/[id]/page.tsx
import prisma from "@/lib/db";
import type { Plan } from "@/lib/planBuilder";
import { PlanClient } from "./plan-client";

export default async function PlanPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

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

  return <PlanClient id={id} plan={plan} />;
}
