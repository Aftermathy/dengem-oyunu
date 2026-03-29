import { useState, useEffect } from 'react';
import { EmojiImg } from '@/components/EmojiImg';
import { AVATAR_DEFS } from '@/lib/userProfile';
import { AvatarImg } from '@/components/AvatarImg';
import { playClickSound } from '@/hooks/useSound';
import { hapticMedium } from '@/hooks/useHaptics';
import { useLanguage } from '@/contexts/LanguageContext';

const QUOTES_TR: Record<string, string> = {
  avatar_4:  'Muhalefeti mutfaktan yönetmek artık uzmanlık alanın!',
  avatar_5:  'Her şeyin bir bedeli var. Senin için biraz daha az...',
  avatar_6:  'Akraba tayini bir sanattır ve sen ustasısın!',
  avatar_7:  'Üç bacak, tek adam, sonsuz güç!',
  avatar_8:  'Hayatını roman yaz, kendi romanını yaşa!',
  avatar_9:  'Saç gitmeli ama güç kalmalı!',
  avatar_10: 'Milyonlarca yıl önce de iktidar böyleydi!',
  avatar_11: 'Çay servis edilmez, fırlatılır!',
  avatar_12: 'İki başlı devlet, iki kat kafa karışıklığı!',
  avatar_13: 'Miyav diyerek iktidar olunur, bunu ispat ettin!',
  avatar_14: 'Dünya az geldi, galaksiyi yönetmeye hazırsın!',
  avatar_15: 'Hesaplarım hata yapmaz. Sen de yapma!',
};

const QUOTES_EN: Record<string, string> = {
  avatar_4:  'Opposition management is now your culinary specialty!',
  avatar_5:  'Everything has a price — yours is just a bit lower.',
  avatar_6:  'Nepotism is an art form and you\'ve mastered it!',
  avatar_7:  'Three legs, one man, infinite power!',
  avatar_8:  'Write your life as a novel and live the plot!',
  avatar_9:  'Hair goes, power stays!',
  avatar_10: 'Power worked the same way millions of years ago too!',
  avatar_11: 'Tea isn\'t served — it\'s launched!',
  avatar_12: 'Two-headed state, double the confusion!',
  avatar_13: 'We proved you can seize power just by saying meow!',
  avatar_14: 'The world wasn\'t enough — you\'re ready to rule the galaxy!',
  avatar_15: 'My calculations don\'t make mistakes. Neither should you.',
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

      {/* Main card */}
      <div
        className="relative w-full max-w-xs mx-6 rounded-3xl flex flex-col items-center px-6 pt-6 pb-5 transition-all duration-500"
        style={{
          background: 'rgba(8, 8, 14, 0.92)',
          border: `2px solid ${avatar.color}`,
          boxShadow: `0 0 32px ${avatar.color.replace(')', ' / 0.45)')}, 0 8px 48px rgba(0,0,0,0.7)`,
          backdropFilter: 'blur(12px)',
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(20px)',
        }}
      >
        {/* Title */}
        <div className="text-center mb-5">
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
        <div className="relative flex items-center justify-center mb-5" style={{ width: 180, height: 180 }}>
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
            style={{ width: 120, height: 120, background: avatar.color, opacity: 0.2, filter: 'blur(30px)' }}
          />
          {/* Avatar circle */}
          {revealed && (
            <div
              className="anim-avatar-pop relative flex items-center justify-center rounded-full border-4 border-yellow-400/70 overflow-hidden"
              style={{
                width: 128,
                height: 128,
                background: avatar.color,
                boxShadow: `0 0 40px ${avatar.color}, 0 0 80px rgba(251,191,36,0.3)`,
              }}
            >
              <AvatarImg avatar={avatar} size={128} />
            </div>
          )}
        </div>

        {/* Name + quote */}
        <div className="text-center mb-5">
          <p className="text-lg font-black text-white mb-1.5">
            {lang === 'tr' ? avatar.nameTR : avatar.nameEN}
          </p>
          <p className="text-sm text-yellow-200/80 italic">"{quote}"</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 w-full">
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
    </div>
  );
}
