// lib/planStore.ts
import { type Plan } from "./planBuilder";

const store = new Map<string, Plan>();

export function savePlan(id: string, plan: Plan) {
  store.set(id, plan);
}

export function getPlan(id: string): Plan | null {
  return store.get(id) ?? null;
}
