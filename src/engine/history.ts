import type { GameState } from "./types";

export interface RunRecord {
  id: number;
  timestamp: number;
  endingTitle: string;
  endingColor: string;
  gold: number;
  crew: number;
  karma: number;
  curse: number;
  days: number;
  logCount: number;
}

const HISTORY_KEY = "cursed-way-history";
const MAX_RUNS = 20;

export function getRunHistory(): RunRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRun(state: GameState, endingTitle: string, endingColor: string): RunRecord {
  const history = getRunHistory();
  const record: RunRecord = {
    id: Date.now(),
    timestamp: Date.now(),
    endingTitle,
    endingColor,
    gold: state.gold,
    crew: state.crew,
    karma: state.karma,
    curse: state.curse,
    days: state.day,
    logCount: state.log.length,
  };

  history.unshift(record);
  if (history.length > MAX_RUNS) history.pop();

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch { /* quota */ }

  return record;
}
