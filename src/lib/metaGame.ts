import { STORAGE_KEYS } from '@/constants/storage';

export function loadSkillLevels(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SKILL_LEVELS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveSkillLevels(levels: Record<string, number>): void {
  localStorage.setItem(STORAGE_KEYS.SKILL_LEVELS, JSON.stringify(levels));
}

export function loadClaimedAchievements(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLAIMED_ACHIEVEMENTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveClaimedAchievements(claimed: string[]): void {
  localStorage.setItem(STORAGE_KEYS.CLAIMED_ACHIEVEMENTS, JSON.stringify(claimed));
}
