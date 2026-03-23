import { useEffect, useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "./engine/state";
import { getCursedGalleon } from "./quests/cursed-galleon";
import { checkAndUnlockAchievements, type Achievement } from "./engine/achievements";
import { saveRun } from "./engine/history";
import { TitleScreen } from "./ui/components/TitleScreen";
import { MapScreen } from "./ui/components/MapScreen";
import { EncounterScreen } from "./ui/components/EncounterScreen";
import { EndingScreen } from "./ui/components/EndingScreen";
import { AchievementToast } from "./ui/components/AchievementToast";
import { ItemToast } from "./ui/components/ItemToast";
import { AchievementsPanel } from "./ui/components/AchievementsPanel";
import { HistoryPanel } from "./ui/components/HistoryPanel";
import { NPCJournal } from "./ui/components/NPCJournal";
import { SettingsModal } from "./ui/components/SettingsModal";
import { audioManager } from "./audio/audio-manager";
import { useLocaleStore } from "./i18n";
import { useT } from "./i18n";

function rand(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

export default function App() {
  const { screen, state, quest, endingIndex, setQuest } = useGameStore();
  const locale = useLocaleStore(s => s.locale);
  const t = useT();
  const [glitch, setGlitch] = useState(false);
  const [muted, setMuted] = useState(false);
  const [toastQueue, setToastQueue] = useState<Achievement[]>([]);
  const [currentToast, setCurrentToast] = useState<Achievement | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNPCJournal, setShowNPCJournal] = useState(false);
  const endingSavedRef = useRef(false);
  const [itemToast, setItemToast] = useState<string | null>(null);
  const prevInventoryLenRef = useRef(0);

  // Load quest based on locale
  useEffect(() => {
    setQuest(getCursedGalleon(locale));
  }, [setQuest, locale]);

  // Check achievements + save run when ending is reached
  useEffect(() => {
    if (screen === "ending" && state && quest && endingIndex !== null && !endingSavedRef.current) {
      endingSavedRef.current = true;
      const ending = quest.endings[endingIndex];
      saveRun(state, ending.title, ending.color);

      const newAch = checkAndUnlockAchievements(state);
      if (newAch.length > 0) {
        setToastQueue(newAch);
      }
    }
    if (screen !== "ending") {
      endingSavedRef.current = false;
    }
  }, [screen, state, quest, endingIndex]);

  // Process toast queue
  useEffect(() => {
    if (!currentToast && toastQueue.length > 0) {
      setCurrentToast(toastQueue[0]);
      setToastQueue(q => q.slice(1));
    }
  }, [currentToast, toastQueue]);

  // Item acquisition toast
  useEffect(() => {
    if (!state) return;
    const len = state.inventory.length;
    if (len > prevInventoryLenRef.current && prevInventoryLenRef.current > 0) {
      // New item acquired
      const newItem = state.inventory[len - 1];
      setItemToast(newItem);
    }
    prevInventoryLenRef.current = len;
  }, [state?.inventory.length]);

  // Glitch effect
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

  // Stop ambient on title
  useEffect(() => {
    if (screen === "title") {
      audioManager.stopAmbient();
    }
  }, [screen]);

  const toggleMute = useCallback(() => {
    setMuted(m => {
      audioManager.setMuted(!m);
      return !m;
    });
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center px-6 py-4 font-game text-[#c8c8d8] transition-all duration-500 overflow-hidden relative"
      style={{
        background: glitch
          ? `linear-gradient(${Math.random() * 360}deg, #1a0a2e, #0a1a1a)`
          : "linear-gradient(180deg, #0a0a14, #1a1a3e)",
        transform: glitch ? `translate(${rand(-3, 3)}px, ${rand(-2, 2)}px)` : "none",
      }}
    >
      {/* Scanline overlay */}
      {state && state.curse >= 8 && (
        <div
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)",
            opacity: Math.min(state.curse / 15, 1) * 0.5,
          }}
        />
      )}

      {/* Top bar buttons */}
      <div className="fixed top-3 right-3 z-[60] flex gap-2">
        {screen === "title" && (
          <>
            <button
              onClick={() => setShowNPCJournal(true)}
              className="font-game text-[12px] text-white/50 hover:text-white/80 transition-colors bg-transparent border-none cursor-pointer"
              title={t("npcJournalTitle")}
            >
              📔
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className="font-game text-[12px] text-white/50 hover:text-white/80 transition-colors bg-transparent border-none cursor-pointer"
              title={t("historyTitle")}
            >
              📜
            </button>
            <button
              onClick={() => setShowAchievements(true)}
              className="font-game text-[12px] text-white/50 hover:text-white/80 transition-colors bg-transparent border-none cursor-pointer"
              title={t("achievementsTitle")}
            >
              🏆
            </button>
          </>
        )}
        <button
          onClick={() => setShowSettings(true)}
          className="font-game text-[12px] text-white/50 hover:text-white/80 transition-colors bg-transparent border-none cursor-pointer"
          title={t("settingsTitle")}
        >
          ⚙️
        </button>
        <button
          onClick={toggleMute}
          className="font-game text-[12px] text-white/50 hover:text-white/80 transition-colors bg-transparent border-none cursor-pointer"
        >
          {muted ? "🔇" : "🔊"}
        </button>
      </div>

      {/* Toasts */}
      <AchievementToast
        achievement={currentToast}
        onDone={() => setCurrentToast(null)}
      />
      <ItemToast
        itemId={itemToast}
        onDone={() => setItemToast(null)}
      />

      {/* Modals */}
      <AnimatePresence>
        {showAchievements && <AchievementsPanel onClose={() => setShowAchievements(false)} />}
        {showHistory && <HistoryPanel onClose={() => setShowHistory(false)} />}
        {showNPCJournal && <NPCJournal onClose={() => setShowNPCJournal(false)} />}
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      </AnimatePresence>

      {/* Game screens */}
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
          {screen === "sailing" && <MapScreen />}
          {screen === "encounter" && <EncounterScreen />}
          {screen === "ending" && <EndingScreen />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
