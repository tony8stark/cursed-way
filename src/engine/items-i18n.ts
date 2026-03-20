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
  cursed_compass: { uk: "Показує не північ, а те, що шукаєш", en: "Points not north, but to what you seek" },
  siren_shell: { uk: "Шепоче колискову. Прокляття слабшає", en: "Whispers a lullaby. The curse weakens" },
  ghost_lantern: { uk: "Світить у темряві. Привертає мертвих", en: "Glows in darkness. Attracts the dead" },
  map_fragment: { uk: "Частина карти скарбів", en: "Part of a treasure map" },
  medicine_chest: { uk: "Ліки тримають команду здоровою", en: "Medicine keeps the crew healthy" },
  black_pearl: { uk: "Безцінна. Або проклята. Або обоє", en: "Priceless. Or cursed. Or both" },
  kraken_tooth: { uk: "Більший за вашу голову", en: "Bigger than your head" },
  voodoo_doll: { uk: "Зв'язок з чимось давнім", en: "A link to something ancient" },
  trade_license: { uk: "Фальшива, але переконлива", en: "Forged, but convincing" },
  ancient_key: { uk: "Відкриває двері, які краще не чіпати", en: "Opens doors best left alone" },
};
