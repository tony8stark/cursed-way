import { motion } from "framer-motion";
import { useGameStore } from "../../engine/state";
import { useT, useLocaleStore } from "../../i18n";
import { useGameModeStore, type GameMode } from "../../engine/game-mode";
import { useOriginStore, ORIGINS } from "../../engine/origins";
import { useObjectiveStore, OBJECTIVES } from "../../engine/objectives";

export function TitleScreen() {
  const { startGame, load } = useGameStore();
  const t = useT();
  const locale = useLocaleStore(s => s.locale);
  const { mode, setMode } = useGameModeStore();
  const { origin, setOrigin } = useOriginStore();
  const { objectiveId, setObjective } = useObjectiveStore();
  const hasSave = !!localStorage.getItem("cursed-way-save");
  const [line1, line2] = t("gameTitle").split("\n");

  const modes: { code: GameMode; label: string; desc: string }[] = [
    { code: "expedition", label: t("modeExpedition"), desc: t("modeExpeditionDesc") },
    { code: "free_roam", label: t("modeFreeRoam"), desc: t("modeFreeRoamDesc") },
  ];

  const selectedOrigin = ORIGINS.find(o => o.id === origin)!;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center mt-6 max-w-[700px] mx-auto"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-[11px] text-[#f0c040] mb-3 tracking-[2px] font-game"
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
        transition={{ delay: 0.4 }}
        className="mb-4 leading-[2.5]"
      >
        <span className="font-game text-[10px] text-[#c8c8d8]">
          {t("tagline1")}
        </span>
        <br />
        <span className="font-game text-[10px] text-[#8020c0]">
          {t("tagline2")}
        </span>
      </motion.div>

      {/* Origin selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-4"
      >
        <div className="font-game text-[8px] text-white/55 mb-2">
          {t("chooseOrigin")}
        </div>
        <div className="flex justify-center gap-2 flex-wrap">
          {ORIGINS.map(o => (
            <button
              key={o.id}
              onClick={() => setOrigin(o.id)}
              className={`font-game text-[8px] px-3 py-2 rounded border transition-all duration-200 text-left min-w-[140px] ${
                origin === o.id
                  ? "border-[#f0c040] text-[#f0c040] bg-[#f0c040]/10"
                  : "border-white/15 text-white/45 hover:text-white/60 hover:border-white/30"
              }`}
            >
              <div>{o.icon} {o.name[locale]}</div>
            </button>
          ))}
        </div>
        {/* Selected origin description */}
        <motion.div
          key={origin}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 font-game text-[7px] text-white/60 leading-[2] max-w-[400px] mx-auto"
        >
          {selectedOrigin.desc[locale]}
          <div className="mt-1 text-[#f0c040]/60">
            {selectedOrigin.bonuses.gold ? `💰${selectedOrigin.bonuses.gold > 0 ? "+" : ""}${selectedOrigin.bonuses.gold}` : ""}
            {selectedOrigin.bonuses.crew ? ` 👥${selectedOrigin.bonuses.crew > 0 ? "+" : ""}${selectedOrigin.bonuses.crew}` : ""}
            {selectedOrigin.bonuses.karma ? ` ⚖️${selectedOrigin.bonuses.karma > 0 ? "+" : ""}${selectedOrigin.bonuses.karma}` : ""}
            {selectedOrigin.bonuses.curse ? ` ☠️+${selectedOrigin.bonuses.curse}` : ""}
            {selectedOrigin.items?.length ? ` 🎒${selectedOrigin.items.join(", ")}` : ""}
          </div>
        </motion.div>
      </motion.div>

      {/* Game mode selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
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
                : "border-white/15 text-white/45 hover:text-white/60 hover:border-white/30"
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

      {/* Objective selector (Free Roam only) */}
      {mode === "free_roam" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mb-4"
        >
          <div className="font-game text-[8px] text-white/55 mb-2">
            {t("chooseObjective")}
          </div>
          <div className="flex justify-center gap-2 flex-wrap">
            <button
              onClick={() => setObjective(null)}
              className={`font-game text-[8px] px-3 py-2 rounded border transition-all duration-200 text-left min-w-[130px] ${
                !objectiveId
                  ? "border-[#40f8a0] text-[#40f8a0] bg-[#40f8a0]/10"
                  : "border-white/15 text-white/45 hover:text-white/60 hover:border-white/30"
              }`}
            >
              <div>🌊 {t("objectiveNone")}</div>
              <div className={`text-[7px] mt-1 ${!objectiveId ? "opacity-60" : "opacity-30"}`}>
                {t("objectiveNoneDesc")}
              </div>
            </button>
            {OBJECTIVES.map(obj => (
              <button
                key={obj.id}
                onClick={() => setObjective(obj.id)}
                className={`font-game text-[8px] px-3 py-2 rounded border transition-all duration-200 text-left min-w-[130px] ${
                  objectiveId === obj.id
                    ? "border-[#f0c040] text-[#f0c040] bg-[#f0c040]/10"
                    : "border-white/15 text-white/45 hover:text-white/60 hover:border-white/30"
                }`}
              >
                <div>{obj.icon} {obj.name[locale]}</div>
                <div className={`text-[7px] mt-1 ${objectiveId === obj.id ? "opacity-60" : "opacity-30"}`}>
                  {obj.desc[locale]}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
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
