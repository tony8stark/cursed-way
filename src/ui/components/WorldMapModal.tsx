import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { drawFullWorldMap } from "../../renderer/world-map";
import type { MapState } from "../../renderer/world-map";
import { useLocaleStore, useT } from "../../i18n";

interface WorldMapModalProps {
  mapState: MapState;
  onClose: () => void;
}

export function WorldMapModal({ mapState, onClose }: WorldMapModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const locale = useLocaleStore(s => s.locale);
  const t = useT();

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    let id: number;

    const draw = () => {
      frameRef.current++;
      drawFullWorldMap(ctx, c.width, c.height, frameRef.current, mapState, locale);

      // Title
      ctx.fillStyle = "#f0c040";
      ctx.font = "bold 8px 'Press Start 2P', monospace";
      ctx.fillText(t("worldMap"), 10, 16);

      id = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(id);
  }, [mapState, locale, t]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Map container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative w-[90vw] max-w-[900px] h-[80vh] max-h-[600px] rounded border-2 border-[#1a3a5e] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <canvas
          ref={canvasRef}
          width={900}
          height={600}
          className="w-full h-full"
          style={{ imageRendering: "pixelated" }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 font-game text-[10px] text-white/50 hover:text-white/80 transition-colors bg-transparent border-none cursor-pointer"
        >
          {t("close")} [ESC]
        </button>

        {/* Legend */}
        <div className="absolute bottom-2 left-3 font-game text-[6px] text-white/30 flex gap-4">
          <span>
            <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: "#f0c040", verticalAlign: "middle" }} />
            {t("legendShip")}
          </span>
          <span>
            <span className="inline-block w-2 h-2 border mr-1" style={{ borderColor: "rgba(64,192,240,0.5)", verticalAlign: "middle" }} />
            {t("legendViewport")}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
