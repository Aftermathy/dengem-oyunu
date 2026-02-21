import { GameOverScenario } from '@/types/game';

export const gameOverScenariosEn: GameOverScenario[] = [
  { power: 'halk', direction: 'low', title: 'Revolution!', description: 'The people flooded the streets. Millions in the squares screaming "Enough!" The palace gates have been broken...', emoji: '✊' },
  { power: 'halk', direction: 'high', title: 'Populist Dictator!', description: 'You became a god in the eyes of the people but no one can criticize you anymore. Democracy is just a name...', emoji: '👑' },
  { power: 'yatirimcilar', direction: 'low', title: 'Economic Collapse!', description: 'Dollar skyrocketed, stock market crashed, factories closed. People in bread lines. IMF is at the door...', emoji: '📉' },
  { power: 'yatirimcilar', direction: 'high', title: 'Oligarchy State!', description: 'Big business took over the state. Laws written for them, taxes erased for them...', emoji: '🏦' },
  { power: 'mafya', direction: 'low', title: 'Assassination!', description: 'You turned the underworld against you. Even armored cars couldn\'t save you. One midnight...', emoji: '🗡️' },
  { power: 'mafya', direction: 'high', title: 'Mafia State!', description: 'State and mafia are now the same thing. Every tender, every contract, every appointment goes through the underworld...', emoji: '🎰' },
  { power: 'tarikat', direction: 'low', title: 'Cult Coup!', description: 'The structure you thought you purged had infiltrated every level. One midnight the phones rang...', emoji: '🕋' },
  { power: 'tarikat', direction: 'high', title: 'Theocratic State!', description: 'Now every ministry, every court, every school has their people. Secularism is history...', emoji: '📿' },
  { power: 'ordu', direction: 'low', title: 'Military Coup!', description: 'Tanks on the streets, F-16s flying low. General Staff issued a statement: "Power has changed hands."', emoji: '🪖' },
  { power: 'ordu', direction: 'high', title: 'Military Dictatorship!', description: 'Generals no longer recognize civilian authority. Every decision comes from the General Staff...', emoji: '🎖️' },
];
