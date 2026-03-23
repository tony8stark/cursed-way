import { getMapCells, getMapWidth, getMapHeight, getRoutes, TERRAIN_COLORS } from "./map-data";
import type { Locale } from "../i18n";
import type { MapCell } from "./map-data";
import type { TerrainType } from "./map-data";

// ── Sprite preloading ──

const spriteCache = new Map<string, HTMLImageElement>();
const spriteLoading = new Set<string>();

function getSprite(path: string): HTMLImageElement | null {
  const cached = spriteCache.get(path);
  if (cached?.complete && cached.naturalWidth > 0) return cached;
  if (spriteLoading.has(path)) return null;
  spriteLoading.add(path);
  const img = new Image();
  img.src = path;
  img.onload = () => spriteCache.set(path, img);
  spriteCache.set(path, img);
  return null;
}

// Preload key sprites on import
const SHIP_SPRITE = "/icons/map/sailboat.png";
const SHIP_WRECK_SPRITE = "/icons/map/shipwreck_1.png";
const PALM_SPRITE = "/icons/map/palm_tree.png";

// Location type → sprite mapping
const LOCATION_SPRITES: Record<string, string> = {
  port: "/icons/map/diamond_house.png",
  settlement: "/icons/map/diamond_coin.png",
  island_inhabited: "/icons/map/diamond_cross.png",
  island_wild: "/icons/map/diamond_small.png",
  phantom: "/icons/map/diamond_cross_red.png",
  underwater: "/icons/map/diamond_anchor.png",
  cave: "/icons/map/diamond_sword.png",
  wreck: "/icons/map/diamond_anchor.png",
  mysterious: "/icons/map/diamond_compass.png",
  reef: "/icons/map/diamond_small.png",
  landmark: "/icons/map/diamond_cross.png",
};

// Color variations per terrain type for visual variety
const TERRAIN_VARIANT_COLORS: Partial<Record<TerrainType, string[]>> = {
  deep: ["#060a1a", "#080c1e", "#050916", "#0a0e22"],
  water: ["#0a1a3e", "#0c1e44", "#081636", "#0e2248"],
  shallow: ["#1a3a5e", "#1e4268", "#163252", "#224a6e"],
  land: ["#3a6030", "#2e5428", "#446c38", "#355a2c"],
  port: ["#4a3a2a", "#52422e", "#423226", "#5a4a32"],
  reef: ["#2a4a4a", "#244242", "#305252", "#1e3e3e"],
  cave: ["#1a1018", "#1e1420", "#161014", "#22181c"],
  wreck: ["#2a1a1a", "#2e1e1e", "#261616", "#322222"],
};

/** Simple position-based hash for consistent variant selection */
function cellHash(x: number, y: number): number {
  return ((x * 7 + y * 13 + x * y) & 0x7FFFFFFF);
}

function getTerrainVariantColor(terrain: TerrainType, x: number, y: number): string {
  const variants = TERRAIN_VARIANT_COLORS[terrain];
  if (!variants) return TERRAIN_COLORS[terrain];
  const h = cellHash(x, y);
  return variants[h % variants.length];
}

// Preload all on startup
[SHIP_SPRITE, SHIP_WRECK_SPRITE, PALM_SPRITE,
  ...Object.values(LOCATION_SPRITES),
].forEach(getSprite);

export interface MapState {
  playerPos: [number, number];
  revealed: boolean[][];
  targetPos: [number, number] | null; // for animation
  animProgress: number; // 0..1
  // Route system
  currentRoute: [number, number][] | null;  // cells along current voyage
  routeProgress: number;                     // how many cells traveled on current route
  destination: [number, number] | null;      // where we're heading
}

export function createMapState(startPos: [number, number]): MapState {
  const W = getMapWidth();
  const H = getMapHeight();
  const revealed: boolean[][] = [];
  for (let y = 0; y < H; y++) {
    revealed.push(new Array(W).fill(false));
  }
  const state: MapState = {
    playerPos: startPos,
    revealed,
    targetPos: null,
    animProgress: 0,
    currentRoute: null,
    routeProgress: 0,
    destination: null,
  };
  revealAround(state, startPos[0], startPos[1], 3);
  return state;
}

export function revealAround(map: MapState, cx: number, cy: number, radius: number) {
  const W = getMapWidth();
  const H = getMapHeight();
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
        if (Math.abs(dx) + Math.abs(dy) <= radius) {
          map.revealed[ny][nx] = true;
        }
      }
    }
  }
}

export interface SerializedMapState {
  playerPos: [number, number];
  revealed: boolean[][];
  currentRoute?: [number, number][] | null;
  routeProgress?: number;
  destination?: [number, number] | null;
}

export function serializeMap(map: MapState): SerializedMapState {
  return {
    playerPos: map.playerPos,
    revealed: map.revealed,
    currentRoute: map.currentRoute,
    routeProgress: map.routeProgress,
    destination: map.destination,
  };
}

export function deserializeMap(data: SerializedMapState): MapState {
  return {
    playerPos: data.playerPos,
    revealed: data.revealed,
    targetPos: null,
    animProgress: 0,
    currentRoute: data.currentRoute ?? null,
    routeProgress: data.routeProgress ?? 0,
    destination: data.destination ?? null,
  };
}

// ── Renderer ──

// Cell size for the viewport (larger cells = more detail in local view)
const CELL_W = 14;
const CELL_H = 12;

// Fog colors
const FOG_COLOR = "#08080e";
const FOG_EDGE = "rgba(8,8,14,0.6)";

/** Shared terrain + cell drawing logic */
function drawCells(
  ctx: CanvasRenderingContext2D,
  map: MapState,
  MAP_CELLS: MapCell[][],
  MAP_W: number,
  MAP_H: number,
  ox: number,
  oy: number,
  cellW: number,
  cellH: number,
  frame: number,
  locale: Locale,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  showLabels: boolean,
) {
  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      if (x < 0 || x >= MAP_W || y < 0 || y >= MAP_H) continue;
      const cx = ox + (x - startX) * cellW;
      const cy = oy + (y - startY) * cellH;

      if (!map.revealed[y]?.[x]) {
        const hasRevealedNeighbor = [
          [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
        ].some(([nx, ny]) =>
          nx >= 0 && nx < MAP_W && ny >= 0 && ny < MAP_H && map.revealed[ny]?.[nx]
        );
        if (hasRevealedNeighbor) {
          ctx.fillStyle = FOG_EDGE;
          ctx.fillRect(cx, cy, cellW, cellH);
        }
        continue;
      }

      const cell = MAP_CELLS[y]?.[x];
      if (!cell) continue;
      const baseColor = TERRAIN_COLORS[cell.terrain];

      if (cell.terrain === "water" || cell.terrain === "deep") {
        ctx.fillStyle = baseColor;
        ctx.fillRect(cx, cy, cellW, cellH);
        const shimmer = Math.sin(frame * 0.03 + x * 0.7 + y * 0.5) * 0.08;
        if (shimmer > 0) {
          ctx.fillStyle = `rgba(100,150,220,${shimmer})`;
          ctx.fillRect(cx, cy, cellW, cellH);
        }
      } else {
        // Use color variants for visual variety
        ctx.fillStyle = getTerrainVariantColor(cell.terrain, x, y);
        ctx.fillRect(cx, cy, cellW, cellH);
      }

      if (showLabels) {
        ctx.strokeStyle = "rgba(255,255,255,0.03)";
        ctx.strokeRect(cx, cy, cellW, cellH);
      }

      // Location icons (sprite diamonds or emoji fallback)
      if (cell.icon && cellW >= 10) {
        const locType = cell.locationType;
        const spritePath = locType && LOCATION_SPRITES[locType];
        const locSprite = spritePath ? getSprite(spritePath) : null;
        if (locSprite) {
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(locSprite, cx, cy - 2, cellW, cellW);
          ctx.imageSmoothingEnabled = true;
        } else {
          ctx.font = `${Math.max(8, cellW - 4)}px sans-serif`;
          ctx.fillText(cell.icon, cx + 2, cy + cellH - 2);
        }
      }
    }
  }

  // Labels
  if (showLabels) {
    ctx.font = `bold ${Math.max(5, Math.min(7, cellW - 6))}px 'Press Start 2P', monospace`;
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        if (x < 0 || x >= MAP_W || y < 0 || y >= MAP_H) continue;
        if (!map.revealed[y]?.[x]) continue;
        const cell = MAP_CELLS[y]?.[x];
        if (!cell?.name) continue;
        const label = cell.name[locale];
        const cx = ox + (x - startX) * cellW;
        const cy = oy + (y - startY) * cellH;
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillText(label, cx + cellW + 2, cy + cellH - 2);
        ctx.fillStyle = "#f0c040";
        ctx.fillText(label, cx + cellW + 1, cy + cellH - 3);
      }
    }
  }
}

/** Draw the local viewport (centered on player) */
export function drawWorldMap(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  frame: number,
  map: MapState,
  locale: Locale,
  previewRoute?: [number, number][] | null,
) {
  const MAP_W = getMapWidth();
  const MAP_H = getMapHeight();
  const MAP_CELLS = getMapCells();

  ctx.fillStyle = FOG_COLOR;
  ctx.fillRect(0, 0, W, H);

  // Viewport: how many cells fit on screen
  const viewCols = Math.floor(W / CELL_W);
  const viewRows = Math.floor(H / CELL_H);
  const halfCols = Math.floor(viewCols / 2);
  const halfRows = Math.floor(viewRows / 2);

  // Camera center = player position
  const [px, py] = map.playerPos;
  let camX = px - halfCols;
  let camY = py - halfRows;
  // Clamp camera to map bounds
  camX = Math.max(0, Math.min(camX, MAP_W - viewCols));
  camY = Math.max(0, Math.min(camY, MAP_H - viewRows));

  const endX = Math.min(camX + viewCols + 1, MAP_W);
  const endY = Math.min(camY + viewRows + 1, MAP_H);

  // Offset to center viewport on canvas
  const ox = Math.floor((W - viewCols * CELL_W) / 2);
  const oy = Math.floor((H - viewRows * CELL_H) / 2);

  drawCells(ctx, map, MAP_CELLS, MAP_W, MAP_H, ox, oy, CELL_W, CELL_H, frame, locale, camX, camY, endX, endY, true);

  // Draw preview route (hover over destination button)
  if (previewRoute && previewRoute.length > 0) {
    ctx.strokeStyle = "rgba(64,192,240,0.35)";
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    const sX = ox + (px - camX) * CELL_W + CELL_W / 2;
    const sY = oy + (py - camY) * CELL_H + CELL_H / 2;
    ctx.moveTo(sX, sY);

    for (const [rx, ry] of previewRoute) {
      ctx.lineTo(ox + (rx - camX) * CELL_W + CELL_W / 2, oy + (ry - camY) * CELL_H + CELL_H / 2);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Preview destination marker (pulsing cyan diamond)
    const lastPt = previewRoute[previewRoute.length - 1];
    const pdx = ox + (lastPt[0] - camX) * CELL_W + CELL_W / 2;
    const pdy = oy + (lastPt[1] - camY) * CELL_H + CELL_H / 2;
    const pdp = 1 + Math.sin(frame * 0.08) * 0.3;
    ctx.fillStyle = "rgba(64,192,240,0.4)";
    ctx.beginPath();
    ctx.moveTo(pdx, pdy - 5 * pdp);
    ctx.lineTo(pdx + 4 * pdp, pdy);
    ctx.lineTo(pdx, pdy + 5 * pdp);
    ctx.lineTo(pdx - 4 * pdp, pdy);
    ctx.closePath();
    ctx.fill();
  }

  // Draw planned route
  if (map.currentRoute && map.destination) {
    ctx.strokeStyle = "rgba(240,192,64,0.3)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    const sX = ox + (px - camX) * CELL_W + CELL_W / 2;
    const sY = oy + (py - camY) * CELL_H + CELL_H / 2;
    ctx.moveTo(sX, sY);

    for (const [rx, ry] of map.currentRoute.slice(map.routeProgress)) {
      ctx.lineTo(ox + (rx - camX) * CELL_W + CELL_W / 2, oy + (ry - camY) * CELL_H + CELL_H / 2);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Destination marker
    const [dx, dy] = map.destination;
    const destX = ox + (dx - camX) * CELL_W + CELL_W / 2;
    const destY = oy + (dy - camY) * CELL_H + CELL_H / 2;
    const dp = 1 + Math.sin(frame * 0.06) * 0.3;
    ctx.fillStyle = "rgba(240,192,64,0.5)";
    ctx.beginPath();
    ctx.moveTo(destX, destY - 5 * dp);
    ctx.lineTo(destX + 4 * dp, destY);
    ctx.lineTo(destX, destY + 5 * dp);
    ctx.lineTo(destX - 4 * dp, destY);
    ctx.closePath();
    ctx.fill();
  }

  // Player ship
  let drawX = ox + (px - camX) * CELL_W + CELL_W / 2;
  let drawY = oy + (py - camY) * CELL_H + CELL_H / 2;

  if (map.targetPos && map.animProgress < 1) {
    const [tx, ty] = map.targetPos;
    const targetX = ox + (tx - camX) * CELL_W + CELL_W / 2;
    const targetY = oy + (ty - camY) * CELL_H + CELL_H / 2;
    const startDrawX = ox + (px - camX) * CELL_W + CELL_W / 2;
    const startDrawY = oy + (py - camY) * CELL_H + CELL_H / 2;
    const t = easeInOut(map.animProgress);
    drawX = startDrawX + (targetX - startDrawX) * t;
    drawY = startDrawY + (targetY - startDrawY) * t;
  }

  // Player ship sprite (with glow)
  const shipSprite = getSprite(SHIP_SPRITE);
  const pulse = 1 + Math.sin(frame * 0.08) * 0.15;

  // Glow behind ship
  ctx.fillStyle = "rgba(240,192,64,0.25)";
  ctx.beginPath();
  ctx.arc(drawX, drawY, 8 * pulse, 0, Math.PI * 2);
  ctx.fill();

  if (shipSprite) {
    const sprW = 14 * pulse;
    const sprH = 14 * pulse;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(shipSprite, drawX - sprW / 2, drawY - sprH / 2, sprW, sprH);
    ctx.imageSmoothingEnabled = true;
  } else {
    // Fallback: old circle + triangle
    ctx.fillStyle = "#f0c040";
    ctx.beginPath();
    ctx.arc(drawX, drawY, 5 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0a0a1a";
    ctx.beginPath();
    ctx.moveTo(drawX, drawY - 3);
    ctx.lineTo(drawX - 2, drawY + 2);
    ctx.lineTo(drawX + 2, drawY + 2);
    ctx.closePath();
    ctx.fill();
  }

  // Compass rose
  drawCompass(ctx, W - 18, 18, frame);
}

/** Draw the full world map (for the overlay modal) */
export function drawFullWorldMap(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  frame: number,
  map: MapState,
  locale: Locale,
) {
  const MAP_W = getMapWidth();
  const MAP_H = getMapHeight();
  const MAP_CELLS = getMapCells();

  ctx.fillStyle = FOG_COLOR;
  ctx.fillRect(0, 0, W, H);

  // Fit the entire map into the canvas
  const cellW = Math.floor(W / MAP_W);
  const cellH = Math.floor(H / MAP_H);
  const cellSize = Math.max(3, Math.min(cellW, cellH));
  const gridW = MAP_W * cellSize;
  const gridH = MAP_H * cellSize;
  const ox = Math.floor((W - gridW) / 2);
  const oy = Math.floor((H - gridH) / 2);

  // Draw all cells
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      const cx = ox + x * cellSize;
      const cy = oy + y * cellSize;

      if (!map.revealed[y]?.[x]) {
        const hasRevealedNeighbor = [
          [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
        ].some(([nx, ny]) =>
          nx >= 0 && nx < MAP_W && ny >= 0 && ny < MAP_H && map.revealed[ny]?.[nx]
        );
        if (hasRevealedNeighbor) {
          ctx.fillStyle = "rgba(20,20,30,0.8)";
          ctx.fillRect(cx, cy, cellSize, cellSize);
        }
        continue;
      }

      const cell = MAP_CELLS[y]?.[x];
      if (!cell) continue;
      ctx.fillStyle = getTerrainVariantColor(cell.terrain, x, y);
      ctx.fillRect(cx, cy, cellSize, cellSize);

      // Shimmer on water
      if (cell.terrain === "water" || cell.terrain === "deep" || cell.terrain === "shallow") {
        const shimmer = Math.sin(frame * 0.03 + x * 0.7 + y * 0.5) * 0.06;
        if (shimmer > 0) {
          ctx.fillStyle = `rgba(100,150,220,${shimmer})`;
          ctx.fillRect(cx, cy, cellSize, cellSize);
        }
      }

      // Location dot
      if (cell.name) {
        ctx.fillStyle = "#f0c040";
        const dotR = Math.max(1.5, cellSize / 3);
        ctx.beginPath();
        ctx.arc(cx + cellSize / 2, cy + cellSize / 2, dotR, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Location labels (only if cells large enough)
  if (cellSize >= 5) {
    ctx.font = `bold ${Math.max(4, cellSize - 2)}px 'Press Start 2P', monospace`;
    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        if (!map.revealed[y]?.[x]) continue;
        const cell = MAP_CELLS[y]?.[x];
        if (!cell?.name) continue;
        const label = cell.name[locale];
        const cx = ox + x * cellSize;
        const cy = oy + y * cellSize;
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillText(label, cx + cellSize + 1, cy + cellSize - 1);
        ctx.fillStyle = "#f0c040";
        ctx.fillText(label, cx + cellSize, cy + cellSize - 2);
      }
    }
  }

  // Draw routes between connected locations
  const routes = getRoutes();
  ctx.strokeStyle = "rgba(240,192,64,0.12)";
  ctx.lineWidth = 1;
  const drawnEdges = new Set<string>();
  for (const [key, neighbors] of Object.entries(routes)) {
    const [x1, y1] = key.split(",").map(Number);
    if (!map.revealed[y1]?.[x1]) continue;
    for (const nk of neighbors) {
      const edgeKey = [key, nk].sort().join("-");
      if (drawnEdges.has(edgeKey)) continue;
      drawnEdges.add(edgeKey);
      const [x2, y2] = nk.split(",").map(Number);
      if (!map.revealed[y2]?.[x2]) continue;
      ctx.beginPath();
      ctx.moveTo(ox + x1 * cellSize + cellSize / 2, oy + y1 * cellSize + cellSize / 2);
      ctx.lineTo(ox + x2 * cellSize + cellSize / 2, oy + y2 * cellSize + cellSize / 2);
      ctx.stroke();
    }
  }

  // Current route highlight
  if (map.currentRoute && map.destination) {
    ctx.strokeStyle = "rgba(240,192,64,0.4)";
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    const [spx, spy] = map.playerPos;
    ctx.moveTo(ox + spx * cellSize + cellSize / 2, oy + spy * cellSize + cellSize / 2);
    for (const [rx, ry] of map.currentRoute.slice(map.routeProgress)) {
      ctx.lineTo(ox + rx * cellSize + cellSize / 2, oy + ry * cellSize + cellSize / 2);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Player ship (sprite or fallback circle)
  const [px, py] = map.playerPos;
  const playerX = ox + px * cellSize + cellSize / 2;
  const playerY = oy + py * cellSize + cellSize / 2;
  const pp = 1 + Math.sin(frame * 0.08) * 0.2;

  ctx.fillStyle = "rgba(240,192,64,0.3)";
  ctx.beginPath();
  ctx.arc(playerX, playerY, Math.max(4, cellSize) * pp, 0, Math.PI * 2);
  ctx.fill();

  const worldShip = getSprite(SHIP_SPRITE);
  if (worldShip && cellSize >= 4) {
    const ss = Math.max(8, cellSize * 1.8) * pp;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(worldShip, playerX - ss / 2, playerY - ss / 2, ss, ss);
    ctx.imageSmoothingEnabled = true;
  } else {
    const pr = Math.max(3, cellSize / 1.5) * pp;
    ctx.fillStyle = "#f0c040";
    ctx.beginPath();
    ctx.arc(playerX, playerY, pr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Viewport rectangle (showing what the local map displays)
  const viewCols = Math.floor(520 / CELL_W); // match main canvas size
  const viewRows = Math.floor(300 / CELL_H);
  const halfCols = Math.floor(viewCols / 2);
  const halfRows = Math.floor(viewRows / 2);
  let vx = px - halfCols;
  let vy = py - halfRows;
  vx = Math.max(0, Math.min(vx, MAP_W - viewCols));
  vy = Math.max(0, Math.min(vy, MAP_H - viewRows));

  ctx.strokeStyle = "rgba(64,192,240,0.5)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(
    ox + vx * cellSize,
    oy + vy * cellSize,
    viewCols * cellSize,
    viewRows * cellSize,
  );
}

function drawCompass(ctx: CanvasRenderingContext2D, x: number, y: number, _frame: number) {
  const s = 8;
  ctx.strokeStyle = "rgba(240,192,64,0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.lineTo(x, y + s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - s, y);
  ctx.lineTo(x + s, y);
  ctx.stroke();
  ctx.fillStyle = "rgba(240,192,64,0.5)";
  ctx.font = "bold 5px 'Press Start 2P', monospace";
  ctx.fillText("N", x - 2, y - s - 2);
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
