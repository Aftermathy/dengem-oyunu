const PROFILE_KEY = 'ims_user_profile';

export interface UserProfile {
  nickname: string;
  avatarId: string;
  totalTurns: number;
  totalAP: number;
  gamesPlayed: number;
  wonElections: number;
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
  wonElections: 0,
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
  imageId?: string;
  nameTR: string;
  nameEN: string;
  color: string;
  unlockAchievement?: string;
  unlockTextTR?: string;
  unlockTextEN?: string;
  dlcPack?: string;
}

export const AVATAR_DEFS: AvatarDef[] = [
  // 3 default unlocked
  { id: 'avatar_1', emoji: '📊', imageId: 'av1', nameTR: 'Ekonomist', nameEN: 'The Economist', color: 'hsl(210 60% 45%)' },
  { id: 'avatar_2', emoji: '🕌', imageId: 'av2', nameTR: 'Dini Lider', nameEN: 'Religious Leader', color: 'hsl(140 50% 38%)' },
  { id: 'avatar_3', emoji: '⭐', imageId: 'av3', nameTR: 'Başkomutan', nameEN: 'Chief Commander', color: 'hsl(0 0% 30%)' },
  // Ortadoğu DLC avatarları — premium (ad-free) ile açılır
  { id: 'avatar_png_1', emoji: '💰', imageId: 'blonde_trader', nameTR: 'Sarışın Tüccar', nameEN: 'Blonde Trader', color: 'hsl(40 70% 35%)', dlcPack: 'ortadogu' },
  { id: 'avatar_png_2', emoji: '🚀', imageId: 'rocket_guy', nameTR: 'Roket Adam', nameEN: 'Rocket Guy', color: 'hsl(220 70% 35%)', dlcPack: 'ortadogu' },
  { id: 'avatar_png_3', emoji: '⭐', imageId: 'zionist_leader', nameTR: 'Siyon', nameEN: 'The Zion', color: 'hsl(0 60% 30%)', dlcPack: 'ortadogu' },
  // 8 unlockable — tied to achievements
  { id: 'avatar_4', emoji: '🍳', imageId: 'av4', nameTR: 'Mutfak Muhalifi', nameEN: 'Kitchen Rebel', color: 'hsl(25 80% 45%)',
    unlockAchievement: 'survive_10', unlockTextTR: '15 Tur Hayatta Kal', unlockTextEN: 'Survive 15 Turns' },
  { id: 'avatar_5', emoji: '🤝', imageId: 'av5', nameTR: 'Piskevütçü', nameEN: 'Cookie Guy', color: 'hsl(280 50% 40%)',
    unlockAchievement: 'survive_25', unlockTextTR: '25 Tur Hayatta Kal', unlockTextEN: 'Survive 25 Turns' },
  { id: 'avatar_6', emoji: '💍', imageId: 'av6', nameTR: 'Damat', nameEN: 'The Son-in-Law', color: 'hsl(0 0% 22%)',
    unlockAchievement: 'win_election_1', unlockTextTR: 'İlk Seçimi Kazan', unlockTextEN: 'Win First Election' },
  { id: 'avatar_7', emoji: '📷', imageId: 'av7', nameTR: 'Tripod Kahramanı', nameEN: 'Tripod Hero', color: 'hsl(195 55% 38%)',
    unlockAchievement: 'rich_100', unlockTextTR: '200B Hazineye Ulaş', unlockTextEN: 'Reach 200B Treasury' },
  { id: 'avatar_8', emoji: '📖', imageId: 'av8', nameTR: 'Roman Yazarı', nameEN: 'Novel Writer', color: 'hsl(30 45% 35%)',
    unlockAchievement: 'launder_5', unlockTextTR: '20 Kez Para Akla', unlockTextEN: 'Launder Money 20 Times' },
  { id: 'avatar_9', emoji: '😤', imageId: 'av9', nameTR: 'Öfkeli Kel', nameEN: 'Angry Bald Guy', color: 'hsl(0 70% 42%)',
    unlockAchievement: 'survive_50', unlockTextTR: '50 Tur Hayatta Kal', unlockTextEN: 'Survive 50 Turns' },
  { id: 'avatar_10', emoji: '🦕', imageId: 'av10', nameTR: 'Dinozorlu Başkan', nameEN: 'Dinosaur President', color: 'hsl(110 45% 35%)',
    unlockAchievement: 'ohal_1', unlockTextTR: 'OHAL 1 ile Bitir', unlockTextEN: 'Finish with OHAL 1' },
  { id: 'avatar_11', emoji: '🍵', imageId: 'av11', nameTR: 'Çay Fırlatıcı', nameEN: 'Tea Thrower', color: 'hsl(40 65% 40%)',
    unlockAchievement: 'bribe_10', unlockTextTR: '20 Kez Rüşvet Ver', unlockTextEN: 'Bribe 20 Times' },
  // 4 absurd — tied to harder achievements
  { id: 'avatar_12', emoji: '🪞', imageId: 'av12', nameTR: 'Bi-Başkan', nameEN: 'Bi-President', color: 'hsl(45 75% 45%)',
    unlockAchievement: 'win_election_3', unlockTextTR: '3 Seçim Kazan', unlockTextEN: 'Win 3 Elections' },
  { id: 'avatar_13', emoji: '🐱', imageId: 'av13', nameTR: 'Trafo Kedisi', nameEN: 'Cat in Traffic', color: 'hsl(25 70% 50%)',
    unlockAchievement: 'cat_encounter', unlockTextTR: 'Miyav Paşa ile Tanış', unlockTextEN: 'Meet Lord Whiskers' },
  { id: 'avatar_14', emoji: '🌌', imageId: 'av14', nameTR: 'Galaktik Sultan', nameEN: 'Galactic Sultan', color: 'hsl(270 60% 42%)',
    unlockAchievement: 'all_deaths', unlockTextTR: 'Her Zümreden Düş', unlockTextEN: 'Fall to Every Faction' },
  { id: 'avatar_15', emoji: '🤖', imageId: 'av15', nameTR: 'Yapay Zeka', nameEN: 'Artificial Intelligence', color: 'hsl(185 70% 40%)',
    unlockAchievement: 'final_boss', unlockTextTR: 'Final Seçimini Kazan', unlockTextEN: 'Win the Final Election' },
];

export function isAvatarUnlocked(avatarId: string, claimedAchievements: string[], isPremium = false): boolean {
  const def = AVATAR_DEFS.find(a => a.id === avatarId);
  if (!def) return false;
  if (def.dlcPack) return isPremium;
  if (!def.unlockAchievement) return true; // default avatars
  return claimedAchievements.includes(def.unlockAchievement);
}

/** Get avatar ID that would be unlocked by a given achievement, or null */
export function getAvatarForAchievement(achievementId: string): string | null {
  const def = AVATAR_DEFS.find(a => a.unlockAchievement === achievementId);
  return def?.id ?? null;
}

// Funny stats generators
// tier 0 = < 5 games (rookie), tier 1 = 5–19 games (experienced), tier 2 = 20+ games (veteran)
export function getFunnyStats(totalTurns: number, gamesPlayed: number) {
  const tier = gamesPlayed < 5 ? 0 : gamesPlayed < 20 ? 1 : 2;
  const m = [1, 1.5, 2.5][tier]; // multiplier grows with experience
  return {
    tier,
    advisorsFired: Math.floor((totalTurns * 0.3 + gamesPlayed * 2) * m),
    coffeeTons: parseFloat(((totalTurns * 0.02 + gamesPlayed * 0.1) * m).toFixed(1)),
    silencedOpponents: Math.floor((totalTurns * 0.15 + gamesPlayed * 1.5) * m),
    propagandaMinutes: Math.floor((totalTurns * 12 + gamesPlayed * 20) * m),
    relativesAbroad: Math.floor((gamesPlayed * 0.8 + totalTurns * 0.03) * m),
    rewrittenHistory: Math.floor((gamesPlayed * 1.5 + totalTurns * 0.08) * m),
  };
}
