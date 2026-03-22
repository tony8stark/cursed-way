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
    name: { uk: "Маркус Рейн", en: "Marcus Rayne" },
    desc: {
      uk: "Капітан-лейтенант Королівського флоту, що зрадив присягу заради правди. Коли адмірал наказав потопити торгове судно з цивільними, Маркус відмовився і розвернув свій фрегат. Тепер його обличчя на кожному розшуку, а за голову призначена нагорода в 500 дублонів.",
      en: "A Royal Navy lieutenant-commander who broke his oath for the truth. When the admiral ordered him to sink a merchant vessel with civilians aboard, Marcus refused and turned his frigate around. Now his face hangs on every wanted poster, with a 500 doubloon bounty on his head.",
    },
    bonuses: { crew: 2, gold: -10 },
    flags: ["origin_navy"],
  },
  {
    id: "smuggler",
    icon: "🗝️",
    name: { uk: "Ізабель \"Тінь\" Варгас", en: "Isabel \"Shadow\" Vargas" },
    desc: {
      uk: "Дочка портового митника, що виросла серед контрабандистів Картахени. З 14 років перевозила заборонені товари, ховаючи їх у подвійному дні своєї шлюпки. Знає кожен потайний прохід, кожного продажного стражника. Її справжнє ім'я знають лише мертві.",
      en: "Daughter of a port customs officer, raised among the smugglers of Cartagena. She has been running contraband since age 14, hiding goods in the false bottom of her sloop. She knows every secret passage, every corrupt guard. Only the dead know her real name.",
    },
    bonuses: { gold: 20 },
    flags: ["origin_smuggler"],
  },
  {
    id: "scholar",
    icon: "📖",
    name: { uk: "Ервін де Монтеск'ю", en: "Erwin de Montesque" },
    desc: {
      uk: "Професор окультних наук Сорбонни, вигнаний за \"небезпечні дослідження\". Вірить, що прокляття Чорного Приливу пов'язане з давнім ритуалом, записаним на затонулих табличках. Його прокляті карти ведуть туди, куди не наважуються інші. Команда шепоче, що він розмовляє з тінями.",
      en: "A Sorbonne professor of occult sciences, expelled for \"dangerous research.\" He believes the Black Tide curse is tied to an ancient ritual inscribed on sunken tablets. His cursed charts lead where others dare not go. The crew whispers that he speaks with shadows.",
    },
    bonuses: { crew: -1, curse: 1 },
    flags: ["origin_scholar"],
    items: ["cursed_compass"],
  },
  {
    id: "mutineer",
    icon: "🔥",
    name: { uk: "Кассій \"Клинок\" О'Брайен", en: "Cassian \"Blade\" O'Brien" },
    desc: {
      uk: "Боцман з ірландських доків, що підняв бунт проти тирана-капітана Блекторна. Одним ударом вирішив долю корабля. Команда обрала його ватажком, але довіра, здобута кров'ю, легко обертається на страх. Минуле переслідує його кожної ночі.",
      en: "A bosun from the Irish docks who led a mutiny against the tyrant Captain Blackthorn. One strike decided the ship's fate. The crew chose him as leader, but trust earned through blood easily turns to fear. The past haunts him every night.",
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
