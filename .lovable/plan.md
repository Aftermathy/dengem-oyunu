
# Secim Ekrani Animasyonlari

Secim mini-game ekranina 6 farkli animasyon katmani eklenecek. Tum animasyonlar pure CSS ile yapilacak, ek kutuphane gerekmeyecek.

---

## Eklenecek Animasyonlar

### 1. Oy Barlarina Alev Efekti
- Barlarin ustune yukselen alev parcaciklari (CSS pseudo-element ile)
- Barin doldugu kismin ustunde titreyen turuncu/kirmizi glow
- Bar degistiginde parlama (flash) efekti

### 2. Kart Seciminde Pariltili Giris
- Kartlar sahneye gelirken sirayla (staggered) asagidan yukari kayarak ve hafif buyuyerek girecek
- Her karta hover/tap yapildiginda kenarlarinda altin rengi parlayan bir shimmer efekti
- Kart secildiginde parlayarak kaybolma animasyonu

### 3. Sonuc Ekrani - Zafer Konfetisi
- Kazanildiginda ekranin ustunden dusen renkli konfeti parcaciklari (CSS keyframes ile 15-20 parcacik)
- Oy yuzdeleri sayac animasyonuyla 0'dan yukari sayacak
- Baslik text'i pulse + glow efektiyle vurgulanacak

### 4. Sonuc Ekrani - Kaybetme Yikim Animasyonu
- Kaybedildiginde ekran titreme (shake) efekti
- Kirmizi kan/catirdama overlay'i
- Baslik text'i titreyerek gorunecek (glitch efekti)

### 5. Intro Ekrani Guclendirilmis Efektler
- Ates emojisi etrafinda donen alev halkasi
- Baslik text'i harf harf ortaya cikma (typewriter degil, fade-in staggered)
- Arka planda yukari dogru hareket eden kor parcaciklari

### 6. AI Turu Dramatik Efektler
- AI kart oynayinca ekran kenarlarinda kisa sureli kirmizi flash
- AI kartinin sahneye "carpmasi" efekti (scale bounce)
- Muhalefet bari artarken kirmizi glow pulse

---

## Teknik Detaylar

### Degisecek Dosyalar

**`src/index.css`** - Yeni keyframe animasyonlari eklenecek:
- `@keyframes flame-flicker` - Alev titremesi
- `@keyframes ember-rise` - Kor parcaciklari yukari hareketi
- `@keyframes confetti-fall` - Konfeti dususu (her parcacik farkli delay)
- `@keyframes card-enter` - Kart giris animasyonu
- `@keyframes card-shimmer` - Kart pariltisi
- `@keyframes shake` - Ekran titreme
- `@keyframes glitch` - Text glitch efekti
- `@keyframes vote-count` - Sayi sayma efekti icin
- `@keyframes red-flash` - AI turu kirmizi flash
- `@keyframes ember-particle` - Arka plan parcaciklari

**`src/components/game/ElectionScreen.tsx`** - UI guncellemeleri:
- Oy barlarinin ustune `::after` pseudo-element icin wrapper div'ler + alev class'lari
- Kart butonlarina staggered giris animasyonu (`animation-delay` ile)
- Sonuc ekraninda kazanma/kaybetme durumuna gore farkli animasyon container'lari
- Konfeti icin 15-20 adet absolute positioned `<span>` elementi
- AI turunda kirmizi flash overlay
- Intro ekraninda kor parcaciklari icin ek div'ler
- Oy yuzdeleri icin animasyonlu sayac (useEffect + requestAnimationFrame ile 0'dan hedefe sayma)

### Animasyon Raporu (Ozet)

| Alan | Animasyon | Yontem |
|------|-----------|--------|
| Oy Barlari | Alev titremesi + glow | CSS gradient + flicker keyframe |
| Oy Barlari | Degisim flash'i | CSS transition + box-shadow pulse |
| Kartlar | Staggered giris | translateY + opacity + delay |
| Kartlar | Shimmer hover | Linear-gradient sliding |
| Kartlar | Secim parlamasi | Scale + opacity out |
| Sonuc (Zafer) | Konfeti | 15-20 span + confetti-fall keyframe |
| Sonuc (Zafer) | Sayi sayaci | requestAnimationFrame JS |
| Sonuc (Zafer) | Baslik glow | Text-shadow pulse |
| Sonuc (Kayip) | Ekran shake | Transform translate shake |
| Sonuc (Kayip) | Glitch text | Clip-path + color shift |
| Sonuc (Kayip) | Kirmizi overlay | Opacity flash |
| Intro | Kor parcaciklari | Absolute spans + rise keyframe |
| Intro | Alev halkasi | Rotating border-gradient |
| AI Turu | Kirmizi flash | Border flash overlay |
| AI Turu | Kart bounce | Scale overshoot |
| AI Turu | Bar glow | Box-shadow pulse |

Toplam **16 ayri animasyon efekti**, tamami CSS keyframes + minimal JS (sadece sayi sayaci icin).
