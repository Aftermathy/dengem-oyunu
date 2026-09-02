# App Review Notes — 1.0.6 (10)

App Store Connect → Version 1.0.6 → App Review Information → Notes.
Bu metni olduğu gibi yapıştır. İngilizce, çünkü inceleme İngilizce yürüyor.

---

No account is required to play. Sign in with Apple is optional and used only
for the online leaderboard; the full game works without it. The in-app
purchase (one non-consumable content pack) is also optional.

ATT PROMPT
The App Tracking Transparency prompt appears on first launch, as soon as the
app becomes active. If it does not appear on the test device, please check
Settings → Privacy & Security → Tracking → "Allow Apps to Request to Track"
is enabled, and that the app has not been launched before on that device.

INTERSTITIAL ADS
Ads are shown after a game ends. By design, no ad is shown during the very
first game — the first interstitial appears at the end of the SECOND game.
To see one, please finish two short games. A game can be ended quickly by
letting any one of the five power bars run out.

CONTENT
The app is political satire set in an invented country. All factions,
institutions, parties and place names in the game are fictional. The themes
are generic to the genre — elections, corruption, patronage, media pressure.
The app makes no factual claims about any real person or organisation and
does not advocate for or against any real political position.

---

## Ekteki alanlar

- **Demo hesabı:** gerekmiyor, "Sign-in required" işaretini **kapalı** bırak.
- **Attachment:** geçen turdaki demo videosu duruyorsa eklemekte zarar yok;
  1.0.4 (6) reddinin ikinci gerekçesi videonun olmamasıydı. Zorunlu değil.
- **Contact:** aynı e-posta ve telefon; değişmedi.

## Bu sürümde inceleme açısından değişen ne var

- Reklamların hiç gösterilmediği hata giderildi — 1.0.5'te `AdMob.initialize()`
  yanlış sırada çağrılıyordu, `_adsReady` hep `false` kalıyordu. ATT kapısı
  (`waitForActive()`) değişmedi; 1.0.4 (6) reddini doğuran koşul aynen kapalı.
- Kart metinlerinden doğrudan geçen gerçek kurum, marka ve olay adları
  kaldırıldı. Bu, 1.1.1 tarafındaki yüzeyi küçültüyor.
- Zafer ekranı sabit görsel yerine 8 saniyelik döngü video.
- Satın alma ekranındaki hizalama hatası düzeltildi.

## What's New (mağaza metni)

Mağaza kaydında henüz Türkçe yerelleştirme yok — **kullanılacak metin İngilizce
olan.** Türkçesi, ileride TR yerelleştirmesi eklenirse diye aşağıda duruyor.

**EN — kullanılacak olan:**

> • The victory screen is now animated.
> • Card texts revised throughout.
> • Fixed an alignment issue on the purchase screen.
> • Stability fixes.

Reklam düzeltmesi mağaza metninde ayrıca anılmıyor — kullanıcıya "artık reklam
geliyor" diye duyurulacak bir şey değil, "stability fixes" içinde. İncelemeciye
ise yukarıdaki notta açıkça yazılı; ayrım kasıtlı.

**TR — şimdilik kullanılmıyor:**

> • Zafer ekranı artık hareketli.
> • Kart metinleri baştan sona gözden geçirildi.
> • Satın alma ekranındaki hizalama sorunu giderildi.
> • Kararlılık düzeltmeleri.
