import { ElectionConfig, ElectionCard } from "@/types/election";
import { Language } from "@/contexts/LanguageContext";

// Card rarity cost/effect standards:
// Common:    cost 3B,  effect 2-3%
// Uncommon:  cost 6B,  effect 4-5%
// Epic:      cost 10B, effect 5-6%
// Legendary: cost 15B, effect 7-8% (special exceptions: "Her şey çok güzel olacak" = 10%)

/* ── İKTİDAR (GOVERNMENT) CARD POOL (TR) ── */
const govCardsTr: ElectionCard[] = [
  // === COMMON (3B, 2-3%) ===
  { id: 1, text: "Köy ziyareti yap", emoji: "🏘️", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 2, text: "Cami açılışı yap", emoji: "🕌", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 3, text: "Bedava ekmek dağıt", emoji: "🍞", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 4, text: "Ücretsiz kömür dağıt", emoji: "🪨", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 11, text: "Milli değerler söylemi", emoji: "🏴", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 12, text: "Muhalefete vatan haini de", emoji: "🗞️", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 13, text: "Devlet töreni düzenle", emoji: "🎖️", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 21, text: "Esnafa kredi müjdele", emoji: "🏪", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 22, text: "Bedelli askerlik çıkar", emoji: "⭐", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 23, text: "Ucuz konut vaat et", emoji: "🏠", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 31, text: "Düğünlere git", emoji: "💒", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 32, text: "Ücretsiz ulaşım vaat et", emoji: "🚌", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 41, text: "Vatandaşlık dağıt", emoji: "🎁", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 42, text: "Ucuz doğalgaz vaat et", emoji: "🔥", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 43, text: "Enflasyon rakamlarını gizle", emoji: "📊", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 51, text: "Sahte zafer ilan et", emoji: "🏆", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 52, text: "Bedava her şey dağıt", emoji: "🎁", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 53, text: "Milliyetçi kartı oyna", emoji: "📣", voterEffect: 3, cost: 3, rarity: "common" },

  // === UNCOMMON (6B, 4-5%) ===
  { id: 5, text: "Yeni hastane açılışı yap", emoji: "🏥", voterEffect: 5, cost: 6, rarity: "uncommon" },
  { id: 14, text: "Ekonomik istikrar vaat et", emoji: "📈", voterEffect: 4, cost: 6, rarity: "uncommon" },
  { id: 15, text: "Yolsuzluk kasetlerini engelle", emoji: "📼", voterEffect: 5, cost: 6, rarity: "uncommon" },
  { id: 24, text: "Döviz müdahalesi yap", emoji: "💱", voterEffect: 5, cost: 6, rarity: "uncommon" },
  { id: 25, text: "Miting maratonu başlat", emoji: "🎤", voterEffect: 4, cost: 6, rarity: "uncommon" },
  { id: 34, text: "Altyapı projesi göster", emoji: "🚇", voterEffect: 4, cost: 6, rarity: "uncommon" },
  { id: 35, text: "Spor kompleksi aç", emoji: "🏟️", voterEffect: 4, cost: 6, rarity: "uncommon" },
  { id: 44, text: "Deprem yardımı vaadi ver", emoji: "🏗️", voterEffect: 5, cost: 6, rarity: "uncommon" },
  { id: 54, text: "Tüm medyayı sustur", emoji: "🔇", voterEffect: 5, cost: 6, rarity: "uncommon" },
  { id: 55, text: "Korku iklimi oluştur", emoji: "😰", voterEffect: 4, cost: 6, rarity: "uncommon" },

  // === EPIC (10B, 5-6%) ===
  { id: 6, text: "Meydan mitingi düzenle", emoji: "🎤", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 7, text: "Emekli maaşına zam ver", emoji: "💰", voterEffect: 5, cost: 10, rarity: "epic" },
  { id: 16, text: "Park nöbetçileri olaylarını terörize et", emoji: "😱", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 17, text: "Sosyal yardım dağıt", emoji: "📦", voterEffect: 5, cost: 10, rarity: "epic" },
  { id: 26, text: "Mega proje açılışı yap", emoji: "🌉", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 27, text: "Sınır ötesi operasyon göster", emoji: "🎯", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 36, text: "Seçim güvenliği vaat et", emoji: "🔒", voterEffect: 5, cost: 10, rarity: "epic" },
  { id: 37, text: "Muhalefeti karalama kampanyası", emoji: "🗞️", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 46, text: "Asgari ücret artışı müjdele", emoji: "💵", voterEffect: 5, cost: 10, rarity: "epic" },
  { id: 47, text: "Dış politika kozunu oyna", emoji: "🌍", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 56, text: "Anayasa değişikliği zorla", emoji: "📜", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 57, text: "Son büyük miting", emoji: "🎪", voterEffect: 6, cost: 10, rarity: "epic" },

  // === LEGENDARY (15B, 7-8%, exception: 10%) ===
  { id: 8, text: "TV'de duygusal konuşma yap", emoji: "😢", voterEffect: 8, cost: 15, rarity: "legendary" },
  { id: 18, text: "Milli birlik çağrısı yap", emoji: "📣", voterEffect: 7, cost: 15, rarity: "legendary" },
  { id: 28, text: "Seçim ittifakı kur", emoji: "🤝", voterEffect: 8, cost: 15, rarity: "legendary" },
  { id: 38, text: "Her şey çok güzel olacak", emoji: "🌈", voterEffect: 10, cost: 15, rarity: "legendary" },
  { id: 48, text: "Emekliye ek zam ver", emoji: "💰", voterEffect: 7, cost: 15, rarity: "legendary" },
  { id: 58, text: "Ekonomik mucize vaat et", emoji: "✨", voterEffect: 8, cost: 15, rarity: "legendary" },
];

/* ── MUHALEFET (OPPOSITION) CARD POOL (TR) ── */
const oppCardsTr: ElectionCard[] = [
  // === COMMON (3B, 2-3%) ===
  { id: 101, text: "128 milyar dolar nerede?", emoji: "💸", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 102, text: "Soğan patates kuyruğu göster", emoji: "🧅", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 103, text: "İşsizlik rakamlarını paylaş", emoji: "📉", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 104, text: "Gençler yurt dışına kaçıyor", emoji: "✈️", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 105, text: "Halk geçinemiyor sloganı", emoji: "😤", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 106, text: "Emekliler perişan kampanyası", emoji: "👴", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 107, text: "Elektrik faturalarını göster", emoji: "⚡", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 108, text: "Esnaf kepenk kapatıyor", emoji: "🏪", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 109, text: "Çiftçi borç batağında", emoji: "🌾", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 110, text: "Eğitim sistemi çöktü", emoji: "📚", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 111, text: "Sağlık sistemi yetersiz", emoji: "🏥", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 112, text: "Kadın cinayetlerini gündeme getir", emoji: "🚨", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 113, text: "Deprem ihmallerini hatırlat", emoji: "🏚️", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 114, text: "Vergi adaleti iste", emoji: "⚖️", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 115, text: "Saray harcamalarını eleştir", emoji: "🏰", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 116, text: "Mülteci politikasını eleştir", emoji: "🚪", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 117, text: "Gençlere iş vaat et", emoji: "💼", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 118, text: "Sokak röportajı yap", emoji: "🎙️", voterEffect: 2, cost: 3, rarity: "common" },

  // === UNCOMMON (6B, 4-5%) ===
  { id: 201, text: "Yolsuzluk dosyalarını aç", emoji: "📂", voterEffect: 5, cost: 6, rarity: "uncommon" },
  { id: 202, text: "Bağımsız yargı vaat et", emoji: "⚖️", voterEffect: 4, cost: 6, rarity: "uncommon" },
  { id: 203, text: "Ekonomi zirvesi düzenle", emoji: "📊", voterEffect: 4, cost: 6, rarity: "uncommon" },
  { id: 204, text: "Uluslararası destek al", emoji: "🌐", voterEffect: 5, cost: 6, rarity: "uncommon" },
  { id: 205, text: "Basın özgürlüğü mitingi", emoji: "📰", voterEffect: 4, cost: 6, rarity: "uncommon" },
  { id: 206, text: "Enflasyon gerçeklerini yayınla", emoji: "📈", voterEffect: 5, cost: 6, rarity: "uncommon" },
  { id: 207, text: "Maaş karşılaştırması yap", emoji: "💰", voterEffect: 4, cost: 6, rarity: "uncommon" },
  { id: 208, text: "Cumhuriyet mitingi düzenle", emoji: "🇹🇷", voterEffect: 5, cost: 6, rarity: "uncommon" },
  { id: 209, text: "Sosyal medya kampanyası", emoji: "📱", voterEffect: 4, cost: 6, rarity: "uncommon" },
  { id: 210, text: "Seçim güvenliği talep et", emoji: "🔐", voterEffect: 5, cost: 6, rarity: "uncommon" },

  // === EPIC (10B, 5-6%) ===
  { id: 301, text: "Millet İttifakı kur", emoji: "🤝", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 302, text: "Büyük meydan mitingi düzenle", emoji: "🎤", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 303, text: "Ekonomi vaatleri paketi sun", emoji: "📋", voterEffect: 5, cost: 10, rarity: "epic" },
  { id: 304, text: "Adalet yürüyüşü başlat", emoji: "👣", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 305, text: "Dış politika eleştirisi yap", emoji: "🌍", voterEffect: 5, cost: 10, rarity: "epic" },
  { id: 306, text: "Seçim vaatleri manifestosu", emoji: "📜", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 307, text: "Halk TV canlı yayın çık", emoji: "📺", voterEffect: 5, cost: 10, rarity: "epic" },
  { id: 308, text: "Sokak ekonomisi raporla", emoji: "📉", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 309, text: "Gençlik hareketi başlat", emoji: "✊", voterEffect: 5, cost: 10, rarity: "epic" },
  { id: 310, text: "Kadın hakları manifestosu", emoji: "♀️", voterEffect: 5, cost: 10, rarity: "epic" },
  { id: 311, text: "Deprem raporu yayınla", emoji: "📄", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 312, text: "İktidarı karala kampanyası", emoji: "🗞️", voterEffect: 6, cost: 10, rarity: "epic" },

  // === LEGENDARY (15B, 7-8%) ===
  { id: 401, text: "Tamam mı devam mı?", emoji: "🗳️", voterEffect: 8, cost: 15, rarity: "legendary" },
  { id: 402, text: "Her şey çok kötü oldu", emoji: "😭", voterEffect: 7, cost: 15, rarity: "legendary" },
  { id: 403, text: "Millet iradesi konuşması", emoji: "🎙️", voterEffect: 8, cost: 15, rarity: "legendary" },
  { id: 404, text: "6'lı masa birleş", emoji: "🪑", voterEffect: 8, cost: 15, rarity: "legendary" },
  { id: 405, text: "Tarihi meydan mitingi", emoji: "🏛️", voterEffect: 7, cost: 15, rarity: "legendary" },
  { id: 406, text: "Bay bay bay!", emoji: "👋", voterEffect: 8, cost: 15, rarity: "legendary" },
];

/* ── İKTİDAR (GOVERNMENT) CARD POOL (EN) ── */
const govCardsEn: ElectionCard[] = [
  // === COMMON ===
  { id: 1, text: "Visit rural villages", emoji: "🏘️", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 2, text: "Open a new mosque", emoji: "🕌", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 3, text: "Distribute free bread", emoji: "🍞", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 4, text: "Distribute free coal", emoji: "🪨", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 11, text: "National values rhetoric", emoji: "🏴", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 12, text: "Call opposition traitors", emoji: "🗞️", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 13, text: "Hold state ceremony", emoji: "🎖️", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 21, text: "Announce business loans", emoji: "🏪", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 22, text: "Pass paid military service", emoji: "⭐", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 23, text: "Promise cheap housing", emoji: "🏠", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 31, text: "Attend weddings", emoji: "💒", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 32, text: "Promise free transport", emoji: "🚌", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 41, text: "Hand out citizenships", emoji: "🎁", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 42, text: "Promise cheap gas", emoji: "🔥", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 43, text: "Hide inflation numbers", emoji: "📊", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 51, text: "Declare fake victory", emoji: "🏆", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 52, text: "Give away everything free", emoji: "🎁", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 53, text: "Play the nationalist card", emoji: "📣", voterEffect: 3, cost: 3, rarity: "common" },

  // === UNCOMMON ===
  { id: 5, text: "Open a new hospital", emoji: "🏥", voterEffect: 5, cost: 6, rarity: "uncommon" },
  { id: 14, text: "Promise economic stability", emoji: "📈", voterEffect: 4, cost: 6, rarity: "uncommon" },
  { id: 15, text: "Block corruption tapes", emoji: "📼", voterEffect: 5, cost: 6, rarity: "uncommon" },
  { id: 24, text: "Intervene in currency", emoji: "💱", voterEffect: 5, cost: 6, rarity: "uncommon" },
  { id: 25, text: "Start rally marathon", emoji: "🎤", voterEffect: 4, cost: 6, rarity: "uncommon" },
  { id: 34, text: "Show infrastructure project", emoji: "🚇", voterEffect: 4, cost: 6, rarity: "uncommon" },
  { id: 35, text: "Open sports complex", emoji: "🏟️", voterEffect: 4, cost: 6, rarity: "uncommon" },
  { id: 44, text: "Promise earthquake relief", emoji: "🏗️", voterEffect: 5, cost: 6, rarity: "uncommon" },
  { id: 54, text: "Silence all media", emoji: "🔇", voterEffect: 5, cost: 6, rarity: "uncommon" },
  { id: 55, text: "Create climate of fear", emoji: "😰", voterEffect: 4, cost: 6, rarity: "uncommon" },

  // === EPIC ===
  { id: 6, text: "Hold a massive rally", emoji: "🎤", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 7, text: "Raise retiree pensions", emoji: "💰", voterEffect: 5, cost: 10, rarity: "epic" },
  { id: 16, text: "Label Park Defenders as terrorism", emoji: "😱", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 17, text: "Distribute social aid", emoji: "📦", voterEffect: 5, cost: 10, rarity: "epic" },
  { id: 26, text: "Open mega project", emoji: "🌉", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 27, text: "Show cross-border ops", emoji: "🎯", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 36, text: "Promise election security", emoji: "🔒", voterEffect: 5, cost: 10, rarity: "epic" },
  { id: 37, text: "Launch smear campaign", emoji: "🗞️", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 46, text: "Announce minimum wage hike", emoji: "💵", voterEffect: 5, cost: 10, rarity: "epic" },
  { id: 47, text: "Play foreign policy card", emoji: "🌍", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 56, text: "Force constitution change", emoji: "📜", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 57, text: "Hold the final mega rally", emoji: "🎪", voterEffect: 6, cost: 10, rarity: "epic" },

  // === LEGENDARY ===
  { id: 8, text: "Cry on live TV", emoji: "😢", voterEffect: 8, cost: 15, rarity: "legendary" },
  { id: 18, text: "Call for national unity", emoji: "📣", voterEffect: 7, cost: 15, rarity: "legendary" },
  { id: 28, text: "Form election alliance", emoji: "🤝", voterEffect: 8, cost: 15, rarity: "legendary" },
  { id: 38, text: "Everything will be great", emoji: "🌈", voterEffect: 10, cost: 15, rarity: "legendary" },
  { id: 48, text: "Give retirees a bonus", emoji: "💰", voterEffect: 7, cost: 15, rarity: "legendary" },
  { id: 58, text: "Promise economic miracle", emoji: "✨", voterEffect: 8, cost: 15, rarity: "legendary" },
];

/* ── MUHALEFET (OPPOSITION) CARD POOL (EN) ── */
const oppCardsEn: ElectionCard[] = [
  // === COMMON ===
  { id: 101, text: "Where's the 128 billion dollars?", emoji: "💸", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 102, text: "Show onion & potato queues", emoji: "🧅", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 103, text: "Share unemployment stats", emoji: "📉", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 104, text: "Youth fleeing the country", emoji: "✈️", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 105, text: "People can't make ends meet", emoji: "😤", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 106, text: "Retirees in misery campaign", emoji: "👴", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 107, text: "Show electricity bills", emoji: "⚡", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 108, text: "Shops shutting down", emoji: "🏪", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 109, text: "Farmers drowning in debt", emoji: "🌾", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 110, text: "Education system collapsed", emoji: "📚", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 111, text: "Healthcare system failing", emoji: "🏥", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 112, text: "Raise femicide awareness", emoji: "🚨", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 113, text: "Remind earthquake negligence", emoji: "🏚️", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 114, text: "Demand tax justice", emoji: "⚖️", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 115, text: "Criticize palace spending", emoji: "🏰", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 116, text: "Criticize refugee policy", emoji: "🚪", voterEffect: 2, cost: 3, rarity: "common" },
  { id: 117, text: "Promise jobs for youth", emoji: "💼", voterEffect: 3, cost: 3, rarity: "common" },
  { id: 118, text: "Do street interviews", emoji: "🎙️", voterEffect: 2, cost: 3, rarity: "common" },

  // === UNCOMMON ===
  { id: 201, text: "Open corruption files", emoji: "📂", voterEffect: 5, cost: 6, rarity: "uncommon" },
  { id: 202, text: "Promise independent judiciary", emoji: "⚖️", voterEffect: 4, cost: 6, rarity: "uncommon" },
  { id: 203, text: "Hold economy summit", emoji: "📊", voterEffect: 4, cost: 6, rarity: "uncommon" },
  { id: 204, text: "Get international support", emoji: "🌐", voterEffect: 5, cost: 6, rarity: "uncommon" },
  { id: 205, text: "Press freedom rally", emoji: "📰", voterEffect: 4, cost: 6, rarity: "uncommon" },
  { id: 206, text: "Publish real inflation data", emoji: "📈", voterEffect: 5, cost: 6, rarity: "uncommon" },
  { id: 207, text: "Compare salary vs expenses", emoji: "💰", voterEffect: 4, cost: 6, rarity: "uncommon" },
  { id: 208, text: "Hold Republic rally", emoji: "🇹🇷", voterEffect: 5, cost: 6, rarity: "uncommon" },
  { id: 209, text: "Social media campaign", emoji: "📱", voterEffect: 4, cost: 6, rarity: "uncommon" },
  { id: 210, text: "Demand election security", emoji: "🔐", voterEffect: 5, cost: 6, rarity: "uncommon" },

  // === EPIC ===
  { id: 301, text: "Form Nation Alliance", emoji: "🤝", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 302, text: "Hold massive square rally", emoji: "🎤", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 303, text: "Present economy package", emoji: "📋", voterEffect: 5, cost: 10, rarity: "epic" },
  { id: 304, text: "Start Justice March", emoji: "👣", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 305, text: "Foreign policy critique", emoji: "🌍", voterEffect: 5, cost: 10, rarity: "epic" },
  { id: 306, text: "Election promises manifesto", emoji: "📜", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 307, text: "Go live on opposition TV", emoji: "📺", voterEffect: 5, cost: 10, rarity: "epic" },
  { id: 308, text: "Report street economy", emoji: "📉", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 309, text: "Start youth movement", emoji: "✊", voterEffect: 5, cost: 10, rarity: "epic" },
  { id: 310, text: "Women's rights manifesto", emoji: "♀️", voterEffect: 5, cost: 10, rarity: "epic" },
  { id: 311, text: "Publish earthquake report", emoji: "📄", voterEffect: 6, cost: 10, rarity: "epic" },
  { id: 312, text: "Smear the ruling party", emoji: "🗞️", voterEffect: 6, cost: 10, rarity: "epic" },

  // === LEGENDARY ===
  { id: 401, text: "Enough or continue?", emoji: "🗳️", voterEffect: 8, cost: 15, rarity: "legendary" },
  { id: 402, text: "Everything went wrong", emoji: "😭", voterEffect: 7, cost: 15, rarity: "legendary" },
  { id: 403, text: "Voice of the people speech", emoji: "🎙️", voterEffect: 8, cost: 15, rarity: "legendary" },
  { id: 404, text: "Unite the Table of Six", emoji: "🪑", voterEffect: 8, cost: 15, rarity: "legendary" },
  { id: 405, text: "Historic square rally", emoji: "🏛️", voterEffect: 7, cost: 15, rarity: "legendary" },
  { id: 406, text: "Bye bye bye!", emoji: "👋", voterEffect: 8, cost: 15, rarity: "legendary" },
];

/* ── ELECTION CONFIGS ── */

const electionsTr: ElectionConfig[] = [
  {
    year: 2008, triggerTurn: 23, title: "SEÇİM 2008", subtitle: "Genel Seçim - Kolay mı sandın?",
    startingPlayerVote: 58, playerCards: govCardsTr, oppositionCards: oppCardsTr,
    specialPowers: [
      { id: "montaj08", name: "Montajlı Video Yayınla", emoji: "🎬", description: "Muhalefet liderinin 'gizli' kasetini yayınla", voterEffect: 8, launderedCost: 15 },
      { id: "media08", name: "Medya Baskısı", emoji: "📺", description: "Ana akım medyayı kontrol et", voterEffect: 6, launderedCost: 10 },
      { id: "troll08", name: "Troll Ordusu Kur", emoji: "🤖", description: "Sosyal medyada sahte hesaplarla karalama yap", voterEffect: 5, launderedCost: 8 },
      { id: "teror08", name: "Terör Olayları Tezgahla", emoji: "🎭", description: "Tam zamanında 'güvenlik tehdidi' çıkar", voterEffect: 10, launderedCost: 25 },
    ],
  },
  {
    year: 2013, triggerTurn: 40, title: "SEÇİM 2013", subtitle: "Yerel Seçim - Gezi'nin gölgesinde!",
    startingPlayerVote: 55, playerCards: govCardsTr, oppositionCards: oppCardsTr,
    specialPowers: [
      { id: "twitter13", name: "Twitter Yasağı", emoji: "🐦", description: "Sosyal medyayı kapat", voterEffect: 7, launderedCost: 12 },
      { id: "teror13", name: "Terör Kartını Oyna", emoji: "💣", description: "'Terör bağlantısı' iddiaları ile muhalefetin sesini kes", voterEffect: 8, launderedCost: 14 },
      { id: "paralel13", name: "Paralel Yapı İftirası", emoji: "🕸️", description: "Muhalefeti 'paralel yapı' ile suçla", voterEffect: 6, launderedCost: 10 },
      { id: "dinle13", name: "Telefon Dinleme", emoji: "🎧", description: "Rakiplerin konuşmalarını dinle ve sızdır", voterEffect: 7, launderedCost: 11 },
    ],
  },
  {
    year: 2018, triggerTurn: 55, title: "SEÇİM 2018", subtitle: "Cumhurbaşkanlığı - Sistem değişiyor!",
    startingPlayerVote: 46, playerCards: govCardsTr, oppositionCards: oppCardsTr,
    specialPowers: [
      { id: "ittifak18", name: "İttifak Pazarlığı", emoji: "🤝", description: "Küçük partilerle gizli anlaşma yap", voterEffect: 9, launderedCost: 22 },
      { id: "montaj18", name: "Montajlı Görüntü Sız", emoji: "🎥", description: "Rakibin 'skandal' görüntülerini sızdır", voterEffect: 7, launderedCost: 16 },
      { id: "dolar18", name: "Dolar Müdahalesi", emoji: "💵", description: "Merkez bankasına baskı yap", voterEffect: 8, launderedCost: 20 },
      { id: "hakim18", name: "Hakimleri Ata", emoji: "⚖️", description: "Yüksek yargıya kendi adamlarını yerleştir", voterEffect: 7, launderedCost: 18 },
    ],
  },
  {
    year: 2019, triggerTurn: 63, title: "SEÇİM 2019", subtitle: "Ara Seçim - Başkanlık sistemine geçiş!",
    startingPlayerVote: 43, playerCards: govCardsTr, oppositionCards: oppCardsTr,
    specialPowers: [
      { id: "tekrar", name: "Seçimi Tekrarlat", emoji: "🔄", description: "YSK'ya baskı yap, seçimi iptal ettir", voterEffect: 12, launderedCost: 28 },
      { id: "sandik", name: "Sandık Başı Operasyonu", emoji: "📦", description: "Müşahitlere baskı yap", voterEffect: 8, launderedCost: 20 },
      { id: "teror19", name: "Terör Olayları Tezgahla", emoji: "🎭", description: "Tam zamanında 'güvenlik tehdidi' çıkar", voterEffect: 9, launderedCost: 22 },
      { id: "elektrik19", name: "Elektrik Kesintisi", emoji: "🔌", description: "Sayım sırasında 'teknik arıza' çıkar", voterEffect: 7, launderedCost: 16 },
    ],
  },
  {
    year: 2024, triggerTurn: 75, title: "SEÇİM 2024", subtitle: "Kritik Seçim - Ya hep ya hiç!",
    startingPlayerVote: 40, playerCards: govCardsTr, oppositionCards: oppCardsTr,
    specialPowers: [
      { id: "tuik", name: "TÜİK Manipülasyonu", emoji: "📊", description: "Resmi rakamları güzelleştir", voterEffect: 8, launderedCost: 22 },
      { id: "montaj24", name: "Deepfake Video Yay", emoji: "🤖", description: "Yapay zeka ile rakibin sahte videosunu üret", voterEffect: 10, launderedCost: 28 },
      { id: "muhbol", name: "Muhalefeti Böl", emoji: "🔪", description: "Aday kalabalığı yarat", voterEffect: 11, launderedCost: 30 },
      { id: "depremkart", name: "Deprem Kartı", emoji: "🏗️", description: "Afet vaatleri yap", voterEffect: 6, launderedCost: 15 },
    ],
  },
  {
    year: 2028, triggerTurn: 87, title: "🏆 FİNAL BOSS 2028 🏆", subtitle: "Son Savaş - Tahtını koruyabilecek misin?",
    startingPlayerVote: 35, isFinalBoss: true, playerCards: govCardsTr, oppositionCards: oppCardsTr,
    specialPowers: [
      { id: "darbe28", name: "Darbe Tehdidi", emoji: "🎖️", description: "Orduyu tehdit olarak kullan", voterEffect: 11, launderedCost: 32 },
      { id: "internet28", name: "İnternet Kesintisi", emoji: "🌐", description: "Tüm interneti kapat", voterEffect: 10, launderedCost: 30 },
      { id: "sahteoy", name: "Sahte Oy Operasyonu", emoji: "🗳️", description: "Sandıkları manipüle et", voterEffect: 13, launderedCost: 38 },
      { id: "sikiyo28", name: "Sıkıyönetim İlan Et", emoji: "⚠️", description: "Olağanüstü hal ilan et", voterEffect: 9, launderedCost: 26 },
    ],
  },
];

const electionsEn: ElectionConfig[] = [
  {
    year: 2008, triggerTurn: 23, title: "ELECTION 2008", subtitle: "General Election - Think it's easy?",
    startingPlayerVote: 58, playerCards: govCardsEn, oppositionCards: oppCardsEn,
    specialPowers: [
      { id: "montaj08", name: "Leak Edited Tape", emoji: "🎬", description: "Leak a 'secret' tape of opposition leader", voterEffect: 8, launderedCost: 15 },
      { id: "media08", name: "Media Pressure", emoji: "📺", description: "Control mainstream media", voterEffect: 6, launderedCost: 10 },
      { id: "troll08", name: "Troll Army", emoji: "🤖", description: "Smear campaign with fake social media accounts", voterEffect: 5, launderedCost: 8 },
      { id: "teror08", name: "Stage Terror Scare", emoji: "🎭", description: "Conveniently timed 'security threat'", voterEffect: 10, launderedCost: 25 },
    ],
  },
  {
    year: 2013, triggerTurn: 40, title: "ELECTION 2013", subtitle: "Local Election - In the shadow of defending of a Park!",
    startingPlayerVote: 55, playerCards: govCardsEn, oppositionCards: oppCardsEn,
    specialPowers: [
      { id: "twitter13", name: "Twitter Ban", emoji: "🐦", description: "Shut down social media", voterEffect: 7, launderedCost: 12 },
      { id: "teror13", name: "Play Terror Card", emoji: "💣", description: "Silence opposition with 'terror links' allegations", voterEffect: 8, launderedCost: 14 },
      { id: "paralel13", name: "Parallel State Smear", emoji: "🕸️", description: "Accuse opposition of being a 'parallel state'", voterEffect: 6, launderedCost: 10 },
      { id: "dinle13", name: "Wiretap Rivals", emoji: "🎧", description: "Tap rival phones and leak conversations", voterEffect: 7, launderedCost: 11 },
    ],
  },
  {
    year: 2018, triggerTurn: 55, title: "ELECTION 2018", subtitle: "Presidential - System change!",
    startingPlayerVote: 46, playerCards: govCardsEn, oppositionCards: oppCardsEn,
    specialPowers: [
      { id: "ittifak18", name: "Alliance Deal", emoji: "🤝", description: "Secret deal with small parties", voterEffect: 9, launderedCost: 22 },
      { id: "montaj18", name: "Leak Scandal Footage", emoji: "🎥", description: "Leak rival's 'scandalous' footage", voterEffect: 7, launderedCost: 16 },
      { id: "dolar18", name: "Dollar Intervention", emoji: "💵", description: "Pressure the central bank", voterEffect: 8, launderedCost: 20 },
      { id: "hakim18", name: "Appoint Judges", emoji: "⚖️", description: "Install loyalists in the high courts", voterEffect: 7, launderedCost: 18 },
    ],
  },
  {
    year: 2019, triggerTurn: 63, title: "ELECTION 2019", subtitle: "Interim Election - Transition to presidential system!",
    startingPlayerVote: 43, playerCards: govCardsEn, oppositionCards: oppCardsEn,
    specialPowers: [
      { id: "tekrar", name: "Redo Election", emoji: "🔄", description: "Pressure election board to cancel results", voterEffect: 12, launderedCost: 28 },
      { id: "sandik", name: "Ballot Box Ops", emoji: "📦", description: "Pressure election observers", voterEffect: 8, launderedCost: 20 },
      { id: "teror19", name: "Stage Terror Scare", emoji: "🎭", description: "Conveniently timed 'security threat'", voterEffect: 9, launderedCost: 22 },
      { id: "elektrik19", name: "Power Outage", emoji: "🔌", description: "'Technical failure' during vote counting", voterEffect: 7, launderedCost: 16 },
    ],
  },
  {
    year: 2024, triggerTurn: 75, title: "ELECTION 2024", subtitle: "Critical Election - All or nothing!",
    startingPlayerVote: 40, playerCards: govCardsEn, oppositionCards: oppCardsEn,
    specialPowers: [
      { id: "tuik", name: "Stats Manipulation", emoji: "📊", description: "Cook the official numbers", voterEffect: 8, launderedCost: 22 },
      { id: "montaj24", name: "Deepfake Video", emoji: "🤖", description: "AI-generate a fake scandal video of rival", voterEffect: 10, launderedCost: 28 },
      { id: "muhbol", name: "Split Opposition", emoji: "🔪", description: "Create candidate chaos", voterEffect: 11, launderedCost: 30 },
      { id: "depremkart", name: "Earthquake Card", emoji: "🏗️", description: "Make disaster promises", voterEffect: 6, launderedCost: 15 },
    ],
  },
  {
    year: 2028, triggerTurn: 87, title: "🏆 FINAL BOSS 2028 🏆", subtitle: "Final Battle - Can you keep the throne?",
    startingPlayerVote: 35, isFinalBoss: true, playerCards: govCardsEn, oppositionCards: oppCardsEn,
    specialPowers: [
      { id: "darbe28", name: "Coup Threat", emoji: "🎖️", description: "Use the army as a threat", voterEffect: 11, launderedCost: 32 },
      { id: "internet28", name: "Internet Blackout", emoji: "🌐", description: "Shut down all internet", voterEffect: 10, launderedCost: 30 },
      { id: "sahteoy", name: "Fake Ballot Op", emoji: "🗳️", description: "Manipulate the ballot boxes", voterEffect: 13, launderedCost: 38 },
      { id: "sikiyo28", name: "Martial Law", emoji: "⚠️", description: "Declare state of emergency", voterEffect: 9, launderedCost: 26 },
    ],
  },
];

// Maps turn number → election index
export const ELECTION_TRIGGER_MAP: Record<number, number> = {
  23: 0, 40: 1, 55: 2, 63: 3, 75: 4, 87: 5,
};

export function getElectionConfig(lang: Language, index: number): ElectionConfig {
  const configs = lang === "en" ? electionsEn : electionsTr;
  return configs[index];
}

export function getNextElectionInfo(
  turn: number,
  completedElections: number[],
): { year: number; turnsLeft: number } | null {
  const elections = [
    { index: 0, triggerTurn: 23, year: 2008 },
    { index: 1, triggerTurn: 40, year: 2013 },
    { index: 2, triggerTurn: 55, year: 2018 },
    { index: 3, triggerTurn: 63, year: 2019 },
    { index: 4, triggerTurn: 75, year: 2024 },
    { index: 5, triggerTurn: 87, year: 2028 },
  ];
  for (const e of elections) {
    if (e.triggerTurn > turn && !completedElections.includes(e.index)) {
      return { year: e.year, turnsLeft: e.triggerTurn - turn };
    }
  }
  return null;
}
