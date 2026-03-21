import type { Encounter, StoryletFamily, RunPhase } from "./types";

/**
 * Auto-infer storylet metadata from existing encounter properties.
 * This bridges untagged legacy encounters into the storylet scheduler.
 * Encounters with explicit metadata skip this entirely.
 */

/** Infer family from encounter properties */
export function inferFamily(enc: Encounter): StoryletFamily {
  if (enc.family) return enc.family;

  // Consequence encounters (have requires function)
  if (enc.requires) return "consequence";

  // Location-bound encounters are mini-quests
  if (enc.location) return "quest";

  // Scene-based heuristics
  const id = enc.id;
  if (id.includes("doppelganger") || id.includes("dead_captain") || id.includes("mirror_sea")) return "setpiece";
  if (id.includes("final_") || id.includes("sea_judges")) return "setpiece";
  if (id.includes("kraken_") && id !== "kraken_attack") return "setpiece";

  // Crew relationship encounters
  if (id.startsWith("crew_") || id.includes("martin_") || id.includes("barret_")) return "relationship";

  // Supernatural/ethereal encounters tend to be special
  if (enc.scene === "ethereal" || enc.scene === "kraken") return "setpiece";
  if (enc.scene === "cave" || enc.scene === "underwater") return "quest";

  return "ambient";
}

/** Infer tags from encounter scene and id */
export function inferTags(enc: Encounter): string[] {
  if (enc.tags && enc.tags.length > 0) return enc.tags;

  const tags: string[] = [];
  const id = enc.id;

  // Scene-based tags
  tags.push(enc.scene);

  // Content-based tags from id patterns
  if (id.includes("merchant") || id.includes("market") || id.includes("trading") || id.includes("pearl") || id.includes("floating_market")) {
    tags.push("trade");
  }
  if (id.includes("storm") || id.includes("lightning")) tags.push("weather");
  if (id.includes("crew_") || id.includes("mutiny") || id.includes("desertion") || id.includes("duel")) tags.push("crew");
  if (id.includes("curse") || id.includes("voodoo") || id.includes("ritual")) tags.push("supernatural", "curse");
  if (id.includes("siren") || id.includes("ghost") || id.includes("phantom") || id.includes("mirror") || id.includes("doppelganger")) tags.push("supernatural");
  if (id.includes("island") || id.includes("village") || id.includes("ruins")) tags.push("exploration");
  if (id.includes("navy") || id.includes("convoy") || id.includes("spanish") || id.includes("galleon")) tags.push("military");
  if (id.includes("pirate") || id.includes("barret")) tags.push("pirate");
  if (id.includes("port_") || id.includes("havana") || id.includes("nassau") || id.includes("tortuga") || id.includes("cartagena")) tags.push("port");
  if (id.includes("wreck") || id.includes("dive") || id.includes("temple")) tags.push("exploration");
  if (id.includes("spy") || id.includes("betrayal") || id.includes("trap")) tags.push("intrigue");
  if (enc.scene === "combat") tags.push("combat");
  if (id.includes("dream") || id.includes("bioluminescence") || id.includes("whale") || id.includes("albatross")) tags.push("wonder");

  return [...new Set(tags)]; // deduplicate
}

/** Infer run phase from encounter content */
export function inferPhase(enc: Encounter): RunPhase | RunPhase[] | undefined {
  if (enc.phase) return enc.phase;

  const id = enc.id;

  // Late-game setpieces
  if (id.includes("doppelganger") || id.includes("dead_captain") || id.includes("mirror_sea")) return "late";
  if (id.includes("final_") || id.includes("sea_judges") || id.includes("kraken_pact")) return "late";

  // Early encounters (introductory, low stakes)
  if (id === "whale" || id === "floating_cargo" || id === "crew_storyteller" || id === "albatross") return "early";
  if (id === "bioluminescence" || id === "crossroads_current" || id === "crew_stories") return "early";

  // Mid-game escalation
  if (id.includes("convoy") || id.includes("spanish_galleon") || id.includes("barret")) return "mid";
  if (id.includes("bermuda") || id.includes("kraken_attack")) return ["mid", "late"];

  // Combat tends to be mid-late
  if (enc.scene === "combat" && !enc.requires) return ["mid", "late"];

  return undefined; // fits anywhere
}

/** Infer weight from encounter content */
export function inferWeight(enc: Encounter): number {
  if (enc.weight !== undefined) return enc.weight;

  // Setpieces should be rarer
  const family = inferFamily(enc);
  if (family === "setpiece") return 0.6;

  // Consequence encounters should fire when available
  if (family === "consequence") return 1.8;

  // Location encounters are normal weight
  if (enc.location) return 1.0;

  return 1.0;
}

/** Apply inferred metadata to an encounter (non-mutating) */
export function enrichEncounter(enc: Encounter): Encounter {
  // If encounter already has all metadata, return as-is
  if (enc.family && enc.tags && enc.phase !== undefined && enc.weight !== undefined) {
    return enc;
  }

  return {
    ...enc,
    family: enc.family ?? inferFamily(enc),
    tags: enc.tags ?? inferTags(enc),
    phase: enc.phase ?? inferPhase(enc),
    weight: enc.weight ?? inferWeight(enc),
  };
}
