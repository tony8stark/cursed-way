import { create } from "zustand";
import type { GameState } from "./types";
import type { MapState } from "../renderer/world-map";
import type { Locale } from "../i18n";

// ─── Objective types ───────────────────────────────────────────

export interface ObjectiveProgress {
  current: number;
  target: number;
  complete: boolean;
  note?: Record<Locale, string>;
}

export interface ObjectiveDef {
  id: string;
  icon: string;
  name: Record<Locale, string>;
  desc: Record<Locale, string>;
  /** Short guidance for the playstyle this objective rewards */
  focus: Record<Locale, string>;
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
    focus: { uk: "Стиль: полювання на реліквії та рідкісні зустрічі", en: "Style: chase relics and rare encounters" },
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
    desc: { uk: "Досягніть прокляття 8+, а потім очистьте його до 0", en: "Reach curse 8+, then cleanse it back to 0" },
    focus: { uk: "Стиль: ризикований похід у темряву з поверненням назад", en: "Style: push into danger, then claw your way back" },
    completedDesc: { uk: "Ви зирнули у безодню і повернулись.", en: "You stared into the abyss and came back." },
    check: (state) => {
      const peaked = state.flags.has("curse_peaked_8");
      if (!peaked) {
        return {
          current: Math.min(state.curse, 8),
          target: 8,
          complete: false,
          note: {
            uk: "Спершу доведіть прокляття до 8. Після цього почнеться очищення.",
            en: "First let the curse peak at 8. After that, the cleanse begins.",
          },
        };
      }
      // Phase 2: reduce to 0
      return {
        current: Math.max(0, 8 - state.curse),
        target: 8,
        complete: state.curse === 0,
        note: state.curse === 0
          ? undefined
          : {
            uk: "Пік позаду. Тепер зменште прокляття до 0.",
            en: "The peak is behind you. Now reduce the curse to 0.",
          },
      };
    },
  },
  {
    id: "explorer",
    icon: "🧭",
    name: { uk: "Дослідник", en: "Explorer" },
    desc: { uk: "Відвідайте 8 різних локацій і збережіть 6+ команди", en: "Visit 8 different locations and keep 6+ crew" },
    focus: { uk: "Стиль: широка подорож без розвалу команди", en: "Style: range widely without losing the crew" },
    completedDesc: { uk: "Кожен берег знає ваші кроки.", en: "Every shore knows your footsteps." },
    check: (state) => {
      const visited = state.visitedLocations?.size ?? 0;
      const crewReady = state.crew >= 6;
      return {
        current: Math.min(visited, 8),
        target: 8,
        complete: visited >= 8 && crewReady,
        note: visited >= 8 && !crewReady
          ? {
            uk: "Маршрут уже гідний легенди. Тепер доведіть команду до 6+ моряків.",
            en: "The route is worthy of legend. Now bring the crew back to 6+ sailors.",
          }
          : {
            uk: "Дослідник має не лише бачити береги, а й утримати людей живими.",
            en: "An explorer must do more than find shores. They must keep people alive.",
          },
      };
    },
  },
  {
    id: "trade_baron",
    icon: "👑",
    name: { uk: "Торговий барон", en: "Trade Baron" },
    desc: { uk: "Накопичте 220 золота і підніміть репутацію Гільдії до 6+", en: "Accumulate 220 gold and raise Guild reputation to 6+" },
    focus: { uk: "Стиль: прибуток через зв'язки, а не лише грабунок", en: "Style: build wealth through connections, not only plunder" },
    completedDesc: { uk: "Золота більше, ніж у будь-якого губернатора.", en: "More gold than any governor could dream of." },
    check: (state) => {
      const trustedByGuild = state.factionReps.guild >= 6;
      return {
        current: Math.min(state.gold, 220),
        target: 220,
        complete: state.gold >= 220 && trustedByGuild,
        note: state.gold >= 220 && !trustedByGuild
          ? {
            uk: "Золота вже досить. Тепер добийтесь 6+ репутації Гільдії.",
            en: "The gold is already there. Now earn 6+ Guild reputation.",
          }
          : {
            uk: "Справжній магнат не лише багатий, а й допущений до кращих угод.",
            en: "A true magnate is not just rich, but trusted with the best deals.",
          },
      };
    },
  },
  {
    id: "redeemer",
    icon: "⚖️",
    name: { uk: "Спокутник", en: "Redeemer" },
    desc: { uk: "Досягніть карми 8, утримуючи прокляття на рівні 3 або нижче", en: "Reach karma 8 while keeping curse at 3 or lower" },
    focus: { uk: "Стиль: милосердя без падіння в морок", en: "Style: choose mercy without surrendering to darkness" },
    completedDesc: { uk: "Навіть пірати шепочуть ваше ім'я з повагою.", en: "Even pirates whisper your name with respect." },
    check: (state) => {
      const lowCurse = state.curse <= 3;
      return {
        current: Math.min(Math.round(state.karma * 10) / 10, 8),
        target: 8,
        complete: state.karma >= 8 && lowCurse,
        note: state.karma >= 8 && !lowCurse
          ? {
            uk: "Ви вже заслужили повагу. Тепер знизьте прокляття до 3 або нижче.",
            en: "You have already earned respect. Now reduce the curse to 3 or lower.",
          }
          : {
            uk: "Спокута вимагає не лише добрих вчинків, а й чистоти від прокляття.",
            en: "Redemption needs more than kindness. It also demands a cleaner soul.",
          },
      };
    },
  },
  {
    id: "cartographer",
    icon: "🗺️",
    name: { uk: "Картограф", en: "Cartographer" },
    desc: { uk: "Відкрийте 45% карти, утримуючи прокляття на рівні 6 або нижче", en: "Reveal 45% of the map while keeping curse at 6 or lower" },
    focus: { uk: "Стиль: холодна навігація і контроль ризику", en: "Style: methodical navigation with risk under control" },
    completedDesc: { uk: "Ви нанесли на карту те, що інші вважали легендою.", en: "You mapped what others thought was legend." },
    check: (state, mapState) => {
      if (!mapState) {
        return {
          current: 0,
          target: 45,
          complete: false,
          note: {
            uk: "Картограф живе на карті. Спершу вирушайте в море.",
            en: "A cartographer lives on the map. First, put to sea.",
          },
        };
      }
      const total = mapState.revealed.length * mapState.revealed[0].length;
      let revealed = 0;
      for (const row of mapState.revealed) {
        for (const cell of row) {
          if (cell) revealed++;
        }
      }
      const pct = Math.round((revealed / total) * 100);
      return {
        current: pct,
        target: 45,
        complete: pct >= 45 && state.curse <= 6,
        note: pct >= 45 && state.curse > 6
          ? {
            uk: "Карта вже майже ваша. Тепер опустіть прокляття до 6 або нижче.",
            en: "The map is nearly yours. Now bring the curse down to 6 or lower.",
          }
          : {
            uk: "Хороший картограф відкриває невідоме, не втрачаючи себе.",
            en: "A good cartographer uncovers the unknown without losing themselves to it.",
          },
      };
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
