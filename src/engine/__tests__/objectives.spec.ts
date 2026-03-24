import { describe, expect, it } from "vitest";
import type { GameState } from "../types";
import { getObjective } from "../objectives";

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

describe("objectives", () => {
  it("tracks treasure hunter by unique acquired artifacts, not current inventory", () => {
    const objective = getObjective("treasure_hunter");
    const progress = objective?.check(
      createState({
        inventory: ["starting_item", "black_pearl"],
        artifactLog: [
          { itemId: "black_pearl", day: 1, encounterId: "enc_1", encounterTitle: "Black Pearl" },
          { itemId: "voodoo_doll", day: 2, encounterId: "enc_2", encounterTitle: "Voodoo Doll" },
        ],
      }),
      null,
    );

    expect(progress).toEqual({
      current: 2,
      target: 5,
      complete: false,
    });
  });
});
