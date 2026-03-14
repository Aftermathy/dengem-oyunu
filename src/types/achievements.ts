import { Language } from '@/contexts/LanguageContext';

export interface Achievement {
  id: string;
  titleTR: string;
  titleEN: string;
  descTR: string;
  descEN: string;
  emoji: string;
  hidden: boolean;
}

export function getAchievementTitle(a: Achievement, lang: Language): string {
  return lang === 'en' ? a.titleEN : a.titleTR;
}

export function getAchievementDesc(a: Achievement, lang: Language): string {
  return lang === 'en' ? a.descEN : a.descTR;
}

export const ACHIEVEMENTS: Achievement[] = [
  // === VISIBLE ACHIEVEMENTS ===
  { id: 'survive_10', titleTR: 'Acemi Diktatör', titleEN: 'Rookie Dictator', descTR: '10 tur hayatta kal', descEN: 'Survive 10 turns', emoji: '🎯', hidden: false },
  { id: 'survive_25', titleTR: 'Koltuğa Yapıştı', titleEN: 'Glued to the Chair', descTR: '25 tur hayatta kal', descEN: 'Survive 25 turns', emoji: '🪑', hidden: false },
  { id: 'survive_50', titleTR: 'Yarım Asırlık Lider', titleEN: 'Half-Century Leader', descTR: '50 tur hayatta kal', descEN: 'Survive 50 turns', emoji: '👑', hidden: false },
  { id: 'survive_100', titleTR: 'Ebedi Başkan', titleEN: 'Eternal President', descTR: '100 tur hayatta kal', descEN: 'Survive 100 turns', emoji: '🏛️', hidden: false },
  { id: 'win_election_1', titleTR: 'Sandık Fatihi', titleEN: 'Ballot Box Victor', descTR: 'İlk seçimini kazan', descEN: 'Win your first election', emoji: '🗳️', hidden: false },
  { id: 'win_election_3', titleTR: 'Seçim Makinesi', titleEN: 'Election Machine', descTR: '3 seçim kazan', descEN: 'Win 3 elections', emoji: '🏆', hidden: false },
  { id: 'rich_100', titleTR: 'Zengin Devlet', titleEN: 'Rich State', descTR: '100B hazineye ulaş', descEN: 'Reach 100B treasury', emoji: '💰', hidden: false },
  { id: 'rich_500', titleTR: 'Altın Çağ', titleEN: 'Golden Age', descTR: '500B hazineye ulaş', descEN: 'Reach 500B treasury', emoji: '💎', hidden: false },
  { id: 'bribe_10', titleTR: 'Rüşvetçi', titleEN: 'The Briber', descTR: 'Toplam 10 kez rüşvet ver', descEN: 'Bribe 10 times total', emoji: '🤝', hidden: false },
  { id: 'max_faction', titleTR: 'Mutlak Sadakat', titleEN: 'Absolute Loyalty', descTR: 'Bir zümreyi 100\'e çıkar', descEN: 'Max out any faction to 100', emoji: '📊', hidden: false },
  { id: 'launder_5', titleTR: 'Kara Para Uzmanı', titleEN: 'Money Laundering Expert', descTR: '5 kez para akla', descEN: 'Launder money 5 times', emoji: '🧹', hidden: false },

  // === HIDDEN ACHIEVEMENTS ===
  { id: 'dark_mode_event', titleTR: 'Karanlık Taraf', titleEN: 'The Dark Side', descTR: 'Gölge Danışman ile tanış', descEN: 'Meet the Shadow Advisor', emoji: '🌑', hidden: true },
  { id: 'cat_encounter', titleTR: 'Miyav!', titleEN: 'Meow!', descTR: 'Miyav Paşa ile karşılaş', descEN: 'Encounter Lord Whiskers', emoji: '🐱', hidden: true },
  { id: 'exile_letter', titleTR: 'Sürgün Mektubu', titleEN: 'Exile Letter', descTR: '50. tur dönüm noktasına ulaş', descEN: 'Reach the turn 50 milestone', emoji: '✉️', hidden: true },
  { id: 'coffee_chain', titleTR: 'Kahve Diplomasisi', titleEN: 'Coffee Diplomacy', descTR: 'Tüm kahve zincir kartlarını gör', descEN: 'See all coffee chain cards', emoji: '☕', hidden: true },
  { id: 'all_deaths', titleTR: 'Beş Kez Düştü', titleEN: 'Fell Five Times', descTR: 'Her zümre yüzünden en az bir kez düş', descEN: 'Fall due to each faction at least once', emoji: '💀', hidden: true },
  { id: 'bankrupt', titleTR: 'İflas Ettik!', titleEN: 'Bankrupt!', descTR: 'Hazine sıfırlanarak kaybet', descEN: 'Lose by going bankrupt', emoji: '💸', hidden: true },
  { id: 'final_boss', titleTR: 'Son Boss', titleEN: 'Final Boss', descTR: 'Final seçimini kazan ve oyunu bitir', descEN: 'Win the final boss election', emoji: '🎖️', hidden: true },
  { id: 'perfect_balance', titleTR: 'Denge Ustası', titleEN: 'Master of Balance', descTR: 'Aynı anda tüm zümreleri 50±5 aralığında tut', descEN: 'Keep all factions within 50±5 at once', emoji: '⚖️', hidden: true },
  { id: 'speed_death', titleTR: 'Ani Çöküş', titleEN: 'Speed Run', descTR: '5 turdan önce düş', descEN: 'Fall before turn 5', emoji: '💨', hidden: true },
  { id: 'propaganda_master', titleTR: 'Propaganda Ustası', titleEN: 'Propaganda Master', descTR: '3 kez propaganda yap', descEN: 'Use propaganda 3 times', emoji: '📢', hidden: true },
];
