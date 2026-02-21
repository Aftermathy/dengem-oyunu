import { GameOverScenario } from '@/types/game';

export const gameOverScenarios: GameOverScenario[] = [
  {
    power: 'halk',
    direction: 'low',
    title: 'Halk Ayaklanması!',
    description: 'Halk sokaklara döküldü. Milyonlar meydanlarda "Yeter!" diye haykırıyor. Sarayın kapıları kırıldı, muhafızlar silah bıraktı. Devrimci liderler balkon konuşması yaparken sen arka kapıdan kaçmaya çalıştın ama halk seni yakaladı. Mahkeme kuruldu, tüm mal varlığına el konuldu. Artık tarihin tozlu sayfalarında "diktatör" olarak anılıyorsun.',
    emoji: '✊',
    image: 'defeat-halk',
  },
  {
    power: 'yatirimcilar',
    direction: 'low',
    title: 'Ekonomik Çöküş!',
    description: 'Dolar uçtu, borsa çöktü, fabrikalar kapandı. Halk ekmek kuyruğunda, marketlerin rafları bomboş. IMF kapıda bekliyor ama şartları kabul edilemez. Yatırımcılar sermayelerini yurt dışına kaçırdı. Merkez Bankası\'nın kasası boş. Enflasyon %1000\'i aştı. Ekonomik kriz seni koltuğundan etti, yerine teknokrat hükümet kuruldu.',
    emoji: '📉',
    image: 'defeat-yatirimcilar',
  },
  {
    power: 'mafya',
    direction: 'low',
    title: 'Suikast!',
    description: 'Yeraltı dünyasını karşına aldın. Zırhlı araçlar bile seni koruyamadı. Bir gece yarısı, konvoyun pusuya düşürüldü. Korumaların etkisiz hale getirildi. Karanlık sokaklarda gölgeler seni bekliyordu. Sabah haberleri "Bilinmeyen kişilerce..." diye başladı. Yeraltı dünyası kendi adamını başa geçirdi.',
    emoji: '🗡️',
    image: 'defeat-mafya',
  },
  {
    power: 'tarikat',
    direction: 'low',
    title: 'Cemaat Darbesi!',
    description: 'Tasfiye ettiğini sandığın yapı, devletin her kademesine sızmıştı. Bir gece yarısı telefonlar çaldı, ama arayan senin adamların değildi. Yargıçlar tutuklama kararı çıkardı, emniyet seni arıyor. Medya "Hain lider yakalandı" manşetiyle çıktı. Cüppeli figürler devleti devraldı, laiklik tarihe karıştı. Sen ise dar bir hücrede sabahladın.',
    emoji: '🕋',
    image: 'defeat-tarikat',
  },
  {
    power: 'ordu',
    direction: 'low',
    title: 'Askeri Darbe!',
    description: 'Tanklar sokağa indi, F-16\'lar alçaktan geçiyor. Genelkurmay bildiri yayınladı: "Yönetim el değiştirdi." Meclis kuşatıldı, bakanlar gözaltına alındı. Sen sarayda kıstırıldın, kaçış yolu yok. Generaller seni canlı yayında istifaya zorladı. Askeri cunta yönetimi ele aldı, sıkıyönetim ilan edildi. Tahtın artık bir generalin.',
    emoji: '🪖',
    image: 'defeat-ordu',
  },
];
