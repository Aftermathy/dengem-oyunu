# I MUST STAY — Android / Google Play Yayın Kontrol Listesi (Sahibin Elle Yapacakları)

Bu liste beş araştırma kolunun birleştirilmiş halidir. Çelişen bilgiler ayıklandı; hangi seçeneğin neden seçildiği ilgili adımın altında **Karar** başlığıyla yazılıdır. Numaralandırma bağlayıcıdır: bir adım kendinden önceki adımın çıktısı olmadan yapılamıyorsa bu açıkça belirtilmiştir.

---

## 1. Bugün İlk İş: Bekleme Saati İşleyen Adımlar

Bu dört madde gün içinde başka hiçbir şey yapmadan önce başlatılmalıdır, çünkü hepsinde senin kontrolünde olmayan bir bekleme süresi vardır. Bunları başlattıktan sonra Bölüm 2'ye geçip beklerken çalışmaya devam et.

**B1. Google Play geliştirici hesabını aç ve kimlik doğrulamasını başlat. [BEKLEME: 1-3 gün, yoğunlukta 1-2 haftaya çıkabiliyor] [GERİ DÖNÜŞÜ YOK: hesap türü]**
- Yer: https://play.google.com/console/signup
- 25 ABD doları tek seferlik ücret, iade edilmez.
- Hesap türü ekranında karar ver, sonra kimlik belgesi, yasal ad, adres ve telefon doğrulamasını aynı oturumda tamamla.
- Google Payments profilindeki yasal ad ile kimlik belgesindeki ad **birebir aynı** olmalı; uyuşmazsa doğrulama reddedilir ve süreç baştan başlar.
- Mağaza sayfasında herkese görünecek geliştirici iletişim e-postasını bilinçli seç.

> **Karar — hesap türü: Kişisel.** Kollar arasında bu konuda çelişki yoktu ama tercih açık bırakılmıştı. Kuruluş hesabı 12 testçi / 14 gün kuralından muaftır, ancak D-U-N-S numarası zorunludur ve D-U-N-S almak 30 güne kadar sürer. 30 günlük bekleme, kaçınmaya çalıştığın 14 + 7 günlük beklemeden uzundur. **Tek istisna:** kayıtlı bir şirketin var ve D-U-N-S numarası ELİNDE HAZIRSA kuruluş seç, o zaman takvimden yaklaşık üç hafta silersin. Hazır D-U-N-S yoksa kişisel seç. Hesap türünü sonradan değiştirmek desteklenmiyor.

**B2. Ödeme profilini (merchant account) oluştur, vergi ve banka bilgilerini gir. [BEKLEME: banka doğrulaması birkaç gün] [GERİ DÖNÜŞÜ YOK: ülke seçimi]**
- Yer: Play Console → Settings → Payments profile (veya Monetize → Monetization setup)
- Ödeme profilinin ülkesi sonradan değiştirilemez. "Ortadoğu paketi" satın alması bu profil olmadan hiç oluşturulamaz.

**B3. Android Studio indirmesini şimdi başlat, arka planda insin. [BEKLEME: ~1,5 GB indirme]**
- Yer: https://developer.android.com/studio → macOS "Mac with Apple chip" .dmg
- Kurulum sihirbazında "Standard" seçeneğiyle ilerle. Ayrıca Java kurmana gerek yok, Android Studio kendi JDK'sını (JDK 21) getirir.

**B4. Testçi toplamaya bugün başla. [BEKLEME: insan toplamak 1-2 gün, sonra 14 takvim günü]**
- 12 kişi asgari, güvenlik payıyla **15-16 kişi** hedefle.
- Kişilerin Gmail adreslerini topla. Henüz Play'e girmiyorsun, sadece listeyi hazırlıyorsun; 14 günlük sayaç kapalı test sürümü yayına alınıp kişiler uygulamayı kurduğunda başlayacak (Adım 13).
- Herkese şunu söyle: "14 gün boyunca testten çıkma, uygulamayı silme, ara ara aç ve oyna." Sayaç sessizce sıfırlanır.

---

## 2. Sırayla Yapılacaklar

### Blok A — Claude'un derlemeyi yapabilmesi için gereken girdiler
*(Hesap doğrulaması beklenirken yapılır. Bu bloğun tamamı bitmeden Claude AAB üretemez.)*

**1. Android Studio'yu kur.** (B3'teki indirme bitince.)

**2. SDK bileşenlerini kur ve SDK yolunu Claude'a yaz.**
- Yer: Android Studio → Settings (⌘,) → Languages & Frameworks → Android SDK
- SDK Platforms sekmesi: **Android 16.0 (API 36)**
- SDK Tools sekmesi: Android SDK Build-Tools, Android SDK Platform-Tools, **Android SDK Command-line Tools (latest)**
- Apply'a bas, ekranda görünen "Android SDK Location" yolunu (genelde `/Users/denizerdogan/Library/Android/sdk`) Claude'a ilet.
- Neden: Play, 31 Ağustos 2026'dan beri yeni gönderimlerde API 36 hedefi şart koşuyor; platform kurulu değilse derleme hiç başlamaz. Command-line Tools olmadan AAB terminalden üretilemez.

**3. AdMob'da Android için AYRI uygulama oluştur, App ID'yi Claude'a ver.**
- Yer: admob.google.com → Apps → Add app → Platform: **Android**
- "Is your app listed on a supported app store?" sorusuna **No** de. (Play'de henüz yok; "Yes" deyip aramaya kalkarsan ya bulamazsın ya yanlış uygulamaya bağlarsın.)
- Uygulama adı: I Must Stay
- Çıkan `ca-app-pub-5942367057795211~XXXXXXXXXX` biçimindeki App ID'yi Claude'a ilet.
- Neden: iOS App ID'si (`~4387951075`) Android'de çalışmaz. Bu kimlik AndroidManifest.xml'e yazılır ve eksikse uygulama açılışta çöker.

**4. Aynı Android uygulaması altında yeni bir Interstitial reklam birimi oluştur, ID'yi Claude'a ver.**
- Yer: AdMob → Apps → I Must Stay (Android) → Ad units → Add ad unit → Interstitial
- Ad: "Android Interstitial - tur sonu"
- Çıkan `ca-app-pub-5942367057795211/XXXXXXXXXX` kimliğini Claude'a ilet.
- Ayrıca uygulamanın reklam içerik derecesini oyunun 18+ beyanıyla tutarlı ayarla.

**5. Yükleme (upload) anahtarını KENDİ ELİNLE üret. [GERİ DÖNÜŞÜ YOK: kaybı geri alınamaz]**
```
/Applications/Android\ Studio.app/Contents/jbr/Contents/Home/bin/keytool \
  -genkeypair -v -keystore ~/Documents/imuststay-upload.jks \
  -alias imuststay-upload -keyalg RSA -keysize 2048 -validity 10000 -storetype JKS
```
- Sorulan parolayı **sen belirle ve kimseye, Claude'a da, yazma.**

> **Karar — anahtarı kim üretecek: Sen.** Kollardan biri keystore'u Claude'un üretmesini varsayıyordu, diğeri sahibin üretmesini istiyordu. Sahibin üretmesi seçildi: imza anahtarının parolası bir sohbet oturumundan veya bir dosyadan geçmemelidir. Claude derleme dosyasını parolayı ortam değişkeninden okuyacak şekilde kuracak; parolayı hiç görmeyecek.

**6. Keystore'u kalıcı olarak güvene al ve parmak izlerini kaydet.**
- `.jks` dosyasını 1Password / iCloud Keychain gibi bir kasaya yükle, ayrıca harici bir diske veya ikinci bir buluta kopyala.
- Parolayı ve alias'ı aynı kasada **ayrı bir kayıt** olarak sakla.
- Parmak izlerini al ve kasaya not et: `keytool -list -v -keystore ~/Documents/imuststay-upload.jks` çıktısındaki SHA-1 ve SHA-256.
- Claude'a yalnızca **dosya yolunu ve alias adını** ilet.
- **Dosyayı proje klasörünün içine KOYMA.** Bu depoda `.env` dosyasının zaten git ile takip edildiği görüldü; `.jks` de aynı yoldan GitHub'a giderse anahtarı yakmış olursun.

> Bu noktada Claude `android/` klasörünü kurup imzalı `app-release.aab` dosyasını üretir. Detaylar Bölüm 4'te.

---

### Blok B — Play kaydı ve ilk yükleme
*(B1'deki kimlik doğrulaması ONAYLANDIKTAN sonra yapılabilir.)*

**7. Play Console'da uygulamayı oluştur. [GERİ DÖNÜŞÜ YOK: "Ücretsiz" seçimi]**
- Yer: Play Console → All apps → Create app
- Ad: **I Must Stay** (App Store'daki mağaza adıyla aynı)
- App or game: **Game** · Free or paid: **Free** · Varsayılan dil: Türkçe veya İngilizce
- Politika ve ABD ihracat yasası onay kutularını işaretle.
- Ücretsizden ücretliye geçiş **asla** yapılamaz; tersi mümkündür.

**8. Store settings → Website alanına tam olarak `https://aftermathvibe.com` yaz.**
- www yok, alt dizin yok, sonda eğik çizgi yok.
- Neden: AdMob, app-ads.txt dosyasını uygulamanın **mağaza kaydındaki** geliştirici sitesinden tarar. iOS'ta kaynak App Store kaydıydı; Android için kaynak Play kaydıdır. Alan boş veya farklı yazılırsa dosya sunucuda 200 dönse bile Android tarafı doğrulanmaz.
- **app-ads.txt dosyasına DOKUNMA.** Satırlar yayıncı bazlıdır, yayıncı kimliği (pub-5942367057795211) aynı olduğu için yeni satır gerekmez. Dosyaya dokunmak yayında ve doğrulanmış olan iOS tarafını da bozabilir.

**9. İlk AAB'yi Internal testing kanalına yükle ve Play App Signing varsayılanını kabul et. [GERİ DÖNÜŞÜ YOK: paket adı, Play App Signing kaydı]**
- Yer: Play Console → Test and release → Testing → Internal testing → Create new release
- Yükleme sırasında Google senin adına bir "app signing key" üretmeyi teklif edecek; **kabul et.** "Kendi imza anahtarımı yükleyeceğim / dışa aktaracağım" gibi seçenekleri SEÇME.
- Bu yüklemede `com.denizerdogan.imuststay` paket adı ve versionCode kalıcı olarak kilitlenir. Paket adını harf harf doğrula, büyük/küçük harfe duyarlıdır.
- Internal testing incelemesi genelde dakikalar-saatler sürer.

**10. Play App Signing sertifikasının SHA-1'ini kasaya not et.**
- Yer: Play Console → uygulama → App integrity / Play app signing. (Menü 2026'da yenilendi, imza ayarları "Protected with Play" altına taşınmış olabilir; yol tutmuyorsa sağ üstteki arama kutusuna "app signing" yaz.)
- Aradığın başlık **"App signing key certificate"**, "Upload key certificate" DEĞİL.
- Şimdilik kullanmayacaksın ama ileride Google ile Giriş, Firebase veya herhangi bir Google API entegrasyonu eklenirse bu değer lazım olacak ve bulmak zaman alır.

---

### Blok C — 14 günlük sayacı başlat (Blok D ve E'den ÖNCE)

**11. Kapalı test (Closed testing) sürümünü oluştur ve testçileri ekle. [BEKLEME: 14 takvim günü]**
- Yer: Play Console → Test and release → Testing → **Closed testing** → Create new release
- Aynı AAB'yi buraya da yükle.
- Testers sekmesinde B4'te topladığın 15-16 Gmail adresini e-posta listesi veya Google Grubu olarak ekle.
- Herkese opt-in bağlantısını gönder ve **her birinin bağlantıdan uygulamayı gerçekten yüklediğini tek tek teyit et.**
- **Dikkat:** 14 günlük sayaç **Internal testing'de değil, Closed testing'de** işler. İki kanal farklıdır; iç testi hızlı doğrulama için, kapalı testi sayaç için kullanacaksın.
- Bu adımı listenin geri kalanından önce yap: sayaç işlerken formları ve görselleri hazırlarsın, tam tersini yaparsan iki hafta boşa gider.

---

### Blok D — Satın alma hattı (yayılma beklemesi olduğu için erken başlatılır)

**12. Google Cloud Console'da proje seç veya "imuststay-billing" adıyla yeni proje aç, üç API'yi etkinleştir.**
- Yer: console.cloud.google.com → APIs & Services → Library → her birini arayıp Enable
- **Google Play Android Developer API**, **Google Play Developer Reporting API**, **Cloud Pub/Sub API**
- Biri kapalıysa RevenueCat kimlik bilgilerini "geçersiz" işaretler ve tek bir satın alma bile doğrulanamaz.

**13. Servis hesabını oluştur.**
- Yer: IAM & Admin → Service Accounts → Create service account
- Ad: `revenuecat` · Roller: **Pub/Sub Editor** ve **Monitoring Viewer**

**14. JSON anahtarını üret ve indir.**
- Hesabın sağındaki üç nokta → Manage keys → Add key → Create new key → **JSON**
- İnen dosyayı **depo klasörünün DIŞINDA** sakla (örneğin `~/Documents/gizli/`).
- Bu dosyayı Claude'a **verme**, yalnızca RevenueCat paneline yükleyeceksin. Sızarsa Play hesabına API erişimi verir.

**15. Servis hesabını Play Console'a davet et. [BEKLEME: izinlerin yayılması 24-36 saat]**
- Yer: Play Console → (tüm uygulamalar görünümü) Users and permissions → Invite user
- E-posta: `…@….iam.gserviceaccount.com`
- App permissions: I Must Stay
- Account permissions — **dört kutunun dördü de** işaretlenmeli:
  - View app information and download bulk reports (read-only)
  - View financial data, orders, and cancellation survey responses
  - Manage orders and subscriptions
  - Manage store presence
- Yalnızca finansal veri izni verilirse RevenueCat'te "Credentials need attention" uyarısı çıkar ve satın almalar doğrulanamaz.

**16. Play'de tek seferlik ürünü oluştur ve ETKİNLEŞTİR. [GERİ DÖNÜŞÜ YOK: ürün kimliği]**
- Yer: Play Console → Monetize with Play → Products → One-time products → Create one-time product
- Product ID: tam olarak `com.denizerdogan.imuststay.ortadogu_pack`
- Ad: "Ortadoğu paketi" · En az bir satın alma seçeneği (purchase option) ekle, kimliğini sade tut (`base`) ve **tek seçenekle kal.**
- Fiyat ve ülkeleri belirle, kaydet, sonra **Activate** et.
- Ürün kimliği bir kez oluşturulduktan sonra değiştirilemez ve ürünü silsen bile aynı kimlik hiçbir uygulamanda bir daha kullanılamaz.

> **Karar — ürün kimliği iOS ile aynı olsun.** RevenueCat ürünleri mağaza bazında tutar; App Store ürünüyle Play ürünü aynı adı taşısa bile birbirine karışmaz. Aynı adı kullanmak raporlamayı ve desteği kolaylaştırır, Play'in kimlik kuralları da bu adı kabul ediyor.

**17. RevenueCat'e Android uygulamasını MEVCUT projeye ekle.**
- Yer: app.revenuecat.com → **mevcut projeyi aç** → Project settings → Apps → + New → Google Play Store
- Ad: "I Must Stay (Android)" · Package name: `com.denizerdogan.imuststay`
- **Yeni bir RevenueCat projesi açma.** Ayrı proje açarsan `premium` entitlement'ı ve mevcut offering paylaşılmaz, iki ayrı satın alma dünyası oluşur ve bu kod tarafında düzeltilemez.

**18. JSON anahtarını RevenueCat'e yükle. [BEKLEME: doğrulama 36 saate kadar]**
- Yer: Project settings → Apps → I Must Stay (Android) → Service Account Credentials JSON
- Altında "Valid credentials" yazısını görene kadar bekle. İlk 36 saatte sarı uyarılar normaldir.

**19. Android'in genel API anahtarını (`goog_` ile başlar) Claude'a ver.**
- Yer: Project settings → API keys → App specific keys → Android satırı
- `sk_` ile başlayan gizli anahtarı **ASLA** gönderme. `goog_` anahtarı uygulama paketine gömülmek üzere tasarlanmış genel anahtardır.

**20. Ürünü RevenueCat'e aktar ve non-consumable işaretle.**
- Yer: Product catalog → Products → + New → Android uygulamasını seç → Import Products → `com.denizerdogan.imuststay.ortadogu_pack`
- İçe aktarılan ürünü aç ve tipini **non-consumable** (lifetime / tek kez satın alınabilir) olarak işaretle.
- Bu işaretlemeyi atlarsan RevenueCat satın almayı tüketir, Google aynı kullanıcının paketi tekrar tekrar satın almasına izin verir ve çift ödeme şikayeti alırsın. Bu bloktaki en pahalı hata budur.

**21. Ürünü MEVCUT `premium` entitlement'ına bağla.**
- Yer: Product catalog → Entitlements → **premium** → Attach products
- Yeni entitlement AÇMA. Uygulama kodu yalnızca `premium` adına bakıyor (`src/lib/purchases.ts`, `RC_ENTITLEMENT_ID = 'premium'`). Farklı ad açarsan satın alma başarılı olur ama reklamlar kapanmaz ve paket açılmaz.

**22. Ürünü mevcut offering'in `$rc_lifetime` paketine bağla.**
- Yer: Product catalog → Offerings → current offering → `$rc_lifetime` paketi → Attach product
- Yeni offering veya yeni paket AÇMA. `$rc_lifetime` bir offering değil, offering içindeki ayrılmış paket kimliğidir; iOS ve Android ürünleri aynı pakete asıldığında SDK her platformda kendi mağazasının ürününü çeker ve kodda değişiklik gerekmez.

**23. Gerçek zamanlı bildirimleri (RTDN) bağla.**
- RevenueCat'te JSON alanının altındaki Google Cloud Pub/Sub Topic ID'yi kopyala.
- Play Console → Monetize with Play → Monetization setup → Real-time developer notifications → Topic name alanına yapıştır.
- Notification content: **"Subscriptions, voided purchases, and all one-time products"**
- Save changes → **Send test notification** ile kanalı doğrula.
- Bağlamazsan iade edilen bir satın almada kullanıcı reklamsız kalmaya devam eder.

**24. Lisans testi hesaplarını tanımla.**
- Yer: Play Console → (tüm uygulamalar görünümü) Settings → License testing
- Test edecek kişilerin Gmail adreslerini ekle, lisans yanıtını `RESPOND_NORMALLY` bırak.
- **İki liste ayrıdır:** yalnızca lisans listesindeki kişi uygulamayı indiremez; yalnızca test kanalındaki kişi gerçek para öder. Aynı adresler her iki listede de olmalı. Kendi yayıncı hesabın otomatik olarak lisans testçisi sayılır.

**25. Uçtan uca satın almayı doğrula.**
- Test cihazında Play Store'un **birincil hesabının testçi hesabı olduğunu kontrol et** (birden fazla Google hesabı varsa yanlış hesapla gerçek para ödersin).
- İç test sürümünü kur → Ortadoğu paketini satın al → app.revenuecat.com → Customers → ilgili müşteride satın almanın göründüğünü ve `premium` entitlement'ının aktif olduğunu gör.
- Not: non-consumable ürün aynı hesapla ikinci kez test edilemez; yeniden test için siparişi iade et veya başka testçi hesabı kullan.

---

### Blok E — Beyanlar ve mağaza kaydı (14 gün beklerken doldurulur)

**26. Gizlilik politikası ve veri silme sayfalarının aftermathvibe.com'da yayında olduğundan emin ol.**
- Gizlilik politikası URL'si hem Play hem AdMob tarafında zorunlu.
- Veri silme sayfası (örneğin `https://aftermathvibe.com/veri-silme`) uygulama adını ve silme yolunu açıkça anlatmalı.
- Bu iki sayfa hazır değilse 27. adımın yarısı yapılamaz. Metin taslağını Claude hazırlayabilir, yayına almak senin işin.

**27. App content bölümündeki TÜM beyanları kapat.**
Yer: Play Console → Policy and programs → App content. Her kart ayrı ayrı "Tamamlandı" olmalı; biri bile "Eylem gerekli" kalırsa sürüm incelemeye gönderilemez.

- **Privacy policy:** aftermathvibe.com'daki gizlilik sayfası URL'si.
- **Ads:** "Yes, my app contains ads."
- **Advertising ID:** "Uygulamam reklam kimliği kullanıyor" = Evet. Amaçlar: **Reklamlar veya pazarlama** + **Analiz**.
- **App access:** "Tüm işlevler özel erişim olmadan kullanılabilir" (anonim oturum var, giriş bilgisi gerekmiyor).
- **Content ratings (IARC anketi)** — kritik cevaplar:
  - Kategori: Oyun
  - Gerçek parayla kumar: **HAYIR**
  - Oyuncunun bahis yapabildiği simüle kumar oynanışı: **HAYIR** (oyundaki slot animasyonu rakip kartını seçen görsel efekttir, bahis mekaniği değil)
  - Kumar/bahis temalı METİN göndermeleri: **EVET** (kart metinlerinde yasa dışı bahis çetesi, kumar sitesi geçiyor)
  - Suç/rüşvet/para aklamanın oynanışın parçası olması: **EVET**
  - Uyuşturucu, cinsellik, çıplaklık: **HAYIR**
  - Nefret söylemi, ayrımcılık, aşırıcılık teşviki: **HAYIR** (siyasi hiciv ayrımcılık teşviki değildir)
  - Dijital satın alma içerir: **EVET**
  - Kullanıcılar arası sohbet: **HAYIR** (skor tablosu sohbet değil; "kullanıcı tarafından oluşturulan içerik paylaşımı" sorusu çıkarsa takma adların herkese görünür olduğunu işaretle)
  - Beklenen sonuç kabaca PEGI 12-16 / ESRB Teen bandı olur, iOS'taki 17+ ile hizalıdır.
- **Target audience and content:** Yaş aralığı **yalnızca 18 ve üzeri** (gerekirse 16-17 dahil). "Çocuklara da hitap ediyor mu?" = **HAYIR**. Designed for Families programına **kayıt olma.**
- **Data safety** — toplanan veriler:
  | Veri | Toplanıyor | Paylaşılıyor | Amaç |
  |---|---|---|---|
  | Konum → Yaklaşık konum | Evet | **Evet** | Reklam/pazarlama, Analiz, Dolandırıcılık önleme (AdMob IP'den konum tahmin ediyor) |
  | Kişisel bilgiler → Ad | Evet | Hayır | Uygulama işlevi (Supabase'deki takma ad; Google takma adı Ad kapsamına alır) |
  | Kişisel bilgiler → Kullanıcı kimlikleri | Evet | Hayır | Uygulama işlevi, Hesap yönetimi (Supabase anonim kullanıcı kimliği, RevenueCat app user ID) |
  | Cihaz veya diğer kimlikler | Evet | **Evet** | Reklam/pazarlama, Analiz, Dolandırıcılık önleme (AdMob reklam kimliği, app set ID) |
  | Uygulama etkinliği → Uygulama içi diğer işlemler | Evet | Evet (AdMob ürün etkileşimi) | Analiz (`game_events` tablosu) |
  | Uygulama bilgileri → Kilitlenme günlükleri, Teşhis | Evet | Evet (AdMob teşhis) | Analiz |
  | Finansal bilgiler → Satın alma geçmişi | Evet | Hayır | Uygulama işlevi (RevenueCat) |
  - "Paylaşılıyor" = üçüncü tarafa aktarım. Supabase ve RevenueCat senin talimatınla işleyen hizmet sağlayıcıdır, onlara aktarım paylaşım sayılmaz; AdMob/Google reklam ağı paylaşımdır.
  - Güvenlik bölümü: "Veriler aktarım sırasında şifreleniyor mu?" = **EVET (TLS)**. "Kullanıcılar silme talep edebiliyor mu?" = **EVET**, URL olarak 26. adımdaki veri silme sayfasını ver.
- **Government apps / Financial features / Health:** Hayır ve "Bunların hiçbiri" (uygulama içi satın alma finansal özellik sayılmaz).
- **News app: HAYIR.** Oyun siyasi hiciv içerse de haber uygulaması değildir; yanlışlıkla evet demek oyunu haber/siyaset politikalarının ek denetimine sokar.

**28. Mağaza kaydını (Main store listing) doldur.**
- Yer: Play Console → Grow users → Store presence → Main store listing
- **Uygulama simgesi:** 512x512 piksel, 32 bit PNG, en fazla 1024 KB. (İki kol farklı şey söylüyordu — biri "saydamlık YOK" dedi. Play'in resmi teknik şartı 32 bit PNG'dir ve alfa kanalını kabul eder; ikonun görsel olarak dolu bir kare olması yeterlidir. **Saydamlık yasağı öne çıkan grafik için geçerlidir.**)
- **Öne çıkan grafik (feature graphic):** 1024x500 piksel, JPEG veya 24 bit PNG, **alfa kanalı YOK**. Bu alan zorunludur ve App Store'da karşılığı olmadığı için elinde hazır değil.
- **Telefon ekran görüntüleri:** 9:16 dikey, en az 1080x1920, cihaz tipi başına en fazla 8. Teknik asgari 2, ama Play'in öneri motorlarında görünmek için oyunlarda en az 4 bekleniyor. iOS görüntüleri farklı en-boy oranında olduğu için kullanılamaz; Android emülatör görüntüsü gerekir (Claude üretecek).
- Tablet dağıtımı istiyorsan 7 inç ve 10 inç için ayrı ayrı 4'er görüntü gerekir; istemiyorsan boş bırak.
- **Kısa açıklama:** en fazla 80 karakter. **Tam açıklama:** en fazla 4000 karakter.
- **Kategori:** Oyunlar → Strateji
- Açıklama metninde **gerçek siyasetçi, parti, ülke veya bayrak adı KULLANMA** — oyunun içi temiz olsa bile Yanıltıcı Davranış ve Taklit politikalarını tetikler.

**29. GDPR/UMP rıza mesajına Android uygulamasını ekle ve yayımla.**
- Yer: AdMob → Privacy & messaging → European regulations → Manage → mevcut mesajı aç → Select apps → Android "I Must Stay"i işaretle → Confirm → **Publish**
- Mesaj yoksa Create: hedefleme "Countries subject to GDPR (EEA, UK, and Switzerland)", gizlilik politikası URL'si aftermathvibe.com'daki sayfa.
- "US states" kartı varsa aynı şekilde Android uygulamasını ekle.
- Mesajlar **uygulama başına** seçilidir; iOS için yayımlanmış mesaj Android'i kendiliğinden kapsamaz. Kod tarafındaki UMP çağrısını Claude yapıyor, ama mesaj panelde yayında değilse kod hiçbir şey gösteremez.

**30. Kendi test telefonunu AdMob'a test cihazı olarak ekle. [BEKLEME: etkinleşmesi 15 dakika - 24 saat]**
- Yer: AdMob → Settings → Test devices → Add test device → Platform: Android
- Reklam kimliği: telefonda Ayarlar → Güvenlik ve gizlilik → Diğer gizlilik ayarları → Reklamlar (Android 13+). Orada görünmüyorsa Claude logcat'ten okuyup verecek.
- Tanımlı olmayan cihazda gerçek reklama tıklamak geçersiz trafiktir; hesap kapanırsa **yayında olan iOS gelirini de kaybedersin** (tek yayıncı hesabı).

---

### Blok F — Üretime çıkış

**31. 14 gün dolduktan sonra üretim erişimi için başvur. [BEKLEME: inceleme 7 güne kadar]**
- Yer: Play Console → Dashboard → "Apply for production" kartı
- Üç bölümü doldur: kapalı testi nasıl yürüttün, testçileri nasıl buldun ve ne geri bildirim aldın, bu geri bildirimlerle uygulamada ne değiştirdin, üretime hazırlık.
- **"Test ettik, sorun yok" gibi genel yazma** — ret olasılığı yüksektir. Somut geri bildirim ve somut değişiklik anlat.
- Ret gelirse düzeltip yeniden başvurabilirsin ama her tur yeni bir bekleme demektir.

**32. Üretim sürümünü oluştur, ülke dağıtımını seç ve yayınla. [BEKLEME: ilk inceleme 1-7 gün]**
- Yer: Test and release → Production → Create new release
- Ülke listesini gözden geçir; kumar ve siyasi içerik konusunda katı mevzuatı olan pazarları (Körfez ülkeleri, Çin, Kore gibi) dahil edip etmeyeceğine bilinçli karar ver. Ülkeyi baştan hariç tutmak, ülke bazlı kaldırma kaydı almaktan iyidir.
- Yayınlamadan önce: Policy status sayfasında hiçbir uyarı kalmamalı, Pre-launch report'ta çökme olmamalı.
- Yükleme sırasında "target API level 36 required" uyarısı çıkarsa **sürümü yayınlama, doğrudan Claude'a ilet.**

**33. Yayın sonrası AdMob uygulamasını mağaza kaydına bağla. [BEKLEME: 24-48 saat, bazen 1 haftaya kadar]**
- Yer: AdMob → Apps → View all apps → Android satırı → Stores sütunu → Add store → paket adını `com.denizerdogan.imuststay` olarak ara → doğru kaydı seç → bağla ve incelemeye gönder.
- Bu ancak uygulama **herkese açık olarak yayına girdikten sonra** yapılabilir. İç/kapalı test yeterli değildir.
- Durum akışı: "Requires review" → "Getting ready" → **"Ready"**. Bu süre boyunca görülen düşük dolum ve boş reklam Google'ın kasıtlı davranışıdır, kod hatası değildir.
- "Needs attention" görürsen Policy center → Disapproved apps altındaki gerekçeyi oku ve Claude'a ilet.

**34. app-ads.txt taramasını tetikle ve izle. [BEKLEME: 24 saate kadar]**
- Yer: AdMob → Apps → View all apps → app-ads.txt sekmesi → Android uygulamasının satırını genişlet → **Check for updates**
- Dosyaya hiçbir şey ekleme, sadece yeniden tarama iste.

---

## 3. Tuzaklar — Asla Yapma

**Geri dönüşü OLMAYAN, uygulamayı kalıcı olarak sakatlayanlar:**

1. **Play App Signing'i reddedip "imza anahtarını kendim yöneteceğim" demek.** O anahtarı kaybettiğin an uygulama sonsuza dek güncellenemez hale gelir; tek çare paket adını değiştirip sıfırdan yayınlamaktır — tüm kurulumlar, yorumlar ve sıralama sıfırlanır. Play App Signing'de ise yükleme anahtarı kaybolursa Google sıfırlayabilir (günler sürer ama kurtulursun). **Varsayılanı bozma.**
2. **Keystore'u proje klasörüne koymak veya parolasını bir dosyaya yazmak.** Bu depoda `.env` zaten git ile takip ediliyor ve `apple-key.p8` gibi sır dosyaları var; `.jks` de aynı yoldan GitHub'a giderse anahtarı yakarsın. Keystore proje dizininin dışında, kasada dursun; yedeği iki ayrı yerde olsun.
3. **Paket adını ilk yüklemede yanlış vermek.** `com.denizerdogan.imuststay` ilk AAB ile kalıcı olarak kilitlenir, büyük/küçük harfe duyarlıdır. Yazım hatası veya "test" ekli bir ad sonradan düzeltilemez; uygulamayı silsen bile o paket adı bir daha kullanılamaz.
4. **Ürün kimliğini yanlış yazmak.** `com.denizerdogan.imuststay.ortadogu_pack` oluşturulduktan sonra değiştirilemez, silinse bile yeniden kullanılamaz. Harf harf kontrol et.
5. **"Free" yerine "Paid" işaretlemek.** Ücretliden ücretsize geçilebilir, ücretsizden ücretliye **asla** geçilemez.
6. **Ödeme profilinin ülkesini yanlış seçmek.** Sonradan değiştirilemez.
7. **Servis hesabı JSON dosyasını depoya, Desktop'a veya bir sohbete koymak.** Sızarsa anahtarı iptal edip yeniden üretmek ve 36 saatlik yayılmayı baştan beklemek gerekir.

**Takvimi haftalarca uzatanlar:**

8. **Kişisel hesap açıp sonra kuruluşa geçmeye çalışmak.** Tür değişikliği desteklenmiyor; yeni hesap 25 doları ve tüm doğrulamayı yeniden ödemek demektir. Kararı ilk ekranda ver.
9. **Testçilerin 14 günü doldurduğunu varsaymak.** Sayaç sessizce sıfırlanır: 14 günden önce testten çıkan kişi hiç sayılmaz, çıkıp geri dönenin 14 günü baştan başlar. Sayı 12'nin altına düşerse iki hafta yeniden beklersin. Davet etmek yetmez, opt-in bağlantısından **gerçekten yüklemiş** olmaları gerekir.
10. **Ücretli "12 tester" servislerinden veya sahte hesaplardan testçi satın almak.** Google 2026'dan beri testçilerin uygulamayı gerçekten kullanıp kullanmadığını denetliyor; yakalanırsan üretim erişimi reddedilir ve hesap risk altına girer.
11. **14 günlük sayacı en sona bırakmak.** Kapalı test sürümünü ilk fırsatta yayına al, formları ve görselleri beklerken doldur.
12. **Servis hesabı izinlerini yayın gününe bırakmak.** Yayılma 36 saati buluyor.

**Uygulamanın yayından kaldırılmasına yol açanlar:**

13. **Data safety formunu "veri toplamıyorum" diye geçmek.** Üçüncü taraf SDK'ların cihazdan gönderdiği her şeyden sen sorumlusun; AdMob'un reklam kimliği, IP ve teşhis verisini gizlemek en sık askıya alma sebebidir. Beyan ile gizlilik politikası metni birebir tutmalı.
14. **IARC anketinde "simüle kumar" sorusuna gereksiz EVET demek.** PEGI 2020'den beri kumar oynatan oyunlara 18 veriyor; Avrupa'da hem görünürlüğün hem reklam envanterin daralır. Tersine kart metinlerindeki bahis göndermelerini gizlemek ise içeriğin yanlış beyanı sayılır ve kaldırma sebebidir. **Doğru ayrım: oynanışta bahis yok, temada var.**
15. **"News app" sorusuna evet demek.** Siyasi hiciv, haber uygulaması değildir; evet demek gereksiz ek denetim ve ret getirir.
16. **Geçiş reklamını yanlış yere koymak.** Play'in Rahatsız Edici Reklamlar politikası uygulama açılışında, kullanıcı bir eylem beklerken veya çıkış anında beklenmedik tam ekran reklamı ihlal sayar. iOS'ta sorun çıkarmayan yerleşim Play'de uyarı getirebilir — Claude'un kontrol edeceği bir şey, ama uyarıyı sen görebilirsin.
17. **"Ortadoğu paketi" adının ve görsellerinin Hassas Olaylar (Sensitive Events) politikası altında "süregelen bir çatışmadan para kazanma" olarak okunması riski.** Ücretli bir paketin adı olması riski artırır. Mağaza görsellerinde çatışma çağrışımı yapan öğeleri gözden geçir, hiciv çerçevesinin açık olduğundan emin ol.
18. **Reddedilen bir sürümü aynı hatayla üst üste göndermek.** Hesap düzeyinde uyarı biriktirir. Ret gelirse Policy status sayfasındaki gerekçeyi okumadan yeniden gönderme.

**Kimlik ve reklam tarafında sık yapılan hatalar:**

19. **iOS App ID'sini veya iOS geçiş birimini Android'de kullanmak.** `~4387951075` ve `/3936524936` Android'de çalışmaz; reklam dolmaz, raporlar karışır, platform uyuşmazlığı politika ihlali sayılabilir.
20. **app-ads.txt'e Android için yeni satır eklemeye çalışmak.** Satırlar yayıncı bazlıdır; dosyaya dokunmak yayında ve doğrulanmış olan iOS tarafını da bozar.
21. **Play mağaza kaydındaki Website alanını boş bırakmak veya `www.aftermathvibe.com` / `aftermathvibe.com/tr` gibi farklı yazmak.** AdMob yalnızca kayıttaki alan adının kökünü tarar.
22. **RevenueCat'te ürünü non-consumable işaretlememek.** Satın alma tüketilir, aynı kullanıcı paketi tekrar tekrar satın alır, çift ödeme şikayeti gelir.
23. **RevenueCat'te ikinci bir entitlement, offering veya proje açmak.** Kod tek `premium` adına bakıyor; ikinci ad açarsan satın alma başarılı görünür ama uygulama kilidi açılmaz.
24. **Ürünü Play'de taslak bırakıp Activate etmeyi unutmak.** SDK hiçbir fiyat döndürmez, satın alma ekranı boş açılır.
25. **Cihazda birden fazla Google hesabı varken test etmek.** Play Store'un aktif hesabı testçi hesabı değilse gerçek para ödersin.
26. **Aynı versionCode ile ikinci kez AAB yüklemeye çalışmak.** Play her yüklemede daha büyük bir versionCode ister; yeni bir derleme gerekir.
27. **Play Console menü adlarını ekrandakiyle birebir aramak.** Menü 2026'da yenilendi (imza ayarları artık "Protected with Play" altında). Yol tutmuyorsa sağ üstteki arama kutusunu kullan.
28. **AdMob'un ödeme/vergi bilgilerini yeniden kurmaya çalışmak.** Bunlar hesap düzeyindedir, Android için tekrar gerekmez; mevcut profile dokunma.
29. **iOS tarafındaki Supabase Apple sağlayıcısına dokunmak.** Yanlışlıkla değiştirilirse yayında olan 1.0.5'te Apple ile Giriş anında kırılır ve bunu ancak kullanıcı şikayetiyle fark edersin.

---

## 4. Claude'un Tarafındaki İşler

**Karar — Android'in ilk sürümünde Google ile Giriş OLMAYACAK, yalnız anonim oturumla çıkılacak.**
Gerekçe: Google girişi eklemek altı ayrı engelleyici panel adımı getiriyor (Cloud projesi, Branding sayfası, Audience yayımı, web istemcisi, İKİ ayrı Android istemcisi, Supabase güncellemesi) ve bunlardan biri (Play imzalama sertifikasının SHA-1'i) ancak ilk AAB yüklendikten sonra yapılabiliyor. Anonim oturumla oyun ve skor tablosu Android'de tam çalışıyor: uygulama açılışta `signInAnonymously()` ile gerçek bir oturum alıyor, anonim kullanıcı JWT'sinde `authenticated` rolünü taşıyor ve RLS politikalarının tamamı `to authenticated` yazılmış. Kaybedilen tek şey kalıcı kimlik: oyuncu telefon değiştirirse veya uygulamayı silip kurarsa skoru geri gelmez. **Bunu mağaza açıklamasında ya da uygulama içinde belirt**, yoksa "skorum silindi" şikayetlerine cevap veremezsin. Google girişi 1.1 sürümüne bırakılıyor; Adım 10'da not ettiğin SHA-1 o zaman kullanılacak.

Claude'un yapacakları:
- `android/` klasörünü oluşturmak (`npx cap add android`), Capacitor 8 ile eşitlemek.
- `compileSdk` ve `targetSdk` değerlerini **36**'ya ayarlamak (31 Ağustos 2026 kapısı).
- AdMob Android App ID'sini `AndroidManifest.xml`'e meta-data olarak yazmak, geçiş birimi kimliğini platform-koşullu hale getirmek, `AD_ID` iznini eklemek.
- RevenueCat başlatmasını platforma göre ayırmak (`goog_` anahtarı Android'de, `appl_` iOS'ta).
- Apple ile Giriş düğmesini Android'de gizlemek, anonim oturum akışını Android'de doğrulamak.
- UMP/GDPR rıza akışını Android'de çağırmak (panel tarafındaki mesaj yayını 29. adım).
- Geçiş reklamının yerleşimini Play'in Rahatsız Edici Reklamlar politikasına göre gözden geçirmek.
- İmzalama yapılandırmasını keystore parolasını **ortam değişkeninden** okuyacak şekilde kurmak; `.jks` ve parola dosyalarını `.gitignore`'a eklemek.
- **`.env` dosyasını git takibinden çıkarmak** (şu anda takip ediliyor) ve sızmış sırları gözden geçirmek.
- `versionCode` / `versionName` yönetimini kurmak ve imzalı `app-release.aab` üretmek.
- Android emülatörde 1080x1920 dikey ekran görüntülerini üretmek (mağaza kaydı için).
- Gizlilik politikası ve veri silme sayfalarının metin taslağını hazırlamak.
- Test telefonunun reklam kimliğini logcat'ten okuyup vermek (gerekirse).
- Talep edeceği girdiler: SDK yolu, AdMob Android App ID, AdMob interstitial birim ID'si, keystore yolu ve alias, RevenueCat `goog_` anahtarı. **Parolalar ve JSON servis anahtarı Claude'a gitmeyecek.**

---

## 5. Gerçekçi Takvim

| Gün | Ne olur | Beklenen |
|---|---|---|
| **Gün 1 (yarın)** | B1-B4 başlatılır: Play kaydı + 25$ + kimlik doğrulama gönderilir, ödeme profili doldurulur, Android Studio iner, testçi listesi toplanmaya başlar. Öğleden sonra Blok A (adım 1-6) bitirilir: SDK, AdMob kimlikleri, keystore. | Claude gün sonunda AAB'yi üretebilir. |
| **Gün 2-4** | Kimlik doğrulaması bekleniyor. Bu arada mağaza görselleri (512x512 ikon, 1024x500 feature graphic, 4-8 ekran görüntüsü) ve açıklama metinleri hazırlanır. Gizlilik + veri silme sayfaları yayına alınır. | Doğrulama onayı genelde bu aralıkta gelir; yoğunlukta 1-2 haftaya çıkabilir. |
| **Onay günü (D)** | Adım 7-11: uygulama oluşturulur, Website alanı yazılır, AAB internal testing'e yüklenir, Play App Signing kabul edilir, App signing SHA-1'i not edilir ve **aynı gün kapalı test sürümü yayına alınıp 15-16 testçi davet edilir.** | **14 günlük sayaç bu gün başlar.** Sayaç bu günden geç başlarsa her gün yayına doğrudan eklenir. |
| **D+1 → D+3** | Blok D (adım 12-25): Cloud API'leri, servis hesabı, Play izinleri (36 saat yayılma), ürün oluşturma ve aktivasyon, RevenueCat kurulumu, RTDN, uçtan uca satın alma testi. | Satın alma iç testte çalışır durumda olmalı. |
| **D+2 → D+7** | Blok E (adım 26-30): App content beyanlarının tamamı, IARC anketi, Data safety, mağaza kaydı, GDPR mesajı, test cihazı. | Uygulama üretime gönderilmeye hazır hale gelir, sadece sayaç bekleniyor olur. |
| **D+14** | Adım 31: "Apply for production" başvurusu gönderilir. | İnceleme 7 güne kadar. |
| **D+14 → D+21** | Üretim erişimi incelemesi bekleniyor. Bu arada testçilerin geri bildirimlerine göre düzeltmeler yapılabilir. | Ret gelirse düzelt ve yeniden gönder; her tur yeni bekleme. |
| **D+21 → D+28** | Adım 32: üretim sürümü gönderilir ve ilk mağaza incelemesi beklenir. | Yeni hesaplarda 1-7 gün. |
| **Yayın + 1-7 gün** | Adım 33-34: AdMob mağaza bağlantısı, inceleme, app-ads.txt taraması. | AdMob durumu "Ready" olana kadar reklam sunumu sınırlı kalır — bu normaldir, kod hatası değildir. |

**Toplam gerçekçi süre:** kimlik doğrulaması hızlı gelirse **yaklaşık 4 hafta**; doğrulama gecikirse veya üretim başvurusu bir kez reddedilirse **6 haftaya** kadar. Reklam gelirinin tam açılması yayından 1 hafta sonrasını bulabilir.

**En büyük iki hızlandırıcı:** (a) Elinde hazır D-U-N-S numarası varsa kuruluş hesabı seçmek — 14 + 7 günü tamamen siler, takvimi ~2 haftaya indirir. (b) Kapalı test sürümünü, hesap doğrulandığı **gün** yayına almak — bu günü kaçırdığın her gün, yayın tarihine birebir eklenir.