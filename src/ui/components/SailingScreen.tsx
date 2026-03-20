import { useEffect } from "react";
import { motion } from "framer-motion";
import { GameCanvas } from "./GameCanvas";
import { StatsBar } from "./StatsBar";
import { useGameStore } from "../../engine/state";
import { audioManager } from "../../audio/audio-manager";

export function SailingScreen() {
  const { state, sail } = useGameStore();

  useEffect(() => {
    audioManager.playAmbient("open_sea");
  }, []);

  if (!state) return null;

  const cr = Math.min(state.curse / 15, 1);

  const handleSail = () => {
    audioManager.playSFX("wave");
    sail();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-[600px]"
    >
      <StatsBar state={state} />
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
            const t = e.currentTarget;
            t.style.background = cr > 0.6 ? "#8020c0" : "#40c0f0";
            t.style.color = "#0a0a1a";
          }}
          onMouseOut={e => {
            const t = e.currentTarget;
            t.style.background = "transparent";
            t.style.color = cr > 0.6 ? "#8020c0" : "#40c0f0";
          }}
        >
          {cr > 0.6 ? "П̸Л̵И̶В̷Т̸И̵..." : "ПЛИВТИ ДАЛІ"}
        </motion.button>

        {state.curse > 0 && state.curse < 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 font-game text-[9px] text-[#8020c0]/50"
          >
            Щось дивне у повітрі...
          </motion.div>
        )}
        {state.curse >= 5 && state.curse < 10 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 font-game text-[9px] text-[#8020c0]/70"
          >
            Тіні рухаються самі по собі
          </motion.div>
        )}
        {state.curse >= 10 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 font-game text-[9px] text-[#8020c0]"
          >
            Р̶Е̷А̷Л̸Ь̵Н̸І̸С̷Т̸Ь̵ ̵Т̷Р̸І̶Щ̷И̸Т̵Ь̷
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
