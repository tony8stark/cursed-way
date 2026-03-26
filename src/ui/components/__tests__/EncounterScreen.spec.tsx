import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import type { Encounter, GameState } from "../../../engine/types";
import { useGameStore } from "../../../engine/state";
import { useGameModeStore } from "../../../engine/game-mode";
import { useObjectiveStore } from "../../../engine/objectives";
import { EncounterScreen } from "../EncounterScreen";

vi.mock("../../../audio/audio-manager", () => ({
  audioManager: {
    playAmbient: vi.fn(),
    stopAmbient: vi.fn(),
    setMuted: vi.fn(),
    playSFX: vi.fn(),
  },
}));

vi.mock("../GameCanvas", () => ({
  GameCanvas: () => <div data-testid="game-canvas">canvas</div>,
}));

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

function createEncounter(): Encounter {
  return {
    id: "test-encounter",
    scene: "open_sea",
    title: "Test Encounter",
    text: "Test text",
    choices: [
      {
        text: "Continue",
        eff: {},
        msg: "Done",
      },
    ],
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

describe("EncounterScreen", () => {
  let container: HTMLDivElement;
  let root: Root;
  let actEnv: typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean };

  beforeEach(() => {
    actEnv = globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean };
    actEnv.IS_REACT_ACT_ENVIRONMENT = true;
    resetStores();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    delete actEnv.IS_REACT_ACT_ENVIRONMENT;
    resetStores();
  });

  it("renders standard choices without crashing when no faction reputation is required", () => {
    useGameStore.setState({
      screen: "encounter",
      state: createState(),
      encounter: createEncounter(),
    });

    act(() => {
      root.render(<EncounterScreen />);
    });

    expect(container.textContent).toContain("Test Encounter");
    expect(container.textContent).toContain("Continue");
  });
});
