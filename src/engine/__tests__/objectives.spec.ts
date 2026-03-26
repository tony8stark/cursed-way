import { describe, expect, it } from "vitest";
import type { MapState } from "../../renderer/world-map";
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

function createMapState(revealedCount: number, total = 100): MapState {
  const side = Math.sqrt(total);
  const revealed = Array.from({ length: side }, (_, y) =>
    Array.from({ length: side }, (_, x) => y * side + x < revealedCount),
  );

  return {
    playerPos: [0, 0],
    revealed,
    targetPos: null,
    animProgress: 0,
    currentRoute: null,
    routeProgress: 0,
    destination: null,
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

    expect(progress).toMatchObject({
      current: 2,
      target: 5,
      complete: false,
    });
  });

  it("requires a full cleanse after the curse breaker peak", () => {
    const objective = getObjective("curse_breaker");

    expect(objective?.check(createState({ curse: 7 }), null)).toMatchObject({
      current: 7,
      target: 8,
      complete: false,
    });

    expect(
      objective?.check(createState({ curse: 0, flags: new Set(["curse_peaked_8"]) }), null),
    ).toMatchObject({
      current: 8,
      target: 8,
      complete: true,
    });
  });

  it("makes explorer depend on breadth plus crew stability", () => {
    const objective = getObjective("explorer");
    const visited = new Set(["a", "b", "c", "d", "e", "f", "g", "h"]);

    expect(objective?.check(createState({ visitedLocations: visited, crew: 5 }), null)).toMatchObject({
      current: 8,
      target: 8,
      complete: false,
    });

    expect(objective?.check(createState({ visitedLocations: visited, crew: 6 }), null)).toMatchObject({
      current: 8,
      target: 8,
      complete: true,
    });
  });

  it("makes trade baron depend on both wealth and guild standing", () => {
    const objective = getObjective("trade_baron");

    expect(
      objective?.check(createState({ gold: 220, factionReps: { crown: 0, brethren: 0, guild: 5 } }), null),
    ).toMatchObject({
      current: 220,
      target: 220,
      complete: false,
    });

    expect(
      objective?.check(createState({ gold: 220, factionReps: { crown: 0, brethren: 0, guild: 6 } }), null),
    ).toMatchObject({
      current: 220,
      target: 220,
      complete: true,
    });
  });

  it("makes redeemer require both high karma and low curse", () => {
    const objective = getObjective("redeemer");

    expect(objective?.check(createState({ karma: 8, curse: 4 }), null)).toMatchObject({
      current: 8,
      target: 8,
      complete: false,
    });

    expect(objective?.check(createState({ karma: 8, curse: 3 }), null)).toMatchObject({
      current: 8,
      target: 8,
      complete: true,
    });
  });

  it("makes cartographer require map knowledge under control", () => {
    const objective = getObjective("cartographer");
    const mapState = createMapState(45);

    expect(objective?.check(createState({ curse: 7 }), mapState)).toMatchObject({
      current: 45,
      target: 45,
      complete: false,
    });

    expect(objective?.check(createState({ curse: 6 }), mapState)).toMatchObject({
      current: 45,
      target: 45,
      complete: true,
    });
  });
});
