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

// Route graph: edges between named locations (bidirectional)
export const ROUTES: Record<string, string[]> = {
  "0,4":  ["4,1", "6,6"],          // Tortuga -> Havana, Shadow Cave
  "4,1":  ["0,4", "14,2", "8,3"],  // Havana -> Tortuga, Nassau, Mary's Wreck
  "14,2": ["4,1", "10,6", "13,8"], // Nassau -> Havana, Port Royal, Coral Reefs
  "10,6": ["14,2", "5,8", "6,6"],  // Port Royal -> Nassau, Cartagena, Shadow Cave
  "5,8":  ["10,6", "0,4", "6,6"],  // Cartagena -> Port Royal, Tortuga, Shadow Cave
  "6,6":  ["0,4", "10,6", "5,8", "8,3"], // Shadow Cave -> Tortuga, Port Royal, Cartagena, Mary's Wreck
  "8,3":  ["4,1", "6,6", "7,2"],   // Mary's Wreck -> Havana, Shadow Cave, Blood Reefs
  "7,2":  ["8,3", "14,2"],         // Blood Reefs -> Mary's Wreck, Nassau
  "13,8": ["14,2", "10,6"],        // Coral Reefs -> Nassau, Port Royal
};

// Get connected destinations from current location
export function getConnectedLocations(pos: [number, number]): Array<{
  pos: [number, number];
  name: Record<Locale, string>;
  icon: string;
  terrain: TerrainType;
}> {
  const key = `${pos[0]},${pos[1]}`;
  const edges = ROUTES[key];
  if (!edges) return [];

  return edges
    .map(k => {
      const [x, y] = k.split(",").map(Number);
      const loc = LOCATIONS[k];
      if (!loc) return null;
      return {
        pos: [x, y] as [number, number],
        name: loc.name,
        icon: loc.icon,
        terrain: MAP_CELLS[y][x].terrain,
      };
    })
    .filter((v): v is NonNullable<typeof v> => v !== null);
}

// Compute intermediate cells along a straight line between two points
export function computeRoute(from: [number, number], to: [number, number]): [number, number][] {
  const steps: [number, number][] = [];
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const dist = Math.max(Math.abs(dx), Math.abs(dy));
  if (dist === 0) return [to];

  for (let i = 1; i <= dist; i++) {
    const t = i / dist;
    steps.push([
      Math.round(from[0] + dx * t),
      Math.round(from[1] + dy * t),
    ]);
  }
  return steps;
}

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
