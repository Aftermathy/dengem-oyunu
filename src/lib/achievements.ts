import { ACHIEVEMENTS, Achievement } from '@/types/achievements';
import { PowerState, PowerType } from '@/types/game';

const STORAGE_KEY = 'ims_achievements';
const DEATH_KEY = 'ims_death_factions';
const BRIBE_TOTAL_KEY = 'ims_total_bribes';
const LAUNDER_TOTAL_KEY = 'ims_total_launders';
const CHAIN_SEEN_KEY = 'ims_chain_cards_seen';

// --- Core unlock/check ---

export function getUnlockedIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function unlockAchievement(id: string): boolean {
  const unlocked = getUnlockedIds();
  if (unlocked.includes(id)) return false;
  unlocked.push(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
  return true;
}

export function isUnlocked(id: string): boolean {
  return getUnlockedIds().includes(id);
}

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

// --- Survival turn checks ---

export function checkTurnAchievements(turn: number): string[] {
  const newlyUnlocked: string[] = [];
  if (turn >= 10 && unlockAchievement('survive_10')) newlyUnlocked.push('survive_10');
  if (turn >= 25 && unlockAchievement('survive_25')) newlyUnlocked.push('survive_25');
  if (turn >= 50 && unlockAchievement('survive_50')) newlyUnlocked.push('survive_50');
  if (turn >= 100 && unlockAchievement('survive_100')) newlyUnlocked.push('survive_100');
  return newlyUnlocked;
}

// --- Money checks ---

export function checkMoneyAchievements(money: number): string[] {
  const newlyUnlocked: string[] = [];
  if (money >= 100 && unlockAchievement('rich_100')) newlyUnlocked.push('rich_100');
  if (money >= 500 && unlockAchievement('rich_500')) newlyUnlocked.push('rich_500');
  return newlyUnlocked;
}

// --- Power checks ---

export function checkPowerAchievements(power: PowerState): string[] {
  const newlyUnlocked: string[] = [];
  const factions: PowerType[] = ['halk', 'yatirimcilar', 'mafya', 'tarikat', 'ordu'];

  for (const f of factions) {
    if (power[f] >= 100) {
      if (unlockAchievement('max_faction')) newlyUnlocked.push('max_faction');
      break;
    }
  }

  const allBalanced = factions.every(f => power[f] >= 45 && power[f] <= 55);
  if (allBalanced && unlockAchievement('perfect_balance')) {
    newlyUnlocked.push('perfect_balance');
  }

  return newlyUnlocked;
}

// --- Election checks ---

export function checkElectionAchievements(completedCount: number, isFinalBoss: boolean): string[] {
  const newlyUnlocked: string[] = [];
  if (completedCount >= 1 && unlockAchievement('win_election_1')) newlyUnlocked.push('win_election_1');
  if (completedCount >= 3 && unlockAchievement('win_election_3')) newlyUnlocked.push('win_election_3');
  if (isFinalBoss && unlockAchievement('final_boss')) newlyUnlocked.push('final_boss');
  return newlyUnlocked;
}

// --- OHAL achievement checks (only after 2028 final victory) ---

export function checkOhalAchievements(ohalLevel: number): string[] {
  const newlyUnlocked: string[] = [];
  if (ohalLevel >= 1 && unlockAchievement('ohal_1')) newlyUnlocked.push('ohal_1');
  if (ohalLevel >= 2 && unlockAchievement('ohal_2')) newlyUnlocked.push('ohal_2');
  if (ohalLevel >= 3 && unlockAchievement('ohal_3')) newlyUnlocked.push('ohal_3');
  return newlyUnlocked;
}

// --- Death tracking ---

export function trackDeath(faction: string): string[] {
  const newlyUnlocked: string[] = [];
  try {
    const raw = localStorage.getItem(DEATH_KEY);
    const deaths: string[] = raw ? JSON.parse(raw) : [];
    if (!deaths.includes(faction)) {
      deaths.push(faction);
      localStorage.setItem(DEATH_KEY, JSON.stringify(deaths));
    }
    if (deaths.length >= 5 && unlockAchievement('all_deaths')) {
      newlyUnlocked.push('all_deaths');
    }
  } catch {}
  return newlyUnlocked;
}

export function trackBankruptcy(): string[] {
  const newlyUnlocked: string[] = [];
  if (unlockAchievement('bankrupt')) newlyUnlocked.push('bankrupt');
  return newlyUnlocked;
}

export function trackSpeedDeath(turn: number): string[] {
  const newlyUnlocked: string[] = [];
  if (turn < 5 && unlockAchievement('speed_death')) newlyUnlocked.push('speed_death');
  return newlyUnlocked;
}

// --- Bribe tracking ---

export function trackBribe(): string[] {
  const newlyUnlocked: string[] = [];
  try {
    const count = parseInt(localStorage.getItem(BRIBE_TOTAL_KEY) || '0', 10) + 1;
    localStorage.setItem(BRIBE_TOTAL_KEY, String(count));
    if (count >= 10 && unlockAchievement('bribe_10')) newlyUnlocked.push('bribe_10');
  } catch {}
  return newlyUnlocked;
}

// --- Launder tracking ---

export function trackLaunder(): string[] {
  const newlyUnlocked: string[] = [];
  try {
    const count = parseInt(localStorage.getItem(LAUNDER_TOTAL_KEY) || '0', 10) + 1;
    localStorage.setItem(LAUNDER_TOTAL_KEY, String(count));
    if (count >= 5 && unlockAchievement('launder_5')) newlyUnlocked.push('launder_5');
  } catch {}
  return newlyUnlocked;
}

// --- Card-based achievements ---

export function checkCardAchievement(cardId: number): string[] {
  const newlyUnlocked: string[] = [];

  if (cardId === 9001 && unlockAchievement('cat_encounter')) newlyUnlocked.push('cat_encounter');
  if (cardId === 9999 && unlockAchievement('dark_mode_event')) newlyUnlocked.push('dark_mode_event');
  if (cardId === 9002 && unlockAchievement('exile_letter')) newlyUnlocked.push('exile_letter');

  if ([9101, 9102, 9103, 9201, 9202, 9203].includes(cardId)) {
    try {
      const raw = localStorage.getItem(CHAIN_SEEN_KEY);
      const seen: number[] = raw ? JSON.parse(raw) : [];
      if (!seen.includes(cardId)) {
        seen.push(cardId);
        localStorage.setItem(CHAIN_SEEN_KEY, JSON.stringify(seen));
      }
      const chainA = [9101, 9102, 9103].every(id => seen.includes(id));
      const chainB = [9201, 9202, 9203].every(id => seen.includes(id));
      if ((chainA || chainB) && unlockAchievement('coffee_chain')) {
        newlyUnlocked.push('coffee_chain');
      }
    } catch {}
  }

  return newlyUnlocked;
}

// --- Propaganda tracking ---

export function checkPropagandaAchievement(propagandaCount: number): string[] {
  const newlyUnlocked: string[] = [];
  if (propagandaCount >= 3 && unlockAchievement('propaganda_master')) {
    newlyUnlocked.push('propaganda_master');
  }
  return newlyUnlocked;
}
