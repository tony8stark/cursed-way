import type { Ending } from "../../engine/types";

export const endingsEn: Ending[] = [
  {
    req: s => s.curse >= 15,
    title: "B E T W E E N  W O R L D S",
    text: s => s.flags?.has("merged")
      ? "You and the doppelganger are one. An immortal captain. Your ship sails through time."
      : "Eternal captain of an eternal ship. Your name is a warning.",
    color: "#40f8a0",
  },
  {
    req: s => s.curse >= 12 && s.crew <= 2,
    title: "S W A L L O W E D",
    text: () => "The curse took everything. An empty shell on an empty ship.",
    color: "#8020c0",
  },
  {
    req: s => s.crew <= 0,
    title: "T H E  L A S T  O N E",
    text: () => "No one left. Waves and seagulls. Drifting.",
    color: "#c02020",
  },
  {
    req: s => s.gold >= 150 && s.curse >= 8,
    title: "C U R S E D  G O L D",
    text: s => s.flags?.has("eldorado_knowledge")
      ? "El Dorado's gold is a trap. You are part of the collection."
      : "Gold decays. Wealth without freedom.",
    color: "#f0c040",
  },
  {
    req: s => s.karma >= 8,
    title: "L E G E N D",
    text: s => s.flags?.has("siren_bond")
      ? "The siren guides you to port. Land, sea, and the deep respect you."
      : "Your name is a synonym for honor.",
    color: "#40c0f0",
  },
  {
    req: s => s.gold >= 200,
    title: "K I N G",
    text: s => s.flags?.has("barret_deal")
      ? "You and Barret split the Caribbean. It won't last."
      : "More gold than you could ever spend.",
    color: "#f0c040",
  },
  {
    req: () => true,
    title: "S U R V I V O R",
    text: s => s.flags?.has("visited_phantom")
      ? "You returned. But is this your world? Everything feels slightly off."
      : "Not a hero, not a villain. A sailor who came back.",
    color: "#c8c8d8",
  },
];
