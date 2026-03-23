# Sound Assets

Place MP3 files here. Vite serves them as-is; `npx cap sync ios` copies them
to `ios/App/App/public/sounds/` so Capacitor iOS picks them up.

## Required files

| File                | Used for                          | Suggested length |
|---------------------|-----------------------------------|-----------------|
| click.mp3           | Button / UI tap                   | ~30ms           |
| swipe_right.mp3     | Card swipe right                  | ~80ms           |
| swipe_left.mp3      | Card swipe left                   | ~80ms           |
| game_over.mp3       | Player death / game over screen   | ~600ms          |
| bribe.mp3           | Bribe action                      | ~120ms          |
| warning.mp3         | Faction bar danger zone           | ~300ms          |
| war_start.mp3       | New game drum intro               | ~500ms          |
| election_card.mp3   | Election card appears             | ~200ms          |
| ai_card.mp3         | AI / special card                 | ~400ms          |
| special_power.mp3   | OHAL / special ability activated  | ~350ms          |
| reroll.mp3          | Skill tree reroll                 | ~150ms          |
| budget_warning.mp3  | Low treasury alert                | ~150ms          |

## Tips
- Export at 44.1 kHz, mono, 128 kbps — keeps bundle size low
- Normalize to -12 dBFS so all sounds feel balanced
- Howler falls back gracefully if a file is missing (logs warning, no crash)
