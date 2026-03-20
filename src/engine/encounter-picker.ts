import type { Encounter, GameState } from "./types";

export function pickEncounter(
  encounters: Encounter[],
  state: GameState,
  used: Set<string>,
  playerPos?: [number, number],
): Encounter {
  const posKey = playerPos ? `${playerPos[0]},${playerPos[1]}` : null;

  const avail = encounters.filter(e => {
    if (used.has(e.id)) return false;
    if (e.requires && !e.requires(state)) return false;
    // Location filter: location encounters only at their cell
    if (e.location && e.location !== posKey) return false;
    return true;
  });

  // Priority: location-specific encounters
  if (posKey) {
    const locationEnc = avail.filter(e => e.location === posKey);
    if (locationEnc.length > 0) {
      return locationEnc[Math.floor(Math.random() * locationEnc.length)];
    }
  }

  // Non-location encounters only
  const nonLocation = avail.filter(e => !e.location);
  const conseq = nonLocation.filter(e => e.requires);
  const normal = nonLocation.filter(e => !e.requires);

  if (conseq.length > 0 && (normal.length === 0 || Math.random() < 0.6)) {
    return conseq[Math.floor(Math.random() * conseq.length)];
  }

  if (normal.length > 0) {
    return normal[Math.floor(Math.random() * normal.length)];
  }

  // Fallback: reuse encounters if all used
  const fallback = encounters.filter(e => {
    if (e.requires && !e.requires(state)) return false;
    if (e.location && e.location !== posKey) return false;
    return true;
  });
  return fallback[Math.floor(Math.random() * fallback.length)] || encounters[0];
}
