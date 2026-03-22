import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StatsBar } from "./StatsBar";
import { useGameStore } from "../../engine/state";
import { audioManager } from "../../audio/audio-manager";
import { useT, useLocaleStore } from "../../i18n";
import { drawWorldMap } from "../../renderer/world-map";
import { getConnectedLocations } from "../../renderer/map-data";
import { InventoryBar } from "./InventoryBar";
import { useObjectiveStore, getObjective } from "../../engine/objectives";
import { FactionBar } from "./FactionBar";
import { WorldMapModal } from "./WorldMapModal";

export function MapScreen() {
  const { state, sail, setDestination, mapState } = useGameStore();
  const t = useT();
  const locale = useLocaleStore(s => s.locale);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const [showWorldMap, setShowWorldMap] = useState(false);

  useEffect(() => {
    audioManager.playAmbient("open_sea");
  }, []);

  // ESC to close world map
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && showWorldMap) {
      setShowWorldMap(false);
    }
  }, [showWorldMap]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

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

      // World map hint (bottom-right)
      ctx.fillStyle = "rgba(240,192,64,0.3)";
      ctx.font = "bold 5px 'Press Start 2P', monospace";
      ctx.fillText("🗺️ " + t("worldMapTitle"), c.width - 70, c.height - 6);

      id = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(id);
  }, [mapState, locale, t]);

  if (!state) return null;

  const cr = Math.min(state.curse / 15, 1);

  const handleSail = () => {
    audioManager.playSFX("splash");
    sail();
  };

  const handleSetDestination = (pos: [number, number]) => {
    audioManager.playSFX("splash");
    setDestination(pos);
  };

  // Show destination choices when at a named location with no active route
  const isEnRoute = !!(mapState?.currentRoute && mapState.routeProgress < mapState.currentRoute.length);
  const destinations = (!isEnRoute && mapState)
    ? getConnectedLocations(mapState.playerPos)
    : [];

  // Objective progress
  const objectiveId = useObjectiveStore(s => s.objectiveId);
  const objectiveDef = objectiveId ? getObjective(objectiveId) : null;
  const objectiveProgress = objectiveDef && state
    ? objectiveDef.check(state, mapState ?? null)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-[1100px] flex gap-4"
    >
      {/* Left: Map canvas (takes most space) */}
      <div className="flex-1 min-w-0">
        <canvas
          ref={canvasRef}
          width={520}
          height={300}
          className="w-full rounded border-2 transition-colors duration-500 cursor-pointer"
          style={{
            imageRendering: "pixelated",
            borderColor: state.curse > 10 ? "#8020c0" : "#1a3a5e",
          }}
          onClick={() => setShowWorldMap(true)}
          title={t("openWorldMap")}
        />
      </div>

      {/* Right: Sidebar with stats, inventory, navigation */}
      <div className="w-[260px] shrink-0 flex flex-col gap-3">
        <StatsBar state={state} />
        <FactionBar reps={state.factionReps} />
        <InventoryBar inventory={state.inventory} artifactLog={state.artifactLog} />

        {/* Objective progress */}
        {objectiveDef && objectiveProgress && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded border px-3 py-2"
            style={{
              borderColor: objectiveProgress.complete ? "#40f8a0" : "#f0c040",
              background: objectiveProgress.complete ? "rgba(64,248,160,0.08)" : "rgba(0,0,0,0.3)",
            }}
          >
            <div className="font-game text-[7px] text-white/40 mb-1">
              {t("objectiveProgress")}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px]">{objectiveDef.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-game text-[8px]" style={{ color: objectiveProgress.complete ? "#40f8a0" : "#f0c040" }}>
                  {objectiveDef.name[locale]}
                </div>
                {/* Progress bar */}
                <div className="mt-1 h-[4px] bg-white/10 rounded overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (objectiveProgress.current / objectiveProgress.target) * 100)}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full rounded"
                    style={{ background: objectiveProgress.complete ? "#40f8a0" : "#f0c040" }}
                  />
                </div>
                <div className="font-game text-[7px] text-white/30 mt-1">
                  {objectiveProgress.current}/{objectiveProgress.target}
                  {objectiveProgress.complete && (
                    <span className="text-[#40f8a0] ml-2">✓</span>
                  )}
                </div>
              </div>
            </div>
            {objectiveProgress.complete && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2"
              >
                <div className="font-game text-[7px] text-[#40f8a0]/70 mb-2">
                  {t("objectiveCompleteHint")}
                </div>
                <button
                  onClick={() => {
                    audioManager.playSFX("coin");
                    const { state: currentState, quest } = useGameStore.getState();
                    if (currentState && quest) {
                      currentState.flags.add("objective_complete");
                      currentState.flags.add(`objective_${objectiveId}`);
                      const idx = quest.endings.findIndex(e => e.req(currentState));
                      useGameStore.setState({
                        endingIndex: idx >= 0 ? idx : quest.endings.length - 1,
                        screen: "ending",
                        state: currentState,
                      });
                      useGameStore.getState().clearSave();
                    }
                  }}
                  className="game-btn font-game text-[9px] w-full px-3 py-2 border bg-transparent cursor-pointer transition-all duration-200"
                  style={{ color: "#40f8a0", borderColor: "#40f8a0" }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = "#40f8a0";
                    e.currentTarget.style.color = "#0a0a1a";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#40f8a0";
                  }}
                >
                  {t("objectiveEndVoyage")}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Navigation panel */}
        <div className="rounded border border-white/10 bg-black/30 px-3 py-3">
          {destinations.length > 0 ? (
            <div className="flex flex-col gap-2">
              <div className="font-game text-[8px] text-white/40 mb-1">
                {t("chooseDestination")}
              </div>
              {destinations.map(d => (
                <motion.button
                  key={`${d.pos[0]},${d.pos[1]}`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSetDestination(d.pos)}
                  className="game-btn font-game text-[9px] px-3 py-2 border bg-transparent cursor-pointer transition-all duration-200 text-left"
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
              className="game-btn font-game text-[11px] w-full px-4 py-3 border-2 bg-transparent cursor-pointer transition-all duration-200"
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
        </div>

        {/* Hints & delayed effects */}
        <div className="flex flex-col gap-1.5">
          {state.delayedEffects
            .filter(d => d.hint && d.triggerDay - state.day <= 2)
            .map((d, i) => (
              <motion.div
                key={`hint-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="font-game text-[7px] text-yellow-400/50 px-1"
              >
                {d.hint}
              </motion.div>
            ))}

          {state.curse > 0 && state.curse < 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="font-game text-[8px] text-[#e0a0ff] px-1"
            >
              {t("curseHint1")}
            </motion.div>
          )}
          {state.curse >= 5 && state.curse < 10 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="font-game text-[8px] text-[#ff80e0] px-1"
            >
              {t("curseHint2")}
            </motion.div>
          )}
          {state.curse >= 10 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="font-game text-[8px] text-[#ff60ff] px-1 drop-shadow-[0_0_6px_rgba(255,96,255,0.5)]"
            >
              {t("curseHint3")}
            </motion.div>
          )}
        </div>
      </div>

      {/* World map modal */}
      <AnimatePresence>
        {showWorldMap && mapState && (
          <WorldMapModal
            mapState={mapState}
            onClose={() => setShowWorldMap(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
