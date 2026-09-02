# I MUST STAY — Siyasi Risk Temizliği: Uygulama Listesi

Bu liste rapor değil, iş emridir. Sıra önemlidir: önce **Bölüm 0**'daki sözlük tanımlanır, sonra Bölüm 1 uygulanır, çünkü Bölüm 1'in yarısı sözlükteki adlara dayanıyor.

Kanıt: satır numaraları `/Users/denizerdogan/Developer/dengem-oyunu` içinde doğrulandı. Değişiklik sonrası satırlar kayacağı için **eşleştirmeyi satır numarasıyla değil, birebir metinle yapın** (numaralar konum ipucudur).

---

## 0. Evren sözlüğü — önce bunu sabitle

Her kalemde aynı karşılık kullanılacak. İki dil aynı anda değişecek; yoksa çeviri üzerinden gönderme geri gelir.

| Gerçek ad | TR karşılık | EN karşılık |
|---|---|---|
| IMF | Küresel Kredi Fonu | Global Credit Fund |
| AB / EU | Birlik | the Union |
| BM / UN | Milletler Konseyi | World Assembly |
| NATO | **Barış Güçleri** *(oyunda zaten var, yenisini icat etme)* | **Peace Forces** |
| AİHM / ECHR | Batı İnsan Hakları Mahkemesi *(kartın kendi kurgusu)* | Western Human Rights Court |
| FIFA | Dünya Federasyonu | the world federation |
| Eurovision | Şarkı Yarışması | Song Contest |
| İnterpol | uluslararası aranma bülteni | international red notice |
| CIA | Dost Ülke İstihbaratı | Friendly Nation Intelligence |
| MİT / Milli İstihbarat | İstihbarat Teşkilatı | State Intelligence Service |
| Genelkurmay | Yüksek Komuta Konseyi | High Command Council |
| Diyanet | İnanç Konseyi | Faith Bureau |
| AFAD | Afet Kurumu | Disaster Agency |
| TÜİK | İstatistik Kurumu | Stats Office |
| YSK | Seçim Divanı | Election Board |
| Güneydoğu / Southeast | **Dağ Vilayetleri** | **Highland Provinces** |
| Dağlı halk / Mountain People | **Vadi Halkı** | **Vale Folk** *(kategoriyle çakışmasın diye kasten farklı)* |
| Gökkuşağı Partisi 🌈 | **Çınar Partisi** 🌿 | **Sycamore Party** 🌿 |
| Ada Sakini | **Kuledeki Mahkum** | **the Fortress Prisoner** |
| Sarışın Şerif | **Kovboy Diyarı** | **the Cowboy Country** |
| Siyon / Siyonlar | **Vaha Devleti** | **the Oasis State** |
| Acem / Acemler | **Ateş Ülkesi** | **the Fire Realm** |
| Flamenko Başbakanı | uzak bir ülkenin başbakanı | the Grand Duchy's premier |
| S-400 / Patriot | Doğu'nun füze kalkanı / Batı'nınki | the Eastern / Western missile shield |
| F-35 | hayalet uçak | stealth fighter |
| F-16 | savaş uçakları | fighter jets |
| Twitter | Cıvıltı | Chirp |
| Starbucks | o pahalı zincir kahveci | that overpriced coffee chain |
| dolar / Dollar | döviz, kur | hard currency, the exchange rate |
| Ortadoğu / Middle East | Büyük Çöl Cephesi | the Great Desert Front |
| Türk kahvesi | cezvede pişmiş kahve | copper-pot coffee |
| Seçim yılları 2008/2013/2018/2019/2024/2028 | **2041 / 2046 / 2051 / 2053 / 2058 / 2062** | aynı |

---

## 1. Hemen değişmeli — yüksek risk

### 1.A — Yaşayan bir kişiye kilitli alıntılar (en yüksek hukuki risk)

**1.** `src/data/cards.ts:13`
`leftChoice: "Faizi düşür, dinimizde öyle derdi!"` → `leftChoice: "Faizi düşür, tefecilik ahlaksızlıktır!"`

**2.** `src/data/cards-en.ts:8`
`'Lower rates — religion demands it!'` → `'Lower rates — usury is a sin!'`
*(Faiz yasağı bütün İbrahimî geleneklerde var; tarikat +5 mekaniği aynen korunur.)*

**3.** `src/data/cards.ts:1536`
`description: "Faizi artırmak enflasyonu artırır! Düşürürsen enflasyon düşer. Ben ekonomistim, bunu benden iyi kimse bilmez."`
→ `description: "Bütün iktisatçılar yanılıyor. Faizi dibe çekersen her şey kendiliğinden düzelir. Bunu bana kitaplar değil, hayat öğretti."`

**4.** `src/data/cards-en.ts:455`
→ `description: 'Every economist on earth has it backwards. Pull rates to the floor and the rest fixes itself. Life taught me this, not books.'`

**5.** `src/data/cards.ts:1429`
`leftChoice: "İtibardan tasarruf olmaz!"` → `leftChoice: "Devletin şanından kısılmaz!"`

**6.** `src/data/cards-en.ts:424`
`'No savings on prestige!'` → `'The dignity of the state is not a line item!'`

**7.** `src/data/cards.ts:1591`
`leftChoice: '"Para kaybolmaz, el değiştirdi" de'` → `leftChoice: '"Kasada duruyor, saymak zaman alıyor" de'`

**8.** `src/data/cards.ts:1669`
`leftChoice: '"Fıtrat" de, geç'` → `leftChoice: '"Madenciliğin doğası bu" de, geç'`

**9.** `src/data/cards.ts:1114`
`rightChoice: '"Kader planı" de'` → `rightChoice: '"Böyle yazılmış" de, geç'`

**10.** `src/data/cards.ts:773`
`leftChoice: "Bir gece ansızın manşetleri atılsın"` → `leftChoice: "Manşetler bu gece patlasın, jenerik müziği de yüksek olsun"`

**11.** `src/data/cards.ts:693`
`leftChoice: "Bir gecede cahil kalmıştık zaten. Değiştir."` → `leftChoice: "Nasılsa kimse okumuyor. Değiştir gitsin."`
*(Kanunla korunan bir kurucu figürün icraatına gönderme — listedeki en yüksek hukuki riskli ikinci ifade.)*

**12.** `src/data/cards-en.ts:216`
`'We were ignorant overnight anyway. Change it.'` → `'Nobody reads anyway. Change it.'`

**13.** `src/data/cards.ts:34`
`character: "Beşli Mütaahit"` → `character: "Baş Müteahhit"`
*(imageId `chief_contractor` zaten uyumlu, görsel değişmiyor.)*

**14.** `src/data/cards.ts:740`
`character: "Nurlu Yapı İtirafçısı"` → `character: "Gizli Kardeşlik İtirafçısı"`

**15.** `src/data/cards-en.ts:222`
`character: 'Radiant Order Informant'` → `character: 'Silent Order Informant'`

**16.** `src/data/cards.ts:3469`
`leftChoice: "Diplomasını iptal ettir"` → `leftChoice: "Ehliyetini iptal ettir"`
*(`rightChoice: "Doğum belgesini iptal ettir"` AYNEN KALSIN — tırmanış esprisi orada.)*

**17.** `src/data/cards-en.ts:1048`
`'Get his diploma revoked'` → `'Get his driving licence revoked'`; aynı satırdaki `'Get his birth certificate revoked'` → `'Have his citizenship file mysteriously lost'`

**18.** `src/data/electionData.ts:121`
`Herşey çok güzel olacak` → `Yarından tezi yok, cennet kuracağız`

**19.** `src/data/electionData.ts:235`
`Everything will be wonderful` → `Tomorrow we build paradise`

**20.** `src/data/electionData.ts:8` (yorum satırı — depo açık, kod da temizlenmeli)
`(special exceptions: "Her şey çok güzel olacak" = 10%)` → `(special exceptions: "Yarından tezi yok, cennet kuracağız" = 10%)`

**21.** `src/data/electionData.ts:120` / `:234`
`Adelet yürüyüşü başlat` → `Şehirden şehre 'vicdan yürüyüşü' başlat`
`Launch the Justice March` → `Launch a city-to-city 'march of conscience'`

**22.** `src/data/electionData.ts:102` / `:216`
`Millet İttifakı kur` → `'Ortak Akıl İttifakı'nı kur`
`Form Nation Alliance` → `Form the Common Sense Alliance`
*(«Geniş Cephe / Broad Front» KULLANMAYIN — başka ülkelerde gerçek parti adı.)*

**23.** `src/data/electionData.ts:70` / `:184`
`128 milyar dolar nerede?` → `Hazinedeki milyarlar nereye uçtu?`
`Where's the 128 billion dollars?` → `Where did the billions in the treasury go?`

**24.** `src/data/chainCardsByTurn.ts:26`
`"AİHM bizi bağlamaz, Eyy Batı!" çek.` → `"O mahkeme bizi bağlamaz! Sesleniyorum karşı kıtaya: haddinizi bilin!" diye kükre.`

**25.** `src/data/chainCardsByTurn-en.ts:16`
`"The ECHR has no authority over us — Go away, West!"` → `"That court holds no sway here! I address the continent across the water: know your place!"`

### 1.B — Tek bir gerçek olaya kilitli sahneler

**26.** `src/data/cards.ts:456-457`
`description: "Başkanım, ayakkabı kutularından çıkan paraları açıklamamız lazım."` → `description: "Başkanım, bakanın evindeki para dolu çelik kasaları açıklamamız lazım."`
`leftChoice: "Okul yaptırmak için hayır parası de"` → `leftChoice: "Hayır kurumuna bağış de, üstüne bir de yetimhane fotoğrafı çektir"`

**27.** `src/data/cards-en.ts:143-144`
`'the money found in the shoe boxes'` → `'the cash found stuffed in the flour sacks'`
`'Say it\'s charity money for building schools'` → `'Say it was a wedding fund from well-wishers'`
*(Sadece kutuyu değiştirmek yetmez, savunma cümlesi olayı mühürlüyor.)*

**28.** `src/data/cards.ts:38`
→ `description: "Başkanım, yeni mega proje hazır. Dağı delen tünel, körfezi aşan köprü, bir de çöle havalimanı... hepsini biz yapalım mı?"`

**29.** `src/data/cards-en.ts:15`
→ `description: 'Boss, new mega projects ready. A fourth airport, a second canal, a bridge to nowhere... shall we do them all?'`

**30.** `src/data/cards.ts:1820` + `:1824`
`character: "Gezen Park Mütaahiti"` → `character: "Kent Meydanı Müteahhidi"`
`description: "Merkezdeki tarihi parka AVM yapacağız. Halk sokağa çıkıyor."` → `description: "Şehrin göbeğindeki asırlık çiçek pazarına alışveriş merkezi dikeceğiz. Bütün mahalle ayakta."`

**31.** `src/data/cards-en.ts:542-543`
`character: 'Park Developer'` → `character: 'Arcade Developer'`
`'We\'ll build a shopping mall in the central historic park...'` → `'We\'ll drop a shopping arcade onto the old flower market. The whole quarter is up in arms.'`

**32.** `src/data/cards.ts:982` / `cards-en.ts:295`
`"Park protestosu büyüyor efendim..."` → `"Meydan protestosu büyüyor efendim. Biber gazı mı, diyalog mu?"`
`'Park protests are growing, sir.'` → `'The square protests are growing, sir. Gas or dialogue?'`
*(30-32 birlikte yapılmazsa çift kart aynı olayı kurmaya devam eder.)*

**33.** `src/data/cards.ts:378`
→ `description: "Liman kentini kıl payı kaybettik efendim. Sandıkları yeniden saydıralım mı?"` / `leftChoice: "Yeniden saydır, biz kazanana kadar say"`

**34.** `src/data/cards-en.ts:119-120`
→ `description: 'We lost the capital and three big provinces, sir. Shall we have the count annulled?'` / `leftChoice: 'Annul it, we vote again'`

**35.** `src/data/cards.ts:1400`
`description: "Efendim... bu gece tanklar sokağa inecek. Son şansınız."` → `description: "Efendim... birlikler harekete geçti, şafakta saraya yürüyorlar. Son şansınız."`
`leftChoice: "Halkı sokağa çağır"` → `leftChoice: "Meydanları doldurt, canlı yayına çık"`

**36.** `src/data/cards-en.ts:416`
`'Call the people to the streets'` → `'Go on air, rally the loyalists to your gate'`

**37.** `src/data/cards.ts:3284`
→ `character: "Patlama Raporcusu"`, `description: "Bir sınır kasabasının pazar yerinde patlama. Onlarca ölü, fail belirsiz."`

**38.** `src/data/cards-en.ts:991`
→ `description: 'A bomb went off near a rally in a provincial town. Dozens hurt, the crowd scattered.'`
*(Bu soyutlama yapılmayacaksa kart tamamen kaldırılsın — "örtbas et" seçeneği gerçek bir katliamla eşleşiyor.)*

**39.** `src/data/cards.ts:3336-3337`
→ `character: "Barikat Komutanı"`, `description: "Dağ Vilayetleri'nin bazı mahalleleri barikatlarla kapatıldı, 'kurtarılmış bölge' ilan ediliyor."`
`leftChoice: "Tankları sokaklara sür, mahalleyi dümdüz et."` → `leftChoice: "Barikatları söktür, sokağa çıkma yasağı ilan et"` *(ordu +15 etkisi aynen kalsın)*

**40.** `src/data/cards-en.ts:1007`
→ `description: 'Barricades have gone up in the frontier towns. Whole quarters declared autonomous!'`, `leftChoice: 'Send the armour, clear the quarter street by street'`

**41.** `src/data/cards.ts:2656`
→ `description: "Kupa finalini Çöl Krallığı'nda oynuyoruz ama bayrağımızı tribüne sokmuyorlar."`
*("kurucumuzun posterleri" mutlaka çıkacak — hatırası özel kanunla korunan bir kişiyi hiciv malzemesi yapıyor.)*

**42.** `src/data/cards-en.ts:799`
→ `description: 'The Champions\' Cup final is being staged out in the Desert Emirate...'`, `leftChoice: 'Don\'t upset our hosts — that match will be played!'`

**43.** `src/data/cards.ts:2918` / `cards-en.ts:879`
`"571 hakemden 371'inin bahis hesabı varmış..."` → `"Hakemlerin üçte ikisinde gizli bahis hesabı çıktı. Çete federasyona sızmış."`
`'371 of 571 referees...'` → `'Nine in ten of the league\'s referees turn out to hold betting accounts...'`

**44.** `src/data/chainCardsByTurn.ts:157` / `-en.ts:139`
`"Yenilettiğiniz seçimde bu kez 800 bin fark yedik!"` → `"Yenilettiğiniz seçimde bu kez farkı üçe katladılar! Kendi sandık görevlilerimiz bile karşı tarafı alkışlamış."`
`'we lost by 800,000 votes this time!'` → `'they tripled their lead! Even our own poll workers were caught applauding them.'`

**45.** `src/data/chainCardsByTurn.ts:275` / `-en.ts:253`
→ TR: `"Denetlemediğimiz o dev yerli kripto borsasının kendini dahi ilan eden patronu, kasayı boşaltıp adı sanı duyulmamış bir ada ülkesine kapağı attı! Giderken tek bir mesaj bırakmış: 'Döneceğim.' Kriptozedeler kapıya dayandı."`
→ EN: `"The self-declared genius who ran that unregulated domestic exchange emptied the vault and slipped off to some island nation nobody can find on a map! He left one message: 'I'll be back.' Victims are at the gate."`

**46.** `src/data/cards.ts:2240` (soykırım kartı — App Store'da "objectionable content", Türkiye'de her iki seçenek ayrı hukuki risk)
→ `character: "Sürgün Torunları Temsilcisi"`, `characterEmoji: "📜"`,
`description: "Yüz yıl önceki 'Büyük Sürgün' için resmî özür bekleniyor. Uluslararası baskı artıyor."`,
`leftChoice: "Reddet, 'tarihi tarihçiler yazsın' de"`, `rightChoice: "Özür dile, tarih kitaplarını baştan yaz"`

**47.** `src/data/cards-en.ts:671`
→ `character: 'Exile Committee Delegate'`, `characterEmoji: '📜'`,
`description: 'A neighbouring state demands a formal apology for a century-old border war. International pressure is mounting.'`,
`leftChoice: 'Refuse, our historians say otherwise'`, `rightChoice: 'Apologize, the archives are clear'`

**48.** `src/data/electionData.ts:64` / `:178`
`Tarihi müzeyi ibadete aç` → `Devlet müzesini dinî bir cemaate tahsis et`
`Convert historic museum into a mosque` → `Hand the state museum over to a religious order`

**49.** `src/data/electionData.ts:252` / `:315`
`subtitle: "Yerel Seçim - Gezi'nin gölgesinde!"` → `subtitle: "Yerel Seçim - Meydan olaylarının gölgesinde!"`
`subtitle: "Local Election - In Gezi's shadow!"` → `subtitle: "Local Election - In the shadow of the square riots!"`

**50.** `src/data/electionData.ts:257` / `:320`
`name: "Paralel Yapı İftirası", description: "Muhalefeti 'paralel yapı' ile suçla"` → `name: "Gölge Örgüt İftirası", description: "Muhalefeti 'gölge örgüt' üyeliğiyle suçla"`
`name: "Parallel State Smear"...` → `name: "Shadow Order Smear", description: "Accuse the opposition of running a 'shadow order'"`

**51.** `src/data/electionData.ts:62`
`Terörü bitirmek için yine çözüm süreci başlat` → `Terörü bitirmek için yine 'barış masası' kur`

**52.** `src/data/gameOverScenarios.ts:32` (destenin en tehlikeli tek paragrafı)
→ `description: 'Yıllar önce dağıttığını sandığın tarikat, sarayın koridorlarında çoktan çoğalmıştı. Bir gece yarısı bütün telefonlar aynı anda çaldı; hiçbiri senin adamın değildi. Mühürler sabah olmadan el değiştirdi, muhafızların durduğu yerde yalnızca tütsü kokusu kaldı. Ekranlarda tek bir cümle dönüyor: "Kutsal Düzen geri döndü." Cüppeli figürler tahta oturdu, sen ise dar bir hücrede sabahladın.'`
Aynı bloktaki `title: 'Cemaat Darbesi!'` → `title: 'Tarikat Darbesi!'`; `emoji: '🕋'` → `emoji: '📿'` *(Kâbe emojisi tek bir dini adres gösteriyor)*

**53.** `src/data/gameOverScenarios-en.ts:32`
→ `description: 'The order you thought you had scattered years ago had already multiplied inside your own palace. One midnight every phone rang at once; none of them were yours. The seals changed hands before sunrise, and where your guards had stood there was only the smell of incense. The screens now scroll a single line: "The Holy Order has returned." Robed figures took the throne, and you spent the dawn in a narrow cell.'`

**54.** `src/data/gameOverScenarios.ts:40`
`'Tanklar sokağa indi, F-16'lar alçaktan geçiyor. Genelkurmay bildiri yayınladı: "Yönetim el değiştirdi." Meclis kuşatıldı...'`
→ `'Tanklar sokağa indi, savaş uçakları çatıları sıyıra sıyıra geçiyor. Yüksek Komuta Konseyi bütün kanalları kesip tek cümle okudu: "Yönetim el değiştirdi." Parlamento binası kuşatıldı...'`

**55.** `src/data/gameOverScenarios-en.ts:40`
→ `'Tanks on the streets, fighter jets shaving the rooftops. The High Command Council cut into every channel to read one line: "Power has changed hands." The parliament building was surrounded...'`

### 1.C — Açık adlar: kurum, marka, silah, millet, şehir

**56.** `src/data/cards.ts:824-826` → `description: "Doğu'nun füze kalkanını mı alacaksınız, Batı'nınkini mi? İkisini birden alamazsınız."`, `leftChoice: "Doğu'nun kalkanını al"`, `rightChoice: "Batı'nın kalkanını al"`

**57.** `src/data/cards-en.ts:247-248` → `'Will you buy the Eastern bloc\'s missile shield or the Alliance\'s? You can\'t have both.'`, `'Buy the Eastern shield'`, `'Buy the Alliance shield'`

**58.** `src/data/chainCardsByTurn.ts:91` → `"Kuzey ülkesi, depoda tozlanan o dev hava savunma bataryalarının fişini takmak için fahiş bir 'aktivasyon güncellemesi' parası istiyor!"`
`chainCardsByTurn-en.ts:77` → `"The Northern country wants an outrageous 'activation update' fee just to plug in those giant air-defense batteries gathering dust in the depot!"`

**59.** `src/data/cards.ts:820` → `character: "Barış Güçleri Temsilcisi"` / `cards-en.ts:246` → `character: 'Peace Forces Representative'`
*(imageId `nato_representative` kullanıcıya görünmüyor; `chainCardsByTurn.ts:89` ve `-en.ts:75` için de aynı, dosya adı yeniden adlandırılacaksa ayrı iş olarak planla.)*

**60.** `src/data/cards.ts:3442-3443` → `"...Hayalet uçakları alacak mısınız?"`, `leftChoice: "Hayalet uçak için avans öde"`
`cards-en.ts:1039-1040` → `'...Will you buy their stealth fighter?'`, `'Pay an advance for the stealth fighters'`

**61.** `src/data/cards.ts:3554` → `rightChoice: "Cezvede pişmiş kahve, bol köpüklü"`
`cards-en.ts:1200` → `rightChoice: 'Copper-pot coffee, extra frothy'`

**62.** `src/data/chainCards.ts:68` → `Tarikat dua ediyor: 'Atalarımızın kahvesi milli mirastır, cezveye el uzatanın eli kırılsın!'`
`chainCards-en.ts:68` → `The Cult prays: 'Our forefathers' coffee is sacred heritage — may the hand that touches the pot wither!'`

**63.** `src/data/chainCards.ts:12` → `character: "Dost Ülke İstihbarat Analisti"` / `chainCards-en.ts:12` → `character: "Friendly Nation Intelligence Analyst"`
*("Okyanus ötesi" türevlerini kullanmayın — o da gerçek bir lakap.)*

**64.** `src/data/cards.ts:3637` → `character: "İstihbarat Teşkilatı Şefi"` *(emoji 🦅 ve imageId aynı kalsın; "Gölge …" kullanmayın, 9999 numaralı karttaki "Gölge Danışman" ile çakışır)*
`src/data/cards.ts:2730` → `character: "İstihbarat Şefi"`

**65.** `src/data/cards.ts:1612` → `character: "Afet Kurumu Başkanı"`

**66.** `src/data/cards.ts:636` → `character: "İnanç Konseyi Başkanı"` / `cards-en.ts:198` → `character: 'Faith Bureau Director'`, `characterEmoji: '📿'`

**67.** `src/data/cards.ts:768` ve `:2028` → `character: "Kuvvetler Konseyi Reisi"` *(iki kullanım da)*

**68.** `src/data/cards.ts:2136` → `character: "Müzakere Elçisi"`, `description: "Dağ Vilayetleri'nde müzakere masası kuralım mı? Silahlar sussun."`
`cards-en.ts:639` → `'Should we start a peace process on the frontier? Let the weapons fall silent.'`

**69.** `src/data/cards.ts:3127, 3153, 3179, 3205, 3231, 3257, 3283, 3309, 3335, 3361` → `category: "Dağ Vilayetleri"` (on kartın hepsi)
`src/data/cards-en.ts` aynı on kart → `category: 'Highland Provinces'`
`cards.ts:3176` → `character: "Dağ Vilayetleri Valisi"` / `cards-en.ts:958` → `character: 'Highland Governor'`, `imageId: 'highland_governor'`
Kategori dizesi kod içinde başka yerde kullanılmıyor (grep ile doğrulandı) — yeniden adlandırma güvenli.

**70.** `src/data/cards.ts:3154` → `character: "Şair Vekil"`, `description: "Muhalefetin şair vekili cezaevinden kitap çıkardı, satış rekoru kırıyor. Serbest bırakalım mı?"`
`cards-en.ts:951` → `'An opposition MP jailed over a speech is publishing poems from his cell. Should we release him?'`
*("eş başkan" yapısı yaşayan tek bir kişiyi tarif ediyor — mutlaka gidecek.)*

**71.** `src/data/cards.ts:3232` → `'Çınar Partisi'ni kapatalım mı? "Örgüt bağlantısı" iddiaları var.'`; `:3228` → `character: "Çınar Partisi Milletvekili"`; emoji `🌈` → `🌿` (tüm kullanımlarda)
`cards-en.ts:975` → `character: 'Sycamore Party MP'`, `characterEmoji: '🌿'`, `description: 'The Sycamore Party is causing trouble in parliament.'`

**72.** `src/data/cards.ts:3642` → `description: "Ateş Ülkesi'nin sınır muhafızları savaşa gidince dağdaki silahlı gruplar ağır silahlarla donanmaya başladı. Sınır hattı ısınıyor."`
`cards-en.ts:1090` → `'...the Vale militia in the mountains started arming with heavy weapons'`
**Kritik:** silahlı grubun adı parti adıyla ASLA aynı olmayacak. Bütün mesele bu ayrım.

**73.** `src/data/cards.ts:3128` → `character: "Kale Muhafızı"`, `description: 'Kuledeki Mahkum\'dan mektup geldi: "Silahlar sussun, müzakere başlasın."'`; `:3254` → `character: "Kale Müdürü"`; `:3258` → `"Kuledeki Mahkum'un tecridini kaldıralım mı? Umut hakkı falan."` *("falan" alayı kalsın.)*
`cards-en.ts:943` → `'The Fortress Prisoner sent a letter calling for dialogue.'`; `:983` → `'The Fortress Prisoner is requesting talks.'`, `character: 'Fortress Warden'`

**74.** `src/data/cards.ts:2185` → `characterEmoji: "❄️"` *(character "Kuzey Ülke Elçisi" aynen kalsın)* / `cards-en.ts:654` → `characterEmoji: '❄️'`

**75.** `src/data/cards.ts:898-901` → `character: "Birlik Elçisi"`, `characterEmoji: "🕊️"`, `description: "Birliğe üyelik müzakereleri askıya alındı. Ne yapacaksınız?"`, `leftChoice: "Birliği unut, kendi yoluna"`
`cards-en.ts:270-272` → `character: 'Union Envoy'`, `characterEmoji: '⭐'`, `'The Union has frozen our accession talks. What will you do?'`, `'Union who?'`
*(🏳️ önerisini kullanmayın — teslim bayrağı okunur.)*

**76.** `src/data/cards.ts:1030` → `character: "Sosyal Kuş Ülke Müdürü"` / `cards-en.ts:310` → `character: 'Bird Platform Director'`, `imageId: 'bird_platform_director'` *(🐦 emojisi KALSIN — marka değil, gövdedeki "sosyal kuş" esprisini taşıyor.)*

**77.** `src/data/electionData.ts:255` → `name: "Cıvıltı Yasağı", emoji: "🐦", description: "Sosyal medyayı fişten çek"`
`:318` → `name: "Chirp App Blackout", emoji: "🐦", description: "Pull the plug on social media"`

**78.** `src/data/electionData.ts:275` → `description: "Seçim Divanı'na baskı yap, sandığı iptal ettir"`

**79.** `src/data/electionData.ts:285` → `name: "Rakam Makyajı", description: "Resmî verileri güzelleştir"`

**80.** `src/data/cards.ts:850` → `description: "Güney komşularımızda yeni bir savaş başladı. Taraf mı olacağız?"`

**81.** `src/data/cards.ts:3717` → `description: "Kovboy Diyarı savaşı 'kendi bitirmiş' gibi şov yapmak istiyor. Sahil kentimizde büyük bir barış masası kurup faturayı Kıta Birliği'ne keselim mi?"` *(leftChoice "Barış elçisi ol, otelleri doldur." aynen kalsın.)*

**82.** `src/data/chainCards.ts:42` → `"Tekrar geldi. Bu sefer o pahalı zincir kahveciden sipariş getirdi. 'Hatırladınız mı? Biz de sizi hatırladık.' dedi. Fatura 47 kese."`
`chainCards-en.ts:42` → `"They're back. This time with an order from that overpriced coffee chain. 'Remember us? We remember you.' The bill is 47 coins."`

### 1.D — DLC (Çöl Cephesi paketi): sistematik adlandırma

Aşağıdaki değişim `cards.ts` satır 3582, 3597, 3612, 3627, 3642, 3657, 3672, 3687, 3702, 3717 ve `cards-en.ts` 1066–1122 arasındaki eşlerinde **topluca** yapılacak. Tek tek düzeltme tutarsızlık üretir.

**83.** `Sarışın Şerif('in ülkesi)` → `Kovboy Diyarı` / `the Cowboy Country`
**84.** `Siyon / Siyonlar` → `Vaha Devleti` / `the Oasis State`
**85.** `Acem / Acemler / Acem rejimi` → `Ateş Ülkesi` / `the Fire Realm`
**86.** `Bağımsızlık jetleri` → `Vaha Devleti'nin jetleri` / `the Oasis State's jets`
**87.** `cards.ts:3597` → `description: "Ateş Ülkesi'nin rejimi sarsılıyor. Sınırda savaştan kaçan yüz binlerce sivil belirdi. Kapıları zorluyorlar, ne yapalım?"`
`cards-en.ts:1066` → `'The Fire Realm's regime is shaking. Hundreds of thousands of civilians fleeing the war have appeared at the border.'`
*("Sakallı Droncu" ve "2 milyon" mutlaka gidecek: bir halkı dinî görünüşle kodlamak App Store'un en sert başlığı.)*
**88.** `cards.ts:3598` → `leftChoice: "Aç kapıyı, biz kapımızı çalanı geri çevirmeyiz."` / `cards-en.ts:1067` → `'Open the gates — sheltering the stranger is sacred'`
**89.** `cards.ts:3672` → `description: "Ateş Ülkesi, uzak bir ülkenin başbakanının sözlerini füzelerin üstüne yazmış. Sosyal medyada 'Biz niye mühimmata şiir yazmıyoruz' isyanı var."`
`cards-en.ts:1106` → `'The Fire Realm's missiles took out the Grand Duchy's premier...'`
**90.** `cards.ts:3583` → `leftChoice: "Fişi çek, 'sincap kabloyu kemirdi' de."`

### 1.E — Kod dışı arayüz (denetimin tamamen atladığı katman)

**91.** `src/components/game/PremiumModal.tsx:15` → `desc: 'Karikatür avatarlar: Sarışın Tüccar, Roket Adam, Yıldız Mareşal.'`
`:21` → `desc: 'Caricature avatars: Blonde Trader, Rocket Guy, Star Marshal.'`
*("Siyon / The Zion" bir devleti dinî adıyla anıyor; imageId zaten `star_marshal`, yani yeni ad koda uyuyor.)*

**92.** `src/lib/userProfile.ts:65` → `nameTR: 'Yıldız Mareşal', nameEN: 'Star Marshal'`

**93.** `src/components/game/PremiumModal.tsx:14` → `desc: 'Büyük Çöl Cephesi Paketi — jeopolitik kararlar, gerçek sonuçlar.'`
`:20` → `desc: 'Great Desert Front Pack — geopolitical decisions, real consequences.'`
`:126` → `{lang === 'tr' ? 'Büyük Çöl Cephesi\nKriz Paketi' : 'Great Desert Front\nCrisis Pack'}`
**Not:** `ORTADOGU_PRODUCT_ID = 'com.denizerdogan.imuststay.ortadogu_pack'` **DEĞİŞMEYECEK** — StoreKit ürün kimliği kilitlidir, değiştirmek satın almaları kırar. Sadece görünen ad değişir. Fonksiyon adı `purchaseOrtadoguPack` de kalabilir (kullanıcıya görünmüyor).

**94.** `src/contexts/LanguageContext.tsx:37` → `...Alacaklılar saraya dayandı, Küresel Kredi Fonu yönetimi devraldı...`
`:75` → `...Creditors stormed the palace, the Global Credit Fund took control... auctioning off your golden toilet seats at a back-street market.`
*(`eBay` gerçek bir marka — mağaza incelemesinde ayrı bir kalem.)*

**95.** Seçim takvimi — **tek işlem, üç yerde birden**:
`src/data/electionData.ts:242,252,262,272,282,292` (TR) ve `305,315,325,335,345,355` (EN): `year` ve `title` içindeki yıllar → `2041, 2046, 2051, 2053, 2058, 2062`
`src/data/electionData.ts:381-386` (`getNextElectionInfo` içindeki sabit liste) → aynı yıllar. **Burası düzeltilmezse takvim `Index.tsx:225`'te ekranda görünmeye devam eder.**
`src/contexts/LanguageContext.tsx:15` `"Hedef 2028!"` → `"Hedef 2062!"`; `:56` `"Target is 2028!"` → `"Target is 2062!"`
`triggerTurn` değerleri DEĞİŞMEYECEK.

**96.** `src/data/electionData.ts:262/272` ve `325/335` alt başlıkları:
→ `subtitle: "Liderlik Seçimi - Kuralları sen yazdın!"` / `subtitle: "Ara Seçim - Kaybedersen tekrarlatırsın!"`
→ `subtitle: "Leadership Election - You wrote the rules!"` / `subtitle: "Interim Election - Lose it and you can rerun it!"`

---

## 2. Birikimli risk — kültürel parmak izi

Tek tek masumlar; kural olarak uygulanacaklar. Her grup **tek bir arama-değiştirme kuralıdır**.

### Grup A — Unvanlar
**Kural: Osmanlı-Türk devlet ve askerî unvanları kurgusal karşılıklarla değişir.**
`Paşa` → `Komutan` · `Vali` → `Genel Müfettiş` *(Dağ Vilayetleri kartları hariç, orada "Vali" kurgusal bağlamda kalabilir)* · `Müsteşar` → `Şef` · `Emniyet Müdürü` → `Güvenlik Teşkilatı Müdürü` · `Milli Savunma Bakanı` → `Savunma Bakanı` · `Anayasa Mahkemesi Başkanı` → `Yüksek Mahkeme Başkanı` · `Eski Başbakan` → `Eski Sağ Kolun`
Kalemler: `cards.ts:348, 558, 296`, `chainCardsByTurn.ts:87`, `bribeTexts.ts:60` (`'⭐ Paşalara lojman'` → `'⭐ Komutanlara villa tahsisi'` / `'⭐ Villas for the top brass'`), `cards-en.ts:1141` (`'Palace Cat Miyav Pasha'` → `'Palace Cat Marshal Meow'`).

### Grup B — Dinî terim ve semboller
**Kural: Belirli bir dini adlandıran yapı, unvan ve emoji kurgusallaşır; dinin siyasete karışması hicvi KALIR.**
`cami` → `mabet` / `house of worship` · `medrese` → `eski usul mektep` · `mürşid, şeyh, imam (rütbe olarak)` → `üstad, rehber, vaiz` · `türbe` → `kurucunun mezarı` · `ensar` → *(88 numaralı kalem)* · `Allah` → `kader`
Emoji kuralı: `🕌 → 🙏`, `🕋 → 📿`, `👳 → 📿`, `🤲 → ✨`
Kalemler: `cards.ts:640, 662, 688, 532, 2787`, `cards-en.ts:166, 190, 199`, `bribeTexts.ts:42, 43, 46, 48, 49, 51`, `electionData.ts:14, 128`.
`bribeTexts.ts:49` özel: `'👳 Cemaat okullarına kadro'` → `'🎓 Sadık mezunlara devlet kadrosu'` / `'🎓 Loyal graduates get state jobs'`

### Grup C — Kurum ve program adları
**Kural: Sözlükteki (Bölüm 0) karşılıklar dışında hiçbir gerçek kurum adı kalmayacak.**
`Varlık Fonu` → `Milli Kalkınma Kasası` (`chainCardsByTurn.ts:217`) · `İnsan Hakları Eylem Planı` → `Özgürlükler Yol Haritası` (`chainCardsByTurn.ts:27`, `-en.ts:17`) · `kayyum` → `merkezden atanan vekil` / `state administrator` (`cards.ts:1694, 2396`, `cards-en.ts:503`, `chainCardsByTurn.ts:158`, `-en.ts:140`) · `bedelli askerlik` → `askerlikten muafiyet satışı` (`cards.ts:2630`, `electionData.ts:21, 135`) · `kur korumalı mevduat` → `devletin kur farkını ödediği mevduat programı` (`cards.ts:1564`, `cards-en.ts:463`) · `geçiş garantisi` → `doluluk garantisi` (`cards.ts:1954`, `cards-en.ts:583`) · `dershane` → `özel hazırlık kursu` (`cards.ts:588`, `cards-en.ts:183`) · `bayram ikramiyesi` → `yıllık ikramiye` (`cards.ts:2604`, `cards-en.ts:783`) · `e-Bilet` → `kimlikli bilet` (`cards.ts:2945`) · `duble yol` → `otoyol` (`cards.ts:1617`) · `İHA` → `insansız uçak` (`bribeTexts.ts:63`, `cards.ts:2162, 3673`)

### Grup D — Para birimi ve çıplak rakamlar
**Kural: Gerçek para birimi adı geçmeyecek; gerçek veriye denk düşen her rakam ya kaydırılacak ya belirsizleştirilecek.**
`dolar/Dollar` → `döviz, kur, hard currency` (`gameOverScenarios.ts:16`, `-en.ts:16`, `cards.ts:2006`, `cards-en.ts:599`, `electionData.ts:267, 330`)
Rakam kaydırmaları:
- Enflasyon `%80 → %20` **→** `%140 → %25` (`cards.ts:142`) / EN `200% → 12%` (`cards-en.ts:47`)
- `5. kez merkez bankası başkanı` → `"Yine merkez bankası başkanını değiştiriyorsunuz. Kapıdaki tabelayı kurşun kalemle yazıyorlar artık."` (`cards.ts:1454`, `cards-en.ts:431`)
- `120 küsür milyar` → `Rezervden eriyen milyarlar` / `the missing billions` (`cards.ts:1590`, `cards-en.ts:471`)
- `300 küsür işçi` → `Yüzlerce işçi` / `Dozens of workers` (`cards.ts:1668`, `cards-en.ts:495`)
- `1000 odalı saray` → `"tepedeki yeni yazlık saray... Kaç oda olduğunu kimse sayamadı."` / EN `'three hundred rooms and two helipads'` (`cards.ts:1428`, `cards-en.ts:423`)
- `en az 3 evlat` → `en az 5 evlat` + `leftChoice: "5 az, 7 olsun! Üstüne madalya da verelim."` (`cards.ts:1510`, `cards-en.ts:447-448`)
- `Gram altın 7.000` → `"Altının gramı rekor üstüne rekor kırıyor."` (`cards.ts:3416`, `cards-en.ts:1031`)
- `50.000 kişi` → `binlerce isim` / `tens of thousands` (`cards.ts:744`, `cards-en.ts:223`)
- `2 milyar dolar + Arnavutluk` → 45 numaralı kalemde çözüldü
- `5000 falan` ikramiye → `"Sembolik artır, bir kilo et parası kadar"` / `'a token sum, enough for a photo op'` (`cards.ts:2604`, `cards-en.ts:784`)

### Grup E — Ürün, coğrafya ve deyimler
`fındık` → `kabuklu yemiş`, hasat yeri `kuzey yaylaları` (`cards.ts:1898/1902`, `cards-en.ts:566`) · `çay` → `tahıl/buğday` (`cards.ts:1872`, `cards-en.ts:558`) · `zeytin ağaçları` → `asırlık orman/meyve bahçeleri` (`cards.ts:1164`, `cards-en.ts:351`) · `soğan ve patates` → `temel gıda` (`cards.ts:1928`, `electionData.ts:71, 185`) · `şeker ve kağıt fabrikaları` → `çividen ipliğe her şey` (`chainCardsByTurn.ts:190`, `-en.ts:170`) · `halay` → `karşılama töreni` (`cards.ts:3207`, `cards-en.ts:968` — «davullu zurnalı» da KULLANMAYIN) · `Şahlanış` → `Büyük Atılım / Great Leap` (`electionData.ts:63, 177`) · `helalleşme` → `barışma turu / making amends tour` (`electionData.ts:113, 227`) · `mühürsüz oy` → `"bir depoda bulunan çuval dolusu oy"` (`cards.ts:2344`, `cards-en.ts:703`) · `kumpas` → `komplo / conspiracy` (`cards.ts:2866`) · `kaset` → `sahte görüntü / doctored footage` (`cards.ts:274`, `cards-en.ts:87`, `electionData.ts:35`) · `tripod` → `kamera karşısına geçmiş` (`cards.ts:1296`, `cards-en.ts:391`) · `çay fırlatan otobüs` → `bozuk para saçan otobüs` (`electionData.ts:13, 127`) · `püskevit` → `adı yanlış basılmış parti bisküvisi` (`electionData.ts:19`) · `epistemolojik kopuş` → `ontolojik sıçrama` (`electionData.ts:38, 152`) · `mutfaktan video` → `evinden el kamerasıyla video` (`electionData.ts:87, 201`) · `manda yoğurdu ve kestane balı` → `keçi sütü ve çam pekmezi` (`electionData.ts:51, 165`) · `yerli ve milli araba` → `'Öz be öz bizim' araba` (`electionData.ts:48, 162`) · `park nöbetçileri` → `meydandaki çadırcılar` (`electionData.ts:47, 161`) · `Cumhuriyet mitingi` → `Kuruluş yıldönümü mitingi` (`electionData.ts:97, 211`) · `Merkez Bankası` → `Ulusal Banka` (`gameOverScenarios.ts:16`, `-en.ts:16`) · `Meclis` → `Parlamento binası` (`gameOverScenarios.ts:40`) · `Saray` → `Mermer Saray` *(oyunun tamamında tutarlı özel ad)*

### Grup F — Deprem kümesi (üç kart aynı felakete dönüyor)
**Kural: "deprem" kelimesi kartların en fazla birinde kalır, diğer ikisi başka afete çevrilir.**
- `cards.ts:1616` → `description: "Yıllardır afet payı topluyoruz ama para nereye gidiyor belli değil."` / `cards-en.ts:479` → `'We've been collecting a disaster levy for twenty years and nobody can say where it went.'`
- `cards.ts:1642` → `"Afet bölgesinde kaçak yapılar teker teker çöküyor..."` / `cards-en.ts:487` → `'The unlicensed blocks in the flood belt came down like paper...'`
- `cards.ts:1114` civarı (imar affı kartı) deprem olarak kalabilir — biri kalsın, hiciv orada duruyor.
- `electionData.ts:40, 82, 154, 196, 288, 351`: `deprem` → `sel/afet`, `Deprem Kartı` → `Afet Kartı` / `Disaster Card`

---

## 3. Hizip adları — `tarikat`

**Teşhis:** `tarikat` oyunun beş temel gücünden biri; her kartın `leftEffects/rightEffects` dizisinde geçiyor, `gameLogic.ts`, `useGame.ts`, `achievements.ts`, `skillTreeConstants.ts`, `PowerBars.tsx`, `useBribe.ts`, `metaGame.ts`, testler dahil 24 dosyaya yayılmış. Metin metin düzeltmek mümkün değil.

**Karar: kod anahtarı `tarikat` AYNEN KALIR, yalnızca görünen etiket değişir.** Anahtar oyuncuya hiçbir yerde görünmüyor (doğrulandı: tek görünür yer `LanguageContext.tsx`'teki `power.*` etiketleri).

Uygulama — **üç satır, sıfır refactor riski**:

1. `src/contexts/LanguageContext.tsx:28` → `"power.tarikat": "Kutsal Düzen",`
2. `src/contexts/LanguageContext.tsx:67` → `"power.tarikat": "The Holy Order",`
3. `src/contexts/LanguageContext.tsx:49` → `"tutorial.desc.tarikat": "Kutsal Düzen sana lanet okuyor! Bir bağışla ruhunu kurtar?",` (EN eşi de aynı adla)

Ardından **serbest metinde geçen "tarikat" kelimeleri** yeni etikete hizalanır:
- `src/components/game/AbsoluteVictoryScreen.tsx:25` → `'Kutsal Düzen sana tapıyor.'`
- `:38` → `'Kutsal Düzen "ilahi irade" dediğinde senin adını sayıyor.'`
- `src/data/cards.ts:2422` → `"Üniversite yurdunda Kutsal Düzen'in gizli faaliyetleri tespit edildi. Öğrenciler isyanda."`
- `src/data/bribeTexts.ts:43` → `{ tr: '📿 Kutsal Düzen'in üstadı saraya davet edildi', en: '📿 The Holy Order's Master invited to the palace' }`
- `src/data/gameOverScenarios.ts:31` başlığı → `title: 'Kutsal Düzen Darbesi!'` (52 numaralı kalemle uyumlu)
- `src/data/cards-en.ts` kategori dizesi `'Religious Order'` → `'The Holy Order'`
- `src/data/cards.ts` kategori dizesi `"Tarikat"` → `"Kutsal Düzen"`

**Neden "Kutsal Düzen":** dinî-mistik ton ve tarikat +5/+10 mekaniğinin komiği korunur; tek bir inanç geleneğine bağlanmaz; İngilizce `Cult` etiketinden daha iyi çalışır. **"Cemiyet" önerisini uygulamayın** — o da Türkiye'ye özgü bir örgütlenme terimi, sorunu yer değiştirir.

Diğer dört hizip (`halk`, `ordu`, `mafya`, `yatirimcilar`) evrensel; **dokunulmayacak**.

---

## 4. Dokunulmayacaklar — bilinçli karar

Bunlar denetimde işaretlendi ve **kasten bırakılıyor**. Gerekçesiz temizlik oyunu hicivsizleştirir; hicivsiz bir hiciv oyununu kimse indirmez.

| Kalem | Neden bırakılıyor |
|---|---|
| `cards.ts:2579` `'"Gidin, biz istemiyoruz" de'` | Birebir alıntı değil, jenerik küçümseme. **UYARI: "Yolcu yolunda gerek" önerisini UYGULAMAYIN** — o gerçek ve hatırlanan bir alıntı; riski azaltmaz, artırır. |
| `cards-en.ts:167` `'The Grand Master sends his regards.'` | "Grand Master" masonik-genel bir unvan. Önerilen "The Elder" gerçek referansın bilinen hitabına YAKLAŞIYOR — uygulanmasın. |
| `cards-en.ts:30` `'Your Son-in-law'` | Damat nepotizmi en az iki ünlü uluslararası karşılığı olan evrensel bir hiciv kalıbı. İstenirse "Brother-in-law"a kaydırılır, ama önceliğin en sonu. |
| `cards-en.ts:815` `'domestic car project'` | Millî otomobil Proton'dan VinFast'e evrensel bir tür. **"people's car" önerisini UYGULAMAYIN** — birebir Volkswagen demektir, gerçek markaya geçiş olur. |
| `cards.ts:2058` iki denizi birleştiren kanal | Süveyş'ten Nikaragua'ya evrensel megaloman proje klişesi. Tek kelimelik coğrafya kaydırması (`çölü yarıp`) yeter, tünele çevirmek başka bir espri olur. |
| `cards.ts:2266` düşürülen savaş uçağı | Sınırda uçak düşürme çok ülkede yaşandı; sadece "Kuzey ülkesi" nitelemesi kalksın. **"casus balonu" önerisini UYGULAMAYIN** — bir gerçek olayı başka bir gerçek olayla değiştiriyor. |
| `cards.ts:2032` emekli subay bildirisi | Kart korunur, sadece "amiral"→"general" ve "sabah gözaltısı"→"şafak vakti" soyutlanır. **"paşalar" kelimesini ÖNERİ OLARAK KULLANMAYIN** — kendisi parmak izi. |
| `cards.ts:2318` altın musluk | İsraf hicvi evrensel; "kristal fıskiye"ye kaydırmak yeterli, kart kalır. |
| `cards.ts:692` evrim müfredattan çıkarma | Yaratılışçılık hicvi ABD'den Suudi Arabistan'a evrensel ve kartın komik yanı. Yalnızca "eski dilimiz" kısmı değişir. |
| `cards.ts:640` "her mahalleye mabet" repliği | Kart Grup B kuralıyla soyutlandıktan sonra kalır — dinin bütçeye çökmesi hicvi kartın motoru. |
| `bribeTexts.ts:47` `🌙 İftar sponsorluğu` | İftar Türkiye'ye değil geniş bir coğrafyaya ait; siyasi gönderme yok. Grup B blok olarak uygulanırsa bu satır da hizalanır, tek başına ayıklanmaz. |
| `cards-en.ts:551` kadın hakları sözleşmesi | Sözleşmenin gerçek adı metinde hiç geçmiyor, çekilme tartışması birden çok ülkede yaşandı. TR eşi (`cards.ts:1850`) yine de soyutlansın, EN'e dokunmak gereksiz. |
| `cards-en.ts:687` rezerv yakarak kuru tutma | Arjantin'den Mısır'a sayısız merkez bankasının yaptığı şey. |
| `cards.ts:2760` uzay programı | Ay hedefi Hindistan'dan BAE'ye evrensel gurur klişesi; "bütçeyi sonra düşünürüz" eklemesi hicvi büyütür, gönderme zayıflar. |
| `mafya`, `ordu`, `halk`, `yatirimcilar` hizipleri | Tamamen evrensel. |
| `Çöl Krallığı`, `Kuzeyli Ayı`, `Barış Güçleri`, `Kovboy Diyarı` gibi takma adlar | Takma adla ülke anmak oyunun tüm rejistri; yasaklamak oyunu öldürür. Takma ad **kurumlaştıkça** güvenli hale gelir — asıl risk gerçek ada dönmekti, o Bölüm 1.D'de kapatıldı. |
| `ORTADOGU_PRODUCT_ID` ve `purchaseOrtadoguPack` | StoreKit kimliği ve iç fonksiyon adı; kullanıcıya görünmüyor, değiştirmek satın almaları kırar. |
| `imageId` alanları (`nato_representative`, `eu_ambassador`, `radiant_order_informant`, `white_house_advisor` vb.) | Kullanıcıya görünmüyor. Yeniden adlandırma ayrı bir görsel-varlık işi; bu turda kapsam dışı, **ayrı bir bilet açılsın**. |

---

## 5. Sayılar

**Ham denetim çıktısı:** ~215 kayıt. Tekrarlar (aynı satırın iki denetçi tarafından ayrı ayrı bildirilmesi — ör. NATO/S-400/Türk kahvesi/Güneydoğu üçer kez) ve çelişen öneriler (aynı satır için üç farklı karşılık) ayıklandığında:

| | Adet |
|---|---|
| Numaralı, doğrudan uygulanabilir eylem (Bölüm 1) | **96** |
| Bunlardan iki dili birden kapsayan çift kalem | 41 |
| Grup kuralı (Bölüm 2, tek tek satır değil kural) | **6 grup / ~70 satır** |
| Hizip işlemi (Bölüm 3) | 3 satır + 7 metin hizalama |
| Bilerek bırakılan | **18 kalem** |
| Denetimin tamamen atladığı, bu turda eklenen yeni bulgu | **9** (`PremiumModal.tsx` ×3, `userProfile.ts` avatar "Siyon", `LanguageContext.tsx` IMF+eBay ×2, `LanguageContext.tsx` "Hedef 2028" ×2, `gameOverScenarios.ts` 🕋 emojisi) |

**Risk dağılımı (eylem bazında):** yüksek 96, orta ~55, düşük ~15.

**Dosya yoğunluğu:**

| Dosya | Eylem | Not |
|---|---|---|
| `src/data/cards.ts` (3.725 satır) | ~78 | Riskin merkezi; DLC bloğu (3.582-3.725) ve Dağ Vilayetleri bloğu (3.127-3.361) tek başına 30 kalem |
| `src/data/cards-en.ts` (1.217 satır) | ~55 | TR ile eş; **aynı commit'te değişmezse gönderme çeviri üzerinden geri gelir** |
| `src/data/electionData.ts` (394 satır) | ~35 | Satır başına en yoğun dosya — yıl dizisi tek başına dosyadaki en güçlü parmak izi |
| `src/data/chainCardsByTurn.ts` + `-en.ts` | 12 | AİHM ve S-400 kalemleri yüksek riskli |
| `src/data/bribeTexts.ts` (70 satır) | 8 | Neredeyse tamamı Grup B (dinî semboller) |
| `src/data/gameOverScenarios.ts` + `-en.ts` | 8 | 44 satırlık dosyada 4 yüksek riskli paragraf — oran olarak en kirli |
| `src/data/chainCards.ts` + `-en.ts` | 6 | CIA ve Türk kahvesi |
| Arayüz/kod dosyaları | 9 | `PremiumModal.tsx`, `userProfile.ts`, `LanguageContext.tsx` — **denetim bu katmanı hiç taramamış** |

**Uygulama sırası önerisi:** Bölüm 0 sözlüğü → 1.A + 1.B (hukuki risk) → 1.C + 1.D (açık adlar, toplu değiştirme) → 1.E (arayüz) → Bölüm 3 (hizip, tek commit) → Bölüm 2 (grup kuralları). Her aşamadan sonra `npm run build` + `npx cap sync ios`; `src/test/gameLogic.test.ts` hizip anahtarına dayandığı için Bölüm 3'ten sonra testler yeşil kalmalı (anahtar değişmediği için kalacak — kırmızıya dönerse etiket yerine anahtar değiştirilmiş demektir, geri alın).