# Engineering And Gameplay Audit Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the highest-risk bugs from the engineering and gameplay audit, then add enough regression coverage to keep the same classes of bugs from returning.

**Architecture:** Start by creating a real test surface around pure game logic, then extract shared helpers for ending resolution, choice availability, route computation, and save/load serialization. Keep React components thin: UI should render shared logic, not re-implement rules locally. Persist full run context, not only raw stats, so save/load preserves the same gameplay semantics after a reload.

**Tech Stack:** TypeScript, React 19, Zustand, Vite, Vitest, Testing Library, Canvas 2D

---

### Task 1: Add A Real Regression Surface

**Files:**
- Modify: `package.json`
- Modify: `eslint.config.js`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/engine/__tests__/ending-resolution.spec.ts`

**Step 1: Add test dependencies and scripts**

Update `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "jsdom": "^25.0.1",
    "vitest": "^2.1.8"
  }
}
```

**Step 2: Make lint target the app, not asset dumps**

Update `eslint.config.js`:

```ts
export default defineConfig([
  globalIgnores([
    "dist",
    "pixel_assets/**",
    "docs/**",
    "public/**",
  ]),
  {
    files: ["src/**/*.{ts,tsx}", "scripts/**/*.ts", "vite.config.ts"],
    // existing config
  },
]);
```

**Step 3: Add Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    css: true,
  },
});
```

**Step 4: Add shared test setup**

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

**Step 5: Write the first failing spec**

Create `src/engine/__tests__/ending-resolution.spec.ts`:

```ts
import { describe, expect, it } from "vitest";
import { resolveEndingId, shouldUseObjectiveSystem } from "../ending-resolution";

describe("ending resolution", () => {
  it("prefers objective ending when objective_complete is set", () => {
    const endingId = resolveEndingId(
      [
        { id: "legend", req: (s) => s.karma >= 8 },
        { id: "objective_complete", req: (s) => s.flags.has("objective_complete") },
      ],
      {
        karma: 10,
        flags: new Set(["objective_complete"]),
      } as never,
    );

    expect(endingId).toBe("objective_complete");
  });

  it("disables objective flow in expedition", () => {
    expect(shouldUseObjectiveSystem("expedition", "redeemer")).toBe(false);
  });
});
```

**Step 6: Run the test to verify it fails**

Run: `npm run test -- src/engine/__tests__/ending-resolution.spec.ts`
Expected: FAIL with `Cannot find module '../ending-resolution'`

**Step 7: Commit**

```bash
git add package.json eslint.config.js vitest.config.ts src/test/setup.ts src/engine/__tests__/ending-resolution.spec.ts
git commit -m "test: add regression harness for audit fixes"
```

### Task 2: Fix Ending Priority And Objective Mode Gating

**Files:**
- Create: `src/engine/ending-resolution.ts`
- Modify: `src/engine/types.ts`
- Modify: `src/engine/state.ts`
- Modify: `src/ui/components/TitleScreen.tsx`
- Modify: `src/ui/components/MapScreen.tsx`
- Modify: `src/quests/cursed-galleon/endings.ts`
- Modify: `src/quests/cursed-galleon/endings-en.ts`
- Test: `src/engine/__tests__/ending-resolution.spec.ts`

**Step 1: Add stable ending IDs**

Update `src/engine/types.ts`:

```ts
export interface Ending {
  id: string;
  req: (state: GameState) => boolean;
  title: string;
  text: string | ((state: GameState) => string);
  color: string;
}
```

Update both endings files so every ending has an `id`, especially:

```ts
{ id: "objective_complete", req: s => s.flags?.has("objective_complete") === true, ... }
```

**Step 2: Implement shared ending helpers**

Create `src/engine/ending-resolution.ts`:

```ts
import type { Ending, GameState } from "./types";
import type { GameMode } from "./game-mode";

export function shouldUseObjectiveSystem(mode: GameMode, objectiveId: string | null): boolean {
  return mode === "free_roam" && !!objectiveId;
}

export function resolveEndingId(endings: Ending[], state: GameState): string {
  if (state.flags.has("objective_complete")) {
    const objectiveEnding = endings.find((ending) => ending.id === "objective_complete");
    if (objectiveEnding?.req(state)) return objectiveEnding.id;
  }

  const match = endings.find((ending) => ending.req(state));
  return match?.id ?? endings[endings.length - 1].id;
}

export function resolveEndingIndex(endings: Ending[], state: GameState): number {
  const id = resolveEndingId(endings, state);
  const index = endings.findIndex((ending) => ending.id === id);
  return index >= 0 ? index : endings.length - 1;
}
```

**Step 3: Make `sail()` use the shared objective gate**

In `src/engine/state.ts`, replace ad-hoc objective resolution with:

```ts
const objectiveEnabled = shouldUseObjectiveSystem(gameMode, useObjectiveStore.getState().objectiveId);

if (objectiveEnabled && objectiveId && !state.flags.has("objective_complete")) {
  // existing objective completion logic
}

const idx = resolveEndingIndex(quest.endings, finalState);
```

**Step 4: Clear stale objective when switching to expedition**

In `src/ui/components/TitleScreen.tsx`, replace `onSetMode(m.code)` with:

```ts
onClick={() => {
  onSetMode(m.code);
  if (m.code === "expedition") onSetObjective(null);
}}
```

**Step 5: Make the manual “End Voyage” button use the same resolver**

In `src/ui/components/MapScreen.tsx`:

```ts
const nextFlags = new Set(currentState.flags);
nextFlags.add("objective_complete");
nextFlags.add(`objective_${objectiveId}`);

const nextState = { ...currentState, flags: nextFlags };
const idx = resolveEndingIndex(quest.endings, nextState);
```

**Step 6: Update the spec to green**

Extend `src/engine/__tests__/ending-resolution.spec.ts`:

```ts
it("falls back to the first matching non-objective ending when objective_complete is absent", () => {
  // assert legend wins normally
});
```

**Step 7: Run tests**

Run: `npm run test -- src/engine/__tests__/ending-resolution.spec.ts`
Expected: PASS

**Step 8: Commit**

```bash
git add src/engine/ending-resolution.ts src/engine/types.ts src/engine/state.ts src/ui/components/TitleScreen.tsx src/ui/components/MapScreen.tsx src/quests/cursed-galleon/endings.ts src/quests/cursed-galleon/endings-en.ts src/engine/__tests__/ending-resolution.spec.ts
git commit -m "fix: make objective endings deterministic"
```

### Task 3: Unify Choice Availability Across Mouse And Keyboard

**Files:**
- Create: `src/engine/choice-availability.ts`
- Modify: `src/ui/components/ChoiceCard.tsx`
- Modify: `src/ui/components/EncounterScreen.tsx`
- Create: `src/engine/__tests__/choice-availability.spec.ts`

**Step 1: Write the failing spec**

Create `src/engine/__tests__/choice-availability.spec.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getRequiredGold, isChoiceAvailable } from "../choice-availability";

describe("choice availability", () => {
  it("treats ranged negative gold as a real cost", () => {
    expect(getRequiredGold({ eff: { gold: [-15, -5] } } as never)).toBe(15);
  });

  it("blocks already-owned item rewards", () => {
    const allowed = isChoiceAvailable(
      { eff: { item: "trade_license" } } as never,
      { gold: 99, inventory: ["trade_license"], flags: new Set() } as never,
    );

    expect(allowed).toBe(false);
  });
});
```

**Step 2: Run the test to verify it fails**

Run: `npm run test -- src/engine/__tests__/choice-availability.spec.ts`
Expected: FAIL with `Cannot find module '../choice-availability'`

**Step 3: Implement shared availability helpers**

Create `src/engine/choice-availability.ts`:

```ts
import type { Choice, GameState } from "./types";

export function getRequiredGold(choice: Choice): number {
  const gold = choice.eff.gold;
  if (typeof gold === "number") return gold < 0 ? Math.abs(gold) : 0;
  if (Array.isArray(gold)) return Math.abs(Math.min(0, gold[0], gold[1]));
  return 0;
}

export function isChoiceVisible(choice: Choice, state: GameState): boolean {
  return (!choice.requires_item || state.inventory.includes(choice.requires_item))
    && (!choice.requires_flag || state.flags.has(choice.requires_flag));
}

export function isChoiceAvailable(choice: Choice, state: GameState): boolean {
  if (!isChoiceVisible(choice, state)) return false;
  if (getRequiredGold(choice) > state.gold) return false;
  if (choice.eff.item && state.inventory.includes(choice.eff.item)) return false;
  return true;
}
```

**Step 4: Replace duplicated UI logic with the shared helper**

In `src/ui/components/ChoiceCard.tsx`:

```ts
const visible = isChoiceVisible(choice, state);
const canChoose = visible && isChoiceAvailable(choice, state);
const cost = getRequiredGold(choice);
```

In `src/ui/components/EncounterScreen.tsx`:

```ts
const available = encounter.choices.filter((choice) => isChoiceVisible(choice, state));

if (idx >= 0 && idx < available.length) {
  const choice = available[idx];
  if (isChoiceAvailable(choice, state)) handleChoice(choice);
}
```

**Step 5: Run tests**

Run: `npm run test -- src/engine/__tests__/choice-availability.spec.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add src/engine/choice-availability.ts src/ui/components/ChoiceCard.tsx src/ui/components/EncounterScreen.tsx src/engine/__tests__/choice-availability.spec.ts
git commit -m "fix: unify encounter choice gating"
```

### Task 4: Persist Full Run Context And Restore It Correctly

**Files:**
- Modify: `src/engine/types.ts`
- Modify: `src/engine/state.ts`
- Modify: `src/engine/objectives.ts`
- Create: `src/engine/__tests__/state-persistence.spec.ts`

**Step 1: Write the failing persistence spec**

Create `src/engine/__tests__/state-persistence.spec.ts`:

```ts
import { describe, expect, it } from "vitest";
import { serializeRunContext, deserializeRunContext } from "../state";

describe("run persistence", () => {
  it("preserves encounter result context", () => {
    const serialized = serializeRunContext({
      screen: "encounter",
      result: "Paid the ferryman.",
      pendingChain: "ghost_fleet_contact",
      encounterId: "dead_fog",
      recentFamilies: ["ambient"],
      recentTagsList: [["fog"]],
      recentIds: ["dead_fog"],
      usedGroups: new Set(["sea-omens"]),
    } as never);

    const restored = deserializeRunContext(serialized, [
      { id: "dead_fog", scene: "ethereal", title: "Dead Fog", text: "", choices: [] },
    ] as never);

    expect(restored.screen).toBe("encounter");
    expect(restored.pendingChain).toBe("ghost_fleet_contact");
    expect(restored.recentIds).toEqual(["dead_fog"]);
  });
});
```

**Step 2: Run the test to verify it fails**

Run: `npm run test -- src/engine/__tests__/state-persistence.spec.ts`
Expected: FAIL because `serializeRunContext` and `deserializeRunContext` do not exist

**Step 3: Extend the serialized shape**

In `src/engine/types.ts`, add the missing persisted fields:

```ts
export interface SerializedGameState {
  // existing fields
  screen?: "sailing" | "encounter";
  encounterId?: string | null;
  result?: string | null;
  pendingChain?: string | null;
  recentFamilies?: string[];
  recentTagsList?: string[][];
  recentIds?: string[];
  usedGroups?: string[];
}
```

**Step 4: Extract session serialization helpers**

In `src/engine/state.ts`, export two helpers:

```ts
export function serializeRunContext(store: Pick<GameStore, "screen" | "encounter" | "result" | "pendingChain" | "recentFamilies" | "recentTagsList" | "recentIds" | "usedGroups">) {
  return {
    screen: store.screen === "encounter" ? "encounter" : "sailing",
    encounterId: store.encounter?.id ?? null,
    result: store.result,
    pendingChain: store.pendingChain,
    recentFamilies: store.recentFamilies,
    recentTagsList: store.recentTagsList,
    recentIds: store.recentIds,
    usedGroups: [...store.usedGroups],
  };
}

export function deserializeRunContext(data: SerializedGameState, encounters: Encounter[]) {
  return {
    screen: data.screen ?? "sailing",
    encounter: data.encounterId ? encounters.find((enc) => enc.id === data.encounterId) ?? null : null,
    result: data.result ?? null,
    pendingChain: data.pendingChain ?? null,
    recentFamilies: data.recentFamilies ?? [],
    recentTagsList: data.recentTagsList ?? [],
    recentIds: data.recentIds ?? [],
    usedGroups: new Set(data.usedGroups ?? []),
  };
}
```

**Step 5: Save and load the full run**

Update `save()` to include `serializeRunContext(get())`.

Update `load()` to restore:

```ts
const restoredUi = deserializeRunContext(data.state, quest.encounters);
set({
  // existing restored state
  screen: restoredUi.screen,
  encounter: restoredUi.encounter,
  result: restoredUi.result,
  pendingChain: restoredUi.pendingChain,
  recentFamilies: restoredUi.recentFamilies,
  recentTags: new Set(restoredUi.recentTagsList.flat()),
  recentTagsList: restoredUi.recentTagsList,
  recentIds: restoredUi.recentIds,
  usedGroups: restoredUi.usedGroups,
});
```

**Step 6: Hydrate objective store from localStorage**

In `src/engine/objectives.ts`:

```ts
function getInitialObjective(): string | null {
  try {
    return localStorage.getItem(OBJ_KEY);
  } catch {
    return null;
  }
}

export const useObjectiveStore = create<ObjectiveStore>((set) => ({
  objectiveId: getInitialObjective(),
  setObjective: (id) => {
    // existing persistence
  },
}));
```

**Step 7: Add autosave immediately after `makeChoice()`**

At the end of `makeChoice()` in `src/engine/state.ts`:

```ts
setTimeout(() => get().save(), 0);
```

**Step 8: Run tests**

Run: `npm run test -- src/engine/__tests__/state-persistence.spec.ts`
Expected: PASS

**Step 9: Commit**

```bash
git add src/engine/types.ts src/engine/state.ts src/engine/objectives.ts src/engine/__tests__/state-persistence.spec.ts
git commit -m "fix: persist full run context across reloads"
```

### Task 5: Make Route Computation Match The Route Graph

**Files:**
- Modify: `src/renderer/map-data.ts`
- Modify: `src/engine/state.ts`
- Modify: `src/ui/components/MapScreen.tsx`
- Create: `src/renderer/__tests__/route-graph.spec.ts`

**Step 1: Write the failing route spec**

Create `src/renderer/__tests__/route-graph.spec.ts`:

```ts
import { describe, expect, it } from "vitest";
import { computeNodePath } from "../map-data";

describe("route graph", () => {
  it("prefers connected route nodes instead of drawing a raw straight line", () => {
    const path = computeNodePath(
      {
        "0,0": ["2,0"],
        "2,0": ["0,0", "2,2"],
        "2,2": ["2,0"],
      },
      [0, 0],
      [2, 2],
    );

    expect(path).toEqual([[0, 0], [2, 0], [2, 2]]);
  });
});
```

**Step 2: Run the test to verify it fails**

Run: `npm run test -- src/renderer/__tests__/route-graph.spec.ts`
Expected: FAIL because `computeNodePath` does not exist

**Step 3: Add graph-based route helpers**

In `src/renderer/map-data.ts`, add:

```ts
export function computeNodePath(
  routes: Record<string, string[]>,
  from: [number, number],
  to: [number, number],
): [number, number][] {
  const start = `${from[0]},${from[1]}`;
  const goal = `${to[0]},${to[1]}`;
  if (start === goal) return [from];

  const queue = [start];
  const cameFrom = new Map<string, string | null>([[start, null]]);

  while (queue.length) {
    const current = queue.shift()!;
    if (current === goal) break;
    for (const next of routes[current] ?? []) {
      if (!cameFrom.has(next)) {
        cameFrom.set(next, current);
        queue.push(next);
      }
    }
  }

  if (!cameFrom.has(goal)) return [from, to];

  const path: [number, number][] = [];
  let current: string | null = goal;
  while (current) {
    const [x, y] = current.split(",").map(Number);
    path.push([x, y]);
    current = cameFrom.get(current) ?? null;
  }

  return path.reverse();
}
```

**Step 4: Expand node paths into cell paths**

Still in `src/renderer/map-data.ts`, update `computeRoute`:

```ts
export function computeRoute(from: [number, number], to: [number, number]): [number, number][] {
  const nodePath = computeNodePath(getRoutes(), from, to);
  const cells: [number, number][] = [];

  for (let i = 1; i < nodePath.length; i++) {
    const [sx, sy] = nodePath[i - 1];
    const [tx, ty] = nodePath[i];
    const dx = tx - sx;
    const dy = ty - sy;
    const dist = Math.max(Math.abs(dx), Math.abs(dy));

    for (let step = 1; step <= dist; step++) {
      const t = step / dist;
      const point: [number, number] = [
        Math.round(sx + dx * t),
        Math.round(sy + dy * t),
      ];
      if (!cells.length || cells[cells.length - 1][0] !== point[0] || cells[cells.length - 1][1] !== point[1]) {
        cells.push(point);
      }
    }
  }

  return cells;
}
```

**Step 5: Guard `setDestination()` against unreachable routes**

In `src/engine/state.ts`:

```ts
const route = computeRoute(mapState.playerPos, pos);
if (route.length === 0) return;
```

**Step 6: Make preview and movement use the same shared route**

In `src/ui/components/MapScreen.tsx`, keep preview route strictly equal to `computeRoute(mapState.playerPos, d.pos)`.

**Step 7: Run tests**

Run: `npm run test -- src/renderer/__tests__/route-graph.spec.ts`
Expected: PASS

**Step 8: Commit**

```bash
git add src/renderer/map-data.ts src/engine/state.ts src/ui/components/MapScreen.tsx src/renderer/__tests__/route-graph.spec.ts
git commit -m "fix: make sea routes follow the route graph"
```

### Task 6: Fix UI Races, Audio Leaks, And Current Lint Failures

**Files:**
- Modify: `src/ui/components/TypewriterText.tsx`
- Modify: `src/audio/audio-manager.ts`
- Modify: `src/App.tsx`
- Modify: `src/ui/components/EncounterScreen.tsx`
- Modify: `src/ui/components/MapScreen.tsx`
- Modify: `src/ui/components/NPCJournal.tsx`
- Modify: `src/engine/game-mode.ts`
- Modify: `src/engine/origins.ts`
- Modify: `src/i18n/index.ts`
- Modify: `src/engine/objectives.ts`
- Modify: `src/renderer/world-map.ts`
- Modify: `scripts/gen-icons.ts`
- Create: `src/ui/components/__tests__/TypewriterText.spec.tsx`

**Step 1: Write the failing typewriter spec**

Create `src/ui/components/__tests__/TypewriterText.spec.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TypewriterText } from "../TypewriterText";

describe("TypewriterText", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("calls onComplete only once after skip", () => {
    const onComplete = vi.fn();
    render(<TypewriterText text="Black Tide" speed={10} onComplete={onComplete} />);

    fireEvent.click(screen.getByText(/▌/).parentElement!);
    vi.runAllTimers();

    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
```

**Step 2: Run the test to verify it fails**

Run: `npm run test -- src/ui/components/__tests__/TypewriterText.spec.tsx`
Expected: FAIL because `onComplete` is called twice

**Step 3: Fix `TypewriterText` timeout ownership**

In `src/ui/components/TypewriterText.tsx`, replace local timeout with refs:

```tsx
const timeoutRef = useRef<number | null>(null);
const completedRef = useRef(false);

const finish = useCallback(() => {
  if (completedRef.current) return;
  completedRef.current = true;
  setDisplayed(text);
  setDone(true);
  onComplete?.();
}, [text, onComplete]);
```

Use `window.clearTimeout(timeoutRef.current)` in cleanup and in `skip()`.

**Step 4: Track and clean up `lfo2`**

In `src/audio/audio-manager.ts`, extend `AmbientNodes`:

```ts
interface AmbientNodes {
  osc1: OscillatorNode;
  osc2: OscillatorNode | null;
  lfo: OscillatorNode;
  lfo2: OscillatorNode | null;
  noiseSource: AudioBufferSourceNode;
  masterGain: GainNode;
  filter: BiquadFilterNode;
}
```

Store `lfo2`, then stop and disconnect it in both `playAmbient()` fade cleanup and `stopAmbient()`.

**Step 5: Fix the current lint issues instead of ignoring them**

Make these targeted changes:

```ts
// App.tsx: move glitch randomness into state updated by the effect
const [glitchStyle, setGlitchStyle] = useState({ background: "...", transform: "none" });

// EncounterScreen.tsx: replace mutable ref lock with state
const [choiceLocked, setChoiceLocked] = useState(false);

// MapScreen.tsx: move useObjectiveStore above the early return
const objectiveId = useObjectiveStore((s) => s.objectiveId);

// NPCJournal.tsx: memoize meetings input
const meetings = useMemo(() => state?.npcMeetings ?? [], [state?.npcMeetings]);
```

Also replace empty `catch {}` blocks with:

```ts
catch {
  return fallbackValue;
}
```

or with a brief comment when the empty catch is intentional and lint-safe.

**Step 6: Run the targeted test**

Run: `npm run test -- src/ui/components/__tests__/TypewriterText.spec.tsx`
Expected: PASS

**Step 7: Run lint**

Run: `npm run lint`
Expected: PASS

**Step 8: Commit**

```bash
git add src/ui/components/TypewriterText.tsx src/audio/audio-manager.ts src/App.tsx src/ui/components/EncounterScreen.tsx src/ui/components/MapScreen.tsx src/ui/components/NPCJournal.tsx src/engine/game-mode.ts src/engine/origins.ts src/i18n/index.ts src/engine/objectives.ts src/renderer/world-map.ts scripts/gen-icons.ts src/ui/components/__tests__/TypewriterText.spec.tsx
git commit -m "fix: remove runtime races and clear lint debt"
```

### Task 7: Align Mechanics And Content Text With Actual Rules

**Files:**
- Modify: `src/engine/objectives.ts`
- Modify: `src/quests/cursed-galleon/encounters-new.ts`
- Modify: `src/quests/cursed-galleon/encounters-new-en.ts`
- Create: `src/engine/__tests__/objectives.spec.ts`

**Step 1: Write failing objective tests**

Create `src/engine/__tests__/objectives.spec.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getObjective } from "../objectives";

describe("objectives", () => {
  it("counts unique acquired artifacts for treasure_hunter", () => {
    const objective = getObjective("treasure_hunter")!;
    const result = objective.check({
      inventory: ["trade_license"],
      artifactLog: [
        { itemId: "trade_license" },
        { itemId: "voodoo_doll" },
        { itemId: "black_pearl" },
        { itemId: "map_fragment" },
        { itemId: "ancient_key" },
      ],
    } as never, null);

    expect(result.complete).toBe(true);
  });
});
```

**Step 2: Run the test to verify it fails**

Run: `npm run test -- src/engine/__tests__/objectives.spec.ts`
Expected: FAIL because `treasure_hunter` still reads `inventory.length`

**Step 3: Fix `treasure_hunter` to use unique acquisitions**

In `src/engine/objectives.ts`:

```ts
check: (state) => {
  const uniqueArtifacts = new Set((state.artifactLog ?? []).map((entry) => entry.itemId));
  return {
    current: uniqueArtifacts.size,
    target: 5,
    complete: uniqueArtifacts.size >= 5,
  };
},
```

**Step 4: Fix misleading encounter copy**

In both `src/quests/cursed-galleon/encounters-new.ts` and `src/quests/cursed-galleon/encounters-new-en.ts`, replace the misleading auction choice:

```ts
{ text: "📢 Продати чутки", eff: { gold: [20, 45], ... }, msg: "..." }
{ text: "📢 Sell rumor rights", eff: { gold: [20, 45], ... }, msg: "..." }
```

Do not keep `(-1 предмет)` / `Sell your own` unless the implementation actually consumes a selectable item.

**Step 5: Run tests**

Run: `npm run test -- src/engine/__tests__/objectives.spec.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add src/engine/objectives.ts src/quests/cursed-galleon/encounters-new.ts src/quests/cursed-galleon/encounters-new-en.ts src/engine/__tests__/objectives.spec.ts
git commit -m "fix: align objective and content text with gameplay rules"
```

### Task 8: Final Verification And Release Notes

**Files:**
- Modify: `README.md`
- Modify: `docs/plans/2026-03-24-engineering-gameplay-audit-fixes.md`

**Step 1: Run the full automated suite**

Run: `npm run test`
Expected: PASS

Run: `npm run lint`
Expected: PASS

Run: `npm run build`
Expected: PASS

**Step 2: Manual gameplay QA**

Run: `npm run dev`

Verify:

```text
1. Free Roam objective completion always shows the objective ending.
2. Expedition never shows objective UI or objective ending.
3. Reload mid-encounter restores encounter/result state.
4. Keyboard and mouse agree on disabled choices.
5. Route preview follows connected locations, not fake straight lines.
6. Typewriter skip never double-fires completion.
7. Long session scene switching does not degrade audio.
```

**Step 3: Update README quality gates**

Add a short section:

```md
## Quality Checks

~~~bash
npm run test
npm run lint
npm run build
~~~
```

**Step 4: Final commit**

```bash
git add README.md docs/plans/2026-03-24-engineering-gameplay-audit-fixes.md
git commit -m "docs: record audit fix verification steps"
```
