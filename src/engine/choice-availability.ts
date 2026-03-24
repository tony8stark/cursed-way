import type { Choice, EffectValue, GameState } from "./types";

export interface ChoiceAvailability {
  visible: boolean;
  selectable: boolean;
  cantAfford: boolean;
  alreadyOwned: boolean;
  goldCost: number;
}

function getWorstCaseCost(value: EffectValue | undefined): number {
  if (value === undefined) return 0;
  if (typeof value === "number") return value < 0 ? Math.abs(value) : 0;

  const lowest = Math.min(value[0], value[1]);
  return lowest < 0 ? Math.abs(lowest) : 0;
}

export function getChoiceAvailability(choice: Choice, state: GameState): ChoiceAvailability {
  const visible = (!choice.requires_item || state.inventory.includes(choice.requires_item))
    && (!choice.requires_flag || state.flags.has(choice.requires_flag));
  const goldCost = getWorstCaseCost(choice.eff.gold);
  const cantAfford = goldCost > state.gold;
  const alreadyOwned = !!choice.eff.item && state.inventory.includes(choice.eff.item);

  return {
    visible,
    selectable: visible && !cantAfford && !alreadyOwned,
    cantAfford,
    alreadyOwned,
    goldCost,
  };
}
