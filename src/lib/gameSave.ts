const SAVE_KEY = 'imuststay_savegame';

export interface SavedGameState {
  power: { [key: string]: number };
  money: number;
  turn: number;
  cardIndex: number;
  bribeCounts: { [key: string]: number };
  reputation: number;
  completedElections: number[];
  savedAt: number; // timestamp
}

export function saveGame(state: SavedGameState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {}
}

export function loadGame(): SavedGameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedGameState;
    // Ensure completedElections exists for backward compatibility
    if (!parsed.completedElections) parsed.completedElections = [];
    return parsed;
  } catch {
    return null;
  }
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

export function hasSavedGame(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}
