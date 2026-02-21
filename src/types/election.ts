import { Language } from '@/contexts/LanguageContext';

export interface ElectionCard {
  id: number;
  text: string;
  emoji: string;
  voterEffect: number;
  cost: number;
}

export interface ElectionSpecialPower {
  id: string;
  name: string;
  emoji: string;
  description: string;
  voterEffect: number;
  launderedCost: number;
}

export interface ElectionConfig {
  year: number;
  triggerTurn: number;
  title: string;
  subtitle: string;
  playerCards: ElectionCard[];
  aiCards: ElectionCard[];
  specialPowers: ElectionSpecialPower[];
  aiDifficultyBonus: number;
  catchUpThreshold: number;
  catchUpBonus: number;
}

export interface ElectionResult {
  won: boolean;
  playerVote: number;
  opponentVote: number;
  remainingBudget: number;
  remainingLaundered: number;
}
