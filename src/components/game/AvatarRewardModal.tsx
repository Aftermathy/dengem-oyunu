import { useState, useEffect } from 'react';
import { EmojiImg } from '@/components/EmojiImg';
import { AVATAR_DEFS } from '@/lib/userProfile';
import { playClickSound } from '@/hooks/useSound';
import { hapticMedium } from '@/hooks/useHaptics';
import { useLanguage } from '@/contexts/LanguageContext';

const QUOTES_TR: Record<string, string> = {
  avatar_4:  'Artık geceleri de toplantı yapabilirsin!',
  avatar_5:  'Muhalefetin seni ciddiye alması biraz zaman alabilir...',
  avatar_6:  'Halk senden korkuyor mu bilmiyoruz, ama kötü bir şey değil!',
  avatar_7:  'Küresel oligarşinin en yeni üyesin, hoş geldin!',
  avatar_8:  'Duygusuz kararlar için mükemmel bir yüz!',
  avatar_9:  'Artık çok daha sinirli bakabilirsin!',
  avatar_10: 'Kimin muhalif olduğunu söyle, onu kaybettireyim!',
  avatar_11: 'Çürüme görüntüsü biraz gerçekçi ama umursamıyoruz!',
  avatar_12: 'Minimum bütçeyle maksimum korku. Lojistik deha!',
  avatar_13: 'Artık kızgın görünmene gerek yok, sen zaten öylesin!',
  avatar_14: 'Altın rezervlerin artık gerçekten güvende!',
  avatar_15: 'Beş zümreden beş kez devrildin. Bu bir rekor!',
  avatar_16: 'Miyav diyen kediyle tanıştın, kurbağa olarak döndün!',
  avatar_17: 'Kim olduğunu kimse bilmez. Sen bile...',
  avatar_18: 'Final patronunu yendin. Artık gerçek bir diktatörsün!',
};

const QUOTES_EN: Record<string, string> = {
  avatar_4:  'Now you can hold meetings at night too!',
  avatar_5:  'The opposition might still not take you seriously though...',
  avatar_6:  "We're not sure people fear you, but that's not a bad thing!",
  avatar_7:  'Welcome to the global oligarchy!',
  avatar_8:  'The perfect face for emotionless decisions!',
  avatar_9:  'Now you can look even more menacing!',
  avatar_10: 'Tell me who the opposition is and I\'ll make them vanish!',
  avatar_11: 'The rotting look is a bit too real but we don\'t mind!',
  avatar_12: 'Maximum fear on a minimum budget. Logistical genius!',
  avatar_13: 'You don\'t need to look angry anymore — you just are!',
  avatar_14: 'Your gold reserves are finally safe!',
  avatar_15: 'You fell to all five factions. That\'s a record!',
  avatar_16: 'You met the meowing cat and came back as a frog!',
  avatar_17: 'Nobody knows who you are. Not even you...',
  avatar_18: 'You beat the final boss. You\'re a real dictator now!',
};

// Simple CSS confetti particles
const CONFETTI_COLORS = ['#fbbf24', '#f87171', '#34d399', '#60a5fa', '#a78bfa', '#fb923c'];
const CONFETTI_ITEMS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  left: `${(i / 24) * 100 + Math.sin(i) * 3}%`,
  delay: `${(i * 0.12) % 2}s`,
  duration: `${1.8 + (i % 5) * 0.3}s`,
  size: 6 + (i % 4) * 3,
  rotate: i % 2 === 0 ? 45 : 0,
}));

interface AvatarRewardModalProps {
  avatarId: string;
  onEquip: () => void;
  onClose: () => void;
}

export function AvatarRewardModal({ avatarId, onEquip, onClose }: AvatarRewardModalProps) {
  const { lang } = useLanguage();
  const [revealed, setRevealed] = useState(false);
  const avatar = AVATAR_DEFS.find(a => a.id === avatarId);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 60);
    return () => clearTimeout(t);
  }, []);

  if (!avatar) return null;

  const quote = lang === 'tr'
    ? (QUOTES_TR[avatarId] ?? 'Yeni bir lider sahneye çıktı!')
    : (QUOTES_EN[avatarId] ?? 'A new leader has arrived!');

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/88 animate-fade-in overflow-hidden">
      <style>{`
        @keyframes avatar-pop {
          0%   { transform: scale(0) rotate(-15deg); opacity: 0; }
          60%  { transform: scale(1.22) rotate(6deg); opacity: 1; }
          80%  { transform: scale(0.93) rotate(-3deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes rays-rot {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes confetti-drop {
          0%   { transform: translateY(-40px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(540deg); opacity: 0; }
        }
        .anim-avatar-pop  { animation: avatar-pop 0.65s cubic-bezier(0.34,1.56,0.64,1) both; }
        .anim-rays-rot    { animation: rays-rot 7s linear infinite; }
        .anim-confetti    { animation: confetti-drop var(--dur) var(--delay) ease-in forwards; }
      `}</style>

      {/* Confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {CONFETTI_ITEMS.map(p => (
          <div
            key={p.id}
            className="anim-confetti absolute top-0"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: p.rotate === 45 ? '2px' : '50%',
              transform: `rotate(${p.rotate}deg)`,
              '--dur': p.duration,
              '--delay': p.delay,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Title */}
      <div
        className="mb-6 text-center px-4 transition-all duration-500"
        style={{ opacity: revealed ? 1 : 0, transform: revealed ? 'translateY(0)' : 'translateY(-16px)' }}
      >
        <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400/80 mb-1">
          {lang === 'tr' ? '✨ Kilit Açıldı! ✨' : '✨ Unlocked! ✨'}
        </p>
        <h2
          className="text-2xl font-black text-yellow-400 leading-tight"
          style={{ textShadow: '0 0 30px rgba(251,191,36,0.7), 0 0 60px rgba(251,191,36,0.3)' }}
        >
          {lang === 'tr' ? 'YENİ LİDER\nKİLİDİ AÇILDI!' : 'NEW LEADER\nUNLOCKED!'}
        </h2>
      </div>

      {/* Avatar + glow */}
      <div className="relative flex items-center justify-center mb-6" style={{ width: 220, height: 220 }}>
        {/* Rotating rays */}
        <div
          className="anim-rays-rot absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(${avatar.color} 0deg,transparent 20deg,${avatar.color} 40deg,transparent 60deg,${avatar.color} 80deg,transparent 100deg,${avatar.color} 120deg,transparent 140deg,${avatar.color} 160deg,transparent 180deg,${avatar.color} 200deg,transparent 220deg,${avatar.color} 240deg,transparent 260deg,${avatar.color} 280deg,transparent 300deg,${avatar.color} 320deg,transparent 340deg)`,
            opacity: 0.45,
            filter: 'blur(10px)',
          }}
        />
        {/* Soft glow */}
        <div
          className="absolute rounded-full"
          style={{ width: 150, height: 150, background: avatar.color, opacity: 0.2, filter: 'blur(35px)' }}
        />
        {/* Avatar circle */}
        {revealed && (
          <div
            className="anim-avatar-pop relative flex items-center justify-center rounded-full border-4 border-yellow-400/70"
            style={{
              width: 148,
              height: 148,
              background: avatar.color,
              boxShadow: `0 0 50px ${avatar.color}, 0 0 100px rgba(251,191,36,0.35)`,
            }}
          >
            <EmojiImg emoji={avatar.emoji} size={76} />
          </div>
        )}
      </div>

      {/* Name + quote */}
      <div
        className="text-center px-6 mb-8 transition-all duration-500"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(16px)',
          transitionDelay: '300ms',
        }}
      >
        <p className="text-lg font-black text-white mb-2">
          {lang === 'tr' ? avatar.nameTR : avatar.nameEN}
        </p>
        <p className="text-sm text-yellow-200/75 italic max-w-xs">"{quote}"</p>
      </div>

      {/* Buttons */}
      <div
        className="flex gap-3 px-8 w-full max-w-xs transition-all duration-500"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(16px)',
          transitionDelay: '500ms',
        }}
      >
        <button
          onClick={() => { playClickSound(); onClose(); }}
          className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white/70 border border-white/20 active:scale-95 transition-transform"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          {lang === 'tr' ? 'Kapat' : 'Close'}
        </button>
        <button
          onClick={() => { playClickSound(); hapticMedium(); onEquip(); }}
          className="flex-1 py-3.5 rounded-2xl font-black text-sm text-black active:scale-95 transition-transform"
          style={{
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            boxShadow: '0 4px 24px rgba(251,191,36,0.55)',
          }}
        >
          {lang === 'tr' ? '⚡ Kuşan' : '⚡ Equip'}
        </button>
      </div>
    </div>
  );
}
