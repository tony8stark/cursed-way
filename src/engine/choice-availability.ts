import type { FactionId } from "./factions";
import type { Choice, EffectValue, GameState } from "./types";

export interface ChoiceAvailability {
  visible: boolean;
  selectable: boolean;
  cantAfford: boolean;
  alreadyOwned: boolean;
  goldCost: number;
  missingReputation: Partial<Record<FactionId, number>>;
}

function getWorstCaseCost(value: EffectValue | undefined): number {
  if (value === undefined) return 0;
  if (typeof value === "number") return value < 0 ? Math.abs(value) : 0;

  const lowest = Math.min(value[0], value[1]);
  return lowest < 0 ? Math.abs(lowest) : 0;
}

function getMissingReputation(choice: Choice, state: GameState): Partial<Record<FactionId, number>> {
  const requirements = choice.requires_rep;
  if (!requirements) return {};

  const missing: Partial<Record<FactionId, number>> = {};
  for (const [factionId, minRep] of Object.entries(requirements) as Array<[FactionId, number]>) {
    if (state.factionReps[factionId] < minRep) {
      missing[factionId] = minRep;
    }
  }

  return missing;
}

export function getChoiceAvailability(choice: Choice, state: GameState): ChoiceAvailability {
  const visible = (!choice.requires_item || state.inventory.includes(choice.requires_item))
    && (!choice.requires_flag || state.flags.has(choice.requires_flag));
  const goldCost = getWorstCaseCost(choice.eff.gold);
  const cantAfford = goldCost > state.gold;
  const alreadyOwned = !!choice.eff.item && state.inventory.includes(choice.eff.item);
  const missingReputation = getMissingReputation(choice, state);
  const repLocked = Object.keys(missingReputation).length > 0;

  return {
    visible,
    selectable: visible && !cantAfford && !alreadyOwned && !repLocked,
    cantAfford,
    alreadyOwned,
    goldCost,
    missingReputation,
  };
}
