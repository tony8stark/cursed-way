import { useRef, useEffect } from "react";
import { SCENES } from "../../renderer/scenes";
import { ParticleSystem } from "../../renderer/particles";
import type { SceneId } from "../../engine/types";

interface Props {
  scene: SceneId;
  curse?: number;
  day?: number;
  enemyType?: string;
}

export function GameCanvas({ scene, curse = 0, day = 0, enemyType }: Props) {
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

    const draw = () => {
      frameRef.current++;
      const f = frameRef.current;
      const renderer = SCENES[scene] || SCENES.open_sea;

      renderer(ctx, W, H, f, ps, { curse, enemyType });

      ps.update();
      ps.draw(ctx);

      // HUD overlay
      ctx.fillStyle = "#f0c040";
      ctx.font = "bold 10px 'Press Start 2P', monospace";
      ctx.fillText(`ДЕНЬ ${day}`, 8, 14);

      const cr = Math.min(curse / 15, 1);
      if (cr > 0) {
        ctx.fillStyle = "#8020c0";
        ctx.fillText("☠".repeat(Math.min(Math.ceil(cr * 5), 5)), W - 10 - cr * 50, 14);
      }

      id = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(id);
  }, [scene, curse, day, enemyType]);

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
