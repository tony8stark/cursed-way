// ── Sprite image cache ──

const imgCache = new Map<string, HTMLImageElement>();
const imgLoading = new Set<string>();

function loadImg(path: string): HTMLImageElement | null {
  const cached = imgCache.get(path);
  if (cached?.complete && cached.naturalWidth > 0) return cached;
  if (imgLoading.has(path)) return null;
  imgLoading.add(path);
  const img = new Image();
  img.src = path;
  img.onload = () => imgCache.set(path, img);
  imgCache.set(path, img);
  return null;
}

// Sprite name → image path + native size for rendering
interface SpriteImage {
  path: string;
  /** Width to render at scale=1 (pixels). Height auto-calculated from aspect ratio. */
  w: number;
  h: number;
}

const SPRITE_IMAGES: Record<string, SpriteImage> = {
  palm:     { path: "/icons/scene/palm_1.png",     w: 16, h: 21 },   // 48x64 → compact
  palm_big: { path: "/icons/scene/palm_big_0.png", w: 20, h: 28 },   // 80x112 → compact
  bush:     { path: "/icons/scene/bush_0.png",     w: 10, h: 10 },   // 32x32
  building: { path: "/icons/scene/palm_big_1.png", w: 20, h: 28 },   // use palm as port scenery
  chest:    { path: "/icons/scene/chest.png",      w: 10, h: 10 },   // 32x32 pirate chest
  enemy:    { path: "/icons/ships/ship_dark_16.png", w: 14, h: 14 }, // dark ship
  ghost:    { path: "/icons/ships/ship_dark_16.png", w: 14, h: 14 }, // same ship, tinted by scene
};

// Preload all scene sprites
Object.values(SPRITE_IMAGES).forEach(s => loadImg(s.path));

// ── Legacy ASCII sprite data (fallback) ──

const SPRITE_DATA: Record<string, string[]> = {
  ship: [
    "......BB......",
    ".....BBBB.....",
    "....BBBBBB....",
    "WWWWWWWWWWWWWW",
    ".MMMMMMMMMMMM.",
    "..MMMMMMMMMM..",
    "...SSSSSSSS...",
    "....SSSSSS....",
  ],
  enemy: [
    "......RR......",
    ".....RRRR.....",
    "....RRRRRR....",
    "DDDDDDDDDDDDDD",
    ".DDDDDDDDDDDD.",
    "..DDDDDDDDDD..",
    "...DDDDDDDD...",
    "....DDDDDD....",
  ],
  ghost: [
    "......GG......",
    ".....GGGG.....",
    "....GGGGGG....",
    "GGGGGGGGGGGGGG",
    ".GGGGGGGGGGG..",
    "..GG.GGGG.GG..",
    "...G..GG..G...",
    "..G....G....G.",
  ],
  palm: [
    "....GGG.......",
    "...GGGGG......",
    "..GGGGGGG.....",
    "....GGG.GGG...",
    ".....W........",
    ".....W........",
    ".....W........",
    ".....WW.......",
  ],
  tentacle: [
    "....PP",
    "...PP.",
    "..PP..",
    ".PP...",
    ".PP...",
    "..PP..",
    "...PP.",
    "...PP.",
  ],
  building: [
    "...RRRR...",
    "..RRRRRR..",
    ".RRRRRRRR.",
    "WWWWWWWWWW",
    "WW.WW.WWWW",
    "WW.WW.WWWW",
    "WW.WWDWWWW",
    "WWWWWDWWWW",
  ],
  chest: [
    ".YYYYYY.",
    "YYYYYYYY",
    "YDYYYYDY",
    "YYYYYYYY",
    "WWWWWWWW",
    "WDDDDDW.",
    "WDDDDDW.",
    "WWWWWWWW",
  ],
};

const COLOR_MAP: Record<string, string | null> = {
  B: "#40c0f0", W: "#e8dcc8", M: "#6b3e1c", S: "#c8b898",
  R: "#c02020", D: "#3a2a1a", G: "#40b848", Y: "#f0c040",
  P: "#8040a0", ".": null,
};

/**
 * Draw a named sprite. Uses pixel art image if available, falls back to ASCII grid.
 */
export function drawSprite(
  ctx: CanvasRenderingContext2D,
  name: string,
  x: number,
  y: number,
  scale = 3,
  alpha = 1,
) {
  // Try image sprite first
  const imgDef = SPRITE_IMAGES[name];
  if (imgDef) {
    const img = loadImg(imgDef.path);
    if (img) {
      const prevAlpha = ctx.globalAlpha;
      ctx.globalAlpha = alpha;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, x, y, imgDef.w * scale, imgDef.h * scale);
      ctx.imageSmoothingEnabled = true;
      ctx.globalAlpha = prevAlpha;
      return;
    }
  }

  // Fallback: ASCII grid
  const spr = SPRITE_DATA[name];
  if (!spr) return;
  ctx.globalAlpha = alpha;
  for (let ry = 0; ry < spr.length; ry++) {
    const row = spr[ry];
    for (let rx = 0; rx < row.length; rx++) {
      const color = COLOR_MAP[row[rx]];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(x + rx * scale, y + ry * scale, scale, scale);
      }
    }
  }
  ctx.globalAlpha = 1;
}
