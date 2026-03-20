import { MAP_CELLS, MAP_W, MAP_H, TERRAIN_COLORS } from "./map-data";
import type { Locale } from "../i18n";

export interface MapState {
  playerPos: [number, number];
  revealed: boolean[][];
  targetPos: [number, number] | null; // for animation
  animProgress: number; // 0..1
}

export function createMapState(startPos: [number, number]): MapState {
  const revealed: boolean[][] = [];
  for (let y = 0; y < MAP_H; y++) {
    revealed.push(new Array(MAP_W).fill(false));
  }
  const state: MapState = {
    playerPos: startPos,
    revealed,
    targetPos: null,
    animProgress: 0,
  };
  revealAround(state, startPos[0], startPos[1], 3);
  return state;
}

export function revealAround(map: MapState, cx: number, cy: number, radius: number) {
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx >= 0 && nx < MAP_W && ny >= 0 && ny < MAP_H) {
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
}

export function serializeMap(map: MapState): SerializedMapState {
  return {
    playerPos: map.playerPos,
    revealed: map.revealed,
  };
}

export function deserializeMap(data: SerializedMapState): MapState {
  return {
    playerPos: data.playerPos,
    revealed: data.revealed,
    targetPos: null,
    animProgress: 0,
  };
}

// Cell size
const CELL_W = 24;
const CELL_H = 21;

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

      if (!map.revealed[y][x]) {
        // Fog - already filled by background
        // Draw subtle grid line for discovered neighbor hints
        const hasRevealedNeighbor = [
          [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
        ].some(([nx, ny]) =>
          nx >= 0 && nx < MAP_W && ny >= 0 && ny < MAP_H && map.revealed[ny][nx]
        );
        if (hasRevealedNeighbor) {
          ctx.fillStyle = FOG_EDGE;
          ctx.fillRect(cx, cy, CELL_W, CELL_H);
        }
        continue;
      }

      const cell = MAP_CELLS[y][x];
      const baseColor = TERRAIN_COLORS[cell.terrain];

      // Animated water shimmer
      if (cell.terrain === "water" || cell.terrain === "deep" || cell.terrain === "shallow") {
        ctx.fillStyle = baseColor;
        ctx.fillRect(cx, cy, CELL_W, CELL_H);
        // Subtle wave shimmer
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
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.strokeRect(cx, cy, CELL_W, CELL_H);

      // Named location icon
      if (cell.icon) {
        ctx.font = "10px sans-serif";
        ctx.fillText(cell.icon, cx + 7, cy + 14);
      }
    }
  }

  // Named location labels (only revealed ones)
  ctx.font = "bold 6px 'Press Start 2P', monospace";
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      if (!map.revealed[y][x]) continue;
      const cell = MAP_CELLS[y][x];
      if (!cell.name) continue;
      const label = cell.name[locale];
      const cx = ox + x * CELL_W;
      const cy = oy + y * CELL_H;
      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillText(label, cx + CELL_W + 2, cy + 13);
      // Text
      ctx.fillStyle = "#f0c040";
      ctx.fillText(label, cx + CELL_W + 1, cy + 12);
    }
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
    const startX = ox + px * CELL_W + CELL_W / 2;
    const startY = oy + py * CELL_H + CELL_H / 2;
    const t = easeInOut(map.animProgress);
    drawX = startX + (targetX - startX) * t;
    drawY = startY + (targetY - startY) * t;
  }

  // Ship icon (pulsing)
  const pulse = 1 + Math.sin(frame * 0.08) * 0.1;
  const shipSize = 5 * pulse;

  // Ship glow
  ctx.fillStyle = "rgba(240,192,64,0.3)";
  ctx.beginPath();
  ctx.arc(drawX, drawY, shipSize + 3, 0, Math.PI * 2);
  ctx.fill();

  // Ship dot
  ctx.fillStyle = "#f0c040";
  ctx.beginPath();
  ctx.arc(drawX, drawY, shipSize, 0, Math.PI * 2);
  ctx.fill();

  // Small ship triangle
  ctx.fillStyle = "#0a0a1a";
  ctx.beginPath();
  ctx.moveTo(drawX, drawY - 3);
  ctx.lineTo(drawX - 2, drawY + 2);
  ctx.lineTo(drawX + 2, drawY + 2);
  ctx.closePath();
  ctx.fill();

  // Compass rose (top-right corner)
  drawCompass(ctx, W - 20, 20, frame);
}

function drawCompass(ctx: CanvasRenderingContext2D, x: number, y: number, _frame: number) {
  const s = 8;
  ctx.strokeStyle = "rgba(240,192,64,0.3)";
  ctx.lineWidth = 1;
  // N-S
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.lineTo(x, y + s);
  ctx.stroke();
  // E-W
  ctx.beginPath();
  ctx.moveTo(x - s, y);
  ctx.lineTo(x + s, y);
  ctx.stroke();
  // N label
  ctx.fillStyle = "rgba(240,192,64,0.5)";
  ctx.font = "bold 5px 'Press Start 2P', monospace";
  ctx.fillText("N", x - 2, y - s - 2);
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
