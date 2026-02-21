
# Bribe Tutorial Mekanigi

Herhangi bir guc cubugu ilk kez kritik seviyeye (20 veya alti) dustugunde, oyun duracak ve bir tutorial popup/dialog gosterecek. Oyuncu 1M harcayarak o faction'in reputasyonunu +10 duzeltebilecek. Bu tutorial oyun basina sadece 1 kez tetiklenir.

---

## Akis

1. Oyuncu kart kaydirir, bir guc cubugu 20 veya altina duser
2. Oyun durur, ekranda bir overlay/dialog belirir
3. Dialog kritik olan faction'in resmini, uyari metnini ve "1M ver, +10 rep kazan" butonunu gosterir
4. Oyuncu butona basarsa: 1M kesilir, +10 rep eklenir, tutorial kapanir, oyun devam eder
5. Oyuncu "Gecis" derse: tutorial kapanir, oyun devam eder (bribe yapilmaz)
6. Tutorial bir daha gosterilemez (o oyun icinde)

## Teknik Detaylar

### useGame.ts degisiklikleri
- Yeni state: `tutorialShown: boolean` (default false) ve `tutorialFaction: PowerType | null`
- `swipe` fonksiyonunda, game over kontrolunden sonra, eger `tutorialShown === false` ve herhangi bir guc <= 20 ise:
  - `tutorialFaction` o guce set edilir
  - Oyun bekler (kart gecisi yapilmaz ta ki tutorial kapanana kadar)
- Yeni fonksiyon: `completeTutorialBribe()` - 1M keser, +10 rep ekler, `tutorialShown = true`, `tutorialFaction = null` set eder, sonra normal kart gecisini yapar
- Yeni fonksiyon: `skipTutorial()` - `tutorialShown = true`, `tutorialFaction = null`, kart gecisi yapar
- `startGame` icerisinde `tutorialShown` ve `tutorialFaction` sifirlanir

### Yeni component: BribeTutorial.tsx
- Bir overlay/modal olarak gosterilir
- Kritik faction'in resmi ve adi
- TR/EN destekli komik uyari metni (ornegin: "Halk senden nefret ediyor! Bir zarfla gulleri duzeltmek ister misin?")
- Iki buton: "1M ver, +10 rep" ve "Gecis / Skip"
- Animasyonlu giris (fade-in + scale)

### Index.tsx degisiklikleri
- `useGame` hook'undan `tutorialFaction`, `completeTutorialBribe`, `skipTutorial` alinir
- `tutorialFaction` varsa `BribeTutorial` componenti render edilir

### LanguageContext.tsx degisiklikleri
- Tutorial icin TR/EN ceviri keyleri eklenir:
  - `tutorial.title`: "Tehlike!" / "Danger!"
  - `tutorial.description`: Faction'a ozel komik metin
  - `tutorial.bribe`: "1M ver, +10 rep" / "Pay 1M, +10 rep"
  - `tutorial.skip`: "Gecis" / "Skip"
  - `tutorial.hint`: "Faction basina tiklayarak da rusvet verebilirsin!" / "You can also bribe by tapping faction heads!"
