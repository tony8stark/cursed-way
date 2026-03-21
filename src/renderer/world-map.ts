import { getMapCells, getMapWidth, getMapHeight, TERRAIN_COLORS } from "./map-data";
import type { Locale } from "../i18n";

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

// Cell size (slightly smaller for larger maps)
const CELL_W = 13;
const CELL_H = 12;

// Fog colors
const FOG_COLOR = "#08080e";
const FOG_EDGE = "rgba(8,8,14,0.6)";

export function drawWorldMap(
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

  // Background
  ctx.fillStyle = FOG_COLOR;
  ctx.fillRect(0, 0, W, H);

  // Offset to center the grid
  const gridW = MAP_W * CELL_W;
  const gridH = MAP_H * CELL_H;
  const ox = Math.floor((W - gridW) / 2);
  const oy = Math.floor((H - gridH) / 2);

  // Draw terrain cells
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      const cx = ox + x * CELL_W;
      const cy = oy + y * CELL_H;

      if (!map.revealed[y]?.[x]) {
        // Fog - already filled by background
        // Draw subtle hint for discovered neighbor
        const hasRevealedNeighbor = [
          [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
        ].some(([nx, ny]) =>
          nx >= 0 && nx < MAP_W && ny >= 0 && ny < MAP_H && map.revealed[ny]?.[nx]
        );
        if (hasRevealedNeighbor) {
          ctx.fillStyle = FOG_EDGE;
          ctx.fillRect(cx, cy, CELL_W, CELL_H);
        }
        continue;
      }

      const cell = MAP_CELLS[y]?.[x];
      if (!cell) continue;
      const baseColor = TERRAIN_COLORS[cell.terrain];

      // Animated water shimmer
      if (cell.terrain === "water" || cell.terrain === "deep" || cell.terrain === "shallow") {
        ctx.fillStyle = baseColor;
        ctx.fillRect(cx, cy, CELL_W, CELL_H);
        const shimmer = Math.sin(frame * 0.03 + x * 0.7 + y * 0.5) * 0.08;
        if (shimmer > 0) {
          ctx.fillStyle = `rgba(100,150,220,${shimmer})`;
          ctx.fillRect(cx, cy, CELL_W, CELL_H);
        }
      } else {
        ctx.fillStyle = baseColor;
        ctx.fillRect(cx, cy, CELL_W, CELL_H);
      }

      // Grid lines
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.strokeRect(cx, cy, CELL_W, CELL_H);

      // Named location icon
      if (cell.icon) {
        ctx.font = "8px sans-serif";
        ctx.fillText(cell.icon, cx + 2, cy + 10);
      }
    }
  }

  // Named location labels (only revealed ones)
  ctx.font = "bold 5px 'Press Start 2P', monospace";
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      if (!map.revealed[y]?.[x]) continue;
      const cell = MAP_CELLS[y]?.[x];
      if (!cell?.name) continue;
      const label = cell.name[locale];
      const cx = ox + x * CELL_W;
      const cy = oy + y * CELL_H;
      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillText(label, cx + CELL_W + 2, cy + 9);
      // Text
      ctx.fillStyle = "#f0c040";
      ctx.fillText(label, cx + CELL_W + 1, cy + 8);
    }
  }

  // Draw planned route
  if (map.currentRoute && map.destination) {
    ctx.strokeStyle = "rgba(240,192,64,0.25)";
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    const startX = ox + map.playerPos[0] * CELL_W + CELL_W / 2;
    const startY = oy + map.playerPos[1] * CELL_H + CELL_H / 2;
    ctx.moveTo(startX, startY);

    for (const [rx, ry] of map.currentRoute.slice(map.routeProgress)) {
      ctx.lineTo(ox + rx * CELL_W + CELL_W / 2, oy + ry * CELL_H + CELL_H / 2);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Destination marker (pulsing diamond)
    const [dx, dy] = map.destination;
    const destX = ox + dx * CELL_W + CELL_W / 2;
    const destY = oy + dy * CELL_H + CELL_H / 2;
    const dp = 1 + Math.sin(frame * 0.06) * 0.3;
    ctx.fillStyle = "rgba(240,192,64,0.5)";
    ctx.beginPath();
    ctx.moveTo(destX, destY - 4 * dp);
    ctx.lineTo(destX + 3 * dp, destY);
    ctx.lineTo(destX, destY + 4 * dp);
    ctx.lineTo(destX - 3 * dp, destY);
    ctx.closePath();
    ctx.fill();
  }

  // Player ship
  const [px, py] = map.playerPos;
  let drawX = ox + px * CELL_W + CELL_W / 2;
  let drawY = oy + py * CELL_H + CELL_H / 2;

  // Animate toward target
  if (map.targetPos && map.animProgress < 1) {
    const [tx, ty] = map.targetPos;
    const targetX = ox + tx * CELL_W + CELL_W / 2;
    const targetY = oy + ty * CELL_H + CELL_H / 2;
    const sX = ox + px * CELL_W + CELL_W / 2;
    const sY = oy + py * CELL_H + CELL_H / 2;
    const t = easeInOut(map.animProgress);
    drawX = sX + (targetX - sX) * t;
    drawY = sY + (targetY - sY) * t;
  }

  // Ship icon (pulsing)
  const pulse = 1 + Math.sin(frame * 0.08) * 0.1;
  const shipSize = 4 * pulse;

  // Ship glow
  ctx.fillStyle = "rgba(240,192,64,0.3)";
  ctx.beginPath();
  ctx.arc(drawX, drawY, shipSize + 2, 0, Math.PI * 2);
  ctx.fill();

  // Ship dot
  ctx.fillStyle = "#f0c040";
  ctx.beginPath();
  ctx.arc(drawX, drawY, shipSize, 0, Math.PI * 2);
  ctx.fill();

  // Small ship triangle
  ctx.fillStyle = "#0a0a1a";
  ctx.beginPath();
  ctx.moveTo(drawX, drawY - 2);
  ctx.lineTo(drawX - 1.5, drawY + 1.5);
  ctx.lineTo(drawX + 1.5, drawY + 1.5);
  ctx.closePath();
  ctx.fill();

  // Compass rose (top-right corner)
  drawCompass(ctx, W - 16, 16, frame);
}

function drawCompass(ctx: CanvasRenderingContext2D, x: number, y: number, _frame: number) {
  const s = 7;
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
