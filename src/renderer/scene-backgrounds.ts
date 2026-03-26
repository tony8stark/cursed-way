import type { SceneId } from "../engine/types";
import type { TimeOfDay } from "./atmosphere";

const SCENE_BACKGROUND_URLS = {
  "battle_day": "/backgrounds/generated/battle_day.png",
  "battle_dusk": "/backgrounds/generated/battle_dusk.png",
  "battle_night": "/backgrounds/generated/battle_night.png",
  "combat_dawn": "/backgrounds/generated/combat_dawn.png",
  "crystal_cave": "/backgrounds/generated/crystal_cave.png",
  "cursed-grotto": "/backgrounds/generated/cursed-grotto.png",
  "davy_jones_realm": "/backgrounds/generated/davy_jones_realm.png",
  "deep_abyss": "/backgrounds/generated/deep_abyss.png",
  "ethereal_cursed_dimension": "/backgrounds/generated/ethereal_cursed_dimension.png",
  "ethereal_spirit_sea": "/backgrounds/generated/ethereal_spirit_sea.png",
  "ghost_ship_graveyard": "/backgrounds/generated/ghost_ship_graveyard.png",
  "island_dawn": "/backgrounds/generated/island_dawn.png",
  "island_day": "/backgrounds/generated/island_day.png",
  "island_dusk": "/backgrounds/generated/island_dusk.png",
  "island_night": "/backgrounds/generated/island_night.png",
  "kraken-rising": "/backgrounds/generated/kraken-rising.png",
  "leviathan_below": "/backgrounds/generated/leviathan_below.png",
  "open_sea_dawn": "/backgrounds/generated/open_sea_dawn.png",
  "open_sea_day": "/backgrounds/generated/open_sea_day.png",
  "open_sea_dusk": "/backgrounds/generated/open_sea_dusk.png",
  "open_sea_night": "/backgrounds/generated/open_sea_night.png",
  "port_dawn": "/backgrounds/generated/port_dawn.png",
  "port_day": "/backgrounds/generated/port_day.png",
  "port_dusk": "/backgrounds/generated/port_dusk.png",
  "port_night": "/backgrounds/generated/port_night.png",
  "sea_cave": "/backgrounds/generated/sea_cave.png",
  "sea_serpent": "/backgrounds/generated/sea_serpent.png",
  "shipwreck_depths": "/backgrounds/generated/shipwreck_depths.png",
  "storm_dawn": "/backgrounds/generated/storm_dawn.png",
  "storm_day": "/backgrounds/generated/storm_day.png",
  "storm_dusk": "/backgrounds/generated/storm_dusk.png",
  "storm_night": "/backgrounds/generated/storm_night.png",
  "sunken_ruins": "/backgrounds/generated/sunken_ruins.png",
  "tentacle_storm": "/backgrounds/generated/tentacle_storm.png",
  "underwater-cavern": "/backgrounds/generated/underwater-cavern.png",
  "underwater_coral_reef": "/backgrounds/generated/underwater_coral_reef.png",
} as const;

export type SceneBackgroundKey = keyof typeof SCENE_BACKGROUND_URLS;

export interface SceneBackgroundContext {
  scene: SceneId;
  time?: TimeOfDay;
  encounterId?: string;
  enemyType?: string;
}

export interface SceneShipVisibilityContext {
  scene: SceneId;
  hasBackdrop: boolean;
}

const imageCache = new Map<string, HTMLImageElement>();

function hasAny(text: string, needles: string[]): boolean {
  return needles.some((needle) => text.includes(needle));
}

function resolveTimedKey(prefix: "open_sea" | "storm" | "island" | "port", time: TimeOfDay = "day"): SceneBackgroundKey {
  return `${prefix}_${time}` as SceneBackgroundKey;
}

export function resolveSceneBackgroundKey({
  scene,
  time,
  encounterId,
  enemyType,
}: SceneBackgroundContext): SceneBackgroundKey {
  const id = encounterId?.toLowerCase() ?? "";

  switch (scene) {
    case "open_sea":
      return resolveTimedKey("open_sea", time);
    case "storm":
      return resolveTimedKey("storm", time);
    case "island":
      return resolveTimedKey("island", time);
    case "port":
      return resolveTimedKey("port", time);
    case "combat":
      if (enemyType === "ghost" || hasAny(id, ["ghost_ship", "ghost_fleet", "dutchman"])) {
        return "ghost_ship_graveyard";
      }
      if ((time ?? "day") === "dawn") return "combat_dawn";
      if ((time ?? "day") === "dusk") return "battle_dusk";
      if ((time ?? "day") === "night") return "battle_night";
      return "battle_day";
    case "cave":
      if (hasAny(id, ["shadow", "voodoo", "ritual", "cursed"])) {
        return "cursed-grotto";
      }
      if (hasAny(id, ["treasure", "vault", "temple", "pirate_king", "tomb"])) {
        return "crystal_cave";
      }
      return "sea_cave";
    case "ethereal":
      if (hasAny(id, ["ghost_fleet", "dutchman", "dead_captain", "phantom", "ghost"])) {
        return "ghost_ship_graveyard";
      }
      if (hasAny(id, ["final_reckoning", "sea_judges", "cargo_awakens", "doppelganger", "mirror", "bermuda", "judge"])) {
        return "ethereal_cursed_dimension";
      }
      return "ethereal_spirit_sea";
    case "underwater":
      if (hasAny(id, ["davy", "jones"])) {
        return "davy_jones_realm";
      }
      if (hasAny(id, ["wreck", "galleon", "caravel"])) {
        return "shipwreck_depths";
      }
      if (hasAny(id, ["temple", "ruins"])) {
        return "sunken_ruins";
      }
      if (hasAny(id, ["cave"])) {
        return "underwater-cavern";
      }
      if (hasAny(id, ["squid", "deep", "abyss"])) {
        return "deep_abyss";
      }
      return "underwater_coral_reef";
    case "kraken":
      if (hasAny(id, ["serpent"])) {
        return "sea_serpent";
      }
      if (hasAny(id, ["pact", "lair"])) {
        return "leviathan_below";
      }
      if (hasAny(id, ["attack"])) {
        return "tentacle_storm";
      }
      return "kraken-rising";
  }
}

export function getSceneBackgroundUrl(context: SceneBackgroundContext): string {
  return SCENE_BACKGROUND_URLS[resolveSceneBackgroundKey(context)];
}

export function shouldDrawSceneShip({ scene, hasBackdrop }: SceneShipVisibilityContext): boolean {
  if (scene === "port" && hasBackdrop) return false;
  return true;
}

export function drawSceneBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  context: SceneBackgroundContext,
): boolean {
  if (typeof Image === "undefined") return false;

  const url = getSceneBackgroundUrl(context);
  let image = imageCache.get(url);
  if (!image) {
    image = new Image();
    image.src = url;
    imageCache.set(url, image);
    return false;
  }

  if (!image.complete || image.naturalWidth === 0) return false;

  const prevSmoothing = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, 0, 0, width, height);
  ctx.imageSmoothingEnabled = prevSmoothing;
  return true;
}
