# Character Sprite Generation Prompts — Чорний Прилив

## Reality Check: AI vs Minifolks Style

Current sprites are **Minifolks** by Krishna Palacio: 32×32 PNG, chibi proportions (head = 60% of body), ~4-6 colors per character, 300-500 bytes per file. This is **extreme pixel economy** — each pixel matters, there are maybe 150 non-transparent pixels total per character.

**AI image generators cannot directly produce this.** They generate "pixel art style" which looks nothing like actual 32×32 chibi sprites. Here's what WILL work:

### Recommended Approach: AI Reference → Manual Pixel Art

1. **Generate 128×128 reference** in ChatGPT/Midjourney using prompts below
2. Use reference as a **visual guide** to manually create 32×32 in Aseprite/Piskel/Libresprite
3. Match the Minifolks proportions: ~10px wide body, ~12px head height, 2px arms, 2-3px legs

### Alternative: Pixel Art Specific Tools

- **Piskel** (free, browser) — draw by hand with reference
- **Aseprite** ($20) — industry standard for this scale
- **PixelOver** — can downscale AI art to pixel art with palette control
- **Pixelicious** (free) — online image-to-pixel converter, decent for simple shapes

### Alternative: Buy More Minifolks

Krishna Palacio (the Minifolks artist) sells themed packs on itch.io. Since you already use the style, buying matching packs ensures perfect consistency. ~$5-15 per pack.
- https://krishna-palacio.itch.io/ — check for pirate/fantasy themed packs

---

## Specs for AI Reference Images

- **Output size**: 128×128 px (small enough to stay simple)
- **Style**: Chibi/super-deformed pixel art, oversized head, tiny body
- **Proportions**: Head = 50-60% of total height, body very short, stubby limbs
- **Colors**: Maximum 5-6 per character, flat shading, NO gradients, NO anti-aliasing
- **Pose**: Standing idle, front-facing or slight 3/4 angle, arms at sides or holding item
- **Background**: Solid single color or transparent

---

## Base Style Prefix

```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
[CHARACTER DESCRIPTION HERE]
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

---

## 🪙 MERCHANTS (7)

### 1. Rajesh — Spice Trader
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Indian spice trader. White turban on big round head. Brown skin. Orange sash on tiny body. Small black mustache dots.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 2. Gunther — Arms Dealer
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Bald pale man. Scar line across cheek. Dark brown leather vest. Gray shirt. Stern dot eyes. Big muscular shoulders for chibi scale.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 3. Callisto — Cartographer
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Man with brown feathered hat, big round head. Green coat. Small round spectacles (two dots). Light skin. Quill behind ear.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 4. Rocky — Fence
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Hooded figure. Dark brown hood covering big head, only eyes visible. Dark skin. Dark cloak body. One gold tooth pixel. Sneaky posture.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 5. Mei Lin — Exotic Trader
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Woman with conical straw hat on big head. Olive skin. Red silk robe on tiny body. Black hair bun. Calm dot eyes.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 6. Olaf — Shipwright
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Big man with brown flat cap. Red bushy beard on round head. White apron on tiny body. Brown shirt. Light skin. Broad chibi shoulders.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 7. Giacomo — Rum Merchant
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Jolly round man. Dark brown wide hat on big head. Curly black mustache. Red vest, gold buttons. Light skin, red cheeks. Holding tiny barrel.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

---

## 🏴‍☠️ PIRATES (7)

### 8. Crooked Jack — Rival Captain
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Pirate captain. Black tricorn hat on big head. Dark skin. Black eyepatch on one eye. Red coat on tiny body. Gold earring pixel.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 9. Bones — First Mate
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Thin gaunt pirate. Red bandana on big pale head. Sunken dot eyes. Blue-white striped shirt on thin tiny body. Very skinny limbs.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 10. Anne Bonny — Pirate Queen
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Pirate woman. Wild red hair flowing from big head. Red bandana. Light skin. Red coat on tiny body. Gold buckle pixel. Fierce dot eyes.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 11. Blackbeard — Legendary Pirate
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Huge pirate. Big black hat with red feather on oversized head. Enormous black beard covering most of face and chest. Red coat. Dark skin.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 12. Peg-Leg Sam — Retired Pirate
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Old pirate. White hair on big head. Black eyepatch. Gray-brown tattered coat on tiny body. One normal leg, one peg leg pixel. Wrinkled.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 13. Shadow — Smuggler
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Fully hooded dark figure. Black hood covering entire big head, only two eye dots visible. All black cloak body. Almost a silhouette. Mysterious.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 14. Razor Morgan — Mutineer
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Angry pirate. Red bandana on big pale head. Scar line across face. Brown vest on tiny body, no shirt. Furrowed brow pixels. Muscular.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

---

## ⚓ OFFICIALS (4)

### 15. Lord Winston — Governor
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Colonial governor. White curly wig on big pale head. Blue coat with gold trim on tiny body. White collar. Haughty tiny expression.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 16. Captain Gale — Navy Captain
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Navy officer. Dark navy bicorn hat with gold badge on big head. Light skin. Navy blue coat with gold shoulders on tiny body. Rigid posture.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 17. Inspector Crane — Customs Officer
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Bureaucrat. Small gray hat on big head. Round spectacle dots. Thin brown mustache. Gray uniform on tiny body. Light skin. Suspicious eyes.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 18. Judge Blackstone — Judge
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Stern judge. Long white wig flowing past big pale head. Black robes on tiny body. Small red collar accent. Grim dot expression.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

---

## 🔮 MYSTICS (5)

### 19. Mama Zalia — Voodoo Priestess
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Voodoo priestess. Purple headwrap with gold beads on big dark-skinned head. White face paint dots. Purple robes on tiny body. Mystical.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 20. Estrella — Fortune Teller
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Fortune teller woman. Purple headscarf with gold star dots on big head. Olive skin. Gold hoop earrings. Teal blouse on tiny body.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 21. Jonah — Cursed Sailor
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Undead sailor. Sickly green skin on big gaunt head. Sunken dark eye sockets. Tattered gray-brown striped rags on thin tiny body. Walking corpse.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 22. Coraline — Sea Witch
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Sea witch. Wild black seaweed-like hair flowing from big pale-green head. Teal-green eyes. Dark green dress on tiny body. Shell necklace pixel.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 23. Brother Tikhon — Hermit Monk
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Monk. Brown hood on big light-skinned bald head. Long gray beard. Brown robes on tiny body. Small wooden cross pixel at chest. Peaceful eyes.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

---

## ⛵ CREW (5)

### 24. Doc Marlowe — Ship Surgeon
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Doctor. Gray receding hair on big head. Round spectacle dots. White apron with red cross on tiny body. Brown shirt. Calm expression.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 25. Star Thomas — Navigator
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Navigator. Blue bandana with gold pattern on big tanned head. Dark hair. Dark blue coat on tiny body. Compass tattoo dot on neck.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 26. Fat Pedro — Ship Cook
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Round jolly cook. White chef hat on big dark-skinned head. Big smile. White apron on extra-wide tiny body. Brown shirt. Wooden spoon pixel.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 27. Thunder — Master Gunner
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Muscular gunner. Red bandana on big head. Soot-stained brown skin face. Dark brown vest on broad tiny body. No shirt. Burn mark pixels.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 28. Knot — Bosun
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Bosun. Brown flat cap on big weathered head. Blue-white striped shirt on tiny body. Rope coil on one shoulder pixel. Squinted eyes.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

---

## 🏠 CIVILIANS (4)

### 29. Old Jorge — Fisherman
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Old fisherman. Wide straw hat on big tanned head. White wispy hair. Brown simple tunic on tiny body. Fishing rod pixel. Wrinkled smile.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 30. Don Alonso — Plantation Owner
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Rich colonial man. White wide hat on big light-skinned head. Thin black mustache. White suit on tiny body. Gold accent pixel. Arrogant pose.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 31. Father Sebastian — Priest
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Catholic priest. Black wide hat on big pale head. White collar pixel. Black cassock robes on tiny body. Gold cross at chest. Kind eyes.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 32. Ruby — Tavern Keeper
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Tavern woman. Brown hair bun on big head. Gold earring dots. Light skin, rosy cheeks. White apron over red blouse on tiny body. Warm smile.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

---

## 👻 SUPERNATURAL (4)

### 33. Captain Morlock — Ghost Captain
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Ghost pirate. Translucent blue-white big head. Ghostly tricorn hat outline. Black hollow eye dots. Tattered pale blue coat on fading tiny body. Semi-transparent.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 34. Nereida — Siren
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Siren. Long flowing teal hair from big pale green head. Glowing cyan eye dots. Fish scale pattern on tiny body transitioning from skin to teal. Purple shell pixels.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 35. Davy Jones — Sea God
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Sea god. Gold coral crown on big dark-green head. Glowing cyan eyes. Tentacle beard hanging from chin — 3 teal tentacle pixels. Purple-green robes on tiny body.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

### 36. The Bone Crew — Skeleton Sailors
```
Tiny chibi pixel art character sprite, 32x32 pixel scale, super-deformed with oversized head, flat colors no gradients, maximum 5 colors, 1px black outline, standing idle facing forward, transparent background PNG with alpha channel.
Skeleton pirate. White bone skull as big head, dark eye socket dots. Tattered dark brown hat on skull. Navy gray coat hanging on bone pixel shoulders. Grinning jaw.
No anti-aliasing, no subpixel shading, each pixel must be a single solid color with no blending or dithering between colors, hard 1-pixel black outline with no gray transition pixels.
```

---

## Honest Assessment: What Will Actually Work

| Approach | Quality | Time | Cost |
|----------|---------|------|------|
| AI gen → use as reference → redraw in Aseprite | ★★★★★ Perfect match | 30-60 min per sprite | Free + time |
| Buy more Minifolks packs from itch.io | ★★★★★ Perfect match | 5 min setup | $5-15 per pack |
| AI gen → PixelOver/Pixelicious auto-convert | ★★★☆☆ Close but messy | 5 min per sprite | Free |
| AI gen → use directly without conversion | ★☆☆☆☆ Style mismatch | 2 min per sprite | Free |
| Commission pixel artist (Fiverr/itch.io) | ★★★★★ Perfect custom | 1-2 weeks | $50-200 total |

**My actual recommendation**: since you already own Minifolks, check if Krishna Palacio has more themed packs. Failing that, use AI prompts above as **visual references** and hand-pixel each in Aseprite. At 32×32, each sprite is 15-20 minutes for someone comfortable with pixel art.

## File Naming Convention

```
public/icons/npcs/
  spice_trader.png
  weapons_dealer.png
  map_seller.png
  fence.png
  exotic_trader.png
  shipwright.png
  rum_merchant.png
  rival_captain.png
  first_mate_bones.png
  pirate_queen.png
  legendary_pirate.png
  retired_pirate.png
  smuggler.png
  mutineer.png
  governor.png
  navy_captain.png
  customs_officer.png
  judge.png
  voodoo_priestess.png
  fortune_teller.png
  cursed_sailor.png
  sea_witch.png
  hermit_monk.png
  surgeon.png
  navigator.png
  cook.png
  gunner.png
  bosun.png
  fisherman.png
  plantation_owner.png
  priest.png
  tavern_keeper.png
  ghost_captain.png
  siren.png
  sea_god.png
  skeleton_crew.png
```
