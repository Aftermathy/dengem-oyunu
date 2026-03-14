export const GAME_CONFIG = {
  // Starting values
  INITIAL_MONEY: 128,
  INITIAL_POWER: 50,

  // Launder mechanic
  LAUNDER_COST: 30,
  LAUNDER_AMOUNT: 20,
  LAUNDER_HALK_PENALTY: -10,
  LAUNDER_SELECTED_BONUS: 10,
  LAUNDER_OTHER_PENALTY: -5,

  // Shop costs
  PROPAGANDA_COSTS: [10, 20, 30, 50] as const,
  INVESTMENT_COST: 15,
  ALLIANCE_COSTS: [20, 30, 45, 50] as const,

  // Shop gains
  ALLIANCE_GAIN: 8,
  PROPAGANDA_GAIN: 10,

  // Faction income
  INCOME_PER_MAXED_FACTION: 2,
  MAX_FACTION_INCOME: 6, // cap: at most 3 maxed factions count (6B/turn)

  // Tutorial
  TUTORIAL_TRIGGER_THRESHOLD: 30, // show when any faction drops to or below this
  TUTORIAL_FALLBACK_TURN: 8,      // show tutorial by this turn regardless

  // Special card injection
  CAT_CARD_CHANCE: 0.05,
  CAT_MAX_POSITION: 20,
  DARK_MODE_MAX_POSITION: 15,
  MILESTONE_TURN: 50,
} as const;
