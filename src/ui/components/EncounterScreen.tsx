import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { GameCanvas } from "./GameCanvas";
import { StatsBar } from "./StatsBar";
import { ChoiceCard } from "./ChoiceCard";
import { TypewriterText } from "./TypewriterText";
import { useGameStore } from "../../engine/state";
import { audioManager } from "../../audio/audio-manager";
import { useT } from "../../i18n";
import type { Choice } from "../../engine/types";
import { InventoryBar } from "./InventoryBar";

export function EncounterScreen() {
  const { state, encounter, result, makeChoice, continueSailing } = useGameStore();
  const t = useT();

  useEffect(() => {
    if (encounter?.scene) {
      audioManager.playAmbient(encounter.scene);
    }
  }, [encounter?.scene]);

  const handleChoice = useCallback((choice: Choice) => {
    audioManager.playSFX("click");

    const goldEff = choice.eff.gold;
    const goldVal = typeof goldEff === "number" ? goldEff : Array.isArray(goldEff) ? goldEff[0] : 0;
    if (goldVal > 0) setTimeout(() => audioManager.playSFX("coin"), 200);
    if ((choice.eff.curse ?? 0) > 0) setTimeout(() => audioManager.playSFX("curse"), 300);
    const crewEff = choice.eff.crew;
    const crewVal = typeof crewEff === "number" ? crewEff : Array.isArray(crewEff) ? crewEff[0] : 0;
    if (crewVal < 0) setTimeout(() => audioManager.playSFX("crewLoss"), 250);

    makeChoice(choice);
  }, [makeChoice]);

  const handleContinue = useCallback(() => {
    audioManager.playSFX("splash");
    continueSailing();
  }, [continueSailing]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (result) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleContinue();
        }
        return;
      }
      if (!encounter || !state) return;
      const available = encounter.choices.filter(ch => !ch.requires_item || state.inventory.includes(ch.requires_item));
      const idx = parseInt(e.key) - 1;
      if (idx >= 0 && idx < available.length) {
        const ch = available[idx];
        const cost = ch.eff.gold && typeof ch.eff.gold === "number" && ch.eff.gold < 0
          ? Math.abs(ch.eff.gold) : 0;
        if (cost <= state.gold) {
          handleChoice(ch);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [encounter, result, state, handleChoice, handleContinue]);

  if (!state || !encounter) return null;

  const title = typeof encounter.title === "function" ? encounter.title(state) : encounter.title;
  const text = typeof encounter.text === "function" ? encounter.text(state) : encounter.text;
  const scene = encounter.scene || "open_sea";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-[1100px] flex gap-4"
    >
      {/* Left: Scene canvas */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        <GameCanvas scene={scene} curse={state.curse} day={state.day} enemyType={encounter.enemyType} />

        {/* Choices below canvas */}
        {!result ? (
          <div className="flex flex-col gap-2">
            {encounter.choices
              .filter(ch => !ch.requires_item || state.inventory.includes(ch.requires_item))
              .map((ch, i) => (
              <ChoiceCard
                key={i}
                choice={ch}
                index={i}
                state={state}
                onChoose={handleChoice}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white/[0.04] border border-white/[0.12] rounded px-3.5 py-3 mb-3 leading-[2.4]">
              <TypewriterText
                text={result}
                speed={20}
                className="font-game text-[10px] text-[#e8dcc8]"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
              className="game-btn font-game text-[11px] text-[#40c0f0] border-2 border-[#40c0f0] bg-transparent px-6 py-3.5 cursor-pointer transition-all duration-200 hover:bg-[#40c0f0] hover:text-[#0a0a1a]"
            >
              {t("continueButton")}
            </motion.button>
            <span className="font-game text-[8px] text-white/20 ml-3">[Space]</span>
          </motion.div>
        )}
      </div>

      {/* Right: Stats sidebar + encounter text */}
      <div className="w-[280px] shrink-0 flex flex-col gap-3">
        <StatsBar state={state} />
        <InventoryBar inventory={state.inventory} />

        {/* Encounter narrative */}
        <div className="rounded border border-white/10 bg-black/30 px-3 py-3 flex-1">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="mb-3"
          >
            <span
              className="font-game text-[11px]"
              style={{ color: encounter.requires ? "#8020c0" : "#f0c040" }}
            >
              {title}
            </span>
          </motion.div>

          <div className="leading-[2.4]">
            <TypewriterText
              text={text}
              speed={25}
              className="font-game text-[9px] text-[#c8c8d8]"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
