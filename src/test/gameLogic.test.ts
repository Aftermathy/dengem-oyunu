import { describe, it, expect } from 'vitest';
import {
  shuffleArray, applyCardEffects, calculateMaxIncome,
  getBribeCostForFaction, canBribeFaction, findLowFaction, normalizeEffects,
} from '@/lib/gameLogic';
import { PowerState, PowerType, BRIBE_COSTS } from '@/types/game';

describe('gameLogic', () => {
  const basePower: PowerState = { halk: 50, yatirimcilar: 50, mafya: 50, tarikat: 50, ordu: 50 };

  describe('shuffleArray', () => {
    it('preserves all elements', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(arr);
      expect(shuffled).toHaveLength(5);
      expect(shuffled.sort()).toEqual([1, 2, 3, 4, 5]);
    });

    it('does not mutate original', () => {
      const arr = [1, 2, 3];
      shuffleArray(arr);
      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe('applyCardEffects', () => {
    it('applies positive effects', () => {
      const effects = [{ power: 'halk' as PowerType, amount: 10 }];
      const result = applyCardEffects(basePower, effects);
      expect(result.halk).toBe(60);
    });

    it('clamps at 0', () => {
      const power = { ...basePower, halk: 5 };
      const effects = [{ power: 'halk' as PowerType, amount: -10 }];
      const result = applyCardEffects(power, effects);
      expect(result.halk).toBe(0);
    });

    it('clamps at 100', () => {
      const power = { ...basePower, halk: 95 };
      const effects = [{ power: 'halk' as PowerType, amount: 10 }];
      const result = applyCardEffects(power, effects);
      expect(result.halk).toBe(100);
    });

    it('does not mutate original power state', () => {
      const power = { ...basePower };
      const effects = [{ power: 'halk' as PowerType, amount: 20 }];
      applyCardEffects(power, effects);
      expect(power.halk).toBe(50);
    });
  });

  describe('calculateMaxIncome', () => {
    it('returns 0 with no maxed factions', () => {
      expect(calculateMaxIncome(basePower)).toBe(0);
    });

    it('returns 5 per maxed faction', () => {
      const power = { ...basePower, halk: 100 };
      expect(calculateMaxIncome(power)).toBe(5);
    });

    it('returns 10 for two maxed factions', () => {
      const power = { ...basePower, halk: 100, ordu: 100 };
      expect(calculateMaxIncome(power)).toBe(10);
    });

    it('caps at 25', () => {
      const power: PowerState = { halk: 100, yatirimcilar: 100, mafya: 100, tarikat: 100, ordu: 100 };
      expect(calculateMaxIncome(power)).toBe(25);
    });
  });

  describe('getBribeCostForFaction', () => {
    it('returns first cost tier for unbribed faction', () => {
      const counts = { halk: 0, yatirimcilar: 0, mafya: 0, tarikat: 0, ordu: 0 };
      expect(getBribeCostForFaction(counts, 'halk')).toBe(BRIBE_COSTS[0]);
    });

    it('escalates cost with bribe count', () => {
      const counts = { halk: 2, yatirimcilar: 0, mafya: 0, tarikat: 0, ordu: 0 };
      expect(getBribeCostForFaction(counts, 'halk')).toBe(BRIBE_COSTS[2]);
    });

    it('caps at last tier', () => {
      const counts = { halk: 99, yatirimcilar: 0, mafya: 0, tarikat: 0, ordu: 0 };
      expect(getBribeCostForFaction(counts, 'halk')).toBe(BRIBE_COSTS[BRIBE_COSTS.length - 1]);
    });
  });

  describe('canBribeFaction', () => {
    it('returns true when affordable and room exists', () => {
      const counts = { halk: 0, yatirimcilar: 0, mafya: 0, tarikat: 0, ordu: 0 };
      expect(canBribeFaction(100, basePower, counts, 'halk')).toBe(true);
    });

    it('returns false when faction at 100', () => {
      const counts = { halk: 0, yatirimcilar: 0, mafya: 0, tarikat: 0, ordu: 0 };
      const power = { ...basePower, halk: 100 };
      expect(canBribeFaction(100, power, counts, 'halk')).toBe(false);
    });

    it('returns false when not enough money', () => {
      const counts = { halk: 0, yatirimcilar: 0, mafya: 0, tarikat: 0, ordu: 0 };
      expect(canBribeFaction(0, basePower, counts, 'halk')).toBe(false);
    });
  });

  describe('findLowFaction', () => {
    it('returns null if no faction below threshold', () => {
      expect(findLowFaction(basePower, 30)).toBeNull();
    });

    it('returns lowest faction below threshold', () => {
      const power = { ...basePower, mafya: 20, tarikat: 25 };
      expect(findLowFaction(power, 30)).toBe('mafya');
    });

    it('returns faction at exact threshold', () => {
      const power = { ...basePower, ordu: 30 };
      expect(findLowFaction(power, 30)).toBe('ordu');
    });
  });

  describe('normalizeEffects', () => {
    it('adds missing factions with amount 0', () => {
      const effects = [{ power: 'halk' as PowerType, amount: 5 }];
      const normalized = normalizeEffects(effects);
      expect(normalized).toHaveLength(5);
      expect(normalized.find(e => e.power === 'mafya')?.amount).toBe(0);
      expect(normalized.find(e => e.power === 'halk')?.amount).toBe(5);
    });

    it('preserves existing effects', () => {
      const effects = [
        { power: 'halk' as PowerType, amount: 10 },
        { power: 'ordu' as PowerType, amount: -5 },
      ];
      const normalized = normalizeEffects(effects);
      expect(normalized).toHaveLength(5);
      expect(normalized.find(e => e.power === 'halk')?.amount).toBe(10);
      expect(normalized.find(e => e.power === 'ordu')?.amount).toBe(-5);
    });
  });
});
