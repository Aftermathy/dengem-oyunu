import { useState, useEffect } from 'react';
import splashBg from '@/assets/splash-bg.jpg';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(onComplete, 800);
          }, 400);
          return 100;
        }
        return prev + Math.random() * 3 + 1;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-black transition-opacity duration-700 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={splashBg}
          alt="Game splash"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
      </div>

      {/* Top spacer */}
      <div className="flex-1" />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 -mt-16">
        <h1
          className="text-4xl sm:text-5xl font-black tracking-tight text-center"
          style={{
            color: 'hsl(40, 30%, 92%)',
            textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 60px rgba(200,150,50,0.3)',
          }}
        >
          I MUST STAY
        </h1>
        <div
          className="text-sm sm:text-base tracking-[0.3em] uppercase font-medium"
          style={{ color: 'hsl(35, 40%, 65%)' }}
        >
          Aftermath Vibe Studios
        </div>
      </div>

      {/* Bottom section */}
      <div className="relative z-10 flex flex-col items-center gap-4 pb-12 pt-8 flex-1 justify-end px-8">
        {/* Loading bar */}
        <div className="w-48 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'hsl(20, 10%, 20%)' }}>
          <div
            className="h-full rounded-full transition-all duration-150"
            style={{
              width: `${Math.min(progress, 100)}%`,
              background: 'linear-gradient(90deg, hsl(15, 80%, 45%), hsl(45, 60%, 65%))',
            }}
          />
        </div>

        {/* Disclaimer */}
        <p
          className="text-[10px] sm:text-xs text-center leading-relaxed max-w-xs italic"
          style={{ color: 'hsl(30, 10%, 45%)' }}
        >
          Bu oyundaki tüm olaylar, karakterler ve kurumlar tamamen hayal ürünüdür.
          Gerçek kişi ve olaylarla herhangi bir benzerlik...{' '}
          <span style={{ color: 'hsl(35, 40%, 60%)' }}>
            şaşırtıcı derecede tesadüftür. 😏
          </span>
        </p>
      </div>
    </div>
  );
};
