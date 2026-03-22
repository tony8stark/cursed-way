import type { TerrainType, MapCell } from "./map-data";
import {
  type LocationTemplate,
  PORT_POOL,
  SETTLEMENT_POOL,
  INHABITED_ISLAND_POOL,
  WILD_ISLAND_POOL,
  PHANTOM_ISLAND_POOL,
  UNDERWATER_POOL,
  CAVE_POOL,
  WRECK_POOL,
  MYSTERIOUS_POOL,
  REEF_POOL,
  LANDMARK_POOL,
} from "./location-pools";

export type { LocationTemplate };

// ── Seeded random ──

class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = seed;
  }

  /** Returns 0..1 */
  next(): number {
    this.state = (this.state * 1664525 + 1013904223) & 0xffffffff;
    return (this.state >>> 0) / 0xffffffff;
  }

  /** Returns min..max inclusive (integer) */
  int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  /** Shuffle array in place */
  shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /** Pick N items from array using weights */
  weightedPick<T extends { weight: number }>(pool: T[], n: number): T[] {
    const available = [...pool];
    const result: T[] = [];
    for (let i = 0; i < n && available.length > 0; i++) {
      const totalWeight = available.reduce((s, item) => s + item.weight, 0);
      let roll = this.next() * totalWeight;
      let idx = 0;
      for (let j = 0; j < available.length; j++) {
        roll -= available[j].weight;
        if (roll <= 0) { idx = j; break; }
      }
      result.push(available[idx]);
      available.splice(idx, 1);
    }
    return result;
  }
}

// ── Map generation ──

export const GEN_MAP_W = 80;
export const GEN_MAP_H = 50;

export interface PlacedLocation {
  x: number;
  y: number;
  template: LocationTemplate;
}

export interface GeneratedMap {
  seed: number;
  cells: MapCell[][];
  width: number;
  height: number;
  locations: PlacedLocation[];
  routes: Record<string, string[]>;
  startPos: [number, number];
}

/** Distance between two points */
function dist(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/** Check minimum distance from existing locations */
function isFarEnough(x: number, y: number, placed: PlacedLocation[], minDist: number): boolean {
  return placed.every(p => dist(x, y, p.x, p.y) >= minDist);
}

/** Generate island clusters on the grid */
function generateTerrain(cells: MapCell[][], rng: SeededRandom): void {
  const W = GEN_MAP_W;
  const H = GEN_MAP_H;

  // Start with all deep water
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      cells[y][x] = { terrain: rng.next() < 0.35 ? "water" : "deep" };
    }
  }

  // Place 30-50 island seeds for the large map
  const numIslands = rng.int(30, 50);
  const seeds: [number, number, number][] = []; // x, y, size

  for (let i = 0; i < numIslands; i++) {
    // Keep islands away from edges
    const x = rng.int(3, W - 4);
    const y = rng.int(3, H - 4);
    const size = rng.int(1, 4);
    seeds.push([x, y, size]);
  }

  // Grow islands from seeds
  for (const [sx, sy, size] of seeds) {
    for (let dy = -size; dy <= size; dy++) {
      for (let dx = -size; dx <= size; dx++) {
        const nx = sx + dx;
        const ny = sy + dy;
        if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
        const d = Math.abs(dx) + Math.abs(dy);
        if (d <= size) {
          cells[ny][nx] = { terrain: "land" };
        } else if (d <= size + 1 && rng.next() < 0.6) {
          cells[ny][nx] = { terrain: "shallow" };
        }
      }
    }
  }

  // Add shallow water borders around land
  const landSnapshot: boolean[][] = [];
  for (let y = 0; y < H; y++) {
    landSnapshot.push([]);
    for (let x = 0; x < W; x++) {
      landSnapshot[y].push(cells[y][x].terrain === "land");
    }
  }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (cells[y][x].terrain !== "deep" && cells[y][x].terrain !== "water") continue;
      const hasLandNeighbor = [[-1, 0], [1, 0], [0, -1], [0, 1]].some(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        return nx >= 0 && nx < W && ny >= 0 && ny < H && landSnapshot[ny][nx];
      });
      if (hasLandNeighbor) {
        cells[y][x] = { terrain: "shallow" };
      }
    }
  }

  // Add water between deep edges
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (cells[y][x].terrain !== "deep") continue;
      const hasShallowNeighbor = [[-1, 0], [1, 0], [0, -1], [0, 1]].some(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        return nx >= 0 && nx < W && ny >= 0 && ny < H && cells[ny][nx].terrain === "shallow";
      });
      if (hasShallowNeighbor && rng.next() < 0.5) {
        cells[y][x] = { terrain: "water" };
      }
    }
  }

  // Scatter some reefs in shallow/water areas
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (cells[y][x].terrain === "water" && rng.next() < 0.03) {
        cells[y][x] = { terrain: "reef" };
      }
    }
  }

  // Ensure edges are deep water for nice borders
  for (let x = 0; x < W; x++) {
    cells[0][x] = { terrain: "deep" };
    cells[H - 1][x] = { terrain: "deep" };
  }
  for (let y = 0; y < H; y++) {
    cells[y][0] = { terrain: "deep" };
    cells[y][W - 1] = { terrain: "deep" };
  }
}

/** Find a valid position for a location of a given terrain type */
function findPlacementSpot(
  cells: MapCell[][],
  terrain: TerrainType,
  placed: PlacedLocation[],
  rng: SeededRandom,
  minDist: number,
): [number, number] | null {
  const W = GEN_MAP_W;
  const H = GEN_MAP_H;

  // For ports: find land cells adjacent to water
  if (terrain === "port") {
    const candidates: [number, number][] = [];
    for (let y = 2; y < H - 2; y++) {
      for (let x = 2; x < W - 2; x++) {
        if (cells[y][x].terrain !== "land" && cells[y][x].terrain !== "shallow") continue;
        // Must have water neighbor
        const hasWater = [[-1, 0], [1, 0], [0, -1], [0, 1]].some(([dx, dy]) => {
          const t = cells[y + dy][x + dx].terrain;
          return t === "water" || t === "deep" || t === "shallow";
        });
        if (hasWater && isFarEnough(x, y, placed, minDist)) {
          candidates.push([x, y]);
        }
      }
    }
    if (candidates.length === 0) return null;
    return candidates[rng.int(0, candidates.length - 1)];
  }

  // For caves/wrecks: place in water or on land edges
  if (terrain === "cave" || terrain === "wreck" || terrain === "reef") {
    const validTerrain = terrain === "cave" ? ["land", "shallow"] : ["water", "deep", "shallow"];
    const candidates: [number, number][] = [];
    for (let y = 2; y < H - 2; y++) {
      for (let x = 2; x < W - 2; x++) {
        if (!validTerrain.includes(cells[y][x].terrain)) continue;
        if (isFarEnough(x, y, placed, minDist)) {
          candidates.push([x, y]);
        }
      }
    }
    if (candidates.length === 0) return null;
    return candidates[rng.int(0, candidates.length - 1)];
  }

  // For land/shallow: find existing terrain of that type
  const candidates: [number, number][] = [];
  for (let y = 2; y < H - 2; y++) {
    for (let x = 2; x < W - 2; x++) {
      if (cells[y][x].terrain === terrain || (terrain === "land" && cells[y][x].terrain === "shallow")) {
        if (isFarEnough(x, y, placed, minDist)) {
          candidates.push([x, y]);
        }
      }
    }
  }
  if (candidates.length === 0) return null;
  return candidates[rng.int(0, candidates.length - 1)];
}

/** Build route graph connecting nearby locations */
function buildRoutes(locations: PlacedLocation[]): Record<string, string[]> {
  const routes: Record<string, string[]> = {};

  // Sort locations by x position for natural left-to-right flow
  const sorted = [...locations].sort((a, b) => a.x - b.x);

  for (const loc of sorted) {
    const key = `${loc.x},${loc.y}`;
    if (!routes[key]) routes[key] = [];

    // Find 2-4 nearest neighbors
    const others = sorted
      .filter(o => o !== loc)
      .map(o => ({ loc: o, d: dist(loc.x, loc.y, o.x, o.y) }))
      .sort((a, b) => a.d - b.d);

    // Connect to 2-4 nearest (max distance 25 cells for large map)
    const maxConnections = Math.min(4, others.length);
    let connected = 0;
    for (const other of others) {
      if (connected >= maxConnections) break;
      if (other.d > 25) break;
      const otherKey = `${other.loc.x},${other.loc.y}`;
      if (!routes[key].includes(otherKey)) {
        routes[key].push(otherKey);
      }
      // Bidirectional
      if (!routes[otherKey]) routes[otherKey] = [];
      if (!routes[otherKey].includes(key)) {
        routes[otherKey].push(key);
      }
      connected++;
    }
  }

  // Validate connectivity: ensure all locations reachable from first
  const startKey = `${sorted[0].x},${sorted[0].y}`;
  const visited = new Set<string>();
  const queue = [startKey];
  visited.add(startKey);
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const neighbor of routes[current] ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  // Connect unreachable locations to nearest reachable one
  for (const loc of sorted) {
    const key = `${loc.x},${loc.y}`;
    if (visited.has(key)) continue;

    // Find nearest visited location
    let nearest: PlacedLocation | null = null;
    let nearestDist = Infinity;
    for (const other of sorted) {
      const otherKey = `${other.x},${other.y}`;
      if (!visited.has(otherKey)) continue;
      const d = dist(loc.x, loc.y, other.x, other.y);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = other;
      }
    }

    if (nearest) {
      const nearestKey = `${nearest.x},${nearest.y}`;
      if (!routes[key]) routes[key] = [];
      routes[key].push(nearestKey);
      routes[nearestKey].push(key);
      visited.add(key);
      queue.push(key);
    }
  }

  return routes;
}

/** Generate a complete map from a seed */
export function generateMap(seed?: number): GeneratedMap {
  const actualSeed = seed ?? Math.floor(Math.random() * 999999);
  const rng = new SeededRandom(actualSeed);

  const W = GEN_MAP_W;
  const H = GEN_MAP_H;

  // Initialize empty grid
  const cells: MapCell[][] = [];
  for (let y = 0; y < H; y++) {
    cells.push(new Array(W).fill(null).map(() => ({ terrain: "deep" as TerrainType })));
  }

  // Generate terrain
  generateTerrain(cells, rng);

  // Pick locations from pools (generous mix for 80x50 map)
  const pickedPorts = rng.weightedPick(PORT_POOL, rng.int(12, 18));
  const pickedSettlements = rng.weightedPick(SETTLEMENT_POOL, rng.int(5, 8));
  const pickedInhabited = rng.weightedPick(INHABITED_ISLAND_POOL, rng.int(4, 7));
  const pickedWild = rng.weightedPick(WILD_ISLAND_POOL, rng.int(6, 12));
  const pickedPhantom = rng.weightedPick(PHANTOM_ISLAND_POOL, rng.int(3, 6));
  const pickedUnderwater = rng.weightedPick(UNDERWATER_POOL, rng.int(4, 8));
  const pickedCaves = rng.weightedPick(CAVE_POOL, rng.int(3, 6));
  const pickedWrecks = rng.weightedPick(WRECK_POOL, rng.int(4, 8));
  const pickedMysterious = rng.weightedPick(MYSTERIOUS_POOL, rng.int(3, 6));
  const pickedReefs = rng.weightedPick(REEF_POOL, rng.int(3, 5));
  const pickedLandmarks = rng.weightedPick(LANDMARK_POOL, rng.int(3, 5));

  const allPicked = [
    ...pickedPorts, ...pickedSettlements, ...pickedInhabited,
    ...pickedWild, ...pickedPhantom, ...pickedUnderwater,
    ...pickedCaves, ...pickedWrecks, ...pickedMysterious,
    ...pickedReefs, ...pickedLandmarks,
  ];

  // Place locations on map
  const placed: PlacedLocation[] = [];
  const MIN_LOCATION_DIST = 4;

  for (const template of allPicked) {
    const spot = findPlacementSpot(cells, template.terrain, placed, rng, MIN_LOCATION_DIST);
    if (!spot) continue;

    const [x, y] = spot;
    // Set terrain at location
    cells[y][x] = {
      terrain: template.terrain,
      name: template.name,
      icon: template.icon,
    };

    placed.push({ x, y, template });
  }

  // Build routes
  const routes = buildRoutes(placed);

  // Pick start position (prefer ports, specifically Tortuga if it was placed)
  const tortuga = placed.find(p => p.template.name.en === "Tortuga");
  const anyPort = placed.find(p => p.template.terrain === "port");
  const startLoc = tortuga ?? anyPort ?? placed[0];
  const startPos: [number, number] = [startLoc.x, startLoc.y];

  return {
    seed: actualSeed,
    cells,
    width: W,
    height: H,
    locations: placed,
    routes,
    startPos,
  };
}
