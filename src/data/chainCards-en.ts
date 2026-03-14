import { EventCard } from '@/types/game';
import { normalizeCards } from '@/lib/gameLogic';

// Chain A = rejected coffee (left on prologue), Chain B = accepted coffee (right on prologue)
// Index 0 = after election 1, index 1 = after election 2, etc.

export const chainCardsA_EN: EventCard[] = normalizeCards([
  // After election 1: rejected coffee branch
  {
    id: 9101,
    character: "CIA Analyst",
    characterEmoji: "🕶️",
    category: "Foreign Powers",
    description: "Your caffeine refusal caused quite a stir at the agency. We filed a report: 'Paranoid Leader — Classification: Dangerous But Interesting.' Your move.",
    leftChoice: "Expel the ambassador",
    rightChoice: "Ignore it, move on",
    leftEffects: [
      { power: "halk", amount: 0 },
      { power: "yatirimcilar", amount: -10 },
      { power: "mafya", amount: 0 },
      { power: "tarikat", amount: 0 },
      { power: "ordu", amount: 10 },
    ],
    rightEffects: [
      { power: "halk", amount: 5 },
      { power: "yatirimcilar", amount: 0 },
      { power: "mafya", amount: 0 },
      { power: "tarikat", amount: 0 },
      { power: "ordu", amount: 0 },
    ],
    leftMoney: 0, rightMoney: 5,
  },
  // After election 2
  {
    id: 9102,
    character: "Russian Ambassador",
    characterEmoji: "🐻",
    category: "Foreign Powers",
    description: "We heard you kicked out the CIA. Very wise. We brought you special tea. Russian tea. Absolutely nothing else in it. We swear on the bear.",
    leftChoice: "Refuse this too",
    rightChoice: "Drink — alliance with Russia",
    leftEffects: [
      { power: "halk", amount: 0 },
      { power: "yatirimcilar", amount: -5 },
      { power: "mafya", amount: 0 },
      { power: "tarikat", amount: 0 },
      { power: "ordu", amount: 5 },
    ],
    rightEffects: [
      { power: "halk", amount: -10 },
      { power: "yatirimcilar", amount: 0 },
      { power: "mafya", amount: 15 },
      { power: "tarikat", amount: 0 },
      { power: "ordu", amount: 0 },
    ],
    leftMoney: 0, rightMoney: 20,
  },
  // After election 3
  {
    id: 9103,
    character: "Your Own Fingerprint",
    characterEmoji: "🔬",
    category: "Foreign Powers",
    description: "Palace doctor: 'Sir, since you've been refusing all liquids, your body is dehydrating. I recommend raisins.' The press somehow got hold of this.",
    leftChoice: "Eat the raisins — health first",
    rightChoice: "Censor the story",
    leftEffects: [
      { power: "halk", amount: -5 },
      { power: "yatirimcilar", amount: 0 },
      { power: "mafya", amount: 0 },
      { power: "tarikat", amount: 5 },
      { power: "ordu", amount: 0 },
    ],
    rightEffects: [
      { power: "halk", amount: -15 },
      { power: "yatirimcilar", amount: 0 },
      { power: "mafya", amount: 10 },
      { power: "tarikat", amount: 0 },
      { power: "ordu", amount: 0 },
    ],
    leftMoney: -5, rightMoney: -10,
  },
];

export const chainCardsB_EN: EventCard[] = [
  // After election 1: accepted coffee branch
  {
    id: 9201,
    character: "CIA Analyst",
    characterEmoji: "🕶️",
    category: "Foreign Powers",
    description: "You drank the coffee. Good news: no poison. Bad news: there was a micro-tracker inside. We've been listening. To everything. What now?",
    leftChoice: "Rush to the doctor — extract it",
    rightChoice: "Don't care, keep going",
    leftEffects: [
      { power: "halk", amount: 5 },
      { power: "yatirimcilar", amount: -5 },
      { power: "mafya", amount: 0 },
      { power: "tarikat", amount: 0 },
      { power: "ordu", amount: 0 },
    ],
    rightEffects: [
      { power: "halk", amount: 0 },
      { power: "yatirimcilar", amount: 10 },
      { power: "mafya", amount: 0 },
      { power: "tarikat", amount: 0 },
      { power: "ordu", amount: -10 },
    ],
    leftMoney: -15, rightMoney: 0,
  },
  // After election 2
  {
    id: 9202,
    character: "Mysterious Visitor",
    characterEmoji: "🕵️",
    category: "Foreign Powers",
    description: "They're back. This time with a Starbucks order. 'Remember us? We remember you.' The bill is $47.",
    leftChoice: "Charge it to the treasury",
    rightChoice: "Pay yourself — diplomacy costs",
    leftEffects: [
      { power: "halk", amount: -5 },
      { power: "yatirimcilar", amount: 5 },
      { power: "mafya", amount: 0 },
      { power: "tarikat", amount: 0 },
      { power: "ordu", amount: 0 },
    ],
    rightEffects: [
      { power: "halk", amount: 10 },
      { power: "yatirimcilar", amount: 0 },
      { power: "mafya", amount: -5 },
      { power: "tarikat", amount: 0 },
      { power: "ordu", amount: 0 },
    ],
    leftMoney: -47, rightMoney: -47,
  },
  // After election 3
  {
    id: 9203,
    character: "Coffee Master",
    characterEmoji: "☕",
    category: "Foreign Powers",
    description: "A 'The President Loves Coffee' movement swept the nation. Coffee imports up 300%. Local café owners are rioting. The Cult prays: 'Turkish coffee is sacred heritage!'",
    leftChoice: "Impose coffee restrictions",
    rightChoice: "Declare a Coffee Holiday",
    leftEffects: [
      { power: "halk", amount: 0 },
      { power: "yatirimcilar", amount: -10 },
      { power: "mafya", amount: 0 },
      { power: "tarikat", amount: 15 },
      { power: "ordu", amount: 0 },
    ],
    rightEffects: [
      { power: "halk", amount: 15 },
      { power: "yatirimcilar", amount: 10 },
      { power: "mafya", amount: -5 },
      { power: "tarikat", amount: 0 },
      { power: "ordu", amount: 0 },
    ],
    leftMoney: 10, rightMoney: -20,
  },
];
