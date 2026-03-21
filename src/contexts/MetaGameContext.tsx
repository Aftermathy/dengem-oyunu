import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import { ActiveModifiers, computeModifiers, SKILL_DEFS, hasAnyNonOhalSkill, hasOhalActive } from '@/types/metaGame';
import {
  loadSkillLevels, saveSkillLevels,
  loadClaimedAchievements, saveClaimedAchievements,
} from '@/lib/metaGame';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { getAvatarForAchievement } from '@/lib/userProfile';

export type SkillLockReason = 'ohal_blocks_others' | 'others_block_ohal' | null;

interface MetaGameContextValue {
  /** Spendable AP = userProfile.totalAP - totalSpentOnSkills */
  authorityPoints: number;
  skillLevels: Record<string, number>;
  claimedAchievements: string[];
  modifiers: ActiveModifiers;
  earnAP: (amount: number) => void;
  claimAchievement: (id: string, reward: number) => void;
  isAchievementClaimed: (id: string) => boolean;
  purchaseSkill: (skillId: string) => boolean;
  getSkillLevel: (skillId: string) => number;
  getSkillLockReason: (skillId: string) => SkillLockReason;
  resetAllSkills: () => void;
  crisisAvailableThisGame: boolean;
  useCrisisJoker: () => void;
  emergencyFundAvailableThisGame: boolean;
  useEmergencyFund: () => void;
  resetGameSession: () => void;
}

const MetaGameContext = createContext<MetaGameContextValue | null>(null);

/** Calculate total AP spent on skills */
function calcTotalSpent(skills: Record<string, number>): number {
  let total = 0;
  for (const def of SKILL_DEFS) {
    const level = skills[def.id] || 0;
    for (let i = 0; i < level; i++) {
      total += def.costs[i];
    }
  }
  return total;
}

export function MetaGameProvider({ children }: { children: ReactNode }) {
  const { userProfile, addAP } = useUserProfile();
  const [skills, setSkills] = useState(loadSkillLevels);
  const [claimed, setClaimed] = useState(loadClaimedAchievements);
  const [crisisUsed, setCrisisUsed] = useState(false);
  const [emergencyFundUsed, setEmergencyFundUsed] = useState(false);

  const modifiers = useMemo(() => computeModifiers(skills), [skills]);

  // Spendable AP derived from single source of truth
  const authorityPoints = useMemo(
    () => userProfile.totalAP - calcTotalSpent(skills),
    [userProfile.totalAP, skills]
  );

  // earnAP now delegates to UserProfileContext (updates userProfile.totalAP)
  const earnAP = useCallback((amount: number) => {
    addAP(amount);
  }, [addAP]);

  const claimAchievement = useCallback((id: string, reward: number) => {
    setClaimed(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      saveClaimedAchievements(next);
      return next;
    });
    earnAP(reward);
    // Auto-unlock associated avatar
    const avatarId = getAvatarForAchievement(id);
    if (avatarId) {
      unlockAvatar(avatarId);
    }
  }, [earnAP, unlockAvatar]);

  const isAchievementClaimed = useCallback((id: string) => claimed.includes(id), [claimed]);

  const getSkillLockReason = useCallback((skillId: string): SkillLockReason => {
    const def = SKILL_DEFS.find(s => s.id === skillId);
    if (!def) return null;
    if (def.category === 'ohal') {
      if (hasAnyNonOhalSkill(skills)) return 'others_block_ohal';
    } else {
      if (hasOhalActive(skills)) return 'ohal_blocks_others';
    }
    return null;
  }, [skills]);

  const purchaseSkill = useCallback((skillId: string): boolean => {
    const def = SKILL_DEFS.find(s => s.id === skillId);
    if (!def) return false;
    const currentLevel = skills[skillId] || 0;
    if (currentLevel >= def.maxLevel) return false;

    if (def.category === 'ohal') {
      if (hasAnyNonOhalSkill(skills)) return false;
    } else {
      if (hasOhalActive(skills)) return false;
    }

    const cost = def.costs[currentLevel];
    // Check spendable balance (derived)
    const spendable = userProfile.totalAP - calcTotalSpent(skills);
    if (cost > 0 && spendable < cost) return false;

    // Just update skill levels — spendable balance is derived automatically
    setSkills(prev => {
      const next = { ...prev, [skillId]: currentLevel + 1 };
      saveSkillLevels(next);
      return next;
    });
    return true;
  }, [skills, userProfile.totalAP]);

  const getSkillLevel = useCallback((skillId: string) => skills[skillId] || 0, [skills]);

  const resetAllSkills = useCallback(() => {
    // No AP refund needed — spendable balance is derived, so resetting skills automatically "refunds"
    setSkills(() => {
      const empty: Record<string, number> = {};
      saveSkillLevels(empty);
      return empty;
    });
  }, []);

  const useCrisisJoker = useCallback(() => setCrisisUsed(true), []);
  const useEmergencyFund = useCallback(() => setEmergencyFundUsed(true), []);
  const resetGameSession = useCallback(() => {
    setCrisisUsed(false);
    setEmergencyFundUsed(false);
  }, []);

  const value = useMemo<MetaGameContextValue>(() => ({
    authorityPoints,
    skillLevels: skills,
    claimedAchievements: claimed,
    modifiers,
    earnAP,
    claimAchievement,
    isAchievementClaimed,
    purchaseSkill,
    getSkillLevel,
    getSkillLockReason,
    resetAllSkills,
    crisisAvailableThisGame: modifiers.hasCrisisManagement && !crisisUsed,
    useCrisisJoker,
    emergencyFundAvailableThisGame: modifiers.hasEmergencyFund && !emergencyFundUsed,
    useEmergencyFund,
    resetGameSession,
  }), [authorityPoints, skills, claimed, modifiers, earnAP, claimAchievement, isAchievementClaimed, purchaseSkill, getSkillLevel, getSkillLockReason, resetAllSkills, crisisUsed, useCrisisJoker, emergencyFundUsed, useEmergencyFund, resetGameSession]);

  return <MetaGameContext.Provider value={value}>{children}</MetaGameContext.Provider>;
}

export function useMetaGame() {
  const ctx = useContext(MetaGameContext);
  if (!ctx) throw new Error('useMetaGame must be used within MetaGameProvider');
  return ctx;
}
