import type { GameState } from "./types";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  check: (state: GameState) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "angel",
    title: "Ангел морів",
    description: "Закінчити гру з кармою 8+",
    icon: "😇",
    check: s => s.karma >= 8,
  },
  {
    id: "cursed",
    title: "Проклятий",
    description: "Досягти прокляття 15",
    icon: "☠️",
    check: s => s.curse >= 15,
  },
  {
    id: "rich",
    title: "Король Карибів",
    description: "Накопичити 150+ золота",
    icon: "👑",
    check: s => s.gold >= 150,
  },
  {
    id: "pacifist",
    title: "Дипломат",
    description: "Жодного абордажу за гру",
    icon: "🕊️",
    check: s => s.karma >= 3 && !s.flags.has("combat_fought"),
  },
  {
    id: "empty",
    title: "Порожній трюм",
    description: "Закінчити гру з 0 золота",
    icon: "🫗",
    check: s => s.gold === 0,
  },
  {
    id: "full_crew",
    title: "Капітан року",
    description: "Закінчити з 12+ членів команди",
    icon: "⚓",
    check: s => s.crew >= 12,
  },
  {
    id: "lone",
    title: "Самотній вовк",
    description: "Залишитись без команди",
    icon: "🐺",
    check: s => s.crew <= 0,
  },
  {
    id: "siren",
    title: "Друг сирени",
    description: "Встановити зв'язок з сиреною",
    icon: "🧜",
    check: s => s.flags.has("siren_bond"),
  },
  {
    id: "explorer",
    title: "Дослідник",
    description: "Відвідати острів-примару",
    icon: "🗺️",
    check: s => s.flags.has("visited_phantom"),
  },
  {
    id: "kraken_friend",
    title: "Пакт з глибиною",
    description: "Укласти угоду з Кракеном",
    icon: "🐙",
    check: s => s.flags.has("kraken_pact"),
  },
  {
    id: "merged",
    title: "Єдність",
    description: "Об'єднатися з двійником",
    icon: "🪞",
    check: s => s.flags.has("merged"),
  },
  {
    id: "long_voyage",
    title: "20 днів",
    description: "Пройти всі 20 днів",
    icon: "📅",
    check: s => s.day >= 20,
  },
  {
    id: "dark_path",
    title: "Темний шлях",
    description: "Карма нижче -5",
    icon: "😈",
    check: s => s.karma <= -5,
  },
  {
    id: "balanced",
    title: "Баланс",
    description: "Закінчити з кармою від -1 до 1",
    icon: "⚖️",
    check: s => s.karma >= -1 && s.karma <= 1,
  },
];

const ACHIEVEMENTS_KEY = "cursed-way-achievements";

export function getUnlockedAchievements(): Set<string> {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function checkAndUnlockAchievements(state: GameState): Achievement[] {
  const unlocked = getUnlockedAchievements();
  const newlyUnlocked: Achievement[] = [];

  for (const ach of ACHIEVEMENTS) {
    if (!unlocked.has(ach.id) && ach.check(state)) {
      unlocked.add(ach.id);
      newlyUnlocked.push(ach);
    }
  }

  if (newlyUnlocked.length > 0) {
    try {
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify([...unlocked]));
    } catch { /* quota */ }
  }

  return newlyUnlocked;
}
