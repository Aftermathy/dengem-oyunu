import { ElectionConfig } from '@/types/election';
import { Language } from '@/contexts/LanguageContext';

const electionsTr: ElectionConfig[] = [
  {
    year: 2008, triggerTurn: 23, title: 'SEÇİM 2008', subtitle: 'Genel Seçim - Kolay mı sandın?',
    aiDifficultyBonus: 0, catchUpThreshold: 15, catchUpBonus: 3,
    playerCards: [
      { id: 1, text: 'Meydan mitingi düzenle', emoji: '🎤', voterEffect: 5, cost: 8 },
      { id: 2, text: 'Ücretsiz kömür dağıt', emoji: '🪨', voterEffect: 4, cost: 5 },
      { id: 3, text: "TV'de duygusal konuşma yap", emoji: '😢', voterEffect: 6, cost: 12 },
      { id: 4, text: 'Yeni hastane açılışı yap', emoji: '🏥', voterEffect: 4, cost: 8 },
      { id: 5, text: 'Emekli maaşına zam ver', emoji: '💰', voterEffect: 5, cost: 10 },
      { id: 6, text: 'Köy ziyareti yap', emoji: '🏘️', voterEffect: 3, cost: 3 },
      { id: 7, text: 'Cami açılışı yap', emoji: '🕌', voterEffect: 3, cost: 4 },
      { id: 8, text: 'Bedava ekmek dağıt', emoji: '🍞', voterEffect: 4, cost: 6 },
    ],
    aiCards: [
      { id: 101, text: 'Yolsuzluk dosyası açtı', emoji: '📂', voterEffect: 4, cost: 0 },
      { id: 102, text: 'Cumhuriyet mitingi düzenledi', emoji: '🏛️', voterEffect: 5, cost: 0 },
      { id: 103, text: 'AB değerlerini savundu', emoji: '🇪🇺', voterEffect: 3, cost: 0 },
      { id: 104, text: 'Basın toplantısı yaptı', emoji: '📰', voterEffect: 3, cost: 0 },
      { id: 105, text: 'Gençlere seslendi', emoji: '🧑‍🎓', voterEffect: 3, cost: 0 },
      { id: 106, text: 'Protesto düzenledi', emoji: '✊', voterEffect: 4, cost: 0 },
    ],
    specialPowers: [
      { id: 'ergenekon', name: 'Ergenekon Operasyonu', emoji: '🔍', description: 'Darbe planı iddiaları ile muhalefeti zayıflat', voterEffect: 8, launderedCost: 15 },
      { id: 'media08', name: 'Medya Baskısı', emoji: '📺', description: 'Ana akım medyayı kontrol et', voterEffect: 6, launderedCost: 10 },
    ],
  },
  {
    year: 2016, triggerTurn: 55, title: 'SEÇİM 2016', subtitle: 'Referandum - Tek adam rejimi mi?',
    aiDifficultyBonus: 1, catchUpThreshold: 12, catchUpBonus: 4,
    playerCards: [
      { id: 11, text: 'OHAL korkusu yay', emoji: '😱', voterEffect: 5, cost: 10 },
      { id: 12, text: 'Milli birlik çağrısı yap', emoji: '🇹🇷', voterEffect: 6, cost: 12 },
      { id: 13, text: 'Devlet töreni düzenle', emoji: '🎖️', voterEffect: 4, cost: 8 },
      { id: 14, text: 'Ekonomik istikrar vaat et', emoji: '📈', voterEffect: 4, cost: 8 },
      { id: 15, text: 'Sosyal yardım dağıt', emoji: '📦', voterEffect: 5, cost: 10 },
      { id: 16, text: 'Bayrak kampanyası başlat', emoji: '🏴', voterEffect: 3, cost: 5 },
      { id: 17, text: 'Şehit ailelerini ziyaret et', emoji: '🕊️', voterEffect: 5, cost: 7 },
      { id: 18, text: 'Muhalefete vatan haini de', emoji: '🗞️', voterEffect: 4, cost: 6 },
    ],
    aiCards: [
      { id: 111, text: 'Demokratik hakları savundu', emoji: '⚖️', voterEffect: 5, cost: 0 },
      { id: 112, text: 'Sokağa çık çağrısı yaptı', emoji: '📢', voterEffect: 4, cost: 0 },
      { id: 113, text: 'Uluslararası baskı kurdu', emoji: '🌍', voterEffect: 4, cost: 0 },
      { id: 114, text: 'Akademisyenler bildirisi yayınladı', emoji: '📝', voterEffect: 3, cost: 0 },
      { id: 115, text: 'Sosyal medya kampanyası başlattı', emoji: '📱', voterEffect: 5, cost: 0 },
      { id: 116, text: 'Barış mitingi düzenledi', emoji: '☮️', voterEffect: 4, cost: 0 },
    ],
    specialPowers: [
      { id: '15temmuz', name: '15 Temmuz Kartı', emoji: '🎖️', description: 'Darbe girişimini hatırlat, milli birlik söylemi', voterEffect: 10, launderedCost: 20 },
      { id: 'khk', name: 'KHK ile Tasfiye', emoji: '📜', description: 'Muhalif kurumları kapat', voterEffect: 7, launderedCost: 15 },
      { id: 'media16', name: 'Medya Karartması', emoji: '📺', description: 'Muhalefet haberlerini engelle', voterEffect: 5, launderedCost: 10 },
    ],
  },
  {
    year: 2018, triggerTurn: 63, title: 'SEÇİM 2018', subtitle: 'Cumhurbaşkanlığı - Sistem değişiyor!',
    aiDifficultyBonus: 2, catchUpThreshold: 10, catchUpBonus: 4,
    playerCards: [
      { id: 21, text: 'Mega proje açılışı yap', emoji: '🌉', voterEffect: 5, cost: 12 },
      { id: 22, text: 'Döviz müdahalesi yap', emoji: '💱', voterEffect: 4, cost: 10 },
      { id: 23, text: 'Seçim ittifakı kur', emoji: '🤝', voterEffect: 6, cost: 15 },
      { id: 24, text: 'Bedelli askerlik çıkar', emoji: '⭐', voterEffect: 4, cost: 8 },
      { id: 25, text: 'Miting maratonu başlat', emoji: '🎤', voterEffect: 5, cost: 10 },
      { id: 26, text: 'Ucuz konut vaat et', emoji: '🏠', voterEffect: 4, cost: 8 },
      { id: 27, text: 'Esnafa kredi müjdele', emoji: '🏪', voterEffect: 3, cost: 5 },
      { id: 28, text: 'Sınır ötesi operasyon göster', emoji: '🎯', voterEffect: 5, cost: 10 },
    ],
    aiCards: [
      { id: 121, text: 'Adalet yürüyüşü başlattı', emoji: '⚖️', voterEffect: 6, cost: 0 },
      { id: 122, text: 'Ekonomi gerçeklerini gösterdi', emoji: '📉', voterEffect: 5, cost: 0 },
      { id: 123, text: 'Birleşik muhalefet kurdu', emoji: '🤝', voterEffect: 5, cost: 0 },
      { id: 124, text: 'Gençlik umudunu yaydı', emoji: '🌟', voterEffect: 4, cost: 0 },
      { id: 125, text: 'Cesur açıklama yaptı', emoji: '🎙️', voterEffect: 4, cost: 0 },
      { id: 126, text: 'Büyük meydan konuşması yaptı', emoji: '🏟️', voterEffect: 5, cost: 0 },
    ],
    specialPowers: [
      { id: 'ittifak18', name: 'İttifak Pazarlığı', emoji: '🤝', description: 'Küçük partilerle gizli anlaşma yap', voterEffect: 8, launderedCost: 20 },
      { id: 'havalimani', name: 'Havalimanı Açılışı', emoji: '✈️', description: 'Mega projeyi gövde gösterisi yap', voterEffect: 6, launderedCost: 15 },
      { id: 'dolar18', name: 'Dolar Müdahalesi', emoji: '💵', description: 'Merkez bankasına baskı yap', voterEffect: 7, launderedCost: 18 },
    ],
  },
  {
    year: 2019, triggerTurn: 67, title: 'SEÇİM 2019', subtitle: 'Yerel Seçim - En Büyük Şehir!',
    aiDifficultyBonus: 2, catchUpThreshold: 8, catchUpBonus: 5,
    playerCards: [
      { id: 31, text: 'Seçim güvenliği vaat et', emoji: '🔒', voterEffect: 4, cost: 10 },
      { id: 32, text: 'Altyapı projesi göster', emoji: '🚇', voterEffect: 4, cost: 8 },
      { id: 33, text: 'Hemşehri ağlarını harekete geçir', emoji: '👥', voterEffect: 5, cost: 12 },
      { id: 34, text: 'Muhalefeti karalama kampanyası', emoji: '🗞️', voterEffect: 5, cost: 15 },
      { id: 35, text: 'Ücretsiz ulaşım vaat et', emoji: '🚌', voterEffect: 3, cost: 5 },
      { id: 36, text: 'Esnaf ziyareti yap', emoji: '🏪', voterEffect: 3, cost: 5 },
      { id: 37, text: 'Spor kompleksi aç', emoji: '🏟️', voterEffect: 4, cost: 8 },
      { id: 38, text: 'Düğünlere git', emoji: '💒', voterEffect: 3, cost: 4 },
    ],
    aiCards: [
      { id: 131, text: '"Her şey çok güzel olacak" dedi', emoji: '🌈', voterEffect: 7, cost: 0 },
      { id: 132, text: 'Halk buluşması yaptı', emoji: '🫂', voterEffect: 5, cost: 0 },
      { id: 133, text: 'Sosyal medya patlaması yaşandı', emoji: '📱', voterEffect: 6, cost: 0 },
      { id: 134, text: 'Gençlerin umudu oldu', emoji: '✨', voterEffect: 5, cost: 0 },
      { id: 135, text: 'Şeffaflık vaadi verdi', emoji: '🔍', voterEffect: 5, cost: 0 },
      { id: 136, text: 'Halk otobüsüyle gezdi', emoji: '🚌', voterEffect: 6, cost: 0 },
    ],
    specialPowers: [
      { id: 'tekrar', name: 'Seçimi Tekrarlat', emoji: '🔄', description: "YSK'ya baskı yap, seçimi iptal ettir", voterEffect: 10, launderedCost: 25 },
      { id: 'sandik', name: 'Sandık Başı Operasyonu', emoji: '📦', description: 'Müşahitlere baskı yap', voterEffect: 8, launderedCost: 20 },
      { id: 'muhursuz', name: 'Mühürsüz Zarf', emoji: '📝', description: 'Oy pusulalarıyla oyna', voterEffect: 6, launderedCost: 15 },
    ],
  },
  {
    year: 2024, triggerTurn: 87, title: 'SEÇİM 2024', subtitle: 'Son Savaş - Ya hep ya hiç!',
    aiDifficultyBonus: 3, catchUpThreshold: 5, catchUpBonus: 6,
    playerCards: [
      { id: 41, text: 'Deprem yardımı vaadi ver', emoji: '🏗️', voterEffect: 4, cost: 12 },
      { id: 42, text: 'Enflasyon rakamlarını gizle', emoji: '📊', voterEffect: 3, cost: 8 },
      { id: 43, text: 'Emekliye ek zam ver', emoji: '💰', voterEffect: 5, cost: 15 },
      { id: 44, text: 'Miting maratonu başlat', emoji: '🎤', voterEffect: 4, cost: 10 },
      { id: 45, text: 'Asgari ücret artışı müjdele', emoji: '💵', voterEffect: 4, cost: 10 },
      { id: 46, text: 'Dış politika kozunu oyna', emoji: '🌍', voterEffect: 5, cost: 12 },
      { id: 47, text: 'Vatandaşlık dağıt', emoji: '🎁', voterEffect: 3, cost: 6 },
      { id: 48, text: 'Ucuz doğalgaz vaat et', emoji: '🔥', voterEffect: 4, cost: 8 },
    ],
    aiCards: [
      { id: 141, text: 'Ekonomi gerçeklerini gösterdi', emoji: '📉', voterEffect: 7, cost: 0 },
      { id: 142, text: 'Deprem hesabını sordu', emoji: '🏚️', voterEffect: 7, cost: 0 },
      { id: 143, text: 'Gençlik isyanı başladı', emoji: '🔥', voterEffect: 6, cost: 0 },
      { id: 144, text: 'Birleşik muhalefet gücü topladı', emoji: '💪', voterEffect: 8, cost: 0 },
      { id: 145, text: 'Uluslararası destek aldı', emoji: '🌐', voterEffect: 5, cost: 0 },
      { id: 146, text: 'Sosyal medya devrimi başlattı', emoji: '📱', voterEffect: 6, cost: 0 },
    ],
    specialPowers: [
      { id: 'tuik', name: 'TÜİK Manipülasyonu', emoji: '📊', description: 'Resmi rakamları güzelleştir', voterEffect: 7, launderedCost: 20 },
      { id: 'sosyalban', name: 'Sosyal Medya Yasağı', emoji: '🚫', description: 'Twitter/TikTok\'u kapat', voterEffect: 8, launderedCost: 25 },
      { id: 'muhbol', name: 'Muhalefeti Böl', emoji: '🔪', description: 'Aday kalabalığı yarat', voterEffect: 10, launderedCost: 30 },
      { id: 'depremkart', name: 'Deprem Kartı', emoji: '🏗️', description: 'Afet vaatleri yap', voterEffect: 5, launderedCost: 15 },
    ],
  },
];

const electionsEn: ElectionConfig[] = [
  {
    year: 2008, triggerTurn: 23, title: 'ELECTION 2008', subtitle: 'General Election - Think it\'s easy?',
    aiDifficultyBonus: 0, catchUpThreshold: 15, catchUpBonus: 3,
    playerCards: [
      { id: 1, text: 'Hold a massive rally', emoji: '🎤', voterEffect: 5, cost: 8 },
      { id: 2, text: 'Distribute free coal', emoji: '🪨', voterEffect: 4, cost: 5 },
      { id: 3, text: 'Cry on live TV', emoji: '😢', voterEffect: 6, cost: 12 },
      { id: 4, text: 'Open a new hospital', emoji: '🏥', voterEffect: 4, cost: 8 },
      { id: 5, text: 'Raise retiree pensions', emoji: '💰', voterEffect: 5, cost: 10 },
      { id: 6, text: 'Visit rural villages', emoji: '🏘️', voterEffect: 3, cost: 3 },
      { id: 7, text: 'Open a new mosque', emoji: '🕌', voterEffect: 3, cost: 4 },
      { id: 8, text: 'Distribute free bread', emoji: '🍞', voterEffect: 4, cost: 6 },
    ],
    aiCards: [
      { id: 101, text: 'Opened corruption files', emoji: '📂', voterEffect: 4, cost: 0 },
      { id: 102, text: 'Held a republic rally', emoji: '🏛️', voterEffect: 5, cost: 0 },
      { id: 103, text: 'Defended EU values', emoji: '🇪🇺', voterEffect: 3, cost: 0 },
      { id: 104, text: 'Gave a press conference', emoji: '📰', voterEffect: 3, cost: 0 },
      { id: 105, text: 'Appealed to youth', emoji: '🧑‍🎓', voterEffect: 3, cost: 0 },
      { id: 106, text: 'Organized protests', emoji: '✊', voterEffect: 4, cost: 0 },
    ],
    specialPowers: [
      { id: 'ergenekon', name: 'Ergenekon Op.', emoji: '🔍', description: 'Weaken opposition with coup plot allegations', voterEffect: 8, launderedCost: 15 },
      { id: 'media08', name: 'Media Pressure', emoji: '📺', description: 'Control mainstream media', voterEffect: 6, launderedCost: 10 },
    ],
  },
  {
    year: 2016, triggerTurn: 55, title: 'ELECTION 2016', subtitle: 'Referendum - One-man rule?',
    aiDifficultyBonus: 1, catchUpThreshold: 12, catchUpBonus: 4,
    playerCards: [
      { id: 11, text: 'Spread emergency fear', emoji: '😱', voterEffect: 5, cost: 10 },
      { id: 12, text: 'Call for national unity', emoji: '🇹🇷', voterEffect: 6, cost: 12 },
      { id: 13, text: 'Hold state ceremony', emoji: '🎖️', voterEffect: 4, cost: 8 },
      { id: 14, text: 'Promise economic stability', emoji: '📈', voterEffect: 4, cost: 8 },
      { id: 15, text: 'Distribute social aid', emoji: '📦', voterEffect: 5, cost: 10 },
      { id: 16, text: 'Launch flag campaign', emoji: '🏴', voterEffect: 3, cost: 5 },
      { id: 17, text: 'Visit martyr families', emoji: '🕊️', voterEffect: 5, cost: 7 },
      { id: 18, text: 'Call opposition traitors', emoji: '🗞️', voterEffect: 4, cost: 6 },
    ],
    aiCards: [
      { id: 111, text: 'Defended democratic rights', emoji: '⚖️', voterEffect: 5, cost: 0 },
      { id: 112, text: 'Called people to streets', emoji: '📢', voterEffect: 4, cost: 0 },
      { id: 113, text: 'Applied international pressure', emoji: '🌍', voterEffect: 4, cost: 0 },
      { id: 114, text: 'Academics signed petition', emoji: '📝', voterEffect: 3, cost: 0 },
      { id: 115, text: 'Social media campaign went viral', emoji: '📱', voterEffect: 5, cost: 0 },
      { id: 116, text: 'Organized peace rally', emoji: '☮️', voterEffect: 4, cost: 0 },
    ],
    specialPowers: [
      { id: '15temmuz', name: 'July 15th Card', emoji: '🎖️', description: 'Remind everyone of the coup attempt', voterEffect: 10, launderedCost: 20 },
      { id: 'khk', name: 'Emergency Decree', emoji: '📜', description: 'Shut down opposition institutions', voterEffect: 7, launderedCost: 15 },
      { id: 'media16', name: 'Media Blackout', emoji: '📺', description: 'Block opposition news', voterEffect: 5, launderedCost: 10 },
    ],
  },
  {
    year: 2018, triggerTurn: 63, title: 'ELECTION 2018', subtitle: 'Presidential - System change!',
    aiDifficultyBonus: 2, catchUpThreshold: 10, catchUpBonus: 4,
    playerCards: [
      { id: 21, text: 'Open mega project', emoji: '🌉', voterEffect: 5, cost: 12 },
      { id: 22, text: 'Intervene in currency', emoji: '💱', voterEffect: 4, cost: 10 },
      { id: 23, text: 'Form election alliance', emoji: '🤝', voterEffect: 6, cost: 15 },
      { id: 24, text: 'Pass paid military service', emoji: '⭐', voterEffect: 4, cost: 8 },
      { id: 25, text: 'Start rally marathon', emoji: '🎤', voterEffect: 5, cost: 10 },
      { id: 26, text: 'Promise cheap housing', emoji: '🏠', voterEffect: 4, cost: 8 },
      { id: 27, text: 'Announce business loans', emoji: '🏪', voterEffect: 3, cost: 5 },
      { id: 28, text: 'Show cross-border ops', emoji: '🎯', voterEffect: 5, cost: 10 },
    ],
    aiCards: [
      { id: 121, text: 'Started justice march', emoji: '⚖️', voterEffect: 6, cost: 0 },
      { id: 122, text: 'Showed economic reality', emoji: '📉', voterEffect: 5, cost: 0 },
      { id: 123, text: 'United opposition formed', emoji: '🤝', voterEffect: 5, cost: 0 },
      { id: 124, text: 'Spread youth hope', emoji: '🌟', voterEffect: 4, cost: 0 },
      { id: 125, text: 'Made bold statement', emoji: '🎙️', voterEffect: 4, cost: 0 },
      { id: 126, text: 'Epic square speech', emoji: '🏟️', voterEffect: 5, cost: 0 },
    ],
    specialPowers: [
      { id: 'ittifak18', name: 'Alliance Deal', emoji: '🤝', description: 'Secret deal with small parties', voterEffect: 8, launderedCost: 20 },
      { id: 'havalimani', name: 'Airport Opening', emoji: '✈️', description: 'Grand mega project showcase', voterEffect: 6, launderedCost: 15 },
      { id: 'dolar18', name: 'Dollar Intervention', emoji: '💵', description: 'Pressure the central bank', voterEffect: 7, launderedCost: 18 },
    ],
  },
  {
    year: 2019, triggerTurn: 67, title: 'ELECTION 2019', subtitle: 'Local Election - The Big City!',
    aiDifficultyBonus: 2, catchUpThreshold: 8, catchUpBonus: 5,
    playerCards: [
      { id: 31, text: 'Promise election security', emoji: '🔒', voterEffect: 4, cost: 10 },
      { id: 32, text: 'Show infrastructure project', emoji: '🚇', voterEffect: 4, cost: 8 },
      { id: 33, text: 'Mobilize hometown networks', emoji: '👥', voterEffect: 5, cost: 12 },
      { id: 34, text: 'Launch smear campaign', emoji: '🗞️', voterEffect: 5, cost: 15 },
      { id: 35, text: 'Promise free transport', emoji: '🚌', voterEffect: 3, cost: 5 },
      { id: 36, text: 'Visit shopkeepers', emoji: '🏪', voterEffect: 3, cost: 5 },
      { id: 37, text: 'Open sports complex', emoji: '🏟️', voterEffect: 4, cost: 8 },
      { id: 38, text: 'Attend weddings', emoji: '💒', voterEffect: 3, cost: 4 },
    ],
    aiCards: [
      { id: 131, text: '"Everything will be great" speech', emoji: '🌈', voterEffect: 7, cost: 0 },
      { id: 132, text: 'Held people\'s gathering', emoji: '🫂', voterEffect: 5, cost: 0 },
      { id: 133, text: 'Social media went viral', emoji: '📱', voterEffect: 6, cost: 0 },
      { id: 134, text: 'Became youth\'s hope', emoji: '✨', voterEffect: 5, cost: 0 },
      { id: 135, text: 'Promised transparency', emoji: '🔍', voterEffect: 5, cost: 0 },
      { id: 136, text: 'Rode the people\'s bus', emoji: '🚌', voterEffect: 6, cost: 0 },
    ],
    specialPowers: [
      { id: 'tekrar', name: 'Redo Election', emoji: '🔄', description: 'Pressure election board to cancel results', voterEffect: 10, launderedCost: 25 },
      { id: 'sandik', name: 'Ballot Box Ops', emoji: '📦', description: 'Pressure election observers', voterEffect: 8, launderedCost: 20 },
      { id: 'muhursuz', name: 'Unsealed Ballots', emoji: '📝', description: 'Tamper with ballot papers', voterEffect: 6, launderedCost: 15 },
    ],
  },
  {
    year: 2024, triggerTurn: 87, title: 'ELECTION 2024', subtitle: 'Final Battle - All or nothing!',
    aiDifficultyBonus: 3, catchUpThreshold: 5, catchUpBonus: 6,
    playerCards: [
      { id: 41, text: 'Promise earthquake relief', emoji: '🏗️', voterEffect: 4, cost: 12 },
      { id: 42, text: 'Hide inflation numbers', emoji: '📊', voterEffect: 3, cost: 8 },
      { id: 43, text: 'Give retirees a bonus', emoji: '💰', voterEffect: 5, cost: 15 },
      { id: 44, text: 'Start rally marathon', emoji: '🎤', voterEffect: 4, cost: 10 },
      { id: 45, text: 'Announce minimum wage hike', emoji: '💵', voterEffect: 4, cost: 10 },
      { id: 46, text: 'Play foreign policy card', emoji: '🌍', voterEffect: 5, cost: 12 },
      { id: 47, text: 'Hand out citizenships', emoji: '🎁', voterEffect: 3, cost: 6 },
      { id: 48, text: 'Promise cheap gas', emoji: '🔥', voterEffect: 4, cost: 8 },
    ],
    aiCards: [
      { id: 141, text: 'Showed economic reality', emoji: '📉', voterEffect: 7, cost: 0 },
      { id: 142, text: 'Demanded earthquake accountability', emoji: '🏚️', voterEffect: 7, cost: 0 },
      { id: 143, text: 'Youth uprising began', emoji: '🔥', voterEffect: 6, cost: 0 },
      { id: 144, text: 'United opposition rallied', emoji: '💪', voterEffect: 8, cost: 0 },
      { id: 145, text: 'Gained international support', emoji: '🌐', voterEffect: 5, cost: 0 },
      { id: 146, text: 'Social media revolution', emoji: '📱', voterEffect: 6, cost: 0 },
    ],
    specialPowers: [
      { id: 'tuik', name: 'Stats Manipulation', emoji: '📊', description: 'Cook the official numbers', voterEffect: 7, launderedCost: 20 },
      { id: 'sosyalban', name: 'Social Media Ban', emoji: '🚫', description: 'Block Twitter/TikTok', voterEffect: 8, launderedCost: 25 },
      { id: 'muhbol', name: 'Split Opposition', emoji: '🔪', description: 'Create candidate chaos', voterEffect: 10, launderedCost: 30 },
      { id: 'depremkart', name: 'Earthquake Card', emoji: '🏗️', description: 'Make disaster promises', voterEffect: 5, launderedCost: 15 },
    ],
  },
];

// Maps turn number → election index
export const ELECTION_TRIGGER_MAP: Record<number, number> = {
  23: 0,  // 2008
  55: 1,  // 2016
  63: 2,  // 2018
  67: 3,  // 2019
  87: 4,  // 2024
};

export function getElectionConfig(lang: Language, index: number): ElectionConfig {
  const configs = lang === 'en' ? electionsEn : electionsTr;
  return configs[index];
}

export function getNextElectionInfo(turn: number, completedElections: number[]): { year: number; turnsLeft: number } | null {
  const elections = [
    { index: 0, triggerTurn: 23, year: 2008 },
    { index: 1, triggerTurn: 55, year: 2016 },
    { index: 2, triggerTurn: 63, year: 2018 },
    { index: 3, triggerTurn: 67, year: 2019 },
    { index: 4, triggerTurn: 87, year: 2024 },
  ];
  for (const e of elections) {
    if (e.triggerTurn > turn && !completedElections.includes(e.index)) {
      return { year: e.year, turnsLeft: e.triggerTurn - turn };
    }
  }
  return null;
}
