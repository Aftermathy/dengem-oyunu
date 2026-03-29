import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { STORAGE_KEYS } from "@/constants/storage";

export type Language = "tr" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  tr: {
    // Start screen
    "start.subtitle": "Hedef 2028!",
    "start.subtitle2": "",
    "start.highscore": "En Yüksek Skor:",
    "start.turns": "tur",
    "start.play": "Yeni Oyun",
    // Game
    "game.turn": "Tur",
    "game.accept": "KABUL",
    "game.reject": "RED",
    // Power labels
    "power.halk": "Halk",
    "power.yatirimcilar": "Yatırımcılar",
    "power.mafya": "Mafya",
    "power.tarikat": "Tarikat",
    "power.ordu": "Ordu",
    // Game over
    "gameover.turn": "Tur",
    "gameover.best": "En İyi",
    "gameover.restart": "🔄 Tekrar Oyna",
    "gameover.menu": "🏠 Ana Menü",
    // Game-over scenarios
    "gameover.bankruptcy.title": "İflas!",
    "gameover.bankruptcy.desc": "Kasa bomboş. Para yok, güç yok. Temizlikçi bile istifa etti. Alacaklılar saraya dayandı, IMF yönetimi devraldı. Miras olarak bıraktığın tek şey mali çılgınlığın hikayesi. Yeni teknokrat hükümet altın klozet kapaklarını internetten satışa çıkardı.",
    "gameover.election_lost.title": "Seçim Kaybedildi!",
    "gameover.election_lost.desc": "Sandık konuştu. Yolsuzluk saltanatın burada sona erdi. Halk korku yerine umudu seçti. Bavullarını topla — yeni hükümet kilitleri değiştirmeye başladı bile.",
    "gameover.victory.title": "👑 Senden İyisi Yok! 👑",
    "gameover.victory.desc": "Her seçimi atlattın, her rakibi ezdin, 25 yılı aşkın iktidarı bırakmadın. Yolsuzluk, manipülasyon ve demir yumrukla tahtını korudun. En büyük politik hayatta kalma uzmanı sensin. Taht senindir... şimdilik — kazanan sensin.",
    // Language
    "lang.tr": "TR",
    "lang.en": "EN",
    "tutorial.title": "Tehlike!",
    "tutorial.desc.halk": "Halk senden nefret ediyor! Bir yardımla gönüllerini almak ister misin?",
    "tutorial.desc.yatirimcilar": "Yatırımcılar kaçıyor! Küçük bir hediye ile gönüllerini al?",
    "tutorial.desc.mafya": "Mafya kapına dayandı! Bir zarfla sakinleşmelerini sağla",
    "tutorial.desc.tarikat": "Tarikat sana lanet okuyor! Bir bağışla ruhunu kurtar?",
    "tutorial.desc.ordu": "Ordu darbe planlıyor! Küçük bir bahşişle sadakatlerini satın al?",
    "tutorial.bribe": "💰 1B ver, +10 rep",
    "tutorial.skip": "Ne halleri varsa görsünler",
    "tutorial.hint": "İpucu: Zümre resmine tıklayarak da rüşvet verebilirsin!",
  },
  en: {
    "start.subtitle": "Target is 2028!",
    "start.subtitle2": "",
    "start.highscore": "High Score:",
    "start.turns": "turns",
    "start.play": "New Game",
    "game.turn": "Turn",
    "game.accept": "ACCEPT",
    "game.reject": "REJECT",
    "power.halk": "Public",
    "power.yatirimcilar": "Investors",
    "power.mafya": "Mafia",
    "power.tarikat": "Cult",
    "power.ordu": "Army",
    "gameover.turn": "Turn",
    "gameover.best": "Best",
    "gameover.restart": "🔄 Play Again",
    "gameover.menu": "🏠 Main Menu",
    // Game-over scenarios
    "gameover.bankruptcy.title": "Bankruptcy!",
    "gameover.bankruptcy.desc": "The coffers are empty. No money, no power. Even the janitor quit. Creditors stormed the palace, IMF took control. Your legacy? A cautionary tale of fiscal madness. The new technocrat government is auctioning off your golden toilet seats on eBay.",
    "gameover.election_lost.title": "Election Lost!",
    "gameover.election_lost.desc": "The ballot box has spoken. Your reign of corruption ends here. The people chose hope over fear. Pack your bags — the new government is already changing the locks.",
    "gameover.victory.title": "👑 No One's Better Than You! 👑",
    "gameover.victory.desc": "You survived every election, crushed every opponent, and held on to power for 25+ years. Corruption, manipulation, and iron-fisted rule kept the throne yours. You're the ultimate political survivor. History will judge — but for now, you win.",
    "lang.tr": "TR",
    "lang.en": "EN",
    "tutorial.title": "Danger!",
    "tutorial.desc.halk": "The public hates you! Wanna smooth things over with a little envelope?",
    "tutorial.desc.yatirimcilar": "Investors are fleeing! A small gift to win their hearts back?",
    "tutorial.desc.mafya": "The Mafia is at your door! A little envelope to keep them friendly?",
    "tutorial.desc.tarikat": "The Cult is cursing you! A donation to save your soul?",
    "tutorial.desc.ordu": "The Army is planning a coup! A small tip to buy their loyalty?",
    "tutorial.bribe": "💰 Pay 1B, +10 rep",
    "tutorial.skip": "Let them deal with it",
    "tutorial.hint": "Tip: You can also bribe by tapping faction heads!",
  },
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language) || "tr";
  });

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, l);
  }, []);

  const t = useCallback(
    (key: string) => {
      return translations[lang][key] || key;
    },
    [lang],
  );

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
