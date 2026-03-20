import { motion, AnimatePresence } from "framer-motion";
import type { Achievement } from "../../engine/achievements";
import { useT } from "../../i18n";
import { useLocaleStore } from "../../i18n";
import { getAchievementText } from "../../engine/achievements-i18n";

interface Props {
  achievement: Achievement | null;
  onDone: () => void;
}

export function AchievementToast({ achievement, onDone }: Props) {
  const t = useT();
  const locale = useLocaleStore(s => s.locale);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", damping: 15 }}
          onAnimationComplete={(def) => {
            if (def === "animate" || (typeof def === "object" && "opacity" in def)) {
              setTimeout(onDone, 2500);
            }
          }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-[#1a1a3e]/95 border border-[#f0c040]/40 rounded-lg px-4 py-3 shadow-lg shadow-black/40"
        >
          <span className="text-2xl">{achievement.icon}</span>
          <div>
            <div className="font-game text-[9px] text-[#f0c040] mb-1">{t("achievementLabel")}</div>
            <div className="font-game text-[10px] text-[#e8dcc8]">{getAchievementText(achievement.id, locale).title}</div>
            <div className="font-game text-[7px] text-white/40 mt-0.5">{getAchievementText(achievement.id, locale).description}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
