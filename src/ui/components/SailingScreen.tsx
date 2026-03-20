import { useEffect } from "react";
import { motion } from "framer-motion";
import { GameCanvas } from "./GameCanvas";
import { StatsBar } from "./StatsBar";
import { useGameStore } from "../../engine/state";
import { audioManager } from "../../audio/audio-manager";
import { useT } from "../../i18n";
import { InventoryBar } from "./InventoryBar";

export function SailingScreen() {
  const { state, sail } = useGameStore();
  const t = useT();

  useEffect(() => {
    audioManager.playAmbient("open_sea");
  }, []);

  if (!state) return null;

  const cr = Math.min(state.curse / 15, 1);

  const handleSail = () => {
    audioManager.playSFX("splash");
    sail();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-[600px]"
    >
      <StatsBar state={state} />
      <InventoryBar inventory={state.inventory} />
      <GameCanvas scene="open_sea" curse={state.curse} day={state.day} />

      <div className="text-center mt-4">
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
          {cr > 0.6 ? t("sailGlitch") : t("sailContinue")}
        </motion.button>

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
