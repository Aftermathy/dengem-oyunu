import { describe, it, expect, beforeEach } from 'vitest';
import { saveGame, loadGame, clearSave, hasSavedGame, type SavedGameState } from '@/lib/gameSave';

/**
 * The save slot is the only thing standing between a player and losing a run,
 * and it is written on every election and every time the app backgrounds. The
 * cases that matter are the ones nobody plays through by hand: a save written
 * by an older build, and a slot whose contents got mangled.
 */

const SAVE_KEY = 'imuststay_savegame';

function state(over: Partial<SavedGameState> = {}): SavedGameState {
  return {
    power: { military: 60, people: 45, economy: 30 },
    money: 1250,
    turn: 17,
    cardIndex: 42,
    bribeCounts: { military: 2 },
    reputation: 0,
    completedElections: [1, 2],
    savedAt: 1_700_000_000_000,
    pendingChainCards: [],
    totalLaundered: 0,
    peakLaundered: 0,
    ...over,
  };
}

describe('gameSave', () => {
  beforeEach(() => localStorage.clear());

  it('round-trips every field it was given', () => {
    const s = state();
    saveGame(s);
    expect(loadGame()).toEqual(s);
  });

  it('reports no save before anything is written, and one after', () => {
    expect(hasSavedGame()).toBe(false);
    expect(loadGame()).toBeNull();
    saveGame(state());
    expect(hasSavedGame()).toBe(true);
  });

  it('clears the slot', () => {
    saveGame(state());
    clearSave();
    expect(hasSavedGame()).toBe(false);
    expect(loadGame()).toBeNull();
  });

  it('carries scheduled chain cards through the round trip', () => {
    const card = { id: 'coffee_2', title: 'x', description: 'y', effects: [] } as unknown as never;
    const s = state({ pendingChainCards: [{ card, insertAtTurn: 21 }] });
    saveGame(s);
    const back = loadGame();
    expect(back?.pendingChainCards).toHaveLength(1);
    expect(back?.pendingChainCards?.[0].insertAtTurn).toBe(21);
  });

  // ── Saves written by an older build ────────────────────────────────────────

  it('accepts a save from before completedElections existed', () => {
    const old = { ...state() } as Partial<SavedGameState>;
    delete old.completedElections;
    localStorage.setItem(SAVE_KEY, JSON.stringify(old));

    const back = loadGame();
    // Not null: an old save must resume, not be thrown away.
    expect(back).not.toBeNull();
    expect(back?.completedElections).toEqual([]);
    expect(back?.turn).toBe(17);
  });

  it('fills in the fields a pre-1.0.5 save never wrote, instead of dropping the save', () => {
    const old = { ...state() } as Partial<SavedGameState>;
    delete old.pendingChainCards;
    delete old.totalLaundered;
    delete old.peakLaundered;
    localStorage.setItem(SAVE_KEY, JSON.stringify(old));

    const back = loadGame();
    expect(back).not.toBeNull();
    expect(back?.pendingChainCards).toEqual([]);
    expect(back?.totalLaundered).toBe(0);
    expect(back?.peakLaundered).toBe(0);
    expect(back?.turn).toBe(17);
  });

  it('carries laundered money through the round trip', () => {
    // The resumed run must not forget cash the player already spent.
    saveGame(state({ totalLaundered: 100_000_000_000, peakLaundered: 120_000_000_000 }));
    expect(loadGame()?.totalLaundered).toBe(100_000_000_000);
    expect(loadGame()?.peakLaundered).toBe(120_000_000_000);
  });

  // ── A slot that cannot be trusted ──────────────────────────────────────────

  it('returns null rather than throwing when the slot holds broken JSON', () => {
    localStorage.setItem(SAVE_KEY, '{not json');
    expect(() => loadGame()).not.toThrow();
    expect(loadGame()).toBeNull();
  });

  it('returns null for an empty slot', () => {
    localStorage.setItem(SAVE_KEY, '');
    expect(loadGame()).toBeNull();
  });

  it('survives a storage that refuses to write', () => {
    const original = localStorage.setItem;
    localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
    // Losing the resume point is acceptable; crashing mid-run is not.
    expect(() => saveGame(state())).not.toThrow();
    localStorage.setItem = original;
  });
});
