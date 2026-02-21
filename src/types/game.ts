export type PowerType = 'halk' | 'yatirimcilar' | 'mafya' | 'tarikat' | 'ordu';

export interface PowerEffect {
  power: PowerType;
  amount: number;
}

export interface EventCard {
  id: number;
  character: string;
  characterEmoji: string;
  category: string;
  description: string;
  leftChoice: string;
  rightChoice: string;
  leftEffects: PowerEffect[];
  rightEffects: PowerEffect[];
}

export interface PowerState {
  halk: number;
  yatirimcilar: number;
  mafya: number;
  tarikat: number;
  ordu: number;
}

export interface GameOverScenario {
  power: PowerType;
  direction: 'low' | 'high';
  title: string;
  description: string;
  emoji: string;
}

export const POWER_INFO: Record<PowerType, { label: string; emoji: string }> = {
  halk: { label: 'Halk', emoji: '🏛️' },
  yatirimcilar: { label: 'Yatırımcılar', emoji: '💰' },
  mafya: { label: 'Mafya', emoji: '🔫' },
  tarikat: { label: 'Tarikat', emoji: '📿' },
  ordu: { label: 'Ordu', emoji: '⚔️' },
};
