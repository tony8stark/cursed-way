import type { Quest } from "../../engine/types";
import type { Locale } from "../../i18n";
import { defaultReps } from "../../engine/factions";
import { encounters } from "./encounters";
import { encountersEn } from "./encounters-en";
import { questlineEncounters } from "./questlines";
import { questlineEncountersEn } from "./questlines-en";
import { newEncounters } from "./encounters-new";
import { newEncountersEn } from "./encounters-new-en";
import { locationQuestEncounters } from "./location-quest-encounters";
import { locationQuestEncountersEn } from "./location-quest-encounters-en";
import { endings } from "./endings";
import { endingsEn } from "./endings-en";

const questData: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: "ЧОРНИЙ ПРИЛИВ",
    description: "Один корабель. Кожен вибір має наслідки. Море пам'ятає все.",
  },
  en: {
    title: "BLACK TIDE",
    description: "One ship. Every choice has consequences. The sea remembers everything.",
  },
};

export function getCursedGalleon(locale: Locale): Quest {
  return {
    id: "cursed-galleon",
    title: questData[locale].title,
    description: questData[locale].description,
    encounters: locale === "en"
      ? [...encountersEn, ...questlineEncountersEn, ...newEncountersEn, ...locationQuestEncountersEn]
      : [...encounters, ...questlineEncounters, ...newEncounters, ...locationQuestEncounters],
    endings: locale === "en" ? endingsEn : endings,
    initialState: {
      gold: 30,
      crew: 8,
      karma: 0,
      curse: 0,
      day: 1,
      watch: 0,
      flags: new Set(),
      log: [],
      inventory: [],
      delayedEffects: [],
      visitedLocations: new Set(),
      factionReps: defaultReps(),
      artifactLog: [],
      npcMeetings: [],
      locationVisits: {},
    },
  };
}

// Default export for backwards compat
export const cursedGalleon = getCursedGalleon("uk");
