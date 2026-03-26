import type { EffectValue } from "./types";

export interface ArtifactDef {
  id: string;
  icon: string; // emoji fallback
  iconPath?: string; // pixel art icon in /icons/items/
  rarity: "common" | "rare" | "cursed";
  passive?: {
    stat: "gold" | "crew" | "karma" | "curse";
    perDay: EffectValue; // fixed number or [min, max] range
  };
  revealRadius?: number; // bonus to fog reveal
  encounterUnlock?: string; // encounter id that becomes available
}

export const ARTIFACTS: Record<string, ArtifactDef> = {
  cursed_compass: {
    id: "cursed_compass",
    icon: "\u{1F9ED}",
    iconPath: "/icons/items/cursed_compass.png",
    rarity: "cursed",
    passive: { stat: "curse", perDay: [0, 1] },
    revealRadius: 2,
  },
  siren_shell: {
    id: "siren_shell",
    icon: "\u{1F41A}",
    iconPath: "/icons/items/siren_shell.png",
    rarity: "rare",
    passive: { stat: "curse", perDay: [-2, -1] },
    encounterUnlock: "siren_sanctuary",
  },
  ghost_lantern: {
    id: "ghost_lantern",
    icon: "\u{1F3EE}",
    iconPath: "/icons/items/ghost_lantern.png",
    rarity: "cursed",
    passive: { stat: "curse", perDay: [0, 1] },
    revealRadius: 2,
    encounterUnlock: "ghost_fleet_contact",
  },
  map_fragment: {
    id: "map_fragment",
    icon: "\u{1F5FA}\uFE0F",
    iconPath: "/icons/items/map_fragment.png",
    rarity: "common",
    revealRadius: 1,
    encounterUnlock: "treasure_map_complete",
  },
  medicine_chest: {
    id: "medicine_chest",
    icon: "\u{1F48A}",
    iconPath: "/icons/items/medicine_chest.png",
    rarity: "common",
    passive: { stat: "crew", perDay: [0, 1] },
  },
  black_pearl: {
    id: "black_pearl",
    icon: "\u{1F5A4}",
    iconPath: "/icons/items/black_pearl.png",
    rarity: "rare",
    passive: { stat: "curse", perDay: [-1, 0] },
    encounterUnlock: "pearl_whispers",
  },
  kraken_tooth: {
    id: "kraken_tooth",
    icon: "\u{1F9B7}",
    iconPath: "/icons/items/kraken_tooth.png",
    rarity: "rare",
    encounterUnlock: "kraken_pact",
  },
  voodoo_doll: {
    id: "voodoo_doll",
    icon: "\u{1FAC6}",
    iconPath: "/icons/items/voodoo_doll.png",
    rarity: "cursed",
    passive: { stat: "curse", perDay: [-1, 1] },
    encounterUnlock: "voodoo_ritual_encounter",
  },
  trade_license: {
    id: "trade_license",
    icon: "\u{1F4DC}",
    iconPath: "/icons/items/trade_license.png",
    rarity: "common",
    passive: { stat: "gold", perDay: [3, 8] },
  },
  ancient_key: {
    id: "ancient_key",
    icon: "\u{1F5DD}\uFE0F",
    iconPath: "/icons/items/ancient_key.png",
    rarity: "rare",
    encounterUnlock: "temple_vault",
  },
};
