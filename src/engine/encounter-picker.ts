import type { Encounter, GameState, RunPhase } from "./types";
import { ARTIFACTS } from "./items";
import { useGameModeStore } from "./game-mode";
import { enrichEncounter } from "./storylet-tagger";

/** Determine current run phase based on day and game mode */
function getRunPhase(state: GameState): RunPhase {
  const mode = useGameModeStore.getState().mode;
  if (mode === "expedition") {
    // 20-day run: early 1-6, mid 7-14, late 15-20
    if (state.day <= 6) return "early";
    if (state.day <= 14) return "mid";
    return "late";
  }
  // Free roam: phase based on progression signals
  if (state.day <= 8) return "early";
  if (state.day <= 24) return "mid";
  return "late";
}

/** Score how well an encounter's phase fits the current run phase */
function phaseFit(encounter: Encounter, currentPhase: RunPhase): number {
  if (!encounter.phase) return 1; // no phase = fits anywhere
  const phases = Array.isArray(encounter.phase) ? encounter.phase : [encounter.phase];
  if (phases.includes(currentPhase)) return 1.5; // good fit bonus

  // Adjacent phase = neutral, distant = penalty
  const order: RunPhase[] = ["early", "mid", "late"];
  const currentIdx = order.indexOf(currentPhase);
  const minDist = Math.min(...phases.map(p => Math.abs(order.indexOf(p) - currentIdx)));
  return minDist <= 1 ? 0.8 : 0.3;
}

/** Score based on content family diversity */
function familyFit(encounter: Encounter, recentFamilies: string[]): number {
  const family = encounter.family ?? "ambient";
  // Consequence encounters get a boost
  if (family === "consequence") return 1.5;
  // Setpieces are rare and valuable
  if (family === "setpiece") return 1.3;
  // Penalize repetition of same family
  const recentCount = recentFamilies.filter(f => f === family).length;
  return Math.max(0.4, 1 - recentCount * 0.2);
}

/** Anti-repeat: penalize encounters from same tags as recent ones */
function noveltyScore(encounter: Encounter, recentTags: Set<string>): number {
  if (!encounter.tags || encounter.tags.length === 0) return 1;
  const overlap = encounter.tags.filter(t => recentTags.has(t)).length;
  if (overlap === 0) return 1.2; // fresh theme bonus
  return Math.max(0.3, 1 - overlap * 0.25);
}

/** Weighted random selection from scored candidates */
function weightedPick<T extends { score: number }>(items: T[]): T {
  const totalWeight = items.reduce((sum, item) => sum + item.score, 0);
  let roll = Math.random() * totalWeight;
  for (const item of items) {
    roll -= item.score;
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}

export interface PickerContext {
  recentFamilies?: string[];  // last N encounter families
  recentTags?: Set<string>;   // tags from last N encounters
  usedGroups?: Set<string>;   // exclusivity groups already used this run
  recentIds?: string[];       // last N encounter ids for cooldown checks
}

export function pickEncounter(
  encounters: Encounter[],
  state: GameState,
  used: Set<string>,
  playerPos?: [number, number],
  context?: PickerContext,
): Encounter {
  const posKey = playerPos ? `${playerPos[0]},${playerPos[1]}` : null;
  const phase = getRunPhase(state);
  const recentFamilies = context?.recentFamilies ?? [];
  const recentTags = context?.recentTags ?? new Set<string>();
  const usedGroups = context?.usedGroups ?? new Set<string>();
  const recentIds = context?.recentIds ?? [];

  // Enrich encounters with inferred storylet metadata
  const enriched = encounters.map(enrichEncounter);

  // Filter available encounters
  const avail = enriched.filter(e => {
    if (used.has(e.id)) return false;
    if (e.requires && !e.requires(state)) return false;
    // Location encounters only trigger at their map cell
    if (e.location && posKey !== null && e.location !== posKey) return false;
    // Exclusivity group check
    if (e.exclusivityGroup && usedGroups.has(e.exclusivityGroup)) return false;
    // Cooldown check: if encounter appeared recently, skip it
    if (e.cooldown && recentIds.includes(e.id)) {
      const lastIdx = recentIds.lastIndexOf(e.id);
      if (recentIds.length - lastIdx <= e.cooldown) return false;
    }
    return true;
  });

  // Priority 0: item-unlocked encounters (always fire immediately)
  const itemUnlocked = avail.filter(e => {
    return state.inventory.some(itemId => ARTIFACTS[itemId]?.encounterUnlock === e.id);
  });
  if (itemUnlocked.length > 0) {
    return itemUnlocked[Math.floor(Math.random() * itemUnlocked.length)];
  }

  // Priority 1: location-specific encounters at current position
  if (posKey) {
    const locationEnc = avail.filter(e => e.location === posKey);
    if (locationEnc.length > 0) {
      // Score even location encounters for best pick
      const scored = locationEnc.map(e => ({
        encounter: e,
        score: (e.weight ?? 1) * phaseFit(e, phase) * noveltyScore(e, recentTags),
      }));
      return weightedPick(scored).encounter;
    }
  }

  // General pool: filter out location-bound encounters
  const general = avail.filter(e => !e.location);

  if (general.length === 0) {
    // Fallback: reuse encounters if all used
    const fallback = enriched.filter(e => {
      if (e.requires && !e.requires(state)) return false;
      if (e.location && posKey !== null && e.location !== posKey) return false;
      return true;
    });
    return fallback[Math.floor(Math.random() * fallback.length)] || encounters[0];
  }

  // Score all general encounters
  const scored = general.map(e => {
    const base = e.weight ?? 1;
    const pf = phaseFit(e, phase);
    const ff = familyFit(e, recentFamilies);
    const nv = noveltyScore(e, recentTags);
    const score = base * pf * ff * nv;
    return { encounter: e, score: Math.max(0.01, score) };
  });

  // Sort by score descending, pick from top candidates with weighted random
  scored.sort((a, b) => b.score - a.score);
  // Take top 40% or at least 3 candidates for weighted pick (adds variety)
  const topN = Math.max(3, Math.ceil(scored.length * 0.4));
  const candidates = scored.slice(0, topN);

  return weightedPick(candidates).encounter;
}
