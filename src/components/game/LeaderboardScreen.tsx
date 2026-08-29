import { useState, useEffect } from 'react';
import { EmojiImg } from '@/components/EmojiImg';
import { useLanguage } from '@/contexts/LanguageContext';
import { playClickSound } from '@/hooks/useSound';
import { hapticMedium } from '@/hooks/useHaptics';
import { AVATAR_DEFS, type UserProfile } from '@/lib/userProfile';
import { AvatarImg } from '@/components/AvatarImg';
import { GameIcon } from '@/components/GameIcon';
import { useAppleSignIn } from '@/hooks/useAppleSignIn';
import { fetchLeaderboard, reportEntry, blockEntry, type LeaderboardEntry } from '@/lib/leaderboard';
import { useAuth } from '@/contexts/AuthContext';

interface LeaderboardScreenProps {
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export function LeaderboardScreen({ onClose, userProfile, onUpdateProfile }: LeaderboardScreenProps) {
  const { lang } = useLanguage();
  const { signIn: appleSignIn, isLoading: appleLoading, isLinked: appleLinked, error: appleError } = useAppleSignIn();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [showLinkedModal, setShowLinkedModal] = useState(false);
  /*
    Guideline 1.2 wants a way to report and a way to block whoever is behind a
    nickname on a public board. Held per row id, which is all the client has:
    the view does not hand out user ids, so both actions go through an RPC that
    resolves the row to a player on the server.
  */
  const [moderating, setModerating] = useState<LeaderboardEntry | null>(null);
  const [moderationDone, setModerationDone] = useState<'reported' | 'blocked' | 'error' | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setFetchError(false);
      try {
        const data = await fetchLeaderboard(50);
        if (cancelled) return;

        // Check if player already has an entry in the fetched data
        const hasPlayerEntry = data.some(e => e.is_me);

        if (!hasPlayerEntry) {
          // Add local player as a virtual entry for display
          const virtualEntry: LeaderboardEntry = {
            id: 'local-player',
            nickname: userProfile.nickname || (lang === 'tr' ? 'Oyuncu' : 'Player'),
            score: userProfile.totalAP,
            elections_won: 0,
            max_money: 0,
            max_election_pct: 0,
            max_laundered: 0,
            death_reason: null,
            created_at: new Date().toISOString(),
            avatar_id: userProfile.avatarId,
            is_me: true,
          };
          data.push(virtualEntry);
          data.sort((a, b) => b.score - a.score);
        }

        setEntries(data);
      } catch {
        if (!cancelled) setFetchError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [userProfile.totalAP, userProfile.nickname, userProfile.avatarId, user?.id, lang, retryCount]);

  const getMedal = (i: number) => {
    if (i === 0) return '🥇';
    if (i === 1) return '🥈';
    if (i === 2) return '🥉';
    return '';
  };

  const getAvatarDef = (avatarId: string | undefined) => {
    return AVATAR_DEFS.find(a => a.id === avatarId) || AVATAR_DEFS[0];
  };

  const getPlayerAvatar = () => AVATAR_DEFS.find(a => a.id === userProfile.avatarId) || AVATAR_DEFS[0];

  const handleAppleSignIn = async () => {
    playClickSound();
    hapticMedium();
    const data = await appleSignIn();
    if (data) {
      onUpdateProfile({ isAppleLinked: true });
      setShowLinkedModal(true);
    }
  };

  // findIndex returns -1 when not found — keep as index so >= 0 check is unambiguous
  const playerRankIndex = entries.findIndex(e => e.is_me);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 animate-fade-in p-4">
      {showLinkedModal && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center"
          onClick={() => setShowLinkedModal(false)}
        >
          <div className="bg-card border-2 border-green-500/50 rounded-2xl p-8 mx-6 max-w-sm w-full shadow-2xl text-center animate-in zoom-in-95 duration-200">
            <div className="mb-3"><EmojiImg emoji="✅" size={48} /></div>
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
            <>
              {appleError && appleError !== 'cancelled' && (
                <p className="text-xs text-destructive text-center mb-1 font-medium">{appleError}</p>
              )}
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
            </>
          )}
        </div>

        {/* Player rank highlight */}
        {!loading && playerRankIndex >= 0 && (
          <div className="px-4 py-2 border-b border-border/50 bg-primary/5 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {lang === 'tr' ? 'Sıralamanız' : 'Your Rank'}
              </span>
              <span className="text-sm font-black text-primary">#{playerRankIndex + 1}</span>
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
          ) : fetchError ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-3">
              <EmojiImg emoji="📡" size={32} />
              <p className="text-sm font-bold text-destructive">
                {lang === 'tr' ? 'Bağlantı Hatası' : 'Connection Error'}
              </p>
              <button
                onClick={() => { playClickSound(); setFetchError(false); setRetryCount(c => c + 1); }}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-primary text-primary-foreground active:scale-95 transition-all"
              >
                {lang === 'tr' ? 'Tekrar Dene' : 'Retry'}
              </button>
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <EmojiImg emoji="🏜️" size={32} className="mb-2" />
              <p className="text-sm">{lang === 'tr' ? 'Henüz skor yok' : 'No scores yet'}</p>
              <p className="text-xs mt-1">{lang === 'tr' ? 'İlk sen ol!' : 'Be the first!'}</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {entries.map((entry, i) => {
                const isPlayer = entry.is_me;
                const av = isPlayer ? getPlayerAvatar() : getAvatarDef(entry.avatar_id);
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-colors ${
                      isPlayer ? 'bg-primary/10 border-2 border-primary/30 shadow-md' : 'bg-muted/30'
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
                      className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-border/30 flex items-center justify-center"
                      style={{ background: av.color }}
                    >
                      <AvatarImg avatar={av} fill />
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold truncate text-foreground">{entry.nickname}</span>
                        {isPlayer && (
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
                        <span className="text-lg font-black text-game-gold">{entry.score}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">AP</div>
                    </div>

                    {/* Report / block. Never on your own row, and never on the
                        local placeholder, which has no server row behind it. */}
                    {!isPlayer && entry.id !== 'local-player' && (
                      <button
                        onClick={() => { playClickSound(); setModerating(entry); setModerationDone(null); }}
                        aria-label={lang === 'tr' ? 'Bu oyuncuyu bildir veya engelle' : 'Report or block this player'}
                        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground/60 active:scale-90 transition-transform"
                      >
                        <span className="text-base leading-none">⋯</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {moderating && (
        <div
          className="fixed inset-0 z-[320] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setModerating(null)}
        >
          <div
            className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-5 bg-background"
            onClick={e => e.stopPropagation()}
          >
            <p className="text-sm font-bold text-foreground mb-1">
              {moderating.nickname}
            </p>
            <p className="text-[11px] text-muted-foreground mb-4">
              {lang === 'tr'
                ? 'Bu ad rahatsız ediciyse bildir. Engellersen bu oyuncuyu bir daha tabloda görmezsin.'
                : 'Report this name if it is offensive. Blocking hides this player from your board for good.'}
            </p>

            {moderationDone === null ? (
              <div className="space-y-2">
                <button
                  onClick={async () => {
                    playClickSound();
                    const r = await reportEntry(moderating.id);
                    setModerationDone(r === 'ok' ? 'reported' : 'error');
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide"
                  style={{ border: '1px solid hsl(var(--game-danger) / 0.4)', color: 'hsl(var(--game-danger-light))' }}
                >
                  {lang === 'tr' ? 'Bildir' : 'Report'}
                </button>
                <button
                  onClick={async () => {
                    playClickSound();
                    const r = await blockEntry(moderating.id);
                    if (r === 'ok') {
                      setEntries(prev => prev.filter(e => e.id !== moderating.id));
                      setModerationDone('blocked');
                    } else {
                      setModerationDone('error');
                    }
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide"
                  style={{ border: '1px solid hsl(var(--game-danger) / 0.4)', color: 'hsl(var(--game-danger-light))' }}
                >
                  {lang === 'tr' ? 'Engelle' : 'Block'}
                </button>
                <button
                  onClick={() => { playClickSound(); setModerating(null); }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide text-muted-foreground"
                  style={{ border: '1px solid hsl(var(--game-election) / 0.25)' }}
                >
                  {lang === 'tr' ? 'Vazgeç' : 'Cancel'}
                </button>
              </div>
            ) : (
              <div>
                <p className="text-xs py-2" style={{
                  color: moderationDone === 'error' ? 'hsl(0 70% 60%)' : 'hsl(145 70% 55%)',
                }}>
                  {moderationDone === 'reported' && (lang === 'tr'
                    ? 'Bildirildi. Yeterli bildirim gelirse bu ad herkesten gizlenir.'
                    : 'Reported. The name is hidden from everyone once enough people report it.')}
                  {moderationDone === 'blocked' && (lang === 'tr'
                    ? 'Engellendi. Bu oyuncuyu bir daha görmeyeceksin.'
                    : 'Blocked. You will not see this player again.')}
                  {moderationDone === 'error' && (lang === 'tr'
                    ? 'İşlem tamamlanamadı, tekrar dene.'
                    : 'That did not go through, try again.')}
                </p>
                <button
                  onClick={() => { playClickSound(); setModerating(null); }}
                  className="w-full mt-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide text-muted-foreground"
                  style={{ border: '1px solid hsl(var(--game-election) / 0.25)' }}
                >
                  {lang === 'tr' ? 'Kapat' : 'Close'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
