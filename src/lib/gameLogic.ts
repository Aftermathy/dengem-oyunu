import { PowerState, PowerType, PowerEffect, EventCard, BRIBE_COSTS, BRIBE_REP_GAIN } from '@/types/game';

const ALL_POWERS: PowerType[] = ['halk', 'yatirimcilar', 'mafya', 'tarikat', 'ordu'];

/** Ensure an effects array contains all 5 factions, adding amount: 0 for missing ones */
export function normalizeEffects(effects: PowerEffect[]): PowerEffect[] {
  const existing = new Set(effects.map(e => e.power));
  return [
    ...effects,
    ...ALL_POWERS.filter(p => !existing.has(p)).map(p => ({ power: p as PowerType, amount: 0 })),
  ];
}

/** Normalize a card so both leftEffects and rightEffects contain all 5 factions */
export function normalizeCard(card: EventCard): EventCard {
  return {
    ...card,
    leftEffects: normalizeEffects(card.leftEffects),
    rightEffects: normalizeEffects(card.rightEffects),
  };
}

/** Normalize an array of cards */
export function normalizeCards(cards: EventCard[]): EventCard[] {
  return cards.map(normalizeCard);
}
import { BribeState } from '@/hooks/useGame';
import { GAME_CONFIG } from '@/constants/gameConfig';

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function applyCardEffects(power: PowerState, effects: PowerEffect[]): PowerState {
  const next = { ...power };
  effects.forEach(e => {
    next[e.power] = Math.max(0, Math.min(100, next[e.power] + e.amount));
  });
  return next;
}

/** Income from maxed factions, capped at MAX_FACTION_INCOME */
export function calculateMaxIncome(power: PowerState): number {
  let income = 0;
  for (const key of Object.keys(power) as PowerType[]) {
    if (power[key] >= 100) income += GAME_CONFIG.INCOME_PER_MAXED_FACTION;
  }
  return Math.min(income, GAME_CONFIG.MAX_FACTION_INCOME);
}

export function getBribeCostForFaction(bribeCounts: BribeState, faction: PowerType): number {
  const count = bribeCounts[faction];
  const idx = Math.min(count, BRIBE_COSTS.length - 1);
  return BRIBE_COSTS[idx];
}

export function canBribeFaction(
  money: number,
  power: PowerState,
  bribeCounts: BribeState,
  faction: PowerType,
): boolean {
  const room = 100 - power[faction];
  if (room <= 0) return false;
  const ratio = Math.min(room, BRIBE_REP_GAIN) / BRIBE_REP_GAIN;
  const cost = Math.max(1, Math.round(getBribeCostForFaction(bribeCounts, faction) * ratio));
  return money >= cost;
}

/** Returns lowest-power faction below the given threshold, or null */
export function findLowFaction(power: PowerState, threshold: number): PowerType | null {
  let lowest: PowerType | null = null;
  let lowestVal = threshold + 1;
  for (const key of Object.keys(power) as PowerType[]) {
    if (power[key] <= threshold && power[key] < lowestVal) {
      lowest = key;
      lowestVal = power[key];
    }
  }
  return lowest;
}
