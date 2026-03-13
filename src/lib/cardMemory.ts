import { STORAGE_KEYS } from '@/constants/storage';

export function getSeenCards(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SEEN_CARDS);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as number[]);
  } catch { return new Set(); }
}

export function markCardSeen(id: number): void {
  try {
    const seen = getSeenCards();
    seen.add(id);
    localStorage.setItem(STORAGE_KEYS.SEEN_CARDS, JSON.stringify([...seen]));
  } catch {}
}

export function isCardSeen(id: number): boolean {
  return getSeenCards().has(id);
}

export function hasSeenAnyCard(): boolean {
  return getSeenCards().size > 0;
}

export function hasShownKnowledgeAnnouncement(): boolean {
  return localStorage.getItem(STORAGE_KEYS.CARDS_KNOWLEDGE_SHOWN) === 'true';
}

export function markKnowledgeAnnouncementShown(): void {
  localStorage.setItem(STORAGE_KEYS.CARDS_KNOWLEDGE_SHOWN, 'true');
}
