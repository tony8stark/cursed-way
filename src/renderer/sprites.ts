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

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  name: string,
  x: number,
  y: number,
  scale = 3,
  alpha = 1,
) {
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
