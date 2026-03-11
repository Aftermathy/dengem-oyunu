/**
 * EmojiImg — renders emoji characters as cross-platform PNG images
 * using the Twemoji CDN. Works in WKWebView / Capacitor where
 * native emoji fonts may not render.
 */

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
      // Skip variation selector U+FE0F for twemoji URL compatibility
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
      style={{ width: size, height: size }}
      draggable={false}
      loading="lazy"
    />
  );
}
