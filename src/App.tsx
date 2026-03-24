import { lazy, Suspense, useEffect, useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "./engine/state";
import { loadCursedGalleon } from "./quests/cursed-galleon";
import { checkAndUnlockAchievements, type Achievement } from "./engine/achievements";
import { saveRun } from "./engine/history";
import { TitleScreen } from "./ui/components/TitleScreen";
import { AchievementToast } from "./ui/components/AchievementToast";
import { ItemToast } from "./ui/components/ItemToast";
import { audioManager } from "./audio/audio-manager";
import { useLocaleStore } from "./i18n";
import { useT } from "./i18n";

const MapScreen = lazy(() => import("./ui/components/MapScreen").then((mod) => ({ default: mod.MapScreen })));
const EncounterScreen = lazy(() => import("./ui/components/EncounterScreen").then((mod) => ({ default: mod.EncounterScreen })));
const EndingScreen = lazy(() => import("./ui/components/EndingScreen").then((mod) => ({ default: mod.EndingScreen })));
const AchievementsPanel = lazy(() => import("./ui/components/AchievementsPanel").then((mod) => ({ default: mod.AchievementsPanel })));
const HistoryPanel = lazy(() => import("./ui/components/HistoryPanel").then((mod) => ({ default: mod.HistoryPanel })));
const NPCJournal = lazy(() => import("./ui/components/NPCJournal").then((mod) => ({ default: mod.NPCJournal })));
const SettingsModal = lazy(() => import("./ui/components/SettingsModal").then((mod) => ({ default: mod.SettingsModal })));

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
  const [glitchStyle, setGlitchStyle] = useState({ angle: 0, x: 0, y: 0 });
  const [loadedLocale, setLoadedLocale] = useState<typeof locale | null>(null);
  const [failedLocale, setFailedLocale] = useState<typeof locale | null>(null);
  const inventory = state?.inventory;
  const curse = state?.curse ?? 0;

  // Load quest based on locale
  useEffect(() => {
    let cancelled = false;

    void loadCursedGalleon(locale)
      .then((loadedQuest) => {
        if (cancelled) return;
        setQuest(loadedQuest);
        setLoadedLocale(locale);
        setFailedLocale(null);
      })
      .catch(() => {
        if (cancelled) return;
        setFailedLocale(locale);
      });

    return () => {
      cancelled = true;
    };
  }, [setQuest, locale]);

  // Check achievements + save run when ending is reached
  useEffect(() => {
    if (screen === "ending" && state && quest && endingIndex !== null && !endingSavedRef.current) {
      endingSavedRef.current = true;
      const ending = quest.endings[endingIndex];
      saveRun(state, ending.title, ending.color);

      const newAch = checkAndUnlockAchievements(state);
      if (newAch.length > 0) {
        const timer = setTimeout(() => setToastQueue(newAch), 0);
        return () => clearTimeout(timer);
      }
    }
    if (screen !== "ending") {
      endingSavedRef.current = false;
    }
  }, [screen, state, quest, endingIndex]);

  // Process toast queue
  useEffect(() => {
    if (!currentToast && toastQueue.length > 0) {
      const timer = setTimeout(() => {
        setCurrentToast(toastQueue[0]);
        setToastQueue(q => q.slice(1));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentToast, toastQueue]);

  // Item acquisition toast (delayed if achievement toast is active to avoid overlap)
  useEffect(() => {
    if (!inventory) return;
    const len = inventory.length;
    if (len > prevInventoryLenRef.current && prevInventoryLenRef.current > 0) {
      const newItem = inventory[len - 1];
      if (currentToast) {
        // Delay item toast until achievement toast is done
        const timer = setTimeout(() => setItemToast(newItem), 3500);
        prevInventoryLenRef.current = len;
        return () => clearTimeout(timer);
      }
      const timer = setTimeout(() => setItemToast(newItem), 0);
      prevInventoryLenRef.current = len;
      return () => clearTimeout(timer);
    }
    prevInventoryLenRef.current = len;
  }, [inventory, currentToast]);

  // Glitch effect
  useEffect(() => {
    if (curse >= 8) {
      const iv = setInterval(() => {
        setGlitchStyle({
          angle: Math.random() * 360,
          x: rand(-3, 3),
          y: rand(-2, 2),
        });
        setGlitch(true);
        setTimeout(() => setGlitch(false), 80 + Math.random() * 150);
      }, 1500 + Math.random() * 3000);
      return () => clearInterval(iv);
    }
    const timer = setTimeout(() => setGlitch(false), 0);
    return () => clearTimeout(timer);
  }, [curse]);

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

  const shouldShowQuestLoader = failedLocale !== locale && (
    !quest || (screen === "title" && loadedLocale !== locale)
  );
  const questLoadFailed = !quest && failedLocale === locale;

  if (shouldShowQuestLoader) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a14] font-game text-[#c8c8d8]">
        {locale === "uk" ? "Завантаження..." : "Loading..."}
      </div>
    );
  }

  if (!quest && questLoadFailed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a14] font-game text-[#f0c040]">
        {locale === "uk" ? "Не вдалося завантажити пригоду." : "Failed to load the adventure."}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center px-6 py-4 font-game text-[#c8c8d8] transition-all duration-500 overflow-hidden relative"
      style={{
        background: glitch
          ? `linear-gradient(${glitchStyle.angle}deg, #1a0a2e, #0a1a1a)`
          : "linear-gradient(180deg, #0a0a14, #1a1a3e)",
        transform: glitch ? `translate(${glitchStyle.x}px, ${glitchStyle.y}px)` : "none",
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
      <Suspense fallback={null}>
        <AnimatePresence>
          {showAchievements && <AchievementsPanel onClose={() => setShowAchievements(false)} />}
          {showHistory && <HistoryPanel onClose={() => setShowHistory(false)} />}
          {showNPCJournal && <NPCJournal onClose={() => setShowNPCJournal(false)} />}
          {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        </AnimatePresence>
      </Suspense>

      {/* Game screens */}
      <Suspense fallback={null}>
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
      </Suspense>
    </div>
  );
}
