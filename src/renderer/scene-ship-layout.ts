import type { SceneId } from "../engine/types";

export interface SceneShipLayoutContext {
  scene: SceneId;
  width: number;
  height: number;
  frame: number;
}

export interface SceneShipLayout {
  x: number;
  y: number;
}

const LEFT_ANCHORED_SCENES = new Set<SceneId>(["island", "combat", "port"]);
const SHIP_BASELINE_RATIO = 0.72;
const SHIP_BOB_AMPLITUDE = 2;
const SHIP_BOB_RATE = 0.04;

export function getSceneShipLayout({ scene, width, height, frame }: SceneShipLayoutContext): SceneShipLayout {
  const x = LEFT_ANCHORED_SCENES.has(scene) ? width * 0.06 : width * 0.35;
  const y = height * SHIP_BASELINE_RATIO + Math.sin(frame * SHIP_BOB_RATE) * SHIP_BOB_AMPLITUDE;

  return { x, y };
}
