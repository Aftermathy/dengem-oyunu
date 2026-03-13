import { PowerType } from '@/types/game';
import { Language } from '@/contexts/LanguageContext';

const bribeTextsAll: Record<PowerType, { tr: string; en: string }[]> = {
  halk: [
    { tr: '🎁 Halka yardım paketi', en: '🎁 Aid package sent' },
    { tr: '🍞 Bedava ekmek dağıtıldı', en: '🍞 Free bread distributed' },
    { tr: '🏥 Ücretsiz sağlık taraması', en: '🏥 Free health screening' },
    { tr: '🎪 Meydan mitingi düzenlendi', en: '🎪 Public rally organized' },
    { tr: '📺 Halka hitap edildi', en: '📺 Addressed the nation' },
    { tr: '🏠 Konut müjdesi verildi', en: '🏠 Housing announced' },
    { tr: '⛽ Akaryakıt indirimi', en: '⛽ Fuel price cut' },
    { tr: '🎓 Burs programı başlatıldı', en: '🎓 Scholarships launched' },
    { tr: '🧓 Emekli maaşına zam', en: '🧓 Pensions raised' },
    { tr: '🚰 Bedava su dağıtıldı', en: '🚰 Free water handed out' },
  ],
  yatirimcilar: [
    { tr: '💎 Vergi indirimi verildi', en: '💎 Tax breaks offered' },
    { tr: '🏗️ Özel sektöre ihale açıldı', en: '🏗️ Tenders opened' },
    { tr: '📊 Borsa düzenlemesi gevşetildi', en: '📊 Market regulations loosened' },
    { tr: '🏦 Özel bankaya lisans', en: '🏦 Banking license granted' },
    { tr: '✈️ Serbest ticaret bölgesi', en: '✈️ Free trade zone' },
    { tr: '💰 Yatırımcıya vatandaşlık', en: '💰 Citizenship sold' },
    { tr: '🏭 Fabrika arazisi tahsis', en: '🏭 Factory land allocated' },
    { tr: '📈 Devlet garantili kredi', en: '📈 State loans offered' },
    { tr: '🤑 Patronlarla gizli yemek', en: '🤑 Secret tycoon dinner' },
    { tr: '🛢️ Maden ruhsatı verildi', en: '🛢️ Mining permits slipped' },
  ],
  mafya: [
    { tr: '💵 Zarf uzatıldı', en: '💵 Envelope slid under' },
    { tr: '🔫 Silah ruhsatı kolaylaştı', en: '🔫 Gun permits expedited' },
    { tr: '🚬 Kaçakçılığa göz yumuldu', en: '🚬 Smuggling overlooked' },
    { tr: '🎰 Kumarhane lisansı', en: '🎰 Casino licensed' },
    { tr: '🤫 Dosya kayboldu', en: '🤫 File lost' },
    { tr: '🚗 Çalıntı araç şebekesi korundu', en: '🚗 Car ring protected' },
    { tr: '💀 Rakip çete susturuldu', en: '💀 Rival gang silenced' },
    { tr: '🍸 Gece kulübü buluşması', en: '🍸 Nightclub meeting' },
    { tr: '🏴 Haraç bölgeleri paylaşıldı', en: '🏴 Racket zones split' },
    { tr: '🗝️ Cezaevi müdürüne torpil', en: '🗝️ Prison warden bribed' },
  ],
  tarikat: [
    { tr: '🕌 Vakfa bağış yapıldı', en: '🕌 Foundation donation' },
    { tr: '📿 Tarikat lideri davet edildi', en: '📿 Cult leader invited' },
    { tr: '🏫 Özel okul izni hızlandı', en: '🏫 School permits fast-tracked' },
    { tr: '📖 Dini yayınevine destek', en: '📖 Religious press funded' },
    { tr: '🎤 Cuma hutbesinde ad geçti', en: '🎤 Named in Friday sermon' },
    { tr: '🌙 İftar sponsorluğu', en: '🌙 Iftar sponsored' },
    { tr: '🕯️ Türbe restorasyonu', en: '🕯️ Shrine restored' },
    { tr: '👳 Cemaat okullarına kadro', en: '👳 Sect school positions' },
    { tr: '🏛️ Vakıf arazisi imara açıldı', en: '🏛️ Foundation land zoned' },
    { tr: '🤲 Şeyhe helikopter', en: '🤲 Helicopter for sheikh' },
  ],
  ordu: [
    { tr: '🎖️ Silah sözleşmesi imzalandı', en: '🎖️ Arms contract signed' },
    { tr: '🪖 Generallere erken terfi', en: '🪖 Early promotions' },
    { tr: '🛡️ Savunma bütçesi artırıldı', en: '🛡️ Defense budget raised' },
    { tr: '🚁 Helikopter filosu alındı', en: '🚁 Helicopter fleet bought' },
    { tr: '🏅 Askeri tatbikat düzenlendi', en: '🏅 Military exercises' },
    { tr: '🗺️ Sınır karakolları güçlendirildi', en: '🗺️ Borders reinforced' },
    { tr: '⭐ Paşalara lojman', en: '⭐ General residences' },
    { tr: '🔧 Savunma ihalesi ayarlandı', en: '🔧 Defense tender rigged' },
    { tr: '🎯 Özel harp kursu finanse', en: '🎯 Warfare training funded' },
    { tr: '🛩️ İHA projesine ek bütçe', en: '🛩️ Drone project funded' },
  ],
};

export function getRandomBribeText(faction: PowerType, lang: Language): string {
  const texts = bribeTextsAll[faction];
  return texts[Math.floor(Math.random() * texts.length)][lang];
}
