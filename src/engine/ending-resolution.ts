import type { Locale } from "../i18n";
import type { FactionId } from "./factions";
import type { GameMode } from "./game-mode";
import type { Ending, GameState } from "./types";

export const OBJECTIVE_COMPLETE_ID = "objective_complete";
const POSITIVE_ALIGNMENT_THRESHOLD = 3;

type EndingLike<TState> = {
  id?: string;
  req: (state: TState) => boolean;
};

type FlagState = {
  flags?: {
    has: (value: string) => boolean;
  };
};

function hasObjectiveCompletion(state: FlagState): boolean {
  return state.flags?.has(OBJECTIVE_COMPLETE_ID) === true;
}

export function shouldUseObjectiveSystem(mode: GameMode, objectiveId: string | null | undefined): objectiveId is string {
  return mode === "free_roam" && typeof objectiveId === "string" && objectiveId.length > 0;
}

export function markObjectiveComplete(state: GameState, objectiveId: string): GameState {
  const flags = new Set(state.flags);
  flags.add(OBJECTIVE_COMPLETE_ID);
  flags.add(`objective_${objectiveId}`);
  return { ...state, flags };
}

export function resolveEndingIndex<TState extends FlagState, TEnding extends EndingLike<TState>>(
  endings: TEnding[],
  state: TState,
): number {
  if (hasObjectiveCompletion(state)) {
    const objectiveIndex = endings.findIndex(
      (ending) => ending.id === OBJECTIVE_COMPLETE_ID && ending.req(state),
    );
    if (objectiveIndex >= 0) return objectiveIndex;
  }

  return endings.findIndex((ending) => ending.req(state));
}

export function resolveEndingId<TState extends FlagState, TEnding extends EndingLike<TState>>(
  endings: TEnding[],
  state: TState,
): string | null {
  const index = resolveEndingIndex(endings, state);
  return index >= 0 ? endings[index]?.id ?? null : null;
}

export function resolveQuestEndingIndex(endings: Ending[], state: GameState): number {
  return resolveEndingIndex(endings, state);
}

function appendNote(base: string, note: string | null): string {
  return note ? `${base} ${note}` : base;
}

export function getDominantFaction(state: Pick<GameState, "factionReps">): FactionId | null {
  const entries = Object.entries(state.factionReps) as Array<[FactionId, number]>;
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const [topFaction, topRep] = sorted[0] ?? [];
  const [, secondRep] = sorted[1] ?? [];

  if (!topFaction || topRep < POSITIVE_ALIGNMENT_THRESHOLD) return null;
  if (topRep === secondRep) return null;
  return topFaction;
}

export function getFactionEndingNote(state: GameState, locale: Locale): string | null {
  switch (getDominantFaction(state)) {
    case "guild":
      return locale === "uk"
        ? "Гільдія відчинила вам склади, кредит і тихі причали. Відтепер прибуток працює на ваше ім'я не гірше за гармати."
        : "The Guild opened warehouses, credit, and quiet harbors to you. Profit now works for your name as reliably as cannonfire.";
    case "brethren":
      return locale === "uk"
        ? "Братство піднімає келих за вас у кожній таверні від Тортуги до Нассау. Ваш курс став частиною піратського коду."
        : "The Brethren raise a glass to you in every tavern from Tortuga to Nassau. Your course has become part of the pirate code.";
    case "crown":
      return locale === "uk"
        ? "Корона знає вашу вартість: для одних ви корсар, для інших необхідний союзник. Порти закону відчиняються швидше, коли звучить ваше ім'я."
        : "The Crown knows your value: privateer to some, necessary ally to others. Lawful ports open faster when your name is spoken.";
    default:
      return null;
  }
}

export function getRelationshipEndingNote(state: Pick<GameState, "flags">, locale: Locale): string | null {
  if (state.flags.has("vega_love")) {
    return locale === "uk"
      ? "Вега лишилася поруч, і тепер про вас говорять як про двох капітанів одного моря."
      : "Vega remained at your side, and now people speak of you as two captains of one sea.";
  }
  if (state.flags.has("vega_alliance") || state.flags.has("vega_victory")) {
    return locale === "uk"
      ? "Ім'я Веги йде поруч із вашим, а Братство згадує ваш союз як початок нової морської сили."
      : "Vega's name is spoken beside yours, and the Brethren remember your alliance as the start of a new sea power.";
  }
  if (state.flags.has("kojo_loyal")) {
    return locale === "uk"
      ? "Коджо тримає палубу міцно, а команда знає: цей корабель став домом для тих, кого море колись забрало."
      : "Kojo holds the deck firm, and the crew knows this ship became a home for those the sea once stole.";
  }
  if (state.flags.has("kojo_home")) {
    return locale === "uk"
      ? "Десь далеко Коджо згадує ваш курс добрим словом. Ви повернули додому хоча б одну людину, і море це пам'ятає."
      : "Far away, Kojo remembers your course kindly. You returned at least one soul home, and the sea remembers that.";
  }
  if (state.flags.has("bones_farewell")) {
    return locale === "uk"
      ? "Старий Боунс нарешті зник із портів між світами, але його остання послуга ще довго триматиме двері прочиненими."
      : "Old Bones is finally gone from the ports between worlds, but his last favor will keep a few doors open for a long time.";
  }
  if (state.flags.has("bones_ally")) {
    return locale === "uk"
      ? "У кожному темному порту лишився хтось, хто знає ім'я Боунса і готовий мати справу з вашим кораблем."
      : "In every dark port, someone still knows Bones' name and is willing to deal with your ship.";
  }
  return null;
}

export function getLegendaryQuestEndingNote(state: Pick<GameState, "flags">, locale: Locale): string | null {
  if (state.flags.has("lq_dutchman_captain")) {
    return locale === "uk"
      ? "Летючий Голландець більше не легенда для чужих історій: він носить вашу волю, а не чуже прокляття."
      : "The Flying Dutchman is no longer a legend for someone else's story: it carries your will now, not another captain's curse.";
  }
  if (state.flags.has("lq_dutchman_freed")) {
    return locale === "uk"
      ? "Після ночі з Голландцем навіть примари говорять про вас тихіше. Ви бачили, як старе прокляття нарешті відпускає."
      : "After the night with the Dutchman, even ghosts speak of you more softly. You witnessed an old curse finally let go.";
  }
  if (state.flags.has("lq_davy_jones_opened")) {
    return locale === "uk"
      ? "Глибина знає ваше ім'я після скрині Дейві Джонса, і жоден спокійний приплив уже не здається випадковим."
      : "The deep knows your name after Davy Jones' locker, and no calm tide feels accidental anymore.";
  }
  if (state.flags.has("lq_davy_jones_sacrifice")) {
    return locale === "uk"
      ? "У палаці Дейві Джонса ви обрали віддати, а не взяти. Навіть море рідко бачить таке."
      : "In Davy Jones' palace, you chose to give instead of take. Even the sea rarely sees that.";
  }
  if (state.flags.has("lq_fountain_drank")) {
    return locale === "uk"
      ? "Фонтан Молодості лишив на вас чуже відображення. Життя триватиме довше, але вже не зовсім як раніше."
      : "The Fountain of Youth left you with a stranger's reflection. Life will last longer now, but not quite in the old shape.";
  }
  if (state.flags.has("lq_fountain_refused")) {
    return locale === "uk"
      ? "Ви пішли від Фонтану Молодості з порожніми руками і чистішою совістю, ніж у більшості морських легенд."
      : "You walked away from the Fountain of Youth empty-handed and cleaner in conscience than most sea legends.";
  }
  return null;
}

export function applyEndingNotes(
  base: string,
  locale: Locale,
  state: GameState,
  options: {
    faction?: boolean;
    relationship?: boolean;
    legendaryQuest?: boolean;
  } = {},
): string {
  let text = base;
  if (options.faction) text = appendNote(text, getFactionEndingNote(state, locale));
  if (options.relationship) text = appendNote(text, getRelationshipEndingNote(state, locale));
  if (options.legendaryQuest) text = appendNote(text, getLegendaryQuestEndingNote(state, locale));
  return text;
}
