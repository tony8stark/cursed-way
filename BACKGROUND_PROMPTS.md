# Background Image Generation Prompts — Чорний Прилив

## Technical Specs

- **Output size**: 1040×600 px (renders at 520×300 in canvas, 2x for retina)
- **Aspect ratio**: 1.73:1 (wide landscape)
- **Style**: Pixel art, 16-bit era aesthetic, limited palette, visible pixels
- **Waterline**: ~68% from top (408px in 600px image) — everything below is water, above is sky/environment
- **Important**: NO ships in backgrounds. Ship sprite composited separately. Leave water area at waterline relatively clean.
- **Format**: PNG, transparent-free (solid backgrounds)

---

## Base Style Prefix (paste before every prompt)

```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape aspect ratio 1.73:1, 1040x600 pixels
```

---

## 1. OPEN_SEA — Відкрите море

The default scene. Horizon line at ~68% height. Sky above, ocean waves below.

### Dawn 🌅
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Open ocean at dawn. Deep purple-indigo sky (#2a1a3e) transitioning to dark blue water (#1a2040). Warm orange-amber sunrise glow on the horizon line at 68% height. Thin clouds catching golden light. Calm sea with subtle pixel wave patterns below horizon. A few fading stars in upper sky. Warm amber accent tones (#f0a040).
```

### Day ☀️
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Open Caribbean ocean in daylight. Deep navy sky (#0e1a3a) with scattered clouds. Dark blue-teal water (#0a1a3e) below horizon at 68% height. Subtle light reflections on wave crests. Cyan-blue light accent (#40c0f0). Distant horizon haze. Pixel wave texture across water surface.
```

### Dusk 🌆
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Open ocean at dusk. Dark crimson-maroon sky (#2a1018) bleeding into deep indigo water (#1a1028). Fiery orange-red sunset on horizon at 68% height. Dramatic clouds silhouetted against dying light. Red-orange accent (#f06040). Water reflects warm tones near horizon, dark further from it.
```

### Night 🌙
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Open ocean at night. Near-black sky (#06060e) filled with pixel stars. Extremely dark water (#04040a) below horizon at 68% height. Faint moonlight reflection on water surface. Deep indigo-purple accent (#4040a0). Bioluminescent hints in darkest water. Eerie, vast emptiness.
```

---

## 2. STORM — Шторм

Violent weather. Dark, dramatic. Lightning optional. Heavy atmosphere.

### Dawn
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Raging ocean storm at dawn. Almost black sky (#08081a) with massive churning storm clouds. Faint amber glow breaking through cloud gaps. Heavy rain streaks. Choppy violent waves below horizon at 68% height. Lightning bolt illuminating clouds from within. Foam-capped dark waves. Apocalyptic atmosphere.
```

### Day
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Caribbean hurricane in daylight. Dark gray-blue storm sky, so dark it barely looks like day. Massive cumulonimbus clouds. Torrential pixel rain. Violent sea with towering wave crests at and below 68% horizon. White foam everywhere. Fork lightning in distance. Green-gray tint to the oppressive clouds.
```

### Dusk
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Storm at dusk. Blood-red sky visible through breaks in dark storm clouds. Violent black ocean below 68% horizon. Lightning bolt casting eerie red-purple light on churning waves. Rain and wind-blown spray. Dramatic contrast between dark clouds and crimson sunset. Hellish atmosphere.
```

### Night
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Night storm at sea. Pitch-black sky and water, almost indistinguishable. Horizon at 68%. Only visible in lightning flashes — frozen moment of white-blue lightning illuminating mountainous waves. Rain sheets. Ghostly white foam on black water. Pure terror and darkness. Minimal palette: black, dark blue, white flash.
```

---

## 3. ISLAND — Острів

Tropical island visible in right portion of frame. Beach/land from center-right, water left side. Ship approaches from left.

### Dawn
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Tropical Caribbean island at dawn, viewed from the sea. Island occupies right 60% of frame. Sandy beach (#e0c878) at waterline (68% height). Lush green jungle hill rising above beach. Palm trees silhouetted against purple-orange dawn sky (#2a1a3e). Warm amber sunrise glow (#f0a040) behind the island. Dark tropical water on left side. Small wooden huts among palms. Morning mist clinging to jungle.
```

### Day
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Tropical island in Caribbean daylight, viewed from sea. Island in right 60% of frame. Golden sand beach at 68% waterline. Vibrant green jungle vegetation, tall palm trees, bushes. Small thatched-roof buildings. Navy sky (#0e1a3a) with white clouds. Cyan water (#0a1a3e) on left. Coral visible in shallow turquoise water near shore. Bright, lively tropical scene.
```

### Dusk
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Tropical island at sunset, viewed from sea. Island right 60%. Dark beach at 68% waterline. Palm tree silhouettes against fiery dusk sky (#2a1018). Orange-red light (#f06040) reflecting on calm water. Jungle hillside in deep shadow. Warm light from a hut window. Romantic, melancholic Caribbean evening. Dark purple water on left.
```

### Night
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Tropical island at night, viewed from sea. Island right 60%, barely visible as dark silhouette. Beach at 68% waterline. Near-black sky (#06060e) with stars and crescent moon. Dark jungle shapes against slightly lighter sky. Single campfire glow on beach, warm orange dot. Fireflies or bioluminescence in water. Mysterious, quiet night.
```

---

## 4. CAVE — Печера

Underground/cavern scene. Dark with glowing elements. No waterline concept — fully enclosed.

### All times (caves are timeless — generate 4 variants with different lighting)

#### Variant A — Crystal Cave
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Dark pirate cave interior. Nearly black rock walls (#0a0808) framing the scene from sides and top, opening to a cavern space. Stalactites hanging from ceiling. Shallow underground pool covering bottom 30%. Glowing green-cyan crystals (#40f0a0) embedded in walls casting eerie light. Treasure chest faintly visible. Dripping water catching light. Mysterious, claustrophobic.
```

#### Variant B — Sea Cave
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Coastal sea cave interior. Dark rock walls narrowing from sides. Distant cave opening at back showing faint blue sea light. Dark water filling bottom 30%. Hanging moss and barnacles on walls. Bioluminescent organisms glowing blue-green on wet rock. Skull and bone details. Smuggler's hideout atmosphere. Dark brown and black palette with cyan glow accents.
```

#### Variant C — Cursed Grotto
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Haunted cave grotto. Black rock walls. Purple magical glow (#8020c0) from cursed artifacts scattered on ground. Ghostly mist floating at mid-level. Ancient carved symbols on walls faintly glowing. Pile of gold coins reflecting purple light. Spider webs in corners. Supernatural dread atmosphere. Very dark with only purple-magenta light sources.
```

#### Variant D — Underwater Cavern
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Partially flooded underground cavern. Dark rock ceiling and walls. Water level at 60% height, clear enough to see submerged rock formations. Air pocket above. Green-teal bioluminescent algae on walls. Jellyfish-like creatures floating in water, glowing softly. Light shaft from crack in ceiling. Eerie, beautiful, dangerous.
```

---

## 5. COMBAT — Морський бій

Naval battle scene. Smoke, fire, dark dramatic sky. Enemy ship area in upper-right distance, player ship area in lower-left foreground. Both ships rendered as sprites — background should show the ENVIRONMENT of battle.

### Dawn
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Naval battle sea environment at dawn. Dark smoky sky with amber dawn glow piercing through cannon smoke. Choppy dark water below 68% horizon. Smoke clouds and cannon flash illumination. Floating debris and barrel fragments in water. Burning embers and sparks in air. Orange fire reflections on dark waves. Chaotic, violent atmosphere without any ships.
```

### Day
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Sea battle environment in daylight. Gray-blue sky obscured by thick black cannon smoke. Dark navy water below 68% horizon. Gunpowder haze hanging in air. Splashes from cannonball impacts in water. Floating wooden planks and rope. Seagulls fleeing. Distant Caribbean island silhouette on horizon. War-torn ocean atmosphere.
```

### Dusk
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Naval battle environment at sunset. Blood-red sky mixing with black cannon smoke. Dark water below 68% horizon reflecting crimson and fire orange. Burning debris floating. Explosion flashes in smoke clouds. Dramatic silhouettes of smoke pillars against red sky. Hellish battle atmosphere. No ships, only the environment of destruction.
```

### Night
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Night naval battle environment. Black sky and black water merging at 68% horizon. Cannon muzzle flashes illuminating smoke clouds in orange bursts. Fire reflections dancing on dark water. Sparks and embers trailing in air. A burning mast fragment floating. Moon partially visible through smoke. Most of scene in darkness, lit only by warfare.
```

---

## 6. ETHEREAL — Потойбічний світ

Supernatural, mystical realm. Purple/violet dominant. Dreamlike, otherworldly. No clear horizon — a void or spirit world.

### All times (ethereal realm is outside time — generate 4 distinct variants)

#### Variant A — Spirit Sea
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Ethereal spirit ocean. Deep purple-black void (#12081e). Glowing purple nebula-like clouds floating at various heights. Ghostly transparent waves of energy at 68% level. Floating spectral particles, white-lavender motes drifting upward. Stars or spirit lights scattered across void. A faint ghostly island silhouette in distance. Otherworldly, dreamlike, haunting.
```

#### Variant B — Cursed Dimension
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Cursed parallel dimension. Dark purple void (#12081e) with swirling magical vortex in upper portion. Glowing purple-magenta rune circles floating in space. A sea of dark energy below 68% — not water but liquid shadow with purple highlights. Spectral chains and anchors suspended in void. Eye-like formations in the darkness. Deeply unsettling supernatural space.
```

#### Variant C — Ghost Ship Graveyard
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Spectral ship graveyard in void. Purple-black space (#12081e). Ghostly transparent wrecked ships floating at various depths — only as background silhouettes. Ethereal green-purple fog. Floating barrels and bones. A massive glowing portal or whirlpool in the distance. Spirits as small white lights. The boundary between life and death.
```

#### Variant D — Davy Jones Realm
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
The realm of Davy Jones. Deep purple abyss (#12081e). Bottom is an ocean floor visible through impossibly clear dark water — skulls, treasure, broken masts. Above the waterline at 68% is a void sky with purple aurora and swirling cosmic patterns. Giant kraken tentacles visible as distant background silhouettes. Bioluminescent deep-sea creatures. Beautiful and terrifying.
```

---

## 7. PORT — Порт

Caribbean port town. Dock, buildings, palm trees on right side. Water on left. Busy harbor atmosphere.

### Dawn
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Caribbean pirate port at dawn. Wooden dock and pier at 68% height extending from right. Colonial wooden buildings with tile roofs on right side, 2-3 stories. Tall palm trees. Purple-orange dawn sky (#2a1a3e) with warm amber glow (#f0a040). Dark harbor water on left. Dock lanterns still glowing. Fishing nets hanging. Crates and barrels on dock. Quiet early morning harbor.
```

### Day
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Bustling Caribbean port in daylight. Wooden dock at 68% height from right side. Colorful colonial buildings — tavern with sign, merchant shop, warehouse. Palm trees and lush vegetation behind buildings. Navy sky (#0e1a3a). Dark blue harbor water on left with cyan highlights (#40c0f0). Stacked cargo crates, rum barrels on dock. Rope coils, anchor. Lively port atmosphere.
```

### Dusk
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Caribbean port at dusk. Dock at 68% height. Building silhouettes against crimson-maroon sky (#2a1018). Warm orange-red sunset (#f06040) reflected in harbor water on left. Lit windows in tavern glowing warm yellow. Street lanterns being lit. Purple shadows on dock. Romantic dangerous pirate port evening. Palm tree silhouettes.
```

### Night
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric Caribbean pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Caribbean pirate port at night. Dock at 68% height. Buildings as dark shapes against black sky (#06060e). Tavern windows glowing warm orange, light spilling onto dock. A hanging lantern. Moon reflecting on dark harbor water on left. Stars. Indigo-purple accent (#4040a0). Shadowy, dangerous nightlife atmosphere. A rat on the dock perhaps.
```

---

## 8. UNDERWATER — Підводний світ

Fully submerged scene. No horizon — everything is water. Gradient from lighter blue (top, surface light) to deep dark blue (bottom, abyss).

### All times (underwater is below surface — generate 4 variants with different depths/themes)

#### Variant A — Coral Reef
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Underwater coral reef scene. Blue-green gradient from surface light (#0a2a4a top) to deep dark (#041828 bottom). Sunlight rays penetrating from above as diagonal light shafts. Colorful pixel coral formations along bottom — brain coral, fan coral, tube sponges. Seaweed and kelp swaying. Small tropical fish silhouettes. Bubbles rising. Sandy ocean floor with shells.
```

#### Variant B — Deep Abyss
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Deep ocean abyss. Nearly black water (#041828) everywhere, slightly lighter at top. No sunlight reaches here. Only bioluminescent creatures provide light — glowing jellyfish, anglerfish lures, luminous plankton. A massive dark silhouette of something enormous in the far background. Volcanic vent on ocean floor glowing orange. Terrifying depth. Minimal palette: black, dark teal, bioluminescent cyan spots.
```

#### Variant C — Sunken Ruins
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Sunken ancient ruins underwater. Blue-green water (#0a2a4a). Crumbling stone columns and arches covered in coral and barnacles. A broken statue head on sandy floor. Ancient treasure chest half-buried in sand. Seaweed growing through cracks. Light shafts from surface illuminating dust particles. Fish swimming through archways. Mysterious lost civilization.
```

#### Variant D — Shipwreck Depths
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Underwater shipwreck scene. Dark blue water (#0a2a4a to #041828). Broken wooden hull of sunken galleon resting on ocean floor, tilted. Torn sails drifting like ghosts in current. Scattered gold coins and cannonballs on sand. An octopus hiding in the hull. Coral growing on ship timber. Moray eel peering from porthole. Haunting, treasure-filled depths.
```

---

## 9. KRAKEN — Кракен

Boss encounter. Massive sea creature dominates the scene. Dark, violent water. The creature is part of the background here (unlike ships which are sprites).

### All times (kraken encounter is singular dramatic moment — 4 variants with different creatures/angles)

#### Variant A — Kraken Rising
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Giant kraken emerging from dark ocean. Near-black choppy water (#080810) below 68% horizon. Massive tentacles rising from water — 3-4 huge pixel tentacles with suckers, some arching over the horizon line into the dark sky. Splashing water and foam around tentacles. Dark stormy sky. One glowing yellow eye barely visible at water surface. Purple-dark color scheme. Terrifying scale.
```

#### Variant B — Sea Serpent
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Massive sea serpent in dark ocean. Near-black water (#080810). Serpent body creating humps above waterline at 68% — a long sinuous creature with segments visible above and below water. Dragon-like head with glowing eyes on left side. Scales in dark green-purple. Churning whirlpool around the creature. Dark sky with no stars — just dread. Foam and splash everywhere.
```

#### Variant C — Leviathan Below
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Something enormous beneath the surface. Dark ocean (#080810) at 68% horizon. Water is slightly transparent showing a MASSIVE dark silhouette underneath — whale-like leviathan, far bigger than the frame, only partially visible. One enormous glowing eye beneath the surface. Surface water disturbed with ripples and small whirlpools. Dark sky. Absolute cosmic horror of scale.
```

#### Variant D — Tentacle Storm
```
Pixel art game background, 16-bit retro style, visible square pixels, dark atmospheric pirate theme, limited color palette, no characters, no ships, no text, no UI elements, wide landscape 1040x600.
Multiple kraken tentacles erupting from ocean during a storm. Dark water (#080810) and dark sky merging. 5-6 tentacles of varying sizes breaking water surface around 68% horizon. Lightning flash illuminating the tentacles and rain. Green bioluminescent glow along tentacle edges. Absolute chaos — waves, foam, spray, rain, lightning. The ocean itself is alive and hostile.
```

---

## Generation Strategy

**Total images**: 9 scenes × 4 variants = **36 backgrounds**

For scenes with time-of-day variants (open_sea, storm, island, combat, port): map directly to dawn/day/dusk/night in code.

For timeless scenes (cave, ethereal, underwater, kraken): randomly select variant or pick based on encounter context.

**File naming convention**:
```
public/backgrounds/
  open_sea_dawn.png
  open_sea_day.png
  open_sea_dusk.png
  open_sea_night.png
  storm_dawn.png
  storm_day.png
  ...
  cave_a.png
  cave_b.png
  cave_c.png
  cave_d.png
  ethereal_a.png
  ...
  kraken_a.png
  ...
```

**If you want even more variety** — generate 2-3 per prompt (just re-run same prompt). The code can randomly pick from multiple variants per scene+time combo.

**Post-processing tips**:
1. Verify output is 1040×600 (some AI tools don't respect exact dimensions — resize in any editor)
2. If the AI adds anti-aliasing smooth gradients — apply a pixelate filter (nearest-neighbor downscale to 260×150 then back up to 1040×600)
3. Check that waterline area (~68% from top) is relatively clean water — no major objects there, that's where the ship sprite sits
4. If colors look too bright for the game's dark palette — reduce brightness/increase contrast in batch

---

## Code Integration (Quick Guide)

In `src/renderer/scenes/index.ts`, each scene function becomes:

```typescript
// Preload backgrounds
const bgCache = new Map<string, HTMLImageElement>();

function loadBg(key: string): HTMLImageElement | null {
  if (bgCache.has(key)) return bgCache.get(key)!;
  const img = new Image();
  img.src = `/backgrounds/${key}.png`;
  img.onload = () => bgCache.set(key, img);
  return bgCache.get(key) ?? null;
}

// In scene renderer:
function sceneOpenSea(ctx, W, H, f, ps, opts) {
  const time = opts?.atmosphere?.time ?? "day";
  const bg = loadBg(`open_sea_${time}`);

  if (bg) {
    ctx.drawImage(bg, 0, 0, W, H);
  } else {
    // fallback: existing procedural rendering
    // ... current code ...
  }

  // Time-of-day tint overlay (optional, for extra atmosphere)
  const pal = opts?.atmosphere?.palette;
  if (pal) {
    ctx.fillStyle = pal.sky;
    ctx.globalAlpha = 0.15;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }

  // Ship, particles, etc. — unchanged
  ship(ctx, W * 0.35, H * WL + bob, 3, 1, opts);
}
```

Existing particle systems, ship rendering, fog/weather overlays all work on top of the background image with zero changes.
