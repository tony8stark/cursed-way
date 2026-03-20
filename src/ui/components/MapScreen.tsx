import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { StatsBar } from "./StatsBar";
import { useGameStore } from "../../engine/state";
import { audioManager } from "../../audio/audio-manager";
import { useT, useLocaleStore } from "../../i18n";
import { drawWorldMap } from "../../renderer/world-map";
import { getConnectedLocations } from "../../renderer/map-data";

export function MapScreen() {
  const { state, sail, setDestination, mapState } = useGameStore();
  const t = useT();
  const locale = useLocaleStore(s => s.locale);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    audioManager.playAmbient("open_sea");
  }, []);

  // Map animation loop
  useEffect(() => {
    const c = canvasRef.current;
    if (!c || !mapState) return;
    const ctx = c.getContext("2d")!;
    let id: number;

    const draw = () => {
      frameRef.current++;
      drawWorldMap(ctx, c.width, c.height, frameRef.current, mapState, locale);

      // Map title overlay
      ctx.fillStyle = "#f0c040";
      ctx.font = "bold 8px 'Press Start 2P', monospace";
      ctx.fillText(t("mapTitle"), 8, 14);

      id = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(id);
  }, [mapState, locale, t]);

  if (!state) return null;

  const cr = Math.min(state.curse / 15, 1);

  const handleSail = () => {
    audioManager.playSFX("wave");
    sail();
  };

  const handleSetDestination = (pos: [number, number]) => {
    audioManager.playSFX("wave");
    setDestination(pos);
  };

  // Show destination choices when at a named location with no active route
  const isEnRoute = !!(mapState?.currentRoute && mapState.routeProgress < mapState.currentRoute.length);
  const destinations = (!isEnRoute && mapState)
    ? getConnectedLocations(mapState.playerPos)
        .filter(d => mapState.revealed[d.pos[1]][d.pos[0]])
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-[600px]"
    >
      <StatsBar state={state} />

      <canvas
        ref={canvasRef}
        width={380}
        height={210}
        className="w-full max-w-[760px] rounded border-2 transition-colors duration-500"
        style={{
          imageRendering: "pixelated",
          borderColor: state.curse > 10 ? "#8020c0" : "#1a3a5e",
        }}
      />

      <div className="text-center mt-4">
        {destinations.length > 0 ? (
          <div className="flex flex-col gap-2">
            <div className="font-game text-[9px] text-white/40 mb-1">
              {t("chooseDestination")}
            </div>
            {destinations.map(d => (
              <motion.button
                key={`${d.pos[0]},${d.pos[1]}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSetDestination(d.pos)}
                className="game-btn font-game text-[10px] px-4 py-2.5 border bg-transparent cursor-pointer transition-all duration-200"
                style={{ color: "#40c0f0", borderColor: "#40c0f0" }}
                onMouseOver={e => {
                  e.currentTarget.style.background = "#40c0f0";
                  e.currentTarget.style.color = "#0a0a1a";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#40c0f0";
                }}
              >
                {d.icon} {d.name[locale]}
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSail}
            className="game-btn font-game text-[12px] px-6 py-3.5 border-2 bg-transparent cursor-pointer transition-all duration-200"
            style={{
              color: cr > 0.6 ? "#8020c0" : "#40c0f0",
              borderColor: cr > 0.6 ? "#8020c0" : "#40c0f0",
            }}
            onMouseOver={e => {
              const el = e.currentTarget;
              el.style.background = cr > 0.6 ? "#8020c0" : "#40c0f0";
              el.style.color = "#0a0a1a";
            }}
            onMouseOut={e => {
              const el = e.currentTarget;
              el.style.background = "transparent";
              el.style.color = cr > 0.6 ? "#8020c0" : "#40c0f0";
            }}
          >
            {isEnRoute ? t("enRoute") : (cr > 0.6 ? t("sailGlitch") : t("sailContinue"))}
          </motion.button>
        )}

        {state.curse > 0 && state.curse < 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 font-game text-[9px] text-[#8020c0]/50"
          >
            {t("curseHint1")}
          </motion.div>
        )}
        {state.curse >= 5 && state.curse < 10 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 font-game text-[9px] text-[#8020c0]/70"
          >
            {t("curseHint2")}
          </motion.div>
        )}
        {state.curse >= 10 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 font-game text-[9px] text-[#8020c0]"
          >
            {t("curseHint3")}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
