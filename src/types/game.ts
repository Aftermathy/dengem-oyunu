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
  leftMoney?: number;
  rightMoney?: number;
}

export interface PowerState {
  [key: string]: number;
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
  image: string;
}

// Bribe cost tiers: each successive bribe to the same faction costs more
export const BRIBE_COSTS = [1, 3, 5, 10, 25, 50, 100] as const;
export const BRIBE_REP_GAIN = 10;
