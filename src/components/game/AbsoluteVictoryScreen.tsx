import { playClickSound } from '@/hooks/useSound';
import { EmojiImg } from '@/components/EmojiImg';
import { GameIcon } from '@/components/GameIcon';
import { GameImages } from '@/config/assets';

interface Props {
  lang: string;
  earnedAP: number;
  ohalLevel: number;
  onRestart: () => void;
  onMainMenu: () => void;
}

// ─── Victory text variants ────────────────────────────────────────────────────
// ohalLevel 0 → standard  |  1 → iron fist  |  2 → total control  |  3 → apex

const VICTORY_TEXT = {
  tr: {
    0: {
      title: 'Zafer Senin',
      lines: [
        'Halk diz çöktü.',
        'Yatırımcılar etrafında toplandı.',
        'Mafya emrindedir.',
        'Tarikatlar sana tapıyor.',
        'Ordu tek lafına bakar.',
        '7 sülalene yetecek paran var.',
        'Artık zafer senin.',
      ],
    },
    1: {
      title: 'Mutlak Hâkimiyet',
      lines: [
        'OHAL çiğnedi, sen de onu.',
        'Halk suskunluğu seçti — bunu sen seçtirdin.',
        'Yatırımcılar seni değil, korumanı satın alıyor.',
        'Mafya artık devletin bir kolu.',
        'Tarikatlar "ilahi irade" dediğinde senin adını sayıyor.',
        'Ordu selamlıyor, sormadan.',
        'Kasa dolu. Tarih senin ağzından yazılıyor.',
      ],
    },
    2: {
      title: 'Geri Dönüş Yok',
      lines: [
        'İki kez olağanüstü hâl.',
        'Olağan olan artık sen sinsin.',
        'Muhalefet diye bir kavram kalmadı.',
        'Ekonomi senin nabzınla atıyor.',
        'Kariyer, itibar, özgürlük — hepsi senin lütfuna bağlı.',
        'Tarihin bu sayfasını kimse çeviremez.',
        'Sen hâlâ duruyorsun. Bu yeter.',
      ],
    },
    3: {
      title: 'Tanrı Değil, Daha Fazlası',
      lines: [
        'Üç OHAL.',
        'Devlet seni tüketti, sen devleti yuttun.',
        'Yasalar artık sadece seni bağlamıyor.',
        'İktisatçılar senin kararlarını okuyup model yazıyor.',
        'Güvenlik güçleri sadakat yemini yaparken adını söylüyor.',
        'Dinî figürler fetva istiyor — senden.',
        'Hiç kimse, hiçbir şey seni tahttan indiremez.',
        'Bu bir zafer değil. Bu varoluş.',
      ],
    },
  },
  en: {
    0: {
      title: 'Victory Is Yours',
      lines: [
        'The people are on their knees.',
        'Investors circle around you.',
        'The mob answers your call.',
        'The cults worship at your feet.',
        'The army moves on a single word.',
        'Seven generations of wealth secured.',
        'Victory is yours — absolute and final.',
      ],
    },
    1: {
      title: 'Total Dominion',
      lines: [
        'You played with the state of emergency — and won.',
        'The people chose silence. You made them choose it.',
        'Investors buy your protection, not your vision.',
        'The mob has become a branch of government.',
        'When cults say "divine will," they mean your name.',
        'The army salutes without asking why.',
        'The vault is full. History is written by you.',
      ],
    },
    2: {
      title: 'Point of No Return',
      lines: [
        'Two states of emergency. One permanent state: you.',
        'The word "opposition" has left the dictionary.',
        'The economy breathes on your terms.',
        'Every career, every reputation hangs on your favour.',
        'No one turns this page of history.',
        'You are still standing.',
        'That is enough.',
      ],
    },
    3: {
      title: 'Beyond Power',
      lines: [
        'Three states of emergency.',
        'The state tried to consume you. You consumed the state.',
        'Laws bind everyone — except you.',
        'Economists write models around your decisions.',
        'Security forces say your name in their oath of loyalty.',
        'Religious figures ask for a fatwa — from you.',
        'No one, nothing can bring you down.',
        'This is not a victory. This is existence itself.',
      ],
    },
  },
} as const;

export function AbsoluteVictoryScreen({ lang, earnedAP, ohalLevel, onRestart, onMainMenu }: Props) {
  const tr = lang === 'tr';
  const level = Math.min(ohalLevel, 3) as 0 | 1 | 2 | 3;
  const texts = tr ? VICTORY_TEXT.tr[level] : VICTORY_TEXT.en[level];

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-end w-full overflow-hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={GameImages.victory_absolute}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/97 via-black/75 to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-3 p-6 pb-4 text-center max-w-sm mx-auto w-full">
        {/* OHAL badge */}
        {ohalLevel > 0 && (
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black mb-1"
            style={{
              background: 'hsl(15 90% 50% / 0.2)',
              border: '1px solid hsl(15 90% 50% / 0.5)',
              color: 'hsl(15 90% 65%)',
            }}
          >
            <GameIcon name="flame" size={11} />
            {tr ? `OHAL SEVİYE ${ohalLevel}` : `OHAL LEVEL ${ohalLevel}`}
          </div>
        )}

        <h2
          className="text-3xl font-black drop-shadow-lg"
          style={{ color: 'hsl(45 93% 68%)', textShadow: '0 0 24px hsl(45 93% 58% / 0.6)' }}
        >
          {texts.title}
        </h2>

        <div className="flex flex-col gap-1 mt-1">
          {texts.lines.map((line, i) => (
            <p
              key={i}
              className="text-sm leading-relaxed"
              style={{
                color: i === texts.lines.length - 1
                  ? 'hsl(45 93% 75%)'
                  : 'rgba(255,255,255,0.80)',
                fontWeight: i === texts.lines.length - 1 ? 700 : 400,
                textShadow: '0 1px 4px rgba(0,0,0,0.8)',
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* AP earned */}
        {earnedAP > 0 && (
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl mt-1"
            style={{
              background: 'linear-gradient(135deg, hsl(45 80% 50% / 0.18), hsl(35 90% 40% / 0.12))',
              border: '1px solid hsl(45 80% 50% / 0.45)',
            }}
          >
            <EmojiImg emoji="⭐" size={18} />
            <span className="font-black text-base" style={{ color: 'hsl(45 93% 58%)' }}>
              +{earnedAP} AP
            </span>
            <span className="text-[10px] ml-1" style={{ color: 'hsl(45 60% 50% / 0.75)' }}>
              {tr ? 'Otorite Puanı' : 'Authority Points'}
            </span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-2 w-full">
          <button
            onClick={() => { playClickSound(); onRestart(); }}
            className="flex-1 py-3 font-black rounded-xl text-sm active:scale-95 transition-all border border-white/20 text-white bg-white/10 backdrop-blur-sm"
          >
            <EmojiImg emoji="🔄" size={16} className="mr-1" />
            {tr ? 'Tekrar Oyna' : 'Play Again'}
          </button>
          <button
            onClick={() => { playClickSound(); onMainMenu(); }}
            className="flex-1 py-3 font-black rounded-xl text-sm active:scale-95 transition-all border border-white/20 text-white/80 bg-black/30 backdrop-blur-sm"
          >
            <EmojiImg emoji="🏠" size={16} className="mr-1" />
            {tr ? 'Ana Menü' : 'Main Menu'}
          </button>
        </div>
      </div>
    </div>
  );
}
