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

  // Faction income
  INCOME_PER_MAXED_FACTION: 5,
  MAX_FACTION_INCOME: 25, // cap: at most 5 maxed factions count (25B/turn)

  // Tutorial
  TUTORIAL_TRIGGER_THRESHOLD: 30, // show when any faction drops to or below this
  TUTORIAL_FALLBACK_TURN: 8,      // show tutorial by this turn regardless

  // Special card injection
  CAT_CARD_CHANCE: 0.05,
  CAT_MAX_POSITION: 20,
  DARK_MODE_MAX_POSITION: 15,
  MILESTONE_TURN: 50,
} as const;
