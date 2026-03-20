import type { Locale } from "../i18n";

interface AchievementText {
  title: string;
  description: string;
}

const achievementTexts: Record<string, Record<Locale, AchievementText>> = {
  angel: {
    uk: { title: "Ангел морів", description: "Закінчити гру з кармою 8+" },
    en: { title: "Angel of the Seas", description: "Finish with karma 8+" },
  },
  cursed: {
    uk: { title: "Проклятий", description: "Досягти прокляття 15" },
    en: { title: "Cursed", description: "Reach curse level 15" },
  },
  rich: {
    uk: { title: "Король Карибів", description: "Накопичити 150+ золота" },
    en: { title: "King of the Caribbean", description: "Accumulate 150+ gold" },
  },
  pacifist: {
    uk: { title: "Дипломат", description: "Жодного абордажу за гру" },
    en: { title: "Diplomat", description: "No boarding in a single game" },
  },
  empty: {
    uk: { title: "Порожній трюм", description: "Закінчити гру з 0 золота" },
    en: { title: "Empty Hold", description: "Finish with 0 gold" },
  },
  full_crew: {
    uk: { title: "Капітан року", description: "Закінчити з 12+ членів команди" },
    en: { title: "Captain of the Year", description: "Finish with 12+ crew members" },
  },
  lone: {
    uk: { title: "Самотній вовк", description: "Залишитись без команди" },
    en: { title: "Lone Wolf", description: "Lose all crew" },
  },
  siren: {
    uk: { title: "Друг сирени", description: "Встановити зв'язок з сиреною" },
    en: { title: "Siren's Friend", description: "Bond with the siren" },
  },
  explorer: {
    uk: { title: "Дослідник", description: "Відвідати острів-примару" },
    en: { title: "Explorer", description: "Visit the phantom island" },
  },
  kraken_friend: {
    uk: { title: "Пакт з глибиною", description: "Укласти угоду з Кракеном" },
    en: { title: "Pact with the Deep", description: "Make a deal with the Kraken" },
  },
  merged: {
    uk: { title: "Єдність", description: "Об'єднатися з двійником" },
    en: { title: "Unity", description: "Merge with the doppelganger" },
  },
  long_voyage: {
    uk: { title: "20 днів", description: "Пройти всі 20 днів" },
    en: { title: "20 Days", description: "Survive all 20 days" },
  },
  dark_path: {
    uk: { title: "Темний шлях", description: "Карма нижче -5" },
    en: { title: "Dark Path", description: "Karma below -5" },
  },
  balanced: {
    uk: { title: "Баланс", description: "Закінчити з кармою від -1 до 1" },
    en: { title: "Balance", description: "Finish with karma between -1 and 1" },
  },
};

export function getAchievementText(id: string, locale: Locale): AchievementText {
  return achievementTexts[id]?.[locale] ?? achievementTexts[id]?.uk ?? { title: id, description: "" };
}
