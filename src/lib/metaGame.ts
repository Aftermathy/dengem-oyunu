const SKILLS_KEY = 'ims_skill_levels';
const CLAIMS_KEY = 'ims_claimed_achievements';

export function loadSkillLevels(): Record<string, number> {
  try {
    const raw = localStorage.getItem(SKILLS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveSkillLevels(levels: Record<string, number>): void {
  localStorage.setItem(SKILLS_KEY, JSON.stringify(levels));
}

export function loadClaimedAchievements(): string[] {
  try {
    const raw = localStorage.getItem(CLAIMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveClaimedAchievements(claimed: string[]): void {
  localStorage.setItem(CLAIMS_KEY, JSON.stringify(claimed));
}
