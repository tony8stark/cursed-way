import { motion } from "framer-motion";
import type { Choice, GameState } from "../../engine/types";
import { useT } from "../../i18n";
import { getChoiceAvailability } from "../../engine/choice-availability";

interface Props {
  choice: Choice;
  index: number;
  state: GameState;
  onChoose: (choice: Choice) => void;
}

export function ChoiceCard({ choice, index, state, onChoose }: Props) {
  const t = useT();
  const availability = getChoiceAvailability(choice, state);
  const canChoose = availability.selectable;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      whileHover={canChoose ? { scale: 1.02, borderColor: "#f0c040" } : {}}
      whileTap={canChoose ? { scale: 0.98 } : {}}
      onClick={() => canChoose && onChoose(choice)}
      disabled={!canChoose}
      className={`
        w-full text-left rounded font-game text-[10px] leading-[2.2]
        px-3.5 py-3 min-h-[48px] transition-colors duration-200
        ${canChoose
          ? "bg-white/[0.03] border border-white/20 text-[#c8c8d8] hover:bg-[#f0c040]/[0.06] hover:text-[#f0c040] hover:border-[#f0c040] cursor-pointer"
          : "bg-red-500/[0.05] border border-red-500/30 text-red-300/50 cursor-not-allowed opacity-60"
        }
      `}
    >
      {choice.text}
      {availability.cantAfford ? ` ${t("cantAfford")}` : ""}
      {availability.alreadyOwned ? ` ${t("alreadyOwned")}` : ""}
      <span className="text-white/20 ml-2 text-[8px]">[{index + 1}]</span>
    </motion.button>
  );
}
