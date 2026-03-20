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
    types.ts          # Core interfaces (Quest, Encounter, Choice, GameState)
    state.ts          # Zustand store with save/load (localStorage)
    effects.ts        # Effect value resolution (fixed/range)
    encounter-picker.ts  # Weighted encounter selection
    achievements.ts   # 14 achievements with check/unlock logic
    achievements-i18n.ts # Locale-aware achievement titles/descriptions
    history.ts        # Run history tracking (last 20 voyages)
  renderer/           # Visual layer
    sprites.ts        # Pixel art sprite definitions + drawing
    particles.ts      # Particle system for weather/combat/ambient effects
    scenes/index.ts   # 9 scene renderers (open_sea, storm, island, cave, combat, ethereal, port, underwater, kraken)
  audio/
    audio-manager.ts  # Procedural ambient per scene + SFX oscillators
  ui/components/      # React components
    GameCanvas.tsx     # Canvas with scene rendering + particle overlay
    StatsBar.tsx       # Animated stat display (gold, crew, day, curse)
    ChoiceCard.tsx     # Animated choice buttons with keyboard hints
    TypewriterText.tsx # Character-by-character text reveal
    TitleScreen.tsx    # Title + new game / continue
    SailingScreen.tsx  # Between-encounter sailing view
    EncounterScreen.tsx # Encounter with choices + result
    EndingScreen.tsx   # Game ending with journey log
    AchievementToast.tsx # Animated toast notification for new achievements
    AchievementsPanel.tsx # Gallery of all 14 achievements
    HistoryPanel.tsx   # Past voyages list
    SettingsModal.tsx  # Volume sliders + language switcher
  quests/cursed-galleon/
    encounters.ts     # 40+ encounters (Ukrainian)
    encounters-en.ts  # 40+ encounters (English)
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
- **Encounter picker**: 60% weight toward consequence encounters (ones with `requires`)
- **Endings**: Priority-ordered, first matching condition wins
- **Curse system**: Affects UI (glitch effects, zalgo text, scanlines at curse >= 8)
- **Save system**: Auto-saves to localStorage after each encounter
- **Achievements**: 14 unlockable, checked on game end, stored in localStorage
- **Run history**: Last 20 completed games with stats

## Audio System
Fully procedural, no audio files needed:
- **Ambient**: Per-scene config with oscillators, LFO modulation, brown noise layer, low-pass filter
- **SFX**: click, coin, curse, wave, thunder, crewLoss, encounter
- **Crossfade**: 1.5s fade between scene ambient tracks

## Key Design Decisions
- Canvas 2D (not PixiJS) for scene rendering to keep bundle small
- All audio synthesized via Web Audio API (zero audio file dependencies)
- Font loaded via @font-face from Google Fonts CDN
- Tailwind custom theme: `--font-game` for "Press Start 2P"
- PWA with service worker for offline play
- i18n without external library (simple Zustand store + translation objects)

## Build & Deploy
```bash
npm run dev    # Dev server on :5173
npm run build  # Production build to dist/
```
Deployed on Vercel.
