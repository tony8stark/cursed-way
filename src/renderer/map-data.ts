import type { Locale } from "../i18n";

export type TerrainType = "deep" | "water" | "shallow" | "land" | "port" | "reef" | "cave" | "wreck";

export interface MapCell {
  terrain: TerrainType;
  name?: Record<Locale, string>;
  icon?: string; // emoji for named locations
}

// Terrain legend for the grid string:
// ~ = deep water, . = water, , = shallow, # = land, P = port, R = reef, C = cave, W = wreck
const TERRAIN_MAP: Record<string, TerrainType> = {
  "~": "deep",
  ".": "water",
  ",": "shallow",
  "#": "land",
  P: "port",
  R: "reef",
  C: "cave",
  W: "wreck",
};

// 16x10 Caribbean grid
const MAP_GRID = [
  "~~..~~..~~....~~",
  "~...P.....##..~~",
  "...,,...R..##.P.~",
  "..,##,.......,..~",
  "P.,##,...W.....,..",
  "..,,,...........~",
  "~.....C...P..,.~",
  "~~.......,##,...~",
  "~~~..P..,###.R.~~",
  "~~~~......,,...~~",
];

// Named locations keyed by "x,y"
const LOCATIONS: Record<string, { name: Record<Locale, string>; icon: string }> = {
  "4,1": { name: { uk: "Гавана", en: "Havana" }, icon: "🏛️" },
  "14,2": { name: { uk: "Нассау", en: "Nassau" }, icon: "🏴" },
  "0,4": { name: { uk: "Тортуга", en: "Tortuga" }, icon: "🍺" },
  "10,6": { name: { uk: "Порт-Роял", en: "Port Royal" }, icon: "⚓" },
  "5,8": { name: { uk: "Картахена", en: "Cartagena" }, icon: "🏰" },
  "6,6": { name: { uk: "Печера Тіней", en: "Shadow Cave" }, icon: "🕳️" },
  "8,3": { name: { uk: "Уламки Марії", en: "Mary's Wreck" }, icon: "💀" },
  "7,2": { name: { uk: "Рифи Крові", en: "Blood Reefs" }, icon: "🩸" },
  "13,8": { name: { uk: "Коралові Рифи", en: "Coral Reefs" }, icon: "🪸" },
};

// Parse the grid into MapCell[][]
function parseGrid(): MapCell[][] {
  return MAP_GRID.map((row, y) =>
    row.split("").map((ch, x) => {
      const terrain = TERRAIN_MAP[ch] ?? "water";
      const loc = LOCATIONS[`${x},${y}`];
      return {
        terrain,
        name: loc?.name,
        icon: loc?.icon,
      };
    })
  );
}

export const MAP_CELLS = parseGrid();
export const MAP_W = 16;
export const MAP_H = 10;

// Terrain colors for map rendering
export const TERRAIN_COLORS: Record<TerrainType, string> = {
  deep: "#060a1a",
  water: "#0a1a3e",
  shallow: "#1a3a5e",
  land: "#3a6030",
  port: "#4a3a2a",
  reef: "#2a4a4a",
  cave: "#1a1018",
  wreck: "#2a1a1a",
};

// Starting position
export const START_POS: [number, number] = [0, 4]; // Tortuga

// Find cells matching a terrain type near a position
export function findNearestCell(
  fromX: number,
  fromY: number,
  terrain: TerrainType | TerrainType[],
  maxDist = 5,
): [number, number] | null {
  const types = Array.isArray(terrain) ? terrain : [terrain];
  let best: [number, number] | null = null;
  let bestDist = Infinity;

  for (let dy = -maxDist; dy <= maxDist; dy++) {
    for (let dx = -maxDist; dx <= maxDist; dx++) {
      const nx = fromX + dx;
      const ny = fromY + dy;
      if (nx < 0 || nx >= MAP_W || ny < 0 || ny >= MAP_H) continue;
      const cell = MAP_CELLS[ny][nx];
      if (types.includes(cell.terrain)) {
        const dist = Math.abs(dx) + Math.abs(dy);
        if (dist < bestDist && dist > 0) {
          bestDist = dist;
          best = [nx, ny];
        }
      }
    }
  }
  return best;
}

// Map SceneId to terrain types for auto-positioning
import type { SceneId } from "../engine/types";

export function getTerrainForScene(scene: SceneId): TerrainType[] {
  switch (scene) {
    case "port": return ["port"];
    case "island": return ["land", "shallow"];
    case "cave": return ["cave"];
    case "underwater": return ["reef", "deep"];
    case "kraken": return ["deep"];
    case "storm": return ["water", "deep"];
    case "combat": return ["water"];
    case "ethereal": return ["deep", "water"];
    case "open_sea":
    default: return ["water", "shallow"];
  }
}
