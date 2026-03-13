import { describe, it, expect } from "vitest";
import { BRIBE_COSTS } from "../types/game";

// ── Utility: shuffleArray (extracted from useGame logic) ──────────────────────
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

describe("shuffleArray", () => {
  it("returns an array with the same elements", () => {
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const shuffled = shuffleArray(original);
    expect(shuffled).toHaveLength(original.length);
    expect([...shuffled].sort((a, b) => a - b)).toEqual([...original].sort((a, b) => a - b));
  });

  it("does not mutate the original array", () => {
    const original = [10, 20, 30];
    const copy = [...original];
    shuffleArray(original);
    expect(original).toEqual(copy);
  });

  it("handles an empty array", () => {
    expect(shuffleArray([])).toEqual([]);
  });

  it("handles a single-element array", () => {
    expect(shuffleArray([42])).toEqual([42]);
  });

  it("returns a new array reference", () => {
    const original = [1, 2, 3];
    const result = shuffleArray(original);
    expect(result).not.toBe(original);
  });
});

// ── Power clamping logic ──────────────────────────────────────────────────────
function clampPower(value: number): number {
  return Math.max(0, Math.min(100, value));
}

describe("power clamping logic", () => {
  it("clamps values below 0 to 0", () => {
    expect(clampPower(-10)).toBe(0);
    expect(clampPower(-1)).toBe(0);
  });

  it("clamps values above 100 to 100", () => {
    expect(clampPower(110)).toBe(100);
    expect(clampPower(101)).toBe(100);
  });

  it("leaves values within [0, 100] unchanged", () => {
    expect(clampPower(0)).toBe(0);
    expect(clampPower(50)).toBe(50);
    expect(clampPower(100)).toBe(100);
  });
});

// ── Bribe cost index calculation ──────────────────────────────────────────────
function getBribeCostForCount(bribeCount: number): number {
  const idx = Math.min(bribeCount, BRIBE_COSTS.length - 1);
  return BRIBE_COSTS[idx];
}

describe("bribe cost index calculation", () => {
  it("returns the first tier cost for 0 bribes", () => {
    expect(getBribeCostForCount(0)).toBe(BRIBE_COSTS[0]);
  });

  it("returns increasing costs for successive bribes", () => {
    const costs = Array.from({ length: BRIBE_COSTS.length }, (_, i) =>
      getBribeCostForCount(i)
    );
    for (let i = 1; i < costs.length; i++) {
      expect(costs[i]).toBeGreaterThanOrEqual(costs[i - 1]);
    }
  });

  it("caps cost at the last tier when count exceeds tier length", () => {
    const lastTierCost = BRIBE_COSTS[BRIBE_COSTS.length - 1];
    expect(getBribeCostForCount(BRIBE_COSTS.length)).toBe(lastTierCost);
    expect(getBribeCostForCount(BRIBE_COSTS.length + 5)).toBe(lastTierCost);
    expect(getBribeCostForCount(999)).toBe(lastTierCost);
  });
});

// ── Election income calculation logic ────────────────────────────────────────
type PowerMap = { halk: number; yatirimcilar: number; mafya: number; tarikat: number; ordu: number };

function calcElectionIncome(power: PowerMap): number {
  let income = 0;
  for (const key of Object.keys(power) as (keyof PowerMap)[]) {
    if (power[key] >= 100) income += 2;
  }
  return income;
}

describe("election income calculation", () => {
  it("returns 0 income when no factions are maxed", () => {
    const power: PowerMap = { halk: 50, yatirimcilar: 50, mafya: 50, tarikat: 50, ordu: 50 };
    expect(calcElectionIncome(power)).toBe(0);
  });

  it("returns 2 income per maxed faction", () => {
    const power: PowerMap = { halk: 100, yatirimcilar: 100, mafya: 50, tarikat: 50, ordu: 50 };
    expect(calcElectionIncome(power)).toBe(4);
  });

  it("returns 10 income when all 5 factions are maxed", () => {
    const power: PowerMap = { halk: 100, yatirimcilar: 100, mafya: 100, tarikat: 100, ordu: 100 };
    expect(calcElectionIncome(power)).toBe(10);
  });

  it("does not grant income for factions below 100", () => {
    const power: PowerMap = { halk: 99, yatirimcilar: 50, mafya: 0, tarikat: 80, ordu: 75 };
    expect(calcElectionIncome(power)).toBe(0);
  });
});
