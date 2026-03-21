import { create } from "zustand";
import type { Locale } from "../i18n";

export type OriginId = "navy_defector" | "smuggler" | "scholar" | "mutineer";

export interface Origin {
  id: OriginId;
  icon: string;
  name: Record<Locale, string>;
  desc: Record<Locale, string>;
  /** Starting stat modifiers */
  bonuses: {
    gold?: number;
    crew?: number;
    karma?: number;
    curse?: number;
  };
  /** Starting flags (unlock unique choices) */
  flags: string[];
  /** Starting inventory items */
  items?: string[];
}

export const ORIGINS: Origin[] = [
  {
    id: "navy_defector",
    icon: "⚓",
    name: { uk: "Дезертир флоту", en: "Navy Defector" },
    desc: {
      uk: "Колишній офіцер Королівського флоту. Дисципліна, навички навігації, ворог у кожному порту.",
      en: "Former Royal Navy officer. Discipline, navigation skills, an enemy in every port.",
    },
    bonuses: { crew: 2, gold: -10 },
    flags: ["origin_navy"],
  },
  {
    id: "smuggler",
    icon: "🗝️",
    name: { uk: "Контрабандист", en: "Smuggler" },
    desc: {
      uk: "Тіньові зв'язки, потайні відсіки, вміння зникати. Золото любить тишу.",
      en: "Shadow contacts, hidden compartments, the art of disappearing. Gold loves silence.",
    },
    bonuses: { gold: 20 },
    flags: ["origin_smuggler"],
  },
  {
    id: "scholar",
    icon: "📖",
    name: { uk: "Вчений заборонених морів", en: "Scholar of Forbidden Seas" },
    desc: {
      uk: "Давні карти, окультні знання, прокляття як предмет дослідження. Команда вас боїться.",
      en: "Ancient charts, occult knowledge, curses as a field of study. The crew fears you.",
    },
    bonuses: { crew: -1, curse: 1 },
    flags: ["origin_scholar"],
    items: ["cursed_compass"],
  },
  {
    id: "mutineer",
    icon: "🔥",
    name: { uk: "Бунтівник", en: "Mutineer" },
    desc: {
      uk: "Ви вбили свого капітана. Команда обрала вас. Чи вірять вони вам, чи бояться?",
      en: "You killed your captain. The crew chose you. Do they trust you, or fear you?",
    },
    bonuses: { crew: 1, karma: -2 },
    flags: ["origin_mutineer"],
  },
];

// ── Origin store ──

const ORIGIN_KEY = "black-tide-origin";

interface OriginStore {
  origin: OriginId;
  setOrigin: (id: OriginId) => void;
}

function getInitialOrigin(): OriginId {
  try {
    const saved = localStorage.getItem(ORIGIN_KEY);
    if (saved && ORIGINS.some(o => o.id === saved)) return saved as OriginId;
  } catch {}
  return "navy_defector";
}

export const useOriginStore = create<OriginStore>((set) => ({
  origin: getInitialOrigin(),
  setOrigin: (origin) => {
    try { localStorage.setItem(ORIGIN_KEY, origin); } catch {}
    set({ origin });
  },
}));

export function getOrigin(id: OriginId): Origin {
  return ORIGINS.find(o => o.id === id)!;
}
