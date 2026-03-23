import { useState } from 'react';
import { EmojiImg } from '@/components/EmojiImg';
import type { AvatarDef } from '@/lib/userProfile';

interface AvatarImgProps {
  avatar: AvatarDef;
  /** Outer circle size in px */
  size: number;
  className?: string;
}

/**
 * Renders a PNG avatar image if `avatar.imageId` is set,
 * otherwise falls back to the emoji on the coloured circle.
 */
export function AvatarImg({ avatar, size, className = '' }: AvatarImgProps) {
  const [imgError, setImgError] = useState(false);

  if (avatar.imageId && !imgError) {
    return (
      <img
        src={`/assets/avatars/${avatar.imageId}.png`}
        alt={avatar.nameEN}
        onError={() => setImgError(true)}
        className={className}
        style={{ width: size, height: size, objectFit: 'cover', borderRadius: '50%', display: 'block' }}
      />
    );
  }

  return <EmojiImg emoji={avatar.emoji} size={Math.round(size * 0.57)} />;
}
