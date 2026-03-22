import { create } from "zustand";
import type { GameState, Watch, Encounter, Choice, LogEntry, SerializedGameState, Quest } from "./types";
import { resolveValue } from "./effects";
import { pickEncounter, type PickerContext } from "./encounter-picker";
import { type MapState, createMapState, revealAround, serializeMap, deserializeMap } from "../renderer/world-map";
import { findNearestCell, getTerrainForScene, computeRoute, setActiveMap, getMapCells } from "../renderer/map-data";
import { generateMap } from "../renderer/map-generator";
import { ARTIFACTS } from "./items";
import { useGameModeStore } from "./game-mode";
import { useOriginStore, getOrigin } from "./origins";
import { useObjectiveStore } from "./objectives";
import { defaultReps, originRepBonuses, applyRepChanges } from "./factions";
import { checkLocationQuest } from "./location-quests";

type Screen = "title" | "sailing" | "encounter" | "ending";

/** How many recent encounters to track for diversity scoring */
const RECENT_WINDOW = 5;

interface GameStore {
  screen: Screen;
  state: GameState | null;
  encounter: Encounter | null;
  result: string | null;
  pendingChain: string | null; // next encounter id to chain into (player must click continue)
  usedIds: Set<string>;
  quest: Quest | null;
  endingIndex: number | null;
  mapState: MapState | null;
  mapSeed: number | null;
  // Storylet scheduler context
  recentFamilies: string[];
  recentTags: Set<string>;
  recentTagsList: string[][];
  recentIds: string[];
  usedGroups: Set<string>;

  setQuest: (quest: Quest) => void;
  startGame: () => void;
  sail: () => void;
  makeChoice: (choice: Choice) => void;
  continueSailing: () => void;
  setDestination: (pos: [number, number]) => void;
  save: () => void;
  load: () => boolean;
  clearSave: () => void;
}

const SAVE_KEY = "cursed-way-save";

/** Advance watch by 1, rolling over to next day when all 4 watches are spent */
function advanceWatch(state: { day: number; watch: Watch }): { day: number; watch: Watch; newDay: boolean } {
  const nextWatch = ((state.watch + 1) % 4) as Watch;
  const newDay = nextWatch === 0; // rolled over from night(3) to dawn(0)
  return {
    day: newDay ? state.day + 1 : state.day,
    watch: nextWatch,
    newDay,
  };
}

function serialize(state: GameState, mapState: MapState | null, mapSeed: number | null): SerializedGameState {
  return {
    ...state,
    flags: [...state.flags],
    inventory: state.inventory,
    delayedEffects: state.delayedEffects,
    visitedLocations: [...(state.visitedLocations ?? [])],
    factionReps: state.factionReps,
    artifactLog: state.artifactLog,
    npcMeetings: state.npcMeetings,
    locationVisits: state.locationVisits,
    objectiveId: useObjectiveStore.getState().objectiveId ?? undefined,
    gameMode: useGameModeStore.getState().mode,
    mapSeed: mapSeed ?? undefined,
    map: mapState ? serializeMap(mapState) : undefined,
  };
}

function deserialize(data: SerializedGameState): { state: GameState; mapState: MapState | null; mapSeed: number | null } {
  const { map: mapData, gameMode, mapSeed, objectiveId, ...rest } = data;
  // Restore game mode from save
  if (gameMode) {
    useGameModeStore.getState().setMode(gameMode);
  }
  // Restore objective from save
  if (objectiveId) {
    useObjectiveStore.getState().setObjective(objectiveId);
  }
  // Regenerate map terrain from seed (so renderer has the cells)
  if (mapSeed !== undefined) {
    const genMap = generateMap(mapSeed);
    setActiveMap(genMap);
  }
  return {
    state: {
      ...rest,
      watch: (data.watch ?? 0) as Watch,
      flags: new Set(data.flags),
      inventory: data.inventory ?? [],
      delayedEffects: data.delayedEffects ?? [],
      visitedLocations: new Set(data.visitedLocations ?? []),
      factionReps: data.factionReps ?? defaultReps(),
      artifactLog: data.artifactLog ?? [],
      npcMeetings: data.npcMeetings ?? [],
      locationVisits: data.locationVisits ?? {},
    },
    mapState: mapData ? deserializeMap(mapData) : null,
    mapSeed: mapSeed ?? null,
  };
}

export const useGameStore = create<GameStore>((set, get) => ({
  screen: "title",
  state: null,
  encounter: null,
  result: null,
  pendingChain: null,
  usedIds: new Set(),
  quest: null,
  endingIndex: null,
  mapState: null,
  mapSeed: null,
  recentFamilies: [],
  recentTags: new Set(),
  recentTagsList: [],
  recentIds: [],
  usedGroups: new Set(),

  setQuest: (quest) => set({ quest }),

  startGame: () => {
    const { quest } = get();
    if (!quest) return;

    // Generate procedural map for this run
    const genMap = generateMap();
    setActiveMap(genMap);

    // Apply origin bonuses
    const origin = getOrigin(useOriginStore.getState().origin);
    const baseFlags = new Set(quest.initialState.flags);
    for (const f of origin.flags) baseFlags.add(f);

    const state: GameState = {
      ...quest.initialState,
      gold: quest.initialState.gold + (origin.bonuses.gold ?? 0),
      crew: quest.initialState.crew + (origin.bonuses.crew ?? 0),
      karma: quest.initialState.karma + (origin.bonuses.karma ?? 0),
      curse: quest.initialState.curse + (origin.bonuses.curse ?? 0),
      watch: 0 as Watch, // Start at dawn
      flags: baseFlags,
      log: [],
      inventory: [...(quest.initialState.inventory ?? []), ...(origin.items ?? [])],
      delayedEffects: [...(quest.initialState.delayedEffects ?? [])],
      visitedLocations: new Set<string>(),
      artifactLog: [],
      npcMeetings: [],
      locationVisits: {},
      factionReps: applyRepChanges(
        quest.initialState.factionReps ?? defaultReps(),
        originRepBonuses(useOriginStore.getState().origin),
      ),
    };
    set({
      state,
      usedIds: new Set(),
      screen: "sailing",
      encounter: null,
      result: null,
      pendingChain: null,
      endingIndex: null,
      mapState: createMapState(genMap.startPos),
      mapSeed: genMap.seed,
      recentFamilies: [],
      recentTags: new Set(),
      recentTagsList: [],
      recentIds: [],
      usedGroups: new Set(),
    });
  },

  sail: () => {
    const { state, quest, usedIds } = get();
    if (!state || !quest) return;

    const gameMode = useGameModeStore.getState().mode;

    // Check ending conditions
    // In expedition mode: day limit + crew/curse death
    // In free roam: only crew/curse death (no day limit)
    const dayLimitReached = gameMode === "expedition" && state.day >= 20;
    if (dayLimitReached || state.crew <= 0 || state.curse >= 15) {
      const idx = quest.endings.findIndex(e => e.req(state));
      set({ endingIndex: idx >= 0 ? idx : quest.endings.length - 1, screen: "ending" });
      get().clearSave();
      return;
    }

    // Advance watch (each sail action = 1 watch)
    const { day: newDay, watch: newWatch, newDay: isDayTransition } = advanceWatch(state);

    // Build immutable copy for daily effects
    let gold = state.gold;
    let crew = state.crew;
    let karma = state.karma;
    let curse = state.curse;
    const newFlags = new Set(state.flags);
    const newVisitedLocations = new Set(state.visitedLocations);

    // Apply daily effects only at dawn (new day transition)
    if (isDayTransition) {
      // Low crew penalties: morale drops
      if (crew <= 2 && crew > 0) {
        karma = Math.round((karma - 0.5) * 10) / 10;
      }

      // Apply passive artifact effects (once per day)
      if (state.inventory.length > 0) {
        for (const itemId of state.inventory) {
          const def = ARTIFACTS[itemId];
          if (def?.passive) {
            const stat = def.passive.stat;
            const val = resolveValue(def.passive.perDay);
            if (stat === "gold") gold += val;
            else if (stat === "crew") crew += val;
            else if (stat === "karma") karma += val;
            else if (stat === "curse") curse += val;
          }
        }
        crew = Math.max(0, Math.round(crew));
        curse = Math.max(0, Math.round(curse));
        gold = Math.max(0, Math.round(gold));
      }
    }

    // Check for triggered delayed effects
    const triggered = state.delayedEffects.filter(d => d.triggerDay <= newDay);
    if (triggered.length > 0) {
      const delayed = triggered[0];
      const forcedEnc = quest.encounters.find(e => e.id === delayed.encounterId);
      if (forcedEnc) {
        const remaining = state.delayedEffects.filter(d => d !== delayed);
        set({
          encounter: forcedEnc,
          result: null,
          screen: "encounter",
          state: {
            ...state, day: newDay, watch: newWatch,
            gold, crew, karma, curse,
            flags: newFlags,
            visitedLocations: newVisitedLocations,
            delayedEffects: remaining,
          },
        });
        setTimeout(() => get().save(), 0);
        return;
      }
    }

    const { mapState, recentFamilies, recentTags, recentIds, usedGroups } = get();
    const playerPos = mapState?.playerPos;
    const pickerCtx: PickerContext = { recentFamilies, recentTags, usedGroups, recentIds };
    const enc = pickEncounter(quest.encounters, state, usedIds, playerPos ?? undefined, pickerCtx);
    const newUsed = new Set(usedIds);
    newUsed.add(enc.id);

    // Update storylet context for diversity tracking
    const encFamily = enc.family ?? "ambient";
    const newRecentFamilies = [...recentFamilies, encFamily].slice(-RECENT_WINDOW);
    // Track tags as array-of-arrays so old entries rotate out
    const recentTagsList = get().recentTagsList ?? [];
    const newRecentTagsList = [...recentTagsList, enc.tags ?? []].slice(-RECENT_WINDOW);
    const newRecentTags = new Set<string>();
    for (const tags of newRecentTagsList) {
      for (const t of tags) newRecentTags.add(t);
    }
    const newUsedGroups = new Set(usedGroups);
    if (enc.exclusivityGroup) newUsedGroups.add(enc.exclusivityGroup);
    const newRecentIds = [...recentIds, enc.id].slice(-20); // track last 20 encounter ids

    // Update map position (immutable copy)
    let newMapState = mapState ? { ...mapState } : null;
    if (newMapState) {
      // Calculate reveal radius from base + artifact bonuses
      let revealRadius = 3;
      for (const itemId of state.inventory) {
        const def = ARTIFACTS[itemId];
        if (def?.revealRadius) revealRadius += def.revealRadius;
      }
      // Route-based movement: advance along planned route
      if (newMapState.currentRoute && newMapState.routeProgress < newMapState.currentRoute.length) {
        const nextCell = newMapState.currentRoute[newMapState.routeProgress];
        newMapState.playerPos = nextCell;
        newMapState.routeProgress++;
        revealAround(newMapState, nextCell[0], nextCell[1], revealRadius);

        // Arrived at destination?
        if (newMapState.routeProgress >= newMapState.currentRoute.length) {
          const destKey = `${nextCell[0]},${nextCell[1]}`;
          newVisitedLocations.add(destKey);

          // Track location visit count + check for location quests
          const cells = getMapCells();
          const cell = cells[nextCell[1]]?.[nextCell[0]];
          if (cell?.name) {
            const locName = cell.name.en; // quest system uses English names
            const visits = (state.locationVisits[locName] ?? 0) + 1;
            state.locationVisits[locName] = visits;

            const lq = checkLocationQuest(locName, visits, usedIds);
            if (lq) {
              const questEnc = quest.encounters.find(e => e.id === lq.encounterId);
              if (questEnc) {
                const newUsedForLQ = new Set(usedIds);
                newUsedForLQ.add(lq.id);
                newUsedForLQ.add(questEnc.id);

                newMapState.currentRoute = null;
                newMapState.destination = null;
                newMapState.routeProgress = 0;

                set({
                  usedIds: newUsedForLQ,
                  encounter: questEnc,
                  result: null,
                  screen: "encounter",
                  state: {
                    ...state, day: newDay, watch: newWatch,
                    gold, crew, karma, curse,
                    flags: newFlags,
                    visitedLocations: newVisitedLocations,
                    locationVisits: { ...state.locationVisits },
                  },
                  mapState: newMapState,
                });
                setTimeout(() => get().save(), 0);
                return;
              }
            }
          }

          newMapState.currentRoute = null;
          newMapState.destination = null;
          newMapState.routeProgress = 0;
        }
      } else {
        // Fallback: terrain-matching (for when no route is set, e.g. first encounter)
        const terrains = getTerrainForScene(enc.scene);
        const nearest = findNearestCell(newMapState.playerPos[0], newMapState.playerPos[1], terrains);
        if (nearest) {
          newMapState.playerPos = nearest;
          revealAround(newMapState, nearest[0], nearest[1], revealRadius);
        }
      }
    }

    // Track curse peak for curse_breaker objective
    if (curse >= 8 && !newFlags.has("curse_peaked_8")) {
      newFlags.add("curse_peaked_8");
    }

    const updatedState: GameState = {
      ...state,
      day: newDay,
      watch: newWatch,
      gold, crew, karma, curse,
      flags: newFlags,
      visitedLocations: newVisitedLocations,
      inventory: [...state.inventory],
      delayedEffects: [...state.delayedEffects],
      log: [...state.log],
      factionReps: { ...state.factionReps },
      locationVisits: { ...state.locationVisits },
    };

    set({
      usedIds: newUsed,
      encounter: enc,
      result: null,
      screen: "encounter",
      state: updatedState,
      mapState: newMapState,
      recentFamilies: newRecentFamilies,
      recentTags: newRecentTags,
      recentTagsList: newRecentTagsList,
      recentIds: newRecentIds,
      usedGroups: newUsedGroups,
    });

    // Auto-save after picking encounter
    setTimeout(() => get().save(), 0);
  },

  makeChoice: (choice) => {
    const { state, encounter } = get();
    if (!state || !encounter) return;

    const gd = resolveValue(choice.eff.gold);
    const cd = resolveValue(choice.eff.crew);

    const ns: GameState = {
      ...state,
      flags: new Set(state.flags),
      gold: Math.max(0, state.gold + gd),
      crew: Math.max(0, state.crew + cd),
      karma: Math.round((state.karma + (choice.eff.karma || 0)) * 10) / 10,
      curse: Math.max(0, Math.round(state.curse + (choice.eff.curse || 0))),
      log: [...state.log],
      inventory: [...state.inventory],
      delayedEffects: [...state.delayedEffects],
      visitedLocations: new Set(state.visitedLocations),
      artifactLog: [...(state.artifactLog ?? [])],
      npcMeetings: [...(state.npcMeetings ?? [])],
      locationVisits: { ...(state.locationVisits ?? {}) },
      factionReps: choice.eff.rep
        ? applyRepChanges(state.factionReps, choice.eff.rep)
        : { ...state.factionReps },
    };

    // Handle item gain
    if (choice.eff.item) {
      ns.inventory.push(choice.eff.item);
      ns.flags.add(`has_${choice.eff.item}`);
      const encTitle = typeof encounter.title === "function" ? encounter.title(state) : encounter.title;
      ns.artifactLog.push({
        itemId: choice.eff.item,
        day: state.day,
        encounterId: encounter.id,
        encounterTitle: encTitle,
      });
    }
    // Handle item loss
    if (choice.eff.loseItem) {
      const idx = ns.inventory.indexOf(choice.eff.loseItem);
      if (idx >= 0) {
        ns.inventory.splice(idx, 1);
        ns.flags.delete(`has_${choice.eff.loseItem}`);
      }
    }

    // Handle delayed effects
    if (choice.eff.delay) {
      ns.delayedEffects.push({
        triggerDay: state.day + choice.eff.delay.daysLater,
        encounterId: choice.eff.delay.encounterId,
        hint: choice.eff.delay.hint,
      });
    }

    if (choice.flag) {
      const f = typeof choice.flag === "function" ? choice.flag(state) : choice.flag;
      if (f) ns.flags.add(f);
    }

    // Auto-flag combat actions for achievement tracking
    if (encounter.scene === "combat" && cd < 0) {
      ns.flags.add("combat_fought");
    }

    const msg = typeof choice.msg === "function" ? choice.msg(state) : choice.msg;

    const sum: string[] = [];
    if (gd > 0) sum.push(`+${gd}💰`);
    if (gd < 0) sum.push(`${gd}💰`);
    if (cd > 0) sum.push(`+${cd}👥`);
    if (cd < 0) sum.push(`${cd}👥`);
    if ((choice.eff.curse ?? 0) > 0) sum.push(`+${choice.eff.curse}☠`);
    if ((choice.eff.curse ?? 0) < 0) sum.push(`${choice.eff.curse}☠`);
    if (choice.eff.item) {
      const def = ARTIFACTS[choice.eff.item];
      sum.push(`+${def?.icon ?? "?"}`);
    }
    // Faction rep changes
    if (choice.eff.rep) {
      const r = choice.eff.rep;
      if (r.crown && r.crown > 0) sum.push(`+${r.crown}👑`);
      if (r.crown && r.crown < 0) sum.push(`${r.crown}👑`);
      if (r.brethren && r.brethren > 0) sum.push(`+${r.brethren}☠️`);
      if (r.brethren && r.brethren < 0) sum.push(`${r.brethren}☠️`);
      if (r.guild && r.guild > 0) sum.push(`+${r.guild}⚖️`);
      if (r.guild && r.guild < 0) sum.push(`${r.guild}⚖️`);
    }

    const title = typeof encounter.title === "function" ? encounter.title(state) : encounter.title;
    const entry: LogEntry = { day: state.day, title, summary: choice.hidden ? "" : sum.join(" ") };
    ns.log.push(entry);

    // Handle reveal effect
    const { mapState } = get();
    if (choice.eff.reveal && mapState) {
      revealAround(mapState, choice.eff.reveal[0], choice.eff.reveal[1], 3);
      set({ state: ns, result: msg, mapState: { ...mapState } });
    } else {
      set({ state: ns, result: msg });
    }

    // Store pending chain encounter (will trigger when player clicks continue)
    if (choice.eff.chain) {
      set({ pendingChain: choice.eff.chain });
    }
  },

  continueSailing: () => {
    const { pendingChain, quest } = get();
    // If there's a chained encounter waiting, show it instead of sailing
    if (pendingChain && quest) {
      const chainEnc = quest.encounters.find(e => e.id === pendingChain);
      if (chainEnc) {
        set({ encounter: chainEnc, result: null, pendingChain: null });
        return;
      }
    }
    set({ screen: "sailing", encounter: null, result: null, pendingChain: null });
  },

  setDestination: (pos) => {
    const { mapState } = get();
    if (!mapState) return;
    const route = computeRoute(mapState.playerPos, pos);
    set({
      mapState: {
        ...mapState,
        destination: pos,
        currentRoute: route,
        routeProgress: 0,
      },
    });
    // Immediately start sailing
    get().sail();
  },

  save: () => {
    const { state, usedIds, quest, mapState, mapSeed } = get();
    if (!state || !quest) return;
    const data = {
      questId: quest.id,
      state: serialize(state, mapState, mapSeed),
      usedIds: [...usedIds],
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch { /* quota exceeded */ }
  },

  load: () => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      const { state: loadedState, mapState: loadedMap, mapSeed: loadedSeed } = deserialize(data.state);
      set({
        state: loadedState,
        mapState: loadedMap,
        mapSeed: loadedSeed,
        usedIds: new Set(data.usedIds),
        screen: "sailing",
        encounter: null,
        result: null,
        pendingChain: null,
        endingIndex: null,
      });
      return true;
    } catch {
      return false;
    }
  },

  clearSave: () => {
    try { localStorage.removeItem(SAVE_KEY); } catch { /* noop */ }
  },
}));
