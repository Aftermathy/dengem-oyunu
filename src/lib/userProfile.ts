const PROFILE_KEY = 'ims_user_profile';

export interface UserProfile {
  nickname: string;
  avatarId: string;
  totalTurns: number;
  totalAP: number;
  gamesPlayed: number;
  hasCompletedOnboarding: boolean;
  isAppleLinked: boolean;
  unlockedAvatars: string[];
  claimedAchievements: string[];
}

const DEFAULT_PROFILE: UserProfile = {
  nickname: '',
  avatarId: 'avatar_1',
  totalTurns: 0,
  totalAP: 0,
  gamesPlayed: 0,
  hasCompletedOnboarding: false,
  isAppleLinked: false,
  unlockedAvatars: [],
  claimedAchievements: [],
};

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

// Avatar definitions
export interface AvatarDef {
  id: string;
  emoji: string;
  nameTR: string;
  nameEN: string;
  color: string;
  unlockAchievement?: string;
  unlockTextTR?: string;
  unlockTextEN?: string;
}

export const AVATAR_DEFS: AvatarDef[] = [
  // 3 default unlocked
  { id: 'avatar_1', emoji: '👨‍✈️', nameTR: 'Generalissimo', nameEN: 'Generalissimo', color: 'hsl(200 60% 40%)' },
  { id: 'avatar_2', emoji: '🤵', nameTR: 'Bay Başkan', nameEN: 'Mr. President', color: 'hsl(0 0% 25%)' },
  { id: 'avatar_3', emoji: '👳', nameTR: 'Sultan', nameEN: 'Sultan', color: 'hsl(35 70% 45%)' },
  // 15 locked - tied to achievements
  { id: 'avatar_4', emoji: '🧛', nameTR: 'Vampir Diktatör', nameEN: 'Vampire Dictator', color: 'hsl(0 60% 30%)',
    unlockAchievement: 'survive_10', unlockTextTR: '10 Tur Hayatta Kal', unlockTextEN: 'Survive 10 Turns' },
  { id: 'avatar_5', emoji: '🤡', nameTR: 'Palyaço Reis', nameEN: 'Clown Leader', color: 'hsl(45 90% 55%)',
    unlockAchievement: 'survive_25', unlockTextTR: '25 Tur Hayatta Kal', unlockTextEN: 'Survive 25 Turns' },
  { id: 'avatar_6', emoji: '🧟', nameTR: 'Zombi Başkan', nameEN: 'Zombie President', color: 'hsl(120 30% 35%)',
    unlockAchievement: 'survive_50', unlockTextTR: '50 Tur Hayatta Kal', unlockTextEN: 'Survive 50 Turns' },
  { id: 'avatar_7', emoji: '👽', nameTR: 'Uzaylı Lider', nameEN: 'Alien Leader', color: 'hsl(160 50% 40%)',
    unlockAchievement: 'rich_100', unlockTextTR: '100B Hazineye Ulaş', unlockTextEN: 'Reach 100B Treasury' },
  { id: 'avatar_8', emoji: '🤖', nameTR: 'Robot Diktatör', nameEN: 'Robot Dictator', color: 'hsl(210 20% 50%)',
    unlockAchievement: 'rich_500', unlockTextTR: '500B Hazineye Ulaş', unlockTextEN: 'Reach 500B Treasury' },
  { id: 'avatar_9', emoji: '🦹', nameTR: 'Süper Villain', nameEN: 'Super Villain', color: 'hsl(280 60% 40%)',
    unlockAchievement: 'win_election_1', unlockTextTR: 'İlk Seçimi Kazan', unlockTextEN: 'Win First Election' },
  { id: 'avatar_10', emoji: '🧙', nameTR: 'Büyücü Başkan', nameEN: 'Wizard President', color: 'hsl(260 50% 35%)',
    unlockAchievement: 'launder_5', unlockTextTR: '5 Kez Para Akla', unlockTextEN: 'Launder Money 5 Times' },
  { id: 'avatar_11', emoji: '🎃', nameTR: 'Balkabağı Reis', nameEN: 'Pumpkin Leader', color: 'hsl(25 80% 50%)',
    unlockAchievement: 'bribe_10', unlockTextTR: '10 Kez Rüşvet Ver', unlockTextEN: 'Bribe 10 Times' },
  { id: 'avatar_12', emoji: '💀', nameTR: 'İskelet Kral', nameEN: 'Skeleton King', color: 'hsl(0 0% 15%)',
    unlockAchievement: 'ohal_1', unlockTextTR: 'OHAL 1 ile Kazan', unlockTextEN: 'Win with OHAL 1' },
  { id: 'avatar_13', emoji: '👹', nameTR: 'Oni Başkan', nameEN: 'Oni President', color: 'hsl(0 70% 45%)',
    unlockAchievement: 'ohal_2', unlockTextTR: 'OHAL 2 ile Kazan', unlockTextEN: 'Win with OHAL 2' },
  { id: 'avatar_14', emoji: '🐉', nameTR: 'Ejderha Lord', nameEN: 'Dragon Lord', color: 'hsl(15 80% 40%)',
    unlockAchievement: 'ohal_3', unlockTextTR: 'OHAL 3 ile Kazan', unlockTextEN: 'Win with OHAL 3' },
  { id: 'avatar_15', emoji: '🦊', nameTR: 'Tilki Politikacı', nameEN: 'Fox Politician', color: 'hsl(20 70% 50%)',
    unlockAchievement: 'all_deaths', unlockTextTR: 'Her Zümreden Düş', unlockTextEN: 'Fall to Every Faction' },
  { id: 'avatar_16', emoji: '🐸', nameTR: 'Kurbağa Kral', nameEN: 'Frog King', color: 'hsl(100 50% 40%)',
    unlockAchievement: 'cat_encounter', unlockTextTR: 'Miyav Paşa ile Tanış', unlockTextEN: 'Meet Lord Whiskers' },
  { id: 'avatar_17', emoji: '🎭', nameTR: 'Maske Başkan', nameEN: 'Masked Leader', color: 'hsl(270 40% 50%)',
    unlockAchievement: 'survive_100', unlockTextTR: '100 Tur Hayatta Kal', unlockTextEN: 'Survive 100 Turns' },
  { id: 'avatar_18', emoji: '👑', nameTR: 'Altın Kral', nameEN: 'Golden King', color: 'hsl(45 80% 50%)',
    unlockAchievement: 'final_boss', unlockTextTR: 'Final Seçimini Kazan', unlockTextEN: 'Win the Final Election' },
];

export function isAvatarUnlocked(avatarId: string, claimedAchievements: string[]): boolean {
  const def = AVATAR_DEFS.find(a => a.id === avatarId);
  if (!def) return false;
  if (!def.unlockAchievement) return true; // default avatars
  return claimedAchievements.includes(def.unlockAchievement);
}

/** Get avatar ID that would be unlocked by a given achievement, or null */
export function getAvatarForAchievement(achievementId: string): string | null {
  const def = AVATAR_DEFS.find(a => a.unlockAchievement === achievementId);
  return def?.id ?? null;
}

// Funny stats generators
export function getFunnyStats(totalTurns: number, gamesPlayed: number) {
  return {
    advisorsFired: Math.floor(totalTurns * 0.3 + gamesPlayed * 2),
    coffeeTons: parseFloat((totalTurns * 0.02 + gamesPlayed * 0.1).toFixed(1)),
    silencedOpponents: Math.floor(totalTurns * 0.15 + gamesPlayed * 1.5),
  };
}
