import { PowerType } from './game';
import { Language } from '@/contexts/LanguageContext';

export type SkillCategory = 'defense' | 'media' | 'economy' | 'strategy' | 'ohal';

export interface SkillDef {
  id: string;
  maxLevel: number;
  costs: number[];
  titleTR: string;
  titleEN: string;
  descTR: string;
  descEN: string;
  emoji: string;
  tier: 1 | 2 | 3;
  category: SkillCategory;
  faction?: PowerType;
}

export function getSkillTitle(s: SkillDef, lang: Language): string {
  return lang === 'en' ? s.titleEN : s.titleTR;
}

export function getSkillDesc(s: SkillDef, lang: Language): string {
  return lang === 'en' ? s.descEN : s.descTR;
}

// Skill effect values per level
export const SHIELD_VALUES = [1, 2, 3, 4, 5];
export const MEDIA_VALUES = [1, 2, 3];
export const ELECTION_REDUCTION = [0.03, 0.05, 0.08, 0.10, 0.15];
export const DARK_CONN_REDUCTION = [0.03, 0.05, 0.08, 0.10, 0.15];
export const LUCKY_BONUS = [0.05, 0.10, 0.15];
export const PRO_LAUNDER_OUTPUT = [25, 30]; // base is 20
export const OFFSHORE_RATE = [0.01, 0.02, 0.03];

/** Achievement IDs required to unlock each OHAL skill level */
export const OHAL_UNLOCK_ACHIEVEMENTS = {
  LEVEL_1: 'ohal_1',
  LEVEL_2: 'ohal_2',
} as const;

// OHAL effect values per level (3 levels)
export const OHAL_NEGATIVE_EXTRA = [1, 2, 3]; // extra negative faction damage
export const OHAL_POSITIVE_REDUCTION = [1, 2, 3]; // reduced positive faction gains
export const OHAL_LAUNDER_OUTPUT = [15, 10, 5]; // launder output override (base 20)
export const OHAL_ELECTION_COST_MULT = [1.25, 1.50, 1.75]; // election cost multiplier
export const OHAL_MONEY_VOLATILITY = [1.5, 2.0, 2.5]; // money effect multiplier for both gain/loss
export const OHAL_AP_MULTIPLIER = [1.5, 2.0, 2.5]; // AP score multiplier

export const SKILL_DEFS: SkillDef[] = [
  // ── Defense: Faction Shields ──
  { id: 'shield_halk', maxLevel: 5, costs: [8, 12, 18, 25, 35], emoji: '🛡️', tier: 1, category: 'defense', faction: 'halk',
    titleTR: 'Halk Kalkanı', titleEN: "People's Shield", descTR: 'Halk hasarını azaltır (-1…-5)', descEN: 'Reduces people damage (-1…-5)' },
  { id: 'shield_ordu', maxLevel: 5, costs: [8, 12, 18, 25, 35], emoji: '🛡️', tier: 1, category: 'defense', faction: 'ordu',
    titleTR: 'Ordu Kalkanı', titleEN: 'Military Shield', descTR: 'Ordu hasarını azaltır (-1…-5)', descEN: 'Reduces military damage (-1…-5)' },
  { id: 'shield_tarikat', maxLevel: 5, costs: [8, 12, 18, 25, 35], emoji: '🛡️', tier: 1, category: 'defense', faction: 'tarikat',
    titleTR: 'Tarikat Kalkanı', titleEN: 'Cult Shield', descTR: 'Tarikat hasarını azaltır (-1…-5)', descEN: 'Reduces cult damage (-1…-5)' },
  { id: 'shield_yatirimcilar', maxLevel: 5, costs: [8, 12, 18, 25, 35], emoji: '🛡️', tier: 1, category: 'defense', faction: 'yatirimcilar',
    titleTR: 'Yatırımcı Kalkanı', titleEN: 'Investor Shield', descTR: 'Yatırımcı hasarını azaltır (-1…-5)', descEN: 'Reduces investor damage (-1…-5)' },
  { id: 'shield_mafya', maxLevel: 5, costs: [8, 12, 18, 25, 35], emoji: '🛡️', tier: 1, category: 'defense', faction: 'mafya',
    titleTR: 'Mafya Kalkanı', titleEN: 'Mafia Shield', descTR: 'Mafya hasarını azaltır (-1…-5)', descEN: 'Reduces mafia damage (-1…-5)' },

  // ── Media: Faction Bonuses ──
  { id: 'media_halk', maxLevel: 3, costs: [10, 20, 35], emoji: '📺', tier: 1, category: 'media', faction: 'halk',
    titleTR: 'Halk Medyası', titleEN: 'People Media', descTR: 'Halk kazancını artırır (+1…+3)', descEN: 'Boosts people gains (+1…+3)' },
  { id: 'media_ordu', maxLevel: 3, costs: [10, 20, 35], emoji: '📺', tier: 1, category: 'media', faction: 'ordu',
    titleTR: 'Ordu Medyası', titleEN: 'Military Media', descTR: 'Ordu kazancını artırır (+1…+3)', descEN: 'Boosts military gains (+1…+3)' },
  { id: 'media_tarikat', maxLevel: 3, costs: [10, 20, 35], emoji: '📺', tier: 1, category: 'media', faction: 'tarikat',
    titleTR: 'Tarikat Medyası', titleEN: 'Cult Media', descTR: 'Tarikat kazancını artırır (+1…+3)', descEN: 'Boosts cult gains (+1…+3)' },
  { id: 'media_yatirimcilar', maxLevel: 3, costs: [10, 20, 35], emoji: '📺', tier: 1, category: 'media', faction: 'yatirimcilar',
    titleTR: 'Yatırımcı Medyası', titleEN: 'Investor Media', descTR: 'Yatırımcı kazancını artırır (+1…+3)', descEN: 'Boosts investor gains (+1…+3)' },
  { id: 'media_mafya', maxLevel: 3, costs: [10, 20, 35], emoji: '📺', tier: 1, category: 'media', faction: 'mafya',
    titleTR: 'Mafya Medyası', titleEN: 'Mafia Media', descTR: 'Mafya kazancını artırır (+1…+3)', descEN: 'Boosts mafia gains (+1…+3)' },

  // ── Economy ──
  { id: 'election_master', maxLevel: 5, costs: [15, 25, 40, 60, 80], emoji: '🗳️', tier: 2, category: 'economy',
    titleTR: 'Seçim Kampanyası Ustası', titleEN: 'Election Campaign Master', descTR: 'Seçim hamle maliyetini düşürür', descEN: 'Reduces election move costs' },
  { id: 'dark_connections', maxLevel: 5, costs: [15, 25, 40, 60, 80], emoji: '🕶️', tier: 2, category: 'economy',
    titleTR: 'Karanlık Bağlantılar', titleEN: 'Dark Connections', descTR: 'Aklama dükkanı maliyetini düşürür', descEN: 'Reduces launder shop costs' },
  { id: 'pro_launderer', maxLevel: 2, costs: [30, 60], emoji: '🧹', tier: 2, category: 'economy',
    titleTR: 'Profesyonel Aklayıcı', titleEN: 'Professional Launderer', descTR: 'Aklama verimliliğini artırır (25/30B)', descEN: 'Increases laundering efficiency (25/30B)' },
  { id: 'offshore', maxLevel: 3, costs: [25, 50, 80], emoji: '🏦', tier: 2, category: 'economy',
    titleTR: 'Offshore Hesabı', titleEN: 'Offshore Account', descTR: 'Aklanmış paraya tur başı faiz (%1…%3)', descEN: 'Adds interest on laundered money (1%…3%)' },

  // ── Strategy ──
  { id: 'lucky_cards', maxLevel: 3, costs: [20, 40, 70], emoji: '🍀', tier: 2, category: 'strategy',
    titleTR: 'Şanslı Tesadüfler', titleEN: 'Lucky Encounters', descTR: 'Nadir kart şansını artırır (+5…+15%)', descEN: 'Increases rare card chance (+5…+15%)' },
  { id: 'crisis_management', maxLevel: 1, costs: [100], emoji: '🚨', tier: 3, category: 'strategy',
    titleTR: 'Kriz Yönetimi', titleEN: 'Crisis Management', descTR: 'Oyun başına 1 kez ölümden kurtul', descEN: 'Survive death once per game' },
  { id: 'emergency_fund', maxLevel: 1, costs: [100], emoji: '💉', tier: 3, category: 'strategy',
    titleTR: 'Acil Fon Enjeksiyonu', titleEN: 'Emergency Fund Injection', descTR: 'İflas ettiğinde 25B enjekte et (oyun başına 1)', descEN: 'Inject 25B when bankrupt (once per game)' },

  // ── OHAL (State of Emergency) - 3 levels ──
  { id: 'ohal', maxLevel: 3, costs: [0, 0, 0], emoji: '⚠️', tier: 3, category: 'ohal',
    titleTR: 'OHAL Modu', titleEN: 'State of Emergency', descTR: 'Oyunu zorlaştır, AP çarpanı kazan', descEN: 'Make the game harder, earn AP multiplier' },
];

// Helper: check if any non-OHAL skill has levels
export function hasAnyNonOhalSkill(skillLevels: Record<string, number>): boolean {
  return SKILL_DEFS.some(s => s.category !== 'ohal' && (skillLevels[s.id] || 0) > 0);
}

// Helper: check if OHAL is active
export function hasOhalActive(skillLevels: Record<string, number>): boolean {
  return (skillLevels['ohal'] || 0) > 0;
}

// Computed active modifiers from skill levels
export interface ActiveModifiers {
  factionShields: Record<PowerType, number>;
  factionBonuses: Record<PowerType, number>;
  electionCostReduction: number;
  darkConnectionsReduction: number;
  launderOutput: number;
  offshoreRate: number;
  rareCardBonus: number;
  hasCrisisManagement: boolean;
  hasEmergencyFund: boolean;
  // OHAL modifiers
  ohalLevel: number;
  ohalNegativeExtra: number;
  ohalPositiveReduction: number;
  ohalLaunderOutput: number;
  ohalElectionCostMult: number;
  ohalMoneyVolatility: number;
  ohalAPMultiplier: number;
}

export function computeModifiers(skillLevels: Record<string, number>): ActiveModifiers {
  const factions: PowerType[] = ['halk', 'ordu', 'tarikat', 'yatirimcilar', 'mafya'];
  const shields = { halk: 0, ordu: 0, tarikat: 0, yatirimcilar: 0, mafya: 0 };
  const bonuses = { halk: 0, ordu: 0, tarikat: 0, yatirimcilar: 0, mafya: 0 };

  for (const f of factions) {
    const sLvl = skillLevels[`shield_${f}`] || 0;
    if (sLvl > 0) shields[f] = SHIELD_VALUES[sLvl - 1];
    const mLvl = skillLevels[`media_${f}`] || 0;
    if (mLvl > 0) bonuses[f] = MEDIA_VALUES[mLvl - 1];
  }

  const elLvl = skillLevels['election_master'] || 0;
  const dcLvl = skillLevels['dark_connections'] || 0;
  const plLvl = skillLevels['pro_launderer'] || 0;
  const osLvl = skillLevels['offshore'] || 0;
  const lcLvl = skillLevels['lucky_cards'] || 0;
  const cmLvl = skillLevels['crisis_management'] || 0;
  const efLvl = skillLevels['emergency_fund'] || 0;
  const ohLvl = skillLevels['ohal'] || 0;

  // Base launder output from pro_launderer
  let launderOutput = plLvl > 0 ? PRO_LAUNDER_OUTPUT[plLvl - 1] : 20;
  // OHAL overrides launder output downward
  const ohalLaunderOut = ohLvl > 0 ? OHAL_LAUNDER_OUTPUT[ohLvl - 1] : 20;
  if (ohLvl > 0) {
    launderOutput = Math.min(launderOutput, ohalLaunderOut);
  }

  return {
    factionShields: shields,
    factionBonuses: bonuses,
    electionCostReduction: elLvl > 0 ? ELECTION_REDUCTION[elLvl - 1] : 0,
    darkConnectionsReduction: dcLvl > 0 ? DARK_CONN_REDUCTION[dcLvl - 1] : 0,
    launderOutput,
    offshoreRate: osLvl > 0 ? OFFSHORE_RATE[osLvl - 1] : 0,
    rareCardBonus: lcLvl > 0 ? LUCKY_BONUS[lcLvl - 1] : 0,
    hasCrisisManagement: cmLvl > 0,
    hasEmergencyFund: efLvl > 0,
    // OHAL
    ohalLevel: ohLvl,
    ohalNegativeExtra: ohLvl > 0 ? OHAL_NEGATIVE_EXTRA[ohLvl - 1] : 0,
    ohalPositiveReduction: ohLvl > 0 ? OHAL_POSITIVE_REDUCTION[ohLvl - 1] : 0,
    ohalLaunderOutput: ohalLaunderOut,
    ohalElectionCostMult: ohLvl > 0 ? OHAL_ELECTION_COST_MULT[ohLvl - 1] : 1,
    ohalMoneyVolatility: ohLvl > 0 ? OHAL_MONEY_VOLATILITY[ohLvl - 1] : 1,
    ohalAPMultiplier: ohLvl > 0 ? OHAL_AP_MULTIPLIER[ohLvl - 1] : 1,
  };
}

// Authority Points formula
export const AP_TURN_MULTIPLIER = 1.5;
export const AP_LAUNDER_MULTIPLIER = 0.1;

export function calculateAP(turns: number, totalLaundered: number, ohalMultiplier: number = 1): number {
  const base = Math.floor(turns * AP_TURN_MULTIPLIER + totalLaundered * AP_LAUNDER_MULTIPLIER);
  return Math.floor(base * ohalMultiplier);
}
