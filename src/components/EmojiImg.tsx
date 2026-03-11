/**
 * EmojiImg — renders emoji characters as cross-platform PNG images
 * using the Twemoji CDN. Works in WKWebView / Capacitor where
 * native emoji fonts may not render.
 */

import React from 'react';

interface EmojiImgProps {
  emoji: string;
  size?: number;
  className?: string;
  alt?: string;
}

function emojiToCodepoint(emoji: string): string {
  const codepoints: string[] = [];
  for (const char of emoji) {
    const cp = char.codePointAt(0);
    if (cp !== undefined && cp !== 0xfe0f) {
      codepoints.push(cp.toString(16));
    }
  }
  return codepoints.join('-');
}

export function EmojiImg({ emoji, size = 24, className = '', alt }: EmojiImgProps) {
  const codepoint = emojiToCodepoint(emoji);
  const src = `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${codepoint}.png`;

  return (
    <img
      src={src}
      alt={alt || emoji}
      width={size}
      height={size}
      className={`inline-block ${className}`}
      style={{ width: size, height: size, verticalAlign: 'middle' }}
      draggable={false}
      loading="lazy"
    />
  );
}

// Regex matching most emoji characters
const EMOJI_RE = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;

/**
 * Renders a text string replacing any emoji characters with EmojiImg components.
 * Usage: <EmojiText text="Hello 🔥 World" size={14} />
 */
export function EmojiText({ text, size = 14, className = '' }: { text: string; size?: number; className?: string }) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(EMOJI_RE.source, 'gu');

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<EmojiImg key={match.index} emoji={match[0]} size={size} />);
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <span className={className}>{parts}</span>;
}
