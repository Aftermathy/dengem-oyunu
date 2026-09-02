# App Review Notes — 1.0.6 (10)

App Store Connect → Version 1.0.6 → App Review Information → Notes.
Bu metni olduğu gibi yapıştır. İngilizce, çünkü inceleme İngilizce yürüyor.

---

No account is required to play. Sign in with Apple is optional and used only
for the leaderboard; the in-app purchase is optional as well.

The App Tracking Transparency prompt appears on first launch, once the app
becomes active.

Interstitial ads are shown after a game ends. By design no ad is shown during
the first game — the first one appears at the end of the second game.

Card descriptions have been revised in this version.

---

## Ekteki alanlar

- **Demo hesabı:** gerekmiyor, "Sign-in required" işaretini **kapalı** bırak.
- **Attachment:** geçen turdaki demo videosu duruyorsa eklemekte zarar yok.
  Zorunlu değil.
- **Contact:** aynı e-posta ve telefon; değişmedi.

## Bu sürümde inceleme açısından değişen ne var

- Reklamların hiç gösterilmediği hata giderildi — 1.0.5'te `AdMob.initialize()`
  yanlış sırada çağrılıyordu, `_adsReady` hep `false` kalıyordu. ATT kapısı
  (`waitForActive()`) değişmedi; 1.0.4 (6) reddini doğuran koşul aynen kapalı.
- Kart metinleri revize edildi; doğrudan geçen gerçek kurum, marka ve olay
  adları kaldırıldı.
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
