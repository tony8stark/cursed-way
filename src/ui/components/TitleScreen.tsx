import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../engine/state";
import { useT, useLocaleStore } from "../../i18n";
import { useGameModeStore, type GameMode } from "../../engine/game-mode";
import { useOriginStore, ORIGINS, type OriginId } from "../../engine/origins";
import { useObjectiveStore, OBJECTIVES } from "../../engine/objectives";

// ── Simple pixel art portraits for origins (16x20, palette indices) ──

const PALETTES: Record<OriginId, string[]> = {
  navy_defector: ["#1a1a2e", "#0f3460", "#16213e", "#e8b796", "#533a1f", "#c8c8d8", "#f0c040", "#2471a3"],
  smuggler: ["#1a1a2e", "#3d1c02", "#6e4b3a", "#c68642", "#1c1c1c", "#8e44ad", "#f0c040", "#e8e8e8"],
  scholar: ["#1a1a2e", "#2c2c54", "#474787", "#f5d6ba", "#95a5a6", "#c040f0", "#f0c040", "#e8e8e8"],
  mutineer: ["#1a1a2e", "#922b21", "#c0392b", "#e8b796", "#5d3a1a", "#1c1c1c", "#f0c040", "#e67e22"],
};

// 16 wide x 20 tall, '.' = transparent, hex digit = palette index
const PORTRAITS: Record<OriginId, string[]> = {
  navy_defector: [
    "......4444......",
    ".....444444.....",
    "....44444444....",
    "...2222222222...",
    "...2266666622...",
    "..22633333622...",
    "..22633333622...",
    "..22633333622...",
    "...2233333322...",
    "....33333333....",
    ".....333333.....",
    "...1111111111...",
    "..111177711111..",
    "..111111111111..",
    ".11111111111111.",
    ".11155111155111.",
    ".11111111111111.",
    "..111111111111..",
    "...1111..1111...",
    "...22......22...",
  ],
  smuggler: [
    "......4444......",
    ".....444444.....",
    "....44444444....",
    "...4444444444...",
    "...4433333344...",
    "..44333333334...",
    "..44333333334...",
    "..55333333335...",
    "...3333333333...",
    "....33333333....",
    ".....333333.....",
    "...5555555555...",
    "..555566555555..",
    "..555555555555..",
    ".55555555555555.",
    ".55522555522555.",
    ".55555555555555.",
    "..555555555555..",
    "...5555..5555...",
    "...22......22...",
  ],
  scholar: [
    "....44444444....",
    "...4444444444...",
    "..444444444444..",
    "..444444444444..",
    "..44433333444...",
    "..44333333344...",
    "..44333333344...",
    "..44333333344...",
    "...3333333333...",
    "....33333333....",
    ".....333333.....",
    "...2222222222...",
    "..222255222222..",
    "..222222222222..",
    ".22222222222222.",
    ".22211222211222.",
    ".22222222222222.",
    "..222222222222..",
    "...2222..2222...",
    "...11......11...",
  ],
  mutineer: [
    "......4444......",
    ".....444444.....",
    "....4444444.....",
    "...55444444.....",
    "...5533333355...",
    "..55333333355...",
    "..55333333355...",
    "..55333333355...",
    "...3333333333...",
    "....33333333....",
    ".....333333.....",
    "...2222222222...",
    "..222277222222..",
    "..222222222222..",
    ".22222222222222.",
    ".22255222255222.",
    ".22222222222222.",
    "..222222222222..",
    "...2222..2222...",
    "...55......55...",
  ],
};

function drawPortrait(
  ctx: CanvasRenderingContext2D,
  originId: OriginId,
  scale: number,
) {
  const palette = PALETTES[originId];
  const rows = PORTRAITS[originId];
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      const ch = rows[y][x];
      if (ch === ".") continue;
      const idx = parseInt(ch, 16);
      ctx.fillStyle = palette[idx];
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
}

// ── Steps ──

type Step = "intro" | "character" | "mode";

export function TitleScreen() {
  const { startGame, load } = useGameStore();
  const t = useT();
  const locale = useLocaleStore(s => s.locale);
  const { mode, setMode } = useGameModeStore();
  const { origin, setOrigin } = useOriginStore();
  const { objectiveId, setObjective } = useObjectiveStore();
  const hasSave = !!localStorage.getItem("cursed-way-save");

  const [step, setStep] = useState<Step>("intro");

  const modes: { code: GameMode; label: string; desc: string }[] = [
    { code: "expedition", label: t("modeExpedition"), desc: t("modeExpeditionDesc") },
    { code: "free_roam", label: t("modeFreeRoam"), desc: t("modeFreeRoamDesc") },
  ];

  const selectedOrigin = ORIGINS.find(o => o.id === origin)!;

  return (
    <div className="text-center max-w-[750px] mx-auto min-h-[400px] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {step === "intro" && (
          <IntroStep
            key="intro"
            t={t}
            hasSave={hasSave}
            onBegin={() => setStep("character")}
            onContinue={() => load()}
          />
        )}

        {step === "character" && (
          <CharacterStep
            key="character"
            t={t}
            locale={locale}
            origin={origin}
            selectedOrigin={selectedOrigin}
            onSelect={setOrigin}
            onNext={() => setStep("mode")}
            onBack={() => setStep("intro")}
          />
        )}

        {step === "mode" && (
          <ModeStep
            key="mode"
            t={t}
            locale={locale}
            mode={mode}
            modes={modes}
            objectiveId={objectiveId}
            onSetMode={setMode}
            onSetObjective={setObjective}
            onStart={startGame}
            onBack={() => setStep("character")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Step 1: Intro ──

function IntroStep({
  t, hasSave, onBegin, onContinue,
}: {
  t: ReturnType<typeof useT>;
  hasSave: boolean;
  onBegin: () => void;
  onContinue: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-[11px] text-[#f0c040] mb-3 tracking-[2px] font-game"
      >
        ☠ ☠ ☠
      </motion.div>

      <motion.h1
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="font-game text-[22px] text-[#f0c040] leading-[2.5] mb-2"
      >
        {t("gameTitle").split("\n").map((line, i) => (
          <span key={i}>{line}<br /></span>
        ))}
      </motion.h1>

      {/* Atmospheric lines with staggered fade-in */}
      <div className="mb-8 space-y-1">
        {(["introLine1", "introLine2", "introLine3", "introLine4"] as const).map((key, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.6, duration: 0.5 }}
            className={`font-game text-[9px] leading-[2.2] ${
              i < 2 ? "text-[#7a8ba8]" : "text-[#c8c8d8]"
            }`}
          >
            {t(key)}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.2, duration: 0.5 }}
        className="flex flex-col items-center gap-3"
      >
        <button
          onClick={onBegin}
          className="game-btn font-game text-[13px] text-[#f0c040] border-2 border-[#f0c040] bg-transparent px-8 py-3.5 cursor-pointer transition-all duration-200 hover:bg-[#f0c040] hover:text-[#0a0a1a]"
        >
          {t("introBegin")}
        </button>

        {hasSave && (
          <button
            onClick={onContinue}
            className="font-game text-[9px] text-[#40c0f0]/60 border border-[#40c0f0]/30 bg-transparent px-4 py-2 cursor-pointer transition-all duration-200 hover:text-[#40c0f0] hover:border-[#40c0f0]"
          >
            {t("continueGame")}
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Step 2: Character Select ──

function CharacterPortrait({ originId, selected, scale = 3 }: { originId: OriginId; selected: boolean; scale?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    drawPortrait(ctx, originId, scale);
  }, [originId, scale]);

  return (
    <canvas
      ref={canvasRef}
      width={16 * scale}
      height={20 * scale}
      className={`transition-all duration-200 ${selected ? "brightness-110" : "brightness-75 hover:brightness-100"}`}
      style={{ imageRendering: "pixelated" }}
    />
  );
}

function CharacterStep({
  t, locale, origin, selectedOrigin, onSelect, onNext, onBack,
}: {
  t: ReturnType<typeof useT>;
  locale: "uk" | "en";
  origin: OriginId;
  selectedOrigin: import("../../engine/origins").Origin;
  onSelect: (id: OriginId) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="font-game text-[11px] text-[#f0c040] mb-5"
      >
        {t("chooseYourCaptain")}
      </motion.div>

      {/* Character cards */}
      <div className="flex justify-center gap-3 mb-4 flex-wrap">
        {ORIGINS.map((o, i) => (
          <motion.button
            key={o.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            onClick={() => onSelect(o.id)}
            className={`flex flex-col items-center gap-2 px-3 py-3 rounded border transition-all duration-200 min-w-[120px] ${
              origin === o.id
                ? "border-[#f0c040] bg-[#f0c040]/8 shadow-[0_0_12px_rgba(240,192,64,0.15)]"
                : "border-white/10 hover:border-white/25 bg-white/[0.02]"
            }`}
          >
            <CharacterPortrait originId={o.id} selected={origin === o.id} />
            <div className={`font-game text-[7px] ${
              origin === o.id ? "text-[#f0c040]" : "text-white/50"
            }`}>
              {o.name[locale]}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Selected character detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={origin}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mx-auto max-w-[420px] mb-5 rounded border border-white/10 bg-white/[0.03] px-4 py-3"
        >
          <div className="font-game text-[9px] text-[#f0c040] mb-1">
            {selectedOrigin.icon} {selectedOrigin.name[locale]}
          </div>
          <div className="font-game text-[7px] text-white/55 leading-[2] mb-2">
            {selectedOrigin.desc[locale]}
          </div>
          <div className="font-game text-[7px] text-[#f0c040]/60">
            {selectedOrigin.bonuses.gold ? `💰${selectedOrigin.bonuses.gold > 0 ? "+" : ""}${selectedOrigin.bonuses.gold}` : ""}
            {selectedOrigin.bonuses.crew ? ` 👥${selectedOrigin.bonuses.crew > 0 ? "+" : ""}${selectedOrigin.bonuses.crew}` : ""}
            {selectedOrigin.bonuses.karma ? ` ⚖️${selectedOrigin.bonuses.karma > 0 ? "+" : ""}${selectedOrigin.bonuses.karma}` : ""}
            {selectedOrigin.bonuses.curse ? ` ☠️+${selectedOrigin.bonuses.curse}` : ""}
            {selectedOrigin.items?.length ? ` 🎒${selectedOrigin.items.join(", ")}` : ""}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-center gap-4">
        <button
          onClick={onBack}
          className="font-game text-[9px] text-white/30 border border-white/15 bg-transparent px-5 py-2.5 cursor-pointer transition-all duration-200 hover:text-white/50 hover:border-white/30"
        >
          {t("prevStep")}
        </button>
        <button
          onClick={onNext}
          className="game-btn font-game text-[11px] text-[#f0c040] border-2 border-[#f0c040] bg-transparent px-6 py-2.5 cursor-pointer transition-all duration-200 hover:bg-[#f0c040] hover:text-[#0a0a1a]"
        >
          {t("nextStep")}
        </button>
      </div>
    </motion.div>
  );
}

// ── Step 3: Mode & Start ──

function ModeStep({
  t, locale, mode, modes, objectiveId, onSetMode, onSetObjective, onStart, onBack,
}: {
  t: ReturnType<typeof useT>;
  locale: "uk" | "en";
  mode: GameMode;
  modes: { code: GameMode; label: string; desc: string }[];
  objectiveId: string | null;
  onSetMode: (m: GameMode) => void;
  onSetObjective: (id: string | null) => void;
  onStart: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="font-game text-[11px] text-[#f0c040] mb-5"
      >
        {t("chooseMode")}
      </motion.div>

      {/* Game mode selector */}
      <div className="flex justify-center gap-3 mb-5">
        {modes.map((m, i) => (
          <motion.button
            key={m.code}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            onClick={() => onSetMode(m.code)}
            className={`font-game text-[9px] px-4 py-3 rounded border transition-all duration-200 text-left min-w-[160px] ${
              mode === m.code
                ? m.code === "free_roam"
                  ? "border-[#40f8a0] text-[#40f8a0] bg-[#40f8a0]/10"
                  : "border-[#f0c040] text-[#f0c040] bg-[#f0c040]/10"
                : "border-white/15 text-white/45 hover:text-white/60 hover:border-white/30"
            }`}
          >
            <div>{m.label}</div>
            <div className={`text-[7px] mt-1 ${mode === m.code ? "opacity-60" : "opacity-30"}`}>
              {m.desc}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Objective selector (Free Roam only) */}
      <AnimatePresence>
        {mode === "free_roam" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-5 overflow-hidden"
          >
            <div className="font-game text-[8px] text-white/55 mb-2">
              {t("chooseObjective")}
            </div>
            <div className="flex justify-center gap-2 flex-wrap">
              <button
                onClick={() => onSetObjective(null)}
                className={`font-game text-[8px] px-3 py-2 rounded border transition-all duration-200 text-left min-w-[120px] ${
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
                  onClick={() => onSetObjective(obj.id)}
                  className={`font-game text-[8px] px-3 py-2 rounded border transition-all duration-200 text-left min-w-[120px] ${
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
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-center gap-4">
        <button
          onClick={onBack}
          className="font-game text-[9px] text-white/30 border border-white/15 bg-transparent px-5 py-2.5 cursor-pointer transition-all duration-200 hover:text-white/50 hover:border-white/30"
        >
          {t("prevStep")}
        </button>
        <button
          onClick={onStart}
          className="game-btn font-game text-[13px] text-[#f0c040] border-2 border-[#f0c040] bg-transparent px-8 py-3 cursor-pointer transition-all duration-200 hover:bg-[#f0c040] hover:text-[#0a0a1a]"
        >
          {t("startGame")}
        </button>
      </div>
    </motion.div>
  );
}
