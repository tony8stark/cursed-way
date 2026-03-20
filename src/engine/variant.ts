import { create } from "zustand";

export type GameVariant = "classic" | "enhanced";

interface VariantStore {
  variant: GameVariant;
  setVariant: (v: GameVariant) => void;
}

const VARIANT_KEY = "black-tide-variant";

function getInitial(): GameVariant {
  try {
    const saved = localStorage.getItem(VARIANT_KEY);
    if (saved === "classic" || saved === "enhanced") return saved;
  } catch {}
  return "classic";
}

export const useVariantStore = create<VariantStore>((set) => ({
  variant: getInitial(),
  setVariant: (variant) => {
    try { localStorage.setItem(VARIANT_KEY, variant); } catch {}
    set({ variant });
  },
}));
