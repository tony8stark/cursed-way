import { motion } from "framer-motion";
import { getRunHistory } from "../../engine/history";
import { useT } from "../../i18n";

interface Props {
  onClose: () => void;
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1).toString().padStart(2, "0")} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export function HistoryPanel({ onClose }: Props) {
  const history = getRunHistory();
  const t = useT();

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
        <div className="font-game text-[12px] text-[#f0c040] mb-4">{t("pastVoyages")}</div>

        {history.length === 0 ? (
          <div className="font-game text-[9px] text-white/30 text-center py-8">
            {t("noVoyages")}
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((run, i) => (
              <motion.div
                key={run.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded px-3 py-2.5 border border-white/5 bg-white/[0.02]"
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span
                    className="font-game text-[9px]"
                    style={{ color: run.endingColor }}
                  >
                    {run.endingTitle}
                  </span>
                  <span className="font-game text-[7px] text-white/20">
                    {formatDate(run.timestamp)}
                  </span>
                </div>
                <div className="flex gap-3 font-game text-[7px]">
                  <span className="text-[#f0c040]">💰{run.gold}</span>
                  <span className="text-[#40c0f0]">👥{run.crew}</span>
                  <span className={run.karma >= 0 ? "text-[#40f8a0]" : "text-[#c02020]"}>
                    ♥{run.karma > 0 ? "+" : ""}{run.karma}
                  </span>
                  <span className="text-[#8020c0]">☠{run.curse}</span>
                  <span className="text-white/30">{t("dayPrefix")}{run.days}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full font-game text-[10px] text-white/40 hover:text-white/70 transition-colors py-2"
        >
          {t("close")}
        </button>
      </motion.div>
    </motion.div>
  );
}
