import type { Ending } from "../../engine/types";

export const endings: Ending[] = [
  {
    id: "between_worlds",
    req: s => s.curse >= 15,
    title: "М І Ж  С В І Т А М И",
    text: s => s.flags?.has("merged")
      ? "Ви і двійник — одне. Безсмертний капітан. Ваш корабель пливе крізь час."
      : s.flags?.has("met_double")
        ? "Двійник десь тут. Дві тіні одного прокляття, два кораблі на вічному курсі."
        : "Вічний капітан вічного корабля. Ваше ім'я стало пересторогою.",
    color: "#40f8a0",
  },
  {
    id: "swallowed",
    req: s => s.curse >= 12 && s.crew <= 2,
    title: "П О Г Л И Н У Т И Й",
    text: () => "Прокляття забрало все. Порожня оболонка на безлюдному кораблі.",
    color: "#8020c0",
  },
  {
    id: "last_one",
    req: s => s.crew <= 0,
    title: "О С Т А Н Н І Й",
    text: () => "Нікого. Лише хвилі та крик чайок. Дрейфуєте.",
    color: "#c02020",
  },
  {
    id: "cursed_gold",
    req: s => s.gold >= 150 && s.curse >= 8,
    title: "П Р О К Л Я Т Е  З О Л О Т О",
    text: s => s.flags?.has("eldorado_knowledge")
      ? "Золото Ельдорадо — пастка. Ви — частина колекції."
      : "Золото роз'їдає душу. Багатство без волі.",
    color: "#f0c040",
  },
  {
    id: "legend",
    req: s => s.karma >= 8,
    title: "Л Е Г Е Н Д А",
    text: s => s.flags?.has("siren_bond")
      ? "Сирена проводжає в порт. Вас поважає суша, море і глибина."
      : "Ваше ім'я стало синонімом честі на цих водах.",
    color: "#40c0f0",
  },
  {
    id: "king",
    req: s => s.gold >= 200,
    title: "К О Р О Л Ь",
    text: s => s.flags?.has("barret_deal")
      ? "Ви і Баррет ділите Кариби. Довго не протримається."
      : "Золота більше, ніж можна витратити за ціле життя.",
    color: "#f0c040",
  },
  {
    id: "objective_complete",
    req: s => s.flags?.has("objective_complete") === true,
    title: "М І С І Я  В И К О Н А Н А",
    text: s => {
      if (s.flags?.has("objective_treasure_hunter")) return "П'ять реліквій з п'яти проклятих кутів світу. Колекціонери і королі б'ються за ваш здобуток.";
      if (s.flags?.has("objective_curse_breaker")) return "Ви торкнулись безодні і повернулись. Мало хто може сказати те саме. Море вам більше нічого не винне.";
      if (s.flags?.has("objective_explorer")) return "Вісім берегів, жива команда і карта в голові. Ви не заблукали в морі, ви його вивчили.";
      if (s.flags?.has("objective_trade_baron")) return "Золото текло до вас не лише зі страху, а й через зв'язки. Гільдія називає вас одним із своїх.";
      if (s.flags?.has("objective_redeemer")) return "Море випробовувало вас. Ви щоразу обирали милосердя. Про ваше плавання складуть пісні.";
      if (s.flags?.has("objective_cartographer")) return "Ви відкрили майже половину моря й не дозволили прокляттю поглинути себе. Це робота майстра, а не авантюриста.";
      return "Ви вирушили з метою і досягли її. Небагато хто може сказати те саме.";
    },
    color: "#40f8a0",
  },
  {
    id: "survivor",
    req: () => true,
    title: "В И Ж И В",
    text: s => s.flags?.has("visited_phantom")
      ? "Повернулись. Але чи це ваш світ? Все трохи інакше."
      : "Не герой і не лиходій. Просто моряк, який повернувся живим.",
    color: "#c8c8d8",
  },
];
