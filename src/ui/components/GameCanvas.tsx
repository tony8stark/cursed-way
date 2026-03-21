import { useRef, useEffect } from "react";
import { SCENES } from "../../renderer/scenes";
import { ParticleSystem } from "../../renderer/particles";
import { getShipVisualState } from "../../renderer/ship-variants";
import { getAtmosphere, drawFogOverlay } from "../../renderer/atmosphere";
import { useGameStore } from "../../engine/state";
import { useLocaleStore, getT } from "../../i18n";
import type { SceneId } from "../../engine/types";
import type { SceneOpts } from "../../renderer/scenes";

interface Props {
  scene: SceneId;
  curse?: number;
  day?: number;
  enemyType?: string;
}

export function GameCanvas({ scene, curse = 0, day = 0, enemyType }: Props) {
  const locale = useLocaleStore(s => s.locale);
  const state = useGameStore(s => s.state);
  const ref = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const particlesRef = useRef(new ParticleSystem());

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const W = c.width;
    const H = c.height;
    const ps = particlesRef.current;
    ps.clear();
    let id: number;

    // Build scene opts - always use enhanced visuals
    const opts: SceneOpts = { curse, enemyType };
    if (state) {
      opts.shipVisual = getShipVisualState(state);
      opts.atmosphere = getAtmosphere(day, state.watch);
    }

    const draw = () => {
      frameRef.current++;
      const f = frameRef.current;
      const renderer = SCENES[scene] || SCENES.open_sea;

      renderer(ctx, W, H, f, ps, opts);

      ps.update();
      ps.draw(ctx);

      // Weather overlay
      if (opts.atmosphere) {
        drawFogOverlay(ctx, W, H, f, opts.atmosphere.weather);

        // Rain particles
        if (opts.atmosphere.weather === "rain" && f % 3 === 0) {
          ps.emit(3, { x: 0, y: -5, w: W, h: 1, color: "rgba(150,180,220,0.3)", size: 1, life: 25, vxRange: [0.3, 0.8], vyRange: [3, 5] });
        }
      }

      // HUD overlay
      ctx.fillStyle = "#f0c040";
      ctx.font = "bold 10px 'Press Start 2P', monospace";
      const t = getT(locale);
      ctx.fillText(`${t("day")} ${day}`, 8, 14);

      const cr = Math.min(curse / 15, 1);
      if (cr > 0) {
        ctx.fillStyle = "#8020c0";
        ctx.fillText("☠".repeat(Math.min(Math.ceil(cr * 5), 5)), W - 10 - cr * 50, 14);
      }

      id = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(id);
  }, [scene, curse, day, enemyType, locale, state]);

  return (
    <canvas
      ref={ref}
      width={380}
      height={210}
      className="w-full max-w-[760px] rounded border-2 transition-colors duration-500"
      style={{
        imageRendering: "pixelated",
        borderColor: curse > 10 ? "#8020c0" : "#2a2a5e",
      }}
    />
  );
}
