# Проклятий Галеон (Cursed Way)

Pirate text-adventure game with branching narrative, pixel art, and a curse system.

## Tech Stack
- **Vite 6** + React 19 + TypeScript
- **Tailwind CSS v4** (via @tailwindcss/vite plugin)
- **Zustand** for game state management
- **Framer Motion** for UI animations
- **Howler.js** for audio (synthesized SFX via Web Audio API)
- **Canvas 2D** for scene rendering with custom particle system

## Project Structure
```
src/
  engine/           # Quest-agnostic game engine
    types.ts        # Core interfaces (Quest, Encounter, Choice, GameState)
    state.ts        # Zustand store with save/load (localStorage)
    effects.ts      # Effect value resolution (fixed/range)
    encounter-picker.ts  # Weighted encounter selection
  renderer/         # Visual layer
    sprites.ts      # Pixel art sprite definitions + drawing
    particles.ts    # Particle system for weather/combat/ambient effects
    scenes/index.ts # 9 scene renderers (open_sea, storm, island, cave, combat, ethereal, port, underwater, kraken)
  audio/
    audio-manager.ts # SFX via Web Audio API oscillators + Howler.js for music
  ui/components/    # React components
    GameCanvas.tsx   # Canvas with scene rendering + particle overlay
    StatsBar.tsx     # Animated stat display (gold, crew, day, curse)
    ChoiceCard.tsx   # Animated choice buttons with keyboard hints
    TypewriterText.tsx # Character-by-character text reveal
    TitleScreen.tsx  # Title + new game / continue
    SailingScreen.tsx # Between-encounter sailing view
    EncounterScreen.tsx # Encounter with choices + result
    EndingScreen.tsx # Game ending with journey log
  quests/cursed-galleon/
    encounters.ts   # 40+ encounters with branching flags
    endings.ts      # 7 endings based on state conditions
    index.ts        # Quest definition
  App.tsx           # Main app with screen routing + glitch effects
  main.tsx          # Entry point
  index.css         # Tailwind imports + Press Start 2P font + custom scrollbar
_legacy/
  pirate-game.jsx   # Original single-file game (reference)
```

## Game Mechanics
- **Stats**: gold, crew, karma, curse, day (max 20)
- **Flags**: Set<string> tracking player choices for consequence encounters
- **Encounter picker**: 60% weight toward consequence encounters (ones with `requires`)
- **Endings**: Priority-ordered, first matching condition wins
- **Curse system**: Affects UI (glitch effects, zalgo text, scanlines at curse >= 8)
- **Save system**: Auto-saves to localStorage after each encounter

## Key Design Decisions
- Canvas 2D (not PixiJS) for scene rendering to keep bundle small
- Synthesized SFX via Web Audio API oscillators (no audio file dependencies)
- Font loaded via @font-face from Google Fonts CDN
- Tailwind custom theme: `--font-game` for "Press Start 2P"
- All game text in Ukrainian

## Build & Deploy
```bash
npm run dev    # Dev server on :5173
npm run build  # Production build to dist/
```
