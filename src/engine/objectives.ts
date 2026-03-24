import { create } from "zustand";
import type { GameState } from "./types";
import type { MapState } from "../renderer/world-map";
import type { Locale } from "../i18n";

// ─── Objective types ───────────────────────────────────────────

export interface ObjectiveProgress {
  current: number;
  target: number;
  complete: boolean;
}

export interface ObjectiveDef {
  id: string;
  icon: string;
  name: Record<Locale, string>;
  desc: Record<Locale, string>;
  /** Short flavor when completed */
  completedDesc: Record<Locale, string>;
  /** Check progress against current game state */
  check: (state: GameState, mapState: MapState | null) => ObjectiveProgress;
}

// ─── Objective definitions ─────────────────────────────────────

export const OBJECTIVES: ObjectiveDef[] = [
  {
    id: "treasure_hunter",
    icon: "🎒",
    name: { uk: "Збирач скарбів", en: "Treasure Hunter" },
    desc: { uk: "Зберіть 5 різних артефактів за одне плавання", en: "Collect 5 different artifacts in a single voyage" },
    completedDesc: { uk: "Ваш трюм повний реліквій забутих епох.", en: "Your hold brims with relics of forgotten ages." },
    check: (state) => ({
      current: new Set(state.artifactLog.map(entry => entry.itemId)).size,
      target: 5,
      complete: new Set(state.artifactLog.map(entry => entry.itemId)).size >= 5,
    }),
  },
  {
    id: "curse_breaker",
    icon: "🔮",
    name: { uk: "Зламати прокляття", en: "Curse Breaker" },
    desc: { uk: "Досягніть прокляття 8+, потім зменшіть до 0", en: "Reach curse 8+, then reduce it back to 0" },
    completedDesc: { uk: "Ви зирнули у безодню і повернулись.", en: "You stared into the abyss and came back." },
    check: (state) => {
      const peaked = state.flags.has("curse_peaked_8");
      if (!peaked) {
        return { current: Math.min(state.curse, 8), target: 8, complete: false };
      }
      // Phase 2: reduce to 0
      return { current: Math.max(0, 8 - state.curse), target: 8, complete: state.curse === 0 };
    },
  },
  {
    id: "explorer",
    icon: "🧭",
    name: { uk: "Дослідник", en: "Explorer" },
    desc: { uk: "Відвідайте 10 різних локацій", en: "Visit 10 different locations" },
    completedDesc: { uk: "Кожен берег знає ваші кроки.", en: "Every shore knows your footsteps." },
    check: (state) => ({
      current: state.visitedLocations?.size ?? 0,
      target: 10,
      complete: (state.visitedLocations?.size ?? 0) >= 10,
    }),
  },
  {
    id: "trade_baron",
    icon: "👑",
    name: { uk: "Торговий барон", en: "Trade Baron" },
    desc: { uk: "Накопичте 300 золота одночасно", en: "Accumulate 300 gold at once" },
    completedDesc: { uk: "Золота більше, ніж у будь-якого губернатора.", en: "More gold than any governor could dream of." },
    check: (state) => ({
      current: Math.min(state.gold, 300),
      target: 300,
      complete: state.gold >= 300,
    }),
  },
  {
    id: "redeemer",
    icon: "⚖️",
    name: { uk: "Спокутник", en: "Redeemer" },
    desc: { uk: "Досягніть карми 10", en: "Reach karma 10" },
    completedDesc: { uk: "Навіть пірати шепочуть ваше ім'я з повагою.", en: "Even pirates whisper your name with respect." },
    check: (state) => ({
      current: Math.min(Math.round(state.karma * 10) / 10, 10),
      target: 10,
      complete: state.karma >= 10,
    }),
  },
  {
    id: "cartographer",
    icon: "🗺️",
    name: { uk: "Картограф", en: "Cartographer" },
    desc: { uk: "Відкрийте 60% карти", en: "Reveal 60% of the map" },
    completedDesc: { uk: "Ви нанесли на карту те, що інші вважали легендою.", en: "You mapped what others thought was legend." },
    check: (_state, mapState) => {
      if (!mapState) return { current: 0, target: 60, complete: false };
      const total = mapState.revealed.length * mapState.revealed[0].length;
      let revealed = 0;
      for (const row of mapState.revealed) {
        for (const cell of row) {
          if (cell) revealed++;
        }
      }
      const pct = Math.round((revealed / total) * 100);
      return { current: pct, target: 60, complete: pct >= 60 };
    },
  },
];

export function getObjective(id: string): ObjectiveDef | undefined {
  return OBJECTIVES.find(o => o.id === id);
}

/** Pick a random objective (optionally excluding some) */
export function randomObjective(exclude?: string[]): ObjectiveDef {
  const pool = exclude ? OBJECTIVES.filter(o => !exclude.includes(o.id)) : OBJECTIVES;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── Objective store (persisted) ───────────────────────────────

interface ObjectiveStore {
  /** Active objective ID for current run (null = no objective / expedition default) */
  objectiveId: string | null;
  setObjective: (id: string | null) => void;
}

const OBJ_KEY = "black-tide-objective";

export const useObjectiveStore = create<ObjectiveStore>((set) => ({
  objectiveId: null,
  setObjective: (id) => {
    try {
      if (id) localStorage.setItem(OBJ_KEY, id);
      else localStorage.removeItem(OBJ_KEY);
    } catch {
      /* ignore storage errors */
    }
    set({ objectiveId: id });
  },
}));
