import { describe, expect, it } from "vitest";
import type { Choice, GameState } from "../types";
import { getChoiceAvailability } from "../choice-availability";

function createState(overrides: Partial<GameState> = {}): GameState {
  return {
    gold: 0,
    crew: 5,
    karma: 0,
    curse: 0,
    day: 1,
    watch: 0,
    flags: new Set<string>(),
    log: [],
    inventory: [],
    delayedEffects: [],
    visitedLocations: new Set<string>(),
    factionReps: { crown: 0, brethren: 0, guild: 0 },
    artifactLog: [],
    npcMeetings: [],
    locationVisits: {},
    ...overrides,
  };
}

function createChoice(overrides: Partial<Choice> = {}): Choice {
  return {
    text: "Test choice",
    eff: {},
    msg: "Result",
    ...overrides,
  };
}

describe("choice availability", () => {
  it("blocks ranged gold losses when the player cannot cover the worst case", () => {
    const availability = getChoiceAvailability(
      createChoice({ eff: { gold: [-20, 20] } }),
      createState({ gold: 10 }),
    );

    expect(availability.cantAfford).toBe(true);
    expect(availability.selectable).toBe(false);
  });

  it("blocks duplicate artifact rewards", () => {
    const availability = getChoiceAvailability(
      createChoice({ eff: { item: "black_pearl" } }),
      createState({ inventory: ["black_pearl"] }),
    );

    expect(availability.alreadyOwned).toBe(true);
    expect(availability.selectable).toBe(false);
  });

  it("hides choices gated by missing flags or items", () => {
    const missingFlag = getChoiceAvailability(
      createChoice({ requires_flag: "origin_scholar" }),
      createState(),
    );
    const missingItem = getChoiceAvailability(
      createChoice({ requires_item: "cursed_compass" }),
      createState(),
    );

    expect(missingFlag.visible).toBe(false);
    expect(missingItem.visible).toBe(false);
  });

  it("shows but blocks faction-gated choices until the required reputation is met", () => {
    const lowRep = getChoiceAvailability(
      createChoice({ requires_rep: { guild: 3 } }),
      createState({ factionReps: { crown: 0, brethren: 0, guild: 2 } }),
    );
    const enoughRep = getChoiceAvailability(
      createChoice({ requires_rep: { guild: 3 } }),
      createState({ factionReps: { crown: 0, brethren: 0, guild: 3 } }),
    );

    expect(lowRep.visible).toBe(true);
    expect(lowRep.selectable).toBe(false);
    expect(lowRep.missingReputation).toEqual({ guild: 3 });

    expect(enoughRep.selectable).toBe(true);
    expect(enoughRep.missingReputation).toEqual({});
  });
});
