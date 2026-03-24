import type { GameMode } from "./game-mode";
import type { Ending, GameState } from "./types";

export const OBJECTIVE_COMPLETE_ID = "objective_complete";

type EndingLike<TState> = {
  id?: string;
  req: (state: TState) => boolean;
};

type FlagState = {
  flags?: {
    has: (value: string) => boolean;
  };
};

function hasObjectiveCompletion(state: FlagState): boolean {
  return state.flags?.has(OBJECTIVE_COMPLETE_ID) === true;
}

export function shouldUseObjectiveSystem(mode: GameMode, objectiveId: string | null | undefined): objectiveId is string {
  return mode === "free_roam" && typeof objectiveId === "string" && objectiveId.length > 0;
}

export function markObjectiveComplete(state: GameState, objectiveId: string): GameState {
  const flags = new Set(state.flags);
  flags.add(OBJECTIVE_COMPLETE_ID);
  flags.add(`objective_${objectiveId}`);
  return { ...state, flags };
}

export function resolveEndingIndex<TState extends FlagState, TEnding extends EndingLike<TState>>(
  endings: TEnding[],
  state: TState,
): number {
  if (hasObjectiveCompletion(state)) {
    const objectiveIndex = endings.findIndex(
      (ending) => ending.id === OBJECTIVE_COMPLETE_ID && ending.req(state),
    );
    if (objectiveIndex >= 0) return objectiveIndex;
  }

  return endings.findIndex((ending) => ending.req(state));
}

export function resolveEndingId<TState extends FlagState, TEnding extends EndingLike<TState>>(
  endings: TEnding[],
  state: TState,
): string | null {
  const index = resolveEndingIndex(endings, state);
  return index >= 0 ? endings[index]?.id ?? null : null;
}

export function resolveQuestEndingIndex(endings: Ending[], state: GameState): number {
  return resolveEndingIndex(endings, state);
}
