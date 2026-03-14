import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmojiImg } from '@/components/EmojiImg';
import { useLanguage } from '@/contexts/LanguageContext';
import { AVATAR_DEFS } from '@/lib/userProfile';
import { playClickSound } from '@/hooks/useSound';
import { hapticMedium } from '@/hooks/useHaptics';

interface OnboardingScreenProps {
  onComplete: (nickname: string, avatarId: string) => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { lang } = useLanguage();
  const [step, setStep] = useState<'nickname' | 'avatar'>('nickname');
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('avatar_1');
  const defaultAvatars = AVATAR_DEFS.filter(a => !a.unlockAchievement);

  const handleNicknameSubmit = () => {
    const trimmed = nickname.trim();
    if (trimmed.length < 2 || trimmed.length > 20) return;
    playClickSound();
    hapticMedium();
    setStep('avatar');
  };

  const handleComplete = () => {
    playClickSound();
    hapticMedium();
    onComplete(nickname.trim(), selectedAvatar);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background/95 backdrop-blur-md animate-fade-in p-6">
      {step === 'nickname' ? (
        <div className="flex flex-col items-center gap-6 max-w-sm w-full text-center">
          <EmojiImg emoji="🏛️" size={64} />
          <h2 className="text-2xl font-black text-foreground">
            {lang === 'tr' ? 'Sana nasıl seslenelim?' : 'How should we address you?'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {lang === 'tr' ? 'Liderliğin bir isimle başlar...' : 'Every leadership begins with a name...'}
          </p>
          <Input
            value={nickname}
            onChange={e => setNickname(e.target.value.slice(0, 20))}
            placeholder={lang === 'tr' ? 'Takma adını gir...' : 'Enter your nickname...'}
            className="text-center text-lg font-bold bg-card border-2 border-primary/30 focus:border-primary"
            maxLength={20}
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleNicknameSubmit()}
          />
          <div className="text-xs text-muted-foreground/60">
            {nickname.trim().length}/20
          </div>
          <Button
            size="lg"
            onClick={handleNicknameSubmit}
            disabled={nickname.trim().length < 2}
            className="w-full text-lg py-5 font-bold"
          >
            {lang === 'tr' ? 'Devam Et' : 'Continue'}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5 max-w-sm w-full text-center">
          <h2 className="text-2xl font-black text-foreground">
            {lang === 'tr' ? 'Liderini Seç' : 'Choose Your Leader'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {lang === 'tr' ? 'Her diktatörün bir yüzü vardır...' : 'Every dictator has a face...'}
          </p>

          <div className="flex gap-4 mt-2">
            {defaultAvatars.map(avatar => (
              <button
                key={avatar.id}
                onClick={() => { playClickSound(); setSelectedAvatar(avatar.id); }}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-200 ${
                  selectedAvatar === avatar.id
                    ? 'ring-3 ring-primary bg-primary/10 scale-110'
                    : 'bg-card border border-border hover:border-primary/40'
                }`}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg"
                  style={{ background: avatar.color }}
                >
                  <EmojiImg emoji={avatar.emoji} size={40} />
                </div>
                <span className="text-xs font-bold text-foreground">
                  {lang === 'tr' ? avatar.nameTR : avatar.nameEN}
                </span>
              </button>
            ))}
          </div>

          <Button
            size="lg"
            onClick={handleComplete}
            className="w-full text-lg py-5 font-bold mt-2"
          >
            {lang === 'tr' ? 'Başla!' : "Let's Go!"}
          </Button>
        </div>
      )}
    </div>
  );
}
