import { useEffect, useCallback, useMemo, useRef } from "react";
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
import { useObjectiveStore, getObjective } from "../../engine/objectives";
import { FactionBar } from "./FactionBar";
import { NPCPortraitDisplay } from "./NPCPortrait";
import { NPCS } from "../../engine/npcs";

export function EncounterScreen() {
  const { state, encounter, result, pendingChain, makeChoice, continueSailing, mapState } = useGameStore();
  const t = useT();
  const objectiveId = useObjectiveStore(s => s.objectiveId);
  const objectiveDef = objectiveId ? getObjective(objectiveId) : null;

  useEffect(() => {
    if (encounter?.scene) {
      audioManager.playAmbient(encounter.scene);
    }
    // Reset choice guard when a new encounter loads
    choosingRef.current = false;
  }, [encounter]);

  const choosingRef = useRef(false);

  const handleChoice = useCallback((choice: Choice) => {
    // Guard against double-click / keyboard race condition
    if (choosingRef.current) return;
    choosingRef.current = true;

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
      const available = encounter.choices.filter(ch => (!ch.requires_item || state.inventory.includes(ch.requires_item)) && (!ch.requires_flag || state.flags.has(ch.requires_flag)));
      const idx = parseInt(e.key) - 1;
      if (idx >= 0 && idx < available.length) {
        const ch = available[idx];
        // Calculate worst-case cost: fixed negative or max of negative range
        const g = ch.eff.gold;
        let cost = 0;
        if (typeof g === "number" && g < 0) cost = Math.abs(g);
        else if (Array.isArray(g) && g[0] < 0) cost = Math.abs(Math.min(g[0], g[1]));
        if (cost <= state.gold) {
          handleChoice(ch);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [encounter, result, state, handleChoice, handleContinue]);

  // Detect NPC: explicit field, encounter ID pattern, or choice flag match
  const npcId = useMemo(() => {
    if (!encounter) return null;
    if (encounter.npc) return encounter.npc;
    // Match encounter ID patterns to NPC IDs
    const id = encounter.id;
    if (id.startsWith("npc_bones")) return "first_mate_bones";
    if (id.startsWith("npc_vega")) return "pirate_queen";
    if (id.startsWith("npc_kojo")) return "bosun";
    // Check if any choice sets a flag matching an NPC metFlag
    for (const ch of encounter.choices) {
      if (typeof ch.flag === "string") {
        const npc = Object.values(NPCS).find(n => n.metFlag === ch.flag);
        if (npc) return npc.id;
      }
    }
    return null;
  }, [encounter]);

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
              .filter(ch => (!ch.requires_item || state.inventory.includes(ch.requires_item)) && (!ch.requires_flag || state.flags.has(ch.requires_flag)))
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
              className={`game-btn font-game text-[11px] border-2 bg-transparent px-6 py-3.5 cursor-pointer transition-all duration-200 ${
                pendingChain
                  ? "text-[#f0c040] border-[#f0c040] hover:bg-[#f0c040] hover:text-[#0a0a1a]"
                  : "text-[#40c0f0] border-[#40c0f0] hover:bg-[#40c0f0] hover:text-[#0a0a1a]"
              }`}
            >
              {pendingChain ? t("continueChain") : t("continueButton")}
            </motion.button>
            <span className="font-game text-[8px] text-white/20 ml-3">[Space]</span>
          </motion.div>
        )}
      </div>

      {/* Right: Stats sidebar + encounter text */}
      <div className="w-[280px] shrink-0 flex flex-col gap-3">
        <StatsBar state={state} />
        <FactionBar reps={state.factionReps} />
        <InventoryBar inventory={state.inventory} artifactLog={state.artifactLog} />

        {/* Compact objective indicator */}
        {objectiveDef && state && (() => {
          const prog = objectiveDef.check(state, mapState ?? null);
          return (
            <div className="flex items-center gap-2 px-2 py-1.5 rounded border border-white/10 bg-black/20">
              <span className="text-[10px]">{objectiveDef.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="h-[3px] bg-white/10 rounded overflow-hidden">
                  <div
                    className="h-full rounded transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (prog.current / prog.target) * 100)}%`,
                      background: prog.complete ? "#40f8a0" : "#f0c040",
                    }}
                  />
                </div>
              </div>
              <span className="font-game text-[7px] text-white/30">
                {prog.current}/{prog.target}
                {prog.complete && <span className="text-[#40f8a0]"> ✓</span>}
              </span>
            </div>
          );
        })()}

        {/* NPC portrait (if encounter involves an NPC) */}
        {npcId && <NPCPortraitDisplay npcId={npcId} />}

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
