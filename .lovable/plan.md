

# 🎴 "Taht" - Reigns Tarzı Politik Strateji Oyunu

Türkiye'nin son 20 yılından esinlenen, satirik bir kart kaydırma karar oyunu. Oyuncu "corrupt bir yönetici" olarak 5 farklı güç grubunu dengede tutmaya çalışır.

---

## 🎮 Ana Oyun Ekranı

- **Karakter kartı**: Ekranın ortasında karikatür/çizgi tarzında bir danışman/olay kartı görünür
- **Sola/sağa kaydırma**: Reigns mekaniğiyle kart sağa (kabul) veya sola (red) kaydırılır
- **Karar metni**: Kartın altında iki seçenek gösterilir (sol ve sağ)
- **Animasyonlu geçişler**: Kart kaydırıldığında akıcı bir animasyonla kaybolur, yeni kart gelir

## 📊 5 Güç Dengesi Çubuğu (Üst Bar)

Her biri 0-100 arası değişen 5 güç çubuğu ekranın üstünde ikonlarla gösterilir:
1. **🏛️ Halk** - Vatandaş desteği
2. **💰 Yatırımcılar** - Ekonomik güçler, iş dünyası
3. **🔫 Mafya** - Yeraltı dünyası, kirli işler
4. **📿 Tarikat** - Dini yapılanmalar, cemaat gücü
5. **⚔️ Ordu/Güvenlik** - Askeri ve güvenlik güçleri

Kaydırma sırasında hangi çubukların etkileneceği hafif bir ipucu animasyonuyla gösterilir.

## 🃏 50+ Olay Kartı Sistemi

Kartlar kategorilere ayrılır ve rastgele sırayla gelir:
- **Ekonomi**: Döviz krizi, mega proje teklifleri, borç yapılandırma
- **Siyasi entrika**: Şüpheli ölümler, kaset skandalları, darbe girişimi
- **Tarikat/Cemaat**: Gizli yapılanma, kadrolaşma, tasfiye operasyonları
- **Dış politika**: Savaş kararları, mülteci dalgası, uluslararası yaptırımlar
- **Halk olayları**: Protestolar, medya baskısı, sosyal medya sansürü
- **Mafya**: Kara para, silah ticareti, itirafçı ifadeleri

Her kart bir danışman karakteri tarafından sunulur (general, imam, iş adamı, mafya babası, halk temsilcisi vb.)

## 💀 Oyun Sonu Mekanikleri

- Herhangi bir güç çubuğu **0'a düşerse** veya **100'e çıkarsa** oyun biter
- Her biri için farklı "devrilme" senaryosu gösterilir:
  - Halk 0 → Devrim / Halk ayaklanması
  - Mafya 0 → Suikast
  - Tarikat 100 → Tarikat devleti ele geçirir
  - Ordu 0 → Askeri darbe
  - Yatırımcılar 0 → Ekonomik çöküş
- **Skor**: Kaç tur (yıl) hayatta kaldığınız gösterilir
- **Yeniden başla** butonu

## 🏠 Başlangıç Ekranı

- Oyun adı ve karikatür tarzı bir "taht" illüstrasyonu (CSS/SVG)
- "Oyuna Başla" butonu
- Kısa açıklama: "Gücü dengede tut, tahtını koru."
- En yüksek skor gösterimi (localStorage)

## 📱 Mobil Uyumlu Tasarım

- Touch swipe desteği ile kart kaydırma
- Mobil öncelikli responsive tasarım
- Karikatür tarzı CSS illüstrasyonlar ve emoji ikonlar

---

**Not**: Tüm veriler frontend'de tutulacak (backend gerekmez). Kartlar ve senaryolar JSON formatında kod içinde saklanır. Yüksek skor localStorage'da tutulur.

