import { afterEach, describe, expect, it } from "vitest";
import type { GeneratedMap } from "../map-generator";
import type { MapCell } from "../map-data";
import { computeRoute, getMapCells, setActiveMap } from "../map-data";

function createTestMap(): GeneratedMap {
  const width = 5;
  const height = 5;
  const cells: MapCell[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({ terrain: "water" })),
  );

  cells[2][0] = { terrain: "port", name: { uk: "Початок", en: "Start" } };
  cells[2][4] = { terrain: "port", name: { uk: "Фініш", en: "Finish" } };
  cells[2][1] = { terrain: "land" };
  cells[2][2] = { terrain: "land" };
  cells[2][3] = { terrain: "land" };

  return {
    seed: 1,
    cells,
    width,
    height,
    locations: [],
    routes: {
      "0,2": ["4,2"],
      "4,2": ["0,2"],
    },
    startPos: [0, 2],
  };
}

describe("map routes", () => {
  afterEach(() => {
    setActiveMap(createTestMap());
  });

  it("routes around land instead of cutting straight through it", () => {
    setActiveMap(createTestMap());

    const route = computeRoute([0, 2], [4, 2]);
    const cells = getMapCells();

    expect(route).toHaveLength(4);
    expect(route.some(([x, y]) => cells[y][x].terrain === "land")).toBe(false);
    expect(route).not.toEqual([[1, 2], [2, 2], [3, 2], [4, 2]]);
    expect(route.at(-1)).toEqual([4, 2]);
  });
});
