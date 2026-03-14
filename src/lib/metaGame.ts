const AP_KEY = 'ims_authority_points';
const SKILLS_KEY = 'ims_skill_levels';
const CLAIMS_KEY = 'ims_claimed_achievements';

export function loadAP(): number {
  try {
    return parseInt(localStorage.getItem(AP_KEY) || '0', 10);
  } catch {
    return 0;
  }
}

export function saveAP(ap: number): void {
  localStorage.setItem(AP_KEY, String(ap));
}

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
