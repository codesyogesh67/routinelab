"use client";

import { Button } from "@/components/ui/button";

type FooterActionsProps = {
  resetAll: () => void;
};

export function FooterActions({ resetAll }: FooterActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <a href="/start">Generate another plan</a>
        </Button>
        <Button variant="ghost" onClick={resetAll}>
          Reset progress
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Built with routinelab · small daily checkmarks → big long-term change.
      </p>
    </div>
  );
}
