export interface GameState {
  gold: number;
  crew: number;
  karma: number;
  curse: number;
  day: number;
  flags: Set<string>;
  log: LogEntry[];
  inventory: string[];
}

export interface SerializedGameState {
  gold: number;
  crew: number;
  karma: number;
  curse: number;
  day: number;
  flags: string[];
  log: LogEntry[];
  inventory?: string[];
  map?: import("../renderer/world-map").SerializedMapState;
}

export interface LogEntry {
  day: number;
  title: string;
  summary: string;
}

export type SceneId =
  | "open_sea"
  | "storm"
  | "island"
  | "cave"
  | "combat"
  | "ethereal"
  | "port"
  | "underwater"
  | "kraken";

export type EffectValue = number | [number, number];

export interface Effects {
  gold?: EffectValue;
  crew?: EffectValue;
  karma?: number;
  curse?: number;
  item?: string;       // artifact id to gain
  loseItem?: string;   // artifact id to consume
}

export interface Choice {
  text: string;
  eff: Effects;
  msg: string | ((state: GameState) => string);
  flag?: string | ((state: GameState) => string | null);
}

export interface Encounter {
  id: string;
  scene: SceneId;
  title: string | ((state: GameState) => string);
  text: string | ((state: GameState) => string);
  requires?: (state: GameState) => boolean;
  choices: Choice[];
  enemyType?: "ghost" | "enemy";
}

export interface Ending {
  req: (state: GameState) => boolean;
  title: string;
  text: string | ((state: GameState) => string);
  color: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  encounters: Encounter[];
  endings: Ending[];
  initialState: GameState;
}
