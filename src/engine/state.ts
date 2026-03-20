import { create } from "zustand";
import type { GameState, Encounter, Choice, LogEntry, SerializedGameState, Quest } from "./types";
import { resolveValue } from "./effects";
import { pickEncounter } from "./encounter-picker";
import { type MapState, createMapState, revealAround, serializeMap, deserializeMap } from "../renderer/world-map";
import { START_POS, findNearestCell, getTerrainForScene, computeRoute } from "../renderer/map-data";
import { ARTIFACTS } from "./items";
import { useVariantStore } from "./variant";

type Screen = "title" | "sailing" | "encounter" | "ending";

interface GameStore {
  screen: Screen;
  state: GameState | null;
  encounter: Encounter | null;
  result: string | null;
  usedIds: Set<string>;
  quest: Quest | null;
  endingIndex: number | null;
  mapState: MapState | null;

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

function serialize(state: GameState, mapState: MapState | null): SerializedGameState {
  return {
    ...state,
    flags: [...state.flags],
    inventory: state.inventory,
    map: mapState ? serializeMap(mapState) : undefined,
  };
}

function deserialize(data: SerializedGameState): { state: GameState; mapState: MapState | null } {
  const { map: mapData, ...rest } = data;
  return {
    state: { ...rest, flags: new Set(data.flags), inventory: data.inventory ?? [] },
    mapState: mapData ? deserializeMap(mapData) : null,
  };
}

export const useGameStore = create<GameStore>((set, get) => ({
  screen: "title",
  state: null,
  encounter: null,
  result: null,
  usedIds: new Set(),
  quest: null,
  endingIndex: null,
  mapState: null,

  setQuest: (quest) => set({ quest }),

  startGame: () => {
    const { quest } = get();
    if (!quest) return;
    const state = {
      ...quest.initialState,
      flags: new Set(quest.initialState.flags),
      log: [],
      inventory: [...(quest.initialState.inventory ?? [])],
    };
    const isEnhanced = useVariantStore.getState().variant === "enhanced";
    set({
      state,
      usedIds: new Set(),
      screen: "sailing",
      encounter: null,
      result: null,
      endingIndex: null,
      mapState: isEnhanced ? createMapState(START_POS) : null,
    });
  },

  sail: () => {
    const { state, quest, usedIds } = get();
    if (!state || !quest) return;

    // Check ending conditions
    if (state.day >= 20 || state.crew <= 0 || state.curse >= 15) {
      const idx = quest.endings.findIndex(e => e.req(state));
      set({ endingIndex: idx >= 0 ? idx : quest.endings.length - 1, screen: "ending" });
      get().clearSave();
      return;
    }

    // Apply passive artifact effects
    if (state.inventory.length > 0) {
      for (const itemId of state.inventory) {
        const def = ARTIFACTS[itemId];
        if (def?.passive) {
          (state as unknown as Record<string, number>)[def.passive.stat] += def.passive.perDay;
        }
      }
      state.crew = Math.max(0, Math.round(state.crew));
      state.curse = Math.max(0, state.curse);
      state.gold = Math.max(0, Math.round(state.gold));
    }

    const { mapState } = get();
    const playerPos = mapState?.playerPos;
    const enc = pickEncounter(quest.encounters, state, usedIds, playerPos ?? undefined);
    const newUsed = new Set(usedIds);
    newUsed.add(enc.id);

    // Update map position for enhanced mode
    if (mapState) {
      // Calculate reveal radius from base + artifact bonuses
      let revealRadius = 3;
      for (const itemId of state.inventory) {
        const def = ARTIFACTS[itemId];
        if (def?.revealRadius) revealRadius += def.revealRadius;
      }
      // Route-based movement: advance along planned route
      if (mapState.currentRoute && mapState.routeProgress < mapState.currentRoute.length) {
        const nextCell = mapState.currentRoute[mapState.routeProgress];
        mapState.playerPos = nextCell;
        mapState.routeProgress++;
        revealAround(mapState, nextCell[0], nextCell[1], revealRadius);

        // Arrived at destination?
        if (mapState.routeProgress >= mapState.currentRoute.length) {
          mapState.currentRoute = null;
          mapState.destination = null;
          mapState.routeProgress = 0;
        }
      } else {
        // Fallback: terrain-matching (for when no route is set, e.g. first encounter)
        const terrains = getTerrainForScene(enc.scene);
        const nearest = findNearestCell(mapState.playerPos[0], mapState.playerPos[1], terrains);
        if (nearest) {
          mapState.playerPos = nearest;
          revealAround(mapState, nearest[0], nearest[1], revealRadius);
        }
      }
    }

    set({
      usedIds: newUsed,
      encounter: enc,
      result: null,
      screen: "encounter",
      state: { ...state, day: state.day + 1 },
      mapState: mapState ? { ...mapState } : null,
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
      karma: state.karma + (choice.eff.karma || 0),
      curse: Math.max(0, state.curse + (choice.eff.curse || 0)),
      log: [...state.log],
      inventory: [...state.inventory],
    };

    // Handle item gain
    if (choice.eff.item) {
      ns.inventory.push(choice.eff.item);
      ns.flags.add(`has_${choice.eff.item}`);
    }
    // Handle item loss
    if (choice.eff.loseItem) {
      const idx = ns.inventory.indexOf(choice.eff.loseItem);
      if (idx >= 0) {
        ns.inventory.splice(idx, 1);
        ns.flags.delete(`has_${choice.eff.loseItem}`);
      }
    }

    if (choice.flag) {
      const f = typeof choice.flag === "function" ? choice.flag(state) : choice.flag;
      if (f) ns.flags.add(f);
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

    const title = typeof encounter.title === "function" ? encounter.title(state) : encounter.title;
    const entry: LogEntry = { day: state.day, title, summary: sum.join(" ") };
    ns.log.push(entry);

    set({ state: ns, result: msg });
  },

  continueSailing: () => {
    set({ screen: "sailing", encounter: null, result: null });
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
    const { state, usedIds, quest, mapState } = get();
    if (!state || !quest) return;
    const data = {
      questId: quest.id,
      state: serialize(state, mapState),
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
      const { state: loadedState, mapState: loadedMap } = deserialize(data.state);
      set({
        state: loadedState,
        mapState: loadedMap,
        usedIds: new Set(data.usedIds),
        screen: "sailing",
        encounter: null,
        result: null,
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
