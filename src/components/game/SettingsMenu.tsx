import { useState } from 'react';
import { GameIcon } from '@/components/GameIcon';
import { playClickSound } from '@/hooks/useSound';
import { SettingsModal } from '@/components/game/SettingsModal';

interface SettingsMenuProps {
  onMainMenu: () => void;
}

export function SettingsMenu({ onMainMenu }: SettingsMenuProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => { playClickSound(); setShowModal(true); }}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-muted/60 border border-border/50 text-muted-foreground hover:text-foreground transition-colors active:scale-90"
      >
        <GameIcon name="settings" size={16} />
      </button>

      {showModal && (
        <SettingsModal
          onClose={() => setShowModal(false)}
          onMainMenu={onMainMenu}
        />
      )}
    </>
  );
}
