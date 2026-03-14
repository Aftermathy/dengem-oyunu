import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import { ActiveModifiers, computeModifiers, SKILL_DEFS } from '@/types/metaGame';
import {
  loadAP, saveAP,
  loadSkillLevels, saveSkillLevels,
  loadClaimedAchievements, saveClaimedAchievements,
} from '@/lib/metaGame';

interface MetaGameContextValue {
  authorityPoints: number;
  skillLevels: Record<string, number>;
  claimedAchievements: string[];
  modifiers: ActiveModifiers;
  earnAP: (amount: number) => void;
  claimAchievement: (id: string, reward: number) => void;
  isAchievementClaimed: (id: string) => boolean;
  purchaseSkill: (skillId: string) => boolean;
  getSkillLevel: (skillId: string) => number;
  resetAllSkills: () => void;
  crisisAvailableThisGame: boolean;
  useCrisisJoker: () => void;
  emergencyFundAvailableThisGame: boolean;
  useEmergencyFund: () => void;
  resetGameSession: () => void;
}

const MetaGameContext = createContext<MetaGameContextValue | null>(null);

export function MetaGameProvider({ children }: { children: ReactNode }) {
  const [ap, setAP] = useState(loadAP);
  const [skills, setSkills] = useState(loadSkillLevels);
  const [claimed, setClaimed] = useState(loadClaimedAchievements);
  const [crisisUsed, setCrisisUsed] = useState(false);
  const [emergencyFundUsed, setEmergencyFundUsed] = useState(false);

  const modifiers = useMemo(() => computeModifiers(skills), [skills]);

  const earnAP = useCallback((amount: number) => {
    if (amount <= 0) return;
    setAP(prev => {
      const next = prev + amount;
      saveAP(next);
      return next;
    });
  }, []);

  const claimAchievement = useCallback((id: string, reward: number) => {
    setClaimed(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      saveClaimedAchievements(next);
      return next;
    });
    earnAP(reward);
  }, [earnAP]);

  const isAchievementClaimed = useCallback((id: string) => claimed.includes(id), [claimed]);

  const purchaseSkill = useCallback((skillId: string): boolean => {
    const def = SKILL_DEFS.find(s => s.id === skillId);
    if (!def) return false;
    const currentLevel = skills[skillId] || 0;
    if (currentLevel >= def.maxLevel) return false;
    const cost = def.costs[currentLevel];
    if (ap < cost) return false;

    setAP(prev => {
      const next = prev - cost;
      saveAP(next);
      return next;
    });
    setSkills(prev => {
      const next = { ...prev, [skillId]: currentLevel + 1 };
      saveSkillLevels(next);
      return next;
    });
    return true;
  }, [ap, skills]);

  const getSkillLevel = useCallback((skillId: string) => skills[skillId] || 0, [skills]);

  // Reset all skills and refund all spent AP (exploit-safe: recalculate from skill defs)
  const resetAllSkills = useCallback(() => {
    let totalRefund = 0;
    for (const def of SKILL_DEFS) {
      const level = skills[def.id] || 0;
      for (let i = 0; i < level; i++) {
        totalRefund += def.costs[i];
      }
    }
    setSkills(() => {
      const empty: Record<string, number> = {};
      saveSkillLevels(empty);
      return empty;
    });
    if (totalRefund > 0) {
      setAP(prev => {
        const next = prev + totalRefund;
        saveAP(next);
        return next;
      });
    }
  }, [skills]);

  const useCrisisJoker = useCallback(() => setCrisisUsed(true), []);
  const useEmergencyFund = useCallback(() => setEmergencyFundUsed(true), []);
  const resetGameSession = useCallback(() => {
    setCrisisUsed(false);
    setEmergencyFundUsed(false);
  }, []);

  const value = useMemo<MetaGameContextValue>(() => ({
    authorityPoints: ap,
    skillLevels: skills,
    claimedAchievements: claimed,
    modifiers,
    earnAP,
    claimAchievement,
    isAchievementClaimed,
    purchaseSkill,
    getSkillLevel,
    resetAllSkills,
    crisisAvailableThisGame: modifiers.hasCrisisManagement && !crisisUsed,
    useCrisisJoker,
    emergencyFundAvailableThisGame: modifiers.hasEmergencyFund && !emergencyFundUsed,
    useEmergencyFund,
    resetGameSession,
  }), [ap, skills, claimed, modifiers, earnAP, claimAchievement, isAchievementClaimed, purchaseSkill, getSkillLevel, resetAllSkills, crisisUsed, useCrisisJoker, emergencyFundUsed, useEmergencyFund, resetGameSession]);

  return <MetaGameContext.Provider value={value}>{children}</MetaGameContext.Provider>;
}

export function useMetaGame() {
  const ctx = useContext(MetaGameContext);
  if (!ctx) throw new Error('useMetaGame must be used within MetaGameProvider');
  return ctx;
}
