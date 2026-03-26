# Ship Sprite Generation Prompts — Чорний Прилив

## Technical Specs

- **Output size**: ~240×200 px (renders at ~120×100 on 520×300 canvas)
- **Style**: Must match background style from BACKGROUND_PROMPTS.md — detailed pixel art, 16-bit, dark Caribbean palette
- **Format**: PNG with transparent background (alpha channel)
- **Orientation**: Side view, facing LEFT (player ship sails leftward in scenes)
- **Important**: Ship hull bottom should be flat/aligned — it sits on the waterline at 68% canvas height
- **Palette**: Dark wood browns, cream/white sails, muted accents. Must feel at home on dark ocean backgrounds.

---

## PLAYER SHIPS (4 state variants)

### 1. Galleon Default — Standard Sails
```
Pixel art pirate galleon ship sprite, 16-bit retro game style, side view facing left, transparent background PNG with alpha channel, 240x200 pixels, dark Caribbean pirate theme.
Classic wooden pirate galleon. Dark brown wooden hull with visible plank lines. Three masts with cream-white canvas sails, slightly billowing in wind. Crow's nest on main mast. Bowsprit at front. Small windows along hull. Rope rigging between masts. Neutral flag at stern. Hull bottom flat for waterline placement. Clean, seaworthy, well-maintained ship.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 2. Galleon Battle — Armed & Ready
```
Pixel art pirate galleon ship sprite, 16-bit retro game style, side view facing left, transparent background PNG with alpha channel, 240x200 pixels, dark Caribbean pirate theme.
Battle-ready pirate galleon. Dark brown hull reinforced with metal bands. Three masts with dark brown-tan battle sails. Open cannon ports along hull showing 4-5 black cannon barrels poking out. Red battle flag at stern. Extra rigging and netting. Armored bowsprit. Hull scarred but strong. Aggressive, war-ready appearance. Dark red accent trim along hull.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 3. Galleon Damaged — Barely Afloat
```
Pixel art pirate galleon ship sprite, 16-bit retro game style, side view facing left, transparent background PNG with alpha channel, 240x200 pixels, dark Caribbean pirate theme.
Heavily damaged pirate galleon. Dark brown hull with visible holes and patch repairs — lighter wood patches on dark hull. Masts leaning slightly. Sails torn and tattered with holes and rips, flapping loosely. Broken rigging hanging down. One mast cracked or shortened. Missing bowsprit or broken. Hull taking on water implied by waterline position. Desperate, barely surviving. Muted, desaturated colors.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 4. Galleon Cursed — Skull Sails
```
Pixel art pirate galleon ship sprite, 16-bit retro game style, side view facing left, transparent background PNG with alpha channel, 240x200 pixels, dark Caribbean pirate theme.
Cursed pirate galleon. Very dark, almost black wooden hull. Three masts with black tattered sails — a white skull and crossbones painted on the main sail. Faint purple glow emanating from hull. Eerie green-purple fog wisps around the ship. Dark flag with skull. Barnacles and coral growing on hull. Ghostly lantern at stern glowing purple. A ship touched by dark magic. Terrifying silhouette.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

---

## ENEMY / NPC SHIPS (4 types)

These appear smaller in the scene (further away), but generate at same size — code handles scaling.

### 5. Enemy War Cog — Hostile Vessel
```
Pixel art ship sprite, 16-bit retro game style, side view facing right (approaching from right), transparent background PNG with alpha channel, 240x200 pixels, dark Caribbean pirate theme.
Enemy war cog ship. Stocky, wide dark hull — shorter than a galleon but bulkier. Single large mast with a dark red square sail bearing a black skull emblem. Raised fore and aft castles. Cannon ports open with cannons visible. Iron-reinforced bow for ramming. Dark menacing colors — black hull, dark red sail. Hostile, threatening presence. Flying a tattered red war pennant.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 6. Merchant Vessel — Trade Ship
```
Pixel art ship sprite, 16-bit retro game style, side view facing right, transparent background PNG with alpha channel, 240x200 pixels, dark Caribbean pirate theme.
Merchant trade ship. Rounded, wide brown hull — built for cargo not speed. Two masts with clean white-cream sails. Cargo crates and barrels visible on deck. Neutral flag — no skull, perhaps a trade company emblem. Rope netting over cargo. A peaceful, prosperous vessel. Warm brown tones, lighter than military ships. Hull sits deep in water from heavy cargo.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 7. Ghost Ship — Spectral Vessel
```
Pixel art ship sprite, 16-bit retro game style, side view facing right, transparent background PNG with alpha channel, 240x200 pixels, dark Caribbean pirate theme.
Ghost ship. Translucent pale blue-white hull — semi-transparent, ethereal. Tattered ghostly sails that seem to move without wind, pale blue-gray. Broken masts, holes in hull showing through to nothing inside. Ghostly green-blue glow from within the hull. Spectral fog trailing behind. No crew visible — an empty dead ship sailing itself. Eerie, beautiful, haunting. Colors: pale blue (#c8e6f0), ghost white, dark navy outlines.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 8. Raider Longboat — Fast Attack
```
Pixel art ship sprite, 16-bit retro game style, side view facing right, transparent background PNG with alpha channel, 240x200 pixels, dark Caribbean pirate theme.
Pirate raider longboat. Long, narrow, low-profile dark hull — built for speed. Single mast with a dark triangular lateen sail. Oar ports along hull with oars extended. Shield-like decorations along gunwale. A dragon or serpent figurehead at bow. Fast, aggressive, sleek. Dark wood with red accent stripes. Sits low in water. Hit-and-run pirate raider aesthetic.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

---

## SCENE-SPECIFIC SHIPS (optional extras)

### 9. Shipwreck — Sunken/Beached
```
Pixel art shipwreck sprite, 16-bit retro game style, side view, transparent background PNG with alpha channel, 240x200 pixels, dark Caribbean pirate theme.
Wrecked pirate ship. Hull broken in half, tilted at an angle. Masts snapped and fallen. Sails in shreds hanging from broken rigging. Hull planks splayed open. Barnacles, seaweed, coral growing over everything. Half-submerged or beached on rocks. Treasure debris scattered — gold coins, barrel, rope. Abandoned, decaying, a ruin of what was once mighty. Dark muted browns and greens.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 10. Small Rowboat — Dinghy
```
Pixel art small rowboat sprite, 16-bit retro game style, side view, transparent background PNG with alpha channel, 120x80 pixels, dark Caribbean pirate theme.
Tiny wooden rowboat dinghy. Simple dark brown wooden hull, flat bottom. Two oars resting in oarlocks. A small lantern hanging at bow. Rope coil in bottom. Maybe a fishing net or barrel. Simple, humble, weathered. Used for shore trips from the main ship. Very small and basic — 4-5 colors maximum.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

---

## File Naming Convention

```
public/icons/ships/
  galleon_default.png    (replaces existing)
  galleon_battle.png     (replaces existing)
  galleon_damaged.png    (replaces existing)
  galleon_pirate.png     (replaces existing)
  enemy_cog.png          (replaces existing)
  merchant_ship.png      (new, replaces raider_longboat for merchant use)
  ghost_sailboat.png     (replaces existing)
  raider_longboat.png    (replaces existing)
  shipwreck.png          (new)
  rowboat.png            (new)
```

## Integration Notes

Ship scale factor in `ship-variants.ts` will need adjustment — current `SCALE = 0.55` is for 59×57 sprites. For 240×200 sprites rendering at ~120×100 on the 520×300 canvas:

```typescript
// Old (59×57 sprites):
const SCALE = 0.55;

// New (240×200 sprites):
const SCALE = 0.5;  // 240 × 0.5 = 120px wide on canvas
```

NPC/enemy ships rendered via `drawSprite()` in scenes will also need scale adjustment. Currently drawn at scale ~2.2 for 51×45 sprites. For 240×200:

```typescript
// Old: drawSprite(ctx, "enemy", ..., 2.2, ...)
// New: drawSprite(ctx, "enemy", ..., 0.45, ...)  // 240 × 0.45 ≈ 108px, then further scaled for distance
```
