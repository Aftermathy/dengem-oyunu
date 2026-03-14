import { useState, useCallback } from 'react';
import { PowerState, PowerType, BRIBE_REP_GAIN, BribeState } from '@/types/game';
import { getBribeCostForFaction, canBribeFaction } from '@/lib/gameLogic';
import { trackBribe as trackBribeAchievement } from '@/lib/achievements';
import { loadGame } from '@/lib/gameSave';

const INITIAL_BRIBE: BribeState = { halk: 0, yatirimcilar: 0, mafya: 0, tarikat: 0, ordu: 0 };

interface UseBribeParams {
  power: PowerState;
  money: number;
  setPower: React.Dispatch<React.SetStateAction<PowerState>>;
  setMoney: React.Dispatch<React.SetStateAction<number>>;
  setLastMoneyChange: React.Dispatch<React.SetStateAction<number | null>>;
}

export function useBribe({ power, money, setPower, setMoney, setLastMoneyChange }: UseBribeParams) {
  const [bribeCounts, setBribeCounts] = useState<BribeState>(() => {
    const saved = loadGame();
    if (saved) return saved.bribeCounts as BribeState;
    return { ...INITIAL_BRIBE };
  });

  const getBribeCost = useCallback((faction: PowerType): number => {
    return getBribeCostForFaction(bribeCounts, faction);
  }, [bribeCounts]);

  const canBribe = useCallback((faction: PowerType): boolean => {
    return canBribeFaction(money, power, bribeCounts, faction);
  }, [money, power, bribeCounts]);

  const bribe = useCallback((faction: PowerType) => {
    const room = 100 - power[faction];
    if (room <= 0) return;
    const gain = Math.min(room, BRIBE_REP_GAIN);
    const ratio = gain / BRIBE_REP_GAIN;
    const cost = Math.max(1, Math.round(getBribeCostForFaction(bribeCounts, faction) * ratio));
    if (money < cost) return;

    setMoney(m => m - cost);
    setPower(prev => ({ ...prev, [faction]: prev[faction] + gain }));
    setBribeCounts(prev => ({ ...prev, [faction]: prev[faction] + 1 }));
    setLastMoneyChange(-cost);
    trackBribeAchievement();
  }, [money, power, bribeCounts, setPower, setMoney, setLastMoneyChange]);

  const resetBribeCounts = useCallback(() => {
    setBribeCounts({ ...INITIAL_BRIBE });
  }, []);

  return { bribeCounts, setBribeCounts, bribe, canBribe, getBribeCost, resetBribeCounts };
}
