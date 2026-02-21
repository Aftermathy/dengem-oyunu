

# 53 Yeni Kart Ekleme Plani

Mevcut 56 karta ek olarak, onceki mesajda onaylanan 50 kart + 3 yeni kart (Davos cikisi, Nufus planlamasi, Ben Ekonomistim) eklenecek. Toplam kart sayisi 109'a cikacak.

## Eklenecek 3 Ozel Kart

**ID 57 - Davos Cikisi (Dis Politika)**
- Karakter: Ekonomi Zirvesi Moderatoru (🎙️)
- Aciklama: "Efendim, uluslararasi ekonomi zirvesinde panele cikacaksiniz. Moderator sizi sikistirabilir."
- Sol: "Masayi yumrukla, 'Bir daha gelmem!' de" -> ordu +10, halk +5, yatirimcilar -15, para: -5
- Sag: "Diplomatik kal, gulumse" -> yatirimcilar +10, halk -5, para: +3

**ID 58 - Nufus Planlamasi (Halk)**
- Karakter: Aile Bakani (👶)
- Aciklama: "Baskanim, nufus azaliyor. Vatandaslara en az 3 evlat hedefi koyalim mi?"
- Sol: "3 degil, 5 olsun!" -> tarikat +15, halk -10, yatirimcilar -5, para: -8
- Sag: "Karismayin ozel hayata" -> halk +10, tarikat -10, para: 0

**ID 59 - Ben Ekonomistim (Ekonomi)**
- Karakter: Baskan'in Kendisi (👑)
- Aciklama: "Faizi artirmak enflasyonu arttirir! Dusurursen enflasyon duser. Ben ekonomistim, bunu benden iyi kimse bilmez."
- Sol: "Faizi sifira indir, ben bilirim!" -> yatirimcilar -20, halk -10, mafya +5, para: -15
- Sag: "Belki de uzmanlara soralim..." -> yatirimcilar +15, halk +5, tarikat -5, para: +5

## Onceki Mesajda Onaylanan 50 Kart (ID 60-109)

Onceki mesajdaki 50 kart aynen eklenecek (KKM, 128 Milyar, Deprem vergisi, Referandum, Maden facialari, Kayyum atamalari, vb.)

## Teknik Detaylar

- **Degisecek dosyalar**: `src/data/cards.ts` ve `src/data/cards-en.ts`
- Her iki dosyaya da 53 yeni kart objesi eklenecek
- Mevcut 56 kart aynen korunacak
- Tum kartlar satirik/alayli dil kullanacak (direkt isim/yer yok)
- ID'ler 57'den 109'a kadar siralanacak

