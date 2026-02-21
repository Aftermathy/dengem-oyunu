
# Launder Mekaniği Fix + Rep Gosterge Animasyonu

## 3 Ana Degisiklik

### 1. Launder game-over bug fix
Simdi launder yapildiginda zumre reputasyonu 0'a dusebiliyor ve oyun bitmiyor cunku `checkGameOver` cagirilmiyor. Launder fonksiyonunda rep degisikliklerinden sonra game-over kontrolu eklenecek.

### 2. Launder maliyeti ve miktari guncelleme
- Launder ucreti: 5B yerine **50B** (25B aklama + 25B secilen zumreye)
- Laundered miktar: 10B yerine **25B**
- Secilen zumreye giden para: aciklamada 25B olarak gosterilecek
- `canLaunder` kontrolu `money >= 50` olacak

### 3. Power bar icinde rep degisim animasyonu
Her zumrenin barina kart swipe veya bribe/launder yapildiginda "+5" veya "-10" gibi bir sayi fade-in/fade-out seklinde gosterilecek.

---

## Teknik Detaylar

### `src/hooks/useGame.ts`
- `LAUNDER_COST` = 50, `LAUNDER_AMOUNT` = 25
- `launder` fonksiyonunda `setPower` sonrasi yeni power state'i hesaplayip `checkGameOver` cagir, game over ise `setPhase('gameover')` yap
- Launder aciklama metninde "25B secilen zumreye" bilgisi

### `src/components/game/LaunderBar.tsx`
- Button metnini `-50B` olarak guncelle
- Modal aciklamasinda "25B aklanir, 25B secilen zumreye verilir" bilgisi

### `src/components/game/PowerBars.tsx`
- `previousPower` state'i ekle (onceki power degerleri)
- `useEffect` ile `power` degistiginde fark hesapla
- Her bar icinde fark varsa `+X` veya `-X` yazisi goster
- CSS animasyonu: fade-in 0.3s, 1s bekle, fade-out 0.5s (toplam ~1.8s)
- Font: italic, light weight, beyaz/yesil/kirmizi renk

### `src/index.css`
- `@keyframes rep-change-fade` animasyonu ekle: opacity 0 -> 1 -> 1 -> 0 seklinde
- `.rep-change-indicator` class'i: absolute, centered, pointer-events-none
