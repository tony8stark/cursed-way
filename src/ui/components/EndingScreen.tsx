import { motion } from "framer-motion";
import { GameCanvas } from "./GameCanvas";
import { useGameStore } from "../../engine/state";

function StatBox({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div
      className="flex-1 min-w-0 rounded px-2 py-1.5 text-center"
      style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${color}33` }}
    >
      <div className="font-game text-[7px] text-white/50 leading-relaxed">{label}</div>
      <div className="font-game text-[13px] leading-relaxed" style={{ color }}>{value}</div>
    </div>
  );
}

export function EndingScreen() {
  const { state, quest, endingIndex, startGame } = useGameStore();
  if (!state || !quest || endingIndex === null) return null;

  const ending = quest.endings[endingIndex];
  const endingText = typeof ending.text === "function" ? ending.text(state) : ending.text;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="text-center max-w-[600px] mt-5"
    >
      <GameCanvas scene="ethereal" curse={state.curse} day={state.day} />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="my-5"
      >
        <span className="font-game text-[13px]" style={{ color: ending.color }}>
          {ending.title}
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mx-3 mb-6 leading-[2.5]"
      >
        <span className="font-game text-[10px] text-[#c8c8d8]">{endingText}</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="flex justify-center gap-2.5 mb-5 flex-wrap"
      >
        <StatBox label="ЗОЛОТО" value={state.gold} color="#f0c040" />
        <StatBox label="КОМАНДА" value={state.crew} color="#40c0f0" />
        <StatBox
          label="КАРМА"
          value={state.karma > 0 ? `+${state.karma}` : state.karma}
          color={state.karma >= 0 ? "#40f8a0" : "#c02020"}
        />
        <StatBox label="ПРОКЛЯТТЯ" value={state.curse} color="#8020c0" />
      </motion.div>

      {/* Journey log */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <div className="mb-2">
          <span className="font-game text-[8px] text-[#c8c8d8]">
            ЖУРНАЛ ({state.log.length}):
          </span>
        </div>
        <div className="max-h-[160px] overflow-y-auto text-left px-3 py-2 bg-black/40 rounded mb-5">
          {state.log.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2 + i * 0.05 }}
              className="mb-1.5"
            >
              <span className="font-game text-[7px] text-[#f0c040]">Д{l.day}</span>{" "}
              <span className="font-game text-[7px] text-[#c8c8d8]">{l.title}</span>{" "}
              <span className="font-game text-[7px] text-white/30">{l.summary}</span>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="game-btn font-game text-[12px] text-[#f0c040] border-2 border-[#f0c040] bg-transparent px-6 py-3.5 cursor-pointer transition-all duration-200 hover:bg-[#f0c040] hover:text-[#0a0a1a]"
        >
          ЗНОВУ В МОРЕ
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
