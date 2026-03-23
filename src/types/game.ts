export type PowerType = 'halk' | 'yatirimcilar' | 'mafya' | 'tarikat' | 'ordu';

export interface PowerEffect {
  power: PowerType;
  amount: number;
}

export interface EventCard {
  id: number;
  character: string;
  characterEmoji: string;
  imageId?: string;
  category: string;
  description: string;
  leftChoice: string;
  rightChoice: string;
  leftEffects: PowerEffect[];
  rightEffects: PowerEffect[];
  leftMoney?: number;
  rightMoney?: number;
  dlcPack?: string;
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
export const BRIBE_COSTS = [3, 5, 10, 15, 25, 25, 25] as const;
export const BRIBE_REP_GAIN = 10;

export type GamePhase = 'start' | 'playing' | 'gameover' | 'election';

export interface BribeState {
  [key: string]: number;
  halk: number;
  yatirimcilar: number;
  mafya: number;
  tarikat: number;
  ordu: number;
}
