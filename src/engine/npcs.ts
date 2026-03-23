import type { Locale } from "../i18n";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NPCPortrait {
  /** Palette: array of hex colors used in this portrait */
  palette: string[];
  /**
   * Pixel rows from top to bottom. Each row is an array of palette indices.
   * -1 means transparent. Portrait is 10 wide x 12 tall.
   */
  pixels: number[][];
}

export interface NPCDef {
  id: string;
  name: Record<Locale, string>;
  title: Record<Locale, string>;
  icon: string;
  /** Category of NPC for journal organization */
  category:
    | "merchant"
    | "pirate"
    | "official"
    | "mystic"
    | "crew"
    | "civilian"
    | "supernatural";
  /** Pixel art drawing instructions (legacy, kept as fallback) */
  portrait: NPCPortrait;
  /** Path to sprite image (32x32 idle frame from Minifolks) */
  spritePath?: string;
  /** Flag that gets set when player meets this NPC */
  metFlag: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Shorthand: build a 10x12 pixel grid from an array of 12 strings (each 10 chars). */
function px(palette: string[], ...rows: string[]): NPCPortrait {
  const pixels = rows.map((r) =>
    r.split("").map((c) => {
      if (c === ".") return -1;
      return parseInt(c, 16); // 0-f → 0-15 palette index
    }),
  );
  return { palette, pixels };
}

// ---------------------------------------------------------------------------
// Palettes (reused across NPCs to keep memory light)
// ---------------------------------------------------------------------------

// Skin tones
const SKIN_LIGHT = "#e8b796";
const SKIN_MED = "#c68642";
const SKIN_DARK = "#8d5524";
const SKIN_PALE = "#f5d6ba";
const SKIN_OLIVE = "#b5854b";

// Cloth / accessory colors
const RED = "#c0392b";
const DARK_RED = "#922b21";
const BLUE = "#2471a3";
const DARK_BLUE = "#1a5276";
const NAVY = "#1b2631";
const GREEN = "#27ae60";
const DARK_GREEN = "#1e8449";
const GOLD = "#f1c40f";
const BROWN = "#6e4b3a";
const DARK_BROWN = "#3e2723";
const BLACK = "#1c1c1c";
const WHITE = "#f0ece2";
const GRAY = "#7f8c8d";
const PURPLE = "#8e44ad";
const TEAL = "#16a085";
const ORANGE = "#e67e22";
const CYAN = "#00bcd4";
const GHOST_WHITE = "#c8e6f0";
const GHOST_BLUE = "#5dade2";
const GHOST_GLOW = "#aed6f1";

// Hair
const HAIR_BLACK = "#1c1c1c";
const HAIR_BROWN = "#5d3a1a";
const HAIR_RED = "#a04000";
const HAIR_GRAY = "#95a5a6";
const HAIR_WHITE = "#d5d8dc";

// ---------------------------------------------------------------------------
// NPC Definitions (32 NPCs)
// ---------------------------------------------------------------------------

const npcList: NPCDef[] = [
  // =======================================================================
  // MERCHANTS (7)
  // =======================================================================
  {
    id: "spice_trader",
    name: { uk: "Раджеш", en: "Rajesh" },
    title: { uk: "Торговець спеціями", en: "Spice Trader" },
    icon: "🧂",
    category: "merchant",
    metFlag: "met_spice_trader",
    spritePath: "/icons/npcs/merchant.png",
    // Turban, medium-dark skin, mustache, orange/gold sash
    portrait: px(
      [WHITE, SKIN_MED, ORANGE, HAIR_BLACK, GOLD, BROWN],
      //0123456789
      "..000000..",
      "..000000..",
      ".00040000.",
      ".11111111.",
      ".11131111.",
      ".11131111.",
      ".13111311.",
      "..111111..",
      "..222222..",
      "..255552..",
      "..222222..",
      "..2....2..",
    ),
  },
  {
    id: "weapons_dealer",
    name: { uk: "Гюнтер", en: "Gunther" },
    title: { uk: "Торговець зброєю", en: "Arms Dealer" },
    icon: "⚔️",
    category: "merchant",
    metFlag: "met_weapons_dealer",
    spritePath: "/icons/npcs/blacksmith.png",
    // Bald, scarred, pale skin, leather vest
    portrait: px(
      [SKIN_PALE, HAIR_BLACK, RED, BROWN, GRAY, DARK_BROWN],
      //0123456789
      "..........",
      "..111111..",
      ".10000001.",
      ".00020001.",
      ".00000001.",
      ".00000001.",
      ".00100001.",
      "..000000..",
      "..333333..",
      "..344443..",
      "..555555..",
      "..5....5..",
    ),
  },
  {
    id: "map_seller",
    name: { uk: "Каллісто", en: "Callisto" },
    title: { uk: "Картограф", en: "Map Seller" },
    icon: "🗺️",
    category: "merchant",
    metFlag: "met_map_seller",
    spritePath: "/icons/npcs/suspicious_merchant.png",
    // Feathered hat, spectacles, light skin, green coat
    portrait: px(
      [GREEN, SKIN_LIGHT, HAIR_BROWN, GOLD, DARK_GREEN, BLACK],
      //0123456789
      "...3333...",
      "..000000..",
      ".00000003.",
      ".11111111.",
      ".15111151.",
      ".11111111.",
      ".11211211.",
      "..111111..",
      "..444444..",
      "..400004..",
      "..444444..",
      "..4....4..",
    ),
  },
  {
    id: "fence",
    name: { uk: "Скеля", en: "Rocky" },
    title: { uk: "Скупник краденого", en: "Fence" },
    icon: "💰",
    category: "merchant",
    metFlag: "met_fence",
    spritePath: "/icons/npcs/thief.png",
    // Hood up, dark skin, sly grin, dark cloak
    portrait: px(
      [DARK_BROWN, SKIN_DARK, BROWN, GOLD, BLACK, GRAY],
      //0123456789
      "..000000..",
      ".00000000.",
      ".01111110.",
      ".01111110.",
      ".01141110.",
      ".01111110.",
      ".01211210.",
      "..011110..",
      "..000000..",
      "..020020..",
      "..000000..",
      "..0....0..",
    ),
  },
  {
    id: "exotic_trader",
    name: { uk: "Мей Лін", en: "Mei Lin" },
    title: { uk: "Торговець екзотикою", en: "Exotic Goods Trader" },
    icon: "🐚",
    category: "merchant",
    metFlag: "met_exotic_trader",
    spritePath: "/icons/npcs/gatherer.png",
    // Conical hat, olive skin, silk robe
    portrait: px(
      [GOLD, SKIN_OLIVE, HAIR_BLACK, RED, DARK_RED, BROWN],
      //0123456789
      "....00....",
      "...0000...",
      "..000000..",
      ".01111110.",
      ".11121111.",
      ".11111111.",
      ".11211211.",
      "..111111..",
      "..333333..",
      "..300003..",
      "..333333..",
      "..3....3..",
    ),
  },
  {
    id: "shipwright",
    name: { uk: "Олаф", en: "Olaf" },
    title: { uk: "Корабельний майстер", en: "Shipwright" },
    icon: "🔨",
    category: "merchant",
    metFlag: "met_shipwright",
    spritePath: "/icons/npcs/worker.png",
    // Flat cap, big beard, light skin, apron
    portrait: px(
      [BROWN, SKIN_LIGHT, HAIR_RED, WHITE, GRAY, DARK_BROWN],
      //0123456789
      "..........",
      "..000000..",
      ".00000000.",
      ".11211211.",
      ".11111111.",
      ".11111111.",
      ".12222221.",
      "..222222..",
      "..333333..",
      "..344443..",
      "..333333..",
      "..5....5..",
    ),
  },
  {
    id: "rum_merchant",
    name: { uk: "Джакомо", en: "Giacomo" },
    title: { uk: "Торговець ромом", en: "Rum Merchant" },
    icon: "🍹",
    category: "merchant",
    metFlag: "met_rum_merchant",
    spritePath: "/icons/npcs/villager_man.png",
    // Wide-brim hat, curly mustache, ruddy skin
    portrait: px(
      [DARK_BROWN, SKIN_LIGHT, HAIR_BLACK, RED, BROWN, GOLD],
      //0123456789
      "..000000..",
      ".00000000.",
      "0000000000",
      ".11111111.",
      ".11211211.",
      ".11111111.",
      ".12222211.",
      "..111111..",
      "..333333..",
      "..344443..",
      "..444444..",
      "..4....4..",
    ),
  },

  // =======================================================================
  // PIRATES (7)
  // =======================================================================
  {
    id: "rival_captain",
    name: { uk: "Кривий Джек", en: "Crooked Jack" },
    title: { uk: "Капітан-суперник", en: "Rival Captain" },
    icon: "🏴‍☠️",
    category: "pirate",
    metFlag: "met_rival_captain",
    spritePath: "/icons/npcs/pirate_captain.png",
    // Tricorn hat, eyepatch, scar, dark skin
    portrait: px(
      [BLACK, SKIN_DARK, RED, GOLD, HAIR_BLACK, GRAY],
      //0123456789
      "...0000...",
      "..000000..",
      ".00000000.",
      ".11111111.",
      ".10111211.",
      ".11111111.",
      ".11211211.",
      "..111111..",
      "..222222..",
      "..233332..",
      "..222222..",
      "..2....2..",
    ),
  },
  {
    id: "first_mate_bones",
    name: { uk: "Боунс", en: "Bones" },
    title: { uk: "Перший помічник", en: "First Mate" },
    icon: "💀",
    category: "pirate",
    metFlag: "met_bones",
    spritePath: "/icons/npcs/pirate_crew.png",
    // Bandana, thin face, pale skin, striped shirt
    portrait: px(
      [RED, SKIN_PALE, HAIR_BLACK, BLUE, WHITE, DARK_BLUE],
      //0123456789
      "..000000..",
      "..000000..",
      ".11111111.",
      ".11111111.",
      ".11211211.",
      ".11111111.",
      ".11121111.",
      "..111111..",
      "..343434..",
      "..434343..",
      "..343434..",
      "..3....3..",
    ),
  },
  {
    id: "pirate_queen",
    name: { uk: "Анна Бонні", en: "Anne Bonny" },
    title: { uk: "Піратська королева", en: "Pirate Queen" },
    icon: "👑",
    category: "pirate",
    metFlag: "met_pirate_queen",
    spritePath: "/icons/npcs/queen.png",
    // Red hair flowing, bandana, fierce expression, red coat
    portrait: px(
      [HAIR_RED, SKIN_LIGHT, RED, GOLD, BLACK, DARK_RED],
      //0123456789
      ".02222220.",
      ".02222220.",
      "0011111100",
      ".11111111.",
      ".11411411.",
      ".11111111.",
      ".11211211.",
      "..111111..",
      "..222222..",
      "..233332..",
      "..555555..",
      "..5....5..",
    ),
  },
  {
    id: "legendary_pirate",
    name: { uk: "Чорна Борода", en: "Blackbeard" },
    title: { uk: "Легендарний пірат", en: "Legendary Pirate" },
    icon: "🦜",
    category: "pirate",
    metFlag: "met_legendary_pirate",
    spritePath: "/icons/npcs/pirate_harpooner.png",
    // Huge hat with feather, massive black beard, menacing
    portrait: px(
      [BLACK, SKIN_MED, RED, GOLD, DARK_BROWN, HAIR_BLACK],
      //0123456789
      "..300000..",
      "..000000..",
      ".00000000.",
      ".11111111.",
      ".11211211.",
      ".15555551.",
      ".55555555.",
      "..555555..",
      "..222222..",
      "..233332..",
      "..444444..",
      "..4....4..",
    ),
  },
  {
    id: "retired_pirate",
    name: { uk: "Одноногий Сем", en: "Peg-Leg Sam" },
    title: { uk: "Старий пірат", en: "Retired Pirate" },
    icon: "🦿",
    category: "pirate",
    metFlag: "met_retired_pirate",
    spritePath: "/icons/npcs/old_man.png",
    // White hair, weathered, eye-patch, tattered clothes
    portrait: px(
      [HAIR_WHITE, SKIN_MED, GRAY, BROWN, BLACK, DARK_BROWN],
      //0123456789
      "..........",
      "..000000..",
      ".00000000.",
      ".11111111.",
      ".14111211.",
      ".11111111.",
      ".10000011.",
      "..111111..",
      "..222222..",
      "..255552..",
      "..222222..",
      "..2....2..",
    ),
  },
  {
    id: "smuggler",
    name: { uk: "Тінь", en: "Shadow" },
    title: { uk: "Контрабандист", en: "Smuggler" },
    icon: "🌑",
    category: "pirate",
    metFlag: "met_smuggler",
    spritePath: "/icons/npcs/hunter.png",
    // Dark hood, only eyes visible, olive skin
    portrait: px(
      [BLACK, SKIN_OLIVE, DARK_BROWN, GRAY, NAVY, BROWN],
      //0123456789
      "..000000..",
      ".00000000.",
      ".00000000.",
      ".00110000.",
      ".01121100.",
      ".00000000.",
      ".00000000.",
      "..000000..",
      "..000000..",
      "..044440..",
      "..000000..",
      "..0....0..",
    ),
  },
  {
    id: "mutineer",
    name: { uk: "Різак Морган", en: "Razor Morgan" },
    title: { uk: "Бунтівник", en: "Mutineer" },
    icon: "🗡️",
    category: "pirate",
    metFlag: "met_mutineer",
    spritePath: "/icons/npcs/pirate_gunner.png",
    // Scarred, bandana, angry brows, pale skin
    portrait: px(
      [RED, SKIN_PALE, BLACK, BROWN, DARK_RED, GRAY],
      //0123456789
      "..000000..",
      "..000000..",
      ".11111111.",
      ".22111122.",
      ".11211211.",
      ".11111111.",
      ".11122111.",
      "..111111..",
      "..333333..",
      "..344443..",
      "..333333..",
      "..5....5..",
    ),
  },

  // =======================================================================
  // OFFICIALS (4)
  // =======================================================================
  {
    id: "governor",
    name: { uk: "Лорд Вінстон", en: "Lord Winston" },
    title: { uk: "Губернатор", en: "Governor" },
    icon: "🎩",
    category: "official",
    metFlag: "met_governor",
    spritePath: "/icons/npcs/noble_man.png",
    // Powdered wig, pale skin, fancy blue coat with gold trim
    portrait: px(
      [HAIR_WHITE, SKIN_PALE, BLUE, GOLD, DARK_BLUE, RED],
      //0123456789
      "..000000..",
      ".00000000.",
      ".00000000.",
      ".11111111.",
      ".11211211.",
      ".11111111.",
      ".11211211.",
      "..111111..",
      "..232323..",
      "..233332..",
      "..444444..",
      "..4....4..",
    ),
  },
  {
    id: "navy_captain",
    name: { uk: "Капітан Гейл", en: "Captain Gale" },
    title: { uk: "Капітан флоту", en: "Navy Captain" },
    icon: "⚓",
    category: "official",
    metFlag: "met_navy_captain",
    spritePath: "/icons/npcs/pirate_captain.png",
    // Bicorn hat with gold badge, stern face, navy uniform
    portrait: px(
      [NAVY, SKIN_LIGHT, GOLD, BLUE, WHITE, DARK_BLUE],
      //0123456789
      "...0000...",
      "..020020..",
      ".00000000.",
      ".11111111.",
      ".11211211.",
      ".11111111.",
      ".11211211.",
      "..111111..",
      "..333333..",
      "..324423..",
      "..555555..",
      "..5....5..",
    ),
  },
  {
    id: "customs_officer",
    name: { uk: "Інспектор Крейн", en: "Inspector Crane" },
    title: { uk: "Митний інспектор", en: "Customs Officer" },
    icon: "📋",
    category: "official",
    metFlag: "met_customs_officer",
    spritePath: "/icons/npcs/miner.png",
    // Small hat, spectacles, thin mustache, gray uniform
    portrait: px(
      [GRAY, SKIN_LIGHT, BLACK, HAIR_BROWN, WHITE, DARK_BROWN],
      //0123456789
      "..........",
      "...0000...",
      "..000000..",
      ".11111111.",
      ".12111211.",
      ".11111111.",
      ".11333111.",
      "..111111..",
      "..000000..",
      "..044440..",
      "..000000..",
      "..5....5..",
    ),
  },
  {
    id: "judge",
    name: { uk: "Суддя Блекстоун", en: "Judge Blackstone" },
    title: { uk: "Суддя", en: "Judge" },
    icon: "⚖️",
    category: "official",
    metFlag: "met_judge",
    spritePath: "/icons/npcs/noble_man.png",
    // Long white wig, stern expression, black robes
    portrait: px(
      [HAIR_WHITE, SKIN_PALE, BLACK, RED, DARK_BROWN, GRAY],
      //0123456789
      ".00000000.",
      ".00000000.",
      ".01111110.",
      ".01111110.",
      ".01121110.",
      ".01111110.",
      ".01121110.",
      "..011110..",
      "..222222..",
      "..233332..",
      "..222222..",
      "..2....2..",
    ),
  },

  // =======================================================================
  // MYSTICS (5)
  // =======================================================================
  {
    id: "voodoo_priestess",
    name: { uk: "Мама Залія", en: "Mama Zalia" },
    title: { uk: "Жриця вуду", en: "Voodoo Priestess" },
    icon: "🔮",
    category: "mystic",
    metFlag: "met_voodoo_priestess",
    spritePath: "/icons/npcs/nun.png",
    // Head wrap with beads, dark skin, face paint, purple cloth
    portrait: px(
      [PURPLE, SKIN_DARK, GOLD, WHITE, RED, DARK_BROWN],
      //0123456789
      "..020200..",
      ".00020000.",
      ".00000020.",
      ".11311111.",
      ".11211211.",
      ".11111111.",
      ".13111131.",
      "..111111..",
      "..000000..",
      "..022220..",
      "..000000..",
      "..0....0..",
    ),
  },
  {
    id: "fortune_teller",
    name: { uk: "Зірка", en: "Estrella" },
    title: { uk: "Ворожка", en: "Fortune Teller" },
    icon: "⭐",
    category: "mystic",
    metFlag: "met_fortune_teller",
    spritePath: "/icons/npcs/princess.png",
    // Headscarf with stars, olive skin, hoop earrings
    portrait: px(
      [PURPLE, SKIN_OLIVE, GOLD, DARK_RED, BLACK, TEAL],
      //0123456789
      "..020200..",
      ".00200020.",
      ".00000000.",
      ".11111111.",
      ".11211211.",
      ".21111112.",
      ".11211211.",
      "..111111..",
      "..555555..",
      "..500005..",
      "..333333..",
      "..3....3..",
    ),
  },
  {
    id: "cursed_sailor",
    name: { uk: "Йона", en: "Jonah" },
    title: { uk: "Проклятий моряк", en: "Cursed Sailor" },
    icon: "☠️",
    category: "mystic",
    metFlag: "met_cursed_sailor",
    spritePath: "/icons/npcs/grave_digger.png",
    // Gaunt, green-tinged skin, hollow eyes, tattered clothes
    portrait: px(
      [DARK_GREEN, "#7d9a6b", BLACK, GRAY, BROWN, DARK_BROWN],
      //0123456789
      "..........",
      "..333333..",
      ".11111111.",
      ".11111111.",
      ".12111211.",
      ".11111111.",
      ".11222111.",
      "..111111..",
      "..434343..",
      "..344443..",
      "..555555..",
      "..5....5..",
    ),
  },
  {
    id: "sea_witch",
    name: { uk: "Кораліна", en: "Coraline" },
    title: { uk: "Морська відьма", en: "Sea Witch" },
    icon: "🐙",
    category: "mystic",
    metFlag: "met_sea_witch",
    spritePath: "/icons/npcs/noble_woman.png",
    // Wild dark hair, pale green skin, seaweed accessories
    portrait: px(
      [DARK_GREEN, "#a8d5ba", BLACK, TEAL, PURPLE, HAIR_BLACK],
      //0123456789
      "5..5555.55",
      ".55555555.",
      ".55555555.",
      ".11111111.",
      ".11211211.",
      ".11111111.",
      ".11211211.",
      "..111111..",
      "..333333..",
      "..344443..",
      "..000000..",
      "..0....0..",
    ),
  },
  {
    id: "hermit_monk",
    name: { uk: "Брат Тихон", en: "Brother Tikhon" },
    title: { uk: "Монах-відлюдник", en: "Hermit Monk" },
    icon: "📿",
    category: "mystic",
    metFlag: "met_hermit_monk",
    spritePath: "/icons/npcs/old_man.png",
    // Brown hood, bald, light skin, wooden cross
    portrait: px(
      [BROWN, SKIN_LIGHT, DARK_BROWN, GOLD, BLACK, HAIR_GRAY],
      //0123456789
      "..000000..",
      ".00000000.",
      ".01111110.",
      ".01111110.",
      ".01121110.",
      ".01111110.",
      ".01121110.",
      "..011110..",
      "..000000..",
      "..030300..",
      "..222222..",
      "..2....2..",
    ),
  },

  // =======================================================================
  // CREW (5)
  // =======================================================================
  {
    id: "surgeon",
    name: { uk: "Док Марлоу", en: "Doc Marlowe" },
    title: { uk: "Корабельний лікар", en: "Ship Surgeon" },
    icon: "💉",
    category: "crew",
    metFlag: "met_surgeon",
    spritePath: "/icons/npcs/merchant.png",
    // Spectacles, receding hair, white apron with red cross
    portrait: px(
      [HAIR_GRAY, SKIN_LIGHT, BLACK, WHITE, RED, BROWN],
      //0123456789
      "..........",
      "..000000..",
      ".00000000.",
      ".11111111.",
      ".12111211.",
      ".11111111.",
      ".11211211.",
      "..111111..",
      "..333333..",
      "..343433..",
      "..334333..",
      "..5....5..",
    ),
  },
  {
    id: "navigator",
    name: { uk: "Зірковий Томас", en: "Star Thomas" },
    title: { uk: "Штурман", en: "Navigator" },
    icon: "🧭",
    category: "crew",
    metFlag: "met_navigator",
    spritePath: "/icons/npcs/pirate_crew.png",
    // Bandana, tanned skin, compass rose tattoo
    portrait: px(
      [BLUE, SKIN_MED, HAIR_BLACK, GOLD, DARK_BLUE, WHITE],
      //0123456789
      "..000000..",
      "..000000..",
      ".11111111.",
      ".11111111.",
      ".11211211.",
      ".11111111.",
      ".11211211.",
      "..111111..",
      "..444444..",
      "..434343..",
      "..444444..",
      "..4....4..",
    ),
  },
  {
    id: "cook",
    name: { uk: "Товстий Педро", en: "Fat Pedro" },
    title: { uk: "Кок", en: "Ship Cook" },
    icon: "🍖",
    category: "crew",
    metFlag: "met_cook",
    spritePath: "/icons/npcs/peasant.png",
    // Chef hat, round face, dark skin, apron
    portrait: px(
      [WHITE, SKIN_DARK, HAIR_BLACK, BROWN, GRAY, RED],
      //0123456789
      "..000000..",
      "..000000..",
      ".00000000.",
      ".11111111.",
      ".11211211.",
      ".11111111.",
      ".12222211.",
      "..111111..",
      "..000000..",
      "..033330..",
      "..333333..",
      "..3....3..",
    ),
  },
  {
    id: "gunner",
    name: { uk: "Грім", en: "Thunder" },
    title: { uk: "Канонір", en: "Master Gunner" },
    icon: "💣",
    category: "crew",
    metFlag: "met_gunner",
    spritePath: "/icons/npcs/pirate_gunner.png",
    // Bandana, soot-stained face, muscular, dark vest
    portrait: px(
      [RED, SKIN_MED, BLACK, DARK_BROWN, GRAY, BROWN],
      //0123456789
      "..........",
      "..000000..",
      "..000000..",
      ".11111111.",
      ".11211211.",
      ".11111111.",
      ".11211211.",
      "..111111..",
      "..333333..",
      "..344443..",
      "..222222..",
      "..2....2..",
    ),
  },
  {
    id: "bosun",
    name: { uk: "Вузол", en: "Knot" },
    title: { uk: "Боцман", en: "Bosun" },
    icon: "⛵",
    category: "crew",
    metFlag: "met_bosun",
    spritePath: "/icons/npcs/lumberjack.png",
    // Flat cap, weathered face, rope coiled, striped shirt
    portrait: px(
      [BROWN, SKIN_MED, HAIR_BLACK, BLUE, WHITE, DARK_BROWN],
      //0123456789
      "..........",
      "..000000..",
      ".00000000.",
      ".11111111.",
      ".11211211.",
      ".11111111.",
      ".12222211.",
      "..111111..",
      "..343434..",
      "..434343..",
      "..555555..",
      "..5....5..",
    ),
  },

  // =======================================================================
  // CIVILIANS (4)
  // =======================================================================
  {
    id: "fisherman",
    name: { uk: "Старий Хорхе", en: "Old Jorge" },
    title: { uk: "Рибалка", en: "Fisherman" },
    icon: "🎣",
    category: "civilian",
    metFlag: "met_fisherman",
    spritePath: "/icons/npcs/old_man.png",
    // Straw hat, tanned, simple clothes, fishing line
    portrait: px(
      [GOLD, SKIN_MED, HAIR_WHITE, BROWN, GRAY, DARK_BROWN],
      //0123456789
      "..000000..",
      ".00000000.",
      "0000000000",
      ".11111111.",
      ".11211211.",
      ".11111111.",
      ".12222211.",
      "..111111..",
      "..333333..",
      "..344443..",
      "..555555..",
      "..5....5..",
    ),
  },
  {
    id: "plantation_owner",
    name: { uk: "Дон Алонсо", en: "Don Alonso" },
    title: { uk: "Плантатор", en: "Plantation Owner" },
    icon: "🌿",
    category: "civilian",
    metFlag: "met_plantation_owner",
    spritePath: "/icons/npcs/noble_man.png",
    // Wide hat, thin mustache, white suit
    portrait: px(
      [WHITE, SKIN_LIGHT, HAIR_BLACK, GOLD, BROWN, DARK_BROWN],
      //0123456789
      "..000000..",
      ".00000000.",
      "0000000000",
      ".11111111.",
      ".11211211.",
      ".11111111.",
      ".11222111.",
      "..111111..",
      "..000000..",
      "..033330..",
      "..000000..",
      "..4....4..",
    ),
  },
  {
    id: "priest",
    name: { uk: "Отець Себастьян", en: "Father Sebastian" },
    title: { uk: "Священик", en: "Priest" },
    icon: "✝️",
    category: "civilian",
    metFlag: "met_priest",
    spritePath: "/icons/npcs/nun.png",
    // Black hat, collar, pale skin, black robes
    portrait: px(
      [BLACK, SKIN_PALE, WHITE, GOLD, DARK_BROWN, GRAY],
      //0123456789
      "...0000...",
      "..000000..",
      ".00000000.",
      ".11111111.",
      ".11211211.",
      ".11111111.",
      ".11211211.",
      "..111111..",
      "..002200..",
      "..000000..",
      "..000000..",
      "..0....0..",
    ),
  },
  {
    id: "tavern_keeper",
    name: { uk: "Рубі", en: "Ruby" },
    title: { uk: "Власниця таверни", en: "Tavern Keeper" },
    icon: "🍺",
    category: "civilian",
    metFlag: "met_tavern_keeper",
    spritePath: "/icons/npcs/villager_woman.png",
    // Tied-up hair, earrings, warm expression, apron
    portrait: px(
      [HAIR_BROWN, SKIN_LIGHT, RED, GOLD, WHITE, BROWN],
      //0123456789
      "..000000..",
      ".00000000.",
      ".00000000.",
      ".11111111.",
      ".31111113.",
      ".11111111.",
      ".11211211.",
      "..111111..",
      "..444444..",
      "..422224..",
      "..555555..",
      "..5....5..",
    ),
  },

  // =======================================================================
  // SUPERNATURAL (4)
  // =======================================================================
  {
    id: "ghost_captain",
    name: { uk: "Капітан Морлок", en: "Captain Morlock" },
    title: { uk: "Привид-капітан", en: "Ghost Captain" },
    icon: "👻",
    category: "supernatural",
    metFlag: "met_ghost_captain",
    spritePath: "/icons/npcs/pirate_captain.png",
    // Translucent blue-white, tricorn hat outline, hollow eyes
    portrait: px(
      [GHOST_BLUE, GHOST_WHITE, GHOST_GLOW, BLACK, NAVY, WHITE],
      //0123456789
      "...0000...",
      "..000000..",
      ".00000000.",
      ".22222222.",
      ".23222322.",
      ".22222222.",
      ".22122122.",
      "..222222..",
      "..111111..",
      "..100001..",
      "..111111..",
      "..1....1..",
    ),
  },
  {
    id: "siren",
    name: { uk: "Ніреіда", en: "Nereida" },
    title: { uk: "Сирена", en: "Siren" },
    icon: "🧜‍♀️",
    category: "supernatural",
    metFlag: "met_siren",
    spritePath: "/icons/npcs/princess.png",
    // Long flowing hair (teal/green), pale luminous skin, fish scales
    portrait: px(
      [TEAL, "#d4efdf", CYAN, DARK_GREEN, PURPLE, GOLD],
      //0123456789
      ".00000000.",
      "0000000000",
      "0011111100",
      ".11111111.",
      ".11511511.",
      ".11111111.",
      ".11211211.",
      "..111111..",
      "..020202..",
      "..202020..",
      "..333333..",
      "..3....3..",
    ),
  },
  {
    id: "sea_god",
    name: { uk: "Дейві Джонс", en: "Davy Jones" },
    title: { uk: "Морський бог", en: "Sea God" },
    icon: "🌊",
    category: "supernatural",
    metFlag: "met_sea_god",
    spritePath: "/icons/npcs/grave_digger.png",
    // Crown of coral, green skin, tentacle beard, glowing eyes
    portrait: px(
      [DARK_GREEN, "#5d8a6b", GOLD, TEAL, CYAN, PURPLE],
      //0123456789
      ".22.22.22.",
      "..222222..",
      ".11111111.",
      ".11111111.",
      ".14111411.",
      ".11111111.",
      ".13333311.",
      "..333333..",
      "..333333..",
      "..300003..",
      "..555555..",
      "..5....5..",
    ),
  },
  {
    id: "skeleton_crew",
    name: { uk: "Кістяний Екіпаж", en: "The Bone Crew" },
    title: { uk: "Скелети-моряки", en: "Skeleton Sailors" },
    icon: "💀",
    category: "supernatural",
    metFlag: "met_skeleton_crew",
    spritePath: "/icons/npcs/pirate_crew.png",
    // Bone-white skull, dark eye sockets, tattered naval hat
    portrait: px(
      [DARK_BROWN, WHITE, BLACK, GRAY, NAVY, HAIR_WHITE],
      //0123456789
      "..000000..",
      "..000000..",
      ".11111111.",
      ".11111111.",
      ".12111211.",
      ".11111111.",
      ".12222211.",
      "..111111..",
      "..333333..",
      "..311113..",
      "..444444..",
      "..4....4..",
    ),
  },
];

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const NPCS: Record<string, NPCDef> = {};
for (const npc of npcList) {
  NPCS[npc.id] = npc;
}

export function getNPC(id: string): NPCDef | undefined {
  return NPCS[id];
}

// ---------------------------------------------------------------------------
// Canvas portrait renderer
// ---------------------------------------------------------------------------

/**
 * Draws an NPC pixel portrait on a canvas context.
 * Each pixel in the portrait grid becomes a `scale x scale` block on screen.
 * Transparent pixels (-1) are skipped.
 */
export function drawNPCPortrait(
  ctx: CanvasRenderingContext2D,
  portrait: NPCPortrait,
  x: number,
  y: number,
  scale: number,
): void {
  const { palette, pixels } = portrait;

  for (let row = 0; row < pixels.length; row++) {
    const cols = pixels[row];
    for (let col = 0; col < cols.length; col++) {
      const idx = cols[col];
      if (idx < 0) continue; // transparent
      ctx.fillStyle = palette[idx];
      ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
    }
  }
}
