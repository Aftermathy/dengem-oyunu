import { Language } from '@/contexts/LanguageContext';

export interface Achievement {
  id: string;
  titleTR: string;
  titleEN: string;
  descTR: string;
  descEN: string;
  emoji: string;
  hidden: boolean;
  apReward: number;
}

export function getAchievementTitle(a: Achievement, lang: Language): string {
  return lang === 'en' ? a.titleEN : a.titleTR;
}

export function getAchievementDesc(a: Achievement, lang: Language): string {
  return lang === 'en' ? a.descEN : a.descTR;
}

export const ACHIEVEMENTS: Achievement[] = [
  // === VISIBLE ACHIEVEMENTS ===
  { id: 'survive_10', titleTR: 'Acemi Diktatör', titleEN: 'Rookie Dictator', descTR: '15 tur hayatta kal', descEN: 'Survive 15 turns', emoji: '🎯', hidden: false, apReward: 10 },
  { id: 'survive_25', titleTR: 'Koltuğa Yapıştı', titleEN: 'Glued to the Chair', descTR: '25 tur hayatta kal', descEN: 'Survive 25 turns', emoji: '🪑', hidden: false, apReward: 25 },
  { id: 'survive_50', titleTR: 'Yarım Asırlık Lider', titleEN: 'Half-Century Leader', descTR: '50 tur hayatta kal', descEN: 'Survive 50 turns', emoji: '👑', hidden: false, apReward: 50 },
  { id: 'survive_100', titleTR: 'Ebedi Başkan', titleEN: 'Eternal President', descTR: '100 tur hayatta kal', descEN: 'Survive 100 turns', emoji: '🏛️', hidden: false, apReward: 150 },
  { id: 'win_election_1', titleTR: 'Sandık Fatihi', titleEN: 'Ballot Box Victor', descTR: 'İlk seçimini kazan', descEN: 'Win your first election', emoji: '🗳️', hidden: false, apReward: 30 },
  { id: 'win_election_3', titleTR: 'Seçim Makinesi', titleEN: 'Election Machine', descTR: '3 seçim kazan', descEN: 'Win 3 elections', emoji: '🏆', hidden: false, apReward: 75 },
  { id: 'rich_100', titleTR: 'Zengin Devlet', titleEN: 'Rich State', descTR: '200B hazineye ulaş', descEN: 'Reach 200B treasury', emoji: '💰', hidden: false, apReward: 15 },
  { id: 'rich_500', titleTR: 'Altın Çağ', titleEN: 'Golden Age', descTR: '500B hazineye ulaş', descEN: 'Reach 500B treasury', emoji: '💎', hidden: false, apReward: 40 },
  { id: 'bribe_10', titleTR: 'Rüşvetçi', titleEN: 'The Briber', descTR: 'Toplam 20 kez rüşvet ver', descEN: 'Bribe 20 times total', emoji: '🤝', hidden: false, apReward: 20 },
  { id: 'max_faction', titleTR: 'Mutlak Sadakat', titleEN: 'Absolute Loyalty', descTR: 'Bir zümreyi 100\'e çıkar', descEN: 'Max out any faction to 100', emoji: '📊', hidden: false, apReward: 25 },
  { id: 'launder_5', titleTR: 'Kara Para Uzmanı', titleEN: 'Money Laundering Expert', descTR: '20 kez para akla', descEN: 'Launder money 20 times', emoji: '🧹', hidden: false, apReward: 15 },

  // === HIDDEN ACHIEVEMENTS ===
  { id: 'dark_mode_event', titleTR: 'Karanlık Taraf', titleEN: 'The Dark Side', descTR: 'Gölge Danışman ile tanış', descEN: 'Meet the Shadow Advisor', emoji: '🌑', hidden: true, apReward: 20 },
  { id: 'cat_encounter', titleTR: 'Miyav!', titleEN: 'Meow!', descTR: 'Miyav Paşa ile karşılaş', descEN: 'Encounter Lord Whiskers', emoji: '🐱', hidden: true, apReward: 25 },
  { id: 'exile_letter', titleTR: 'Sürgün Mektubu', titleEN: 'Exile Letter', descTR: '50. tur dönüm noktasına ulaş', descEN: 'Reach the turn 50 milestone', emoji: '✉️', hidden: true, apReward: 40 },
  { id: 'coffee_chain', titleTR: 'Kahve Diplomasisi', titleEN: 'Coffee Diplomacy', descTR: 'Tüm kahve zincir kartlarını gör', descEN: 'See all coffee chain cards', emoji: '☕', hidden: true, apReward: 35 },
  { id: 'all_deaths', titleTR: 'Beş Kez Düştü', titleEN: 'Fell Five Times', descTR: 'Her zümre yüzünden en az bir kez düş', descEN: 'Fall due to each faction at least once', emoji: '💀', hidden: true, apReward: 50 },
  { id: 'bankrupt', titleTR: 'İflas Ettik!', titleEN: 'Bankrupt!', descTR: 'Hazine sıfırlanarak kaybet', descEN: 'Lose by going bankrupt', emoji: '💸', hidden: true, apReward: 15 },
  { id: 'final_boss', titleTR: 'Son Boss', titleEN: 'Final Boss', descTR: 'Final seçimini kazan ve oyunu bitir', descEN: 'Win the final boss election', emoji: '🎖️', hidden: true, apReward: 100 },
  { id: 'perfect_balance', titleTR: 'Denge Ustası', titleEN: 'Master of Balance', descTR: 'Aynı anda tüm zümreleri 70-90 aralığında tut', descEN: 'Keep all factions within 70–90 at once', emoji: '⚖️', hidden: true, apReward: 60 },
  { id: 'speed_death', titleTR: 'Ani Çöküş', titleEN: 'Speed Run', descTR: '8 turdan önce düş', descEN: 'Fall before turn 8', emoji: '💨', hidden: true, apReward: 20 },

  // === OHAL ACHIEVEMENTS (triggered after 2028 final victory) ===
  { id: 'ohal_1', titleTR: 'Ateşle Oynayan', titleEN: 'Playing with Fire', descTR: 'Oyunu OHAL Seviye 1 aktifken bitir', descEN: 'Finish the game with OHAL Level 1 active', emoji: '🔥', hidden: false, apReward: 30 },
  { id: 'ohal_2', titleTR: 'Karanlık Dönem', titleEN: 'Dark Era', descTR: 'Oyunu OHAL Seviye 2 aktifken bitir', descEN: 'Finish the game with OHAL Level 2 active', emoji: '🌑', hidden: false, apReward: 60 },
  { id: 'ohal_3', titleTR: 'Mazoşist Diktatör', titleEN: 'Masochist Dictator', descTR: 'Oyunu OHAL Seviye 3 aktifken bitir', descEN: 'Finish the game with OHAL Level 3 active', emoji: '👹', hidden: false, apReward: 200 },
];
