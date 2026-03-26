import type { Locale } from "../i18n";

/**
 * Location-bound quests with difficulty tiers and probability mechanics.
 * Some quests require multiple visits to trigger.
 */

export type QuestDifficulty = "common" | "uncommon" | "rare" | "legendary";

export interface LocationQuest {
  id: string;
  /** Location name (must match a location template name.en) */
  locationName: string;
  /** Difficulty tier affects appearance probability and rewards */
  difficulty: QuestDifficulty;
  /** Base probability of appearing when visiting the location (0-1) */
  baseProbability: number;
  /** Minimum visits to this location before quest can appear */
  minVisits: number;
  /** Minimum unique named locations discovered before the quest can surface */
  minExploredLocations?: number;
  /** Increase in probability per visit beyond minVisits */
  probabilityPerVisit: number;
  /** Increase in probability per discovered location beyond minExploredLocations */
  probabilityPerExploredLocation?: number;
  /** Max probability cap */
  maxProbability: number;
  /** Encounter ID to trigger when quest activates */
  encounterId: string;
  /** Hint shown on map when quest is potentially available */
  hint: Record<Locale, string>;
  /** Reward description for journal */
  rewardHint: Record<Locale, string>;
}

/** Difficulty-based reward multipliers */
export const DIFFICULTY_CONFIG: Record<QuestDifficulty, {
  color: string;
  label: Record<Locale, string>;
}> = {
  common: {
    color: "#c8c8d8",
    label: { uk: "Звичайний", en: "Common" },
  },
  uncommon: {
    color: "#40c0f0",
    label: { uk: "Незвичайний", en: "Uncommon" },
  },
  rare: {
    color: "#c040f0",
    label: { uk: "Рідкісний", en: "Rare" },
  },
  legendary: {
    color: "#f0c040",
    label: { uk: "Легендарний", en: "Legendary" },
  },
};

export const LOCATION_QUESTS: LocationQuest[] = [
  // ── COMMON (high chance, low visits) ──
  {
    id: "lq_port_smuggler_cache",
    locationName: "Tortuga",
    difficulty: "common",
    baseProbability: 0.6,
    minVisits: 1,
    minExploredLocations: 1,
    probabilityPerVisit: 0.2,
    probabilityPerExploredLocation: 0.02,
    maxProbability: 1.0,
    encounterId: "lq_smuggler_cache",
    hint: { uk: "В тавернах шепочуть про схованку", en: "Taverns whisper about a hidden stash" },
    rewardHint: { uk: "Золото та припаси", en: "Gold and supplies" },
  },
  {
    id: "lq_fishing_village_herbs",
    locationName: "Nassau",
    difficulty: "common",
    baseProbability: 0.5,
    minVisits: 1,
    minExploredLocations: 1,
    probabilityPerVisit: 0.25,
    probabilityPerExploredLocation: 0.02,
    maxProbability: 1.0,
    encounterId: "lq_healing_herbs",
    hint: { uk: "Місцеві знахарі готують зілля", en: "Local healers prepare potions" },
    rewardHint: { uk: "Ліки для команди", en: "Medicine for the crew" },
  },

  // ── UNCOMMON (medium chance, 1-2 visits) ──
  {
    id: "lq_sunken_galleon",
    locationName: "Port Royal",
    difficulty: "uncommon",
    baseProbability: 0.3,
    minVisits: 1,
    minExploredLocations: 3,
    probabilityPerVisit: 0.15,
    probabilityPerExploredLocation: 0.03,
    maxProbability: 0.8,
    encounterId: "lq_sunken_treasure",
    hint: { uk: "Старий моряк знає, де затонув галеон", en: "An old sailor knows where the galleon sank" },
    rewardHint: { uk: "Затонулий скарб та артефакт", en: "Sunken treasure and an artifact" },
  },
  {
    id: "lq_voodoo_priestess",
    locationName: "Havana",
    difficulty: "uncommon",
    baseProbability: 0.25,
    minVisits: 1,
    minExploredLocations: 4,
    probabilityPerVisit: 0.2,
    probabilityPerExploredLocation: 0.04,
    maxProbability: 0.85,
    encounterId: "lq_voodoo_blessing",
    hint: { uk: "Жриця вуду чекає на гідного", en: "A voodoo priestess awaits the worthy" },
    rewardHint: { uk: "Благословення або прокляття", en: "Blessing or curse" },
  },
  {
    id: "lq_map_maker",
    locationName: "Cartagena",
    difficulty: "uncommon",
    baseProbability: 0.35,
    minVisits: 1,
    minExploredLocations: 3,
    probabilityPerVisit: 0.15,
    probabilityPerExploredLocation: 0.03,
    maxProbability: 0.8,
    encounterId: "lq_master_cartographer",
    hint: { uk: "Знаменитий картограф приймає відвідувачів", en: "The famous cartographer receives visitors" },
    rewardHint: { uk: "Карта з секретними маршрутами", en: "Map with secret routes" },
  },

  // ── RARE (low chance, 2+ visits) ──
  {
    id: "lq_ghost_captain",
    locationName: "Port Royal",
    difficulty: "rare",
    baseProbability: 0.14,
    minVisits: 1,
    minExploredLocations: 6,
    probabilityPerVisit: 0.15,
    probabilityPerExploredLocation: 0.04,
    maxProbability: 0.7,
    encounterId: "lq_ghost_captain_deal",
    hint: { uk: "Привид капітана з'являється при повному місяці", en: "The captain's ghost appears at full moon" },
    rewardHint: { uk: "Привидний компас або знання глибин", en: "Phantom compass or knowledge of the depths" },
  },
  {
    id: "lq_kraken_lair",
    locationName: "Bermuda",
    difficulty: "rare",
    baseProbability: 0.15,
    minVisits: 1,
    minExploredLocations: 7,
    probabilityPerVisit: 0.1,
    probabilityPerExploredLocation: 0.05,
    maxProbability: 0.7,
    encounterId: "lq_kraken_lair_dive",
    hint: { uk: "Щось величезне рухається під водою", en: "Something enormous moves beneath the water" },
    rewardHint: { uk: "Зуб кракена з магічними властивостями", en: "Kraken tooth with magical properties" },
  },
  {
    id: "lq_pirate_king_tomb",
    locationName: "Nassau",
    difficulty: "rare",
    baseProbability: 0.1,
    minVisits: 2,
    minExploredLocations: 7,
    probabilityPerVisit: 0.15,
    probabilityPerExploredLocation: 0.05,
    maxProbability: 0.7,
    encounterId: "lq_pirate_king",
    hint: { uk: "Легенда про гробницю Піратського Короля", en: "Legend of the Pirate King's tomb" },
    rewardHint: { uk: "Королівський артефакт", en: "Royal artifact" },
  },

  // ── LEGENDARY (very low chance, 3+ visits) ──
  {
    id: "lq_davy_jones_locker",
    locationName: "Bermuda",
    difficulty: "legendary",
    baseProbability: 0.06,
    minVisits: 2,
    minExploredLocations: 9,
    probabilityPerVisit: 0.1,
    probabilityPerExploredLocation: 0.04,
    maxProbability: 0.55,
    encounterId: "lq_davy_jones",
    hint: { uk: "На дні моря чекає сховок Дейві Джонса", en: "Davy Jones' locker awaits at the ocean floor" },
    rewardHint: { uk: "Легендарний артефакт глибини", en: "Legendary artifact of the deep" },
  },
  {
    id: "lq_fountain_of_youth",
    locationName: "Havana",
    difficulty: "legendary",
    baseProbability: 0.05,
    minVisits: 2,
    minExploredLocations: 8,
    probabilityPerVisit: 0.08,
    probabilityPerExploredLocation: 0.04,
    maxProbability: 0.5,
    encounterId: "lq_fountain",
    hint: { uk: "Фонтан Молодості — не просто легенда", en: "The Fountain of Youth is more than legend" },
    rewardHint: { uk: "Вічне здоров'я чи вічне прокляття", en: "Eternal health or eternal curse" },
  },
  {
    id: "lq_flying_dutchman",
    locationName: "Tortuga",
    difficulty: "legendary",
    baseProbability: 0.06,
    minVisits: 2,
    minExploredLocations: 9,
    probabilityPerVisit: 0.1,
    probabilityPerExploredLocation: 0.04,
    maxProbability: 0.55,
    encounterId: "lq_dutchman",
    hint: { uk: "Летючий Голландець шукає нового капітана", en: "The Flying Dutchman seeks a new captain" },
    rewardHint: { uk: "Команда привидів або корабель-привид", en: "Ghost crew or ghost ship" },
  },
];

export interface LocationQuestCheckContext {
  exploredLocationCount?: number;
  roll?: number;
}

export interface LocationQuestPreview {
  quest: LocationQuest;
  status: "ready" | "rumored";
  chance: number;
  note: Record<Locale, string>;
}

function difficultyRank(difficulty: QuestDifficulty): number {
  return ["common", "uncommon", "rare", "legendary"].indexOf(difficulty);
}

function getQuestMetrics(quest: LocationQuest, visitCount: number, exploredLocationCount: number) {
  const minExploredLocations = quest.minExploredLocations ?? 0;
  const extraVisits = Math.max(0, visitCount - quest.minVisits);
  const extraExploration = Math.max(0, exploredLocationCount - minExploredLocations);
  const missingVisits = Math.max(0, quest.minVisits - visitCount);
  const missingExploration = Math.max(0, minExploredLocations - exploredLocationCount);
  const chance = Math.min(
    quest.maxProbability,
    quest.baseProbability
      + extraVisits * quest.probabilityPerVisit
      + extraExploration * (quest.probabilityPerExploredLocation ?? 0),
  );

  return {
    chance,
    missingVisits,
    missingExploration,
    ready: missingVisits === 0 && missingExploration === 0,
  };
}

function buildPreviewNote(
  missingVisits: number,
  missingExploration: number,
): Record<Locale, string> {
  if (missingVisits === 0 && missingExploration === 0) {
    return {
      uk: "Готово на наступному заході",
      en: "Ready on next arrival",
    };
  }

  if (missingVisits > 0 && missingExploration > 0) {
    return {
      uk: `Ще ${missingVisits} віз. і ${missingExploration} відкриттів`,
      en: `Need ${missingVisits} more return(s) and ${missingExploration} more discoveries`,
    };
  }

  if (missingVisits > 0) {
    return {
      uk: `Ще ${missingVisits} віз. до локації`,
      en: `Need ${missingVisits} more return(s)`,
    };
  }

  return {
    uk: `Ще ${missingExploration} відкриттів`,
    en: `Need ${missingExploration} more discoveries`,
  };
}

function getQuestCandidates(
  locationName: string,
  usedQuestIds: Set<string>,
): LocationQuest[] {
  return LOCATION_QUESTS.filter(q => q.locationName === locationName && !usedQuestIds.has(q.id));
}

export function getLocationQuestPreview(
  locationName: string,
  visitCount: number,
  usedQuestIds: Set<string>,
  exploredLocationCount: number,
): LocationQuestPreview | null {
  const candidates = getQuestCandidates(locationName, usedQuestIds);
  if (candidates.length === 0) return null;

  const enriched = candidates.map(quest => ({
    quest,
    ...getQuestMetrics(quest, visitCount, exploredLocationCount),
  }));

  const ready = enriched
    .filter(entry => entry.ready)
    .sort((a, b) => difficultyRank(b.quest.difficulty) - difficultyRank(a.quest.difficulty));
  if (ready.length > 0) {
    const top = ready[0];
    return {
      quest: top.quest,
      status: "ready",
      chance: top.chance,
      note: buildPreviewNote(0, 0),
    };
  }

  const rumored = enriched.sort((a, b) => {
    const missingA = a.missingVisits + a.missingExploration;
    const missingB = b.missingVisits + b.missingExploration;
    if (missingA !== missingB) return missingA - missingB;
    return difficultyRank(b.quest.difficulty) - difficultyRank(a.quest.difficulty);
  })[0];

  return {
    quest: rumored.quest,
    status: "rumored",
    chance: rumored.chance,
    note: buildPreviewNote(rumored.missingVisits, rumored.missingExploration),
  };
}

/**
 * Check if a location quest should trigger.
 * Returns the quest if it triggers, null otherwise.
 */
export function checkLocationQuest(
  locationName: string,
  visitCount: number,
  usedQuestIds: Set<string>,
  context: LocationQuestCheckContext = {},
): LocationQuest | null {
  const exploredLocationCount = context.exploredLocationCount ?? 0;
  const roll = context.roll ?? Math.random();
  const available = getQuestCandidates(locationName, usedQuestIds).filter(q => {
    const metrics = getQuestMetrics(q, visitCount, exploredLocationCount);
    return metrics.ready;
  });

  if (available.length === 0) return null;

  // Check each quest's probability (higher difficulty = checked first for drama)
  const sorted = [...available].sort((a, b) => {
    const order: QuestDifficulty[] = ["legendary", "rare", "uncommon", "common"];
    return order.indexOf(a.difficulty) - order.indexOf(b.difficulty);
  });

  for (const quest of sorted) {
    const { chance } = getQuestMetrics(quest, visitCount, exploredLocationCount);
    if (roll < chance) return quest;
  }

  return null;
}
