import { describe, expect, it } from "vitest";
import { resolveSceneBackgroundKey } from "../scene-backgrounds";

describe("scene background resolver", () => {
  it("uses time-of-day variants for open sea", () => {
    expect(resolveSceneBackgroundKey({
      scene: "open_sea",
      time: "dawn",
    })).toBe("open_sea_dawn");

    expect(resolveSceneBackgroundKey({
      scene: "open_sea",
      time: "night",
    })).toBe("open_sea_night");
  });

  it("uses battle variants for standard combat", () => {
    expect(resolveSceneBackgroundKey({
      scene: "combat",
      time: "dusk",
      encounterId: "convoy_attack",
      enemyType: "enemy",
    })).toBe("battle_dusk");
  });

  it("uses ghost graveyard for ghost combat encounters", () => {
    expect(resolveSceneBackgroundKey({
      scene: "combat",
      time: "night",
      encounterId: "ghost_ship",
      enemyType: "ghost",
    })).toBe("ghost_ship_graveyard");
  });

  it("routes cursed cave encounters to the cursed grotto backdrop", () => {
    expect(resolveSceneBackgroundKey({
      scene: "cave",
      encounterId: "shadow_cave_ritual",
    })).toBe("cursed-grotto");
  });

  it("routes legendary underwater content to its dedicated backdrop", () => {
    expect(resolveSceneBackgroundKey({
      scene: "underwater",
      encounterId: "lq_davy_jones",
    })).toBe("davy_jones_realm");
  });

  it("routes ghostly ethereal runs to the graveyard sea backdrop", () => {
    expect(resolveSceneBackgroundKey({
      scene: "ethereal",
      encounterId: "ghost_fleet_contact",
    })).toBe("ghost_ship_graveyard");
  });

  it("routes serpent and pact kraken encounters to different monstrous backdrops", () => {
    expect(resolveSceneBackgroundKey({
      scene: "kraken",
      encounterId: "combat_sea_serpent",
    })).toBe("sea_serpent");

    expect(resolveSceneBackgroundKey({
      scene: "kraken",
      encounterId: "kraken_pact",
    })).toBe("leviathan_below");
  });
});
