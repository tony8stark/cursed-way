import type { EffectValue } from "./types";

function rand(a: number, b: number): number {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

export function resolveValue(v: EffectValue | undefined): number {
  if (v === undefined) return 0;
  if (Array.isArray(v)) return rand(v[0], v[1]);
  return v;
}
