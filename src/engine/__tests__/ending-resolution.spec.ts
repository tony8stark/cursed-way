import { describe, expect, it } from "vitest";
import type { Ending, GameState } from "../types";
import { resolveEndingId, shouldUseObjectiveSystem } from "../ending-resolution";
import { endingsEn } from "../../quests/cursed-galleon/endings-en";

function createState(overrides: Partial<GameState> = {}): GameState {
  return {
    gold: 0,
    crew: 8,
    karma: 0,
    curse: 0,
    day: 20,
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

function getEndingText(id: string, state: GameState): string {
  const ending = endingsEn.find((entry) => entry.id === id) as Ending | undefined;
  if (!ending) throw new Error(`Missing ending ${id}`);
  return typeof ending.text === "function" ? ending.text(state) : ending.text;
}

describe("ending resolution", () => {
  it("prefers the objective ending when objective_complete is set", () => {
    const state = {
      karma: 10,
      flags: new Set(["objective_complete"]),
    };

    const endingId = resolveEndingId(
      [
        { id: "legend", req: (s) => s.karma >= 8 },
        { id: "objective_complete", req: (s) => s.flags.has("objective_complete") },
      ],
      state,
    );

    expect(endingId).toBe("objective_complete");
  });

  it("disables objective flow in expedition mode", () => {
    expect(shouldUseObjectiveSystem("expedition", "redeemer")).toBe(false);
  });

  it("keeps objective flow enabled in free roam when an objective is selected", () => {
    expect(shouldUseObjectiveSystem("free_roam", "redeemer")).toBe(true);
  });

  it("changes the king ending text based on dominant faction alignment", () => {
    const guildText = getEndingText("king", createState({
      gold: 240,
      factionReps: { crown: 1, brethren: 0, guild: 7 },
    }));
    const brethrenText = getEndingText("king", createState({
      gold: 240,
      factionReps: { crown: -2, brethren: 7, guild: 0 },
    }));

    expect(guildText).toContain("Guild");
    expect(brethrenText).toContain("Brethren");
    expect(guildText).not.toBe(brethrenText);
  });

  it("changes the legend ending text based on relationship outcomes", () => {
    const vegaText = getEndingText("legend", createState({
      karma: 9,
      flags: new Set(["vega_love"]),
    }));
    const kojoText = getEndingText("legend", createState({
      karma: 9,
      flags: new Set(["kojo_loyal"]),
    }));

    expect(vegaText).toContain("Vega");
    expect(kojoText).toMatch(/Kojo|Ashanti/);
    expect(vegaText).not.toBe(kojoText);
  });

  it("changes the survivor ending text when a legendary quest outcome defines the voyage", () => {
    const dutchmanText = getEndingText("survivor", createState({
      flags: new Set(["lq_dutchman_freed"]),
    }));

    expect(dutchmanText).toMatch(/Dutchman|ghost/i);
  });
});
