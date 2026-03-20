import { create } from "zustand";
import type { GameState, Encounter, Choice, LogEntry, SerializedGameState, Quest } from "./types";
import { resolveValue } from "./effects";
import { pickEncounter } from "./encounter-picker";
import { type MapState, createMapState, revealAround, serializeMap, deserializeMap } from "../renderer/world-map";
import { START_POS, findNearestCell, getTerrainForScene } from "../renderer/map-data";
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
  save: () => void;
  load: () => boolean;
  clearSave: () => void;
}

const SAVE_KEY = "cursed-way-save";

function serialize(state: GameState, mapState: MapState | null): SerializedGameState {
  return {
    ...state,
    flags: [...state.flags],
    map: mapState ? serializeMap(mapState) : undefined,
  };
}

function deserialize(data: SerializedGameState): { state: GameState; mapState: MapState | null } {
  const { map: mapData, ...rest } = data;
  return {
    state: { ...rest, flags: new Set(data.flags) },
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

    const enc = pickEncounter(quest.encounters, state, usedIds);
    const newUsed = new Set(usedIds);
    newUsed.add(enc.id);

    // Update map position for enhanced mode
    const { mapState } = get();
    if (mapState) {
      const terrains = getTerrainForScene(enc.scene);
      const nearest = findNearestCell(mapState.playerPos[0], mapState.playerPos[1], terrains);
      if (nearest) {
        mapState.playerPos = nearest;
        const revealRadius = state.flags.has("cursed_compass") ? 5 : 3;
        revealAround(mapState, nearest[0], nearest[1], revealRadius);
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
    };

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

    const title = typeof encounter.title === "function" ? encounter.title(state) : encounter.title;
    const entry: LogEntry = { day: state.day, title, summary: sum.join(" ") };
    ns.log.push(entry);

    set({ state: ns, result: msg });
  },

  continueSailing: () => {
    set({ screen: "sailing", encounter: null, result: null });
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
