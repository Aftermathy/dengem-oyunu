# S3 — RLS (Row Level Security) Güvenlik Notları

> **Durum:** Bu döküman, Apple Auth entegrasyonu öncesi geçici RLS politikalarını ve auth sonrası uygulanması gereken **hedef politikaları** belgelemektedir.

---

## 🔴 Mevcut Durum (Geçici — Auth Öncesi)

Şu anda `profiles` ve `leaderboard_scores` tablolarına **anonim (anon key)** erişimle yazma izni verilmiştir. Bu, Apple Auth entegrasyonu tamamlanana kadar geçerli bir geçici çözümdür.

### profiles
| İşlem   | Politika Adı                  | Kural              |
|---------|-------------------------------|---------------------|
| SELECT  | Profiles viewable by everyone | `USING (true)` ✅   |
| INSERT  | Allow public profile inserts  | `WITH CHECK (true)` ⚠️ |
| UPDATE  | Allow public profile updates  | `USING (true)` ⚠️   |
| DELETE  | —                             | ❌ Engelli           |

### leaderboard_scores
| İşlem   | Politika Adı                  | Kural              |
|---------|-------------------------------|---------------------|
| SELECT  | Scores viewable by everyone   | `USING (true)` ✅   |
| INSERT  | Allow public score inserts    | `WITH CHECK (true)` ⚠️ |
| UPDATE  | —                             | ❌ Engelli           |
| DELETE  | —                             | ❌ Engelli           |

### game_events
| İşlem   | Politika Adı                      | Kural              |
|---------|-----------------------------------|---------------------|
| SELECT  | Only service role can read events | `USING (false)` ✅  |
| INSERT  | Anyone can insert game events     | `WITH CHECK (true)` |

---

## 🟢 Hedef Durum (Apple Auth Sonrası)

Apple Auth entegre edildikten sonra aşağıdaki SQL çalıştırılacaktır:

```sql
-- ═══ profiles ═══

-- Herkes okuyabilir
-- (Mevcut SELECT politikası korunur)

-- Sadece kendi profilini ekleyebilir
DROP POLICY IF EXISTS "Allow public profile inserts" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Sadece kendi profilini güncelleyebilir
DROP POLICY IF EXISTS "Allow public profile updates" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);


-- ═══ leaderboard_scores ═══

-- Herkes okuyabilir
-- (Mevcut SELECT politikası korunur)

-- Sadece kendi skorunu ekleyebilir
DROP POLICY IF EXISTS "Allow public score inserts" ON public.leaderboard_scores;
CREATE POLICY "Users can insert own scores"
  ON public.leaderboard_scores FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Kendi eski skorlarını güncelleyebilir (opsiyonel)
CREATE POLICY "Users can update own scores"
  ON public.leaderboard_scores FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
```

---

## 📝 Notlar

1. **Device UUID → Auth UID Göçü:** Şu anda `user_id` alanında cihaz UUID'si kullanılmaktadır. Apple Auth sonrası, mevcut kayıtların `user_id` değerleri gerçek `auth.uid()` ile güncellenecektir.

2. **Hassas Veri:** `profiles` tablosunda PII (kişisel bilgi) bulunmamaktadır — sadece nickname ve avatar ID. Apple ID email'i bu tabloda saklanmayacaktır.

3. **Rate Limiting:** Auth sonrası, INSERT işlemleri `auth.uid()` ile sınırlandırılacağından spam riski minimize olacaktır.

4. **game_events:** Bu tablo zaten güvenlidir — INSERT herkese açık ama SELECT sadece service role'e izin verir.
