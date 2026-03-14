import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { EmojiImg } from '@/components/EmojiImg';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchAllTimeLeaderboard, fetchWeeklyLeaderboard, type LeaderboardEntry } from '@/lib/leaderboard';
import { useAuth } from '@/hooks/useAuth';
import { playClickSound } from '@/hooks/useSound';
import { hapticLight } from '@/hooks/useHaptics';

interface LeaderboardScreenProps {
  onClose: () => void;
}

export function LeaderboardScreen({ onClose }: LeaderboardScreenProps) {
  const { lang } = useLanguage();
  const { user, profile, signInWithGoogle, signOut } = useAuth();
  const [tab, setTab] = useState<'weekly' | 'alltime'>('weekly');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = tab === 'weekly'
      ? await fetchWeeklyLeaderboard()
      : await fetchAllTimeLeaderboard();
    setEntries(data);
    setLoading(false);
  }, [tab]);

  useEffect(() => { loadData(); }, [loadData]);

  const getMedal = (i: number) => {
    if (i === 0) return '🥇';
    if (i === 1) return '🥈';
    if (i === 2) return '🥉';
    return '';
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 animate-fade-in p-4">
      <div className="bg-card border-2 border-border rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
          <h2 className="text-xl font-black flex items-center gap-2">
            <EmojiImg emoji="🏆" size={24} />
            {lang === 'tr' ? 'Skor Tablosu' : 'Leaderboard'}
          </h2>
          <button onClick={() => { playClickSound(); onClose(); }} className="text-muted-foreground hover:text-foreground text-xl font-bold">✕</button>
        </div>

        {/* Auth section */}
        <div className="px-4 py-2 border-b border-border shrink-0">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                  {(profile?.nickname || 'P')[0].toUpperCase()}
                </div>
                <span className="text-sm font-bold truncate max-w-[150px]">{profile?.nickname || 'Player'}</span>
              </div>
              <button onClick={() => { playClickSound(); signOut(); }} className="text-xs text-muted-foreground hover:text-destructive">
                {lang === 'tr' ? 'Çıkış' : 'Sign out'}
              </button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => { playClickSound(); hapticLight(); signInWithGoogle(); }}
              className="w-full text-sm font-bold"
            >
              <EmojiImg emoji="🔑" size={14} className="mr-1" />
              {lang === 'tr' ? 'Google ile Giriş Yap' : 'Sign in with Google'}
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border shrink-0">
          <button
            onClick={() => { playClickSound(); setTab('weekly'); }}
            className={`flex-1 py-2.5 text-sm font-bold transition-colors ${
              tab === 'weekly' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
            }`}
          >
            <EmojiImg emoji="📅" size={14} className="mr-1" />
            {lang === 'tr' ? 'Haftalık' : 'Weekly'}
          </button>
          <button
            onClick={() => { playClickSound(); setTab('alltime'); }}
            className={`flex-1 py-2.5 text-sm font-bold transition-colors ${
              tab === 'alltime' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
            }`}
          >
            <EmojiImg emoji="👑" size={14} className="mr-1" />
            {lang === 'tr' ? 'Tüm Zamanlar' : 'All Time'}
          </button>
        </div>

        {/* Scores list */}
        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <EmojiImg emoji="⏳" size={24} className="animate-spin mr-2" />
              {lang === 'tr' ? 'Yükleniyor...' : 'Loading...'}
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <EmojiImg emoji="🏜️" size={40} className="mb-2" />
              <p className="text-sm">{lang === 'tr' ? 'Henüz skor yok!' : 'No scores yet!'}</p>
              <p className="text-xs mt-1">{lang === 'tr' ? 'İlk sen ol!' : 'Be the first!'}</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {entries.map((entry, i) => (
                <div
                  key={entry.id}
                  className={`flex items-center gap-2 p-2.5 rounded-xl transition-colors ${
                    entry.user_id === user?.id ? 'bg-primary/10 border border-primary/30' : 'bg-muted/30'
                  } ${i < 3 ? 'border border-amber-400/20' : ''}`}
                >
                  <div className="w-7 text-center shrink-0">
                    {i < 3 ? (
                      <EmojiImg emoji={getMedal(i)} size={20} />
                    ) : (
                      <span className="text-xs font-bold text-muted-foreground">{i + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold truncate">{entry.nickname}</span>
                      {entry.user_id === user?.id && (
                        <span className="text-[10px] bg-primary/20 text-primary rounded px-1 font-bold shrink-0">
                          {lang === 'tr' ? 'SEN' : 'YOU'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                      <span><EmojiImg emoji="🗳️" size={10} /> {entry.elections_won}</span>
                      <span><EmojiImg emoji="💰" size={10} /> {entry.max_money}B</span>
                      <span><EmojiImg emoji="🧹" size={10} /> {entry.max_laundered}B</span>
                      {entry.max_election_pct > 0 && (
                        <span><EmojiImg emoji="📊" size={10} /> {entry.max_election_pct}%</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-black text-primary">{entry.score}</div>
                    <div className="text-[10px] text-muted-foreground">{lang === 'tr' ? 'tur' : 'turns'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Refresh */}
        <div className="p-3 border-t border-border shrink-0">
          <Button variant="outline" size="sm" onClick={() => { playClickSound(); loadData(); }} className="w-full text-xs">
            <EmojiImg emoji="🔄" size={12} className="mr-1" />
            {lang === 'tr' ? 'Yenile' : 'Refresh'}
          </Button>
        </div>
      </div>
    </div>
  );
}
