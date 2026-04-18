import { EventCard } from '@/types/game';
import { normalizeCard } from '@/lib/gameLogic';

export type ChainDelay = number | { min: number; max: number };

export interface ChainTriggerEntry {
  delay: ChainDelay;
  left?: EventCard;
  right?: EventCard;
}

// TR chain trigger map: key = parent card ID that triggers the chain
export const CHAIN_TRIGGERS_TR: Record<number, ChainTriggerEntry> = {
  // ── ID 19: AİHM ve Elçi ──────────────────────────────────────────────────
  // Left (elçiyi kabul et) → 1 tur sonra AİHM kararları masaya gelir
  // Right'ta chain yok
  19: {
    delay: 1,
    left: normalizeCard({
      id: 1901,
      character: 'Diplomat',
      characterEmoji: '🎩',
      imageId: 'diplomat',
      category: 'Dış Politika',
      description: 'Elçi masaya Batı İnsan Hakları Mahkemesi kararlarını koydu. Siyasi tutukluları bırakmazsak ağır yaptırım gelecekmiş!',
      leftChoice: '"AİHM bizi bağlamaz, Eyy Batı!" çek.',
      rightChoice: '"İnsan Hakları Eylem Planı" açıkla.',
      leftEffects: [
        { power: 'halk', amount: 5 },
        { power: 'yatirimcilar', amount: -15 },
        { power: 'ordu', amount: 0 },
        { power: 'mafya', amount: 5 },
        { power: 'tarikat', amount: 5 },
      ],
      rightEffects: [
        { power: 'yatirimcilar', amount: 15 },
        { power: 'halk', amount: 5 },
        { power: 'tarikat', amount: -5 },
        { power: 'mafya', amount: -5 },
        { power: 'ordu', amount: 0 },
      ],
      leftMoney: -10,
      rightMoney: -5,
    }),
  },

  // ── ID 26: Tarikat Pazarlığı ──────────────────────────────────────────────
  // Left (büyüye izin ver) → 1 tur sonra bakanlık talebi gelir
  // Right'ta chain yok
  26: {
    delay: 1,
    left: normalizeCard({
      id: 2601,
      character: 'Mürşid',
      characterEmoji: '🔮',
      imageId: 'spiritual_guide',
      category: 'Tarikat',
      description: 'Kerametinin bedeli olarak Sağlık ve Eğitim bakanlıklarının anahtarını tamamen kendi müridlerine istiyor.',
      leftChoice: 'Bakanlıkları ver, oylarını garantile.',
      rightChoice: 'Bakanlık olmaz, ballı ihale verip savuştur.',
      leftEffects: [
        { power: 'tarikat', amount: 20 },
        { power: 'ordu', amount: -15 },
        { power: 'halk', amount: -15 },
        { power: 'yatirimcilar', amount: -5 },
        { power: 'mafya', amount: 0 },
      ],
      rightEffects: [
        { power: 'tarikat', amount: 5 },
        { power: 'halk', amount: -5 },
        { power: 'yatirimcilar', amount: 0 },
        { power: 'mafya', amount: 5 },
        { power: 'ordu', amount: 0 },
      ],
      leftMoney: -5,
      rightMoney: -15,
    }),
  },

  // ── ID 32: S-400 Füze ────────────────────────────────────────────────────
  // Left (al) → 4-6 tur sonra güncelleme parası talebi gelir
  // Right'ta chain yok
  32: {
    delay: { min: 4, max: 6 },
    left: normalizeCard({
      id: 3201,
      character: 'Milli Savunma Bakanı',
      characterEmoji: '🪖',
      imageId: 'nato_representative',
      category: 'Ordu',
      description: 'Kuzey ülkesi S-400\'lerin fişini takıp aktif etmek için fahiş bir "güncelleme" parası istiyor!',
      leftChoice: 'Parayı basıp sistemi aç!',
      rightChoice: 'Para yok, depoda kalsın. "Test ediyoruz" de.',
      leftEffects: [
        { power: 'ordu', amount: 15 },
        { power: 'yatirimcilar', amount: -20 },
        { power: 'halk', amount: 0 },
        { power: 'mafya', amount: 0 },
        { power: 'tarikat', amount: -5 },
      ],
      rightEffects: [
        { power: 'ordu', amount: -15 },
        { power: 'halk', amount: -5 },
        { power: 'yatirimcilar', amount: 0 },
        { power: 'mafya', amount: 0 },
        { power: 'tarikat', amount: 0 },
      ],
      leftMoney: -10,
      rightMoney: 0,
    }),
  },

  // ── ID 11: Deepfake Kaset ────────────────────────────────────────────────
  // Left (kaseti yayınla) → 2-3 tur sonra kaset işe yaradı ama tepki oyları kayıyor
  // Right'ta chain yok
  11: {
    delay: { min: 2, max: 3 },
    left: normalizeCard({
      id: 1101,
      character: 'İstihbarat Şefi',
      characterEmoji: '🕵️',
      imageId: 'intelligence_chief',
      category: 'Siyasi Entrika',
      description: 'Kaset işe yaradı! Rakip "Bana kumpas kurdular" deyip havlu attı. Ama tepki oyları şimdi ana muhalefete kayıyor.',
      leftChoice: 'Milliyetçi adayı da siz kapın, cehennemin kapıları bizde olsun',
      rightChoice: 'Boşver bizim kendimize güvenimiz tam',
      leftEffects: [
        { power: 'halk', amount: 5 },
        { power: 'tarikat', amount: 5 },
        { power: 'mafya', amount: 5 },
        { power: 'yatirimcilar', amount: 5 },
        { power: 'ordu', amount: 0 },
      ],
      rightEffects: [
        { power: 'halk', amount: -5 },
        { power: 'tarikat', amount: 10 },
        { power: 'ordu', amount: 0 },
        { power: 'yatirimcilar', amount: 0 },
        { power: 'mafya', amount: 0 },
      ],
      leftMoney: -5,
      rightMoney: 0,
    }),
  },

  // ── ID 15: Seçim Tekrarlama ───────────────────────────────────────────────
  // Left (seçimi yenile) → 2-3 tur sonra bu sefer daha çok fark yedik
  // Right'ta chain yok
  15: {
    delay: { min: 2, max: 3 },
    left: normalizeCard({
      id: 1501,
      character: 'Belediye Başkanı',
      characterEmoji: '🏙️',
      imageId: 'mayor',
      category: 'Siyasi Entrika',
      description: 'Yenilettiğiniz seçimde bu kez 800 bin fark yedik!',
      leftChoice: 'Biraz bekle kayyum atarız.',
      rightChoice: 'Halkın iradesi de, mecburen tebrik et.',
      leftEffects: [
        { power: 'halk', amount: -15 },
        { power: 'yatirimcilar', amount: -5 },
        { power: 'tarikat', amount: 5 },
        { power: 'mafya', amount: 0 },
        { power: 'ordu', amount: 0 },
      ],
      rightEffects: [
        { power: 'halk', amount: 0 },
        { power: 'yatirimcilar', amount: 10 },
        { power: 'tarikat', amount: -5 },
        { power: 'mafya', amount: -5 },
        { power: 'ordu', amount: 5 },
      ],
      leftMoney: -10,
      rightMoney: -10,
    }),
  },

  // ── ID 9: Özelleştirme ───────────────────────────────────────────────────
  // Left (sat)  → 2-4 tur sonra fabrikalar AVM oldu haberi gelir
  // Right (satma) → 2-4 tur sonra fabrikalar rekor kâr yaptı haberi gelir
  9: {
    delay: { min: 2, max: 4 },
    left: normalizeCard({
      id: 901,
      character: 'Özelleştirme Müdürü',
      characterEmoji: '🏭',
      imageId: 'privatization_director',
      category: 'Ekonomi',
      description: 'Yandaşlara sattığımız fabrikaların makinalarını hurdacıya satıp arsalarına lüks AVM diktiler. Şimdi şekeri ve kağıdı dışarıdan 10 katına ithal ediyoruz!',
      leftChoice: 'AVM\'nin şatafatlı açılış kurdelesini ben keserim.',
      rightChoice: 'Sattığımızdan daha yükseğe geri alalım.',
      leftEffects: [
        { power: 'halk', amount: -15 },
        { power: 'yatirimcilar', amount: 5 },
        { power: 'mafya', amount: 10 },
        { power: 'tarikat', amount: 0 },
        { power: 'ordu', amount: 0 },
      ],
      rightEffects: [
        { power: 'halk', amount: -20 },
        { power: 'yatirimcilar', amount: -5 },
        { power: 'mafya', amount: 15 },
        { power: 'tarikat', amount: 5 },
        { power: 'ordu', amount: 0 },
      ],
      leftMoney: -10,
      rightMoney: -20,
    }),
    right: normalizeCard({
      id: 902,
      character: 'Özelleştirme Müdürü',
      characterEmoji: '🏭',
      imageId: 'privatization_director',
      category: 'Ekonomi',
      description: 'Satmadığınız o fabrikalar bu yıl tarihi kâr rekoru kırdı! Kasamız dolup taşıyor!',
      leftChoice: 'Karı Varlık Fonu\'na aktar, oradan yandaşlara dağıt.',
      rightChoice: 'Kâr payıyla halka ucuz ürün sat, seçim şovu yap.',
      leftEffects: [
        { power: 'halk', amount: -10 },
        { power: 'yatirimcilar', amount: 5 },
        { power: 'mafya', amount: 10 },
        { power: 'tarikat', amount: 5 },
        { power: 'ordu', amount: -5 },
      ],
      rightEffects: [
        { power: 'halk', amount: 20 },
        { power: 'yatirimcilar', amount: -10 },
        { power: 'mafya', amount: 0 },
        { power: 'tarikat', amount: -5 },
        { power: 'ordu', amount: 5 },
      ],
      leftMoney: -5,
      rightMoney: -10,
    }),
  },

  // ── ID 8: Kripto Vergisi ──────────────────────────────────────────────────
  // Left (vergi getir) → 4 tur sonra merdiven altı borsalar konusu gelir
  // Right (dokunma)    → 4 tur sonra CEO kaçış haberi gelir
  8: {
    delay: 4,
    left: normalizeCard({
      id: 801,
      character: 'Kripto Danışmanı',
      characterEmoji: '🪙',
      imageId: 'crypto_advisor',
      category: 'Ekonomi',
      description: 'Başkanım, kriptoya getirdiğiniz ağır vergi yüzünden millet merdiven altı borsalara kaçtı.',
      leftChoice: 'Milli-Coin\'i bas, memur maaşını onunla öde!',
      rightChoice: 'Denetimleri arttır, devam et.',
      leftEffects: [
        { power: 'halk', amount: 5 },
        { power: 'yatirimcilar', amount: 5 },
        { power: 'mafya', amount: 5 },
        { power: 'tarikat', amount: 0 },
        { power: 'ordu', amount: 0 },
      ],
      rightEffects: [
        { power: 'halk', amount: -10 },
        { power: 'yatirimcilar', amount: -5 },
        { power: 'mafya', amount: -5 },
        { power: 'tarikat', amount: 0 },
        { power: 'ordu', amount: 5 },
      ],
      leftMoney: 5,
      rightMoney: -5,
    }),
    right: normalizeCard({
      id: 802,
      character: 'Kripto Danışmanı',
      characterEmoji: '🪙',
      imageId: 'crypto_advisor',
      category: 'Güvenlik',
      description: 'Denetlemediğimiz o dev yerli kripto borsasının jöleli genç CEO\'su 2 milyar dolarla Arnavutluk\'a kaçtı! Kriptozedeler kapıya dayandı.',
      leftChoice: 'Vatandaşın zararını karşıla',
      rightChoice: 'Tüm kripto borsaları yasakla!',
      leftEffects: [
        { power: 'halk', amount: 20 },
        { power: 'yatirimcilar', amount: 10 },
        { power: 'mafya', amount: 5 },
        { power: 'tarikat', amount: -5 },
        { power: 'ordu', amount: -5 },
      ],
      rightEffects: [
        { power: 'halk', amount: -5 },
        { power: 'yatirimcilar', amount: -10 },
        { power: 'mafya', amount: -5 },
        { power: 'tarikat', amount: 5 },
        { power: 'ordu', amount: 5 },
      ],
      leftMoney: -4,
      rightMoney: 0,
    }),
  },
};
