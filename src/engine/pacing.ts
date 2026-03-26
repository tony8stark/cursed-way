import type { GameMode } from "./game-mode";
import type { StoryletFamily } from "./types";

const EMPTY_SAIL_CHANCE: Record<GameMode, number> = {
  expedition: 0.15,
  free_roam: 0.35,
};

const FAMILY_PACING_MULTIPLIER: Record<GameMode, Record<StoryletFamily, number>> = {
  expedition: {
    ambient: 0.75,
    consequence: 1.2,
    quest: 1.1,
    relationship: 1.05,
    setpiece: 1.15,
  },
  free_roam: {
    ambient: 1.1,
    consequence: 1,
    quest: 1,
    relationship: 1,
    setpiece: 1,
  },
};

const CANDIDATE_POOL_RATIO: Record<GameMode, number> = {
  expedition: 0.25,
  free_roam: 0.4,
};

interface EmptySailingCheck {
  mode: GameMode;
  isEnRoute: boolean;
  currentLocationName: string | null;
  roll: number;
}

export function shouldTriggerEmptySailing({
  mode,
  isEnRoute,
  currentLocationName,
  roll,
}: EmptySailingCheck): boolean {
  if (!isEnRoute || currentLocationName) return false;
  return roll < EMPTY_SAIL_CHANCE[mode];
}

export function getFamilyPacingMultiplier(mode: GameMode, family: StoryletFamily): number {
  return FAMILY_PACING_MULTIPLIER[mode][family];
}

export function getCandidatePoolSize(mode: GameMode, totalCandidates: number): number {
  if (totalCandidates <= 3) return totalCandidates;
  return Math.max(3, Math.ceil(totalCandidates * CANDIDATE_POOL_RATIO[mode]));
}
