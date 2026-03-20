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
    effects.ts        # Effect value resolution (fixed/range)
    encounter-picker.ts  # Weighted encounter selection with location priority
    items.ts          # 10 artifact definitions with passive effects
    items-i18n.ts     # Bilingual artifact names/descriptions
    achievements.ts   # 14 achievements with check/unlock logic
    achievements-i18n.ts # Locale-aware achievement titles/descriptions
    history.ts        # Run history tracking (last 20 voyages)
    variant.ts        # Zustand store for game variant (classic/enhanced), persisted
  renderer/           # Visual layer
    sprites.ts        # Pixel art sprite definitions + drawing
    particles.ts      # Particle system for weather/combat/ambient effects
    scenes/index.ts   # 9 scene renderers with atmosphere palette support
    ship-variants.ts  # Layered ship drawing (6 conditional overlays based on game state)
    atmosphere.ts     # Time-of-day palettes (dawn/day/dusk/night) + weather overlays
    map-data.ts       # 16x10 Caribbean grid: terrain types, named locations, helpers
    world-map.ts      # World map renderer with fog of war, ship animation
  audio/
    audio-manager.ts  # Procedural ambient per scene + SFX oscillators
  ui/components/      # React components
    GameCanvas.tsx     # Canvas with scene rendering + particle overlay
    StatsBar.tsx       # Animated stat display (gold, crew, day, curse)
    InventoryBar.tsx   # Compact artifact inventory display
    ChoiceCard.tsx     # Animated choice buttons with keyboard hints
    TypewriterText.tsx # Character-by-character text reveal
    TitleScreen.tsx    # Title + new game / continue
    SailingScreen.tsx  # Between-encounter sailing view (Classic mode)
    MapScreen.tsx      # World map sailing view (Enhanced mode)
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

## i18n System
- **Locale store**: Zustand store in `src/i18n/index.ts`, persisted to localStorage
- **Auto-detection**: Defaults to browser language (uk/en)
- **UI strings**: `useT()` hook returns translator function, ~40 UI keys
- **Game content**: Separate encounter/ending files per locale, selected via `getCursedGalleon(locale)`
- **Achievements**: `achievements-i18n.ts` provides locale-aware titles/descriptions
- **Language toggle**: In Settings modal

## Game Mechanics
- **Stats**: gold, crew, karma, curse, day (max 20)
- **Flags**: Set<string> tracking player choices for consequence encounters
- **Inventory**: string[] of artifact IDs with passive per-day effects
- **Encounter picker**: Location-bound > consequence (60%) > normal. Filters by player map position
- **Encounter types**: Standard, chain (multi-step), location-bound, item-gated choices, delayed triggers
- **Effects**: gold, crew, karma, curse, item gain/loss, map reveal, chain to next encounter, delayed encounter
- **Delayed effects**: Scheduled encounters trigger N days later, with hint text shown on map
- **Endings**: Priority-ordered, first matching condition wins
- **Curse system**: Affects UI (glitch effects, zalgo text, scanlines at curse >= 8)
- **Save system**: Auto-saves to localStorage after each encounter
- **Achievements**: 14 unlockable, checked on game end, stored in localStorage
- **Run history**: Last 20 completed games with stats

## Inventory System
10 artifacts with rarity (common/rare/cursed), passive per-day stat effects, reveal radius bonuses, and encounter unlocks.
Items are gained/lost via `item`/`loseItem` in Effects. Choices can be gated with `requires_item`.
InventoryBar component shown on sailing, map, and encounter screens.

## Audio System
Fully procedural, no audio files needed:
- **Ambient**: Per-scene config with oscillators, LFO modulation, brown noise layer, low-pass filter
- **SFX**: click, coin, curse, wave, thunder, crewLoss, encounter
- **Crossfade**: 1.5s fade between scene ambient tracks

## Enhanced Mode (Variant B)
Opt-in visual enhancement mode, toggled on title screen:
- **Dynamic ship**: 6 conditional overlays (tattered sail, cannons, curse glow, gold trim, ghost sails)
- **Atmosphere**: Time-of-day (dawn/day/dusk/night) deterministic from day number, weather (clear/overcast/foggy/rain) seeded from day
- **World map**: 16x10 Caribbean grid with fog of war, 9 named locations (bilingual), terrain types (deep/water/shallow/land/port/reef/cave/wreck)
- **Route system**: Named locations connected by route graph. Player picks destination from 2-3 revealed adjacent locations. Ship follows planned route with dashed line + pulsing diamond marker
- **Fog of war**: Reveals 3x3 area around player (bonus from artifacts like cursed_compass), persisted in save
- **Map movement**: Route-based (ship advances along planned route each encounter), falls back to terrain-matching if no route set
- Classic mode remains unchanged

## Key Design Decisions
- Canvas 2D (not PixiJS) for scene rendering to keep bundle small
- All audio synthesized via Web Audio API (zero audio file dependencies)
- Font loaded via @font-face from Google Fonts CDN
- Tailwind custom theme: `--font-game` for "Press Start 2P"
- PWA with service worker for offline play
- i18n without external library (simple Zustand store + translation objects)
- Enhanced mode is a rendering layer on top, not a separate game engine

## Build & Deploy
```bash
npm run dev    # Dev server on :5173
npm run build  # Production build to dist/
```
Deployed on Vercel.
