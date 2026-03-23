import { useEffect, useState } from 'react';
import { EmojiImg } from '@/components/EmojiImg';
import { useLanguage } from '@/contexts/LanguageContext';
import { playClickSound } from '@/hooks/useSound';
import { hapticMedium } from '@/hooks/useHaptics';

interface PremiumModalProps {
  onPurchase: () => void;
  onClose: () => void;
}

const FEATURES_TR = [
  { emoji: '🗺️', title: '10 Özel Senaryo Kartı', desc: 'Ortadoğu Kriz Paketi — jeopolitik kararlar, gerçek sonuçlar.' },
  { emoji: '🎭', title: '3 Yeni Lider Profili',  desc: 'Karikatür ikonlar: Sarışın Şerif, Acemler, Siyonistler...' },
  { emoji: '📵', title: 'Ömür Boyu Reklamsız',    desc: 'Bir daha asla reklam görmeden oyna.' },
];

const FEATURES_EN = [
  { emoji: '🗺️', title: '10 Exclusive Scenario Cards', desc: 'Middle East Crisis Pack — geopolitical decisions, real consequences.' },
  { emoji: '🎭', title: '3 New Leader Profiles',        desc: 'Caricature icons: Blonde Sheriff, Persians, Zionists...' },
  { emoji: '📵', title: 'Lifetime Ad-Free',              desc: 'Never see another ad while you play.' },
];

export function PremiumModal({ onPurchase, onClose }: PremiumModalProps) {
  const { lang } = useLanguage();
  const features = lang === 'tr' ? FEATURES_TR : FEATURES_EN;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    playClickSound();
    onClose();
  };

  const handlePurchase = () => {
    playClickSound();
    hapticMedium();
    onPurchase();
  };

  return (
    <div
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-sm mx-0 sm:mx-4 rounded-t-3xl sm:rounded-3xl overflow-hidden transition-all duration-500"
        style={{
          background: 'linear-gradient(170deg, hsl(220 25% 10%) 0%, hsl(0 20% 8%) 100%)',
          border: '1px solid hsl(45 70% 50% / 0.35)',
          boxShadow: '0 0 60px hsl(45 70% 50% / 0.15), 0 32px 80px rgba(0,0,0,0.8)',
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
          opacity: visible ? 1 : 0,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Glow bar top */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, hsl(45 80% 55%), transparent)' }}
        />

        {/* Header */}
        <div className="relative px-6 pt-7 pb-4 text-center">
          <div className="text-5xl mb-3">
            <EmojiImg emoji="🏛️" size={52} className="mx-auto" />
          </div>
          <div
            className="text-[10px] font-black uppercase tracking-[0.35em] mb-1"
            style={{ color: 'hsl(45 80% 55%)' }}
          >
            {lang === 'tr' ? 'Premium Paket' : 'Premium Pack'}
          </div>
          <h2
            className="text-xl font-black leading-tight"
            style={{ color: 'hsl(45 90% 75%)', textShadow: '0 0 24px hsl(45 80% 55% / 0.5)' }}
          >
            {lang === 'tr' ? 'Büyük Ortadoğu\nKriz Paketi' : 'Great Middle East\nCrisis Pack'}
          </h2>
          <p className="text-xs text-white/45 mt-1.5 leading-relaxed">
            {lang === 'tr'
              ? 'Çünkü gerçek kriz, seçenek sunmaz.'
              : 'Because real crises offer no good choices.'}
          </p>
        </div>

        {/* Divider */}
        <div className="mx-6 h-px" style={{ background: 'hsl(45 50% 40% / 0.25)' }} />

        {/* Features */}
        <div className="px-6 py-4 space-y-3">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'hsl(45 60% 50% / 0.12)', border: '1px solid hsl(45 60% 50% / 0.25)' }}
              >
                <EmojiImg emoji={f.emoji} size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-white/90 leading-tight">{f.title}</p>
                <p className="text-[11px] text-white/40 leading-snug mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mx-6 h-px" style={{ background: 'hsl(45 50% 40% / 0.25)' }} />

        {/* Price + CTA */}
        <div className="px-6 pt-4 pb-6 space-y-3">
          <button
            onClick={handlePurchase}
            className="w-full py-4 rounded-2xl font-black text-base text-black active:scale-95 transition-transform relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, hsl(45 90% 55%), hsl(35 85% 48%))',
              boxShadow: '0 4px 28px hsl(45 80% 50% / 0.45)',
            }}
          >
            <span className="relative z-10">
              {lang === 'tr' ? '✦ Satın Al — $2.99' : '✦ Purchase — $2.99'}
            </span>
          </button>

          <button
            onClick={handleClose}
            className="w-full py-3 rounded-2xl text-sm font-bold text-white/40 hover:text-white/60 transition-colors"
            style={{ background: 'hsl(0 0% 100% / 0.04)' }}
          >
            {lang === 'tr' ? 'Şimdi Değil' : 'Not Now'}
          </button>
        </div>

        {/* Bottom glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, hsl(45 80% 55% / 0.3), transparent)' }}
        />
      </div>
    </div>
  );
}
