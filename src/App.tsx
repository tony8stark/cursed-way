import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "./engine/state";
import { cursedGalleon } from "./quests/cursed-galleon";
import { TitleScreen } from "./ui/components/TitleScreen";
import { SailingScreen } from "./ui/components/SailingScreen";
import { EncounterScreen } from "./ui/components/EncounterScreen";
import { EndingScreen } from "./ui/components/EndingScreen";
import { audioManager } from "./audio/audio-manager";

function rand(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

export default function App() {
  const { screen, state, setQuest } = useGameStore();
  const [glitch, setGlitch] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setQuest(cursedGalleon);
  }, [setQuest]);

  useEffect(() => {
    if (state && state.curse >= 8) {
      const iv = setInterval(() => {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 80 + Math.random() * 150);
      }, 1500 + Math.random() * 3000);
      return () => clearInterval(iv);
    }
    setGlitch(false);
  }, [state?.curse]);

  const toggleMute = useCallback(() => {
    setMuted(m => {
      audioManager.setMuted(!m);
      return !m;
    });
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center px-3 py-4 font-game text-[#c8c8d8] transition-all duration-500 overflow-hidden relative"
      style={{
        background: glitch
          ? `linear-gradient(${Math.random() * 360}deg, #1a0a2e, #0a1a1a)`
          : "linear-gradient(180deg, #0a0a14, #1a1a3e)",
        transform: glitch ? `translate(${rand(-3, 3)}px, ${rand(-2, 2)}px)` : "none",
      }}
    >
      {state && state.curse >= 8 && (
        <div
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)",
            opacity: Math.min(state.curse / 15, 1) * 0.5,
          }}
        />
      )}

      <button
        onClick={toggleMute}
        className="fixed top-3 right-3 z-50 font-game text-[10px] text-white/30 hover:text-white/60 transition-colors bg-transparent border-none cursor-pointer"
      >
        {muted ? "🔇" : "🔊"}
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col items-center"
        >
          {screen === "title" && <TitleScreen />}
          {screen === "sailing" && <SailingScreen />}
          {screen === "encounter" && <EncounterScreen />}
          {screen === "ending" && <EndingScreen />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
