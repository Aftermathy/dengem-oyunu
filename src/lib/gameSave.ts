const SAVE_KEY = 'imuststay_savegame';

export interface SavedGameState {
  power: Record<string, number>;
  money: number;
  turn: number;
  cardIndex: number;
  bribeCounts: Record<string, number>;
  reputation: number;
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
    return JSON.parse(raw) as SavedGameState;
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
