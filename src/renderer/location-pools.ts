import type { TerrainType } from "./map-data";

// ── Location classification ──

export type LocationCategory =
  | "port"
  | "settlement"
  | "island_inhabited"
  | "island_wild"
  | "island_phantom"
  | "underwater"
  | "cave"
  | "wreck"
  | "mysterious"
  | "reef"
  | "landmark";

export interface LocationTemplate {
  name: Record<"uk" | "en", string>;
  icon: string;
  terrain: TerrainType;
  weight: number;
  category: LocationCategory;
  description: Record<"uk" | "en", string>;
}

// ══════════════════════════════════════════════════════════════
// PORTS — Real Caribbean historical ports (22 locations)
// ══════════════════════════════════════════════════════════════

export const PORT_POOL: LocationTemplate[] = [
  {
    name: { uk: "Тортуга", en: "Tortuga" },
    icon: "🍺",
    terrain: "port",
    weight: 3,
    category: "port",
    description: { uk: "Піратська столиця, де ром тече рікою", en: "Pirate capital where rum flows like a river" },
  },
  {
    name: { uk: "Гавана", en: "Havana" },
    icon: "🏛️",
    terrain: "port",
    weight: 2.5,
    category: "port",
    description: { uk: "Іспанська перлина з укріпленою гаванню", en: "Spanish jewel with a fortified harbor" },
  },
  {
    name: { uk: "Нассау", en: "Nassau" },
    icon: "🏴",
    terrain: "port",
    weight: 2.5,
    category: "port",
    description: { uk: "Піратська республіка під чорним прапором", en: "Pirate republic under the black flag" },
  },
  {
    name: { uk: "Порт-Роял", en: "Port Royal" },
    icon: "⚓",
    terrain: "port",
    weight: 2,
    category: "port",
    description: { uk: "Найрозпусніше місто на землі", en: "The wickedest city on earth" },
  },
  {
    name: { uk: "Картахена", en: "Cartagena" },
    icon: "🏰",
    terrain: "port",
    weight: 2,
    category: "port",
    description: { uk: "Неприступна фортеця іспанського золота", en: "Impregnable fortress of Spanish gold" },
  },
  {
    name: { uk: "Маракайбо", en: "Maracaibo" },
    icon: "🏘️",
    terrain: "port",
    weight: 1.5,
    category: "port",
    description: { uk: "Озерне місто, улюблена ціль Моргана", en: "Lake city, Morgan's favorite target" },
  },
  {
    name: { uk: "Санто-Домінго", en: "Santo Domingo" },
    icon: "⛪",
    terrain: "port",
    weight: 1.5,
    category: "port",
    description: { uk: "Перше європейське місто Нового Світу", en: "First European city of the New World" },
  },
  {
    name: { uk: "Кінгстон", en: "Kingston" },
    icon: "🏗️",
    terrain: "port",
    weight: 1.5,
    category: "port",
    description: { uk: "Торговий порт, що зростає на руїнах Роялу", en: "Trading port rising from Port Royal's ruins" },
  },
  {
    name: { uk: "Барбадос", en: "Barbados" },
    icon: "🌴",
    terrain: "port",
    weight: 1.5,
    category: "port",
    description: { uk: "Англійський форпост цукрових плантацій", en: "English outpost of sugar plantations" },
  },
  {
    name: { uk: "Тринідад", en: "Trinidad" },
    icon: "🛖",
    terrain: "port",
    weight: 1,
    category: "port",
    description: { uk: "Острів трьох вершин на краю світу", en: "Island of three peaks at the edge of the world" },
  },
  {
    name: { uk: "Сент-Кіттс", en: "St. Kitts" },
    icon: "🏝️",
    terrain: "port",
    weight: 1,
    category: "port",
    description: { uk: "Спільна колонія ворогуючих корон", en: "Shared colony of rival crowns" },
  },
  {
    name: { uk: "Кюрасао", en: "Curacao" },
    icon: "🎨",
    terrain: "port",
    weight: 1,
    category: "port",
    description: { uk: "Голландський острів кольорових фасадів", en: "Dutch island of colorful facades" },
  },
  {
    name: { uk: "Веракрус", en: "Veracruz" },
    icon: "🪙",
    terrain: "port",
    weight: 2,
    category: "port",
    description: { uk: "Ворота ацтекського золота до Іспанії", en: "Gateway of Aztec gold to Spain" },
  },
  {
    name: { uk: "Портобело", en: "Portobelo" },
    icon: "📦",
    terrain: "port",
    weight: 1.5,
    category: "port",
    description: { uk: "Торговий ярмарок срібла Нового Світу", en: "Silver fair of the New World" },
  },
  {
    name: { uk: "Сан-Хуан", en: "San Juan" },
    icon: "🗼",
    terrain: "port",
    weight: 1.5,
    category: "port",
    description: { uk: "Фортеця Ель-Морро стереже гавань", en: "El Morro fortress guards the harbor" },
  },
  {
    name: { uk: "Мартініка", en: "Martinique" },
    icon: "🌺",
    terrain: "port",
    weight: 1,
    category: "port",
    description: { uk: "Французький острів рому та вулканів", en: "French island of rum and volcanoes" },
  },
  {
    name: { uk: "Бермуди", en: "Bermuda" },
    icon: "🔺",
    terrain: "port",
    weight: 1,
    category: "port",
    description: { uk: "Самотній порт серед небезпечних вод", en: "Lonely port amid treacherous waters" },
  },
  {
    name: { uk: "Кампече", en: "Campeche" },
    icon: "🧱",
    terrain: "port",
    weight: 1,
    category: "port",
    description: { uk: "Укріплене місто на узбережжі Юкатану", en: "Fortified city on the Yucatan coast" },
  },
  {
    name: { uk: "Номбре-де-Діос", en: "Nombre de Dios" },
    icon: "✝️",
    terrain: "port",
    weight: 1,
    category: "port",
    description: { uk: "Занепале місто на Золотому шляху", en: "Decaying town on the Gold Road" },
  },
  {
    name: { uk: "Сантьяго-де-Куба", en: "Santiago de Cuba" },
    icon: "🏔️",
    terrain: "port",
    weight: 1.5,
    category: "port",
    description: { uk: "Гірський порт з мідними шахтами", en: "Mountain port with copper mines" },
  },
  {
    name: { uk: "Бріджтаун", en: "Bridgetown" },
    icon: "🌉",
    terrain: "port",
    weight: 1,
    category: "port",
    description: { uk: "Головний порт Барбадосу на Карлайл-бей", en: "Main port of Barbados on Carlisle Bay" },
  },
  {
    name: { uk: "Чарлстаун", en: "Charlestown" },
    icon: "🏠",
    terrain: "port",
    weight: 1,
    category: "port",
    description: { uk: "Тихий порт Невісу з гарячими джерелами", en: "Quiet Nevis port with hot springs" },
  },
];

// ══════════════════════════════════════════════════════════════
// SETTLEMENTS — Smaller inhabited places (12 locations)
// ══════════════════════════════════════════════════════════════

export const SETTLEMENT_POOL: LocationTemplate[] = [
  {
    name: { uk: "Рибальське Селище", en: "Fisher's Hamlet" },
    icon: "🎣",
    terrain: "shallow",
    weight: 2,
    category: "settlement",
    description: { uk: "Мирне село, де пахне сіллю та димом", en: "Peaceful village smelling of salt and smoke" },
  },
  {
    name: { uk: "Плантація Віндзор", en: "Windsor Plantation" },
    icon: "🌾",
    terrain: "land",
    weight: 1.5,
    category: "settlement",
    description: { uk: "Цукрова плантація з похмурою таємницею", en: "Sugar plantation with a grim secret" },
  },
  {
    name: { uk: "Місія Сан-Мігель", en: "San Miguel Mission" },
    icon: "🔔",
    terrain: "land",
    weight: 1.5,
    category: "settlement",
    description: { uk: "Іспанська місія серед тропіків", en: "Spanish mission amid the tropics" },
  },
  {
    name: { uk: "Контрабандна Бухта", en: "Smuggler's Cove" },
    icon: "🤫",
    terrain: "shallow",
    weight: 2,
    category: "settlement",
    description: { uk: "Прихована затока, де не ставлять зайвих питань", en: "Hidden cove where no questions are asked" },
  },
  {
    name: { uk: "Піратський Табір", en: "Pirate Camp" },
    icon: "🏕️",
    terrain: "land",
    weight: 2,
    category: "settlement",
    description: { uk: "Тимчасовий притулок відчайдухів", en: "Temporary refuge for desperados" },
  },
  {
    name: { uk: "Хатина Знахарки", en: "Healer's Hut" },
    icon: "🧪",
    terrain: "land",
    weight: 1,
    category: "settlement",
    description: { uk: "Самотня оселя з дивним зіллям", en: "Lonely dwelling with strange potions" },
  },
  {
    name: { uk: "Каренаж", en: "Careenage" },
    icon: "🔨",
    terrain: "shallow",
    weight: 1.5,
    category: "settlement",
    description: { uk: "Берег, де пірати латають свої судна", en: "Shore where pirates patch their ships" },
  },
  {
    name: { uk: "Торгова Факторія", en: "Trading Post" },
    icon: "🏪",
    terrain: "land",
    weight: 1.5,
    category: "settlement",
    description: { uk: "Невеличкий ринок рідкісних товарів", en: "Small market of rare goods" },
  },
  {
    name: { uk: "Форт Святого Якова", en: "Fort St. James" },
    icon: "🚩",
    terrain: "land",
    weight: 1,
    category: "settlement",
    description: { uk: "Напівзруйнований гарнізон біля узбережжя", en: "Half-ruined garrison near the coast" },
  },
  {
    name: { uk: "Село Маронів", en: "Maroon Village" },
    icon: "🪘",
    terrain: "land",
    weight: 1.5,
    category: "settlement",
    description: { uk: "Вільне поселення втікачів у горах", en: "Free settlement of runaways in the hills" },
  },
  {
    name: { uk: "Табірна Коса", en: "Camp Spit" },
    icon: "🔥",
    terrain: "shallow",
    weight: 1,
    category: "settlement",
    description: { uk: "Піщана коса з вогнищами та наметами", en: "Sandy spit with bonfires and tents" },
  },
  {
    name: { uk: "Ворожий Форпост", en: "Hostile Outpost" },
    icon: "⚔️",
    terrain: "land",
    weight: 1,
    category: "settlement",
    description: { uk: "Укріплений пост з недружнім гарнізоном", en: "Fortified post with an unfriendly garrison" },
  },
];

// ══════════════════════════════════════════════════════════════
// INHABITED ISLANDS — Named islands with people (12 locations)
// ══════════════════════════════════════════════════════════════

export const INHABITED_ISLAND_POOL: LocationTemplate[] = [
  {
    name: { uk: "Затока Плантаторів", en: "Planter's Bay" },
    icon: "🍬",
    terrain: "land",
    weight: 1.5,
    category: "island_inhabited",
    description: { uk: "Цукрові поля до самого горизонту", en: "Sugar fields stretching to the horizon" },
  },
  {
    name: { uk: "Острів Отця Рафаеля", en: "Father Rafael's Isle" },
    icon: "📿",
    terrain: "land",
    weight: 1,
    category: "island_inhabited",
    description: { uk: "Монастир на скелі серед бурхливого моря", en: "Monastery on a rock amid rough seas" },
  },
  {
    name: { uk: "Порт Надії", en: "Port of Hope" },
    icon: "🕊️",
    terrain: "land",
    weight: 1.5,
    category: "island_inhabited",
    description: { uk: "Притулок для тих, хто тікає від війни", en: "Refuge for those fleeing war" },
  },
  {
    name: { uk: "Індіанська Затока", en: "Taino Cove" },
    icon: "🪶",
    terrain: "shallow",
    weight: 1,
    category: "island_inhabited",
    description: { uk: "Останнє поселення корінного народу", en: "Last settlement of the native people" },
  },
  {
    name: { uk: "Острів Губернатора", en: "Governor's Isle" },
    icon: "👑",
    terrain: "land",
    weight: 1.5,
    category: "island_inhabited",
    description: { uk: "Розкішна резиденція серед бідності", en: "Lavish residence amid poverty" },
  },
  {
    name: { uk: "Рибна Скеля", en: "Fishbone Rock" },
    icon: "🐟",
    terrain: "land",
    weight: 1,
    category: "island_inhabited",
    description: { uk: "Острівець рибалок з кістяними тотемами", en: "Fisher's islet with bone totems" },
  },
  {
    name: { uk: "Тютюновий Острів", en: "Tobacco Isle" },
    icon: "🍂",
    terrain: "land",
    weight: 1,
    category: "island_inhabited",
    description: { uk: "Плантація з ароматним димом на вітрі", en: "Plantation with fragrant smoke on the wind" },
  },
  {
    name: { uk: "Фортеця Капітана", en: "Captain's Fortress" },
    icon: "🗡️",
    terrain: "land",
    weight: 1.5,
    category: "island_inhabited",
    description: { uk: "Відставний пірат перетворив острів на фортецю", en: "Retired pirate turned an island into a fortress" },
  },
  {
    name: { uk: "Острів Гамаків", en: "Hammock Island" },
    icon: "🛌",
    terrain: "land",
    weight: 1,
    category: "island_inhabited",
    description: { uk: "Ледаче поселення, де час зупинився", en: "Lazy settlement where time stands still" },
  },
  {
    name: { uk: "Причал Китобоїв", en: "Whaler's Dock" },
    icon: "🐳",
    terrain: "shallow",
    weight: 1,
    category: "island_inhabited",
    description: { uk: "Засалений причал з запахом ворвані", en: "Greasy dock reeking of blubber" },
  },
  {
    name: { uk: "Острів Ковалів", en: "Blacksmith Isle" },
    icon: "🔥",
    terrain: "land",
    weight: 1,
    category: "island_inhabited",
    description: { uk: "Кузня, що кує найкращі клинки Карибів", en: "Forge that crafts the finest blades of the Caribbean" },
  },
  {
    name: { uk: "Острів Каторжників", en: "Convict Island" },
    icon: "⛓️",
    terrain: "land",
    weight: 1,
    category: "island_inhabited",
    description: { uk: "Колишня в'язниця, нині вільна комуна", en: "Former prison, now a free commune" },
  },
];

// ══════════════════════════════════════════════════════════════
// WILD ISLANDS — Uninhabited natural islands (16 locations)
// ══════════════════════════════════════════════════════════════

export const WILD_ISLAND_POOL: LocationTemplate[] = [
  {
    name: { uk: "Острів Мавп", en: "Monkey Island" },
    icon: "🐒",
    terrain: "land",
    weight: 2,
    category: "island_wild",
    description: { uk: "Крики мавп лунають з кожного дерева", en: "Monkey cries echo from every tree" },
  },
  {
    name: { uk: "Вулканічний Острів", en: "Volcano Isle" },
    icon: "🌋",
    terrain: "land",
    weight: 1.5,
    category: "island_wild",
    description: { uk: "Земля тремтить, а небо червоніє", en: "The ground trembles and the sky glows red" },
  },
  {
    name: { uk: "Рум'яний Острів", en: "Rum Island" },
    icon: "🥃",
    terrain: "land",
    weight: 1.5,
    category: "island_wild",
    description: { uk: "Закинуті діжки рому серед пальм", en: "Abandoned rum barrels among palm trees" },
  },
  {
    name: { uk: "Штормовий Пік", en: "Storm Peak" },
    icon: "⛰️",
    terrain: "land",
    weight: 1,
    category: "island_wild",
    description: { uk: "Вершина, що притягує блискавки", en: "A peak that attracts lightning" },
  },
  {
    name: { uk: "Чорний Пляж", en: "Black Beach" },
    icon: "🖤",
    terrain: "land",
    weight: 1,
    category: "island_wild",
    description: { uk: "Вулканічний пісок чорний як ніч", en: "Volcanic sand as black as night" },
  },
  {
    name: { uk: "Крокодилячий Острів", en: "Crocodile Island" },
    icon: "🐊",
    terrain: "shallow",
    weight: 1.5,
    category: "island_wild",
    description: { uk: "Мангри кишать голодними хижаками", en: "Mangroves teeming with hungry predators" },
  },
  {
    name: { uk: "Папужина Затока", en: "Parrot Bay" },
    icon: "🦜",
    terrain: "land",
    weight: 1.5,
    category: "island_wild",
    description: { uk: "Тисячі папуг створюють веселковий хаос", en: "Thousands of parrots create a rainbow chaos" },
  },
  {
    name: { uk: "Черепаший Берег", en: "Turtle Beach" },
    icon: "🐢",
    terrain: "shallow",
    weight: 1.5,
    category: "island_wild",
    description: { uk: "Гігантські черепахи виходять на пісок", en: "Giant turtles come ashore on the sand" },
  },
  {
    name: { uk: "Кораловий Атол", en: "Coral Atoll" },
    icon: "🪸",
    terrain: "shallow",
    weight: 1,
    category: "island_wild",
    description: { uk: "Кільце коралів навколо лагуни бірюзової води", en: "Ring of coral around a turquoise lagoon" },
  },
  {
    name: { uk: "Забута Затока", en: "Forgotten Bay" },
    icon: "🏖️",
    terrain: "shallow",
    weight: 1.5,
    category: "island_wild",
    description: { uk: "Затока, яку не знайти на жодній карті", en: "A bay found on no map" },
  },
  {
    name: { uk: "Мангровий Лабіринт", en: "Mangrove Maze" },
    icon: "🌿",
    terrain: "shallow",
    weight: 1,
    category: "island_wild",
    description: { uk: "Заплутані корені, де легко загубитися", en: "Tangled roots where it is easy to get lost" },
  },
  {
    name: { uk: "Острів Ігуан", en: "Iguana Island" },
    icon: "🦎",
    terrain: "land",
    weight: 1,
    category: "island_wild",
    description: { uk: "Древні ящірки гріються на кожному камені", en: "Ancient lizards bask on every rock" },
  },
  {
    name: { uk: "Кокосова Мілина", en: "Coconut Shoal" },
    icon: "🥥",
    terrain: "shallow",
    weight: 1,
    category: "island_wild",
    description: { uk: "Низький острівець, вкритий пальмами", en: "Low islet covered with palm trees" },
  },
  {
    name: { uk: "Пеліканова Скеля", en: "Pelican Rock" },
    icon: "🪶",
    terrain: "land",
    weight: 1,
    category: "island_wild",
    description: { uk: "Птахи гніздяться на білих скелях", en: "Birds nest on the white cliffs" },
  },
  {
    name: { uk: "Острів Бурелому", en: "Driftwood Isle" },
    icon: "🪵",
    terrain: "land",
    weight: 1,
    category: "island_wild",
    description: { uk: "Пляж, засипаний уламками дерев з усього моря", en: "Beach littered with timber from across the sea" },
  },
  {
    name: { uk: "Лагуна Тиші", en: "Stillwater Lagoon" },
    icon: "💧",
    terrain: "shallow",
    weight: 1,
    category: "island_wild",
    description: { uk: "Дзеркальна вода, жодного подиху вітру", en: "Mirror-still water, not a breath of wind" },
  },
];

// ══════════════════════════════════════════════════════════════
// PHANTOM ISLANDS — Supernatural/ghostly (10 locations)
// ══════════════════════════════════════════════════════════════

export const PHANTOM_ISLAND_POOL: LocationTemplate[] = [
  {
    name: { uk: "Острів-Примара", en: "Phantom Island" },
    icon: "👻",
    terrain: "land",
    weight: 0.8,
    category: "island_phantom",
    description: { uk: "З'являється на світанку, зникає на заході", en: "Appears at dawn, vanishes at sunset" },
  },
  {
    name: { uk: "Острів Без Повернення", en: "Isle of No Return" },
    icon: "🚫",
    terrain: "land",
    weight: 0.5,
    category: "island_phantom",
    description: { uk: "Хто ступить на берег, не повернеться", en: "Those who step ashore never come back" },
  },
  {
    name: { uk: "Привидний Архіпелаг", en: "Ghost Archipelago" },
    icon: "🌫️",
    terrain: "shallow",
    weight: 0.5,
    category: "island_phantom",
    description: { uk: "Скупчення островів, що існують лише в тумані", en: "Cluster of islands that exist only in fog" },
  },
  {
    name: { uk: "Міражна Мілина", en: "Mirage Cay" },
    icon: "🏜️",
    terrain: "shallow",
    weight: 0.8,
    category: "island_phantom",
    description: { uk: "Золоті піски мерехтять на горизонті", en: "Golden sands shimmer on the horizon" },
  },
  {
    name: { uk: "Острів Мерців", en: "Island of the Dead" },
    icon: "💀",
    terrain: "land",
    weight: 0.5,
    category: "island_phantom",
    description: { uk: "Мертві ходять під місячним світлом", en: "The dead walk under moonlight" },
  },
  {
    name: { uk: "Примарний Вогонь", en: "Ghostfire Isle" },
    icon: "🔮",
    terrain: "land",
    weight: 0.7,
    category: "island_phantom",
    description: { uk: "Зеленаве полум'я палає на безлюдному березі", en: "Greenish flame burns on the deserted shore" },
  },
  {
    name: { uk: "Пісок Забуття", en: "Sands of Oblivion" },
    icon: "⏳",
    terrain: "shallow",
    weight: 0.5,
    category: "island_phantom",
    description: { uk: "Хто засне тут, забуде хто він", en: "Those who sleep here forget who they are" },
  },
  {
    name: { uk: "Тіньовий Берег", en: "Shadow Shore" },
    icon: "🌑",
    terrain: "land",
    weight: 0.7,
    category: "island_phantom",
    description: { uk: "Земля без сонця, де тіні рухаються самі", en: "Sunless land where shadows move on their own" },
  },
  {
    name: { uk: "Острів Сновидінь", en: "Dreamwalker Isle" },
    icon: "💤",
    terrain: "land",
    weight: 0.6,
    category: "island_phantom",
    description: { uk: "Реальність та сон переплітаються", en: "Reality and dream intertwine" },
  },
  {
    name: { uk: "Маяк Потойбіччя", en: "Beacon Beyond" },
    icon: "🕯️",
    terrain: "land",
    weight: 0.5,
    category: "island_phantom",
    description: { uk: "Маяк світить, але доглядача ніколи не бачили", en: "The beacon shines, but no keeper has ever been seen" },
  },
];

// ══════════════════════════════════════════════════════════════
// UNDERWATER — Submerged points of interest (10 locations)
// ══════════════════════════════════════════════════════════════

export const UNDERWATER_POOL: LocationTemplate[] = [
  {
    name: { uk: "Затонулий Храм", en: "Sunken Temple" },
    icon: "🏛️",
    terrain: "deep",
    weight: 1,
    category: "underwater",
    description: { uk: "Стародавні колони виринають з глибини", en: "Ancient columns rise from the deep" },
  },
  {
    name: { uk: "Коралові Сади", en: "Coral Gardens" },
    icon: "🪸",
    terrain: "reef",
    weight: 1.5,
    category: "underwater",
    description: { uk: "Живий лабіринт барвистих коралів", en: "Living maze of vivid coral" },
  },
  {
    name: { uk: "Підводна Печера", en: "Undersea Grotto" },
    icon: "🫧",
    terrain: "deep",
    weight: 1,
    category: "underwater",
    description: { uk: "Повітряна кишеня в підводній скелі", en: "Air pocket inside a submerged cliff" },
  },
  {
    name: { uk: "Потоплене Місто", en: "Drowned City" },
    icon: "🏚️",
    terrain: "deep",
    weight: 0.8,
    category: "underwater",
    description: { uk: "Вулиці та площі під товщею води", en: "Streets and plazas under fathoms of water" },
  },
  {
    name: { uk: "Русалчин Грот", en: "Mermaid Grotto" },
    icon: "🧜‍♀️",
    terrain: "deep",
    weight: 0.8,
    category: "underwater",
    description: { uk: "Чарівні голоси линуть з глибини", en: "Enchanting voices drift from the depths" },
  },
  {
    name: { uk: "Перлинне Дно", en: "Pearl Bed" },
    icon: "🦪",
    terrain: "shallow",
    weight: 1.5,
    category: "underwater",
    description: { uk: "Величезні мушлі з перлинами розміром з кулак", en: "Giant shells with fist-sized pearls" },
  },
  {
    name: { uk: "Келп-Ліс", en: "Kelp Forest" },
    icon: "🌊",
    terrain: "deep",
    weight: 1,
    category: "underwater",
    description: { uk: "Підводні зарості, де ховається невідоме", en: "Underwater thickets hiding the unknown" },
  },
  {
    name: { uk: "Блакитна Безодня", en: "Blue Abyss" },
    icon: "🕳️",
    terrain: "deep",
    weight: 0.7,
    category: "underwater",
    description: { uk: "Западина, куди не дістає світло", en: "A trench where light cannot reach" },
  },
  {
    name: { uk: "Скат-Алея", en: "Stingray Alley" },
    icon: "🐠",
    terrain: "shallow",
    weight: 1.5,
    category: "underwater",
    description: { uk: "Скати ковзають над піщаним дном", en: "Stingrays glide over the sandy bottom" },
  },
  {
    name: { uk: "Підводний Вулкан", en: "Undersea Volcano" },
    icon: "🔥",
    terrain: "deep",
    weight: 0.7,
    category: "underwater",
    description: { uk: "Бульбашки та жар з тріщин у морському дні", en: "Bubbles and heat from cracks in the sea floor" },
  },
];

// ══════════════════════════════════════════════════════════════
// CAVES — Cave systems (10 locations)
// ══════════════════════════════════════════════════════════════

export const CAVE_POOL: LocationTemplate[] = [
  {
    name: { uk: "Печера Тіней", en: "Shadow Cave" },
    icon: "🕳️",
    terrain: "cave",
    weight: 2,
    category: "cave",
    description: { uk: "Тіні рухаються, навіть коли все нерухоме", en: "Shadows move even when everything is still" },
  },
  {
    name: { uk: "Печера Ехо", en: "Echo Cave" },
    icon: "🦇",
    terrain: "cave",
    weight: 1.5,
    category: "cave",
    description: { uk: "Кожен звук повертається спотвореним", en: "Every sound comes back distorted" },
  },
  {
    name: { uk: "Чортова Пащека", en: "Devil's Maw" },
    icon: "🌋",
    terrain: "cave",
    weight: 1.5,
    category: "cave",
    description: { uk: "Вхід нагадує розкриту пащу звіра", en: "The entrance resembles a beast's open jaw" },
  },
  {
    name: { uk: "Скелетний Острів", en: "Skeleton Isle" },
    icon: "☠️",
    terrain: "cave",
    weight: 1,
    category: "cave",
    description: { uk: "Кістки попередніх шукачів встелють підлогу", en: "Bones of past seekers litter the floor" },
  },
  {
    name: { uk: "Піратський Схрон", en: "Pirate's Stash" },
    icon: "💰",
    terrain: "cave",
    weight: 2,
    category: "cave",
    description: { uk: "Легенда каже, тут сховано скарб Чорної Бороди", en: "Legend says Blackbeard's treasure is hidden here" },
  },
  {
    name: { uk: "Кістковий Грот", en: "Bone Grotto" },
    icon: "🦴",
    terrain: "cave",
    weight: 1,
    category: "cave",
    description: { uk: "Стіни інкрустовані кістками невідомих створінь", en: "Walls encrusted with bones of unknown creatures" },
  },
  {
    name: { uk: "Кришталева Печера", en: "Crystal Cavern" },
    icon: "💎",
    terrain: "cave",
    weight: 1.5,
    category: "cave",
    description: { uk: "Кристали сяють власним примарним світлом", en: "Crystals glow with their own eerie light" },
  },
  {
    name: { uk: "Лігво Кракена", en: "Kraken's Lair" },
    icon: "🐙",
    terrain: "cave",
    weight: 0.8,
    category: "cave",
    description: { uk: "Гігантські присоски залишили сліди на стінах", en: "Giant sucker marks scar the walls" },
  },
  {
    name: { uk: "Печера Приливів", en: "Tidal Cave" },
    icon: "🌊",
    terrain: "cave",
    weight: 1,
    category: "cave",
    description: { uk: "Вхід відкривається лише під час відпливу", en: "The entrance opens only at low tide" },
  },
  {
    name: { uk: "Сіркова Яма", en: "Sulphur Pit" },
    icon: "💨",
    terrain: "cave",
    weight: 1,
    category: "cave",
    description: { uk: "Їдкий запах та жовтий дим з-під землі", en: "Acrid smell and yellow fumes from below" },
  },
];

// ══════════════════════════════════════════════════════════════
// WRECKS — Shipwrecks and debris fields (12 locations)
// ══════════════════════════════════════════════════════════════

export const WRECK_POOL: LocationTemplate[] = [
  {
    name: { uk: "Уламки Марії", en: "Mary's Wreck" },
    icon: "💀",
    terrain: "wreck",
    weight: 2,
    category: "wreck",
    description: { uk: "Розбитий корпус торгового судна на мілині", en: "Broken hull of a merchant vessel on the shallows" },
  },
  {
    name: { uk: "Залізне Дно", en: "Iron Bottom" },
    icon: "⚙️",
    terrain: "wreck",
    weight: 1.5,
    category: "wreck",
    description: { uk: "Кладовище кораблів на глибині", en: "Ship graveyard in the depths" },
  },
  {
    name: { uk: "Китовий Цвинтар", en: "Whale Graveyard" },
    icon: "🐋",
    terrain: "wreck",
    weight: 1,
    category: "wreck",
    description: { uk: "Кістки левіафанів серед уламків суден", en: "Leviathan bones among ship debris" },
  },
  {
    name: { uk: "Іспанський Золотий Флот", en: "Spanish Treasure Fleet" },
    icon: "👑",
    terrain: "wreck",
    weight: 0.8,
    category: "wreck",
    description: { uk: "Рештки конвою, потопленого ураганом 1715 року", en: "Remains of a convoy sunk by the 1715 hurricane" },
  },
  {
    name: { uk: "HMS Провіденс", en: "HMS Providence" },
    icon: "🇬🇧",
    terrain: "wreck",
    weight: 1,
    category: "wreck",
    description: { uk: "Англійський фрегат з повним трюмом таємниць", en: "English frigate with a hold full of secrets" },
  },
  {
    name: { uk: "Галеон-Привид", en: "Ghost Galleon" },
    icon: "👻",
    terrain: "wreck",
    weight: 0.7,
    category: "wreck",
    description: { uk: "Корабель, що тоне знову і знову кожної ночі", en: "A ship that sinks again every night" },
  },
  {
    name: { uk: "Уламки Летючого Голландця", en: "Flying Dutchman's Debris" },
    icon: "🌀",
    terrain: "wreck",
    weight: 0.5,
    category: "wreck",
    description: { uk: "Фрагменти легендарного корабля-привида", en: "Fragments of the legendary ghost ship" },
  },
  {
    name: { uk: "Флагман Дрейка", en: "Drake's Flagship" },
    icon: "🦅",
    terrain: "wreck",
    weight: 0.8,
    category: "wreck",
    description: { uk: "Останній причал найвідомішого корсара", en: "Final berth of the most famous privateer" },
  },
  {
    name: { uk: "Работоргове Судно", en: "Slaver's Hulk" },
    icon: "⛓️",
    terrain: "wreck",
    weight: 1,
    category: "wreck",
    description: { uk: "Прокляте судно зі страшною історією", en: "Cursed vessel with a terrible history" },
  },
  {
    name: { uk: "Пліт Відчаю", en: "Raft of Despair" },
    icon: "🪵",
    terrain: "wreck",
    weight: 1,
    category: "wreck",
    description: { uk: "Залишки саморобного плоту з передсмертною запискою", en: "Remains of a makeshift raft with a dying note" },
  },
  {
    name: { uk: "Каперський Бриг", en: "Privateer Brig" },
    icon: "🏴‍☠️",
    terrain: "wreck",
    weight: 1.5,
    category: "wreck",
    description: { uk: "Затонулий корсар з каперським патентом на борту", en: "Sunken corsair with a letter of marque aboard" },
  },
  {
    name: { uk: "Корабельний Цвинтар", en: "Ship Boneyard" },
    icon: "🪦",
    terrain: "wreck",
    weight: 1,
    category: "wreck",
    description: { uk: "Десятки щогл стирчать з води як надгробки", en: "Dozens of masts jut from the water like headstones" },
  },
];

// ══════════════════════════════════════════════════════════════
// MYSTERIOUS — Enigmatic supernatural locations (11 locations)
// ══════════════════════════════════════════════════════════════

export const MYSTERIOUS_POOL: LocationTemplate[] = [
  {
    name: { uk: "Бермудський Вир", en: "Bermuda Vortex" },
    icon: "🌀",
    terrain: "deep",
    weight: 0.7,
    category: "mysterious",
    description: { uk: "Компаси божеволіють, час плине інакше", en: "Compasses go mad, time flows differently" },
  },
  {
    name: { uk: "Море Шепотів", en: "Sea of Whispers" },
    icon: "👂",
    terrain: "water",
    weight: 1,
    category: "mysterious",
    description: { uk: "Голоси мертвих моряків линуть з води", en: "Voices of dead sailors drift from the water" },
  },
  {
    name: { uk: "Око Шторму", en: "Eye of the Storm" },
    icon: "🌪️",
    terrain: "deep",
    weight: 0.8,
    category: "mysterious",
    description: { uk: "Вічний ураган з тихим центром", en: "Eternal hurricane with a calm center" },
  },
  {
    name: { uk: "Проклята Мілина", en: "Cursed Shoal" },
    icon: "🦷",
    terrain: "shallow",
    weight: 1,
    category: "mysterious",
    description: { uk: "Кораблі сідають на мілину без видимої причини", en: "Ships run aground for no visible reason" },
  },
  {
    name: { uk: "Вогні Святого Ельма", en: "St. Elmo's Fire" },
    icon: "⚡",
    terrain: "water",
    weight: 1,
    category: "mysterious",
    description: { uk: "Блакитне полум'я танцює на щоглах", en: "Blue flame dances on the masts" },
  },
  {
    name: { uk: "Кров Океану", en: "Ocean's Blood" },
    icon: "🩸",
    terrain: "deep",
    weight: 0.7,
    category: "mysterious",
    description: { uk: "Вода стає червоною на милі навколо", en: "Water turns red for a mile around" },
  },
  {
    name: { uk: "Мертвий Штиль", en: "Dead Calm" },
    icon: "🪞",
    terrain: "water",
    weight: 1,
    category: "mysterious",
    description: { uk: "Жодного подиху вітру, жодної хвилі, вічність", en: "No breath of wind, no wave, for eternity" },
  },
  {
    name: { uk: "Врата Посейдона", en: "Poseidon's Gate" },
    icon: "🔱",
    terrain: "deep",
    weight: 0.6,
    category: "mysterious",
    description: { uk: "Гігантська кам'яна арка на морському дні", en: "Giant stone arch on the ocean floor" },
  },
  {
    name: { uk: "Магнітна Скеля", en: "Lodestone Rock" },
    icon: "🧲",
    terrain: "water",
    weight: 1,
    category: "mysterious",
    description: { uk: "Скеля, що витягує цвяхи з кораблів", en: "A rock that pulls nails from ships" },
  },
  {
    name: { uk: "Зоряний Водоспад", en: "Starfall" },
    icon: "🌠",
    terrain: "deep",
    weight: 0.5,
    category: "mysterious",
    description: { uk: "Вночі зорі падають у воду навколо", en: "At night stars fall into the surrounding water" },
  },
  {
    name: { uk: "Саргасове Пастко", en: "Sargasso Trap" },
    icon: "🌿",
    terrain: "water",
    weight: 1,
    category: "mysterious",
    description: { uk: "Водорості тримають корабель мертвою хваткою", en: "Seaweed grips the ship in a dead hold" },
  },
];

// ══════════════════════════════════════════════════════════════
// REEFS — Dangerous coral formations (8 locations)
// ══════════════════════════════════════════════════════════════

export const REEF_POOL: LocationTemplate[] = [
  {
    name: { uk: "Рифи Крові", en: "Blood Reefs" },
    icon: "🩸",
    terrain: "reef",
    weight: 2,
    category: "reef",
    description: { uk: "Червоні корали, гострі як ножі", en: "Red coral sharp as knives" },
  },
  {
    name: { uk: "Мертвий Риф", en: "Dead Reef" },
    icon: "🦴",
    terrain: "reef",
    weight: 1.5,
    category: "reef",
    description: { uk: "Вибілений скелет колишнього рифу", en: "Bleached skeleton of a former reef" },
  },
  {
    name: { uk: "Сирена Скеля", en: "Siren Rock" },
    icon: "🧜",
    terrain: "reef",
    weight: 1.5,
    category: "reef",
    description: { uk: "Чарівний спів заманює моряків на скелі", en: "Enchanting song lures sailors onto the rocks" },
  },
  {
    name: { uk: "Ламач Кілів", en: "Keel Breaker" },
    icon: "💥",
    terrain: "reef",
    weight: 1.5,
    category: "reef",
    description: { uk: "Підводні скелі, що розривають днища", en: "Submerged rocks that tear out hulls" },
  },
  {
    name: { uk: "Вогняний Риф", en: "Fire Reef" },
    icon: "🔥",
    terrain: "reef",
    weight: 1,
    category: "reef",
    description: { uk: "Дотик до цих коралів пече як вогонь", en: "Touching these corals burns like fire" },
  },
  {
    name: { uk: "Зубчаста Корона", en: "Jagged Crown" },
    icon: "⚔️",
    terrain: "reef",
    weight: 1,
    category: "reef",
    description: { uk: "Кільце гострих скель виростає з води", en: "Ring of sharp rocks rising from the water" },
  },
  {
    name: { uk: "Змієва Спина", en: "Serpent's Spine" },
    icon: "🐍",
    terrain: "reef",
    weight: 1,
    category: "reef",
    description: { uk: "Довгий рядок скель, що нагадує хребет", en: "Long row of rocks resembling a spine" },
  },
  {
    name: { uk: "Медузина Мілина", en: "Jellyfish Shoal" },
    icon: "🪼",
    terrain: "reef",
    weight: 1,
    category: "reef",
    description: { uk: "Тисячі медуз світяться серед коралів", en: "Thousands of jellyfish glow among the coral" },
  },
];

// ══════════════════════════════════════════════════════════════
// LANDMARKS — Navigational/geographical features (8 locations)
// ══════════════════════════════════════════════════════════════

export const LANDMARK_POOL: LocationTemplate[] = [
  {
    name: { uk: "Маякова Скеля", en: "Lighthouse Rock" },
    icon: "🗼",
    terrain: "land",
    weight: 1.5,
    category: "landmark",
    description: { uk: "Стародавній маяк на самотній скелі", en: "Ancient lighthouse on a lonely rock" },
  },
  {
    name: { uk: "Чортів Зуб", en: "Devil's Tooth" },
    icon: "🗻",
    terrain: "land",
    weight: 1,
    category: "landmark",
    description: { uk: "Гостра скеля, що стирчить з моря", en: "Sharp rock jutting from the sea" },
  },
  {
    name: { uk: "Близнюки", en: "Twin Peaks" },
    icon: "🏔️",
    terrain: "land",
    weight: 1,
    category: "landmark",
    description: { uk: "Дві однакові скелі як ворота гавані", en: "Two identical rocks like harbor gates" },
  },
  {
    name: { uk: "Вузька Протока", en: "The Narrows" },
    icon: "🚢",
    terrain: "shallow",
    weight: 1.5,
    category: "landmark",
    description: { uk: "Тісний прохід між скелями, один на один", en: "Tight passage between rocks, single file" },
  },
  {
    name: { uk: "Хрест Колумба", en: "Columbus Cross" },
    icon: "✝️",
    terrain: "land",
    weight: 1,
    category: "landmark",
    description: { uk: "Кам'яний хрест першовідкривачів на вершині", en: "Stone cross of the discoverers on the summit" },
  },
  {
    name: { uk: "Шибеничний Мис", en: "Gallows Point" },
    icon: "🪢",
    terrain: "land",
    weight: 1.5,
    category: "landmark",
    description: { uk: "Тіла піратів досі гойдаються на вітрі", en: "Pirate bodies still swing in the wind" },
  },
  {
    name: { uk: "Занедбаний Док", en: "Derelict Dock" },
    icon: "🪜",
    terrain: "shallow",
    weight: 1,
    category: "landmark",
    description: { uk: "Зруйнований причал посеред нікуди", en: "Ruined pier in the middle of nowhere" },
  },
  {
    name: { uk: "Вартова Вежа", en: "Watchtower Bluff" },
    icon: "🏰",
    terrain: "land",
    weight: 1,
    category: "landmark",
    description: { uk: "Іспанська вежа з оглядом на все узбережжя", en: "Spanish tower overlooking the entire coast" },
  },
];

// ══════════════════════════════════════════════════════════════
// ALL POOLS — Combined for convenience
// ══════════════════════════════════════════════════════════════

export const ALL_LOCATION_POOLS = {
  port: PORT_POOL,
  settlement: SETTLEMENT_POOL,
  island_inhabited: INHABITED_ISLAND_POOL,
  island_wild: WILD_ISLAND_POOL,
  island_phantom: PHANTOM_ISLAND_POOL,
  underwater: UNDERWATER_POOL,
  cave: CAVE_POOL,
  wreck: WRECK_POOL,
  mysterious: MYSTERIOUS_POOL,
  reef: REEF_POOL,
  landmark: LANDMARK_POOL,
} as const;

export const ALL_LOCATIONS: LocationTemplate[] = [
  ...PORT_POOL,
  ...SETTLEMENT_POOL,
  ...INHABITED_ISLAND_POOL,
  ...WILD_ISLAND_POOL,
  ...PHANTOM_ISLAND_POOL,
  ...UNDERWATER_POOL,
  ...CAVE_POOL,
  ...WRECK_POOL,
  ...MYSTERIOUS_POOL,
  ...REEF_POOL,
  ...LANDMARK_POOL,
];
