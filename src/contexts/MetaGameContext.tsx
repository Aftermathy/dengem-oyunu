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
  crisisAvailableThisGame: boolean;
  useCrisisJoker: () => void;
  resetGameSession: () => void;
}

const MetaGameContext = createContext<MetaGameContextValue | null>(null);

export function MetaGameProvider({ children }: { children: ReactNode }) {
  const [ap, setAP] = useState(loadAP);
  const [skills, setSkills] = useState(loadSkillLevels);
  const [claimed, setClaimed] = useState(loadClaimedAchievements);
  const [crisisUsed, setCrisisUsed] = useState(false);

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

  const useCrisisJoker = useCallback(() => setCrisisUsed(true), []);
  const resetGameSession = useCallback(() => setCrisisUsed(false), []);

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
    crisisAvailableThisGame: modifiers.hasCrisisManagement && !crisisUsed,
    useCrisisJoker,
    resetGameSession,
  }), [ap, skills, claimed, modifiers, earnAP, claimAchievement, isAchievementClaimed, purchaseSkill, getSkillLevel, crisisUsed, useCrisisJoker, resetGameSession]);

  return <MetaGameContext.Provider value={value}>{children}</MetaGameContext.Provider>;
}

export function useMetaGame() {
  const ctx = useContext(MetaGameContext);
  if (!ctx) throw new Error('useMetaGame must be used within MetaGameProvider');
  return ctx;
}
