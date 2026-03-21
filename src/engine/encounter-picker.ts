import type { Encounter, GameState } from "./types";
import { ARTIFACTS } from "./items";

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
    // Location encounters only trigger at their map cell
    if (e.location && posKey !== null && e.location !== posKey) return false;
    return true;
  });

  // Priority 0: item-unlocked encounters (player has artifact that unlocks this encounter)
  const itemUnlocked = avail.filter(e => {
    return state.inventory.some(itemId => ARTIFACTS[itemId]?.encounterUnlock === e.id);
  });
  if (itemUnlocked.length > 0) {
    return itemUnlocked[Math.floor(Math.random() * itemUnlocked.length)];
  }

  // Priority 1: location-specific encounters
  if (posKey) {
    const locationEnc = avail.filter(e => e.location === posKey);
    if (locationEnc.length > 0) {
      return locationEnc[Math.floor(Math.random() * locationEnc.length)];
    }
  }

  // Filter out location-bound encounters from general pool
  const general = avail.filter(e => !e.location);
  const conseq = general.filter(e => e.requires);
  const normal = general.filter(e => !e.requires);

  if (conseq.length > 0 && (normal.length === 0 || Math.random() < 0.6)) {
    return conseq[Math.floor(Math.random() * conseq.length)];
  }

  if (normal.length > 0) {
    return normal[Math.floor(Math.random() * normal.length)];
  }

  // Fallback: reuse encounters if all used
  const fallback = encounters.filter(e => {
    if (e.requires && !e.requires(state)) return false;
    if (e.location && posKey !== null && e.location !== posKey) return false;
    return true;
  });
  return fallback[Math.floor(Math.random() * fallback.length)] || encounters[0];
}
