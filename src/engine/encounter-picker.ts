import type { Encounter, GameState } from "./types";

export function pickEncounter(
  encounters: Encounter[],
  state: GameState,
  used: Set<string>,
): Encounter {
  const avail = encounters.filter(e => {
    if (used.has(e.id)) return false;
    if (e.requires && !e.requires(state)) return false;
    return true;
  });

  const conseq = avail.filter(e => e.requires);
  const normal = avail.filter(e => !e.requires);

  if (conseq.length > 0 && (normal.length === 0 || Math.random() < 0.6)) {
    return conseq[Math.floor(Math.random() * conseq.length)];
  }

  if (normal.length > 0) {
    return normal[Math.floor(Math.random() * normal.length)];
  }

  // Fallback: reuse encounters if all used
  const fallback = encounters.filter(e => !e.requires || e.requires(state));
  return fallback[Math.floor(Math.random() * fallback.length)] || encounters[0];
}
