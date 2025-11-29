"use client";

import { useEffect, useState } from "react";

export function usePlanState(planId: string) {
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  // Load from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const progRaw = window.localStorage.getItem(`progress-${planId}`);
    if (progRaw && progRaw !== "undefined" && progRaw !== "null") {
      try {
        setProgress(JSON.parse(progRaw));
      } catch (e) {
        console.error("Invalid progress JSON", e);
      }
    }

    const notesRaw = window.localStorage.getItem(`notes-${planId}`);
    if (notesRaw && notesRaw !== "undefined" && notesRaw !== "null") {
      try {
        setNotes(JSON.parse(notesRaw));
      } catch (e) {
        console.error("Invalid notes JSON", e);
      }
    }
  }, [planId]);

  function persistProgress(next: Record<string, boolean>) {
    setProgress(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`progress-${planId}`, JSON.stringify(next));
    }
  }

  function persistNotes(next: Record<string, string>) {
    setNotes(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`notes-${planId}`, JSON.stringify(next));
    }
  }

  function toggleExercise(workoutKey: string, idx: number, checked: boolean) {
    const key = `${workoutKey}-${idx}`;
    const next = { ...progress, [key]: checked };
    persistProgress(next);
  }

  function changeNote(workoutKey: string, value: string) {
    const next = { ...notes, [workoutKey]: value };
    persistNotes(next);
  }

  function resetAll() {
    setProgress({});
    setNotes({});
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(`progress-${planId}`);
      window.localStorage.removeItem(`notes-${planId}`);
    }
  }

  return {
    progress,
    notes,
    toggleExercise,
    changeNote,
    resetAll,
  };
}
