import { motion } from "framer-motion";
import { ACHIEVEMENTS, getUnlockedAchievements } from "../../engine/achievements";

interface Props {
  onClose: () => void;
}

export function AchievementsPanel({ onClose }: Props) {
  const unlocked = getUnlockedAchievements();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-[#0e0e2a] border border-white/10 rounded-lg p-5 max-w-[500px] w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <span className="font-game text-[12px] text-[#f0c040]">ДОСЯГНЕННЯ</span>
          <span className="font-game text-[9px] text-white/40">
            {unlocked.size}/{ACHIEVEMENTS.length}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {ACHIEVEMENTS.map((ach, i) => {
            const isUnlocked = unlocked.has(ach.id);
            return (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-center gap-3 rounded px-3 py-2.5 border ${
                  isUnlocked
                    ? "bg-[#f0c040]/[0.06] border-[#f0c040]/20"
                    : "bg-white/[0.02] border-white/5"
                }`}
              >
                <span className={`text-xl ${isUnlocked ? "" : "grayscale opacity-30"}`}>
                  {ach.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className={`font-game text-[9px] ${isUnlocked ? "text-[#e8dcc8]" : "text-white/25"}`}>
                    {isUnlocked ? ach.title : "???"}
                  </div>
                  <div className={`font-game text-[7px] mt-0.5 ${isUnlocked ? "text-white/40" : "text-white/15"}`}>
                    {ach.description}
                  </div>
                </div>
                {isUnlocked && (
                  <span className="text-[#f0c040] text-xs">✓</span>
                )}
              </motion.div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full font-game text-[10px] text-white/40 hover:text-white/70 transition-colors py-2"
        >
          ЗАКРИТИ
        </button>
      </motion.div>
    </motion.div>
  );
}
