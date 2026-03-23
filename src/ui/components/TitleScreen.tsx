import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../engine/state";
import { useT, useLocaleStore } from "../../i18n";
import { useGameModeStore, type GameMode } from "../../engine/game-mode";
import { useOriginStore, ORIGINS, type OriginId } from "../../engine/origins";
import { useObjectiveStore, OBJECTIVES } from "../../engine/objectives";
import { ITEM_NAMES } from "../../engine/items-i18n";

// ── Origin portrait sprites (8x8 pixel art from pirates2-grid) ──
const ORIGIN_SPRITES: Record<OriginId, string> = {
  navy_defector: "/icons/origins/navy_defector.png",
  smuggler: "/icons/origins/smuggler.png",
  scholar: "/icons/origins/scholar.png",
  mutineer: "/icons/origins/mutineer.png",
  voodoo_priestess: "/icons/origins/voodoo_priestess.png",
  merchant_captain: "/icons/origins/merchant_captain.png",
};

// ── Decorative pirate icons for title screen ──
const DECO_ICONS = [
  "/icons/title/sword.png",
  "/icons/title/compass.png",
  "/icons/title/chest.png",
  "/icons/title/map.png",
  "/icons/title/rum.png",
  "/icons/title/anchor.png",
  "/icons/title/key.png",
  "/icons/title/bomb.png",
  "/icons/title/crystal.png",
  "/icons/title/scroll.png",
  "/icons/title/hat.png",
  "/icons/title/coin.png",
];

/** Pixel art img helper */
function PixelImg({ src, size = 32, className = "", style }: {
  src: string; size?: number; className?: string; style?: React.CSSProperties;
}) {
  return (
    <img
      src={src}
      width={size}
      height={size}
      className={className}
      style={{ imageRendering: "pixelated", ...style }}
      alt=""
    />
  );
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
      transition={{ duration: 0.3 }}
    >
      {/* Decorative icon row */}
      <div className="flex justify-center gap-3 mb-4 opacity-40">
        <PixelImg src="/icons/title/sword.png" size={28} />
        <PixelImg src="/icons/title/compass.png" size={28} />
        <PixelImg src="/icons/title/anchor.png" size={28} />
      </div>

      {/* Title */}
      <h1 className="font-game text-[22px] text-[#f0c040] leading-[2.5] mb-2">
        {t("gameTitle").split("\n").map((line, i) => (
          <span key={i}>{line}<br /></span>
        ))}
      </h1>

      {/* Ship illustration */}
      <div className="flex justify-center mb-4">
        <img
          src="/icons/ships/galleon_pirate.png"
          alt="ship"
          className="w-[120px] h-auto drop-shadow-[0_0_12px_rgba(240,192,64,0.3)]"
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      {/* Atmospheric intro text - all visible immediately */}
      <div className="mb-6 space-y-1">
        {(["introLine1", "introLine2", "introLine3", "introLine4"] as const).map((key, i) => (
          <div
            key={key}
            className={`font-game text-[9px] leading-[2.2] ${
              i < 2 ? "text-[#7a8ba8]" : "text-[#c8c8d8]"
            }`}
          >
            {t(key)}
          </div>
        ))}
      </div>

      {/* Decorative divider */}
      <div className="flex justify-center items-center gap-2 mb-6 opacity-30">
        <div className="h-px w-16 bg-[#f0c040]" />
        <PixelImg src="/icons/title/chest.png" size={24} />
        <div className="h-px w-16 bg-[#f0c040]" />
      </div>

      {/* Buttons - immediately visible */}
      <div className="flex flex-col items-center gap-3">
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
      </div>

      {/* Bottom decorative icons */}
      <div className="flex justify-center gap-4 mt-6 opacity-20">
        {DECO_ICONS.slice(0, 8).map((src, i) => (
          <PixelImg key={i} src={src} size={20} />
        ))}
      </div>
    </motion.div>
  );
}

// ── Step 2: Character Select ──

function CharacterPortrait({ originId, selected, scale = 7 }: { originId: OriginId; selected: boolean; scale?: number }) {
  const size = 8 * scale;
  return (
    <img
      src={ORIGIN_SPRITES[originId]}
      alt={originId}
      width={size}
      height={size}
      className={`transition-all duration-200 ${selected ? "brightness-110 drop-shadow-[0_0_6px_rgba(240,192,64,0.4)]" : "brightness-75 hover:brightness-100"}`}
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
      transition={{ duration: 0.3 }}
    >
      <div className="font-game text-[11px] text-[#f0c040] mb-5">
        {t("chooseYourCaptain")}
      </div>

      {/* Character cards - all visible immediately */}
      <div className="flex justify-center gap-3 mb-4 flex-wrap">
        {ORIGINS.map((o) => (
          <button
            key={o.id}
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
          </button>
        ))}
      </div>

      {/* Selected character detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={origin}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
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
            {selectedOrigin.items?.length ? ` 🎒${selectedOrigin.items.map(id => ITEM_NAMES[id]?.[locale] ?? id).join(", ")}` : ""}
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
      transition={{ duration: 0.3 }}
    >
      <div className="font-game text-[11px] text-[#f0c040] mb-5">
        {t("chooseMode")}
      </div>

      {/* Game mode selector - immediately visible */}
      <div className="flex justify-center gap-3 mb-5">
        {modes.map((m) => (
          <button
            key={m.code}
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
          </button>
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
