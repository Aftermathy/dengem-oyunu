import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Language = 'tr' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  tr: {
    // Start screen
    'start.subtitle': 'Gücü dengede tut, tahtını koru.',
    'start.subtitle2': 'Bir karar seni zirveye taşır, bir karar uçuruma sürükler.',
    'start.highscore': 'En Yüksek Skor:',
    'start.turns': 'tur',
    'start.play': '⚔️ Oyuna Başla',
    // Game
    'game.turn': 'Tur',
    'game.accept': 'KABUL',
    'game.reject': 'RED',
    // Power labels
    'power.halk': 'Halk',
    'power.yatirimcilar': 'Yatırımcılar',
    'power.mafya': 'Mafya',
    'power.tarikat': 'Tarikat',
    'power.ordu': 'Ordu',
    // Game over
    'gameover.turn': 'Tur',
    'gameover.best': 'En İyi',
    'gameover.restart': '🔄 Tekrar Oyna',
    // Language
    'lang.tr': 'TR',
    'lang.en': 'EN',
    'tutorial.title': 'Tehlike!',
    'tutorial.desc.halk': 'Halk senden nefret ediyor! Bir zarfla gülleri düzeltmek ister misin?',
    'tutorial.desc.yatirimcilar': 'Yatırımcılar kaçıyor! Küçük bir hediye ile gönüllerini al?',
    'tutorial.desc.mafya': 'Mafya kapına dayandı! Bir zarfla arkanı kollamalarını sağla?',
    'tutorial.desc.tarikat': 'Tarikat sana lanet okuyor! Bir bağışla ruhunu kurtar?',
    'tutorial.desc.ordu': 'Ordu darbe planlıyor! Küçük bir bahşişle sadakatlerini satın al?',
    'tutorial.bribe': '💰 1M ver, +10 rep',
    'tutorial.skip': 'Geçiş',
    'tutorial.hint': 'İpucu: Faction başına tıklayarak da rüşvet verebilirsin!',
  },
  en: {
    'start.subtitle': 'Keep the power balanced, protect your throne.',
    'start.subtitle2': 'One decision lifts you up, another drags you down.',
    'start.highscore': 'High Score:',
    'start.turns': 'turns',
    'start.play': '⚔️ Start Game',
    'game.turn': 'Turn',
    'game.accept': 'ACCEPT',
    'game.reject': 'REJECT',
    'power.halk': 'Public',
    'power.yatirimcilar': 'Investors',
    'power.mafya': 'Mafia',
    'power.tarikat': 'Cult',
    'power.ordu': 'Army',
    'gameover.turn': 'Turn',
    'gameover.best': 'Best',
    'gameover.restart': '🔄 Play Again',
    'lang.tr': 'TR',
    'lang.en': 'EN',
    'tutorial.title': 'Danger!',
    'tutorial.desc.halk': 'The public hates you! Wanna smooth things over with a little envelope?',
    'tutorial.desc.yatirimcilar': 'Investors are fleeing! A small gift to win their hearts back?',
    'tutorial.desc.mafya': 'The Mafia is at your door! A little envelope to keep them friendly?',
    'tutorial.desc.tarikat': 'The Cult is cursing you! A donation to save your soul?',
    'tutorial.desc.ordu': 'The Army is planning a coup! A small tip to buy their loyalty?',
    'tutorial.bribe': '💰 Pay 1M, +10 rep',
    'tutorial.skip': 'Skip',
    'tutorial.hint': 'Tip: You can also bribe by tapping faction heads!',
  },
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('ims_lang') as Language) || 'tr';
  });

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    localStorage.setItem('ims_lang', l);
  }, []);

  const t = useCallback((key: string) => {
    return translations[lang][key] || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
