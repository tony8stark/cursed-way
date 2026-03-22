import type { Locale } from "../i18n";

// ─── Faction types ─────────────────────────────────────────────

export type FactionId = "crown" | "brethren" | "guild";

export interface FactionDef {
  id: FactionId;
  icon: string;
  name: Record<Locale, string>;
  desc: Record<Locale, string>;
  /** Reputation tier thresholds */
  tiers: FactionTier[];
}

export interface FactionTier {
  minRep: number;
  name: Record<Locale, string>;
  color: string;
}

export interface FactionReps {
  crown: number;
  brethren: number;
  guild: number;
}

// ─── Faction definitions ───────────────────────────────────────

export const FACTIONS: Record<FactionId, FactionDef> = {
  crown: {
    id: "crown",
    icon: "👑",
    name: { uk: "Корона", en: "The Crown" },
    desc: {
      uk: "Королівський флот і колоніальна влада. Закон, порядок, контроль.",
      en: "The Royal Navy and colonial power. Law, order, control.",
    },
    tiers: [
      { minRep: -10, name: { uk: "Зрадник", en: "Traitor" }, color: "#c02020" },
      { minRep: -5, name: { uk: "Розшукуваний", en: "Wanted" }, color: "#c06020" },
      { minRep: -2, name: { uk: "Підозрілий", en: "Suspect" }, color: "#c0a020" },
      { minRep: 0, name: { uk: "Невідомий", en: "Unknown" }, color: "#808080" },
      { minRep: 3, name: { uk: "Союзник", en: "Ally" }, color: "#40a0c0" },
      { minRep: 6, name: { uk: "Довірений", en: "Trusted" }, color: "#4080f0" },
      { minRep: 9, name: { uk: "Лицар", en: "Knight" }, color: "#f0c040" },
    ],
  },
  brethren: {
    id: "brethren",
    icon: "☠️",
    name: { uk: "Братство", en: "The Brethren" },
    desc: {
      uk: "Піратське братство. Свобода, хаос, здобич.",
      en: "The Pirate Brotherhood. Freedom, chaos, plunder.",
    },
    tiers: [
      { minRep: -10, name: { uk: "Мисливець", en: "Hunter" }, color: "#c02020" },
      { minRep: -5, name: { uk: "Зрадник коду", en: "Code-Breaker" }, color: "#c06020" },
      { minRep: -2, name: { uk: "Чужак", en: "Outsider" }, color: "#c0a020" },
      { minRep: 0, name: { uk: "Невідомий", en: "Unknown" }, color: "#808080" },
      { minRep: 3, name: { uk: "Свій", en: "One of Us" }, color: "#40c080" },
      { minRep: 6, name: { uk: "Вовк моря", en: "Sea Wolf" }, color: "#40f8a0" },
      { minRep: 9, name: { uk: "Легенда", en: "Legend" }, color: "#f0c040" },
    ],
  },
  guild: {
    id: "guild",
    icon: "⚖️",
    name: { uk: "Гільдія", en: "The Guild" },
    desc: {
      uk: "Торгова гільдія. Комерція, нейтралітет, прибуток.",
      en: "The Merchants' Guild. Commerce, neutrality, profit.",
    },
    tiers: [
      { minRep: -10, name: { uk: "Грабіжник", en: "Raider" }, color: "#c02020" },
      { minRep: -5, name: { uk: "Ненадійний", en: "Unreliable" }, color: "#c06020" },
      { minRep: -2, name: { uk: "Ризикований", en: "Risky" }, color: "#c0a020" },
      { minRep: 0, name: { uk: "Невідомий", en: "Unknown" }, color: "#808080" },
      { minRep: 3, name: { uk: "Партнер", en: "Partner" }, color: "#c0a040" },
      { minRep: 6, name: { uk: "Привілейований", en: "Privileged" }, color: "#f0c040" },
      { minRep: 9, name: { uk: "Магнат", en: "Magnate" }, color: "#f0c040" },
    ],
  },
};

export const FACTION_IDS: FactionId[] = ["crown", "brethren", "guild"];

// ─── Helpers ───────────────────────────────────────────────────

/** Get the current tier for a faction based on reputation */
export function getFactionTier(factionId: FactionId, rep: number): FactionTier {
  const faction = FACTIONS[factionId];
  let result = faction.tiers[0];
  for (const tier of faction.tiers) {
    if (rep >= tier.minRep) result = tier;
  }
  return result;
}

/** Clamp reputation to [-10, 10] */
export function clampRep(rep: number): number {
  return Math.max(-10, Math.min(10, Math.round(rep * 10) / 10));
}

/** Get default starting reps (all 0) */
export function defaultReps(): FactionReps {
  return { crown: 0, brethren: 0, guild: 0 };
}

/** Starting reputation bonuses by origin */
export function originRepBonuses(originId: string): Partial<FactionReps> {
  switch (originId) {
    case "navy_defector": return { crown: 3, brethren: -2 };
    case "smuggler": return { brethren: 2, guild: 1, crown: -1 };
    case "scholar": return { guild: 2 };
    case "mutineer": return { brethren: 3, crown: -3 };
    default: return {};
  }
}

/** Apply rep changes, clamping to [-10, 10] */
export function applyRepChanges(
  current: FactionReps,
  changes: Partial<FactionReps>
): FactionReps {
  return {
    crown: clampRep((current.crown ?? 0) + (changes.crown ?? 0)),
    brethren: clampRep((current.brethren ?? 0) + (changes.brethren ?? 0)),
    guild: clampRep((current.guild ?? 0) + (changes.guild ?? 0)),
  };
}
