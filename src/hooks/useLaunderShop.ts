import { useState, useCallback } from 'react';
import { PowerState, PowerType, GamePhase } from '@/types/game';
import { GAME_CONFIG } from '@/constants/gameConfig';
import { trackLaunder as trackLaunderAchievement } from '@/lib/achievements';
import { clearSave } from '@/lib/gameSave';
import { STORAGE_KEYS } from '@/constants/storage';
import { useMetaGame } from '@/contexts/MetaGameContext';

interface UseLaunderShopParams {
  power: PowerState;
  money: number;
  phase: GamePhase;
  turn: number;
  highScore: number;
  setPower: React.Dispatch<React.SetStateAction<PowerState>>;
  setMoney: React.Dispatch<React.SetStateAction<number>>;
  setLastMoneyChange: React.Dispatch<React.SetStateAction<number | null>>;
  checkGameOver: (p: PowerState) => { title: string; description: string; emoji: string; image: string } | null;
  setGameOverInfo: React.Dispatch<React.SetStateAction<{ title: string; description: string; emoji: string; image?: string } | null>>;
  setHighScore: React.Dispatch<React.SetStateAction<number>>;
  setPhase: React.Dispatch<React.SetStateAction<GamePhase>>;
}

export function useLaunderShop(params: UseLaunderShopParams) {
  const {
    power, money, phase, turn, highScore,
    setPower, setMoney, setLastMoneyChange,
    checkGameOver, setGameOverInfo, setHighScore, setPhase,
  } = params;

  const { modifiers } = useMetaGame();

  const [totalLaundered, setTotalLaundered] = useState(0);
  const [peakLaundered, setPeakLaundered] = useState(0);
  const [propagandaCount, setPropagandaCount] = useState(0);
  const [, setInvestmentCount] = useState(0);
  const [allianceCount, setAllianceCount] = useState(0);
  const [lastShopResult, setLastShopResult] = useState<string | null>(null);

  const canLaunder = money >= GAME_CONFIG.LAUNDER_COST && phase === 'playing';

  const launder = useCallback((faction: PowerType) => {
    if (money < GAME_CONFIG.LAUNDER_COST) return;
    setMoney(m => m - GAME_CONFIG.LAUNDER_COST);

    // Pro launderer: skill increases output (base 20, skill gives 25 or 30)
    const launderOutput = modifiers.launderOutput;
    setTotalLaundered(prev => {
      const next = prev + launderOutput;
      if (next > peakLaundered) setPeakLaundered(next);
      return next;
    });
    setLastMoneyChange(-GAME_CONFIG.LAUNDER_COST);
    trackLaunderAchievement();

    const otherFactions = (['yatirimcilar', 'mafya', 'tarikat', 'ordu'] as PowerType[]).filter(f => f !== faction);
    const newPower = { ...power };
    newPower.halk = Math.max(0, newPower.halk + GAME_CONFIG.LAUNDER_HALK_PENALTY);
    newPower[faction] = Math.min(100, newPower[faction] + GAME_CONFIG.LAUNDER_SELECTED_BONUS);
    otherFactions.forEach(f => {
      newPower[f] = Math.max(0, newPower[f] + GAME_CONFIG.LAUNDER_OTHER_PENALTY);
    });
    setPower(newPower);

    const over = checkGameOver(newPower);
    if (over) {
      setGameOverInfo(over);
      if (turn > highScore) {
        setHighScore(turn);
        localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(turn));
      }
      clearSave();
      setPhase('gameover');
    }
  }, [money, power, checkGameOver, turn, highScore, peakLaundered, modifiers.launderOutput, setPower, setMoney, setLastMoneyChange, setGameOverInfo, setHighScore, setPhase]);

  // Dark connections: reduces shop costs
  const applyDiscount = useCallback((baseCost: number): number => {
    const reduction = modifiers.darkConnectionsReduction;
    return reduction > 0 ? Math.max(1, Math.round(baseCost * (1 - reduction))) : baseCost;
  }, [modifiers.darkConnectionsReduction]);

  const getPropagandaCost = useCallback(() => {
    const base = GAME_CONFIG.PROPAGANDA_COSTS[Math.min(propagandaCount, GAME_CONFIG.PROPAGANDA_COSTS.length - 1)];
    return applyDiscount(base);
  }, [propagandaCount, applyDiscount]);

  const getInvestmentCost = useCallback(() => {
    return applyDiscount(GAME_CONFIG.INVESTMENT_COST);
  }, [applyDiscount]);

  const getAllianceCost = useCallback(() => {
    const base = GAME_CONFIG.ALLIANCE_COSTS[Math.min(allianceCount, GAME_CONFIG.ALLIANCE_COSTS.length - 1)];
    return applyDiscount(base);
  }, [allianceCount, applyDiscount]);

  const canPropaganda = totalLaundered >= getPropagandaCost() && phase === 'playing';
  const canInvest = totalLaundered >= getInvestmentCost() && phase === 'playing';
  const canAlliance = totalLaundered >= getAllianceCost() && phase === 'playing';

  const propaganda = useCallback(() => {
    const cost = getPropagandaCost();
    if (totalLaundered < cost) return;
    setTotalLaundered(prev => prev - cost);
    setPropagandaCount(prev => prev + 1);
    const newPower = { ...power };
    newPower.halk = Math.min(100, newPower.halk + GAME_CONFIG.PROPAGANDA_GAIN);
    setPower(newPower);
    setLastShopResult(null);
  }, [totalLaundered, power, getPropagandaCost, setPower]);

  const invest = useCallback(() => {
    const cost = getInvestmentCost();
    if (totalLaundered < cost) return;
    setTotalLaundered(prev => prev - cost);
    setInvestmentCount(prev => prev + 1);
    const win = Math.random() < 0.5;
    if (win) {
      setMoney(m => m + cost * 2);
      setLastMoneyChange(cost * 2);
      setLastShopResult('win');
    } else {
      setLastShopResult('lose');
    }
  }, [totalLaundered, getInvestmentCost, setMoney, setLastMoneyChange]);

  const alliance = useCallback((f1: PowerType, f2: PowerType) => {
    const cost = getAllianceCost();
    if (totalLaundered < cost) return;
    setTotalLaundered(prev => prev - cost);
    setAllianceCount(prev => prev + 1);
    const newPower = { ...power };
    newPower[f1] = Math.min(100, newPower[f1] + GAME_CONFIG.ALLIANCE_GAIN);
    newPower[f2] = Math.min(100, newPower[f2] + GAME_CONFIG.ALLIANCE_GAIN);
    setPower(newPower);
    setLastShopResult(null);
  }, [totalLaundered, power, getAllianceCost, setPower]);

  const resetShop = useCallback(() => {
    setTotalLaundered(0);
    setPeakLaundered(0);
    setPropagandaCount(0);
    setInvestmentCount(0);
    setAllianceCount(0);
    setLastShopResult(null);
  }, []);

  return {
    totalLaundered, setTotalLaundered,
    peakLaundered, setPeakLaundered,
    canLaunder, launder,
    lastShopResult, setLastShopResult,
    propaganda, canPropaganda, getPropagandaCost,
    invest, canInvest, getInvestmentCost,
    alliance, canAlliance, getAllianceCost,
    resetShop,
  };
}
