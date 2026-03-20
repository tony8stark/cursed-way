import { motion } from "framer-motion";
import { GameCanvas } from "./GameCanvas";
import { useGameStore } from "../../engine/state";

export function TitleScreen() {
  const { startGame, load } = useGameStore();
  const hasSave = !!localStorage.getItem("cursed-way-save");

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
        ПРОКЛЯТИЙ<br />ГАЛЕОН
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
          20 днів. Один корабель. Кожен вибір — наслідок.
        </span>
        <br />
        <span className="font-game text-[10px] text-[#8020c0]">
          Море пам'ятає все.
        </span>
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
          ВИЙТИ В МОРЕ
        </button>

        {hasSave && (
          <button
            onClick={() => load()}
            className="font-game text-[10px] text-[#40c0f0]/60 border border-[#40c0f0]/30 bg-transparent px-4 py-2 cursor-pointer transition-all duration-200 hover:text-[#40c0f0] hover:border-[#40c0f0]"
          >
            ПРОДОВЖИТИ
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
