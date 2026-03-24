import { create } from "zustand";

export type GameMode = "expedition" | "free_roam";

interface GameModeStore {
  mode: GameMode;
  setMode: (m: GameMode) => void;
}

const MODE_KEY = "black-tide-mode";

function getInitial(): GameMode {
  try {
    const saved = localStorage.getItem(MODE_KEY);
    if (saved === "expedition" || saved === "free_roam") return saved;
  } catch (error) { void error; }
  return "expedition";
}

export const useGameModeStore = create<GameModeStore>((set) => ({
  mode: getInitial(),
  setMode: (mode) => {
    try { localStorage.setItem(MODE_KEY, mode); } catch (error) { void error; }
    set({ mode });
  },
}));
