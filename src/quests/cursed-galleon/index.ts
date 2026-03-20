import type { Quest } from "../../engine/types";
import { encounters } from "./encounters";
import { endings } from "./endings";

export const cursedGalleon: Quest = {
  id: "cursed-galleon",
  title: "ПРОКЛЯТИЙ ГАЛЕОН",
  description: "20 днів. Один корабель. Кожен вибір — наслідок. Море пам'ятає все.",
  encounters,
  endings,
  initialState: {
    gold: 30,
    crew: 8,
    karma: 0,
    curse: 0,
    day: 1,
    flags: new Set(),
    log: [],
  },
};
