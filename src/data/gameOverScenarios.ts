import { GameOverScenario } from '@/types/game';

export const gameOverScenarios: GameOverScenario[] = [
  { power: 'halk', direction: 'low', title: 'Halk Ayaklanması!', description: 'Halk sokaklara döküldü. Milyonlar meydanlarda "Yeter!" diye haykırıyor. Sarayın kapıları kırıldı...', emoji: '✊' },
  { power: 'halk', direction: 'high', title: 'Popülist Diktatör!', description: 'Halkın gözünde tanrılaştın ama kimse seni eleştiremiyor artık. Demokrasi sadece bir isimden ibaret...', emoji: '👑' },
  { power: 'yatirimcilar', direction: 'low', title: 'Ekonomik Çöküş!', description: 'Dolar uçtu, borsa çöktü, fabrikalar kapandı. Halk ekmek kuyruğunda. IMF kapıda bekliyor...', emoji: '📉' },
  { power: 'yatirimcilar', direction: 'high', title: 'Oligarşi Devleti!', description: 'İş dünyası devleti ele geçirdi. Yasalar onlar için yazılıyor, vergiler onlar için siliniyor...', emoji: '🏦' },
  { power: 'mafya', direction: 'low', title: 'Suikast!', description: 'Yeraltı dünyasını karşına aldın. Zırhlı araçlar bile seni koruyamadı. Bir gece yarısı...', emoji: '🗡️' },
  { power: 'mafya', direction: 'high', title: 'Mafya Devleti!', description: 'Devlet ile mafya artık aynı şey. Her ihale, her sözleşme, her atama yeraltının onayından geçiyor...', emoji: '🎰' },
  { power: 'tarikat', direction: 'low', title: 'Cemaat Darbesi!', description: 'Tasfiye ettiğini sandığın yapı, devletin her kademesine sızmıştı. Bir gece yarısı telefonlar çaldı...', emoji: '🕋' },
  { power: 'tarikat', direction: 'high', title: 'Tarikat Devleti!', description: 'Artık her bakanlıkta, her mahkemede, her okulda onların adamları var. Laiklik tarihe karıştı...', emoji: '📿' },
  { power: 'ordu', direction: 'low', title: 'Askeri Darbe!', description: 'Tanklar sokağa indi, F-16\'lar alçaktan geçiyor. Genelkurmay bildiri yayınladı: "Yönetim el değiştirdi."', emoji: '🪖' },
  { power: 'ordu', direction: 'high', title: 'Askeri Diktatörlük!', description: 'Generaller artık sivil otoriteyi tanımıyor. Her karar Genelkurmay\'dan çıkıyor...', emoji: '🎖️' },
];
