export interface DelayedEffect {
  triggerDay: number;
  encounterId: string;
  hint?: string;
}

export type Watch = 0 | 1 | 2 | 3; // 0=dawn, 1=day, 2=dusk, 3=night

export interface GameState {
  gold: number;
  crew: number;
  karma: number;
  curse: number;
  day: number;
  watch: Watch;
  flags: Set<string>;
  log: LogEntry[];
  inventory: string[];
  delayedEffects: DelayedEffect[];
}

export interface SerializedGameState {
  gold: number;
  crew: number;
  karma: number;
  curse: number;
  day: number;
  watch?: Watch;
  flags: string[];
  log: LogEntry[];
  inventory?: string[];
  delayedEffects?: DelayedEffect[];
  gameMode?: import("../engine/game-mode").GameMode;
  mapSeed?: number;
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
  reveal?: [number, number]; // reveal around this map position
  chain?: string;            // encounter id to trigger next (no sailing)
  delay?: {
    daysLater: number;
    encounterId: string;
    hint?: string;
  };
}

export interface Choice {
  text: string;
  eff: Effects;
  msg: string | ((state: GameState) => string);
  flag?: string | ((state: GameState) => string | null);
  requires_item?: string;  // only show if player has this item
  hidden?: boolean;         // don't show stat changes in log
}

/** Storylet content category */
export type StoryletFamily = "ambient" | "consequence" | "quest" | "relationship" | "setpiece";

/** Run phase for pacing */
export type RunPhase = "early" | "mid" | "late";

export interface Encounter {
  id: string;
  scene: SceneId;
  title: string | ((state: GameState) => string);
  text: string | ((state: GameState) => string);
  requires?: (state: GameState) => boolean;
  choices: Choice[];
  enemyType?: "ghost" | "enemy";
  location?: string; // "x,y" key - only triggers at this map cell

  // Storylet metadata (all optional for backward compat)
  family?: StoryletFamily;         // content category, default "ambient"
  tags?: string[];                 // semantic tags for theme matching
  phase?: RunPhase | RunPhase[];   // when this fits best in a run
  weight?: number;                 // base selection weight, default 1
  cooldown?: number;               // min encounters before reuse (for fallback pool)
  exclusivityGroup?: string;       // only one from this group per run
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
