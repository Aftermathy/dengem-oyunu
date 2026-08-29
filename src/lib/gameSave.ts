import type { EventCard } from '@/types/game';

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
  /*
    The three fields below are REQUIRED, deliberately.

    They used to be optional, and saveGame() overwrites the slot whole, so a
    call site that forgot one silently erased it. Three of the six call sites
    forgot pendingChainCards, which is why a queued chain card vanished whenever
    the player went out to the main menu and came back; totalLaundered was never
    written at all, so a resumed run lost the cash the player had already spent —
    the election shop went unaffordable, the offshore interest went to zero, and
    the laundering term dropped out of the end-of-run AP award.

    Making them required turns "someone forgot a field" from a bug a player finds
    into an error the compiler reports. loadGame() fills them in for saves that
    were written by an older build.
  */
  /** Turn-delay chain cards scheduled but not yet injected into the deck. */
  pendingChainCards: { card: EventCard; insertAtTurn: number }[];
  /** Money laundered so far this run; spent cash the player must not lose. */
  totalLaundered: number;
  /** Highest laundered total this run — reported to the leaderboard. */
  peakLaundered: number;
}

export function saveGame(state: SavedGameState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch { /* private mode / quota: the run continues, only the resume point is lost */ }
}

export function loadGame(): SavedGameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedGameState>;
    // Defaults for saves written by older builds, so an old save resumes
    // instead of being thrown away.
    if (!parsed.completedElections) parsed.completedElections = [];
    if (!parsed.pendingChainCards) parsed.pendingChainCards = [];
    if (typeof parsed.totalLaundered !== 'number') parsed.totalLaundered = 0;
    if (typeof parsed.peakLaundered !== 'number') parsed.peakLaundered = 0;
    return parsed as SavedGameState;
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
