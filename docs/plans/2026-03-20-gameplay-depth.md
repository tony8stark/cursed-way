# Gameplay Depth Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix chaotic ship movement, add inventory/artifacts system, route planning, encounter variety, and unpredictability to transform the game from a predictable gold/crew tradeoff into a rich exploration experience.

**Architecture:** Five interconnected systems: (1) directional voyage route replaces random cell-hopping, (2) inventory with persistent artifacts that gate encounters, (3) location-bound encounters tied to map cells, (4) new encounter categories with non-stat outcomes, (5) hidden/delayed consequence mechanics. All systems extend existing Zustand store and encounter format without breaking Classic mode.

**Tech Stack:** TypeScript, Zustand, React, Canvas 2D, bilingual UK/EN content

---

## Problem Analysis

### 1. Chaotic ship movement
**Root cause:** `findNearestCell()` picks the closest matching terrain with no directional bias. If the ship is between a port cell to the left and one to the right, it ping-pongs. There's no concept of "heading" or "voyage route."

**Fix:** Replace terrain-matching cell hop with a **planned voyage route**. The ship follows a predefined path through waypoints. Player picks next destination from 2-3 revealed adjacent named locations. Movement advances 1-2 cells per encounter along the route.

### 2. Predictable encounters
**Root cause:** Every `Choice.eff` is `{ gold: N, crew: N, karma: N, curse: N }`. Every encounter boils down to "trade gold/crew/curse." No other outcome types exist.

**Fix:** Add new effect types: `item` (gain/lose inventory item), `reveal` (reveal map area), `moveTo` (teleport to location), `encounter` (chain to another encounter). Add encounters with zero-stat choices that are purely narrative or unlock future content.

### 3. No artifacts/inventory
**Root cause:** `GameState` only has `flags: Set<string>` for boolean markers. No item system.

**Fix:** Add `inventory: Map<string, number>` to GameState. Define artifact types with passive effects. Some encounters require/consume items. Items visible in UI.

### 4. No route planning
**Root cause:** Player has one button: "SAIL ON." No agency over direction.

**Fix:** On MapScreen, show 2-3 destination options based on revealed locations + current position. Player picks where to go. Encounter type determined by route, not random.

### 5. No unpredictability
**Root cause:** All consequences are immediate and visible in the choice text ("+20 gold, -1 crew").

**Fix:** Add delayed effects (trigger N days later), hidden effects (not shown in result summary), and random events that interrupt sailing.

---

## Task 1: Directional Movement System

**Files:**
- Modify: `src/renderer/map-data.ts` - add route/edge graph between named locations
- Modify: `src/renderer/world-map.ts` - add route line rendering, destination markers
- Modify: `src/engine/state.ts` - replace `findNearestCell` movement with route-based
- Modify: `src/ui/components/MapScreen.tsx` - show destination choices instead of single button

### Step 1: Add route graph to map-data.ts

Add edges between named locations and a pathfinding helper:

```typescript
// Add to map-data.ts after LOCATIONS

// Edges between named locations (bidirectional). Key format: "x1,y1"
export const ROUTES: Record<string, string[]> = {
  "0,4":  ["4,1", "6,6"],          // Tortuga -> Havana, Shadow Cave
  "4,1":  ["0,4", "14,2", "8,3"],  // Havana -> Tortuga, Nassau, Mary's Wreck
  "14,2": ["4,1", "10,6", "13,8"], // Nassau -> Havana, Port Royal, Coral Reefs
  "10,6": ["14,2", "5,8", "6,6"],  // Port Royal -> Nassau, Cartagena, Shadow Cave
  "5,8":  ["10,6", "0,4", "6,6"],  // Cartagena -> Port Royal, Tortuga, Shadow Cave
  "6,6":  ["0,4", "10,6", "5,8", "8,3"], // Shadow Cave -> Tortuga, Port Royal, Cartagena, Mary's Wreck
  "8,3":  ["4,1", "6,6", "7,2"],   // Mary's Wreck -> Havana, Shadow Cave, Blood Reefs
  "7,2":  ["8,3", "14,2"],         // Blood Reefs -> Mary's Wreck, Nassau
  "13,8": ["14,2", "10,6"],        // Coral Reefs -> Nassau, Port Royal
};

// Get connected destinations from current location
export function getConnectedLocations(pos: [number, number]): Array<{
  pos: [number, number];
  name: Record<Locale, string>;
  icon: string;
  terrain: TerrainType;
}> {
  const key = `${pos[0]},${pos[1]}`;
  const edges = ROUTES[key];
  if (!edges) return [];

  return edges
    .map(k => {
      const [x, y] = k.split(",").map(Number) as [number, number];
      const loc = LOCATIONS[k];
      if (!loc) return null;
      return {
        pos: [x, y] as [number, number],
        name: loc.name,
        icon: loc.icon,
        terrain: MAP_CELLS[y][x].terrain,
      };
    })
    .filter(Boolean) as any[];
}

// Compute intermediate cells along a straight line between two points
export function computeRoute(from: [number, number], to: [number, number]): [number, number][] {
  const steps: [number, number][] = [];
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const dist = Math.max(Math.abs(dx), Math.abs(dy));

  for (let i = 1; i <= dist; i++) {
    const t = i / dist;
    steps.push([
      Math.round(from[0] + dx * t),
      Math.round(from[1] + dy * t),
    ]);
  }
  return steps;
}
```

### Step 2: Update MapState for route tracking

In `src/renderer/world-map.ts`, add route fields to MapState:

```typescript
export interface MapState {
  playerPos: [number, number];
  revealed: boolean[][];
  targetPos: [number, number] | null;
  animProgress: number;
  // NEW: route system
  currentRoute: [number, number][] | null;  // cells along current voyage
  routeProgress: number;                     // how many cells traveled on current route
  destination: [number, number] | null;      // where we're heading
}
```

Update `createMapState`, `serializeMap`, `deserializeMap` to handle new fields.

### Step 3: Update MapScreen with destination picker

Replace single "SAIL ON" button with destination choices when ship is at a named location (or has no active route):

```tsx
// In MapScreen.tsx
const destinations = mapState?.destination
  ? [] // already en route
  : getConnectedLocations(mapState!.playerPos)
      .filter(d => mapState!.revealed[d.pos[1]][d.pos[0]]); // only revealed

// Render 2-3 destination buttons instead of single SAIL ON
{destinations.length > 0 ? (
  <div className="flex flex-col gap-2 mt-4">
    <div className="font-game text-[9px] text-white/40 text-center mb-1">
      {t("chooseDestination")}
    </div>
    {destinations.map(d => (
      <motion.button
        key={`${d.pos[0]},${d.pos[1]}`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setDestination(d.pos)}
        className="game-btn font-game text-[10px] px-4 py-2.5 border bg-transparent cursor-pointer"
        style={{ color: "#40c0f0", borderColor: "#40c0f0" }}
      >
        {d.icon} {d.name[locale]}
      </motion.button>
    ))}
  </div>
) : (
  // En route: show single SAIL ON
  <motion.button onClick={handleSail}>
    {t("sailContinue")}
  </motion.button>
)}
```

### Step 4: Update sail() to use route-based movement

In `src/engine/state.ts`, modify `sail()`:

```typescript
sail: () => {
  const { state, quest, usedIds, mapState } = get();
  if (!state || !quest) return;

  // ... ending checks ...

  const enc = pickEncounter(quest.encounters, state, usedIds);
  // ... existing logic ...

  // Route-based movement
  if (mapState?.currentRoute && mapState.routeProgress < mapState.currentRoute.length) {
    const nextCell = mapState.currentRoute[mapState.routeProgress];
    mapState.playerPos = nextCell;
    mapState.routeProgress++;
    const revealRadius = state.flags.has("cursed_compass") ? 5 : 3;
    revealAround(mapState, nextCell[0], nextCell[1], revealRadius);

    // Arrived at destination?
    if (mapState.routeProgress >= mapState.currentRoute.length) {
      mapState.currentRoute = null;
      mapState.destination = null;
      mapState.routeProgress = 0;
    }
  }
  // ... rest of set() ...
},
```

### Step 5: Add setDestination action to store

```typescript
// In GameStore interface:
setDestination: (pos: [number, number]) => void;

// Implementation:
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
```

### Step 6: Draw route line on map

In `world-map.ts`, inside `drawWorldMap()`, after drawing terrain and before drawing ship:

```typescript
// Draw planned route
if (map.currentRoute && map.destination) {
  ctx.strokeStyle = "rgba(240,192,64,0.25)";
  ctx.lineWidth = 2;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  const startX = ox + map.playerPos[0] * CELL_W + CELL_W / 2;
  const startY = oy + map.playerPos[1] * CELL_H + CELL_H / 2;
  ctx.moveTo(startX, startY);

  for (const [rx, ry] of map.currentRoute) {
    ctx.lineTo(ox + rx * CELL_W + CELL_W / 2, oy + ry * CELL_H + CELL_H / 2);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // Destination marker (pulsing diamond)
  const [dx, dy] = map.destination;
  const destX = ox + dx * CELL_W + CELL_W / 2;
  const destY = oy + dy * CELL_H + CELL_H / 2;
  const dp = 1 + Math.sin(frame * 0.06) * 0.3;
  ctx.fillStyle = "rgba(240,192,64,0.5)";
  ctx.beginPath();
  ctx.moveTo(destX, destY - 5 * dp);
  ctx.lineTo(destX + 4 * dp, destY);
  ctx.lineTo(destX, destY + 5 * dp);
  ctx.lineTo(destX - 4 * dp, destY);
  ctx.closePath();
  ctx.fill();
}
```

### Step 7: Add i18n keys

```typescript
// UK
chooseDestination: "КУДИ ПЛИВЕМО?",
enRoute: "В ДОРОЗІ",

// EN
chooseDestination: "WHERE TO?",
enRoute: "EN ROUTE",
```

### Step 8: Build, verify, commit

```bash
npm run build
# Test: start enhanced game, verify destination picker appears at Tortuga
# Test: pick a destination, verify ship moves along route
# Test: verify no more back-and-forth bouncing
git add -A && git commit -m "feat: directional voyage routes replace random cell-hopping"
```

---

## Task 2: Inventory & Artifacts System

**Files:**
- Modify: `src/engine/types.ts` - add inventory to GameState, item effects to Choice
- Create: `src/engine/items.ts` - artifact definitions with passive effects
- Create: `src/engine/items-i18n.ts` - bilingual item names/descriptions
- Modify: `src/engine/state.ts` - handle item gain/loss in makeChoice
- Create: `src/ui/components/InventoryBar.tsx` - compact inventory display
- Modify: `src/ui/components/MapScreen.tsx` - show InventoryBar
- Modify: `src/ui/components/EncounterScreen.tsx` - show InventoryBar

### Step 1: Define item types

```typescript
// src/engine/items.ts
export interface ArtifactDef {
  id: string;
  icon: string;
  rarity: "common" | "rare" | "cursed";
  passive?: {
    stat: "gold" | "crew" | "karma" | "curse";
    perDay: number; // applied each sail()
  };
  revealRadius?: number; // bonus to fog reveal
  encounterUnlock?: string; // encounter id that becomes available
}

export const ARTIFACTS: Record<string, ArtifactDef> = {
  cursed_compass: {
    id: "cursed_compass",
    icon: "🧭",
    rarity: "cursed",
    revealRadius: 2,  // +2 to base 3 = 5
  },
  siren_shell: {
    id: "siren_shell",
    icon: "🐚",
    rarity: "rare",
    passive: { stat: "curse", perDay: -0.5 },
    encounterUnlock: "siren_sanctuary",
  },
  ghost_lantern: {
    id: "ghost_lantern",
    icon: "🏮",
    rarity: "cursed",
    passive: { stat: "curse", perDay: 0.5 },
    revealRadius: 1,
    encounterUnlock: "ghost_fleet",
  },
  map_fragment: {
    id: "map_fragment",
    icon: "🗺️",
    rarity: "common",
    // Collected 3 = reveal full map
  },
  medicine_chest: {
    id: "medicine_chest",
    icon: "💊",
    rarity: "common",
    passive: { stat: "crew", perDay: 0.2 },
  },
  black_pearl: {
    id: "black_pearl",
    icon: "🖤",
    rarity: "rare",
    // Trade value, quest item
  },
  kraken_tooth: {
    id: "kraken_tooth",
    icon: "🦷",
    rarity: "rare",
    encounterUnlock: "kraken_pact",
  },
  voodoo_doll: {
    id: "voodoo_doll",
    icon: "🪆",
    rarity: "cursed",
    passive: { stat: "karma", perDay: -0.3 },
    encounterUnlock: "voodoo_ritual",
  },
  trade_license: {
    id: "trade_license",
    icon: "📜",
    rarity: "common",
    passive: { stat: "gold", perDay: 3 },
  },
  ancient_key: {
    id: "ancient_key",
    icon: "🗝️",
    rarity: "rare",
    encounterUnlock: "temple_vault",
  },
};
```

### Step 2: Add inventory to GameState

```typescript
// In types.ts, extend GameState:
export interface GameState {
  gold: number;
  crew: number;
  karma: number;
  curse: number;
  day: number;
  flags: Set<string>;
  log: LogEntry[];
  inventory: string[]; // artifact ids
}

// Extend Effects:
export interface Effects {
  gold?: EffectValue;
  crew?: EffectValue;
  karma?: number;
  curse?: number;
  item?: string;       // artifact id to gain
  loseItem?: string;   // artifact id to consume
}

// Extend SerializedGameState:
export interface SerializedGameState {
  // ... existing ...
  inventory: string[];
}
```

### Step 3: Handle items in makeChoice

```typescript
// In state.ts makeChoice():
if (choice.eff.item) {
  ns.inventory = [...ns.inventory, choice.eff.item];
  // Also set flag for backward compat
  ns.flags.add(`has_${choice.eff.item}`);
}
if (choice.eff.loseItem) {
  const idx = ns.inventory.indexOf(choice.eff.loseItem);
  if (idx >= 0) {
    ns.inventory = ns.inventory.filter((_, i) => i !== idx);
    ns.flags.delete(`has_${choice.eff.loseItem}`);
  }
}
```

### Step 4: Apply passive effects in sail()

```typescript
// In sail(), before picking encounter:
if (state.inventory.length > 0) {
  for (const itemId of state.inventory) {
    const def = ARTIFACTS[itemId];
    if (def?.passive) {
      // Accumulate fractional effects
      state[def.passive.stat] += def.passive.perDay;
    }
  }
  // Clamp
  state.crew = Math.max(0, Math.round(state.crew));
  state.curse = Math.max(0, state.curse);
  state.gold = Math.max(0, Math.round(state.gold));
}
```

### Step 5: Create InventoryBar component

```tsx
// src/ui/components/InventoryBar.tsx
export function InventoryBar({ inventory }: { inventory: string[] }) {
  if (inventory.length === 0) return null;

  return (
    <div className="flex gap-1 justify-center my-2">
      {inventory.map((id, i) => {
        const def = ARTIFACTS[id];
        return (
          <div
            key={`${id}-${i}`}
            className="w-7 h-7 flex items-center justify-center rounded border text-sm"
            style={{
              borderColor: def?.rarity === "cursed" ? "#8020c0"
                : def?.rarity === "rare" ? "#f0c040"
                : "#40c0f0",
              background: "rgba(0,0,0,0.3)",
            }}
            title={id}
          >
            {def?.icon || "?"}
          </div>
        );
      })}
    </div>
  );
}
```

### Step 6: Update existing encounters to grant items

Convert existing flag-based items to use the new `item` effect:

```typescript
// merchant_silk: cursed_compass -> item
{ text: "🤝 Торгувати чесно", eff: { gold: [5, 20], crew: 0, karma: 2, curse: 0, item: "cursed_compass" }, ... }

// Add item effects to various encounters
// merchant_spice: has_spices -> item "medicine_chest" (spices = medicine)
// island_ruins: temple_visited -> item "ancient_key"
// etc.
```

### Step 7: Add i18n for inventory

```typescript
inventoryTitle: "ІНВЕНТАР" / "INVENTORY",
```

### Step 8: Build, verify, commit

```bash
npm run build
# Test: get cursed_compass, verify it appears in inventory bar
# Test: verify passive effects apply each day
# Test: save/load preserves inventory
git add -A && git commit -m "feat: inventory system with 10 artifacts and passive effects"
```

---

## Task 3: Location-Bound Encounters

**Files:**
- Modify: `src/engine/types.ts` - add `location?: string` to Encounter
- Modify: `src/engine/encounter-picker.ts` - filter by current map position
- Add encounters to `encounters.ts` / `encounters-en.ts` - location-specific content

### Step 1: Add location field to Encounter

```typescript
// In types.ts:
export interface Encounter {
  // ... existing ...
  location?: string; // "x,y" key - only triggers at this map cell
}
```

### Step 2: Update encounter picker

```typescript
// In encounter-picker.ts, add playerPos param:
export function pickEncounter(
  encounters: Encounter[],
  state: GameState,
  used: Set<string>,
  playerPos?: [number, number],
): Encounter {
  const posKey = playerPos ? `${playerPos[0]},${playerPos[1]}` : null;

  const avail = encounters.filter(e => {
    if (used.has(e.id)) return false;
    if (e.requires && !e.requires(state)) return false;
    // Location filter
    if (e.location && e.location !== posKey) return false;
    if (!e.location && posKey) {
      // Non-location encounters can still trigger anywhere
    }
    return true;
  });

  // Priority: location-specific > consequence > normal
  const locationEnc = avail.filter(e => e.location === posKey);
  if (locationEnc.length > 0) {
    return locationEnc[Math.floor(Math.random() * locationEnc.length)];
  }

  // ... rest of existing logic ...
}
```

### Step 3: Add 9+ location-specific encounters (UK)

One unique encounter per named location. These only trigger when the ship is at that location:

```typescript
// Havana - smuggling hub
{
  id: "havana_market", scene: "port", title: "Ринок Гавани",
  location: "4,1",
  text: "Найбільший чорний ринок Карибів. Тут купують і продають все.",
  choices: [
    { text: "📜 Купити ліцензію (−40)", eff: { gold: -40, item: "trade_license" }, msg: "Фальшива, але переконлива. Торгуйте вільно." },
    { text: "🗺️ Купити карту (−25)", eff: { gold: -25, item: "map_fragment" }, msg: "Половина карти. Десь є друга частина." },
    { text: "👂 Зібрати чутки", eff: { gold: 0 }, msg: "Шепочуть про привидний флот на півдні.", flag: "ghost_fleet_rumor" },
  ],
},

// Shadow Cave - dark magic
{
  id: "shadow_cave_ritual", scene: "cave", title: "Ритуал у Печері Тіней",
  location: "6,6",
  text: "Вогні на стінах. Шаман із кістяною маскою чекає.",
  choices: [
    { text: "🪆 Прийняти дар", eff: { curse: 3, item: "voodoo_doll" }, msg: "Лялька з вашим волоссям. Відчуваєте зв'язок з чимось давнім." },
    { text: "🗝️ Показати ключ", eff: {}, requires_item: "ancient_key", msg: "Шаман кланяється. Відкриває прохід углиб.", flag: "deep_cave_access" },
    { text: "🚶 Піти", eff: {}, msg: "Деякі двері краще не відчиняти." },
  ],
},

// Mary's Wreck - salvage
{
  id: "marys_wreck_dive", scene: "underwater", title: "Уламки 'Святої Марії'",
  location: "8,3",
  text: "Скелет корабля на дні. Тут загинуло 200 душ. Золото блищить між ребрами корпусу.",
  choices: [
    { text: "🏊 Пірнути за золотом", eff: { gold: [30, 80], crew: [-2, 0], curse: 2 }, msg: "Золото є. Але щось тягне ногу. Ледь вирвалися." },
    { text: "🦷 Шукати реліквії", eff: { item: "kraken_tooth", curse: 1 }, msg: "Знаходите зуб, більший за вашу голову. Кракен був тут." },
    { text: "🙏 Помолитися за загиблих", eff: { karma: 3, curse: -1 }, msg: "На мить бачите обличчя у воді. Вони посміхаються. Дякують." },
  ],
},

// ... similar for Nassau, Port Royal, Cartagena, Blood Reefs, Coral Reefs, Tortuga
```

### Step 4: Add English translations

Mirror all location encounters in `encounters-en.ts`.

### Step 5: Build, verify, commit

```bash
npm run build
# Test: sail to Havana, verify Havana-specific encounter triggers
# Test: sail to Shadow Cave, verify cave encounter triggers
git add -A && git commit -m "feat: location-bound encounters for all 9 named locations"
```

---

## Task 4: Encounter Variety - New Outcome Types

**Files:**
- Add 20+ new encounters across both locale files with diverse mechanics
- Modify: `src/engine/types.ts` - add `reveal` and `chain` effect types
- Modify: `src/engine/state.ts` - handle new effect types

### Step 1: Add new effect types

```typescript
// In types.ts, extend Effects:
export interface Effects {
  gold?: EffectValue;
  crew?: EffectValue;
  karma?: number;
  curse?: number;
  item?: string;
  loseItem?: string;
  reveal?: [number, number]; // reveal around this map position
  chain?: string;            // encounter id to trigger next (no sailing)
}

// In Choice, add conditional availability:
export interface Choice {
  text: string | ((state: GameState) => string);
  eff: Effects;
  msg: string | ((state: GameState) => string);
  flag?: string | ((state: GameState) => string | null);
  requires_item?: string;  // only show if player has this item
  hidden?: boolean;         // don't show stat changes in log
}
```

### Step 2: New encounter categories

Add encounters that don't follow the "gold OR crew OR curse" pattern:

**Navigation encounters** (choice determines where you go):
```typescript
{
  id: "crossroads_current", scene: "open_sea", title: "Течія",
  text: "Сильна течія несе на схід. Можна боротися або піддатися.",
  choices: [
    { text: "🌊 Піддатися течії", eff: { reveal: [14, 2] }, msg: "Течія виносить до нових берегів. Бачите щось на горизонті." },
    { text: "💪 Боротися", eff: { crew: -1 }, msg: "Залишаєтесь на курсі. Але команда втомлена." },
    { text: "⚓ Зачекати", eff: {}, msg: "Течія вщухає. Нічого не сталось. Але й нічого не втрачено." },
  ],
},
```

**Pure narrative encounters** (zero stat changes, only flags/items):
```typescript
{
  id: "dream_sequence", scene: "ethereal", title: "Сон капітана",
  text: "Снится: ви під водою. Дихаєте. Місто з перламутру.",
  requires: s => s.curse >= 5,
  choices: [
    { text: "🏛️ Увійти в місто", eff: {}, msg: "Запам'ятовуєте координати. Прокидаєтесь з мокрим волоссям.", flag: "dream_city" },
    { text: "🏊 Пливти вгору", eff: {}, msg: "Прокидаєтесь. Просто сон. Напевно.", hidden: true },
    { text: "👁️ Шукати джерело голосу", eff: { curse: 1 }, msg: "Хтось знає ваше справжнє ім'я. Те, яке ви забули.", flag: "true_name", hidden: true },
  ],
},
```

**Multi-step chain encounters** (one choice leads to another encounter):
```typescript
{
  id: "merchant_mysterious", scene: "port", title: "Таємничий торговець",
  text: "Зникає в тінях, щойно ви відвертаєтесь. Пропонує 'те, чого бажаєте найбільше'.",
  choices: [
    { text: "💰 'Золото'", eff: { chain: "merchant_gold_test" }, msg: "" },
    { text: "⚓ 'Безпечний порт'", eff: { chain: "merchant_safety_test" }, msg: "" },
    { text: "🚶 Пройти повз", eff: {}, msg: "Мудре рішення. Або боягузливе. Хто знає." },
  ],
},
{
  id: "merchant_gold_test", scene: "port", title: "Ціна бажання",
  text: "'Золото? Легко. Але щось візьму натомість.' Посміхається.",
  requires: s => false, // only via chain
  choices: [
    { text: "🤝 Погодитись", eff: { gold: 100, curse: 4 }, msg: "Кишені повні. Але тепер бачите тіні краєм ока." },
    { text: "❌ Відмовитись", eff: { karma: 1 }, msg: "'Розумний.' Зникає. Золото на підлозі — мідне." },
  ],
},
```

**Discovery encounters** (reveal map, find locations):
```typescript
{
  id: "old_map_bottle", scene: "open_sea", title: "Пляшка з картою",
  text: "Пляшка з-під рому. Всередині — шматок шкіри з малюнком.",
  choices: [
    { text: "🗺️ Розгорнути", eff: { item: "map_fragment", reveal: [6, 6] }, msg: "Позначено печеру і слово: 'НЕ ЗАХОДЬ'." },
    { text: "💨 Викинути", eff: {}, msg: "Чужі карти — чужі проблеми." },
  ],
},
```

### Step 3: Handle chain effect in state.ts

```typescript
// In makeChoice(), after setting result:
if (choice.eff.chain) {
  const chainEnc = quest.encounters.find(e => e.id === choice.eff.chain);
  if (chainEnc) {
    // Don't go to sailing, show next encounter directly
    setTimeout(() => {
      set({ encounter: chainEnc, result: null });
    }, 1500); // brief pause to show result message
    return;
  }
}

// Handle reveal effect:
if (choice.eff.reveal && mapState) {
  revealAround(mapState, choice.eff.reveal[0], choice.eff.reveal[1], 3);
  set({ mapState: { ...mapState } });
}
```

### Step 4: Handle requires_item in ChoiceCard

```tsx
// In ChoiceCard.tsx or EncounterScreen.tsx:
// Filter out choices where requires_item is not in inventory
const availableChoices = encounter.choices.filter(c => {
  if (c.requires_item && !state.inventory.includes(c.requires_item)) return false;
  return true;
});
```

### Step 5: Add 20+ new diverse encounters (UK + EN)

Categories to cover:
- 4 navigation/discovery encounters
- 4 pure narrative encounters
- 3 chain encounters (6 total with follow-ups)
- 3 item-gated encounters
- 4 random events (storms, sea monsters, etc with non-standard outcomes)
- 2 trade encounters with item exchange

### Step 6: Build, verify, commit

```bash
npm run build
# Test: verify chain encounters work (merchant -> gold test)
# Test: verify requires_item hides choices correctly
# Test: verify reveal effect shows new map area
git add -A && git commit -m "feat: new encounter types with chains, items, map reveals"
```

---

## Task 5: Delayed Effects & Random Events

**Files:**
- Modify: `src/engine/types.ts` - add DelayedEffect type
- Modify: `src/engine/state.ts` - process delayed effects in sail()
- Add 10+ encounters with delayed consequences

### Step 1: Define delayed effects

```typescript
// In types.ts:
export interface DelayedEffect {
  triggerDay: number;  // which day to trigger
  encounterId: string; // forced encounter to show
  hint?: string;       // subtle warning message on map screen
}

// Add to GameState:
export interface GameState {
  // ... existing ...
  delayedEffects: DelayedEffect[];
}
```

### Step 2: Add delay effect to Choice

```typescript
// In Effects:
export interface Effects {
  // ... existing ...
  delay?: {
    daysLater: number;   // trigger N days from now
    encounterId: string; // encounter to force
  };
}
```

### Step 3: Process in sail()

```typescript
// In sail(), before pickEncounter:
// Check for delayed effects
const triggered = state.delayedEffects.filter(d => d.triggerDay <= state.day);
if (triggered.length > 0) {
  const delayed = triggered[0];
  const forcedEnc = quest.encounters.find(e => e.id === delayed.encounterId);
  if (forcedEnc) {
    state.delayedEffects = state.delayedEffects.filter(d => d !== delayed);
    // Use forced encounter instead of random
    set({
      encounter: forcedEnc,
      result: null,
      screen: "encounter",
      state: { ...state, day: state.day + 1 },
    });
    return;
  }
}
```

### Step 4: Create delayed consequence encounters

```typescript
// Example: save someone on day 3, they betray you on day 8
{
  id: "rescued_spy", scene: "open_sea", title: "Порятунок у штормі",
  text: "Людина на уламку. Кричить про допомогу.",
  choices: [
    { text: "🆘 Врятувати", eff: { crew: 1, delay: { daysLater: 5, encounterId: "spy_betrayal" } },
      msg: "Дякує. Каже, що колишній навігатор. Занадто вдячний?" },
    { text: "💨 Пропливти", eff: { karma: -1 }, msg: "Крики стихають. Тиша." },
  ],
},
{
  id: "spy_betrayal", scene: "combat", title: "Зрада!",
  text: "'Навігатор' виявився шпигуном Королівського флоту. Вночі подає сигнал.",
  requires: () => false, // only via delay
  choices: [
    { text: "⚔️ Схопити зрадника", eff: { crew: -1, karma: 0 }, msg: "В останню мить! Флот не побачив сигналу." },
    { text: "🏃 Тікати в темряву", eff: { crew: -2 }, msg: "Британці вже поруч. Втрачаєте двох у хаосі." },
  ],
},
```

### Step 5: Add hint rendering to MapScreen

```typescript
// Show subtle hints for upcoming delayed effects
const hints = state.delayedEffects
  .filter(d => d.hint && d.triggerDay - state.day <= 2)
  .map(d => d.hint);

{hints.map((h, i) => (
  <motion.div key={i} className="font-game text-[8px] text-yellow-400/40 mt-1">
    {h}
  </motion.div>
))}
```

### Step 6: Build, verify, commit

```bash
npm run build
# Test: trigger delayed encounter, verify it fires on correct day
# Test: save/load preserves delayed effects
git add -A && git commit -m "feat: delayed effects and consequence encounters"
```

---

## Task 6: Final Wiring, Balance, Deploy

### Step 1: Update initialState

```typescript
// In quest factory, ensure new fields have defaults:
initialState: {
  gold: 30,
  crew: 8,
  karma: 0,
  curse: 0,
  day: 0,
  flags: new Set(),
  log: [],
  inventory: [],
  delayedEffects: [],
},
```

### Step 2: Update serialization

Ensure `inventory` and `delayedEffects` are serialized/deserialized correctly in `state.ts`.

### Step 3: Update CLAUDE.md

Document new systems: inventory, route planning, location encounters, delayed effects.

### Step 4: Update TASKS.md

Mark gameplay depth improvements as completed.

### Step 5: Build, deploy

```bash
npm run build
vercel --prod
```
