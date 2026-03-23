import { drawSprite } from "../sprites";
import { ParticleSystem } from "../particles";
import { drawShipVariant, type ShipVisualState } from "../ship-variants";
import type { SceneId } from "../../engine/types";
import type { AtmosphereState } from "../atmosphere";

export interface SceneOpts {
  curse?: number;
  enemyType?: string;
  shipVisual?: ShipVisualState;
  atmosphere?: AtmosphereState;
}

export type SceneRenderer = (
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  f: number,
  particles: ParticleSystem,
  opts?: SceneOpts,
) => void;

/** Draw ship - uses variant layers if shipVisual is provided */
function ship(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, alpha: number, opts?: SceneOpts) {
  if (opts?.shipVisual) {
    drawShipVariant(ctx, x, y, scale, alpha, opts.shipVisual);
  } else {
    drawSprite(ctx, "ship", x, y, scale, alpha);
  }
}

/** Get atmosphere-aware colors or fallback to defaults */
function colors(opts?: SceneOpts) {
  const atm = opts?.atmosphere;
  if (!atm) return null;
  return atm.palette;
}

function sceneOpenSea(ctx: CanvasRenderingContext2D, W: number, H: number, f: number, ps: ParticleSystem, opts?: SceneOpts) {
  const cr = Math.min((opts?.curse ?? 0) / 15, 1);
  const pal = colors(opts);

  if (pal) {
    // Atmosphere-aware background
    const gd = ctx.createLinearGradient(0, 0, 0, H);
    gd.addColorStop(0, pal.sky);
    gd.addColorStop(1, pal.water);
    ctx.fillStyle = gd;
  } else {
    ctx.fillStyle = `rgb(${10 + cr * 30 | 0},${10 + cr * 5 | 0},${26 + cr * 50 | 0})`;
  }
  ctx.fillRect(0, 0, W, H);

  // Water: layered horizontal wave lines for depth
  const waterStart = H * 0.35;
  for (let y = waterStart; y < H; y += 3) {
    const depth = (y - waterStart) / (H - waterStart); // 0..1
    const waveOff = Math.sin((y * 0.08) + f * 0.04) * 8 + Math.sin((y * 0.15) + f * 0.06) * 4;
    const alpha = 0.08 + depth * 0.12;
    if (pal) {
      ctx.fillStyle = pal.waterHighlight;
      ctx.globalAlpha = alpha;
    } else {
      ctx.fillStyle = `rgba(${30 + cr * 40 | 0},${Math.max(0, 40 - cr * 20) | 0},${80 + cr * 30 | 0},${alpha})`;
    }
    ctx.fillRect(waveOff, y, W, 2);
  }
  ctx.globalAlpha = 1;

  // Gentle surface shimmer (small highlights moving across water)
  for (let i = 0; i < 6; i++) {
    const sx = ((f * 0.3 + i * 97) % (W + 40)) - 20;
    const sy = waterStart + 10 + Math.sin(f * 0.03 + i * 2.1) * 15 + i * 25;
    const sw = 12 + Math.sin(f * 0.05 + i) * 4;
    ctx.fillStyle = pal ? pal.waterHighlight : `rgba(100,160,220,0.15)`;
    ctx.globalAlpha = 0.12 + Math.sin(f * 0.04 + i * 1.7) * 0.06;
    ctx.fillRect(sx, sy, sw, 1);
  }
  ctx.globalAlpha = 1;

  // Stars (above water line)
  if (f % 120 === 0) {
    ps.emit(1, { x: 0, y: 0, w: W, h: waterStart * 0.8, color: "#fff", alpha: 0.3, size: 1, life: 120, vxRange: [0, 0], vyRange: [0, 0] });
  }

  // Foam particles on waves
  if (f % 18 === 0) {
    ps.emit(2, { x: 0, y: waterStart + 10, w: W, h: H * 0.15, color: "rgba(200,220,255,0.4)", size: 1.5, life: 50, vxRange: [0.15, 0.4], vyRange: [-0.05, 0.05] });
  }

  // Ship with gentle bob
  const bob = Math.sin(f * 0.04) * 3 + Math.sin(f * 0.07) * 1.5;
  ship(ctx, W / 2 - 21, H / 2 + bob - 8, 3, 1, opts);
}

function sceneStorm(ctx: CanvasRenderingContext2D, W: number, H: number, f: number, ps: ParticleSystem, opts?: SceneOpts) {
  ctx.fillStyle = "#08081a";
  ctx.fillRect(0, 0, W, H);

  for (let y = 0; y < H; y += 4) {
    for (let x = 0; x < W; x += 4) {
      if (Math.sin((x + f * 2) * 0.05) * Math.cos((y + f * 1.5) * 0.06) > 0.1) {
        ctx.fillStyle = "rgba(20,20,50,0.6)";
        ctx.fillRect(x, y, 4, 4);
      }
    }
  }

  // Lightning
  if (Math.sin(f * 0.07) > 0.95) {
    ctx.fillStyle = "rgba(255,255,200,0.8)";
    const lx = W * 0.3 + Math.sin(f) * 50;
    ctx.fillRect(lx, 0, 3, H * 0.6);
    ctx.fillRect(lx - 8, H * 0.3, 20, 3);
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(0, 0, W, H);
  }

  // Rain particles
  if (f % 2 === 0) {
    ps.emit(5, { x: 0, y: -5, w: W, h: 1, color: "rgba(150,180,220,0.5)", size: 1, life: 30, vxRange: [0.5, 1.5], vyRange: [4, 6] });
  }

  ship(ctx, W / 2 - 21, H / 2 + Math.sin(f * 0.08) * 8, 3, 1, opts);
}

function sceneIsland(ctx: CanvasRenderingContext2D, W: number, H: number, f: number, ps: ParticleSystem, opts?: SceneOpts) {
  const pal = colors(opts);
  ctx.fillStyle = pal?.sky ?? "#1a2a4e";
  ctx.fillRect(0, 0, W, H);

  // Water
  for (let y = H * 0.6; y < H; y += 6) {
    for (let x = 0; x < W; x += 6) {
      ctx.fillStyle = `rgba(${20 + Math.sin(x * 0.1 + f * 0.3) * 10 | 0},30,60,0.25)`;
      ctx.fillRect(x, y, 6, 6);
    }
  }

  // Island
  ctx.fillStyle = "#e0c878";
  ctx.beginPath(); ctx.ellipse(W * 0.65, H * 0.52, 80, 20, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#50a040";
  ctx.beginPath(); ctx.ellipse(W * 0.65, H * 0.45, 60, 25, 0, Math.PI, Math.PI * 2); ctx.fill();

  drawSprite(ctx, "palm", W * 0.52, H * 0.08, 3);
  drawSprite(ctx, "palm", W * 0.70, H * 0.12, 2.5);
  drawSprite(ctx, "bush", W * 0.62, H * 0.36, 2);
  ship(ctx, W * 0.15, H * 0.65 + Math.sin(f * 0.04) * 2, 3, 1, opts);

  // Shore foam
  if (f % 30 === 0) {
    ps.emit(3, { x: W * 0.4, y: H * 0.54, w: 100, h: 5, color: "#fff", alpha: 0.2, size: 2, life: 40, vxRange: [-0.2, 0.2], vyRange: [-0.1, 0.1] });
  }
}

function sceneCave(ctx: CanvasRenderingContext2D, W: number, H: number, f: number, ps: ParticleSystem) {
  ctx.fillStyle = "#0a0808";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#1a1410";
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W * 0.3, 0); ctx.lineTo(W * 0.15, H * 0.4); ctx.lineTo(0, H * 0.3); ctx.fill();
  ctx.beginPath(); ctx.moveTo(W * 0.7, 0); ctx.lineTo(W, 0); ctx.lineTo(W, H * 0.3); ctx.lineTo(W * 0.85, H * 0.4); ctx.fill();

  ctx.fillStyle = "#1a2a3a";
  ctx.fillRect(0, H * 0.7, W, H * 0.3);

  for (let i = 0; i < 8; i++) {
    const gx = (Math.sin(f * 0.02 + i * 1.5) * 0.3 + 0.5) * W;
    const gy = (Math.cos(f * 0.015 + i * 2.1) * 0.2 + 0.5) * H;
    const r = 3 + Math.sin(f * 0.03 + i) * 2;
    ctx.fillStyle = `rgba(64,240,160,${0.3 + Math.sin(f * 0.04 + i) * 0.2})`;
    ctx.beginPath(); ctx.arc(gx, gy, r, 0, Math.PI * 2); ctx.fill();
  }

  if (f % 40 === 0) {
    ps.emit(1, { x: W * 0.3, y: 0, w: W * 0.4, h: 1, color: "rgba(100,200,255,0.4)", size: 2, life: 60, vxRange: [0, 0], vyRange: [0.5, 1] });
  }

  drawSprite(ctx, "chest", W / 2 - 12, H * 0.55, 3, 0.8 + Math.sin(f * 0.03) * 0.2);
}

function sceneCombat(ctx: CanvasRenderingContext2D, W: number, H: number, f: number, ps: ParticleSystem, opts?: SceneOpts) {
  ctx.fillStyle = "#0e0e2a";
  ctx.fillRect(0, 0, W, H);

  for (let y = 0; y < H; y += 6) {
    for (let x = 0; x < W; x += 6) {
      if (Math.sin((x + f * 1.2) * 0.04) * Math.cos((y + f * 0.8) * 0.05) > 0.2) {
        ctx.fillStyle = "rgba(40,20,20,0.3)";
        ctx.fillRect(x, y, 6, 6);
      }
    }
  }

  const isGhost = opts?.enemyType === "ghost";
  drawSprite(ctx, isGhost ? "ghost" : "enemy", W / 2 - 21, H * 0.15 + Math.sin(f * 0.06 + 1) * 3, 3, isGhost ? 0.7 : 1);
  ship(ctx, W / 2 - 21, H * 0.6 + Math.sin(f * 0.05) * 2, 3, 1, opts);

  if (f % 15 === 0) {
    ps.emit(3, { x: W / 2 - 30, y: H * 0.35, w: 60, h: 20, color: "#f0c040", alpha: 0.8, size: 2, life: 15, vxRange: [-2, 2], vyRange: [-2, 1] });
  }

  if (f % 30 < 5) {
    ctx.fillStyle = "rgba(255,200,50,0.6)";
    ctx.beginPath(); ctx.arc(W / 2 + (Math.random() - 0.5) * 60, H * 0.4, 4, 0, Math.PI * 2); ctx.fill();
  }
}

function sceneEthereal(ctx: CanvasRenderingContext2D, W: number, H: number, f: number, ps: ParticleSystem, opts?: SceneOpts) {
  ctx.fillStyle = "#12081e";
  ctx.fillRect(0, 0, W, H);

  for (let i = 0; i < 15; i++) {
    const ox = (Math.sin(f * 0.008 + i * 2.3) * 0.5 + 0.5) * W;
    const oy = (Math.cos(f * 0.006 + i * 1.7) * 0.5 + 0.5) * H;
    const r = 30 + Math.sin(f * 0.02 + i) * 15;
    const gd = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
    gd.addColorStop(0, `rgba(128,32,192,${0.15 + Math.sin(f * 0.03 + i) * 0.08})`);
    gd.addColorStop(1, "rgba(128,32,192,0)");
    ctx.fillStyle = gd;
    ctx.fillRect(ox - r, oy - r, r * 2, r * 2);
  }

  if (f % 10 === 0) {
    ps.emit(1, { x: 0, y: H, w: W, h: 1, color: "rgba(200,180,255,0.4)", size: 2, life: 80, vxRange: [-0.3, 0.3], vyRange: [-0.8, -0.3] });
  }

  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `rgba(200,180,255,${0.1 + Math.sin(f * 0.05 + i) * 0.08})`;
    ctx.fillRect((i * 127 + f * 0.5) % W, (i * 83 + f * 0.3) % H, 2, 2);
  }

  ship(ctx, W / 2 - 21, H / 2 + Math.sin(f * 0.04) * 4, 3, 0.8, opts);
}

function scenePort(ctx: CanvasRenderingContext2D, W: number, H: number, f: number, ps: ParticleSystem, opts?: SceneOpts) {
  const pal = colors(opts);
  ctx.fillStyle = pal?.sky ?? "#14182a";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = pal?.water ?? "#1a2a4a";
  ctx.fillRect(0, H * 0.65, W, H * 0.35);

  ctx.fillStyle = "#3a2a1a";
  ctx.fillRect(W * 0.4, H * 0.5, W * 0.6, 8);
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = "#2a1a0a";
    ctx.fillRect(W * 0.45 + i * 40, H * 0.5, 4, H * 0.2);
  }

  drawSprite(ctx, "palm_big", W * 0.48, H * 0.02, 2);
  drawSprite(ctx, "building", W * 0.68, H * 0.12, 2.5);
  drawSprite(ctx, "bush", W * 0.85, H * 0.35, 2);

  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = `rgba(255,200,80,${0.4 + Math.sin(f * 0.04 + i * 2) * 0.2})`;
    ctx.fillRect(W * 0.52 + i * 18, H * 0.28, 3, 3);
  }

  if (f % 25 === 0) {
    ps.emit(1, { x: W * 0.52, y: H * 0.26, w: 80, h: 1, color: "#f0c040", alpha: 0.3, size: 1, life: 20, vxRange: [-0.2, 0.2], vyRange: [-0.5, -0.2] });
  }

  ship(ctx, W * 0.1, H * 0.62 + Math.sin(f * 0.04) * 2, 3, 1, opts);
}

function sceneUnderwater(ctx: CanvasRenderingContext2D, W: number, H: number, f: number, ps: ParticleSystem) {
  const gd = ctx.createLinearGradient(0, 0, 0, H);
  gd.addColorStop(0, "#0a2a4a");
  gd.addColorStop(1, "#041828");
  ctx.fillStyle = gd;
  ctx.fillRect(0, 0, W, H);

  for (let i = 0; i < 20; i++) {
    ctx.fillStyle = `rgba(100,180,255,${0.15 + Math.sin(f * 0.03 + i) * 0.1})`;
    ctx.beginPath();
    ctx.arc((i * 89 + f * 0.4) % W, H - ((i * 67 + f * 0.8) % H), 2 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = `hsl(${(i * 40 + f * 0.5) % 360}, 60%, 40%)`;
    ctx.beginPath();
    ctx.ellipse(W * 0.2 + i * 50, H * 0.8 + Math.sin(i * 1.5) * 15, 12, 8, 0, Math.PI, Math.PI * 2);
    ctx.fill();
  }

  if (f % 8 === 0) {
    ps.emit(1, { x: W * 0.1, y: H * 0.9, w: W * 0.8, h: 1, color: "rgba(150,200,255,0.3)", size: 3, life: 80, vxRange: [-0.2, 0.2], vyRange: [-1, -0.5] });
  }

  drawSprite(ctx, "tentacle", W * 0.15, H * 0.3 + Math.sin(f * 0.04) * 8, 3, 0.6);
  drawSprite(ctx, "tentacle", W * 0.8, H * 0.4 + Math.cos(f * 0.035) * 6, 3, 0.5);
}

function sceneKraken(ctx: CanvasRenderingContext2D, W: number, H: number, f: number, ps: ParticleSystem, opts?: SceneOpts) {
  ctx.fillStyle = "#080810";
  ctx.fillRect(0, 0, W, H);

  for (let y = 0; y < H; y += 5) {
    for (let x = 0; x < W; x += 5) {
      if (Math.sin((x + f * 2) * 0.06) * Math.cos((y + f * 1.5) * 0.07) > 0.1) {
        ctx.fillStyle = "rgba(20,10,30,0.5)";
        ctx.fillRect(x, y, 5, 5);
      }
    }
  }

  for (let i = 0; i < 6; i++) {
    drawSprite(ctx, "tentacle", W * (0.1 + i * 0.15), H * 0.5 + Math.sin(f * 0.04 + i * 1.2) * 20, 3, 0.7);
  }

  if (f % 12 === 0) {
    ps.emit(2, { x: W * 0.2, y: H * 0.5, w: W * 0.6, h: 30, color: "rgba(60,20,80,0.4)", size: 4, life: 50, vxRange: [-1, 1], vyRange: [-0.5, 0.5] });
  }

  ship(ctx, W / 2 - 21, H * 0.2 + Math.sin(f * 0.06) * 5, 3, 1, opts);
}

export const SCENES: Record<SceneId, SceneRenderer> = {
  open_sea: sceneOpenSea,
  storm: sceneStorm,
  island: sceneIsland,
  cave: sceneCave,
  combat: sceneCombat,
  ethereal: sceneEthereal,
  port: scenePort,
  underwater: sceneUnderwater,
  kraken: sceneKraken,
};
