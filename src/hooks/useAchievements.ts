import { useState, useCallback } from 'react';
import { PowerState } from '@/types/game';
import {
  checkTurnAchievements, checkMoneyAchievements, checkPowerAchievements,
  checkElectionAchievements, checkCardAchievement, trackDeath, trackBankruptcy,
  trackSpeedDeath, checkOhalAchievements,
} from '@/lib/achievements';

export function useAchievements() {
  const [pendingAchievements, setPendingAchievements] = useState<string[]>([]);

  const queueAchievements = useCallback((ids: string[]) => {
    if (ids.length > 0) {
      setPendingAchievements(prev => [...prev, ...ids]);
    }
  }, []);

  const clearPendingAchievement = useCallback(() => {
    setPendingAchievements(prev => prev.slice(1));
  }, []);

  /** Run all per-turn achievement checks */
  const checkAfterSwipe = useCallback((turn: number, money: number, power: PowerState, cardId: number) => {
    const q: string[] = [];
    q.push(...checkTurnAchievements(turn));
    q.push(...checkMoneyAchievements(money));
    q.push(...checkPowerAchievements(power));
    q.push(...checkCardAchievement(cardId));
    queueAchievements(q);
  }, [queueAchievements]);

  /** Track death-related achievements */
  const trackDeathAchievements = useCallback((deathFaction: string | undefined, turn: number) => {
    if (deathFaction) trackDeath(deathFaction);
    trackSpeedDeath(turn);
  }, []);

  /** Track bankruptcy achievement */
  const trackBankruptcyAchievement = useCallback(() => {
    trackBankruptcy();
  }, []);

  /** Check election-related achievements */
  const checkElection = useCallback((completedCount: number, isFinalBoss: boolean) => {
    const q = checkElectionAchievements(completedCount, isFinalBoss);
    queueAchievements(q);
  }, [queueAchievements]);

  /** Check OHAL achievements (after final boss victory) */
  const checkOhal = useCallback((ohalLevel: number) => {
    const q = checkOhalAchievements(ohalLevel);
    queueAchievements(q);
  }, [queueAchievements]);

  return {
    pendingAchievements,
    clearPendingAchievement,
    checkAfterSwipe,
    trackDeathAchievements,
    trackBankruptcyAchievement,
    checkElection,
    checkOhal,
  };
}
