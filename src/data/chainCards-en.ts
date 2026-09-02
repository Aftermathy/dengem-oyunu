import { EventCard } from '@/types/game';
import { normalizeCards } from '@/lib/gameLogic';

// Dark mode chain: appears after each election when 9999 (Shadow Advisor) was swiped.
// Index 0 = after election 1, index 1 = after election 2, index 2 = after election 3.
// All cards share imageId "shadow_advisor" (same character photo as card 9999).

export const darkModeChain_EN: EventCard[] = normalizeCards([
  // After election 1
  {
    id: 9201,
    character: "Friendly Nation Intelligence Analyst",
    characterEmoji: "🕶️",
    imageId: "shadow_advisor",
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
    imageId: "shadow_advisor",
    category: "Foreign Powers",
    description: "They're back. This time with an order from that overpriced coffee chain. 'Remember us? We remember you.' The bill is steep.",
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
    imageId: "shadow_advisor",
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
]);
