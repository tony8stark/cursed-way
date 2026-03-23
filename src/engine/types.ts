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
  visitedLocations: Set<string>;
  factionReps: import("./factions").FactionReps;
  artifactLog: ArtifactLog[];
  npcMeetings: NPCMeeting[];
  locationVisits: Record<string, number>;
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
  visitedLocations?: string[];
  factionReps?: import("./factions").FactionReps;
  artifactLog?: ArtifactLog[];
  npcMeetings?: NPCMeeting[];
  locationVisits?: Record<string, number>;
  objectiveId?: string;
  gameMode?: import("../engine/game-mode").GameMode;
  mapSeed?: number;
  map?: import("../renderer/world-map").SerializedMapState;
}

export interface LogEntry {
  day: number;
  title: string;
  summary: string;
}

/** Tracks where and when an artifact was found */
export interface ArtifactLog {
  itemId: string;
  day: number;
  encounterId: string;
  encounterTitle: string;
}

/** Tracks NPCs the player has met */
export interface NPCMeeting {
  npcId: string;
  day: number;
  encounterId: string;
  encounterTitle: string;
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
  rep?: Partial<import("./factions").FactionReps>; // faction reputation changes
}

export interface Choice {
  text: string;
  eff: Effects;
  msg: string | ((state: GameState) => string);
  flag?: string | ((state: GameState) => string | null);
  requires_item?: string;  // only show if player has this item
  requires_flag?: string;  // only show if player has this flag (e.g. origin flags)
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
  enemyType?: "ghost" | "enemy" | "merchant" | "raider";
  location?: string; // deprecated: "x,y" key (ignored on procedural maps)
  locationName?: string; // location name (en) - only triggers at named destination
  npc?: string;      // NPC id - shows portrait in encounter screen

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
