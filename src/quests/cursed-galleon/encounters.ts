import type { Encounter } from "../../engine/types";

export const encounters: Encounter[] = [
  // ── SEA / TRADE ──
  {
    id: "merchant_spice", scene: "open_sea", phase: "early", title: "Торговець спеціями",
    text: "Купець з Мадагаскару. Пахне корицею і кардамоном. Пропонує обмін.",
    choices: [
      { text: "⚔️ Абордаж", eff: { gold: [25, 60], crew: [-2, 0], karma: -2, curse: 1, rep: { guild: -2, brethren: 1 } }, msg: "Трюм наш. Торговець дивиться з ненавистю." },
      { text: "💰 Купити спецій (−15)", eff: { gold: -15, crew: 0, karma: 1, curse: 0, rep: { guild: 1 } }, msg: "Спеції зігріють у холодні ночі. Мораль росте.", flag: "has_spices" },
      { text: "📜 Запитати про слухи", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Шепоче про затонулий храм на схід, де золото ніхто не бере — бо воно кусається.", flag: "knows_temple" },
    ],
  },
  {
    id: "merchant_weapons", scene: "open_sea", phase: "early", title: "Контрабандист зброї",
    text: "Нідерландський шлюп під фальшивим прапором. Борт обвішаний мушкетами.",
    choices: [
      { text: "💰 Купити зброю (−25)", eff: { gold: -25, crew: 0, karma: 0, curse: 0, rep: { brethren: 1 } }, msg: "Команда озброєна. Наступний бій буде легшим.", flag: "armed" },
      { text: "⚔️ Забрати силою", eff: { gold: [10, 30], crew: [-1, 0], karma: -2, curse: 0, rep: { brethren: -1, guild: -1 } }, msg: "Контрабандист поклявся помститися. Тепер він — ваш ворог.", flag: "arms_dealer_enemy" },
      { text: "🤝 Обмін інформацією", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Розповідає про британський конвой через два дні.", flag: "knows_convoy" },
      { text: "🗝️ [Контрабандист] Старі зв'язки", eff: { gold: -10, crew: 0, karma: 0, curse: 0 }, msg: "Ви знаєте рукостискання. Половина ціни, без питань. На додачу кидає бочку пороху.", flag: "armed", requires_flag: "origin_smuggler" },
      { text: "⚓ [Флот] Стара комісія", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Він блідне. Скидає зброю за борт і тікає. Ви вилучаєте непоганий пістолет.", flag: "armed", requires_flag: "origin_navy" },
    ],
  },
  {
    id: "merchant_silk", scene: "open_sea", phase: "early", title: "Китайська джонка",
    text: "Величний корабель з багряними вітрилами. Шовк, порцеляна, чай.",
    choices: [
      { text: "🤝 Торгувати чесно", eff: { gold: [5, 20], crew: 0, karma: 2, curse: 0, item: "cursed_compass", rep: { guild: 2 } }, msg: "Капітан дарує компас, що 'показує не північ, а те, що шукаєш'." },
      { text: "⚔️ Абордаж", eff: { gold: [40, 80], crew: [-3, -1], karma: -3, curse: 2, rep: { guild: -3, brethren: 1 } }, msg: "Джонка горить. Серед шовку — сувій з невідомими символами. Він пульсує." },
      { text: "🍵 Чай з капітаном", eff: { gold: 0, crew: 1, karma: 1, curse: 0 }, msg: "Колишній пірат. Один з ваших лишається, але двоє його людей просяться до вас.", flag: "chinese_allies" },
    ],
  },
  {
    id: "floating_cargo", scene: "open_sea", phase: "early", title: "Плавучий вантаж",
    text: "Бочки рому дрейфують після аварії. Десятки бочок.",
    choices: [
      { text: "🍺 Підібрати", eff: { gold: [10, 25], crew: 1, karma: 0, curse: 0 }, msg: "Ром — валюта Карибів. Команда радіє." },
      { text: "🔍 Шукати джерело", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Розбитий корабель. Нікого живого. Прапор — знайомий.", flag: "wreck_clue" },
      { text: "💨 Не зупинятись", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Обережність — рідкість серед піратів." },
    ],
  },
  {
    id: "whale", scene: "open_sea", title: "Кити",
    text: "Стадо китів пливе поруч. Величезні, спокійні, древні.",
    choices: [
      { text: "🐋 Милуватись", eff: { gold: 0, crew: 1, karma: 1, curse: 0 }, msg: "На мить — ніхто не пірат. Просто люди, які дивляться на диво." },
      { text: "🎯 Полювати", eff: { gold: [15, 30], crew: 0, karma: -2, curse: 1 }, msg: "Кров у воді. Золото в трюмі. Море запам'ятає." },
      { text: "🎵 Слухати спів", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: s => s.flags?.has("siren_contact") ? "Сирена відповідає китам. Розмова, якій мільйони років." : "Низький гул, що резонує в кістках." },
    ],
  },
  // ── STORMS ──
  {
    id: "storm_basic", scene: "storm", title: "Шторм!",
    text: "Стіна дощу. Щогла тріщить. Хвилі вищі за борт.",
    choices: [
      { text: "⚓ Лягти в дрейф", eff: { gold: 0, crew: [-1, 0], karma: 0, curse: 0 }, msg: "Пережили. Одного змило за борт." },
      { text: "🏴 На повних вітрилах!", eff: { gold: 0, crew: [-2, 0], karma: 0, curse: 0 }, msg: s => s.crew >= 7 ? "Прорвалися! Але двох не дорахувалися." : "Замало рук. Серйозні втрати." },
      { text: "🌊 Вловити течію", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "Течія виносить кудись не туди. Зірки — інші. Небо не того кольору.", flag: "lost_waters" },
    ],
  },
  {
    id: "storm_lightning", scene: "storm", title: "Блискавичний шторм",
    text: "Блискавка б'є в море. На мить бачите ЩОСь під водою — величезне.",
    choices: [
      { text: "👀 Вдивитись", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: "Воно теж вдивляється. Тепер ви знаєте — глибина має очі.", flag: "deep_watcher" },
      { text: "🙈 Відвернутися", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Що не бачив — того не існує. Принаймні, так легше." },
      { text: "🔔 Вдарити в дзвін", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "Щось під водою завмирає... і відпливає. Цього разу.", flag: "bell_rang" },
    ],
  },
  {
    id: "storm_wreck", scene: "storm", title: "Уламки в хвилях",
    text: "Шторм розбив чийсь корабель. Між дощок — скриня.",
    choices: [
      { text: "📦 Дістати скриню", eff: { gold: [15, 50], crew: [-1, 0], karma: 0, curse: 0 }, msg: s => s.flags?.has("cursed_compass") ? "Компас вказує прямо на неї. Золото — і медальйон, що шепоче вночі." : "Золото! Одного змило, рятуючи бочку." },
      { text: "🆘 Шукати вцілілих", eff: { gold: 0, crew: [1, 2], karma: 2, curse: 0 }, msg: "Навігатор і кухар. Обидва клянуться в вірності.", flag: "rescued_sailors" },
      { text: "💨 Не ризикувати", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Уламки зникають. Можливо, правильне рішення." },
    ],
  },
  // ── ISLANDS ──
  {
    id: "island_village", scene: "island", title: "Рибальське поселення",
    text: "Маленька бухта. Хатини з пальм. Діти на пляжу.",
    choices: [
      { text: "🤝 Торгувати", eff: { gold: [5, 15], crew: 0, karma: 1, curse: 0 }, msg: "Свіжа риба та фрукти. Команда вдячна за нормальну їжу." },
      { text: "🔥 Пограбувати", eff: { gold: [10, 25], crew: 0, karma: -4, curse: 2 }, msg: "Діти кричать. Старійшина проклинає мовою, яку не знаєте. Слова врізаються в пам'ять.", flag: "village_curse" },
      { text: "🏥 Відпочити", eff: { gold: 0, crew: 1, karma: 1, curse: 0 }, msg: "День без моря. Команда стає людьми знову." },
    ],
  },
  {
    id: "island_ruins", scene: "island", title: "Руїни храму",
    text: "Кам'яні колони в зелені. На стінах — зображення моря і чогось з глибини.",
    choices: [
      { text: "🔍 Дослідити", eff: { gold: [0, 30], crew: 0, karma: 0, curse: 2 }, msg: "Золоті фігурки. І зображення корабля, що виглядає як ваш. Йому сотні років.", flag: "temple_visited" },
      { text: "📜 Прочитати написи", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: s => s.flags?.has("knows_temple") ? "Торговець казав правду. 'Золото пам'ятає руки, що його чіпали.'" : "Невідома мова. Малюнки: жертва морю — і море відповідає." },
      { text: "💣 Не чіпати", eff: { gold: 0, crew: 0, karma: 1, curse: -1 }, msg: "Повага до чужих святинь. Море це бачить." },
    ],
  },
  {
    id: "island_volcano", scene: "island", title: "Вулканічний острів",
    text: "Земля тремтить. Чорний пісок. У скелях — блиск.",
    choices: [
      { text: "⛏️ Видобувати", eff: { gold: [20, 60], crew: [-2, -1], karma: 0, curse: 0 }, msg: "Обсидіан та золото. Двоє дістали опіки." },
      { text: "🌋 На вершину", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: "Бачите острів, якого немає на карті. Він мерехтить.", flag: "saw_phantom_island" },
      { text: "💧 Мінеральні джерела", eff: { gold: 0, crew: 1, karma: 0, curse: 0 }, msg: "Команда відпочиває, рани загоюються." },
    ],
  },
  {
    id: "island_abandoned", scene: "island", title: "Покинутий табір",
    text: "Речі, гамак, згаслий вогонь. На піску — слово: 'ТІКАЙТЕ'.",
    choices: [
      { text: "🔍 Обшукати", eff: { gold: [5, 15], crew: 0, karma: 0, curse: 1 }, msg: "Щоденник. Останній запис: 'Воно виходить вночі. Воно виглядає як я.'", flag: "doppelganger_warning" },
      { text: "🏃 Послухати пораду", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Здоровий глузд переважає цікавість." },
      { text: "🔥 Чекати вночі", eff: { gold: 0, crew: 0, karma: 0, curse: 3 }, msg: "З лісу виходить... ви. Точна копія. Посміхається і розчиняється.", flag: "met_double" },
    ],
  },
  {
    id: "island_native_chief", scene: "island", title: "Вождь острова",
    text: "Воїни виходять з джунглів. Їх лідер — жінка з шрамами і мудрими очима.",
    choices: [
      { text: "🎁 Подарунки", eff: { gold: -10, crew: 0, karma: 2, curse: 0 }, msg: "Вона приймає дари і пропонує провідника через рифи. Безцінний дар.", flag: "has_guide" },
      { text: "⚔️ Продемонструвати силу", eff: { gold: 0, crew: [-1, 0], karma: -2, curse: 1 }, msg: "Отруєні стріли. Одного вбито. Тікаєте під градом дротиків." },
      { text: "🙏 Попросити притулку", eff: { gold: 0, crew: 1, karma: 1, curse: 0 }, msg: "Тиждень відпочинку. Один матрос закохується і лишається. Але двоє островитян хочуть побачити світ." },
    ],
  },
  // ── CREW ──
  {
    id: "crew_sick", scene: "open_sea", title: "Хвороба на борту",
    text: "Тропічна лихоманка. Троє в гамаках, решта боїться.",
    requires: s => s.day > 3,
    choices: [
      { text: "🏥 Лікувати (−20)", eff: { gold: -20, crew: 0, karma: 1, curse: 0 }, msg: s => s.flags?.has("has_spices") ? "Спеції від мадагаскарця — ідеальні ліки! Всі одужують." : "Ліки на наступній зупинці. Більшість видужує." },
      { text: "🚢 Висадити хворих", eff: { gold: 0, crew: -3, karma: -2, curse: 1 }, msg: "Залишаєте на острові. Їхні очі — останнє, що бачите." },
      { text: "🙏 Чекати", eff: { gold: 0, crew: [-2, -1], karma: 0, curse: 0 }, msg: "Хтось одужує, хтось ні." },
    ],
  },
  {
    id: "crew_celebration", scene: "open_sea", title: "Команда святкує",
    text: "Вдала здобич! Ром тече рікою. Пісні на милю.",
    requires: s => s.gold > 50,
    choices: [
      { text: "🍺 Святкувати! (−10)", eff: { gold: -10, crew: 1, karma: 0, curse: 0 }, msg: "Найкраща ніч за місяці. Навіть старий Морган танцює." },
      { text: "🚫 Заборонити ром", eff: { gold: 0, crew: -1, karma: 0, curse: 0 }, msg: "Капітан без рому — небезпечна людина. Шепіт на палубі." },
      { text: "🎲 Азартні ігри", eff: { gold: [-20, 20], crew: 0, karma: 0, curse: 0 }, msg: "Кістки летять. Хтось збагатів, хтось програв сорочку." },
    ],
  },
  {
    id: "crew_mutiny", scene: "open_sea",
    title: s => s.karma < -3 ? "Бунт!" : "Бунт!",
    text: s => s.karma < -3 ? "Команда обступає з ножами. 'Ти занадто далеко зайшов, капітане.'" : "Частина команди вимагає зміни курсу.",
    requires: s => s.day > 7,
    choices: [
      { text: "⚔️ Придушити", eff: { gold: 0, crew: [-3, -2], karma: -1, curse: 0 }, msg: s => s.flags?.has("armed") ? "Зброя контрабандиста вирішує суперечку. Швидко і страшно." : "Кров на палубі." },
      { text: "🤝 Переговори", eff: { gold: [-15, -5], crew: [0, 1], karma: 1, curse: 0 }, msg: "Більша частка. Команда заспокоюється. Поки що." },
      { text: "🗳️ Голосування", eff: { gold: 0, crew: 0, karma: 2, curse: 0 }, msg: s => s.karma >= 0 ? "Голосують за вас. Демократія працює, коли вірять капітану." : "Голосують проти. Але приймаєте результат." },
    ],
  },
  {
    id: "crew_storyteller", scene: "open_sea", title: "Ніч історій",
    text: "Штиль. Зірки. Старий матрос розповідає про Чорну Перлину.",
    choices: [
      { text: "👂 Слухати", eff: { gold: 0, crew: 1, karma: 0, curse: 0 }, msg: "Команда зближується. У темряві — людське тепло." },
      { text: "❓ Про прокляття", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: s => s.curse > 3 ? "'Я бачу його на тобі, капітане. Ти вже пахнеш глибиною.'" : "'Прокляття — казки. Справжній пірат боїться лише безвітря.'" },
      { text: "🗣️ Своя історія", eff: { gold: 0, crew: 1, karma: 0, curse: 0 }, msg: "Говорите, чому стали піратом. Тиша. 'Я з тобою, капітане.'" },
    ],
  },
  {
    id: "crew_desertion", scene: "port", title: "Дезертири",
    text: "Зранку трьох немає. Втекли з частиною золота.",
    requires: s => s.day > 5 && s.karma < 0,
    choices: [
      { text: "🔍 Знайти і покарати", eff: { gold: [5, 15], crew: [-1, 0], karma: -2, curse: 0 }, msg: "Двох знайшли. Третій — зник. Покарання публічне." },
      { text: "💨 Нехай ідуть", eff: { gold: -15, crew: -3, karma: 0, curse: 0 }, msg: "Менше ротів — менше проблем." },
      { text: "📢 Набрати нових", eff: { gold: -10, crew: [1, 3], karma: 0, curse: 0 }, msg: "Портова таверна — кузня піратів." },
    ],
  },
  {
    id: "crew_duel", scene: "open_sea", title: "Дуель на палубі",
    text: "Два матроси схопилися за ножі. Суперечка через частку здобичі.",
    choices: [
      { text: "⚖️ Розсудити", eff: { gold: 0, crew: 0, karma: 1, curse: 0 }, msg: "Справедливий вирок. Обидва підкоряються. Поважають." },
      { text: "🗡️ Хай б'ються", eff: { gold: 0, crew: -1, karma: -1, curse: 0 }, msg: "Один лежить. Закон моря — жорстокий, але зрозумілий." },
      { text: "🍺 Ром вирішить", eff: { gold: -5, crew: 0, karma: 0, curse: 0 }, msg: "Через годину обнімаються. Проблема не зникла, але відклалася." },
    ],
  },
  // ── COMBAT ──
  {
    id: "navy_patrol", scene: "combat", title: "Патрульний корвет",
    text: "Британський прапор. 20 гармат. Вас помітили.",
    choices: [
      { text: "⚔️ Бій!", eff: { gold: [0, 50], crew: [-4, -2], karma: -1, curse: 0, rep: { crown: -3, brethren: 2 } }, msg: s => s.flags?.has("armed") ? "Зброя контрабандиста рішає бій!" : "Кривавий бій. Ледь вижили." },
      { text: "💨 Тікати", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: s => s.crew >= 6 ? "Повні вітрила! Корвет не встигає." : "Замало рук. Ледь відірвались." },
      { text: "🏳️ Прикинутись торговцем", eff: { gold: [-10, 0], crew: 0, karma: 0, curse: 0 }, msg: s => s.flags?.has("arms_dealer_enemy") ? "На борту — контрабандист! Він впізнає вас. Доводиться тікати під обстрілом." : "Фальшиві документи працюють. Серце б'ється годину." },
    ],
  },
  {
    id: "pirate_rival", scene: "combat", phase: "mid", weight: 1.2, title: "Чорний Баррет",
    text: "Піратський бриг. Капітан — відомий головоріз. Кричить пропозицію.",
    choices: [
      { text: "⚔️ Бій", eff: { gold: [20, 70], crew: [-3, -1], karma: 0, curse: 0, rep: { brethren: -1 } }, msg: "Баррет б'ється як демон. Але ви — кращі." },
      { text: "🤝 Об'єднатися", eff: { gold: 0, crew: [2, 4], karma: 0, curse: 0, rep: { brethren: 2, crown: -1 } }, msg: "Два кораблі. Ненадійний союзник, але поки вигідний.", flag: "barret_alliance" },
      { text: "🍺 Ром і розмова", eff: { gold: -5, crew: 0, karma: 1, curse: 0 }, msg: "Баррет — балакучий п'яниця. Розповідає про острів, де пропадають кораблі.", flag: "knows_bermuda" },
      { text: "🔥 [Бунтівник] 'Я вбив свого капітана. Хочеш побачити як?'", eff: { gold: [10, 30], crew: 0, karma: -1, curse: 0 }, msg: "Баррет замовкає. Вивчає ваше обличчя. 'Вірю.' Кидає мішок золота на палубу і швидко відпливає. Репутація має свої переваги.", requires_flag: "origin_mutineer" },
    ],
  },
  {
    id: "convoy_attack", scene: "combat", title: "Британський конвой!",
    text: "Три торговці під охороною фрегата. Головний приз — головний ризик.",
    requires: s => s.flags?.has("knows_convoy"),
    choices: [
      { text: "⚔️ Всіх разом!", eff: { gold: [50, 120], crew: [-5, -2], karma: -2, curse: 0, rep: { crown: -3, brethren: 3, guild: -2 } }, msg: s => s.flags?.has("barret_alliance") ? "З Барретом — це полювання. Конвой здається." : "Один проти чотирьох. Божевілля. Але золота — на три життя." },
      { text: "🎯 Тільки останнього", eff: { gold: [20, 40], crew: [-1, 0], karma: -1, curse: 0, rep: { crown: -1, guild: -1 } }, msg: "Відставший торговець — легка здобич." },
      { text: "👀 Розвідка", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Запам'ятовуєте маршрут. Наступного разу.", flag: "convoy_route" },
    ],
  },
  {
    id: "spanish_galleon", scene: "combat", phase: "mid", weight: 1.2, title: "Іспанський галеон!",
    text: "Золотий прапор Кастилії. Величезний корабель. Повільний, але з 40 гарматами.",
    choices: [
      { text: "⚔️ Атака на світанку", eff: { gold: [40, 100], crew: [-4, -2], karma: -1, curse: 0, rep: { crown: -2, brethren: 2 } }, msg: s => s.flags?.has("has_guide") ? "Провідник знає рифи — заманюєте галеон на мілину. Легка здобич!" : "Лобова атака. Гармати б'ють страшно. Але абордаж — ваша стихія." },
      { text: "🏴 Підняти іспанський прапор", eff: { gold: 0, crew: 0, karma: -1, curse: 0 }, msg: "Підходите впритул. Коли розуміють — пізно. Але якщо хтось вижив і впізнає...", flag: "spanish_disguise" },
      { text: "💨 Обійти стороною", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Не кожен бій варто починати. Мудрість — теж зброя." },
    ],
  },
  // ── SUPERNATURAL ──
  {
    id: "sirens_song", scene: "ethereal", family: "setpiece", phase: ["mid", "late"], weight: 0.7, exclusivityGroup: "supernatural_sirens", title: "Спів у тумані",
    text: "Мелодія без джерела. Команда завмирає. Хтось крокує до борту.",
    choices: [
      { text: "🔇 Воск у вуха", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Працює. Але мелодія була красивою." },
      { text: "🎵 Слухати", eff: { gold: 0, crew: [-2, -1], karma: 0, curse: 3 }, msg: "Двоє стрибають за борт із посмішкою." },
      { text: "🎶 Заспівати у відповідь", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: "Жіночий голос: 'Цікавий. Ми ще зустрінемося.' У тумані — очі.", flag: "siren_contact" },
      { text: "📖 [Вчений] Прочитати Гімн Скування", eff: { gold: 0, crew: 0, karma: 0, curse: -1 }, msg: "Ви знаєте цю мелодію. Сторінка 47 Забороненого Кодексу. Ви вимовляєте контр-вірш. Спів обривається. Приголомшена тиша. Потім: 'Ти... знаєш старі слова.' Повага в голосі.", flag: "siren_contact", requires_flag: "origin_scholar" },
    ],
  },
  {
    id: "siren_return", scene: "ethereal", title: "Вона прийшла",
    text: "Жінка з перлинами у волоссі сидить на носі. Команда не бачить. Тільки ви.",
    requires: s => s.flags?.has("siren_contact"),
    choices: [
      { text: "❓ Що тобі треба?", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: "'Ти цікавий. Зазвичай люди або тікають, або тонуть. Ти — співаєш.' Пропонує угоду.", flag: "siren_deal" },
      { text: "⚔️ Геть з мого корабля", eff: { gold: 0, crew: 0, karma: 0, curse: -1 }, msg: "'Хоробрий і дурний.' Зникає у бризках." },
      { text: "🎶 Заспівати знову", eff: { gold: 0, crew: 0, karma: 0, curse: 3 }, msg: "На мить бачите світ її очима — нескінченну глибину. Красиво. Страшно.", flag: "siren_bond" },
    ],
  },
  {
    id: "ghost_ship", scene: "combat", enemyType: "ghost", family: "setpiece", phase: ["mid", "late"], weight: 0.7, exclusivityGroup: "supernatural_ghost", title: "Корабель-привид",
    text: "Гнилий галеон без прапора. На палубі — скелети, що рухаються.",
    choices: [
      { text: "💀 На борт!", eff: { gold: [30, 80], crew: [-2, 0], karma: 0, curse: 4 }, msg: "Скелети б'ються мовчки. У трюмі — карта до місця, якого не існує.", flag: "ghost_map" },
      { text: "🔥 Підпалити", eff: { gold: 0, crew: 0, karma: 1, curse: -2 }, msg: "Вогонь пожирає мертве дерево. Звук — то чи крик, то чи подяка." },
      { text: "👻 Поговорити", eff: { gold: 0, crew: 0, karma: 0, curse: 3 }, msg: s => s.flags?.has("deep_watcher") ? "'Воно чекає,' — каже мертвий капітан. — 'Воно завжди чекало на тебе.'" : "'Не йди на дно. Там не скарб. Там — ціна.'" },
    ],
  },
  {
    id: "kraken_attack", scene: "kraken", family: "setpiece", phase: ["mid", "late"], weight: 0.7, exclusivityGroup: "supernatural_kraken", title: "КРАКЕН!",
    text: "Вода закипає. Щупальця товщиною зі щоглу обхоплюють корабель.",
    choices: [
      { text: "⚔️ Рубати!", eff: { gold: 0, crew: [-4, -2], karma: 0, curse: 0 }, msg: s => s.flags?.has("armed") ? "Зброя рубає щупальця! Кракен відступає." : "Сокири проти м'яса. Довгий бій." },
      { text: "💰 Згодувати золото", eff: { gold: [-40, -20], crew: 0, karma: 0, curse: -1 }, msg: "Щупальця обережно забирають скрині. Угода." },
      { text: "🩸 Жертва крові", eff: { gold: 0, crew: -3, karma: -3, curse: 4 }, msg: "Три душі за пропуск. Кракен відпускає. Його очі — ті самі, що й у глибині.", flag: "kraken_pact" },
    ],
  },
  {
    id: "eclipse", scene: "ethereal", title: "Затемнення",
    text: "Місяць закриває сонце. Повна темрява. Інші зірки.",
    choices: [
      { text: "🔭 Вивчати зірки", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: s => s.flags?.has("saved_martin") ? "Мартін блідне: 'Ці зірки — з іншого неба. Ми між світами.'" : "Як карта до місця, якого не має бути." },
      { text: "🙏 Молитись", eff: { gold: 0, crew: 0, karma: 1, curse: -1 }, msg: "Темрява відступає. Молитва чи час?" },
      { text: "🎲 Кинути монету в море", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "Море повертає іншу монету. Старішу на 200 років." },
    ],
  },
  {
    id: "sea_fog", scene: "ethereal", title: "Густий туман",
    text: "Видимість — нуль. Хтось кличе вас на ім'я.",
    choices: [
      { text: "📢 Відповісти", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: s => s.flags?.has("siren_bond") ? "Сирена: 'Далі небезпечно. Повертай.' Вперше — щира турбота?" : "Голос стихає. Потім — далекий нелюдський сміх." },
      { text: "🔇 Мовчати", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Туман розсіюється. Ви на тому ж місці. Час — вкрадений." },
      { text: "🔔 Бити в дзвін", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: s => s.flags?.has("bell_rang") ? "Дзвін прорізає туман. Щоразу — відступає на крок. Ви навчились його мові." : "Дзвін — і туман розходиться. Але за ним — інший туман." },
    ],
  },
  // ── CASTAWAY CHAIN ──
  {
    id: "castaway_normal", scene: "open_sea", title: "Людина на уламках",
    text: "Моряк чіпляється за дошку. Обличчя обпалене.",
    choices: [
      { text: "🤝 Врятувати", eff: { gold: 0, crew: 1, karma: 2, curse: 0 }, msg: "Мартін. Колишній штурман. Читає зірки як ніхто.", flag: "saved_martin" },
      { text: "💰 Тільки за інформацію", eff: { gold: 0, crew: 1, karma: 0, curse: 0 }, msg: "Координати затонулого галеону з іспанським золотом.", flag: "knows_galleon" },
      { text: "💨 Повз", eff: { gold: 0, crew: 0, karma: -2, curse: 1 }, msg: "Він дивиться вслід. Наступної ночі хтось бачить його у воді." },
    ],
  },
  {
    id: "castaway_cursed", scene: "ethereal", title: "Фігура на воді",
    text: "Людина СТОЇТЬ на воді. Не тоне. Очі — повністю білі. Усміхається.",
    requires: s => s.curse >= 5,
    choices: [
      { text: "🤝 Простягнути руку", eff: { gold: 0, crew: 0, karma: 0, curse: 4 }, msg: "'Дякую. Тепер я можу піти.' Зникає. Холод у вашій руці — лишається.", flag: "cold_touch" },
      { text: "❓ Хто ти?", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: s => s.flags?.has("doppelganger_warning") ? "'Я — той, хто був до тебе. І після тебе. Ми всі — одна людина.' Щоденник — правда." : "'Ніхто. Всі. Море пам'ятає кожного.'" },
      { text: "🔥 Стріляти", eff: { gold: 0, crew: 0, karma: 0, curse: -1 }, msg: "Куля наскрізь. Він здивований. Розчиняється." },
    ],
  },
  // ── PORT ──
  {
    id: "port_tortuga", scene: "port", title: "Тортуга",
    text: "Піратська столиця. Все — за правильну ціну.",
    choices: [
      { text: "🔧 Ремонт (−20)", eff: { gold: -20, crew: 0, karma: 0, curse: 0, rep: { guild: 1 } }, msg: "Корпус, щогла, гармати — як нові.", flag: "ship_repaired" },
      { text: "📢 Набрати людей (−10)", eff: { gold: -10, crew: [2, 4], karma: 0, curse: 0, rep: { brethren: 1 } }, msg: "Нові обличчя, нові руки, нові проблеми." },
      {
        text: "🗣️ Таверна (−5)", eff: { gold: -5, crew: 0, karma: 0, curse: 0 },
        msg: s => {
          if (s.curse > 3) return "Знахарка в кутку: 'Бачу тінь на тобі. Приходь — допоможу.'";
          if (!s.flags?.has("knows_bermuda")) return "П'яний капітан про місце, де зникають кораблі.";
          return "Звичайні піратські байки. Ром — непоганий.";
        },
        flag: s => s.curse > 3 ? "knows_healer" : null,
      },
    ],
  },
  {
    id: "port_nassau", scene: "port", title: "Нассау",
    text: "Губернатор пропонує помилування піратам.",
    requires: s => s.day > 10,
    choices: [
      { text: "📜 Прийняти помилування", eff: { gold: -30, crew: -2, karma: 4, curse: -3, rep: { crown: 4, brethren: -3 } }, msg: "Частина золота як 'податок'. Двоє йдуть. Але тепер ви — легальні." },
      { text: "🏴 Пограбувати порт", eff: { gold: [30, 60], crew: [-2, 0], karma: -4, curse: 2, rep: { crown: -4, brethren: 3 } }, msg: "Нассау горить. Ваше ім'я знає кожен." },
      { text: "💨 Повз", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Закон — не для вас." },
    ],
  },
  {
    id: "healer", scene: "port", title: "Знахарка",
    text: "Темна кімната. Свічки. Жінка з татуюваннями дивиться крізь вас.",
    requires: s => s.flags?.has("knows_healer") && s.curse >= 4,
    choices: [
      { text: "💰 Зцілення (−30)", eff: { gold: -30, crew: 0, karma: 0, curse: -4 }, msg: "'Прокляття — борг. Я зменшу, але не зітру.' Біль — і полегшення." },
      { text: "❓ Що зі мною?", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: s => `'${s.curse} шарів темряви. Кожен вибір — монета в скарбничку моря. Коли набереться — море прийде.'` },
      { text: "🚪 Піти", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "'Повернешся. Всі повертаються.'" },
    ],
  },
  // ── CONSEQUENCES ──
  {
    id: "martin_betrayal", scene: "open_sea", title: "Мартін зник",
    text: "Вранці його немає. На палубі — кров'ю написано слово.",
    requires: s => s.flags?.has("saved_martin") && s.karma < -2 && s.day > 10,
    choices: [
      { text: "📖 Прочитати", eff: { gold: -20, crew: -1, karma: 0, curse: 2 }, msg: "'Ти не заслуговуєш їх.' Забрав золото і одного матроса." },
      { text: "🔥 Стерти", eff: { gold: -20, crew: 0, karma: 0, curse: 0 }, msg: "Спалюєте дошку. Ніхто не бачив." },
    ],
  },
  {
    id: "martin_saves", scene: "storm", title: "Мартін знає шлях",
    text: "Шторм! Мартін дивиться на зірки крізь розрив у хмарах. 'Довірся мені.'",
    requires: s => s.flags?.has("saved_martin") && s.karma >= 0 && s.day > 8,
    choices: [
      { text: "🧭 Довіритися", eff: { gold: [10, 30], crew: 0, karma: 1, curse: 0 }, msg: "Веде крізь шторм як по шовку. Бухта зі скарбами на дні." },
      { text: "🚫 Я сам капітан", eff: { gold: 0, crew: -1, karma: 0, curse: 0 }, msg: "Мартін замовкає. Більше не пропонує допомогу." },
    ],
  },
  {
    id: "barret_betrayal", scene: "combat", title: "Баррет вдарив у спину!",
    text: "Серед ночі — гарматний постріл. 'Нічого особистого!'",
    requires: s => s.flags?.has("barret_alliance") && s.gold > 60 && s.day > 12,
    choices: [
      { text: "⚔️ Бій!", eff: { gold: [-20, 0], crew: [-3, -1], karma: 0, curse: 0 }, msg: "Зрада болить більше за рани." },
      { text: "💰 Відкупитися", eff: { gold: -40, crew: 0, karma: 0, curse: 0 }, msg: "'Бачиш? Ми ще домовляємося!' — сміється Баррет." },
      { text: "🤝 Запропонувати більше", eff: { gold: 0, crew: 0, karma: -1, curse: 0 }, msg: "'Разом візьмемо в десять разів більше.' — 'Добре. Але наступного разу — я капітан.'", flag: "barret_deal" },
    ],
  },
  {
    id: "village_ghost", scene: "ethereal", title: "Голос старійшини",
    text: "Вночі — шепіт. Мова, яку ви не знаєте, але розумієте: 'Повертай, що взяв.'",
    requires: s => s.flags?.has("village_curse"),
    choices: [
      { text: "💰 Повернути (−20)", eff: { gold: -20, crew: 0, karma: 3, curse: -3 }, msg: "Кидаєте золото в море у напрямку острова. Шепіт стихає. Полегшення." },
      { text: "🚫 Ігнорувати", eff: { gold: 0, crew: -1, karma: -1, curse: 3 }, msg: "Шепіт стає криком. Один матрос — з села — кидається за борт." },
      { text: "🙏 Вибачитись", eff: { gold: 0, crew: 0, karma: 2, curse: -1 }, msg: "Шепіт тихне. Не пробачення — але перемир'я." },
    ],
  },
  {
    id: "skeleton_crew", scene: "open_sea", title: "Команда на межі",
    text: "Троє лишилося. Вітрила провисли. Кермо крутиться саме.",
    requires: s => s.crew <= 3 && s.crew > 0 && s.day >= 5,
    choices: [
      { text: "💪 Працювати разом", eff: { gold: 0, crew: 0, karma: 1, curse: 0 }, msg: "Кожен за трьох. Повільно, але пливете. Щось змінилося між вами.", flag: "crew_bond" },
      { text: "💰 Обіцяти подвійну частку", eff: { gold: -15, crew: 0, karma: 0, curse: 0 }, msg: "Гроші мотивують. Але надовго?" },
      { text: "☠️ Прийняти долю", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: "Тіні з'являються біля штурвалу. Мертві матроси повертаються на вахту.", flag: "ghost_crew" },
    ],
  },
  {
    id: "crew_triumph", scene: "open_sea", title: "Сильна команда",
    text: "Повна палуба. Піратська пісня розрізає вітер. Корабель летить.",
    requires: s => s.crew >= 10 && s.day >= 5,
    choices: [
      { text: "🎉 Святкувати", eff: { gold: -10, crew: 1, karma: 1, curse: 0 }, msg: "Ром, танці, стрілянина в небо. Найкращий день на морі." },
      { text: "⚓ Тренувати команду", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Гарматні вправи. Абордажні навчання. Тепер це не банда. Це армія.", flag: "trained_crew" },
      { text: "🏴 Полювання на здобич", eff: { gold: [30, 60], crew: [-1, 0], karma: -2, curse: 0 }, msg: "З такою командою конвої тікають. Золото тече рікою." },
    ],
  },
  // ── MID-GAME CONSEQUENCES (days 8-14) ──
  {
    id: "reputation_precedes", scene: "open_sea", title: "Репутація",
    text: s => s.karma >= 3
      ? "Торговий корабель наближається. Прапор миру. 'Ви той самий капітан? Чули про вас.'"
      : "Торговий корабель тікає на всіх вітрилах. Вони вас впізнали.",
    requires: s => s.day >= 8 && s.day <= 14 && (s.karma >= 3 || s.karma <= -2),
    choices: [
      { text: "🤝 Мирна зустріч", eff: { gold: [10, 25], crew: 0, karma: 1, curse: 0, rep: { guild: 2, crown: 1 } }, msg: "Торгівля без крові. Інформація в подарунок.", flag: "merchant_contact" },
      { text: "🏴 Використати довіру", eff: { gold: [30, 50], crew: 0, karma: -3, curse: 1, rep: { guild: -3, crown: -1 } }, msg: "Обеззброєні. Легка здобич. Але слава йде попереду." },
      { text: "💬 Обмінятися новинами", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: s => s.curse >= 5 ? "Капітан блідне: 'Я бачу тінь за вами. Тікайте з цих вод.'" : "Війна між Англією та Іспанією. Конвої змінюють маршрути." },
    ],
  },
  {
    id: "cursed_waters", scene: "storm", title: "Прокляті води",
    text: "Компас крутиться. Зірки не ті. Море пахне сіркою.",
    requires: s => s.day >= 9 && s.curse >= 4,
    choices: [
      { text: "🧭 Довіритися приладам", eff: { gold: 0, crew: -1, karma: 0, curse: 1 }, msg: "Прилади брешуть. Один за бортом. Але ви вибираєтесь." },
      { text: "⭐ По зірках", eff: { gold: 0, crew: 0, karma: 0, curse: -1 }, msg: s => s.flags?.has("saved_martin") ? "Мартін читає зірки. Навіть крізь прокляття — шлях знайдено." : "Старий спосіб працює. Повільно, але вірно." },
      { text: "🌀 Здатися течії", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: "Течія несе до місця, яке не на жодній карті. Щось там чекає.", flag: "knows_bermuda" },
    ],
  },
  {
    id: "old_debt", scene: "port", title: "Старий борг",
    text: "В порту — знайоме обличчя. 'Ти мені винен, капітане.' Руки на рукоятках.",
    requires: s => s.day >= 10 && s.day <= 15,
    choices: [
      { text: "💰 Заплатити (−25)", eff: { gold: -25, crew: 0, karma: 1, curse: 0 }, msg: "Борг закрито. Рукостискання. Може, навіть союзник.", flag: "debt_paid" },
      { text: "⚔️ Бій", eff: { gold: 0, crew: [-2, -1], karma: -1, curse: 0 }, msg: "Кров у таверні. Перемога, але порт вас більше не вітає." },
      { text: "🗣️ Домовитися", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: s => s.flags?.has("merchant_contact") ? "Ваш торговий контакт ручається за вас. Борг відкладено." : "'Не маю грошей. Але маю інформацію.' Працює. Поки що.", flag: "debt_delayed" },
    ],
  },
  // ── DEEP SUPERNATURAL ──
  {
    id: "cursed_treasure", scene: "cave", title: "Печера скарбів",
    text: "Золото до стелі. Перлини, діаманти. І тиша. Абсолютна.",
    requires: s => s.flags?.has("ghost_map") || s.flags?.has("knows_temple"),
    choices: [
      { text: "💰 Все забрати", eff: { gold: [80, 150], crew: 0, karma: 0, curse: 5 }, msg: "Золото ТЕПЛЕ. Монети пульсують. Скільки б не брали — більше з'являється." },
      { text: "💍 Одну річ", eff: { gold: [20, 40], crew: 0, karma: 0, curse: 1 }, msg: "Перстень з рубіном. Ідеально сідає. Занадто ідеально." },
      { text: "🚫 Нічого", eff: { gold: 0, crew: 0, karma: 3, curse: -3 }, msg: "Печера... видихає? Повагу? Розчарування?" },
    ],
  },
  {
    id: "phantom_island", scene: "ethereal", title: "Острів-примара",
    text: "Білі дерева. Чорний пісок. Час тут — інший.",
    requires: s => s.flags?.has("saw_phantom_island") || s.curse >= 8,
    choices: [
      { text: "🏝️ Висадитися", eff: { gold: [0, 40], crew: 0, karma: 0, curse: 3 }, msg: "Ваші речі. Які ви ще не загубили. Майбутнє? Паралельне?", flag: "visited_phantom" },
      { text: "🔭 Спостерігати", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "На березі — ви. Махаєте собі рукою." },
      { text: "💨 Тікати", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Зникає, щойно відвертаєтесь." },
    ],
  },
  {
    id: "deep_temple", scene: "underwater", title: "Храм на дні",
    text: "Вода прозора до дна. Колони, арки, світло.",
    requires: s => s.flags?.has("temple_visited") || s.flags?.has("deep_watcher"),
    choices: [
      { text: "🤿 Пірнути", eff: { gold: [20, 60], crew: [-1, 0], karma: 0, curse: 4 }, msg: s => s.flags?.has("kraken_pact") ? "Кракен ескортує до входу. Всередині — не золото. Знання." : "Прекрасно і жахливо. Артефакт пульсує в руках." },
      { text: "🔔 Вдарити в дзвін", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: s => s.flags?.has("bell_rang") ? "Храм ВІДПОВІДАЄ. Колони світяться. Щось піднімається." : "Звук тоне у воді. Але вас почули." },
      { text: "🙏 Помолитися", eff: { gold: 0, crew: 0, karma: 2, curse: -2 }, msg: "Хтось слухає. Тиск слабшає. Прокляття відступає." },
    ],
  },
  {
    id: "mirror_sea", scene: "ethereal", title: "Д З Е Р К А Л Ь Н Е  М О Р Е",
    text: "Вода — ідеальне дзеркало. Ваш корабель відображується, але пливе в інший бік.",
    requires: s => s.curse >= 10,
    choices: [
      { text: "🪞 Стрибнути", eff: { gold: 0, crew: 0, karma: 0, curse: 5 }, msg: "Внизу — все навпаки. Ваша команда мертва. Ви безсмертний. Альтернатива чи пастка?" },
      { text: "💔 Розбити", eff: { gold: 0, crew: -1, karma: 0, curse: -3 }, msg: "Гармата у воду. Дзеркало тріскає. Хтось кричить — його відображення зникло." },
      { text: "🙈 Закрити очі", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: "Свій голос знизу: 'Ти не можеш тікати від себе вічно.'" },
    ],
  },
  {
    id: "dead_captain", scene: "ethereal", title: "К А П І Т А Н  П О В Е Р Н У В С Я",
    text: "Тінь на палубі. 'Це завжди був мій корабель.'",
    requires: s => s.curse >= 12,
    choices: [
      { text: "⚔️ Бий або йди", eff: { gold: 0, crew: -1, karma: 0, curse: -2 }, msg: "Меч крізь тінь. Відступає. 'Тимчасово.'" },
      { text: "🤝 Розділити владу", eff: { gold: [20, 40], crew: [1, 3], karma: 0, curse: 4 }, msg: "Мертвий капітан приводить мертву команду. Живі і мертві разом." },
      { text: "🚪 Віддати корабель", eff: { gold: -999, crew: 0, karma: 3, curse: -5 }, msg: "Шлюпка. Свобода від усього." },
    ],
  },
  {
    id: "doppelganger", scene: "ethereal", title: "В І Н  П О В Е Р Н У В С Я",
    text: "Ваш двійник. Команда не знає, хто справжній.",
    requires: s => s.flags?.has("met_double") && s.curse >= 8,
    choices: [
      { text: "⚔️ Бій", eff: { gold: 0, crew: -1, karma: 0, curse: -2 }, msg: "Вбиваєте його. Або він вас? Ви не впевнені." },
      { text: "❓ Хто ти?", eff: { gold: 0, crew: 0, karma: 0, curse: 3 }, msg: "'Я — ти з правильними виборами. Ти — помилка.' Зникає. Ви відчуваєте себе менше." },
      { text: "🤝 Прийняти", eff: { gold: 0, crew: 0, karma: 0, curse: 4 }, msg: "Обіймаєте себе. Кожен вибір, альтернатива, версія. Потім — темрява.", flag: "merged" },
    ],
  },
  {
    id: "galleon_found", scene: "underwater", title: "Затонулий галеон",
    text: "Координати — правильні. Іспанське золото на мілині.",
    requires: s => s.flags?.has("knows_galleon"),
    choices: [
      { text: "🤿 Пірнати", eff: { gold: [40, 90], crew: [-1, 0], karma: 0, curse: 2 }, msg: "Скелети тримають скрині, наче досі охороняють." },
      { text: "🔍 Обережно", eff: { gold: [15, 30], crew: 0, karma: 0, curse: 0 }, msg: "Тільки з поверхні. Скелети внизу починають ворушитися на заході." },
      { text: "📜 Шукати журнал", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "'Ми знайшли золото Ельдорадо. Золото знайшло нас. Воно не відпускає.'", flag: "eldorado_knowledge" },
    ],
  },
  {
    id: "bermuda_zone", scene: "ethereal", title: "Мертва зона",
    text: "Ні вітру, ні течії. Компас крутиться. Три порожні кораблі.",
    requires: s => s.flags?.has("knows_bermuda"),
    choices: [
      { text: "🔍 Обшукати", eff: { gold: [20, 50], crew: 0, karma: 0, curse: 3 }, msg: "На одному — тепла їжа. На іншому — журнал з завтрашньою датою. На третьому — ваше ім'я на щоглі." },
      { text: "🕯️ Запалити вогні", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "Вітер повертається — з усіх боків. Виходите кудись не туди." },
      { text: "🙏 Чекати світанку", eff: { gold: 0, crew: -1, karma: 0, curse: 2 }, msg: "Світанок через 18 годин. Сонце — не на сході. Один матрос збожеволів." },
    ],
  },

  // ── LOCATION-BOUND ENCOUNTERS ──

  // Havana (4,1) - smuggling hub
  {
    id: "havana_market", scene: "port", title: "Ринок Гавани",
    locationName: "Havana",
    text: "Найбільший чорний ринок Карибів. Тут купують і продають все.",
    choices: [
      { text: "📜 Купити ліцензію (−40)", eff: { gold: -40, crew: 0, karma: 0, curse: 0, item: "trade_license" }, msg: "Фальшива, але переконлива. Торгуйте вільно." },
      { text: "🗺️ Купити карту (−25)", eff: { gold: -25, crew: 0, karma: 0, curse: 0, item: "map_fragment" }, msg: "Половина карти. Десь є друга частина." },
      { text: "👂 Зібрати чутки", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Шепочуть про привидний флот на півдні.", flag: "ghost_fleet_rumor" },
    ],
  },

  // Nassau (14,2) - pirate republic
  {
    id: "nassau_tavern", scene: "port", title: "Таверна Нассау",
    locationName: "Nassau",
    text: "Піратська республіка. Тут закон один: хто сильніший, той правий.",
    choices: [
      { text: "🍺 Напоїти команду (−15)", eff: { gold: -15, crew: 1, karma: 0, curse: 0 }, msg: "Мораль на висоті. Двоє нових просяться на борт." },
      { text: "🖤 Купити чорну перлину (−50)", eff: { gold: -50, crew: 0, karma: 0, curse: 1, item: "black_pearl" }, msg: "Торговець зникає, щойно ви торкаєтесь перлини. Вона тепла." },
      { text: "📖 Читати оголошення", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Нагорода за вашу голову зросла.", flag: "wanted_nassau" },
    ],
  },

  // Tortuga (0,4) - freedom port
  {
    id: "tortuga_docks", scene: "port", title: "Причали Тортуги",
    locationName: "Tortuga",
    text: "Домашній порт. Тут завжди можна знайти ремонт, провіант та неприємності.",
    choices: [
      { text: "🔧 Ремонт корабля (−20)", eff: { gold: -20, crew: 0, karma: 0, curse: 0 }, msg: "Корпус латаний, але тримає. Ще поплаваємо.", flag: "ship_repaired" },
      { text: "🐚 Купити мушлю у шамана (−30)", eff: { gold: -30, crew: 0, karma: 0, curse: -1, item: "siren_shell" }, msg: "Шепоче колискову. Темрява відступає." },
      { text: "🍖 Поповнити запаси (−10)", eff: { gold: -10, crew: 0, karma: 1, curse: 0 }, msg: "Свіжа їжа, чиста вода. Команда вдячна." },
    ],
  },

  // Port Royal (10,6) - British stronghold
  {
    id: "port_royal_fort", scene: "port", title: "Форт Порт-Роялу",
    locationName: "Port Royal",
    text: "Британська фортеця. Ризиковано, але тут найкращі товари.",
    choices: [
      { text: "💊 Купити ліки (−35)", eff: { gold: -35, crew: 0, karma: 0, curse: 0, item: "medicine_chest" }, msg: "Справжні англійські ліки. Команда буде здоровішою." },
      { text: "🤝 Запропонувати мир", eff: { gold: 0, crew: 0, karma: 2, curse: 0 }, msg: "Губернатор слухає. Не вірить, але слухає.", flag: "british_contact" },
      { text: "⚔️ Пограбувати склад", eff: { gold: [40, 70], crew: [-2, 0], karma: -3, curse: 0 }, msg: "Золото є. Але тепер увесь флот шукає вас.", flag: "port_royal_enemy" },
    ],
  },

  // Cartagena (5,8) - Spanish gold
  {
    id: "cartagena_treasury", scene: "port", title: "Скарбниця Картахени",
    locationName: "Cartagena",
    text: "Іспанське золото стікає сюди з усієї Америки. Фортеця неприступна... майже.",
    choices: [
      { text: "🗝️ Шукати таємний хід", eff: { gold: [20, 60], crew: 0, karma: -1, curse: 0 }, msg: "Старий тунель під стіною. Вдалось вхопити мішок." },
      { text: "📜 Торгувати легально", eff: { gold: [10, 25], crew: 0, karma: 1, curse: 0 }, msg: "Іспанці підозрілі, але гроші не пахнуть." },
      { text: "🗺️ Знайти карту (−20)", eff: { gold: -20, crew: 0, karma: 0, curse: 0, item: "map_fragment" }, msg: "Старий картограф продає другий шматок." },
    ],
  },

  // Shadow Cave (6,6) - dark magic
  {
    id: "shadow_cave_ritual", scene: "cave", title: "Ритуал у Печері Тіней",
    locationName: "Shadow Cave",
    text: "Вогні на стінах. Шаман із кістяною маскою чекає.",
    choices: [
      { text: "🪆 Прийняти дар", eff: { gold: 0, crew: 0, karma: 0, curse: 3, item: "voodoo_doll" }, msg: "Лялька з вашим волоссям. Відчуваєте зв'язок з чимось давнім." },
      { text: "🏮 Взяти ліхтар", eff: { gold: 0, crew: 0, karma: 0, curse: 2, item: "ghost_lantern" }, msg: "Світить без вогню. Показує те, що сховано." },
      { text: "🚶 Піти", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Деякі двері краще не відчиняти." },
    ],
  },

  // Mary's Wreck (8,3) - salvage
  {
    id: "marys_wreck_dive", scene: "underwater", title: "Уламки 'Святої Марії'",
    locationName: "Mary's Wreck",
    text: "Скелет корабля на дні. Тут загинуло 200 душ. Золото блищить між ребрами корпусу.",
    choices: [
      { text: "🏊 Пірнути за золотом", eff: { gold: [30, 80], crew: [-2, 0], karma: 0, curse: 2 }, msg: "Золото є. Але щось тягне ногу. Ледь вирвалися." },
      { text: "🦷 Шукати реліквії", eff: { gold: 0, crew: 0, karma: 0, curse: 1, item: "kraken_tooth" }, msg: "Знаходите зуб, більший за вашу голову. Кракен був тут." },
      { text: "🙏 Помолитися за загиблих", eff: { gold: 0, crew: 0, karma: 3, curse: -1 }, msg: "На мить бачите обличчя у воді. Вони посміхаються. Дякують." },
    ],
  },

  // Blood Reefs (7,2) - dangerous waters
  {
    id: "blood_reefs_passage", scene: "storm", title: "Рифи Крові",
    locationName: "Blood Reefs",
    text: "Червона вода. Рифи розрізають дно кораблів, як ніж масло. Але тут ховається скарб.",
    choices: [
      { text: "⛵ Повільно лавірувати", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Обережність рятує. Проходите без втрат." },
      { text: "💎 Пірнути до рифів", eff: { gold: [25, 55], crew: [-1, 0], karma: 0, curse: 1 }, msg: "Корали ріжуть руки. Але серед них — щось цінне." },
      { text: "🗝️ Шукати затонулий храм", eff: { gold: 0, crew: 0, karma: 0, curse: 2, item: "ancient_key" }, msg: "На дні — руїни. Серед каменів — ключ, що світиться." },
    ],
  },

  // Coral Reefs (13,8) - natural beauty
  {
    id: "coral_reefs_garden", scene: "underwater", title: "Коралові Сади",
    locationName: "Coral Gardens",
    text: "Живі корали усіх кольорів. Риби-папуги, черепахи, і щось більше в глибині.",
    choices: [
      { text: "🐢 Спостерігати", eff: { gold: 0, crew: 0, karma: 2, curse: -1 }, msg: "Краса заспокоює. Прокляття слабшає перед природою." },
      { text: "🪸 Зібрати корали (−5)", eff: { gold: -5, crew: 0, karma: -1, curse: 0 }, msg: "Красиві, але мертві в ваших руках." },
      { text: "🏊 Пірнути глибше", eff: { gold: [10, 30], crew: 0, karma: 0, curse: 1 }, msg: "Знаходите затонулу скриню. Всередині — монети та записка." },
    ],
  },

  // ── NEW ENCOUNTER TYPES ──

  // Navigation/discovery encounters
  {
    id: "crossroads_current", scene: "open_sea", title: "Течія",
    text: "Сильна течія несе на схід. Можна боротися або піддатися.",
    choices: [
      { text: "🌊 Піддатися течії", eff: { gold: 0, crew: 0, karma: 0, curse: 0, reveal: [14, 2] }, msg: "Течія виносить до нових берегів. Бачите щось на горизонті." },
      { text: "💪 Боротися", eff: { gold: 0, crew: -1, karma: 0, curse: 0 }, msg: "Залишаєтесь на курсі. Але команда втомлена." },
      { text: "⚓ Зачекати", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Течія вщухає. Нічого не сталось." },
    ],
  },
  {
    id: "old_map_bottle", scene: "open_sea", title: "Пляшка з картою",
    text: "Пляшка з-під рому. Всередині — шматок шкіри з малюнком.",
    choices: [
      { text: "🗺️ Розгорнути", eff: { gold: 0, crew: 0, karma: 0, curse: 0, item: "map_fragment", reveal: [6, 6] }, msg: "Позначено печеру і слово: 'НЕ ЗАХОДЬ'." },
      { text: "💨 Викинути", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Чужі карти — чужі проблеми." },
    ],
  },
  {
    id: "mirage_island", scene: "island", title: "Острів-привид",
    text: "Острів, якого немає на жодній карті. Пальми, пісок, і дзвін дзвону.",
    choices: [
      { text: "🏝️ Висадитись", eff: { gold: [10, 40], crew: 0, karma: 0, curse: 1, reveal: [5, 8] }, msg: "Знаходите скриню на березі. Острів зникає за спиною." },
      { text: "🔭 Спостерігати здалеку", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Острів тане, як туман. Був він взагалі?" },
    ],
  },
  {
    id: "whale_guide", scene: "open_sea", title: "Кит-провідник",
    text: "Величезний кит пливе поруч. Здається, він чекає, що ви підете за ним.",
    choices: [
      { text: "🐋 Слідувати", eff: { gold: 0, crew: 0, karma: 1, curse: 0, reveal: [13, 8] }, msg: "Кит веде до чистих вод. Відкриваєте нову область карти." },
      { text: "🎣 Полювати", eff: { gold: [15, 30], crew: 0, karma: -2, curse: 1 }, msg: "Ворвань коштує грошей. Але щось дивиться з глибини." },
      { text: "👋 Помахати", eff: { gold: 0, crew: 0, karma: 1, curse: 0 }, msg: "Кит видає звук. Команда сміється. Хороший день." },
    ],
  },

  // Pure narrative encounters
  {
    id: "dream_sequence", scene: "ethereal", family: "ambient", phase: "mid", exclusivityGroup: "dream", title: "Сон капітана",
    text: "Снится: ви під водою. Дихаєте. Місто з перламутру.",
    requires: s => s.curse >= 5,
    choices: [
      { text: "🏛️ Увійти в місто", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Запам'ятовуєте координати. Прокидаєтесь з мокрим волоссям.", flag: "dream_city" },
      { text: "🏊 Пливти вгору", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Прокидаєтесь. Просто сон. Напевно.", hidden: true },
      { text: "👁️ Шукати джерело голосу", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "Хтось знає ваше справжнє ім'я. Те, яке ви забули.", flag: "true_name", hidden: true },
    ],
  },
  {
    id: "crew_stories", scene: "open_sea", title: "Вечірні історії",
    text: "Штиль. Команда збирається на палубі і ділиться спогадами.",
    choices: [
      { text: "👂 Слухати", eff: { gold: 0, crew: 0, karma: 1, curse: 0 }, msg: "Кожен тікав від чогось. Тепер вони тут. Це достатньо.", hidden: true },
      { text: "📖 Розповісти свою", eff: { gold: 0, crew: 1, karma: 0, curse: 0 }, msg: "Вони дивляться інакше. З повагою. Або зі страхом.", hidden: true },
      { text: "🌙 Дивитися на зорі", eff: { gold: 0, crew: 0, karma: 0, curse: -1 }, msg: "Тиша. Спокій. Море не завжди вороже.", hidden: true },
    ],
  },
  {
    id: "dead_calm", scene: "open_sea", title: "Мертвий штиль",
    text: "Вітер зник. Море як дзеркало. Відображення хмар нерухоме.",
    choices: [
      { text: "⏳ Чекати", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Вітер повертається через годину. Все як звичайно." },
      { text: "🚣 Веслувати", eff: { gold: 0, crew: -1, karma: 0, curse: 0 }, msg: "Повільно, але рухаємось. Команда ниє, але розуміє." },
      { text: "🎵 Заспівати", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Пісня розноситься по воді. Хтось далеко відповідає.", flag: "sea_song", hidden: true },
    ],
  },
  {
    id: "albatross", scene: "open_sea", title: "Альбатрос",
    text: "Величезний птах кружляє над щоглою. Моряки вірять — це душа загиблого.",
    choices: [
      { text: "🍞 Погодувати", eff: { gold: 0, crew: 0, karma: 2, curse: -1 }, msg: "Сідає на руку. Легкий, як вітер. Команда заспокоюється." },
      { text: "🏹 Стріляти", eff: { gold: 0, crew: 0, karma: -3, curse: 2 }, msg: "Падає. Команда мовчить. Ви відчуваєте — це була помилка.", flag: "killed_albatross" },
      { text: "👀 Спостерігати", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Кружляє і летить на захід. Може, там земля." },
    ],
  },

  // Chain encounters
  {
    id: "merchant_mysterious", scene: "port", family: "quest", exclusivityGroup: "mysterious_merchant", title: "Таємничий торговець",
    text: "Зникає в тінях, щойно ви відвертаєтесь. Пропонує 'те, чого бажаєте найбільше'.",
    choices: [
      { text: "💰 'Золото'", eff: { chain: "merchant_gold_test" }, msg: "Посміхається..." },
      { text: "⚓ 'Безпечний порт'", eff: { chain: "merchant_safety_test" }, msg: "Хитає головою..." },
      { text: "🚶 Пройти повз", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Мудре рішення. Або боягузливе. Хто знає." },
    ],
  },
  {
    id: "merchant_gold_test", scene: "port", title: "Ціна бажання",
    text: "'Золото? Легко. Але щось візьму натомість.' Посміхається.",
    requires: () => false,
    choices: [
      { text: "🤝 Погодитись", eff: { gold: 100, crew: 0, karma: 0, curse: 4 }, msg: "Кишені повні. Але тепер бачите тіні краєм ока." },
      { text: "❌ Відмовитись", eff: { gold: 0, crew: 0, karma: 1, curse: 0 }, msg: "'Розумний.' Зникає. Золото на підлозі — мідне." },
    ],
  },
  {
    id: "merchant_safety_test", scene: "port", title: "Ціна спокою",
    text: "'Безпечний порт? Можу. Але безпека коштує пам'яті.' Очі як ртуть.",
    requires: () => false,
    choices: [
      { text: "🤝 Погодитись", eff: { gold: 0, crew: 2, karma: 0, curse: 3 }, msg: "Забуваєте щось важливе. Але команда в безпеці. Поки що." },
      { text: "❌ Відмовитись", eff: { gold: 0, crew: 0, karma: 1, curse: 0 }, msg: "'Всі відмовляються. Спочатку.' Зникає в тіні, якої не повинно бути." },
    ],
  },
  {
    id: "shipwreck_survivors", scene: "open_sea", title: "Уламки корабля",
    text: "Дошки, мотузки, і троє людей на плоту. Вони мовчать і дивляться.",
    choices: [
      { text: "🆘 Підібрати", eff: { crew: 2, chain: "survivors_story" }, msg: "Вони піднімаються на борт..." },
      { text: "🔍 Обшукати уламки", eff: { gold: [10, 25], crew: 0, karma: -1, curse: 0 }, msg: "Знаходите скриньку. Люди на плоту дивляться мовчки." },
      { text: "💨 Пропливти", eff: { gold: 0, crew: 0, karma: -2, curse: 0 }, msg: "Крики. Потім тиша. Команда не дивиться вам в очі." },
    ],
  },
  {
    id: "survivors_story", scene: "open_sea", title: "Історія врятованих",
    text: "'Наш капітан знайшов скарб,' каже старший. 'Скарб знайшов його.'",
    requires: () => false,
    choices: [
      { text: "📍 Де саме?", eff: { gold: 0, crew: 0, karma: 0, curse: 0, reveal: [8, 3] }, msg: "Показує на карті. Місце, де затонув їхній корабель. Там щось є." },
      { text: "⚠️ Що сталось?", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "'Золото кликало з води. Капітан пірнув. Не піднявся. Корабель почав тонути сам.'", flag: "cursed_treasure_warning" },
      { text: "🤫 Не питати", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Мовчать. Дивляться на воду. Один шепоче молитву." },
    ],
  },

  // ── LATE-GAME CLIMAX (days 17-19) ──
  {
    id: "final_reckoning", scene: "ethereal", family: "setpiece", phase: "late", weight: 0.8, title: "Голос моря",
    text: s => {
      if (s.curse >= 10) return "Море говорить вашим голосом. 'Час обирати. Залишитися чи повернутися?'";
      if (s.karma >= 5) return "Золоте сяйво на горизонті. Берег? Чи щось більше?";
      if (s.karma <= -3) return "Чорні хмари формують обличчя. Ваше обличчя. Час платити.";
      return "Останній захід сонця перед кінцем. Команда чекає вашого слова.";
    },
    requires: s => s.day >= 17,
    choices: [
      { text: "🌅 Курс додому", eff: { gold: 0, crew: 0, karma: 2, curse: -2 }, msg: s => s.flags?.has("crew_bond") ? "Команда аплодує. Ви пливете разом. Нарешті — разом." : "Вітрила повні. Дім чекає. Може." },
      { text: "🌊 Далі в невідоме", eff: { gold: [20, 50], crew: -1, karma: -1, curse: 2 }, msg: s => s.flags?.has("kraken_pact") ? "Кракен розчищає шлях. Попереду — те, що ніхто не бачив." : "Один матрос стрибає. Решта мовчить. Але ви не зупиняєтесь." },
      { text: "⚖️ Відпустити команду", eff: { gold: -20, crew: -3, karma: 3, curse: -1 }, msg: "Шлюпка з добровольцями відпливає. Легше на душі. Важче на кораблі." },
    ],
  },
  {
    id: "sea_judges", scene: "ethereal", family: "setpiece", phase: "late", weight: 0.8, title: "Суд морів",
    text: s => {
      const crimes = [s.flags?.has("village_curse") && "село", s.flags?.has("arms_dealer_enemy") && "зброяр", s.flags?.has("port_royal_enemy") && "Порт-Ройял"].filter(Boolean);
      return crimes.length > 0
        ? `Привиди з'являються на палубі. Кожен — обличчя з минулого. ${crimes.join(", ")}. Вимагають відповіді.`
        : "Тіні збираються на палубі. Хтось зважує ваші вчинки.";
    },
    requires: s => s.day >= 18 && s.curse >= 5,
    choices: [
      { text: "🙏 Визнати провину", eff: { gold: -30, crew: 0, karma: 3, curse: -4 }, msg: "Золото за кожен гріх. Привиди кивають і розчиняються. Легше дихати." },
      { text: "💀 Кинути виклик", eff: { gold: 0, crew: -2, karma: -2, curse: 3 }, msg: "Двоє падають. Але ви стоїте. Море запам'ятає цю зухвалість." },
      { text: "🪞 Показати себе справжнього", eff: { gold: 0, crew: 0, karma: 0, curse: -2 }, msg: s => s.flags?.has("met_double") ? "Двійник стоїть поряд. Разом ви — повна картина. Суд задоволений." : "Тіні дивляться. Кивають. Може, ви чесніший, ніж думали.", hidden: true },
    ],
  },

  // Item-gated encounters
  {
    id: "ghost_fleet_contact", scene: "ethereal", title: "Привидний флот",
    text: "Сірі вітрила на горизонті. Кораблі, яких не повинно бути.",
    requires: s => s.flags.has("ghost_fleet_rumor"),
    choices: [
      { text: "🏮 Підняти ліхтар", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: "Флот повертає до вас. Мертвий адмірал салютує.", flag: "ghost_fleet_allied", requires_item: "ghost_lantern" },
      { text: "⚔️ Приготуватися до бою", eff: { gold: 0, crew: [-2, 0], karma: 0, curse: 3 }, msg: "Ядра проходять крізь їхні корпуси. Вони сміються." },
      { text: "🙏 Помолитися", eff: { gold: 0, crew: 0, karma: 1, curse: 1 }, msg: "Флот проходить повз. Один з них киває." },
    ],
  },
  {
    id: "pearl_merchant", scene: "port", title: "Колекціонер перлин",
    text: "Старий з моноклем. 'Маєте щось цікаве?' Дивиться на ваші кишені.",
    choices: [
      { text: "🖤 Продати чорну перлину", eff: { gold: 150, crew: 0, karma: 0, curse: -2, loseItem: "black_pearl" }, msg: "Очі блищать. 'Нарешті...' Платить не торгуючись.", requires_item: "black_pearl" },
      { text: "🗺️ Показати карту", eff: { gold: 30, crew: 0, karma: 0, curse: 0, loseItem: "map_fragment" }, msg: "'Непогано, непогано.' Купує, але без ентузіазму.", requires_item: "map_fragment" },
      { text: "🤷 Нічого немає", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "'Шкода. Повертайтесь, коли знайдете.' Зникає за рогом." },
    ],
  },
  {
    id: "voodoo_ritual_encounter", scene: "cave", title: "Ритуал вуду",
    text: "Барабани в темряві. Коло з кісток. Лялька пульсує у вашій кишені.",
    requires: s => s.curse >= 4,
    choices: [
      { text: "🪆 Використати ляльку", eff: { gold: 0, crew: 0, karma: -2, curse: -3, loseItem: "voodoo_doll" }, msg: "Лялька згорає. Прокляття слабшає. Але щось інше прокидається.", requires_item: "voodoo_doll" },
      { text: "🔥 Спалити коло", eff: { gold: 0, crew: 0, karma: 1, curse: 1 }, msg: "Вогонь не хоче горіти. Потім не хоче гаснути." },
      { text: "🚶 Тікати", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Барабани слідкують за вами ще дві години." },
    ],
  },

  // Random events with non-standard outcomes
  {
    id: "bioluminescence", scene: "open_sea", title: "Світіння моря",
    text: "Вода горить блакитним вогнем. Кожен рух весла — спалах світла.",
    choices: [
      { text: "🌊 Пірнути", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Під водою — як у зоряному небі. Запам'ятаєте до кінця життя.", hidden: true },
      { text: "🫙 Зібрати воду", eff: { gold: 5, crew: 0, karma: 0, curse: 0 }, msg: "Світиться ще годину. Потім гасне. Але виглядає красиво у пляшці." },
      { text: "🎵 Заспівати для моря", eff: { gold: 0, crew: 0, karma: 2, curse: -1 }, msg: "Світіння пульсує в ритм пісні. Команда завмирає від краси.", hidden: true },
    ],
  },
  {
    id: "sea_monster_baby", scene: "open_sea", title: "Дитинча морського чудовиська",
    text: "Щось велике і маленьке одночасно бовтається біля борту. Плаче.",
    choices: [
      { text: "🍞 Погодувати", eff: { gold: -5, crew: 0, karma: 2, curse: 0 }, msg: "Їсть із рук. Пірнає. Через хвилину — величезна тінь під кораблем. Мати дякує?", flag: "monster_ally" },
      { text: "🏹 Прогнати", eff: { gold: 0, crew: 0, karma: -1, curse: 1 }, msg: "Тікає. Крик під водою. Корабель тремтить. Мати НЕ дякує.", flag: "monster_enemy" },
      { text: "🔬 Вивчити", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Луска як опал. Три ряди зубів. Очі як у людини. Пам'ятає вас.", hidden: true },
    ],
  },
  {
    id: "floating_market", scene: "open_sea", title: "Плавучий ринок",
    text: "Десяток човнів, зв'язаних разом. Торгують усім: від фруктів до пророцтв.",
    choices: [
      { text: "🔮 Купити пророцтво (−10)", eff: { gold: -10, crew: 0, karma: 0, curse: 0 }, msg: "'На 15-й день стережись води.' Корисно? Хто знає.", flag: "prophecy_water" },
      { text: "🍎 Купити їжу (−5)", eff: { gold: -5, crew: 0, karma: 1, curse: 0 }, msg: "Свіжі фрукти! Команда щаслива." },
      { text: "💰 Торгувати", eff: { gold: [10, 30], crew: 0, karma: 0, curse: 0 }, msg: "Вдала угода. Ваша репутація торговця зростає." },
    ],
  },
  {
    id: "compass_malfunction", scene: "open_sea", title: "Компас збожеволів",
    text: "Стрілка крутиться, як вітряк. Сонце — не на своєму місці. Або ви — не на своєму?",
    choices: [
      { text: "🧭 Довіритися компасу", eff: { gold: 0, crew: 0, karma: 0, curse: 0, reveal: [7, 2] }, msg: "Компас веде кудись. Бачите нову ділянку карти.", requires_item: "cursed_compass" },
      { text: "⭐ Навігувати за зорями", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Старий спосіб працює. Тримаємось курсу." },
      { text: "🎲 Навмання", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "Пливемо, куди несе. Бог морів вирішить." },
    ],
  },

  // ── DELAYED EFFECTS ──

  {
    id: "rescued_spy", scene: "open_sea", title: "Порятунок у штормі",
    text: "Людина на уламку. Кричить про допомогу. Одяг занадто гарний для моряка.",
    choices: [
      { text: "🆘 Врятувати", eff: { crew: 1, delay: { daysLater: 5, encounterId: "spy_betrayal", hint: "Новий матрос дивно себе поводить..." } }, msg: "Дякує. Каже, що колишній навігатор. Занадто вдячний?" },
      { text: "💨 Пропливти", eff: { gold: 0, crew: 0, karma: -1, curse: 0 }, msg: "Крики стихають. Тиша." },
    ],
  },
  {
    id: "spy_betrayal", scene: "combat", title: "Зрада!",
    text: "'Навігатор' виявився шпигуном Королівського флоту. Вночі подає сигнал.",
    requires: () => false,
    choices: [
      { text: "⚔️ Схопити зрадника", eff: { gold: 0, crew: -1, karma: 0, curse: 0 }, msg: "В останню мить! Флот не побачив сигналу." },
      { text: "🏃 Тікати в темряву", eff: { gold: 0, crew: -2, karma: 0, curse: 0 }, msg: "Британці вже поруч. Втрачаєте двох у хаосі." },
    ],
  },
  {
    id: "cursed_cargo", scene: "port", title: "Вигідна пропозиція",
    text: "Купець пропонує перевезти запечатану скриню. Платить щедро. 'Тільки не відкривайте.'",
    choices: [
      { text: "📦 Погодитися (50 золота)", eff: { gold: 50, delay: { daysLater: 3, encounterId: "cargo_awakens", hint: "Скриня видає звуки вночі..." } }, msg: "Скриня важка і теплішає на дотик. Гроші хороші." },
      { text: "🔍 Відкрити при ньому", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: "Всередині — порожнеча, яка дивиться на вас. Купець тікає." },
      { text: "❌ Відмовитися", eff: { gold: 0, crew: 0, karma: 1, curse: 0 }, msg: "Щось у його очах каже, що ви зробили правильний вибір." },
    ],
  },
  {
    id: "cargo_awakens", scene: "ethereal", title: "Скриня прокидається",
    text: "Опівночі скриня відкривається сама. Зелене світло заливає трюм. Команда кричить.",
    requires: () => false,
    choices: [
      { text: "🗡️ Знищити вміст", eff: { gold: -20, crew: 0, karma: 0, curse: 2 }, msg: "Руйнуєте щось давнє. Воно не хоче помирати. Але помирає." },
      { text: "🌊 Викинути за борт", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "Скриня тоне. Зелене світло горить під водою ще годину." },
      { text: "👁️ Подивитися всередину", eff: { gold: 0, crew: 0, karma: 0, curse: 4, item: "black_pearl" }, msg: "Бачите місто під водою. Перлина лежить посередині. Ви берете її." },
    ],
  },
  {
    id: "old_friend", scene: "port", family: "quest", exclusivityGroup: "old_friend", title: "Старий знайомий",
    text: "Людина з минулого. Посміхається. 'Маю справу. Зустрінемось через три дні на рифах.'",
    choices: [
      { text: "🤝 Погодитися", eff: { gold: 0, crew: 0, karma: 0, curse: 0, delay: { daysLater: 3, encounterId: "old_friend_trap" } }, msg: "'Не запізнюйся.' Зникає в натовпі.", flag: "old_friend_deal" },
      { text: "🤔 Розпитати детальніше", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "'Менше знаєш — краще спиш.' Посміхається ширше. Щось не так." },
      { text: "❌ Відмовити", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Посмішка зникає. 'Шкода. Був би непоганий бізнес.' Іде." },
    ],
  },
  {
    id: "old_friend_trap", scene: "combat", title: "Засідка!",
    text: "На рифах чекають три кораблі. Ваш 'старий знайомий' стоїть на борту флагмана. Це пастка.",
    requires: () => false,
    choices: [
      { text: "⚔️ Прориватися", eff: { gold: 0, crew: [-3, -1], karma: 0, curse: 0 }, msg: "Прорвались! Але ціна висока. Більше ніяких 'старих знайомих'." },
      { text: "🏳️ Переговори", eff: { gold: [-30, -20], crew: 0, karma: 0, curse: 0 }, msg: "Хоче грошей. Платите і пливете. Дешевше, ніж могло бути." },
      { text: "🌫️ Втекти в туман", eff: { gold: 0, crew: -1, karma: 0, curse: 1 }, msg: "Туман з'являється, наче на замовлення. Один матрос падає за борт у хаосі." },
    ],
  },

  // Item-unlocked encounters
  {
    id: "siren_sanctuary", scene: "underwater", title: "Притулок сирени",
    text: "Мушля в кишені тягне вниз. Під водою — місто з перлів. Сирена чекає.",
    requires: s => s.inventory.includes("siren_shell") && s.day >= 5,
    choices: [
      { text: "🐚 Повернути мушлю", eff: { gold: 0, crew: 0, karma: 3, curse: -3, loseItem: "siren_shell" }, msg: "Сирена співає. Прокляття тане. Ви чуєте океан по-іншому.", flag: "siren_bond" },
      { text: "🎶 Заспівати разом", eff: { gold: 0, crew: 0, karma: 2, curse: -1 }, msg: "Голоси зливаються. Щось змінилося в серці. Мушля тепліє.", flag: "siren_bond" },
      { text: "💎 Попросити скарб", eff: { gold: [60, 100], crew: 0, karma: -2, curse: 2 }, msg: "Перли сипляться, але очі сирени гаснуть. Більше не покличе." },
    ],
  },
  {
    id: "kraken_pact", scene: "kraken", title: "Заклик глибини",
    text: "Зуб кракена пульсує. Море розступається. Велике око дивиться знизу.",
    requires: s => s.inventory.includes("kraken_tooth") && s.day >= 8,
    choices: [
      { text: "🦷 Повернути зуб", eff: { gold: 0, crew: 0, karma: 0, curse: -2, loseItem: "kraken_tooth" }, msg: "Кракен забирає зуб. Щупальце торкається корпусу. Пакт укладено. Глибина захистить вас.", flag: "kraken_pact" },
      { text: "🗡️ Вимагати данину", eff: { gold: [80, 130], crew: [-2, 0], karma: -3, curse: 3 }, msg: "Кракен кидає уламки затонулих кораблів. Золото і кістки. Але його гнів росте." },
      { text: "🚢 Тікати", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "Зуб тріскає. Ви відчуваєте розчарування з глибини." },
    ],
  },
  {
    id: "temple_vault", scene: "cave", title: "Храм забутих",
    text: "Ключ відкриває двері, яких хвилину тому не було. Всередині — давній храм, засипаний піском.",
    requires: s => s.inventory.includes("ancient_key") && s.day >= 6,
    choices: [
      { text: "🗝️ Відкрити сховище", eff: { gold: [80, 150], crew: 0, karma: 0, curse: 2, loseItem: "ancient_key" }, msg: "Золото давніх. Ключ розсипається на пил. Щось шепоче 'дякую' або 'нарешті'." },
      { text: "📖 Прочитати стіни", eff: { gold: 0, crew: 0, karma: 2, curse: -1 }, msg: "Історія загиблої цивілізації. Знання важче за золото. Ви розумієте море краще.", flag: "temple_knowledge" },
      { text: "🚪 Зачинити двері", eff: { gold: 0, crew: 0, karma: 1, curse: 0 }, msg: "Деякі речі мають залишитися замкненими. Ключ зникає. Спокій." },
    ],
  },

  // ── ПОВТОРЮВАНІ НПС ──

  // СТАРІ КОСТІ - таємничий торговець
  {
    id: "npc_bones_1", scene: "port", family: "relationship", phase: "early", title: "Старі Кості",
    text: "Скелетно худий чоловік за кутовим столом. Одне око каламутне, інше бачить забагато. 'Вперше в цих водах, Капітане? Сідайте. Маю щось для вас.'",
    choices: [
      { text: "💰 Купити його товар (-15)", eff: { gold: -15, rep: { guild: 1 } }, msg: "'Компас, що вказує на жаль.' Сміється. Марний? Чи ні? Його ціни завжди дивні.", flag: "met_bones" },
      { text: "🍺 Поставити йому випити (-5)", eff: { gold: -5 }, msg: "'Я плавав кожним морем, що існує, і кількома, що ні.' Він знає речі. Речі, які живий знати не повинен.", flag: "met_bones" },
      { text: "🚶 Проігнорувати", eff: {}, msg: "Він дивиться, як ви йдете. 'Ми ще зустрінемось. Завжди зустрічаємось.'" },
    ],
  },
  {
    id: "npc_bones_2", scene: "port", family: "relationship", phase: "mid", title: "Знову Старі Кості",
    text: "Інший порт, той самий куток. Він махає, ніби чекав. 'Казав же. Сідайте. Маю пропозицію.'",
    requires: s => s.flags.has("met_bones") && s.day >= 6,
    choices: [
      { text: "💼 Почути пропозицію", eff: { gold: 0, rep: { guild: 1 } }, msg: "'Доставте запечатану скриньку на Ісла де лос Муертос. Не відкривайте. 100 золотих при доставці.' Ковзає її по столу.", flag: "bones_package" },
      { text: "❓ Хто ви насправді?", eff: {}, msg: "'Я людина між угодами. Рукостискання, якого ніхто не бачить. Я цим займаюся довше, ніж ви б повірили.' Посміхається занадто багатьма зубами.", flag: "bones_curious" },
      { text: "🚫 Більше ніяких угод", eff: {}, msg: "'Всі так кажуть. А потім море стає пустим і вони повертаються.' П'є. Ви відчуваєте погляд годинами." },
    ],
  },
  {
    id: "npc_bones_3", scene: "port", family: "relationship", phase: ["mid", "late"], title: "Таємниця Старих Кісток",
    text: s => s.flags.has("bones_package")
      ? "'Ви ще маєте мою скриньку? Добре. Зміна планів. Відкрийте.' Його здорове око блищить."
      : "'Чую, ви мною цікавитесь. Розумний капітан. Небезпечний капітан.'",
    requires: s => (s.flags.has("bones_package") || s.flags.has("bones_curious")) && s.day >= 10,
    choices: [
      { text: "📦 Відкрити скриньку", eff: { gold: 0, curse: 2, item: "ghost_lantern", rep: { guild: 2 } }, msg: "Всередині: ліхтар, що горить холодним вогнем. 'Плата за довіру. Він показує те, що живі не бачать. Я знаю. Я давно перестав бути одним з них.'", flag: "bones_truth", requires_flag: "bones_package" },
      { text: "❓ Тиснути на правду", eff: { gold: 0, curse: 1 }, msg: "'Я потонув у 1643 році. Море повернуло мене, бо у мене залишились борги. Кожному порту потрібен посередник, навіть портам між світами.' Він не жартує.", flag: "bones_truth" },
      { text: "🤝 Запропонувати партнерство", eff: { gold: [20, 50], rep: { guild: 3, brethren: 1 } }, msg: "'Партнер? Ніхто не пропонував двісті років.' Його сміх як тріщить лід. 'Гаразд. Коли вам потрібне неможливе, назвіть моє ім'я на будь-якому причалі. Але ціна буде... креативна.'", flag: "bones_ally" },
      { text: "💨 Піти", eff: {}, msg: "Він не намагається зупинити вас. Але відтепер ви бачите його в кожному порту. Стоїть у тіні, дивиться. Чекає." },
    ],
  },
  {
    id: "npc_bones_4", scene: "port", family: "relationship", phase: "late", title: "Прощання Старих Кісток",
    text: "'Останній раз, Капітане. Мої борги майже сплачені. Маю одну останню річ. Щось, що ношу з 1643 року.'",
    requires: s => s.flags.has("bones_truth") && s.day >= 14,
    choices: [
      { text: "🎁 Прийняти подарунок", eff: { gold: 0, curse: -3, karma: 2, rep: { guild: 2 } }, msg: "Перлина. Чорна і тепла. 'Вона поглинає жаль. Я наповнював її століттями. Тепер вона порожня. Як і я.' Він зникає. Стілець, напій, ні людини.", flag: "bones_farewell" },
      { text: "🤝 Допомогти йому піти", eff: { karma: 3, curse: -2 }, msg: "'Ніхто ніколи не пропонував...' Його око зволожується. Друге теж. 'Скажіть моє ім'я. Справжнє.' Ви не знаєте його. Але якось знаєте. 'Томас Вітмор.' Він видихає. Сонячне світло падає туди, де він сидів. Зник.", flag: "bones_farewell" },
      { text: "🔮 Запитати про прокляття", eff: { curse: 1 }, msg: "'Ваше прокляття? Дитячі забавки. Моє тривало 383 роки. Море терпляче. Воно завжди стягує. Але іноді прощає. Якщо ви даєте щось, що воно цінує більше за душу.'", flag: "bones_curse_wisdom" },
    ],
  },

  // КАПІТАНА ВЕГА - пірат-суперниця
  {
    id: "npc_vega_1", scene: "combat", family: "relationship", phase: "early", title: "Ла Венганза",
    text: "Стрункий бригантин перерізає ваш шлях. На носі: жінка з шаблею і посмішкою. 'Забираю ваш вантаж, Капітане. Нічого особистого. Я Вега.'",
    choices: [
      { text: "⚔️ Бій!", eff: { gold: 0, crew: [-2, -1], karma: 0, curse: 0, rep: { brethren: -1 } }, msg: "Вона б'ється як блискавка. Ви перемагаєте, ледь. Стрибає за борт, сміючись. 'Наступного разу, Капітане!'", flag: "vega_fought" },
      { text: "💰 Здати вантаж (-20)", eff: { gold: -20, rep: { brethren: 1 } }, msg: "'Розумний вибір.' Забирає золото і кидає вам пляшку. Всередині: координати. 'Вважайте це квитанцією.'", flag: "vega_surrendered" },
      { text: "🍺 Запросити на борт", eff: { gold: -10, crew: 0, karma: 0, curse: 0, rep: { brethren: 2 } }, msg: "'Ніхто ще не пробував.' Підозрілива. Потім зацікавлена. Потім п'яна. Розповідає про скарб, який не може дістати сама.", flag: "vega_talked" },
    ],
  },
  {
    id: "npc_vega_2", scene: "open_sea", family: "relationship", phase: "mid", title: "Сигнал Веги",
    text: s => {
      if (s.flags.has("vega_fought")) return "Червоний спалах зі сходу. Це її корабель. Ла Венганза сильно кренить. У неї біда.";
      if (s.flags.has("vega_talked")) return "Червоний спалах: сигнал Веги. 'Пам'ятаєте той скарб? Час. Зустрічаємось біля рифу.'";
      return "Червоний спалах на горизонті. Піратський сигнал. Впізнаєте Ла Венганзу.";
    },
    requires: s => (s.flags.has("vega_fought") || s.flags.has("vega_surrendered") || s.flags.has("vega_talked")) && s.day >= 7,
    choices: [
      { text: "🆘 Допомогти", eff: { gold: 0, crew: [-1, 0], karma: 1, curse: 0, rep: { brethren: 2 } }, msg: s => s.flags.has("vega_fought") ? "'Ви? Після нашого бою... навіщо?' Вона кровоточить. Ви рятуєте її. Щось змінюється між вами." : "'Ви прийшли.' Полегшення в голосі. Разом відбиваєте патруль Корони.", flag: "vega_saved" },
      { text: "⚔️ Атакувати поки слабка", eff: { gold: [30, 60], crew: [-1, 0], karma: -3, curse: 1, rep: { brethren: -3 } }, msg: "Проклинає вас останнім подихом. Братство це запам'ятає.", flag: "vega_killed" },
      { text: "👀 Спостерігати здалеку", eff: {}, msg: s => s.flags.has("vega_talked") ? "Вона рятується сама. Ви втратили її довіру." : "Кульгаючи, відпливає. Ви ще почуєте про це." },
    ],
  },
  {
    id: "npc_vega_3", scene: "open_sea", family: "relationship", phase: ["mid", "late"], title: "Пропозиція Веги",
    text: "'Два капітани, два кораблі. Ми можемо володіти цими водами.' Розкладає карту на вашому столі. Її очі серйозні вперше.",
    requires: s => s.flags.has("vega_saved") && s.day >= 11,
    choices: [
      { text: "🤝 Альянс", eff: { crew: [2, 3], gold: [20, 40], rep: { brethren: 3, crown: -2 } }, msg: "'Рівні партнери. Флот Вега-Капітан.' Плює на долоню. Потискуєте руки. Море належить вам обом.", flag: "vega_alliance" },
      { text: "💋 Щось більше", eff: { crew: 1, karma: 1, curse: -1, rep: { brethren: 2 } }, msg: "'Я сподівалась, що ви це скажете.' Ніч із зірками, ромом і чесністю. Вранці два кораблі пливуть як один.", flag: "vega_love" },
      { text: "🚫 Плисти самому", eff: { karma: 0, rep: { brethren: -1 } }, msg: "'Ваша втрата, Капітане.' Пливе на схід. Іноді бачите Ла Венганзу уві сні." },
    ],
  },
  {
    id: "npc_vega_final", scene: "combat", family: "relationship", phase: "late", title: "Останній бій Веги",
    text: s => {
      if (s.flags.has("vega_love")) return "Військові кораблі Корони. Шість. Вега хапає вашу руку. 'Разом. Як обіцяли.'";
      if (s.flags.has("vega_alliance")) return "Засідка Корони! Шість кораблів. Вега сигналить з Ла Венганзи: 'БІЙСЯ ЧИ ТІКАЙ?'";
      return "Знаходите Ла Венганзу в полум'ї. Вега б'ється сама проти двох фрегатів Корони.";
    },
    requires: s => (s.flags.has("vega_alliance") || s.flags.has("vega_love") || s.flags.has("vega_saved")) && s.day >= 15,
    choices: [
      { text: "⚔️ Битися разом", eff: { gold: [40, 80], crew: [-3, -1], karma: 0, curse: 0, rep: { crown: -4, brethren: 4 } }, msg: s => s.flags.has("vega_love") ? "Спина до спини. Два капітани. Шість кораблів горять. Про це складуть пісні." : "Пліч-о-пліч прориваєте лінію Корони. Легенда народжується.", flag: "vega_victory" },
      { text: "🏃 Прикрити її відхід", eff: { crew: [-2, -1], karma: 2, rep: { brethren: 3 } }, msg: "'ТІКАЙ!' Берете вогонь на себе. Вона рятується. Команда поважає вас більше, ніж будь-коли.", flag: "vega_sacrifice" },
      { text: "💨 Втекти", eff: { karma: -2, rep: { brethren: -4 } }, msg: s => s.flags.has("vega_love") ? "Вона дивиться, як ви йдете. Зрада в її очах буде переслідувати вас вічно." : "Ла Венганза тоне. Останнє слово Веги — ваше ім'я.", flag: "vega_abandoned" },
    ],
  },

  // КОДЖО БОЦМАН - вірний член екіпажу
  {
    id: "npc_kojo_1", scene: "open_sea", family: "relationship", phase: "early", title: "Новий боцман",
    text: "Найбільша людина, яку ви бачили, виходить вперед. 'Мене звати Коджо. Я наведу порядок. Якщо ви варті того, щоб за вами йти.'",
    choices: [
      { text: "🤝 Ласкаво просимо", eff: { crew: 1 }, msg: "Потискує руку. Ваша зникає в його. Команда вирівнюється. Порядок прибув.", flag: "kojo_joined" },
      { text: "💪 Спершу перевірити", eff: { crew: 1, karma: 0 }, msg: "Армреслінг. Він виграє. Потім допомагає встати, усміхаючись. 'Добре. Ви не боїтесь програти.' Команда має боцмана.", flag: "kojo_joined" },
      { text: "🚫 Немає місця", eff: {}, msg: "Кивнув. 'Ваш корабель. Ваш вибір.' Йде. Причал здається меншим без нього." },
    ],
  },
  {
    id: "npc_kojo_2", scene: "open_sea", family: "relationship", phase: "mid", title: "Історія Коджо",
    text: s => s.karma >= 2
      ? "Нічна вахта. Коджо сідає поруч. 'Капітане, ви порядна людина. Це небезпечно тут. Дозвольте розповісти, чому я знаю.'"
      : "Нічна вахта. Коджо мовчить. Потім: 'Капітане, я був рабом. Плантація на Барбадосі. Я вбив наглядача його ж ланцюгами. Ви маєте це знати.'",
    requires: s => s.flags.has("kojo_joined") && s.day >= 6,
    choices: [
      { text: "👂 Слухати", eff: { karma: 1, crew: 1 }, msg: "'Я був сином короля в Ашанті. Вкрадений у дванадцять. Тридцять років у ланцюгах. Я заслужив свободу. Тепер обираю, за ким іти.' Дивиться на вас. 'Не змусьте мене пожалкувати.'", flag: "kojo_story" },
      { text: "🤝 Розповісти свою історію", eff: { crew: 1 }, msg: "Обмінюєтесь шрамами і історіями до світанку. Двоє людей на океані горя, що будують щось нове.", flag: "kojo_story" },
      { text: "⚓ 'Ми не говоримо про минуле'", eff: {}, msg: "Він кивнув. Стіна залишається. Але він все одно б'ється за вас." },
    ],
  },
  {
    id: "npc_kojo_3", scene: "combat", family: "relationship", phase: ["mid", "late"], title: "Суд Коджо",
    text: s => {
      if (s.karma <= -3) return "Коджо перекриває вам шлях. Команда за ним. 'Капітане. Треба поговорити про те, ким ви стали.'";
      if (s.flags.has("kojo_story")) return "Корабель работорговців на горизонті. Коджо завмирає. Його руки тремтять. 'Капітане. Той корабель везе моїх людей.'";
      return "Коджо вказує на корабель під прапором Корони. 'Це Відплата. Вони полюють на піратів і втікачів. Капітане, за мою голову призначена ціна.'";
    },
    requires: s => s.flags.has("kojo_joined") && s.day >= 10,
    choices: [
      { text: "⚔️ Атакувати работорговців", eff: { gold: -10, crew: [2, 4], karma: 3, curse: 0, rep: { crown: -3, brethren: 2 } }, msg: "Ви розбиваєте ланцюги. Тридцять душ на волі. Коджо плаче вперше. 'Капітане. Я піду за вами до краю моря.'", flag: "kojo_freed_slaves" },
      { text: "🏴 Хай Коджо веде атаку", eff: { gold: 0, crew: [1, 3], karma: 2, curse: 0, rep: { crown: -2 } }, msg: "Б'ється з люттю тридцяти років. Коли все закінчується, стоїть серед визволених, говорить мовою ашанті. Вони йдуть за ним. Він залишається з вами.", flag: "kojo_freed_slaves" },
      { text: "💨 Це не наш бій", eff: { karma: -2, crew: -1, rep: { crown: 1 } }, msg: s => s.flags.has("kojo_story") ? "Коджо дивиться на вас. Мовчить. Бере гамак і лягає на далекому кінці корабля. Щось зламалось." : "Команда бурмотить. Коджо мовчить. Найгірший вид мовчання.", flag: "kojo_disappointed" },
    ],
  },
  {
    id: "npc_kojo_4", scene: "open_sea", family: "relationship", phase: "late", title: "Вибір Коджо",
    text: s => {
      if (s.flags.has("kojo_freed_slaves")) return "Коджо приходить з різьбленою дерев'яною фігуркою. 'В Ашанті ми даємо це родині. Ви моя родина тепер, Капітане.'";
      if (s.flags.has("kojo_disappointed")) return "Коджо підходить. 'Я сходжу в наступному порту. Не можу йти за тим, хто пливе повз ланцюги.'";
      return "Коджо стоїть на носі. 'Я думав про дім. Про Ашанті. Про те, чи є ще для мене місце там.'";
    },
    requires: s => (s.flags.has("kojo_freed_slaves") || s.flags.has("kojo_disappointed") || s.flags.has("kojo_story")) && s.day >= 14,
    choices: [
      { text: "🎁 Прийняти подарунок", eff: { crew: 2, karma: 2, curse: -1, rep: { brethren: 1 } }, msg: "'Ви повернули мені моє ім'я. Тепер даю вам своє: Кваме Коджо Асанте. Принц, раб, вільна людина. Ваш боцман назавжди.' Команда вітає.", flag: "kojo_loyal", requires_flag: "kojo_freed_slaves" },
      { text: "🏠 Допомогти повернутися додому", eff: { crew: -1, karma: 3 }, msg: "'Дім... я не знаю, чи він ще існує.' Ви змінюєте курс. Через три тижні — берег. Він виходить і не озирається. Потім озирається. Помах рукою. Все, що треба було сказати.", flag: "kojo_home" },
      { text: "⚓ Попросити залишитись", eff: { crew: 0, karma: 0 }, msg: s => s.flags.has("kojo_disappointed") ? "'Дайте мені причину.' Ви не можете. Він іде на світанку." : "'Залишусь. Але не тому, що ви попросили. Тому що цей корабель — перше місце, яке я обрав сам.' Посміхається.", flag: "kojo_stays" },
    ],
  },

  // ── АРТЕФАКТНІ КВЕСТИ (unlock encounters) ──

  {
    id: "treasure_map_complete", scene: "island", family: "quest", phase: "mid",
    title: "Карта вказує шлях",
    text: "Фрагмент карти в ваших руках раптом починає світитися. Лінії рухаються, вказуючи на скелю у формі черепа. Під нею — щось.",
    requires: s => s.inventory.includes("map_fragment"),
    choices: [
      { text: "⛏️ Копати!", eff: { gold: [80, 150], crew: 0, karma: 0, curse: 1, loseItem: "map_fragment" }, msg: "Скриня капітана Флінта. Золото, коштовності, і записка: 'Хто знайде це — вже проклятий, як і я.'", flag: "flint_treasure" },
      { text: "🗺️ Запам'ятати місце", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Не час. Занадто небезпечно. Але місце тепер в пам'яті назавжди.", flag: "treasure_location_known" },
      { text: "🔥 Спалити карту", eff: { gold: 0, crew: 0, karma: 1, curse: -2, loseItem: "map_fragment" }, msg: "Вогонь забирає карту. З нею — частину прокляття. Море ніби зітхає з полегшенням." },
    ],
  },
  {
    id: "pearl_whispers", scene: "ethereal", family: "quest", phase: ["mid", "late"],
    title: "Шепіт Чорної Перлини",
    text: "Вночі перлина починає шепотіти. Голос стародавній, нелюдський. Пропонує угоду: знання в обмін на жертву.",
    requires: s => s.inventory.includes("black_pearl") && s.day >= 5,
    choices: [
      { text: "👂 Слухати", eff: { gold: 0, crew: 0, karma: 0, curse: 3 }, msg: "Перлина показує бачення: затонуле місто, де золото тече як вода. І щось в центрі, що не повинно існувати. Тепер ви знаєте, де воно.", flag: "pearl_vision" },
      { text: "🩸 Запропонувати кров", eff: { gold: 0, crew: -1, karma: -2, curse: 2, item: "ancient_key" }, msg: "Кров торкається перлини і зникає. На палубі з'являється ключ з кістки. Один матрос падає і більше не встає.", flag: "pearl_sacrifice" },
      { text: "🤫 Ігнорувати", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Шепіт стихає. Але перлина тепліша, ніж раніше. Вона чекає." },
      { text: "🌊 Викинути перлину", eff: { gold: 0, crew: 1, karma: 1, curse: -3, loseItem: "black_pearl" }, msg: "Перлина летить у хвилі. Крик, якого ніхто не чує. Команда видихає. Цієї ночі всі сплять спокійно." },
    ],
  },
];
