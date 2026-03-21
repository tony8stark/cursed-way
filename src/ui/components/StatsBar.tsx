import { motion, AnimatePresence } from "framer-motion";
import type { GameState } from "../../engine/types";
import { useT } from "../../i18n";
import { useGameModeStore } from "../../engine/game-mode";

interface Props {
  state: GameState;
}

function StatBox({ label, value, color, warning }: { label: string; value: string | number; color: string; warning?: boolean }) {
  return (
    <motion.div
      layout
      className="flex-1 min-w-0 rounded px-2 py-1.5 text-center"
      style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${color}22` }}
    >
      <div className="font-game text-[7px] text-white/40 leading-relaxed">{label}</div>
      <motion.div
        key={String(value)}
        initial={{ scale: 1.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="font-game text-[13px] leading-relaxed"
        style={{ color: warning ? "#c02020" : color }}
      >
        {value}
      </motion.div>
    </motion.div>
  );
}

export function StatsBar({ state }: Props) {
  const t = useT();
  const mode = useGameModeStore(s => s.mode);
  const cr = Math.min(state.curse / 15, 1);

  const dayDisplay = mode === "expedition"
    ? (cr > 0.5 ? `${state.day}̷/̶2̸0̷` : `${state.day}/20`)
    : String(state.day);

  return (
    <div className="flex gap-1.5 flex-wrap mb-3">
      <StatBox label={t("gold")} value={state.gold} color="#f0c040" />
      <StatBox label={t("crew")} value={state.crew} color="#40c0f0" warning={state.crew <= 3} />
      <StatBox
        label={t("day")}
        value={dayDisplay}
        color={cr > 0.5 ? "#8020c0" : "#c8c8d8"}
      />
      <AnimatePresence>
        {state.curse > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex-1 min-w-0"
          >
            <StatBox
              label={cr > 0.6 ? t("curseGlitch") : t("curse")}
              value={state.curse}
              color="#8020c0"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
