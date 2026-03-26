import { drawSprite } from "../sprites";
import { ParticleSystem } from "../particles";
import { drawShipVariant, type ShipVisualState } from "../ship-variants";
import type { SceneId } from "../../engine/types";
import type { AtmosphereState } from "../atmosphere";
import { drawSceneBackground } from "../scene-backgrounds";

export interface SceneOpts {
  curse?: number;
  enemyType?: string;
  encounterId?: string;
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

// ── Shared waterline: all scenes place objects relative to this ──
const WL = 0.68; // waterline at 68% of canvas height

function sceneOpenSea(ctx: CanvasRenderingContext2D, W: number, H: number, f: number, ps: ParticleSystem, opts?: SceneOpts) {
  const cr = Math.min((opts?.curse ?? 0) / 15, 1);
  const pal = colors(opts);
  const waterY = H * WL;
  const hasBackdrop = drawSceneBackground(ctx, W, H, {
    scene: "open_sea",
    time: opts?.atmosphere?.time,
    encounterId: opts?.encounterId,
    enemyType: opts?.enemyType,
  });

  if (!hasBackdrop) {
    if (pal) {
      const gd = ctx.createLinearGradient(0, 0, 0, H);
      gd.addColorStop(0, pal.sky);
      gd.addColorStop(1, pal.water);
      ctx.fillStyle = gd;
    } else {
      ctx.fillStyle = `rgb(${10 + cr * 30 | 0},${10 + cr * 5 | 0},${26 + cr * 50 | 0})`;
    }
    ctx.fillRect(0, 0, W, H);

    // Water: layered horizontal wave lines
    for (let y = waterY - 20; y < H; y += 3) {
      const depth = Math.max(0, (y - waterY + 20) / (H - waterY + 20));
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

    // Surface shimmer
    for (let i = 0; i < 6; i++) {
      const sx = ((f * 0.3 + i * 97) % (W + 40)) - 20;
      const sy = waterY + 10 + Math.sin(f * 0.03 + i * 2.1) * 15 + i * 15;
      const sw = 12 + Math.sin(f * 0.05 + i) * 4;
      ctx.fillStyle = pal ? pal.waterHighlight : "rgba(100,160,220,0.15)";
      ctx.globalAlpha = 0.12 + Math.sin(f * 0.04 + i * 1.7) * 0.06;
      ctx.fillRect(sx, sy, sw, 1);
    }
    ctx.globalAlpha = 1;
  }

  // Stars
  if (f % 120 === 0) {
    ps.emit(1, { x: 0, y: 0, w: W, h: (waterY - 20) * 0.8, color: "#fff", alpha: 0.3, size: 1, life: 120, vxRange: [0, 0], vyRange: [0, 0] });
  }

  // Foam
  if (f % 18 === 0) {
    ps.emit(2, { x: 0, y: waterY, w: W, h: H * 0.1, color: "rgba(200,220,255,0.4)", size: 1.5, life: 50, vxRange: [0.15, 0.4], vyRange: [-0.05, 0.05] });
  }

  // NPC ship (merchant, raider, enemy, ghost) in the distance
  if (opts?.enemyType) {
    const npcWaterY = waterY - 35; // higher = further away
    const npcBob = Math.sin(f * 0.035 + 2) * 2;
    const isGhost = opts.enemyType === "ghost";
    const spriteName = opts.enemyType === "merchant" ? "merchant"
      : opts.enemyType === "raider" ? "raider"
      : isGhost ? "ghost" : "enemy";
    drawSprite(ctx, spriteName, W * 0.6, npcWaterY + npcBob, 2.2, isGhost ? 0.6 : 0.9);
  }

  // Ship centered, hull bottom on waterline
  const bob = Math.sin(f * 0.04) * 3 + Math.sin(f * 0.07) * 1.5;
  ship(ctx, W * 0.35, waterY + bob, 3, 1, opts);
}

function sceneStorm(ctx: CanvasRenderingContext2D, W: number, H: number, f: number, ps: ParticleSystem, opts?: SceneOpts) {
  const waterY = H * WL;
  const hasBackdrop = drawSceneBackground(ctx, W, H, {
    scene: "storm",
    time: opts?.atmosphere?.time,
    encounterId: opts?.encounterId,
  });

  if (!hasBackdrop) {
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
  }

  // Lightning
  if (Math.sin(f * 0.07) > 0.95) {
    ctx.fillStyle = "rgba(255,255,200,0.8)";
    const lx = W * 0.3 + Math.sin(f) * 50;
    ctx.fillRect(lx, 0, 3, waterY);
    ctx.fillRect(lx - 8, waterY * 0.5, 20, 3);
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(0, 0, W, H);
  }

  // Rain
  if (f % 2 === 0) {
    ps.emit(5, { x: 0, y: -5, w: W, h: 1, color: "rgba(150,180,220,0.5)", size: 1, life: 30, vxRange: [0.5, 1.5], vyRange: [4, 6] });
  }

  ship(ctx, W * 0.35, waterY + Math.sin(f * 0.08) * 8, 3, 1, opts);
}

function sceneIsland(ctx: CanvasRenderingContext2D, W: number, H: number, f: number, ps: ParticleSystem, opts?: SceneOpts) {
  const pal = colors(opts);
  const waterY = H * WL;
  const groundY = waterY; // island ground sits on the waterline
  const hasBackdrop = drawSceneBackground(ctx, W, H, {
    scene: "island",
    time: opts?.atmosphere?.time,
    encounterId: opts?.encounterId,
  });

  if (!hasBackdrop) {
    ctx.fillStyle = pal?.sky ?? "#1a2a4e";
    ctx.fillRect(0, 0, W, H);

    // Water below waterline
    for (let y = waterY; y < H; y += 6) {
      for (let x = 0; x < W; x += 6) {
        ctx.fillStyle = `rgba(${20 + Math.sin(x * 0.1 + f * 0.3) * 10 | 0},30,60,0.25)`;
        ctx.fillRect(x, y, 6, 6);
      }
    }

    // Island: sand beach (ellipse bottom on waterline) + green hill on top
    const islandCx = W * 0.62;
    ctx.fillStyle = "#e0c878";
    ctx.beginPath(); ctx.ellipse(islandCx, groundY, W * 0.22, 22, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#50a040";
    ctx.beginPath(); ctx.ellipse(islandCx, groundY - 18, W * 0.16, 28, 0, Math.PI, Math.PI * 2); ctx.fill();

    // All island elements: bottom-aligned to groundY
    // drawSprite y = groundY - spriteHeight*scale (drawn upward from ground)
    drawSprite(ctx, "palm", islandCx - 60, groundY - 80, 3);
    drawSprite(ctx, "building", islandCx - 10, groundY - 50, 1.5);
    drawSprite(ctx, "palm", islandCx + 50, groundY - 70, 2.5);
    drawSprite(ctx, "bush", islandCx - 70, groundY - 24, 2);
  }

  // Ship hull sits on waterline
  ship(ctx, W * 0.06, waterY + Math.sin(f * 0.04) * 2, 3, 1, opts);

  // Shore foam on waterline
  if (f % 30 === 0) {
    ps.emit(3, { x: W * 0.4, y: waterY - 5, w: 100, h: 5, color: "#fff", alpha: 0.2, size: 2, life: 40, vxRange: [-0.2, 0.2], vyRange: [-0.1, 0.1] });
  }
}

function sceneCave(ctx: CanvasRenderingContext2D, W: number, H: number, f: number, ps: ParticleSystem, opts?: SceneOpts) {
  const hasBackdrop = drawSceneBackground(ctx, W, H, {
    scene: "cave",
    encounterId: opts?.encounterId,
  });

  if (!hasBackdrop) {
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
  }

  if (f % 40 === 0) {
    ps.emit(1, { x: W * 0.3, y: 0, w: W * 0.4, h: 1, color: "rgba(100,200,255,0.4)", size: 2, life: 60, vxRange: [0, 0], vyRange: [0.5, 1] });
  }

  if (!hasBackdrop) {
    drawSprite(ctx, "chest", W / 2 - 12, H * 0.55, 3, 0.8 + Math.sin(f * 0.03) * 0.2);
  }
}

function sceneCombat(ctx: CanvasRenderingContext2D, W: number, H: number, f: number, ps: ParticleSystem, opts?: SceneOpts) {
  const hasBackdrop = drawSceneBackground(ctx, W, H, {
    scene: "combat",
    time: opts?.atmosphere?.time,
    encounterId: opts?.encounterId,
    enemyType: opts?.enemyType,
  });

  if (!hasBackdrop) {
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
  }

  const waterY = H * WL;

  // Enemy ship: far away (upper-right, smaller = perspective), sits on waterline - offset
  const isGhost = opts?.enemyType === "ghost";
  const enemyWaterY = waterY - 40; // "further away" = higher on screen
  drawSprite(ctx, isGhost ? "ghost" : "enemy", W * 0.58, enemyWaterY + Math.sin(f * 0.06 + 1) * 3, 2.2, isGhost ? 0.7 : 1);

  // Cannon fire between ships
  if (f % 15 === 0) {
    ps.emit(3, { x: W * 0.3, y: waterY - 50, w: W * 0.25, h: 20, color: "#f0c040", alpha: 0.8, size: 2, life: 15, vxRange: [-2, 2], vyRange: [-2, 1] });
  }
  if (f % 30 < 5) {
    ctx.fillStyle = "rgba(255,200,50,0.6)";
    ctx.beginPath(); ctx.arc(W * 0.4 + (Math.random() - 0.5) * 80, waterY - 40, 4, 0, Math.PI * 2); ctx.fill();
  }

  // Our ship: close (lower-left, full scale), hull bottom on waterline
  ship(ctx, W * 0.06, waterY + Math.sin(f * 0.05) * 2, 3, 1, opts);
}

function sceneEthereal(ctx: CanvasRenderingContext2D, W: number, H: number, f: number, ps: ParticleSystem, opts?: SceneOpts) {
  const hasBackdrop = drawSceneBackground(ctx, W, H, {
    scene: "ethereal",
    encounterId: opts?.encounterId,
    enemyType: opts?.enemyType,
  });

  if (!hasBackdrop) {
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
  }

  if (f % 10 === 0) {
    ps.emit(1, { x: 0, y: H, w: W, h: 1, color: "rgba(200,180,255,0.4)", size: 2, life: 80, vxRange: [-0.3, 0.3], vyRange: [-0.8, -0.3] });
  }

  if (!hasBackdrop) {
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(200,180,255,${0.1 + Math.sin(f * 0.05 + i) * 0.08})`;
      ctx.fillRect((i * 127 + f * 0.5) % W, (i * 83 + f * 0.3) % H, 2, 2);
    }
  }

  ship(ctx, W * 0.35, H * WL + Math.sin(f * 0.04) * 4, 3, 0.8, opts);
}

function scenePort(ctx: CanvasRenderingContext2D, W: number, H: number, f: number, ps: ParticleSystem, opts?: SceneOpts) {
  const pal = colors(opts);
  const waterY = H * WL;
  const dockY = waterY; // dock/ground sits on waterline
  const hasBackdrop = drawSceneBackground(ctx, W, H, {
    scene: "port",
    time: opts?.atmosphere?.time,
    encounterId: opts?.encounterId,
  });

  if (!hasBackdrop) {
    ctx.fillStyle = pal?.sky ?? "#14182a";
    ctx.fillRect(0, 0, W, H);

    // Water below waterline
    ctx.fillStyle = pal?.water ?? "#1a2a4a";
    ctx.fillRect(0, waterY, W, H - waterY);

    // Dock (wooden pier on waterline)
    ctx.fillStyle = "#3a2a1a";
    ctx.fillRect(W * 0.4, dockY - 4, W * 0.6, 8);
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = "#2a1a0a";
      ctx.fillRect(W * 0.45 + i * 40, dockY, 4, 30);
    }

    // Port elements: all bottom-aligned to dockY (drawn upward from ground)
    drawSprite(ctx, "building", W * 0.44, dockY - 62, 2);
    drawSprite(ctx, "palm_big", W * 0.60, dockY - 70, 2);
    drawSprite(ctx, "building", W * 0.74, dockY - 58, 2.2);
    drawSprite(ctx, "bush", W * 0.88, dockY - 20, 2);

    // Window lights
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = `rgba(255,200,80,${0.4 + Math.sin(f * 0.04 + i * 2) * 0.2})`;
      ctx.fillRect(W * 0.52 + i * 18, dockY - 30, 3, 3);
    }
  }

  if (f % 25 === 0) {
    ps.emit(1, { x: W * 0.52, y: dockY - 35, w: 80, h: 1, color: "#f0c040", alpha: 0.3, size: 1, life: 20, vxRange: [-0.2, 0.2], vyRange: [-0.5, -0.2] });
  }

  // Ship hull bottom on waterline
  ship(ctx, W * 0.06, waterY + Math.sin(f * 0.04) * 2, 3, 1, opts);
}

function sceneUnderwater(ctx: CanvasRenderingContext2D, W: number, H: number, f: number, ps: ParticleSystem, opts?: SceneOpts) {
  const hasBackdrop = drawSceneBackground(ctx, W, H, {
    scene: "underwater",
    encounterId: opts?.encounterId,
  });

  if (!hasBackdrop) {
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
  }

  if (f % 8 === 0) {
    ps.emit(1, { x: W * 0.1, y: H * 0.9, w: W * 0.8, h: 1, color: "rgba(150,200,255,0.3)", size: 3, life: 80, vxRange: [-0.2, 0.2], vyRange: [-1, -0.5] });
  }

  if (!hasBackdrop) {
    drawSprite(ctx, "tentacle", W * 0.15, H * 0.3 + Math.sin(f * 0.04) * 8, 3, 0.6);
    drawSprite(ctx, "tentacle", W * 0.8, H * 0.4 + Math.cos(f * 0.035) * 6, 3, 0.5);
  }
}

function sceneKraken(ctx: CanvasRenderingContext2D, W: number, H: number, f: number, ps: ParticleSystem, opts?: SceneOpts) {
  const hasBackdrop = drawSceneBackground(ctx, W, H, {
    scene: "kraken",
    encounterId: opts?.encounterId,
    enemyType: opts?.enemyType,
  });

  if (!hasBackdrop) {
    ctx.fillStyle = "#080810";
    ctx.fillRect(0, 0, W, H);

    // Choppy dark water
    for (let y = 0; y < H; y += 5) {
      for (let x = 0; x < W; x += 5) {
        if (Math.sin((x + f * 2) * 0.06) * Math.cos((y + f * 1.5) * 0.07) > 0.1) {
          ctx.fillStyle = "rgba(20,10,30,0.5)";
          ctx.fillRect(x, y, 5, 5);
        }
      }
    }
  }

  const waterY = H * WL;

  if (!hasBackdrop) {
    // Sea serpent: head → body segments → tail, undulating above waterline
    const serpentY = waterY - 60;
    const segSpacing = W * 0.1;
    const segScale = 3.5;
    const headX = W * 0.06;
    drawSprite(ctx, "serpent_head", headX, serpentY + Math.sin(f * 0.05) * 12, segScale, 0.85);
    for (let i = 0; i < 5; i++) {
      const sx = headX + segSpacing * (i + 1);
      const sy = serpentY + Math.sin(f * 0.04 + (i + 1) * 1.0) * 18;
      drawSprite(ctx, "tentacle", sx, sy, segScale, 0.75);
    }
    const tailX = headX + segSpacing * 6;
    drawSprite(ctx, "serpent_tail", tailX, serpentY + Math.sin(f * 0.04 + 6.0) * 14, segScale, 0.7);
  }

  // Splash/foam
  if (f % 12 === 0) {
    ps.emit(2, { x: W * 0.1, y: waterY - 40, w: W * 0.7, h: 30, color: "rgba(60,20,80,0.4)", size: 4, life: 50, vxRange: [-1, 1], vyRange: [-0.5, 0.5] });
  }

  // Ship hull bottom on waterline
  ship(ctx, W * 0.35, waterY + Math.sin(f * 0.06) * 4, 3, 1, opts);
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
