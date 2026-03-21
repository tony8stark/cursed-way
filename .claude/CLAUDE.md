# Чорний Прилив / Black Tide

Pirate text-adventure game with branching narrative, pixel art, and a curse system.
Bilingual: Ukrainian + English with runtime language switching.

## Tech Stack
- **Vite 6** + React 19 + TypeScript
- **Tailwind CSS v4** (via @tailwindcss/vite plugin)
- **Zustand** for game state management + locale store
- **Framer Motion** for UI animations
- **Web Audio API** for procedural ambient music + synthesized SFX
- **Canvas 2D** for scene rendering with custom particle system
- **vite-plugin-pwa** for offline support + installability

## Project Structure
```
src/
  i18n/
    index.ts          # Locale store (Zustand), useT() hook, UI translations (uk/en)
  engine/             # Quest-agnostic game engine
    types.ts          # Core interfaces (Quest, Encounter, Choice, GameState, DelayedEffect)
    state.ts          # Zustand store with save/load (localStorage)
    game-mode.ts      # Game mode store: "expedition" (20-day) vs "free_roam" (no limit)
    effects.ts        # Effect value resolution (fixed/range)
    encounter-picker.ts  # Storylet scheduler: weighted selection with phase/family/novelty scoring
    storylet-tagger.ts   # Auto-infers storylet metadata (family, tags, phase, weight) from encounter properties
    items.ts          # 10 artifact definitions with passive effects
    items-i18n.ts     # Bilingual artifact names/descriptions
    achievements.ts   # 14 achievements with check/unlock logic
    achievements-i18n.ts # Locale-aware achievement titles/descriptions
    history.ts        # Run history tracking (last 20 voyages)
    objectives.ts     # 6 run objectives (treasure_hunter, curse_breaker, explorer, trade_baron, redeemer, cartographer)
  renderer/           # Visual layer
    sprites.ts        # Pixel art sprite definitions + drawing
    particles.ts      # Particle system for weather/combat/ambient effects
    scenes/index.ts   # 9 scene renderers with atmosphere palette support
    ship-variants.ts  # Layered ship drawing (6 conditional overlays based on game state)
    atmosphere.ts     # Time-of-day palettes (dawn/day/dusk/night) + weather overlays
    map-data.ts       # Active map state + accessors (terrain types, locations, routes)
    map-generator.ts  # Procedural map generation: 30x18 grid, island clusters, location placement
    world-map.ts      # World map renderer with fog of war, ship animation
  audio/
    audio-manager.ts  # Procedural ambient per scene + SFX oscillators
  ui/components/      # React components
    GameCanvas.tsx     # Canvas with scene rendering + particle overlay (always uses enhanced visuals)
    StatsBar.tsx       # Animated stat display (gold, crew, day, curse) - game-mode-aware
    InventoryBar.tsx   # Compact artifact inventory display
    ChoiceCard.tsx     # Animated choice buttons with keyboard hints
    TypewriterText.tsx # Character-by-character text reveal
    TitleScreen.tsx    # Title + game mode selector + new game / continue
    MapScreen.tsx      # World map sailing view (always shown)
    EncounterScreen.tsx # Encounter with choices + result
    EndingScreen.tsx   # Game ending with journey log
    AchievementToast.tsx # Animated toast notification for new achievements
    AchievementsPanel.tsx # Gallery of all 14 achievements
    HistoryPanel.tsx   # Past voyages list
    SettingsModal.tsx  # Volume sliders + language switcher
  quests/cursed-galleon/
    encounters.ts     # 75+ encounters (Ukrainian)
    encounters-en.ts  # 75+ encounters (English)
    endings.ts        # 7 endings (Ukrainian)
    endings-en.ts     # 7 endings (English)
    index.ts          # Quest factory: getCursedGalleon(locale)
  App.tsx             # Main app with screen routing + glitch effects + modals
  main.tsx            # Entry point
  index.css           # Tailwind imports + Press Start 2P font + custom scrollbar
_legacy/
  pirate-game.jsx     # Original single-file game (reference)
```

## Game Modes
Two game modes, selected on title screen:
- **Expedition** (`expedition`): Classic 20-day voyage. Game ends at day 20, crew=0, or curse=15.
- **Free Roam** (`free_roam`): No day limit. Player explores freely. Game ends only on crew=0 or curse=15.

Mode stored in `useGameModeStore` (Zustand), persisted to localStorage. Saved with game state so loading restores the correct mode.

## i18n System
- **Locale store**: Zustand store in `src/i18n/index.ts`, persisted to localStorage
- **Auto-detection**: Defaults to browser language (uk/en)
- **UI strings**: `useT()` hook returns translator function, ~40 UI keys
- **Game content**: Separate encounter/ending files per locale, selected via `getCursedGalleon(locale)`
- **Achievements**: `achievements-i18n.ts` provides locale-aware titles/descriptions
- **Language toggle**: In Settings modal

## Game Mechanics
- **Stats**: gold, crew, karma, curse, day, watch
- **Watches**: 4 watches per day (dawn 🌅, day ☀️, dusk 🌆, night 🌙). Each sail/encounter = 1 watch. Day increments when all 4 watches spent. Passive artifact effects apply once per day (at dawn). Atmosphere visuals (sky/water colors, weather) tied to current watch.
- **Flags**: Set<string> tracking player choices for consequence encounters
- **Inventory**: string[] of artifact IDs with passive per-day effects
- **Storylet scheduler**: Weighted encounter selection using: phase fit (early/mid/late), family diversity (ambient/consequence/quest/relationship/setpiece), tag novelty (anti-repeat), base weight, exclusivity groups. Falls back to top-40% weighted random for variety. Auto-tagger infers metadata from encounter id/scene/requires for backward compat.
- **Encounter types**: Standard, chain (multi-step), location-bound, item-gated choices, delayed triggers
- **Effects**: gold, crew, karma, curse, item gain/loss, map reveal, chain to next encounter, delayed encounter
- **Delayed effects**: Scheduled encounters trigger N days later, with hint text shown on map
- **Objectives**: 6 run objectives for Free Roam mode (treasure_hunter, curse_breaker, explorer, trade_baron, redeemer, cartographer). Player picks one on title screen. Progress tracked via progress bar in sidebar. Completing objective unlocks special ending + option to end voyage or keep sailing.
- **Endings**: Priority-ordered, first matching condition wins (+ objective_complete ending)
- **Curse system**: Affects UI (glitch effects, zalgo text, scanlines at curse >= 8)
- **Save system**: Auto-saves to localStorage after each encounter
- **Achievements**: 14 unlockable, checked on game end, stored in localStorage
- **Run history**: Last 20 completed games with stats

## Visual System
Always-on enhanced visuals (no classic/simple mode):
- **Dynamic ship**: 6 conditional overlays (tattered sail, cannons, curse glow, gold trim, ghost sails)
- **Atmosphere**: Time-of-day (dawn/day/dusk/night) deterministic from day number, weather (clear/overcast/foggy/rain) seeded from day
- **Procedural map**: 30x18 grid generated each run from seed. 8-14 island clusters with terrain (deep/water/shallow/land/port/reef/cave/wreck). 10-16 locations picked from pool of ~32 (12 ports, 12 exploration sites, 8 wild islands). Map seed saved for deterministic regeneration on load.
- **Location pool**: Weighted selection from bilingual location templates. Ports (Tortuga weight 3, others 1-2), exploration (caves, wrecks, reefs), wild islands. Each run gets a unique combination.
- **Route system**: Auto-built graph connecting nearby locations (2-3 nearest within 15 cells). Validated for full connectivity. Player picks destination from connected locations.
- **Fog of war**: Reveals 3x3 area around player (bonus from artifacts like cursed_compass), persisted in save
- **Map movement**: Route-based (ship advances along planned route each encounter), falls back to terrain-matching if no route set

## Inventory System
10 artifacts with rarity (common/rare/cursed), passive per-day stat effects, reveal radius bonuses, and encounter unlocks.
Items are gained/lost via `item`/`loseItem` in Effects. Choices can be gated with `requires_item`.
InventoryBar component shown on map and encounter screens.

## Audio System
Fully procedural, no audio files needed:
- **Ambient**: Per-scene config with oscillators, LFO modulation, brown noise layer, low-pass filter
- **SFX**: click, coin, curse, wave, thunder, crewLoss, encounter
- **Crossfade**: 1.5s fade between scene ambient tracks

## Key Design Decisions
- Desktop-first design
- Canvas 2D (not PixiJS) for scene rendering to keep bundle small
- All audio synthesized via Web Audio API (zero audio file dependencies)
- Font loaded via @font-face from Google Fonts CDN
- Tailwind custom theme: `--font-game` for "Press Start 2P"
- PWA with service worker for offline play
- i18n without external library (simple Zustand store + translation objects)
- Map mode is the only mode (no classic/simple variant)

## Build & Deploy
```bash
npm run dev    # Dev server on :5173
npm run build  # Production build to dist/
```
Deployed on Vercel.
