import { EventCard } from '@/types/game';

// Chain A = rejected coffee (left on prologue), Chain B = accepted coffee (right on prologue)
// Index 0 = after election 1, index 1 = after election 2, etc.

export const chainCardsA_TR: EventCard[] = [
  // After election 1: rejected coffee branch
  {
    id: 9101,
    character: "CIA Analisti",
    characterEmoji: "🕶️",
    category: "Dış Güçler",
    description: "Kafein reddiniz ajanslarımızda büyük yankı uyandırdı. Rapor yazdık: 'Paranoyak Lider — Kategorisi: Tehlikeli Ama İlginç.' Şimdi ne yapacaksınız?",
    leftChoice: "Büyükelçiyi sınır dışı et",
    rightChoice: "Görmezden gel, devam et",
    leftEffects: [{ power: "yatirimcilar", amount: -10 }, { power: "ordu", amount: 10 }],
    rightEffects: [{ power: "halk", amount: 5 }],
    leftMoney: 0, rightMoney: 5,
  },
  // After election 2
  {
    id: 9102,
    character: "Rus Büyükelçisi",
    characterEmoji: "🐻",
    category: "Dış Güçler",
    description: "CIA'yi kovduğunuzu duyduk. Çok akıllıca. Biz de size özel çay getirdik. Rus çayı. Kesinlikle içinde başka bir şey yok. Yemin ederiz.",
    leftChoice: "Bunu da reddet",
    rightChoice: "İç — Rusya ile ittifak",
    leftEffects: [{ power: "ordu", amount: 5 }, { power: "yatirimcilar", amount: -5 }],
    rightEffects: [{ power: "mafya", amount: 15 }, { power: "halk", amount: -10 }],
    leftMoney: 0, rightMoney: 20,
  },
  // After election 3
  {
    id: 9103,
    character: "Kendi Parmak İziniz",
    characterEmoji: "🔬",
    category: "Dış Güçler",
    description: "Saray doktorunuz: 'Başkanım, tüm içecekleri reddedince vücudunuz artık sıvı almıyor. Kuru üzüm yemenizi öneririm.' Halk bundan haberdar oldu.",
    leftChoice: "Kuru üzüm ye, sağlık şart",
    rightChoice: "Haberi sansürle",
    leftEffects: [{ power: "halk", amount: -5 }, { power: "tarikat", amount: 5 }],
    rightEffects: [{ power: "halk", amount: -15 }, { power: "mafya", amount: 10 }],
    leftMoney: -5, rightMoney: -10,
  },
];

export const chainCardsB_TR: EventCard[] = [
  // After election 1: accepted coffee branch
  {
    id: 9201,
    character: "CIA Analisti",
    characterEmoji: "🕶️",
    category: "Dış Güçler",
    description: "Kahveyi içtiniz. İyi haber: zehirsizmiş. Kötü haber: içinde mikro takip cihazı vardı. Sizi dinliyoruz. Her şeyi. Şimdi ne yapacaksınız?",
    leftChoice: "Doktora koş, cihazı çıkar",
    rightChoice: "Umursamadan devam et",
    leftEffects: [{ power: "halk", amount: 5 }, { power: "yatirimcilar", amount: -5 }],
    rightEffects: [{ power: "yatirimcilar", amount: 10 }, { power: "ordu", amount: -10 }],
    leftMoney: -15, rightMoney: 0,
  },
  // After election 2
  {
    id: 9202,
    character: "Gizemli Ziyaretçi",
    characterEmoji: "🕵️",
    category: "Dış Güçler",
    description: "Tekrar geldi. Bu sefer Starbucks'tan sipariş getirdi. 'Hatırladınız mı? Biz de sizi hatırladık.' dedi. Fatura 47 dolar.",
    leftChoice: "Faturayı hazineye yükle",
    rightChoice: "Kendin öde — kibarlık şart",
    leftEffects: [{ power: "halk", amount: -5 }, { power: "yatirimcilar", amount: 5 }],
    rightEffects: [{ power: "halk", amount: 10 }, { power: "mafya", amount: -5 }],
    leftMoney: -47, rightMoney: -47,
  },
  // After election 3
  {
    id: 9203,
    character: "Kahve Ustası",
    characterEmoji: "☕",
    category: "Dış Güçler",
    description: "Ülkede 'Başkan Kahveyi Sever' akımı başladı. Kahve ithalatı %300 arttı. Milli kahveciler isyanda. Tarikat dua ediyor: 'Türk kahvesi milli mirastır!'",
    leftChoice: "Kahve kısıtlaması getir",
    rightChoice: "Kahve bayramı ilan et",
    leftEffects: [{ power: "tarikat", amount: 15 }, { power: "yatirimcilar", amount: -10 }],
    rightEffects: [{ power: "halk", amount: 15 }, { power: "yatirimcilar", amount: 10 }, { power: "mafya", amount: -5 }],
    leftMoney: 10, rightMoney: -20,
  },
];
