import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmojiImg } from '@/components/EmojiImg';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMetaGame } from '@/contexts/MetaGameContext';
import { AVATAR_DEFS, isAvatarUnlocked, getFunnyStats, type UserProfile } from '@/lib/userProfile';
import { isAdFree } from '@/hooks/useAds';
import { AvatarImg } from '@/components/AvatarImg';
import { playClickSound } from '@/hooks/useSound';
import { setAdFree } from '@/hooks/useAds';
import { PremiumModal } from '@/components/game/PremiumModal';
import { hapticLight, hapticMedium } from '@/hooks/useHaptics';
import { GameIcon } from '@/components/GameIcon';
import { getSeenCards } from '@/lib/cardMemory';
import { eventCards } from '@/data/cards';

interface ProfileScreenProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onClose: () => void;
}

export function ProfileScreen({ profile, onUpdateProfile, onClose }: ProfileScreenProps) {
  const { lang } = useLanguage();
  const { claimedAchievements } = useMetaGame();
  const [showGallery, setShowGallery] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(profile.nickname);

  const currentAvatar = AVATAR_DEFS.find(a => a.id === profile.avatarId) || AVATAR_DEFS[0];
  const funnyStats = getFunnyStats(profile.totalTurns, profile.gamesPlayed);

  const handleAvatarSelect = (avatarId: string) => {
    const def = AVATAR_DEFS.find(a => a.id === avatarId);
    if (def?.dlcPack && !isAdFree()) {
      playClickSound();
      setShowPremiumModal(true);
      return;
    }
    const unlocked = isAvatarUnlocked(avatarId, claimedAchievements, isAdFree());
    if (!unlocked) return;
    playClickSound();
    hapticMedium();
    onUpdateProfile({ avatarId });
    setShowGallery(false);
  };

  const handleSaveName = () => {
    const trimmed = tempName.trim();
    if (trimmed.length >= 2 && trimmed.length <= 20) {
      onUpdateProfile({ nickname: trimmed });
      setEditingName(false);
      playClickSound();
    }
  };

  if (showGallery) {
    return (
      <><div className="fixed inset-0 z-[80] flex flex-col bg-background animate-fade-in overflow-auto" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <h2 className="text-xl font-black text-foreground">
            {lang === 'tr' ? 'Avatar Galerisi' : 'Avatar Gallery'}
          </h2>
          <button onClick={() => { playClickSound(); setShowGallery(false); }} className="p-2 rounded-full hover:bg-muted">
            <GameIcon name="close" size={20} className="text-foreground" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 p-4">
          {AVATAR_DEFS.map(avatar => {
            const unlocked = isAvatarUnlocked(avatar.id, claimedAchievements, isAdFree());
            const isDlcLocked = !!avatar.dlcPack && !isAdFree();
            const isSelected = avatar.id === profile.avatarId;
            return (
              <button
                key={avatar.id}
                onClick={() => handleAvatarSelect(avatar.id)}
                className={`relative flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all ${
                  isSelected ? 'ring-2 ring-primary bg-primary/10' : 
                  unlocked ? 'bg-card border border-border hover:border-primary/40' : 
                  'bg-muted/50 border border-border/50 opacity-60'
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-md relative overflow-hidden ${
                    !unlocked ? 'brightness-0 opacity-50' : ''
                  }`}
                  style={{ background: avatar.color }}
                >
                  <AvatarImg avatar={avatar} size={64} />
                  {!unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                      <GameIcon name="lock" size={20} className="text-white/80" />
                    </div>
                  )}
                  {isDlcLocked && (
                    <div className="absolute -bottom-0.5 -right-0.5 bg-yellow-500 rounded-full w-5 h-5 flex items-center justify-center text-[9px] font-black text-black leading-none">
                      ★
                    </div>
                  )}
                </div>
                {isDlcLocked && (
                  <span className="text-[8px] font-black text-yellow-500 leading-tight text-center">
                    {lang === 'tr' ? 'Premium' : 'Premium'}
                  </span>
                )}
                <span className="text-[10px] font-bold text-foreground leading-tight text-center">
                  {lang === 'tr' ? avatar.nameTR : avatar.nameEN}
                </span>
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <GameIcon name="check" size={12} className="text-primary-foreground" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {showPremiumModal && (
        <PremiumModal
          onPurchase={() => { setAdFree(); setShowPremiumModal(false); }}
          onClose={() => setShowPremiumModal(false)}
        />
      )}</>
    );
  }

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-background animate-fade-in overflow-auto" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
        <h2 className="text-xl font-black text-foreground">
          {lang === 'tr' ? 'Profil' : 'Profile'}
        </h2>
        <button onClick={() => { playClickSound(); onClose(); }} className="p-2 rounded-full hover:bg-muted">
          <GameIcon name="close" size={20} className="text-foreground" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center gap-4 p-6 pt-8">
        {/* Avatar */}
        <button
          onClick={() => { playClickSound(); hapticLight(); setShowGallery(true); }}
          className="relative group"
        >
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center text-6xl shadow-xl border-4 border-primary/30 group-hover:border-primary transition-colors overflow-hidden"
            style={{ background: currentAvatar.color }}
          >
            <AvatarImg avatar={currentAvatar} size={112} />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md">
            <GameIcon name="pencil" size={14} className="text-primary-foreground" />
          </div>
        </button>

        {/* Nickname */}
        <div className="flex items-center gap-2">
          {editingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={tempName}
                onChange={e => setTempName(e.target.value.slice(0, 20))}
                className="text-center text-lg font-bold w-48"
                maxLength={20}
                autoFocus
                onKeyDown={e => e.key === 'Enter' && handleSaveName()}
              />
              <button onClick={handleSaveName} className="p-1.5 rounded-full bg-primary">
                <GameIcon name="check" size={14} className="text-primary-foreground" />
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-black text-foreground">{profile.nickname}</h3>
              <button
                onClick={() => { setTempName(profile.nickname); setEditingName(true); }}
                className="p-1 rounded-full hover:bg-muted"
              >
                <GameIcon name="pencil" size={14} className="text-muted-foreground" />
              </button>
            </>
          )}
        </div>

        {/* Serious Stats */}
        <div className="w-full max-w-xs bg-card border border-border rounded-2xl p-4 space-y-3">
          <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            {lang === 'tr' ? 'İstatistikler' : 'Statistics'}
          </h4>
          <StatRow
            emoji="🎯"
            label={lang === 'tr' ? 'Toplam Oynanan Tur' : 'Total Turns Played'}
            value={String(profile.totalTurns)}
          />
          <StatRow
            emoji="⭐"
            label={lang === 'tr' ? 'Toplam Kazanılan AP' : 'Total AP Earned'}
            value={String(profile.totalAP)}
          />
          <StatRow
            emoji="🎮"
            label={lang === 'tr' ? 'Oyun Sayısı' : 'Games Played'}
            value={String(profile.gamesPlayed)}
          />
          <StatRow
            emoji="📖"
            label={lang === 'tr' ? 'Keşfedilen Kart' : 'Cards Discovered'}
            value={`${getSeenCards().size} / ${eventCards.length}`}
          />
        </div>

        {/* Funny Stats */}
        <div className="w-full max-w-xs bg-card border border-border rounded-2xl p-4 space-y-3">
          <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            {lang === 'tr' ? '🤫 Gizli Dosya' : '🤫 Classified File'}
          </h4>
          <StatRow
            emoji="🔥"
            label={lang === 'tr' ? 'Harcanan Danışman' : 'Advisors Fired'}
            value={String(funnyStats.advisorsFired)}
          />
          <StatRow
            emoji="☕"
            label={lang === 'tr' ? 'İçilen Kahve (Ton)' : 'Coffee Consumed (Tons)'}
            value={String(funnyStats.coffeeTons)}
          />
          <StatRow
            emoji="🤐"
            label={lang === 'tr' ? 'Susturulan Muhalif' : 'Silenced Opponents'}
            value={String(funnyStats.silencedOpponents)}
          />
        </div>

        {/* Change Avatar Button */}
        <Button
          variant="outline"
          onClick={() => { playClickSound(); hapticLight(); setShowGallery(true); }}
          className="mt-2"
        >
          <EmojiImg emoji="🎨" size={16} className="mr-1.5" />
          {lang === 'tr' ? 'Avatarı Değiştir' : 'Change Avatar'}
        </Button>
      </div>

      {showPremiumModal && (
        <PremiumModal
          onPurchase={() => { setAdFree(); setShowPremiumModal(false); }}
          onClose={() => setShowPremiumModal(false)}
        />
      )}
    </div>
  );
}

function StatRow({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <EmojiImg emoji={emoji} size={16} />
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <span className="text-sm font-bold text-primary">{value}</span>
    </div>
  );
}
