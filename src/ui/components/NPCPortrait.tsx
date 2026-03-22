import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getNPC, drawNPCPortrait } from "../../engine/npcs";
import { useLocaleStore } from "../../i18n";

interface NPCPortraitProps {
  npcId: string;
}

export function NPCPortraitDisplay({ npcId }: NPCPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const locale = useLocaleStore(s => s.locale);
  const npc = getNPC(npcId);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c || !npc) return;
    const ctx = c.getContext("2d")!;
    const scale = 4;
    const w = 10 * scale;
    const h = 12 * scale;

    ctx.clearRect(0, 0, c.width, c.height);

    // Dark background
    ctx.fillStyle = "rgba(10,10,20,0.6)";
    ctx.fillRect(0, 0, w, h);

    // Draw portrait
    drawNPCPortrait(ctx, npc.portrait, 0, 0, scale);

    // Border
    ctx.strokeStyle = "rgba(240,192,64,0.4)";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, w, h);
  }, [npc]);

  if (!npc) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="flex items-center gap-2 rounded border border-white/10 bg-black/30 px-2 py-1.5"
    >
      <canvas
        ref={canvasRef}
        width={40}
        height={48}
        style={{ imageRendering: "pixelated", width: 40, height: 48 }}
      />
      <div className="min-w-0">
        <div className="font-game text-[8px] text-[#f0c040] truncate">
          {npc.icon} {npc.name[locale]}
        </div>
        <div className="font-game text-[6px] text-white/40 truncate">
          {npc.title[locale]}
        </div>
      </div>
    </motion.div>
  );
}
