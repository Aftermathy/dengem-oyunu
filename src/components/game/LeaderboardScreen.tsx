import { useState, useEffect } from 'react';
import { EmojiImg } from '@/components/EmojiImg';
import { useLanguage } from '@/contexts/LanguageContext';
import { playClickSound } from '@/hooks/useSound';
import { hapticMedium } from '@/hooks/useHaptics';
import { AVATAR_DEFS, type UserProfile } from '@/lib/userProfile';
import { GameIcon } from '@/components/GameIcon';
import { useAppleSignIn } from '@/hooks/useAppleSignIn';

interface MockPlayer {
  id: string;
  nickname: string;
  avatarId: string;
  totalAP: number;
  isPlayer?: boolean;
}

const MOCK_PLAYERS: MockPlayer[] = [
  { id: 'm1', nickname: 'DarkLord42', avatarId: 'avatar_14', totalAP: 1250 },
  { id: 'm2', nickname: 'SultanOfChaos', avatarId: 'avatar_3', totalAP: 980 },
  { id: 'm3', nickname: 'GeneralMayhem', avatarId: 'avatar_1', totalAP: 870 },
  { id: 'm4', nickname: 'ClownKing', avatarId: 'avatar_5', totalAP: 720 },
  { id: 'm5', nickname: 'ZombiePrez', avatarId: 'avatar_6', totalAP: 650 },
  { id: 'm6', nickname: 'FoxTaktik', avatarId: 'avatar_15', totalAP: 540 },
  { id: 'm7', nickname: 'VampirBey', avatarId: 'avatar_4', totalAP: 430 },
  { id: 'm8', nickname: 'RoboDikta', avatarId: 'avatar_8', totalAP: 310 },
  { id: 'm9', nickname: 'PumpkinBoss', avatarId: 'avatar_11', totalAP: 220 },
  { id: 'm10', nickname: 'FrogRuler', avatarId: 'avatar_16', totalAP: 150 },
];

interface LeaderboardScreenProps {
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export function LeaderboardScreen({ onClose, userProfile, onUpdateProfile }: LeaderboardScreenProps) {
  const { lang } = useLanguage();
  const { signIn: appleSignIn, isLoading: appleLoading, isLinked: appleLinked } = useAppleSignIn();
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<MockPlayer[]>([]);
  const [showLinkedModal, setShowLinkedModal] = useState(false);

  useEffect(() => {
    const playerEntry: MockPlayer = {
      id: 'player',
      nickname: userProfile.nickname || (lang === 'tr' ? 'Oyuncu' : 'Player'),
      avatarId: userProfile.avatarId,
      totalAP: userProfile.totalAP,
      isPlayer: true,
    };
    const all = [...MOCK_PLAYERS, playerEntry].sort((a, b) => b.totalAP - a.totalAP);
    setEntries(all);
    setLoading(false);
  }, [userProfile, lang]);

  const getMedal = (i: number) => {
    if (i === 0) return '🥇';
    if (i === 1) return '🥈';
    if (i === 2) return '🥉';
    return '';
  };

  const getAvatarDef = (avatarId: string) => AVATAR_DEFS.find(a => a.id === avatarId) || AVATAR_DEFS[0];

  const handleAppleSignIn = async () => {
    playClickSound();
    hapticMedium();
    const data = await appleSignIn();
    if (data) {
      onUpdateProfile({ isAppleLinked: true } as any);
      setShowLinkedModal(true);
    }
  };

  const playerRank = entries.findIndex(e => e.isPlayer) + 1;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 animate-fade-in p-4">
      {showLinkedModal && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center"
          onClick={() => setShowLinkedModal(false)}
        >
          <div className="bg-card border-2 border-green-500/50 rounded-2xl p-8 mx-6 max-w-sm w-full shadow-2xl text-center animate-in zoom-in-95 duration-200">
            <div className="text-5xl mb-3">✅</div>
            <h3 className="text-lg font-black text-foreground mb-1">
              {lang === 'tr' ? 'Hesap Bağlandı!' : 'Account Linked!'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {lang === 'tr' ? 'Apple hesabınız başarıyla bağlandı.' : 'Your Apple account has been linked successfully.'}
            </p>
            <p className="text-xs text-muted-foreground/50 mt-4">
              {lang === 'tr' ? 'Kapatmak için dokun' : 'Tap to close'}
            </p>
          </div>
        </div>
      )}
      <div className="bg-card border-2 border-border rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
          <h2 className="text-xl font-black flex items-center gap-2 text-foreground">
            <EmojiImg emoji="🏆" size={24} />
            {lang === 'tr' ? 'Liderlik Tablosu' : 'Leaderboard'}
          </h2>
          <button onClick={() => { playClickSound(); onClose(); }} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground active:scale-90 transition-transform">
            <GameIcon name="close" size={16} />
          </button>
        </div>

        {/* Apple Sign In / Status */}
        <div className="px-4 py-2.5 border-b border-border shrink-0">
          {appleLinked ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-foreground flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-3 h-3 text-background" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
              </div>
              <span className="text-sm font-bold text-foreground">{userProfile.nickname}</span>
              <span className="text-[10px] bg-game-success/20 text-game-success rounded px-1.5 py-0.5 font-bold">
                {lang === 'tr' ? 'Bağlı' : 'Linked'}
              </span>
            </div>
          ) : (
            <button
              onClick={handleAppleSignIn}
              disabled={appleLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 bg-foreground text-background disabled:opacity-60"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              {appleLoading
                ? (lang === 'tr' ? 'Bağlanıyor...' : 'Connecting...')
                : (lang === 'tr' ? 'Apple ile Giriş Yap' : 'Sign in with Apple')}
            </button>
          )}
        </div>

        {/* Player rank highlight */}
        {!loading && playerRank > 0 && (
          <div className="px-4 py-2 border-b border-border/50 bg-primary/5 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {lang === 'tr' ? 'Sıralamanız' : 'Your Rank'}
              </span>
              <span className="text-sm font-black text-primary">#{playerRank}</span>
            </div>
          </div>
        )}

        {/* Scores list */}
        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <EmojiImg emoji="⏳" size={24} className="animate-spin mr-2" />
              {lang === 'tr' ? 'Yükleniyor...' : 'Loading...'}
            </div>
          ) : (
            <div className="space-y-1.5">
              {entries.map((entry, i) => {
                const av = getAvatarDef(entry.avatarId);
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-colors ${
                      entry.isPlayer ? 'bg-primary/10 border-2 border-primary/30 shadow-md' : 'bg-muted/30'
                    } ${i < 3 ? 'border border-game-gold/20' : ''}`}
                  >
                    {/* Rank */}
                    <div className="w-7 text-center shrink-0">
                      {i < 3 ? (
                        <EmojiImg emoji={getMedal(i)} size={20} />
                      ) : (
                        <span className="text-xs font-bold text-muted-foreground">{i + 1}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 border-border/30"
                      style={{ background: av.color }}
                    >
                      <EmojiImg emoji={av.emoji} size={22} />
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold truncate text-foreground">{entry.nickname}</span>
                        {entry.isPlayer && (
                          <span className="text-[10px] bg-primary/20 text-primary rounded px-1 font-bold shrink-0">
                            {lang === 'tr' ? 'SEN' : 'YOU'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* AP */}
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1">
                        <EmojiImg emoji="⭐" size={14} />
                        <span className="text-lg font-black text-game-gold">{entry.totalAP}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">AP</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
