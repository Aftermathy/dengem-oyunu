import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertTriangle, Syringe } from 'lucide-react';

interface CrisisAlertProps {
  type: 'crisis' | 'emergency_fund';
  onDone: () => void;
}

export function CrisisAlert({ type, onDone }: CrisisAlertProps) {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [shaking, setShaking] = useState(true);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const shakeTimer = setTimeout(() => setShaking(false), 600);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 500);
    }, 3500);
    return () => { clearTimeout(timer); clearTimeout(shakeTimer); };
  }, [onDone]);

  const isCrisis = type === 'crisis';
  const title = isCrisis
    ? (lang === 'en' ? 'Crisis Management Activated!' : 'Kriz Yönetimi Devreye Girdi!')
    : (lang === 'en' ? 'Emergency Fund Injected!' : 'Acil Fon Enjekte Edildi!');
  const subtitle = isCrisis
    ? (lang === 'en' ? 'Bar restored to 20%! (Once per game)' : 'Bar %20\'ye çekildi! (Oyun başına 1 kez)')
    : (lang === 'en' ? '+25B injected! (Once per game)' : '+25B enjekte edildi! (Oyun başına 1 kez)');

  return (
    <div
      className={`fixed inset-0 z-[160] flex items-center justify-center pointer-events-none transition-all duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Red vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, hsl(0 80% 30% / 0.4) 100%)',
          animation: visible ? 'pulse 1s ease-in-out 2' : 'none',
        }}
      />

      {/* Alert card */}
      <div
        className={`relative px-8 py-6 rounded-2xl flex flex-col items-center gap-3 max-w-[85vw] transition-transform duration-500 ${
          visible ? 'scale-100' : 'scale-50'
        } ${shaking ? 'animate-shake' : ''}`}
        style={{
          background: 'linear-gradient(135deg, hsl(0 70% 20% / 0.95), hsl(0 60% 12% / 0.95))',
          border: '2px solid hsl(0 80% 50% / 0.6)',
          boxShadow: '0 0 60px hsl(0 80% 50% / 0.4), 0 0 120px hsl(0 80% 50% / 0.2), inset 0 1px 0 hsl(0 0% 100% / 0.1)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, hsl(0 80% 50%), hsl(0 70% 35%))',
            boxShadow: '0 0 30px hsl(0 80% 50% / 0.5)',
          }}
        >
          {isCrisis ? (
            <AlertTriangle size={32} style={{ color: 'white' }} />
          ) : (
            <Syringe size={32} style={{ color: 'white' }} />
          )}
        </div>
        <h3 className="text-lg font-black text-center" style={{ color: 'hsl(0 80% 70%)' }}>
          {title}
        </h3>
        <p className="text-sm font-medium text-center" style={{ color: 'hsl(0 30% 75%)' }}>
          {subtitle}
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) scale(1); }
          10% { transform: translateX(-8px) scale(1); }
          20% { transform: translateX(8px) scale(1); }
          30% { transform: translateX(-6px) scale(1); }
          40% { transform: translateX(6px) scale(1); }
          50% { transform: translateX(-4px) scale(1); }
          60% { transform: translateX(4px) scale(1); }
          70% { transform: translateX(-2px) scale(1); }
          80% { transform: translateX(2px) scale(1); }
        }
        .animate-shake { animation: shake 0.6s ease-in-out; }
      `}</style>
    </div>
  );
}
