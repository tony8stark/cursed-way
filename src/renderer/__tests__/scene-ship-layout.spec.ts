import { describe, expect, it } from "vitest";
import { getSceneShipLayout } from "../scene-ship-layout";
import type { SceneId } from "../../engine/types";

describe("scene ship layout", () => {
  it("keeps the ship on the same vertical anchor across visible ship scenes", () => {
    const scenes: SceneId[] = ["open_sea", "storm", "island", "combat", "ethereal", "port", "kraken"];
    const layouts = scenes.map((scene) => getSceneShipLayout({
      scene,
      width: 520,
      height: 300,
      frame: 73,
    }));

    const expectedY = layouts[0].y;
    for (const layout of layouts) {
      expect(layout.y).toBeCloseTo(expectedY, 5);
    }
  });

  it("keeps the existing horizontal composition groups while sharing the vertical baseline", () => {
    expect(getSceneShipLayout({ scene: "open_sea", width: 520, height: 300, frame: 10 }).x).toBeCloseTo(182, 0);
    expect(getSceneShipLayout({ scene: "ethereal", width: 520, height: 300, frame: 10 }).x).toBeCloseTo(182, 0);
    expect(getSceneShipLayout({ scene: "combat", width: 520, height: 300, frame: 10 }).x).toBeCloseTo(31.2, 1);
    expect(getSceneShipLayout({ scene: "port", width: 520, height: 300, frame: 10 }).x).toBeCloseTo(31.2, 1);
  });
});
