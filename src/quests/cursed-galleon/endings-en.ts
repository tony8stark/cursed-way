import type { Ending } from "../../engine/types";
import { applyEndingNotes } from "../../engine/ending-resolution";

export const endingsEn: Ending[] = [
  {
    id: "between_worlds",
    req: s => s.curse >= 15,
    title: "B E T W E E N  W O R L D S",
    text: s => s.flags?.has("merged")
      ? "You and the doppelganger are one. An immortal captain. Your ship sails through time."
      : s.flags?.has("met_double")
        ? "The doppelganger is out there. Two shadows of one curse, two ships on an eternal course."
        : "Eternal captain of an eternal ship. Your name is a warning.",
    color: "#40f8a0",
  },
  {
    id: "swallowed",
    req: s => s.curse >= 12 && s.crew <= 2,
    title: "S W A L L O W E D",
    text: () => "The curse took everything. An empty shell on an empty ship.",
    color: "#8020c0",
  },
  {
    id: "last_one",
    req: s => s.crew <= 0,
    title: "T H E  L A S T  O N E",
    text: () => "No one left. Waves and seagulls. Drifting.",
    color: "#c02020",
  },
  {
    id: "cursed_gold",
    req: s => s.gold >= 150 && s.curse >= 8,
    title: "C U R S E D  G O L D",
    text: s => s.flags?.has("eldorado_knowledge")
      ? "El Dorado's gold is a trap. You are part of the collection."
      : "Gold decays. Wealth without freedom.",
    color: "#f0c040",
  },
  {
    id: "legend",
    req: s => s.karma >= 8,
    title: "L E G E N D",
    text: s => applyEndingNotes(s.flags?.has("siren_bond")
      ? "The siren guides you to port. Land, sea, and the deep respect you."
      : "Your name is a synonym for honor.", "en", s, { faction: true, relationship: true, legendaryQuest: true }),
    color: "#40c0f0",
  },
  {
    id: "king",
    req: s => s.gold >= 200,
    title: "K I N G",
    text: s => applyEndingNotes(s.flags?.has("barret_deal")
      ? "You and Barret split the Caribbean. It won't last."
      : "More gold than you could ever spend.", "en", s, { faction: true, relationship: true, legendaryQuest: true }),
    color: "#f0c040",
  },
  {
    id: "objective_complete",
    req: s => s.flags?.has("objective_complete") === true,
    title: "M I S S I O N  C O M P L E T E",
    text: s => {
      let base = "You set out with a purpose and accomplished it. Not many can say that.";
      if (s.flags?.has("objective_treasure_hunter")) base = "Five relics from five cursed corners of the world. Collectors and kings will fight over your haul.";
      else if (s.flags?.has("objective_curse_breaker")) base = "You touched the abyss and pulled yourself back. Few can say the same. The sea owes you nothing now.";
      else if (s.flags?.has("objective_explorer")) base = "Eight shores, a living crew, and the map in your head. You did not get lost at sea. You learned it.";
      else if (s.flags?.has("objective_trade_baron")) base = "Your fortune came not only from fear, but from connections. The Guild speaks of you as one of its own.";
      else if (s.flags?.has("objective_redeemer")) base = "The sea tested you. You chose mercy every time. Songs will be written about your voyage.";
      else if (s.flags?.has("objective_cartographer")) base = "You charted nearly half the sea without letting the curse swallow you. That is the work of a master, not a drifter.";
      return applyEndingNotes(base, "en", s, { faction: true, relationship: true, legendaryQuest: true });
    },
    color: "#40f8a0",
  },
  {
    id: "survivor",
    req: () => true,
    title: "S U R V I V O R",
    text: s => applyEndingNotes(s.flags?.has("visited_phantom")
      ? "You returned. But is this your world? Everything feels slightly off."
      : "Not a hero, not a villain. A sailor who came back.", "en", s, { faction: true, relationship: true, legendaryQuest: true }),
    color: "#c8c8d8",
  },
];
