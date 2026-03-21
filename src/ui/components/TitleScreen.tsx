import { motion } from "framer-motion";
import { GameCanvas } from "./GameCanvas";
import { useGameStore } from "../../engine/state";
import { useT } from "../../i18n";
import { useGameModeStore, type GameMode } from "../../engine/game-mode";

export function TitleScreen() {
  const { startGame, load } = useGameStore();
  const t = useT();
  const { mode, setMode } = useGameModeStore();
  const hasSave = !!localStorage.getItem("cursed-way-save");
  const [line1, line2] = t("gameTitle").split("\n");

  const modes: { code: GameMode; label: string; desc: string }[] = [
    { code: "expedition", label: t("modeExpedition"), desc: t("modeExpeditionDesc") },
    { code: "free_roam", label: t("modeFreeRoam"), desc: t("modeFreeRoamDesc") },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center mt-10 max-w-[600px] mx-auto"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-[11px] text-[#f0c040] mb-4 tracking-[2px] font-game"
      >
        ☠ ☠ ☠
      </motion.div>

      <motion.h1
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="font-game text-[20px] text-[#f0c040] leading-[2.5]"
      >
        {line1}<br />{line2}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="my-6"
      >
        <GameCanvas scene="open_sea" curse={0} day={0} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-6 leading-[2.5]"
      >
        <span className="font-game text-[10px] text-[#c8c8d8]">
          {t("tagline1")}
        </span>
        <br />
        <span className="font-game text-[10px] text-[#8020c0]">
          {t("tagline2")}
        </span>
      </motion.div>

      {/* Game mode selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center gap-3 mb-5"
      >
        {modes.map(m => (
          <button
            key={m.code}
            onClick={() => setMode(m.code)}
            className={`font-game text-[8px] px-3 py-2 rounded border transition-all duration-200 text-left ${
              mode === m.code
                ? m.code === "free_roam"
                  ? "border-[#40f8a0] text-[#40f8a0] bg-[#40f8a0]/10"
                  : "border-[#f0c040] text-[#f0c040] bg-[#f0c040]/10"
                : "border-white/10 text-white/25 hover:text-white/40 hover:border-white/20"
            }`}
          >
            <div>{m.label}</div>
            <div className={`text-[7px] mt-1 ${
              mode === m.code ? "opacity-60" : "opacity-30"
            }`}>
              {m.desc}
            </div>
          </button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex flex-col items-center gap-3"
      >
        <button
          onClick={startGame}
          className="game-btn font-game text-[13px] text-[#f0c040] border-2 border-[#f0c040] bg-transparent px-6 py-3.5 cursor-pointer transition-all duration-200 hover:bg-[#f0c040] hover:text-[#0a0a1a]"
        >
          {t("startGame")}
        </button>

        {hasSave && (
          <button
            onClick={() => load()}
            className="font-game text-[10px] text-[#40c0f0]/60 border border-[#40c0f0]/30 bg-transparent px-4 py-2 cursor-pointer transition-all duration-200 hover:text-[#40c0f0] hover:border-[#40c0f0]"
          >
            {t("continueGame")}
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
