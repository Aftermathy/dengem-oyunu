import { GameOverScenario } from '@/types/game';

export const gameOverScenariosEn: GameOverScenario[] = [
  {
    power: 'halk',
    direction: 'low',
    title: 'Revolution!',
    description: 'The people flooded the streets. Millions screaming "Enough!" in the squares. The palace gates were broken, guards laid down their arms. Revolutionary leaders gave speeches from the balcony while you tried to escape through the back door — but the crowd caught you. A tribunal was formed, all your assets seized. You\'re now remembered as "the dictator" in dusty history books.',
    emoji: '✊',
    image: 'defeat-halk',
  },
  {
    power: 'yatirimcilar',
    direction: 'low',
    title: 'Economic Collapse!',
    description: 'Dollar skyrocketed, stock market crashed, factories closed. People in bread lines, supermarket shelves empty. IMF at the door but their terms are unacceptable. Investors fled with their capital abroad. Central Bank vault is empty. Inflation exceeded 1000%. The economic crisis threw you off your throne, replaced by a technocrat government.',
    emoji: '📉',
    image: 'defeat-yatirimcilar',
  },
  {
    power: 'mafya',
    direction: 'low',
    title: 'Assassination!',
    description: 'You turned the underworld against you. Even armored vehicles couldn\'t save you. One midnight, your convoy was ambushed. Your guards were neutralized. Shadows waited for you in dark alleys. Morning news started with "By unknown assailants..." The underworld installed their own man in power.',
    emoji: '🗡️',
    image: 'defeat-mafya',
  },
  {
    power: 'tarikat',
    direction: 'low',
    title: 'Cult Coup!',
    description: 'The organization you thought you purged had infiltrated every level of the state. One midnight the phones rang, but it wasn\'t your people calling. Judges issued arrest warrants, police are looking for you. Media ran "Traitor leader captured" headlines. Robed figures took over the state, secularism became history. You spent the night in a narrow cell.',
    emoji: '🕋',
    image: 'defeat-tarikat',
  },
  {
    power: 'ordu',
    direction: 'low',
    title: 'Military Coup!',
    description: 'Tanks on the streets, F-16s flying low. General Staff issued a statement: "Power has changed hands." Parliament surrounded, ministers detained. You\'re cornered in the palace, no escape. Generals forced your resignation on live TV. Military junta seized control, martial law declared. Your throne now belongs to a general.',
    emoji: '🪖',
    image: 'defeat-ordu',
  },
];
