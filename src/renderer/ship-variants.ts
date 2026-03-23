import type { GameState } from "../engine/types";

// ── Sprite-based ship with conditional overlay effects ──
// Base ship uses a pixel art sprite (32x16 from sea map tileset)
// Overlays (curse glow, ghost sails, etc.) drawn as canvas effects on top

// Ship sprite variants based on game state
const SHIP_PATHS = {
  default:  "/icons/ships/ship_large_32x16.png",
  battle:   "/icons/ships/ship_battle_16.png",
  damaged:  "/icons/ships/wreck_32x16.png",
  medium:   "/icons/ships/ship_medium_16.png",
};

const spriteCache = new Map<string, HTMLImageElement>();

function loadShipSprite(path: string): HTMLImageElement | null {
  const cached = spriteCache.get(path);
  if (cached?.complete && cached.naturalWidth > 0) return cached;
  if (!spriteCache.has(path)) {
    const img = new Image();
    img.src = path;
    spriteCache.set(path, img);
  }
  return null;
}

// Preload all variants
Object.values(SHIP_PATHS).forEach(loadShipSprite);

/** Pick ship sprite based on game state */
function pickShipSprite(state: ShipVisualState): string {
  // Heavily damaged (crew <= 3)
  if (state.crew <= 3) return SHIP_PATHS.damaged;
  // Battle ready (has armed flag + decent crew)
  if (state.flags.has("armed") && state.crew >= 8) return SHIP_PATHS.battle;
  // Default
  return SHIP_PATHS.default;
}

function getShipSprite(state?: ShipVisualState): HTMLImageElement | null {
  const path = state ? pickShipSprite(state) : SHIP_PATHS.default;
  return loadShipSprite(path);
}

// Ship overlay layers - same ASCII grid format as sprites.ts
// Each layer is drawn on top of the base ship at an offset
// Letters map to custom colors per layer

interface ShipLayer {
  id: string;
  grid: string[];
  colors: Record<string, string>;
  condition: (s: ShipVisualState) => boolean;
  alpha?: number | ((s: ShipVisualState) => number);
}

export interface ShipVisualState {
  crew: number;
  gold: number;
  curse: number;
  flags: Set<string>;
}

export function getShipVisualState(state: GameState): ShipVisualState {
  return {
    crew: state.crew,
    gold: state.gold,
    curse: state.curse,
    flags: state.flags,
  };
}

// Base ship (always drawn)
const BASE_SHIP: string[] = [
  "......BB......",
  ".....BBBB.....",
  "....BBBBBB....",
  "WWWWWWWWWWWWWW",
  ".MMMMMMMMMMMM.",
  "..MMMMMMMMMM..",
  "...SSSSSSSS...",
  "....SSSSSS....",
];

const BASE_COLORS: Record<string, string> = {
  B: "#40c0f0", W: "#e8dcc8", M: "#6b3e1c", S: "#c8b898",
};

// Tattered sail - replaces sail area when crew is low
const TATTERED_SAIL: ShipLayer = {
  id: "tattered",
  grid: [
    "......AA......",
    ".....A..A.....",
    "....A.AA.A....",
    "..............",
    "..............",
    "..............",
    "..............",
    "..............",
  ],
  colors: { A: "#8a7a6a" },
  condition: s => s.crew < 4,
};

// Cannons - when armed
const CANNONS: ShipLayer = {
  id: "cannons",
  grid: [
    "..............",
    "..............",
    "..............",
    "..............",
    "A............A",
    ".A..........A.",
    "..............",
    "..............",
  ],
  colors: { A: "#4a4a4a" },
  condition: s => s.flags.has("armed"),
};

// Curse aura - purple glow around ship
const CURSE_GLOW: ShipLayer = {
  id: "curse_glow",
  grid: [
    ".....AAAA.....",
    "....AAAAAA....",
    "...AAAAAAAA...",
    "AAAAAAAAAAAAA.",
    "AAAAAAAAAAAAA.",
    ".AAAAAAAAAAA..",
    "..AAAAAAAAA...",
    "...AAAAAAA....",
  ],
  colors: { A: "#8020c0" },
  condition: s => s.curse > 5,
  alpha: s => Math.min((s.curse - 5) / 15, 0.35),
};

// Curse tentacles growing on hull
const CURSE_GROWTHS: ShipLayer = {
  id: "curse_growths",
  grid: [
    "..............",
    "..............",
    "..............",
    "..............",
    "..............",
    ".A........A...",
    "..A....A.A....",
    "..AA..AA.A....",
  ],
  colors: { A: "#6030a0" },
  condition: s => s.curse > 10,
  alpha: s => Math.min((s.curse - 10) / 10, 0.8),
};

// Gold trim - prosperity
const GOLD_TRIM: ShipLayer = {
  id: "gold_trim",
  grid: [
    "..............",
    "..............",
    "..............",
    "A............A",
    "..............",
    "..............",
    "...A....A.....",
    "....AAAA......",
  ],
  colors: { A: "#f0c040" },
  condition: s => s.gold > 60,
};

// Ghost sails at very high curse
const GHOST_SAILS: ShipLayer = {
  id: "ghost_sails",
  grid: [
    "......AA......",
    ".....AAAA.....",
    "....AAAAAA....",
    "..............",
    "..............",
    "..............",
    "..............",
    "..............",
  ],
  colors: { A: "#4a2a6a" },
  condition: s => s.curse > 12,
  alpha: 0.6,
};

const LAYERS: ShipLayer[] = [
  CURSE_GLOW,
  TATTERED_SAIL,
  CANNONS,
  CURSE_GROWTHS,
  GOLD_TRIM,
  GHOST_SAILS,
];

function drawGrid(
  ctx: CanvasRenderingContext2D,
  grid: string[],
  colors: Record<string, string>,
  x: number,
  y: number,
  scale: number,
  alpha: number,
) {
  const prevAlpha = ctx.globalAlpha;
  ctx.globalAlpha = alpha;
  for (let ry = 0; ry < grid.length; ry++) {
    const row = grid[ry];
    for (let rx = 0; rx < row.length; rx++) {
      const color = colors[row[rx]];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(x + rx * scale, y + ry * scale, scale, scale);
      }
    }
  }
  ctx.globalAlpha = prevAlpha;
}

/**
 * Draw the ship with conditional overlay layers based on game state.
 * Drop-in replacement for drawSprite(ctx, "ship", x, y, scale, alpha).
 * Uses pixel art sprite with canvas overlay effects for curse/gold/damage.
 */
export function drawShipVariant(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  baseAlpha: number,
  visualState: ShipVisualState,
) {
  const sprite = getShipSprite(visualState);

  if (sprite) {
    // Sprite is 32x16. Original ASCII grid was 14x8 at scale 3 = 42x24.
    // Scale sprite to match: 32 * scale * 14/32 ≈ scale factor that fits same space
    // We want the sprite to occupy roughly the same screen area
    const sprW = 32 * scale;   // 96px at scale=3
    const sprH = 16 * scale;   // 48px at scale=3
    // Center on same position as old grid (old was 14*scale wide, 8*scale tall)
    const oldW = 14 * scale;
    const oldH = 8 * scale;
    const sx = x + (oldW - sprW) / 2;
    const sy = y + (oldH - sprH) / 2;

    const prevAlpha = ctx.globalAlpha;
    ctx.globalAlpha = baseAlpha;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sprite, sx, sy, sprW, sprH);
    ctx.imageSmoothingEnabled = true;
    ctx.globalAlpha = prevAlpha;

    // ── Overlay effects on top of the sprite ──

    // Curse glow (purple aura around ship)
    if (visualState.curse > 5) {
      const intensity = Math.min(1, (visualState.curse - 5) / 10);
      ctx.fillStyle = `rgba(100,30,160,${0.15 * intensity * baseAlpha})`;
      ctx.beginPath();
      ctx.ellipse(
        sx + sprW / 2, sy + sprH / 2,
        sprW / 2 + 6, sprH / 2 + 4,
        0, 0, Math.PI * 2,
      );
      ctx.fill();
    }

    // Gold trim glow
    if (visualState.gold > 60) {
      ctx.fillStyle = `rgba(240,192,64,${0.1 * baseAlpha})`;
      ctx.beginPath();
      ctx.ellipse(
        sx + sprW / 2, sy + sprH * 0.7,
        sprW / 2 - 4, sprH / 4,
        0, 0, Math.PI * 2,
      );
      ctx.fill();
    }

    // Ghost sails (semi-transparent purple overlay on top half)
    if (visualState.curse > 12) {
      ctx.fillStyle = `rgba(74,42,106,${0.4 * baseAlpha})`;
      ctx.fillRect(sx + sprW * 0.25, sy, sprW * 0.5, sprH * 0.4);
    }

    // Tattered effect (darken sail area when crew is very low)
    if (visualState.crew < 4) {
      ctx.fillStyle = `rgba(0,0,0,${0.3 * baseAlpha})`;
      ctx.fillRect(sx + sprW * 0.3, sy, sprW * 0.4, sprH * 0.35);
    }
  } else {
    // Fallback: original ASCII grid rendering
    drawGrid(ctx, BASE_SHIP, BASE_COLORS, x, y, scale, baseAlpha);
    for (const layer of LAYERS) {
      if (layer.condition(visualState)) {
        let layerAlpha: number;
        if (typeof layer.alpha === "function") {
          layerAlpha = layer.alpha(visualState) * baseAlpha;
        } else if (typeof layer.alpha === "number") {
          layerAlpha = layer.alpha * baseAlpha;
        } else {
          layerAlpha = baseAlpha;
        }
        drawGrid(ctx, layer.grid, layer.colors, x, y, scale, layerAlpha);
      }
    }
  }
}
