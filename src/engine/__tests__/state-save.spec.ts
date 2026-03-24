import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Choice, Encounter, GameState, Quest } from "../types";
import { useGameStore } from "../state";
import { useGameModeStore } from "../game-mode";
import { useObjectiveStore } from "../objectives";

const SAVE_KEY = "cursed-way-save";

function createState(overrides: Partial<GameState> = {}): GameState {
  return {
    gold: 10,
    crew: 5,
    karma: 0,
    curse: 0,
    day: 1,
    watch: 0,
    flags: new Set<string>(),
    log: [],
    inventory: [],
    delayedEffects: [],
    visitedLocations: new Set<string>(),
    factionReps: { crown: 0, brethren: 0, guild: 0 },
    artifactLog: [],
    npcMeetings: [],
    locationVisits: {},
    ...overrides,
  };
}

function createEncounter(choice: Choice): Encounter {
  return {
    id: "test-encounter",
    scene: "open_sea",
    title: "Test Encounter",
    text: "Test text",
    choices: [choice],
  };
}

function createQuest(initialState: GameState): Quest {
  return {
    id: "test-quest",
    title: "Test Quest",
    description: "Test quest",
    encounters: [],
    endings: [
      {
        id: "survivor",
        req: () => true,
        title: "Survivor",
        text: "Done",
        color: "#fff",
      },
    ],
    initialState,
  };
}

function resetStores() {
  useGameStore.setState({
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
  });
  useGameModeStore.setState({ mode: "expedition" });
  useObjectiveStore.setState({ objectiveId: null });
}

describe("state save/load", () => {
  beforeEach(() => {
    localStorage.clear();
    resetStores();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
    resetStores();
  });

  it("autosaves the resolved state after makeChoice", () => {
    vi.useFakeTimers();

    const choice: Choice = {
      text: "Take the gold",
      eff: { gold: 5 },
      msg: "You got paid.",
    };
    const state = createState();
    const quest = createQuest(state);

    useGameStore.getState().setQuest(quest);
    useGameStore.setState({
      state,
      encounter: createEncounter(choice),
      screen: "encounter",
    });

    useGameStore.getState().makeChoice(choice);
    vi.runAllTimers();

    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) ?? "null");

    expect(saved).not.toBeNull();
    expect(saved.state.gold).toBe(15);
    expect(saved.state.log).toHaveLength(1);
  });

  it("persists and restores storylet scheduler context", async () => {
    const state = createState();
    const quest = createQuest(state);

    useGameStore.getState().setQuest(quest);
    useGameStore.setState({
      state,
      usedIds: new Set(["enc_a", "enc_b"]),
      recentFamilies: ["ambient", "quest"],
      recentTags: new Set(["storm", "ghost"]),
      recentTagsList: [["storm"], ["ghost"]],
      recentIds: ["enc_a", "enc_b"],
      usedGroups: new Set(["group_a"]),
      screen: "sailing",
    });

    useGameStore.getState().save();

    useGameStore.setState({
      usedIds: new Set(),
      recentFamilies: [],
      recentTags: new Set(),
      recentTagsList: [],
      recentIds: [],
      usedGroups: new Set(),
    });

    await expect(useGameStore.getState().load()).resolves.toBe(true);

    const restored = useGameStore.getState();

    expect([...restored.usedIds]).toEqual(["enc_a", "enc_b"]);
    expect(restored.recentFamilies).toEqual(["ambient", "quest"]);
    expect(restored.recentTagsList).toEqual([["storm"], ["ghost"]]);
    expect(restored.recentIds).toEqual(["enc_a", "enc_b"]);
    expect([...restored.usedGroups]).toEqual(["group_a"]);
    expect([...restored.recentTags]).toEqual(["storm", "ghost"]);
  });
});
