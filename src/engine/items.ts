export interface ArtifactDef {
  id: string;
  icon: string;
  rarity: "common" | "rare" | "cursed";
  passive?: {
    stat: "gold" | "crew" | "karma" | "curse";
    perDay: number;
  };
  revealRadius?: number; // bonus to fog reveal
  encounterUnlock?: string; // encounter id that becomes available
}

export const ARTIFACTS: Record<string, ArtifactDef> = {
  cursed_compass: {
    id: "cursed_compass",
    icon: "\u{1F9ED}",
    rarity: "cursed",
    revealRadius: 2,
  },
  siren_shell: {
    id: "siren_shell",
    icon: "\u{1F41A}",
    rarity: "rare",
    passive: { stat: "curse", perDay: -1 },
    encounterUnlock: "siren_sanctuary",
  },
  ghost_lantern: {
    id: "ghost_lantern",
    icon: "\u{1F3EE}",
    rarity: "cursed",
    passive: { stat: "curse", perDay: 0.3 },
    revealRadius: 1,
    encounterUnlock: "ghost_fleet_contact",
  },
  map_fragment: {
    id: "map_fragment",
    icon: "\u{1F5FA}\uFE0F",
    rarity: "common",
  },
  medicine_chest: {
    id: "medicine_chest",
    icon: "\u{1F48A}",
    rarity: "common",
    passive: { stat: "crew", perDay: 0.5 },
  },
  black_pearl: {
    id: "black_pearl",
    icon: "\u{1F5A4}",
    rarity: "rare",
  },
  kraken_tooth: {
    id: "kraken_tooth",
    icon: "\u{1F9B7}",
    rarity: "rare",
    encounterUnlock: "kraken_pact",
  },
  voodoo_doll: {
    id: "voodoo_doll",
    icon: "\u{1FAC6}",
    rarity: "cursed",
    passive: { stat: "karma", perDay: -0.5 },
    encounterUnlock: "voodoo_ritual_encounter",
  },
  trade_license: {
    id: "trade_license",
    icon: "\u{1F4DC}",
    rarity: "common",
    passive: { stat: "gold", perDay: 8 },
  },
  ancient_key: {
    id: "ancient_key",
    icon: "\u{1F5DD}\uFE0F",
    rarity: "rare",
    encounterUnlock: "temple_vault",
  },
};
