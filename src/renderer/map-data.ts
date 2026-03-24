import type { Locale } from "../i18n";
import type { SceneId } from "../engine/types";
import type { GeneratedMap } from "./map-generator";

export type TerrainType = "deep" | "water" | "shallow" | "land" | "port" | "reef" | "cave" | "wreck";

export interface MapCell {
  terrain: TerrainType;
  name?: Record<Locale, string>;
  icon?: string; // emoji for named locations
  locationType?: string; // location category for sprite mapping (port, settlement, etc.)
}

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

// ── Active map state (set when game starts) ──

let activeMap: GeneratedMap | null = null;

export function setActiveMap(map: GeneratedMap) {
  activeMap = map;
}

export function getActiveMap(): GeneratedMap | null {
  return activeMap;
}

// ── Accessors that work with active generated map ──

export function getMapWidth(): number {
  return activeMap?.width ?? 16;
}

export function getMapHeight(): number {
  return activeMap?.height ?? 10;
}

export function getMapCells(): MapCell[][] {
  return activeMap?.cells ?? [];
}

export function getStartPos(): [number, number] {
  return activeMap?.startPos ?? [0, 4];
}

export function getRoutes(): Record<string, string[]> {
  return activeMap?.routes ?? {};
}

// Get connected destinations from current location
export function getConnectedLocations(pos: [number, number]): Array<{
  pos: [number, number];
  name: Record<Locale, string>;
  icon: string;
  terrain: TerrainType;
}> {
  const routes = getRoutes();
  const cells = getMapCells();
  const key = `${pos[0]},${pos[1]}`;
  const edges = routes[key];
  if (!edges) return [];

  return edges
    .map(k => {
      const [x, y] = k.split(",").map(Number);
      const cell = cells[y]?.[x];
      if (!cell?.name) return null;
      return {
        pos: [x, y] as [number, number],
        name: cell.name,
        icon: cell.icon ?? "📍",
        terrain: cell.terrain,
      };
    })
    .filter((v): v is NonNullable<typeof v> => v !== null);
}

const ROUTE_DIRECTIONS: Array<[number, number]> = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],            [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

const ROUTE_TERRAIN_COST: Record<TerrainType, number> = {
  deep: 1,
  water: 1,
  shallow: 1.25,
  port: 1,
  reef: 3,
  cave: 5,
  wreck: 2.5,
  land: 50,
};

function posKey(x: number, y: number): string {
  return `${x},${y}`;
}

function parsePos(key: string): [number, number] {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function heuristic(from: [number, number], to: [number, number]): number {
  return Math.max(Math.abs(to[0] - from[0]), Math.abs(to[1] - from[1]));
}

// Compute a terrain-aware route between two connected locations.
export function computeRoute(from: [number, number], to: [number, number]): [number, number][] {
  const fromKey = posKey(from[0], from[1]);
  const toKey = posKey(to[0], to[1]);
  if (fromKey === toKey) return [];

  const routes = getRoutes();
  const neighbors = routes[fromKey];
  if (neighbors && !neighbors.includes(toKey)) {
    return [];
  }

  const cells = getMapCells();
  const open = new Set<string>([fromKey]);
  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>([[fromKey, 0]]);
  const fScore = new Map<string, number>([[fromKey, heuristic(from, to)]]);

  while (open.size > 0) {
    let currentKey: string | null = null;
    let currentScore = Infinity;

    for (const key of open) {
      const score = fScore.get(key) ?? Infinity;
      if (score < currentScore) {
        currentScore = score;
        currentKey = key;
      }
    }

    if (!currentKey) break;
    if (currentKey === toKey) {
      const route: [number, number][] = [];
      let stepKey: string | undefined = currentKey;
      while (stepKey && stepKey !== fromKey) {
        route.push(parsePos(stepKey));
        stepKey = cameFrom.get(stepKey);
      }
      route.reverse();
      return route;
    }

    open.delete(currentKey);
    const [cx, cy] = parsePos(currentKey);

    for (const [dx, dy] of ROUTE_DIRECTIONS) {
      const nx = cx + dx;
      const ny = cy + dy;
      const cell = cells[ny]?.[nx];
      if (!cell) continue;

      const neighborKey = posKey(nx, ny);
      const terrainCost = ROUTE_TERRAIN_COST[cell.terrain];
      const moveCost = dx !== 0 && dy !== 0 ? 1.4 : 1;
      const tentativeG = (gScore.get(currentKey) ?? Infinity) + terrainCost * moveCost;

      if (tentativeG >= (gScore.get(neighborKey) ?? Infinity)) continue;

      cameFrom.set(neighborKey, currentKey);
      gScore.set(neighborKey, tentativeG);
      fScore.set(neighborKey, tentativeG + heuristic([nx, ny], to));
      open.add(neighborKey);
    }
  }

  return [];
}

// Find cells matching a terrain type near a position
export function findNearestCell(
  fromX: number,
  fromY: number,
  terrain: TerrainType | TerrainType[],
  maxDist = 5,
): [number, number] | null {
  const cells = getMapCells();
  const W = getMapWidth();
  const H = getMapHeight();
  const types = Array.isArray(terrain) ? terrain : [terrain];
  let best: [number, number] | null = null;
  let bestDist = Infinity;

  for (let dy = -maxDist; dy <= maxDist; dy++) {
    for (let dx = -maxDist; dx <= maxDist; dx++) {
      const nx = fromX + dx;
      const ny = fromY + dy;
      if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
      const cell = cells[ny]?.[nx];
      if (cell && types.includes(cell.terrain)) {
        const d = Math.abs(dx) + Math.abs(dy);
        if (d < bestDist && d > 0) {
          bestDist = d;
          best = [nx, ny];
        }
      }
    }
  }
  return best;
}

// Map SceneId to terrain types for auto-positioning
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
