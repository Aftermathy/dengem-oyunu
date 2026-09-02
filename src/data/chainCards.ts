import { EventCard } from '@/types/game';
import { normalizeCards } from '@/lib/gameLogic';

// Dark mode chain: appears after each election when 9999 (Gölge Danışman) was swiped.
// Index 0 = after election 1, index 1 = after election 2, index 2 = after election 3.
// All cards share imageId "shadow_advisor" (same character photo as card 9999).

export const darkModeChain_TR: EventCard[] = normalizeCards([
  // After election 1
  {
    id: 9201,
    character: "Dost Ülke İstihbarat Analisti",
    characterEmoji: "🕶️",
    imageId: "shadow_advisor",
    category: "Dış Güçler",
    description: "Kahveyi içtiniz. İyi haber: zehirsizmiş. Kötü haber: içinde mikro takip cihazı vardı. Sizi dinliyoruz. Her şeyi. Şimdi ne yapacaksınız?",
    leftChoice: "Doktora koş, cihazı çıkar",
    rightChoice: "Umursamadan devam et",
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
    character: "Gizemli Ziyaretçi",
    characterEmoji: "🕵️",
    imageId: "shadow_advisor",
    category: "Dış Güçler",
    description: "Tekrar geldi. Bu sefer o pahalı zincir kahveciden sipariş getirdi. 'Hatırladınız mı? Biz de sizi hatırladık.' dedi. Fatura kabarık.",
    leftChoice: "Faturayı hazineye yükle",
    rightChoice: "Kendin öde — kibarlık şart",
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
    character: "Kahve Ustası",
    characterEmoji: "☕",
    imageId: "shadow_advisor",
    category: "Dış Güçler",
    description: "Ülkede 'Başkan Kahveyi Sever' akımı başladı. Kahve ithalatı %300 arttı. Milli kahveciler isyanda. Tarikat dua ediyor: 'Türk kahvesi milli mirastır!'",
    leftChoice: "Kahve kısıtlaması getir",
    rightChoice: "Kahve bayramı ilan et",
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
