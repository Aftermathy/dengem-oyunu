import { GameIcons } from '@/config/assets';
import type { LucideIcon } from 'lucide-react';
import { isUnlocked as isAchievementUnlocked } from '@/lib/achievements';
import { OHAL_AP_MULTIPLIER, OHAL_NEGATIVE_EXTRA, OHAL_POSITIVE_REDUCTION, OHAL_LAUNDER_OUTPUT, OHAL_UNLOCK_ACHIEVEMENTS, type SkillDef } from '@/types/metaGame';

// Icon mapping for each skill
export const SKILL_ICONS: Record<string, LucideIcon> = {
  shield_halk:         GameIcons.megaphone,
  shield_ordu:         GameIcons.swords,
  shield_tarikat:      GameIcons.eye,
  shield_yatirimcilar: GameIcons.trending_up,
  shield_mafya:        GameIcons.skull,
  media_halk:          GameIcons.megaphone,
  media_ordu:          GameIcons.swords,
  media_tarikat:       GameIcons.eye,
  media_yatirimcilar:  GameIcons.trending_up,
  media_mafya:         GameIcons.skull,
  election_master:     GameIcons.vote,
  dark_connections:    GameIcons.glasses,
  pro_launderer:       GameIcons.sparkles,
  offshore:            GameIcons.landmark,
  lucky_cards:         GameIcons.clover,
  crisis_management:   GameIcons.alert_triangle,
  emergency_fund:      GameIcons.syringe,
  ohal:                GameIcons.flame,
};

// Category hub config
export const CATEGORY_CONFIG: Record<string, {
  icon: LucideIcon;
  labelTR: string;
  labelEN: string;
  hue: string;
  color: string;
  glowColor: string;
}> = {
  defense:  { icon: GameIcons.shield,   labelTR: 'Zümre Kalkanları',    labelEN: 'Faction Shields',      hue: '200', color: 'hsl(200 80% 55%)', glowColor: 'hsl(200 80% 55% / 0.4)' },
  media:    { icon: GameIcons.tv,       labelTR: 'Medya Kontrolü',       labelEN: 'Media Control',        hue: '280', color: 'hsl(280 70% 60%)', glowColor: 'hsl(280 70% 60% / 0.4)' },
  economy:  { icon: GameIcons.coins,    labelTR: 'Ekonomi',              labelEN: 'Economy',              hue: '45',  color: 'hsl(45 90% 55%)',  glowColor: 'hsl(45 90% 55% / 0.4)'  },
  strategy: { icon: GameIcons.target,   labelTR: 'Strateji',             labelEN: 'Strategy',             hue: '0',   color: 'hsl(0 75% 55%)',   glowColor: 'hsl(0 75% 55% / 0.4)'   },
  ohal:     { icon: GameIcons.flame,    labelTR: 'OHAL Modu',            labelEN: 'State of Emergency',   hue: '15',  color: 'hsl(15 90% 50%)',  glowColor: 'hsl(15 90% 50% / 0.4)'  },
};

// OHAL level requirements (typed via OHAL_UNLOCK_ACHIEVEMENTS)
const OHAL_LEVEL_REQUIREMENTS: Record<number, string | null> = {
  0: null,
  1: OHAL_UNLOCK_ACHIEVEMENTS.LEVEL_1,
  2: OHAL_UNLOCK_ACHIEVEMENTS.LEVEL_2,
};

export function isOhalLevelUnlockable(currentLevel: number): boolean {
  const requiredAchievement = OHAL_LEVEL_REQUIREMENTS[currentLevel];
  if (!requiredAchievement) return true;
  return isAchievementUnlocked(requiredAchievement);
}

export function getOhalLockMessage(currentLevel: number, lang: 'tr' | 'en'): string {
  if (currentLevel === 1) {
    return lang === 'en'
      ? 'Complete the game with OHAL Level 1 to unlock Level 2'
      : 'Seviye 2 için OHAL Seviye 1 ile oyunu bitirin';
  }
  if (currentLevel === 2) {
    return lang === 'en'
      ? 'Complete the game with OHAL Level 2 to unlock Level 3'
      : 'Seviye 3 için OHAL Seviye 2 ile oyunu bitirin';
  }
  return '';
}

function getOhalEffectText(level: number, lang: 'tr' | 'en'): string {
  const idx = Math.max(0, Math.min(level - 1, OHAL_NEGATIVE_EXTRA.length - 1));
  const neg = OHAL_NEGATIVE_EXTRA[idx];
  const pos = OHAL_POSITIVE_REDUCTION[idx];
  const laund = OHAL_LAUNDER_OUTPUT[idx];
  const mult = OHAL_AP_MULTIPLIER[idx];
  if (lang === 'en') return `Neg+${neg}, Pos-${pos}, Launder→${laund}B, AP×${mult}`;
  return `Eksi+${neg}, Artı-${pos}, Aklama→${laund}B, AP×${mult}`;
}

function clamp(idx: number, arr: readonly number[]): number {
  return arr[Math.max(0, Math.min(idx, arr.length - 1))];
}

export function getEffectText(skill: SkillDef, level: number, lang: 'tr' | 'en'): string {
  if (level === 0) return lang === 'en' ? 'Not unlocked' : 'Açılmadı';
  const id = skill.id;
  if (id.startsWith('shield_')) return lang === 'en' ? `Reduces damage by -${level}` : `Hasarı -${level} azaltır`;
  if (id.startsWith('media_')) return lang === 'en' ? `Boosts gains by +${level}` : `Kazancı +${level} artırır`;
  if (id === 'election_master') { const pcts = [3,5,8,10,15] as const; const v = clamp(level-1, pcts); return lang === 'en' ? `Reduces election costs by ${v}%` : `Seçim maliyetini %${v} düşürür`; }
  if (id === 'dark_connections') { const pcts = [3,5,8,10,15] as const; const v = clamp(level-1, pcts); return lang === 'en' ? `Reduces shop costs by ${v}%` : `Dükkan maliyetini %${v} düşürür`; }
  if (id === 'pro_launderer') { const vals = [25,30] as const; const v = clamp(level-1, vals); return lang === 'en' ? `Launders ${v}B per 30B` : `30B'ye ${v}B aklar`; }
  if (id === 'offshore') { const pcts = [1,2,3] as const; const v = clamp(level-1, pcts); return lang === 'en' ? `${v}% interest per turn` : `Tur başı %${v} faiz`; }
  if (id === 'lucky_cards') { const pcts = [5,10,15] as const; const v = clamp(level-1, pcts); return lang === 'en' ? `+${v}% rare card chance` : `+%${v} nadir kart şansı`; }
  if (id === 'crisis_management') return lang === 'en' ? 'Survive death once per game' : 'Oyun başına 1 kez ölümden kurtul';
  if (id === 'emergency_fund') return lang === 'en' ? 'Inject 25B when bankrupt (once/game)' : 'İflas ettiğinde 25B enjekte et (oyun başına 1)';
  if (id === 'ohal') return getOhalEffectText(level, lang);
  return '';
}

export function getNextEffectText(skill: SkillDef, level: number, lang: 'tr' | 'en'): string {
  if (level >= skill.maxLevel) return lang === 'en' ? 'Maximum level reached' : 'Maksimum seviyeye ulaşıldı';
  const nextLevel = level + 1;
  const id = skill.id;
  if (id.startsWith('shield_')) return lang === 'en' ? `Will reduce damage by -${nextLevel}` : `Hasarı -${nextLevel} azaltacak`;
  if (id.startsWith('media_')) return lang === 'en' ? `Will boost gains by +${nextLevel}` : `Kazancı +${nextLevel} artıracak`;
  if (id === 'election_master') { const pcts = [3,5,8,10,15] as const; const v = clamp(nextLevel-1, pcts); return lang === 'en' ? `Will reduce costs by ${v}%` : `Maliyeti %${v} düşürecek`; }
  if (id === 'dark_connections') { const pcts = [3,5,8,10,15] as const; const v = clamp(nextLevel-1, pcts); return lang === 'en' ? `Will reduce costs by ${v}%` : `Maliyeti %${v} düşürecek`; }
  if (id === 'pro_launderer') { const vals = [25,30] as const; const v = clamp(nextLevel-1, vals); return lang === 'en' ? `Will launder ${v}B per 30B` : `30B'ye ${v}B aklayacak`; }
  if (id === 'offshore') { const pcts = [1,2,3] as const; const v = clamp(nextLevel-1, pcts); return lang === 'en' ? `${v}% interest per turn` : `Tur başı %${v} faiz`; }
  if (id === 'lucky_cards') { const pcts = [5,10,15] as const; const v = clamp(nextLevel-1, pcts); return lang === 'en' ? `+${v}% rare card chance` : `+%${v} nadir kart şansı`; }
  if (id === 'crisis_management') return lang === 'en' ? 'Survive death once per game' : 'Oyun başına 1 kez ölümden kurtul';
  if (id === 'emergency_fund') return lang === 'en' ? 'Inject 25B when bankrupt (once/game)' : 'İflas ettiğinde 25B enjekte et (oyun başına 1)';
  if (id === 'ohal') return getOhalEffectText(nextLevel, lang);
  return '';
}
