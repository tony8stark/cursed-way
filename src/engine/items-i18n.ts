import type { Locale } from "../i18n";

export const ITEM_NAMES: Record<string, Record<Locale, string>> = {
  cursed_compass: { uk: "Проклятий компас", en: "Cursed Compass" },
  siren_shell: { uk: "Мушля сирени", en: "Siren Shell" },
  ghost_lantern: { uk: "Примарний ліхтар", en: "Ghost Lantern" },
  map_fragment: { uk: "Шматок карти", en: "Map Fragment" },
  medicine_chest: { uk: "Аптечка", en: "Medicine Chest" },
  black_pearl: { uk: "Чорна перлина", en: "Black Pearl" },
  kraken_tooth: { uk: "Зуб кракена", en: "Kraken Tooth" },
  voodoo_doll: { uk: "Лялька вуду", en: "Voodoo Doll" },
  trade_license: { uk: "Торгова ліцензія", en: "Trade License" },
  ancient_key: { uk: "Стародавній ключ", en: "Ancient Key" },
};

export const ITEM_DESCRIPTIONS: Record<string, Record<Locale, string>> = {
  cursed_compass: {
    uk: "Показує шлях до бажаного, але щоранку підживлює прокляття",
    en: "Points toward what you seek, but feeds the curse a little each dawn",
  },
  siren_shell: {
    uk: "Шепоче колискову. Стримує прокляття і веде до сирен",
    en: "Whispers a lullaby. Eases the curse and draws you toward sirens",
  },
  ghost_lantern: {
    uk: "Кличе мертвих, зате відкриває примарні шляхи й приховані уламки",
    en: "Calls the dead, but reveals ghost paths and hidden wrecks",
  },
  map_fragment: {
    uk: "Частина карти скарбів. Тримай до кінця або спали заради спокою",
    en: "Part of a treasure map. Keep it for the haul or burn it for peace",
  },
  medicine_chest: {
    uk: "Ліки тримають команду на ногах у довгих плаваннях",
    en: "Medicine keeps the crew standing through long voyages",
  },
  black_pearl: {
    uk: "Несе шепіт глибин: можна продати, використати або повернути морю",
    en: "Carries whispers from the deep: sell it, use it, or return it to the sea",
  },
  kraken_tooth: {
    uk: "Трофей і знак для тих, хто торгується з безоднею",
    en: "A trophy and a token for anyone bargaining with the abyss",
  },
  voodoo_doll: {
    uk: "Ритуальний вузол: іноді вбирає прокляття, іноді віддає його назад",
    en: "A ritual knot: sometimes absorbs the curse, sometimes gives it back",
  },
  trade_license: {
    uk: "Фальшива, але переконлива. Дає стабільний прибуток без різкого сноуболу",
    en: "Forged but convincing. Provides steady profit without runaway snowballing",
  },
  ancient_key: {
    uk: "Відкриває двері, за якими майже ніколи не буває безпечно",
    en: "Opens doors behind which it is almost never safe",
  },
};

export const ITEM_HINTS: Partial<Record<string, Record<Locale, string>>> = {
  cursed_compass: {
    uk: "Навігація: сильний вибір для дослідження, якщо контролюєш темряву.",
    en: "Navigation: strong for exploration, if you can keep darkness under control.",
  },
  siren_shell: {
    uk: "Очищення: добрий запас для runs, де тисне прокляття.",
    en: "Cleansing: good reserve for runs where the curse is the main pressure.",
  },
  ghost_lantern: {
    uk: "Примари: дає дальший огляд і веде в контент мертвих, але вони помічають вас.",
    en: "Ghostwork: gives wider sight and opens dead-men content, but they notice you.",
  },
  map_fragment: {
    uk: "Скарб: або довести до великої здобичі, або спалити для безпечнішого фіналу.",
    en: "Treasure: cash it out for a haul, or burn it for a safer finish.",
  },
  medicine_chest: {
    uk: "Витривалість: найкраще працює в довгих рейсах із повільною втратою екіпажу.",
    en: "Endurance: strongest in long runs with slow crew attrition.",
  },
  black_pearl: {
    uk: "Спокуса: відкриває темні угоди, але завжди лишає шлях до відмови.",
    en: "Temptation: opens dark bargains, but still leaves you a way to refuse.",
  },
  kraken_tooth: {
    uk: "Безодня: тримай, якщо шукаєш великий supernatural payoff.",
    en: "Abyss: keep it if you want the bigger supernatural payoff.",
  },
  voodoo_doll: {
    uk: "Ритуал: swing-артефакт для curse-management; у кризі її можна спалити.",
    en: "Ritual: a swing artifact for curse management; burn it when the run turns bad.",
  },
  trade_license: {
    uk: "Економіка: стабільний дохід для обережних і торгових маршрутів.",
    en: "Economy: steady income for cautious or trade-heavy routes.",
  },
  ancient_key: {
    uk: "Ключ: не сила сама по собі, а перепустка до сильніших ризиків.",
    en: "Key: not power by itself, but access to stronger risks.",
  },
};
