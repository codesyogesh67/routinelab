// lib/planStore.ts
const plans = new Map<string, any>();

export function savePlan(id: string, data: any) {
  plans.set(id, data);
}

export function getPlan(id: string) {
  return plans.get(id);
}
