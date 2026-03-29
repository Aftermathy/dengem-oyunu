import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/contexts/SettingsContext';
import { GameIcon } from '@/components/GameIcon';
import { playClickSound } from '@/hooks/useSound';
import { STORAGE_KEYS } from '@/constants/storage';

interface SettingsModalProps {
  onClose: () => void;
  onMainMenu?: () => void;
}

// ─── Military Toggle ──────────────────────────────────────────────────────────
function MilitaryToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => { playClickSound(); onChange(!value); }}
      className="relative flex-shrink-0 active:scale-90 transition-transform"
      style={{
        width: 52,
        height: 26,
        background: value ? 'hsl(var(--game-election))' : 'hsl(var(--muted))',
        border: `2px solid ${value ? 'hsl(var(--game-election))' : 'hsl(var(--border))'}`,
        borderRadius: 2,
      }}
      aria-pressed={value}
    >
      {/* Thumb */}
      <div
        className="absolute top-[3px] transition-all duration-150"
        style={{
          width: 14,
          height: 14,
          background: 'white',
          borderRadius: 1,
          left: value ? 28 : 4,
          opacity: 0.95,
        }}
      />
      {/* Label */}
      <span
        className="absolute top-1/2 -translate-y-1/2 text-[8px] font-black tracking-wider text-white pointer-events-none"
        style={{ [value ? 'left' : 'right']: 5 }}
      >
        {value ? 'ON' : 'OFF'}
      </span>
    </button>
  );
}

// ─── Volume Slider ────────────────────────────────────────────────────────────
function VolumeSlider({
  label, value, onChange, disabled,
}: {
  label: string; value: number; onChange: (v: number) => void; disabled?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const fillPct = value * 100;

  const valueFromEvent = useCallback((clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (disabled) return;
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const v = valueFromEvent(e.clientX);
    if (v !== null) onChange(Math.round(v * 50) / 50); // step ~0.02
  }, [disabled, onChange, valueFromEvent]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || disabled) return;
    const v = valueFromEvent(e.clientX);
    if (v !== null) onChange(Math.round(v * 50) / 50);
  }, [disabled, onChange, valueFromEvent]);

  const onPointerUp = useCallback(() => { dragging.current = false; }, []);

  return (
    <div className={`mb-4 ${disabled ? 'opacity-35 pointer-events-none' : ''}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wide text-foreground/60">{label}</span>
        <span className="text-[11px] font-mono font-black tabular-nums" style={{ color: 'hsl(var(--game-election))' }}>
          {Math.round(value * 100)}%
        </span>
      </div>
      <div
        ref={trackRef}
        className="relative h-10 flex items-center select-none touch-none cursor-pointer"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Track background */}
        <div className="absolute left-0 right-0 h-[3px]" style={{ background: 'hsl(var(--border))' }} />
        {/* Fill */}
        <div
          className="absolute left-0 h-[3px]"
          style={{ width: `${fillPct}%`, background: 'hsl(var(--game-election))' }}
        />
        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map(t => (
          <div
            key={t}
            className="absolute"
            style={{
              left: `${t}%`,
              width: 1,
              height: t === 0 || t === 100 ? 10 : 6,
              background: 'hsl(var(--border))',
              transform: 'translateX(-50%)',
            }}
          />
        ))}
        {/* Thumb */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 14,
            height: 26,
            left: `calc(${fillPct}% - 7px)`,
            background: 'hsl(var(--game-election))',
            borderRadius: 2,
            boxShadow: `0 0 8px hsl(var(--game-election) / 0.5)`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Settings Modal ───────────────────────────────────────────────────────────
export function SettingsModal({ onClose, onMainMenu }: SettingsModalProps) {
  const { lang } = useLanguage();
  const { musicVolume, sfxVolume, showFactionPercentages, setMusicVolume, setSfxVolume, setShowFactionPercentages } = useSettings();
  const tr = lang === 'tr';

  const [muted, setMuted] = useState(() => localStorage.getItem(STORAGE_KEYS.SOUND_MUTED) === 'true');

  useEffect(() => {
    const handler = (e: Event) => setMuted((e as CustomEvent).detail as boolean);
    window.addEventListener('sound-mute-toggle', handler);
    return () => window.removeEventListener('sound-mute-toggle', handler);
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    localStorage.setItem(STORAGE_KEYS.SOUND_MUTED, String(next));
    window.dispatchEvent(new CustomEvent('sound-mute-toggle', { detail: next }));
  };

  const handleMainMenu = () => {
    playClickSound();
    onClose();
    onMainMenu?.();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ background: 'hsl(0 0% 0% / 0.82)', backdropFilter: 'blur(6px)' }}
    >
      {/* Backdrop dismiss */}
      <div className="absolute inset-0" onClick={() => { playClickSound(); onClose(); }} />

      {/* Modal card */}
      <div
        className="relative w-full max-w-sm bg-card overflow-hidden"
        style={{
          border: '2px solid hsl(var(--game-election) / 0.65)',
          borderRadius: 4,
          boxShadow: '0 0 50px hsl(var(--game-election) / 0.15), 0 24px 64px hsl(0 0% 0% / 0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Classified stamp decoration */}
        <div
          className="absolute top-3 right-12 pointer-events-none select-none"
          style={{ transform: 'rotate(-11deg)', opacity: 0.18 }}
        >
          <span
            className="text-[9px] font-black tracking-[4px] uppercase"
            style={{
              color: 'hsl(var(--game-danger))',
              border: '2px solid hsl(var(--game-danger))',
              padding: '2px 6px',
              display: 'block',
            }}
          >
            {tr ? 'GİZLİ' : 'CLASSIFIED'}
          </span>
        </div>

        {/* Header */}
        <div
          className="px-5 pt-5 pb-3"
          style={{ borderBottom: '1px solid hsl(var(--game-election) / 0.25)' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div
                className="text-[8px] font-bold tracking-[3px] uppercase mb-1"
                style={{ color: 'hsl(var(--game-election) / 0.7)' }}
              >
                {tr ? 'GİZLİ KARARNAME' : 'SECRET DECREE'} — {tr ? 'YETKİLİ PERSONEL' : 'AUTHORIZED ONLY'}
              </div>
              <h2
                className="text-base font-black uppercase tracking-widest text-foreground"
              >
                {tr ? 'Kabine Ayarları' : 'Cabinet Settings'}
              </h2>
            </div>
            <button
              onClick={() => { playClickSound(); onClose(); }}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center active:scale-90 transition-transform mt-0.5"
              style={{
                border: '1px solid hsl(var(--game-election) / 0.4)',
                borderRadius: 2,
                color: 'hsl(var(--game-election) / 0.8)',
              }}
            >
              <GameIcon name="close" size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-5">

          {/* Audio section */}
          <div>
            <div
              className="text-[8px] font-black tracking-[4px] uppercase mb-3 flex items-center gap-2"
              style={{ color: 'hsl(var(--game-election) / 0.6)' }}
            >
              <div style={{ width: 3, height: 10, background: 'hsl(var(--game-election) / 0.6)', borderRadius: 0 }} />
              {tr ? 'SES KONTROLLERİ' : 'AUDIO CONTROLS'}
            </div>

            {/* Mute toggle row */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wide text-foreground/70">
                  {tr ? 'Tüm Sesler' : 'All Sounds'}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {muted ? (tr ? 'Sessize alındı' : 'Muted') : (tr ? 'Aktif' : 'Active')}
                </div>
              </div>
              <MilitaryToggle value={!muted} onChange={(v) => { if (v === muted) toggleMute(); }} />
            </div>

            {/* Music volume */}
            <VolumeSlider
              label={tr ? 'Müzik Sesi' : 'Music Volume'}
              value={musicVolume}
              onChange={setMusicVolume}
              disabled={muted}
            />

            {/* SFX volume */}
            <VolumeSlider
              label={tr ? 'Efekt Sesi' : 'SFX Volume'}
              value={sfxVolume}
              onChange={setSfxVolume}
              disabled={muted}
            />
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'hsl(var(--game-election) / 0.18)' }} />

          {/* Display section */}
          <div>
            <div
              className="text-[8px] font-black tracking-[4px] uppercase mb-3 flex items-center gap-2"
              style={{ color: 'hsl(var(--game-election) / 0.6)' }}
            >
              <div style={{ width: 3, height: 10, background: 'hsl(var(--game-election) / 0.6)', borderRadius: 0 }} />
              {tr ? 'GÖRÜNTÜ' : 'DISPLAY'}
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wide text-foreground/70">
                  {tr ? 'Zümre Yüzdeleri' : 'Faction Percentages'}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                  {tr
                    ? 'Barlarda daima sayı göster (varsayılan: gizli)'
                    : 'Always show % on bars (default: hidden)'}
                </div>
              </div>
              <MilitaryToggle value={showFactionPercentages} onChange={setShowFactionPercentages} />
            </div>
          </div>

        </div>

        {/* Footer — Main Menu button (in-game only) */}
        {onMainMenu && (
          <div
            className="px-5 pb-5 pt-0"
            style={{ borderTop: '1px solid hsl(var(--game-election) / 0.18)' }}
          >
            <button
              onClick={handleMainMenu}
              className="w-full py-2.5 text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2"
              style={{
                border: '1px solid hsl(var(--game-danger) / 0.45)',
                borderRadius: 2,
                color: 'hsl(var(--game-danger-light))',
                background: 'hsl(var(--game-danger) / 0.07)',
                marginTop: 16,
              }}
            >
              <GameIcon name="home" size={12} />
              {tr ? 'Ana Menü' : 'Main Menu'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
