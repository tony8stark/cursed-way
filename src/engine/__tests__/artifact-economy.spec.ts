import { describe, expect, it } from "vitest";
import { ITEM_DESCRIPTIONS } from "../items-i18n";
import { ARTIFACTS } from "../items";

describe("artifact economy balance", () => {
  it("tones trade licenses down to steady income instead of runaway scaling", () => {
    expect(ARTIFACTS.trade_license.passive).toEqual({
      stat: "gold",
      perDay: [3, 8],
    });
  });

  it("makes the cursed compass pay a visible curse cost for its navigation edge", () => {
    expect(ARTIFACTS.cursed_compass.passive).toEqual({
      stat: "curse",
      perDay: [0, 1],
    });
  });

  it("turns the voodoo doll into a swingy curse tool instead of a flat karma tax", () => {
    expect(ARTIFACTS.voodoo_doll.passive).toEqual({
      stat: "curse",
      perDay: [-1, 1],
    });
  });

  it("gives the ghost lantern enough exploration upside to justify the risk", () => {
    expect(ARTIFACTS.ghost_lantern.revealRadius).toBe(2);
  });

  it("makes cursed artifact descriptions explain why a player might still want them", () => {
    expect(ITEM_DESCRIPTIONS.cursed_compass.en.toLowerCase()).toMatch(/curse|cost|price/);
    expect(ITEM_DESCRIPTIONS.ghost_lantern.en.toLowerCase()).toMatch(/ghost|wreck|hidden/);
    expect(ITEM_DESCRIPTIONS.voodoo_doll.en.toLowerCase()).toMatch(/ritual|burn|absorb|pain/);
  });
});
