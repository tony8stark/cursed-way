import { create } from "zustand";

export type Locale = "uk" | "en";

interface LocaleStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LOCALE_KEY = "black-tide-locale";

function getInitialLocale(): Locale {
  try {
    const saved = localStorage.getItem(LOCALE_KEY);
    if (saved === "en" || saved === "uk") return saved;
    // Auto-detect from browser
    const lang = navigator.language.slice(0, 2);
    return lang === "uk" ? "uk" : "en";
  } catch {
    return "uk";
  }
}

export const useLocaleStore = create<LocaleStore>((set) => ({
  locale: getInitialLocale(),
  setLocale: (locale) => {
    try { localStorage.setItem(LOCALE_KEY, locale); } catch {}
    set({ locale });
  },
}));

// UI translations
const translations = {
  uk: {
    // Title screen
    gameTitle: "ЧОРНИЙ\nПРИЛИВ",
    tagline1: "Один корабель. Кожен вибір має наслідки.",
    tagline2: "Море пам'ятає все.",
    startGame: "ВИЙТИ В МОРЕ",
    continueGame: "ПРОДОВЖИТИ",
    // Stats
    gold: "ЗОЛОТО",
    crew: "КОМАНДА",
    day: "ДЕНЬ",
    watch: "ВАХТА",
    curse: "ТЬМА",
    curseGlitch: "П̷Р̴К̸Л̵",
    karma: "КАРМА",
    // Sailing
    sailContinue: "ПЛИВТИ ДАЛІ",
    sailGlitch: "П̸Л̵И̶В̷Т̸И̵...",
    curseHint1: "Щось дивне у повітрі...",
    curseHint2: "Тіні рухаються самі по собі",
    curseHint3: "Р̶Е̷А̷Л̸Ь̵Н̸І̸С̷Т̸Ь̵ ̵Т̷Р̸І̶Щ̷И̸Т̵Ь̷",
    // Encounter
    continueButton: "ПЛИВТИ ДАЛІ →",
    cantAfford: "(замало 💰)",
    // Ending
    journal: "ЖУРНАЛ",
    dayPrefix: "Д",
    replayButton: "ЗНОВУ В МОРЕ",
    // Achievements
    achievements: "ДОСЯГНЕННЯ",
    achievementLabel: "ДОСЯГНЕННЯ",
    // History
    pastVoyages: "МИНУЛІ ПЛАВАННЯ",
    noVoyages: "Ще жодного плавання. Вийдіть в море!",
    // Settings
    settings: "НАЛАШТУВАННЯ",
    music: "МУЗИКА",
    sfx: "ЕФЕКТИ",
    language: "МОВА",
    // Common
    close: "ЗАКРИТИ",
    // Game mode
    modeExpedition: "ЕКСПЕДИЦІЯ",
    modeExpeditionDesc: "20 днів. Виживи.",
    modeFreeRoam: "ВІЛЬНЕ ПЛАВАННЯ",
    modeFreeRoamDesc: "Без ліміту. Досліджуй.",
    // Origin
    chooseOrigin: "ХТО ВИ?",
    // Map
    mapTitle: "КАРТА",
    chooseDestination: "КУДИ ПЛИВЕМО?",
    enRoute: "В ДОРОЗІ",
    // Button titles
    historyTitle: "Історія",
    achievementsTitle: "Досягнення",
    settingsTitle: "Налаштування",
  },
  en: {
    gameTitle: "BLACK\nTIDE",
    tagline1: "One ship. Every choice has consequences.",
    tagline2: "The sea remembers everything.",
    startGame: "SET SAIL",
    continueGame: "CONTINUE",
    gold: "GOLD",
    crew: "CREW",
    day: "DAY",
    watch: "WATCH",
    curse: "DARKNESS",
    curseGlitch: "C̷U̴R̸S̵E",
    karma: "KARMA",
    sailContinue: "SAIL ON",
    sailGlitch: "S̸A̵I̶L̷...",
    curseHint1: "Something strange in the air...",
    curseHint2: "Shadows move on their own",
    curseHint3: "R̶E̷A̷L̸I̵T̸Y̵ ̵C̷R̸A̶C̷K̸S̵",
    continueButton: "SAIL ON →",
    cantAfford: "(not enough 💰)",
    journal: "LOG",
    dayPrefix: "D",
    replayButton: "SET SAIL AGAIN",
    achievements: "ACHIEVEMENTS",
    achievementLabel: "ACHIEVEMENT",
    pastVoyages: "PAST VOYAGES",
    noVoyages: "No voyages yet. Set sail!",
    settings: "SETTINGS",
    music: "MUSIC",
    sfx: "SFX",
    language: "LANGUAGE",
    close: "CLOSE",
    modeExpedition: "EXPEDITION",
    modeExpeditionDesc: "20 days. Survive.",
    modeFreeRoam: "FREE ROAM",
    modeFreeRoamDesc: "No limit. Explore.",
    chooseOrigin: "WHO ARE YOU?",
    mapTitle: "MAP",
    chooseDestination: "WHERE TO?",
    enRoute: "EN ROUTE",
    historyTitle: "History",
    achievementsTitle: "Achievements",
    settingsTitle: "Settings",
  },
} as const;

export type TranslationKey = keyof typeof translations.uk;

export function useT() {
  const locale = useLocaleStore(s => s.locale);
  return (key: TranslationKey) => translations[locale][key];
}

export function getT(locale: Locale) {
  return (key: TranslationKey) => translations[locale][key];
}
