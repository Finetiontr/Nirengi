# NİRENGİ: Pazar ve Rakip Analizi

*Hazırlanma tarihi: 8 Ekim 2026 · Zemin360 Hackathon (9–11 Ekim 2026) öncesi*

> **Okuma notu.** Buradaki rakamların hepsi bölüm sonlarındaki kaynaklardan alındı. Şirketlerin kendi beyan ettiği rakamlar "(şirket beyanı)" diye işaretlendi. Bulunamayan ya da kaynaklar arasında çelişen sayılar için **doğrulanamadı** yazıldı. Nirengi'ye dair tespitler `docs/BASVURU.md`, `README.md`, `PRODUCT.md`, teknik tasarım belgesi (`Untitled.pdf`) ve çalışan koddan (`src/lib/engine/progress.ts`, `src/components/genc/*`) çıkarıldı.

---

## 0. Tek paragrafta sonuç

Pazarda iki ayrı dünya var ve birbirlerine dokunmuyorlar. **Oyunlaştırılmış öğrenme** tarafında (Duolingo, Codewars, LeetCode, Sololearn) genç çok vakit geçiriyor, ama kazandığı XP uygulamanın dışında hiçbir işe yaramıyor. **İşe alım ve eşleşme** tarafında (Youthall, Anbean, Coderspace, HackerRank, Riipen, Parker Dewey) kurum para ödüyor, ama gencin elindeki tek kanıt ilan başvurusu, bir test skoru ya da bir katılım sertifikası. Nirengi bu iki dünyayı birbirine bağlayabilir. Oyun döngüsü (XP, seri, lig) yalnızca **dışarıda doğrulanabilen üretimden** beslenir: birleştirilmiş PR, S2 makine doğrulaması, S3 kurum onaylı kilometre taşı. Kurum ise ilan değil **ölçülebilir ihtiyaç** yazar ve iki tarafın onayladığı küçük bir pilotla, CV görmeden işi denemiş olur. Türkiye'de bu bileşimi sunan bir platform bulamadık. En yakın örnekler olan Coderspace ve Patika test ile bootcamp üzerinden işe alım yapıyor; Youthall ve Anbean ise ilan ile etkinlik üzerinden çalışıyor.

---

## 1. Rakip haritası

### 1.1 Proje ve mikro-staj eşleşmesi

| Platform | Ne yapar | İş modeli | Gence / kuruma somut fayda | Zayıf yanı | Nirengi'nin farkı |
|---|---|---|---|---|---|
| **Riipen** (Kanada) | Kurum projelerini üniversite derslerine bağlar; eğitmen eşleştirir, öğrenci ders kredisi alır | Kurum ve öğrenci için ücretsiz olduğunu söylüyor (şirket beyanı); okullardan nasıl gelir aldığı **doğrulanamadı** | Genç: ders kredisi ve gerçek proje. Kurum: ücretsiz proje gücü; proje başına öğrenci başı ~80 saat, 2–8 hafta | Okula ve derse bağlı. Ders dışı gence kapalı. Kalite eğitmene bağlı (bir kurum yorumunda öğrencilerin ilgisiz kaldığı yazıyor). İşveren sayısı kendi sayfalarında bile tutarsız (53 bin / 35 bin+) | Okul aracı olmadan doğrudan genç. Pilot çıktısı, ders notu yerine **imzalı, taşınabilir S3 kanıtına** dönüşüyor |
| **Parker Dewey** (ABD) | 10–40 saatlik ücretli "micro-internship"ler | Kurum proje başına sabit ücret öder (çoğunlukla $200–600). ~%90'ı öğrenciye gider, ~%10'u platformda kalır. Ödeme emanette (escrow) tutulur. Abonelik $5.000'dan başlar | Genç: ücretli, kısa, gerçek iş. Kurum: düşük riskli deneme, işe alırsa ek ücret yok | ABD odaklı. Kanıt platformun içinde kalıyor, dışarı taşınabilir bir sertifika üretmiyor. Eşleşme gerekçesi görünmüyor | Kilometre taşlarını **çift onaylı, hash zincirli deftere** yazar. İhtiyaç önce kanvasla netleşir, eşleşme gerekçesi açıktır. Ücret ve escrow ise **Nirengi'de yok** (bkz. §4d) |
| **Forage** (EAB'ye ait) | Kurumların hazırladığı açık, kendi hızında ilerlenen "job simulation"lar | Öğrenciye ücretsiz; kurum simülasyon üretimi ve barındırması için ödüyor | Genç: işi önceden tadar, sertifika alır. Kurum: işveren markası ve aday havuzu. "Forager"ların mülakata daha çok çağrıldığı iddiası şirketin kendi araştırmasına dayanıyor | Simülasyon **kurgusal**: aynı görevi milyonlarca kişi yapıyor, ayırt ediciliği düşük. 6 milyon öğrenci mi 10 milyon kayıt mı belli değil | Görev kurgu değil, **gerçek bir kurumun gerçek ihtiyacı**. Çıktı herkesin yaptığı ortak bir görev değil, kişiye özgü bir kanıt |
| **Handshake** (ABD) | Kampüs iş ve staj ağı; 2025'ten beri "Handshake AI" ile öğrencilere ücretli yapay zekâ eğitimi işleri veriyor | Kurum aboneliği + yapay zekâ laboratuvarlarına uzman emeği satışı. Sacra'nın Nisan 2026 tahminine göre ~$1,1 milyar brüt yıllık gelir; çoğu yapay zekâ eğitimi işinden | Genç: 15 milyon+ öğrenci ağı (şirket beyanı), saatte $30–125 ücretli yapay zekâ işi. Kurum: Fortune 500'ün tamamına eriştiğini söylüyor (şirket beyanı) | Ağ ABD kampüslerine bağlı. Yapay zekâ işleri birikimli bir kariyer kanıtı bırakmıyor. Ana iş kampüs ilan panosu | Nirengi kampüse değil **üretime** bağlı. Ölçeği yok, ama kanıt modeli Handshake'te yok |
| **Prosple** (Avustralya ve diğer ülkeler) | Mezun işe alım pazarlaması; 1–2 saatlik "virtual experience" programları ve dijital rozet | Kurumlar ve üniversiteler öder; fiyat açıklanmıyor | Genç: ücretsiz kısa deneyim + LinkedIn'de paylaşılabilir rozet. Kurum: marka ve aday akışı | Sanal deneyim kısa ve kurgusal; rozet katılımı gösteriyor, yetkinliği değil | Rozet katılımı değil, **sonucu karşı tarafın onayladığı işi** gösterir |
| **Symplicity CSM** | Üniversite kariyer merkezi yazılımı: ilan, fuar, randevu, CV oluşturucu | Üniversiteye kurumsal lisans; 1.300+ kurum (2020, şirket beyanı) | Kurum: kampüse erişim. Genç: okulun kariyer portalı | Okulun idari aracı, eşleşme zekâsı yok, kanıt katmanı yok | Nirengi üniversiteye satılan bir yönetim yazılımı değil, **ekosistem altyapısı**. İleride kariyer merkezleri Nirengi kanıtlarını içeri alabilir |

**Kaynaklar (1.1)**
- Riipen: https://www.riipen.com/program/futurepath · https://learn.riipen.com/us-academic/ · https://help.riipen.com/en/articles/7321557-how-learners-use-riipen · https://app.riipen.com/feedback_recipients/KVG2BxLM · https://edsurge.com/news/2019-12-11-riipen-raises-3-75-million-to-unite-college-students-and-employers-via-course-projects
- Parker Dewey: https://www.parkerdewey.com/pricing · https://www.parkerdewey.com/faq · https://www.parkerdewey.com/help/knowledge-base/micro-intern-payments-info-for-employers · https://www.parkerdewey.com/blog/micro-internships-by-the-numbers-2022
- Forage: https://www.theforage.com/about · https://career.kzoo.edu/?p=4050
- Handshake: https://support.joinhandshake.com/hc/en-us/articles/32264709473303 · https://sacra.com/research/handshake · https://dealroom.co/news/127345-handshakes-arr-crosses-1b-as-ai-training-revenue-surges/ · https://register.transform.us/2025/sponsor/672736/handshake
- Prosple: https://www.smartcompany.com.au/smart50-awards-2023/31-prosple/ · https://www.unsw.edu.au/business/career-accelerator/student-resources/virtual-training/prosple-virtual-experiences
- Symplicity: https://www.gonzaga.edu/news-events/stories/symplicity-zagsignite · https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud/services/201300849092155

### 1.2 Beceri kanıtı ve değerlendirme

| Platform | Ne yapar | İş modeli | Somut fayda | Zayıf yanı | Nirengi'nin farkı |
|---|---|---|---|---|---|
| **HackerRank** | Kodlama testi ve mülakat platformu; adaylar için pratik ve sertifikalar | Kurum aboneliği. 2025'te Starter ~$1.990/yıl, Pro ~$4.490/yıl (üçüncü taraf). 2026 fiyatları kaynaklar arasında çelişkili | Kurum: ölçekli eleme. Genç: tanınan sertifika | Zamanlı, yapay bir test ortamı. Yapay zekâ ile kopya yapılması büyüyen bir sorun. Gencin gerçek üretimini görmüyor | Test değil **gerçek dünyada üretilmiş iş**. Skor formülü açık |
| **Codility / HackerEarth** | Teknik eleme testleri, intihal tespiti, yapay zekâ mülakat ajanı | Kurum aboneliği (davet başına; ör. ~$100–500/ay, rakip karşılaştırmasından) | Kurum: hızlı eleme | Aynı sorunlar: kara kutu skor, kopya ile yarış, adaya geri bildirim yok | **Eksik kanıt geri bildirimi**: "%70 uyuyorsun, şu alanda doğrulanmış kanıtın eksik" |
| **Kaggle** (Google) | Veri bilimi yarışmaları; Novice'ten Grandmaster'a 5 kademeli ilerleme, 4 ayrı alan | Google ekosistemi; yarışmaları kurumlar ödüllendiriyor | Genç: küresel itibar. ~23 milyon hesap (Nisan 2025, Wikipedia), Grandmaster sayısı 612. Kurum: çözüm ve yetenek | Yalnız veri bilimi. Liderlik tablosu kültürü ilk 1'e odaklı. Kurumun kendi problemini yazması pahalı | Problem küçük, yerel ve **kanvasla netleşmiş**. Ödül yerine pilot ve kanıt |
| **Topcoder** (Wipro) | Kurum işini küçük yarışmalara bölen kitle kaynaklı geliştirme | Kurum öder; kazanan ödül alır. Tarihsel olarak kod yarışmalarında $600–1.200 birincilik | Genç: ücretli iş ve sıralama. Kurum: sonuç odaklı ödeme | "Kazanan her şeyi alır" modeli kaybedenin emeğini boşa harcatıyor. Topluluk büyüklüğü 0,9–1,5 milyon arasında, **doğrulanamadı** | Rekabet yok, **bire bir pilot**. Başarısız pilot da gerekçesiyle kapanır ve kayda geçer |
| **Credly / Open Badges 3.0** | Dijital rozet ağı (Pearson); OB 3.0 bir W3C Verifiable Credential | Rozeti veren kurum öder | 100 milyonuncu rozet Ocak 2025'te verildi; ~48 milyon kazanan (şirket beyanı) | Rozet **kursu tamamladığını** gösteriyor, iş çıktısını göstermiyor | Nirengi bir rozet **kaynağı** olabilir: yol haritasında OB 3.0 / VC dışa aktarımı var. Rakip değil, kanal |
| **GitHub tabanlı profil araçları** (CodersRank, OpenSauced vb.) | GitHub verisinden geliştirici puanı ve profili çıkarır | CodersRank 2023'te Gigster'a satıldı (CB Insights). OpenSauced'un 2024'te Linux Foundation'a geçtiği tek bir zayıf kaynakta geçiyor, **doğrulanamadı** | Genç: otomatik profil | Tek yönlü puan; kurum ihtiyacı yok, pilot yok. Bu kategoride birçok girişim sahip değiştirdi ya da küçüldü | GitHub verisi Nirengi'de yalnızca **bir giriş kapısı**. Asıl değer ihtiyaç → pilot → S3 döngüsünde |

**Kaynaklar (1.2)**
- HackerRank: https://www.shadecoder.com/blogs/hackerrank-pricing-(2025) · https://pricingsaas.com/companies/hackerrank · https://www.noon.ai/blog/articles/327-hackerrank-pricing-2026
- Codility / HackerEarth: https://www.hackerearth.com/recruit/comparison/codility-alternative/ · https://g2.com/products/hackerearth-assessments/pricing · https://www.hackerearth.com/blog/10-best-technical-screening-services-to-evaluate-developer-skills-in-2026
- Kaggle: https://en.wikipedia.org/wiki/Kaggle · https://softwareengineeringdaily.com/wp-content/uploads/2025/02/SED1817-Chris-Deotte-and-Jean-Francois-Puget.txt
- Topcoder: https://en.wikipedia.org/wiki/Topcoder · https://www.hfsresearch.com/research/enterprise-leaders-must-rethink-how-they-source-talent-wipro-and-topcoder-can-show-them-how/
- Credly / OB 3.0: https://plc.pearson.com/en-GB/news-and-insights/news/100-million-digital-credentials-issued-through-credly-pearson-fosters-future · https://plc.pearson.com/en-GB/news-and-insights/blogs/100-million-ways-pearson-has-fuelled-learning-economy · https://www.1edtech.org/1edtech-article/new-open-badges-30-standard-provides-enhanced-security-and-mobility/411060 · https://info.credly.com/product/open-badge-3.0
- CodersRank / OpenSauced: https://www.cbinsights.com/company/codersrank · https://www.plushcap.com/companies/opensauced

### 1.3 Oyunlaştırılmış öğrenme (kodlama, dil, tarih vb.)

| Platform | Mekanik | İş modeli | Gence somut fayda | Zayıf yanı (Nirengi açısından) | Nirengi'nin farkı |
|---|---|---|---|---|---|
| **Duolingo** | Seri (streak), XP, haftalık lig, kişiselleştirilmiş bildirim, maskot Duo | Freemium + abonelik. Q2 2025: 47,7 milyon DAU (+%40), 10,9 milyon ücretli abone | Dil alışkanlığı | XP **uygulamanın içinde kalıyor**; işverene bir şey kanıtlamıyor | Aynı gramer (seri, lig, görev), ama her XP **dışarıda doğrulanabilen bir olaya** bağlı ve günlük 200 XP tavanı var |
| **Codewars** | Kata; Japon dövüş sanatlarından alınma 8 kyu → 8 dan rütbe; "honor" puanı | Freemium | Algoritma pratiği, topluluk çözümleri | Bulmaca dünyası, ürün değil | Görevler gerçek açık kaynak **issue**'ları; PR birleşince sayılıyor |
| **Exercism** | 80'e yakın dil, gönüllü mentorlu geri bildirim | Kâr amacı gütmeyen, %100 ücretsiz; ~2,58 milyon öğrenci, ~19,6 bin mentor (şirket beyanı) | İnsan geri bildirimi | İşverene bağlantı yok | Mentorluk ve mikro-etkileşim (30 dk görüş, kod incelemesi) Nirengi'de **kanıt olayı** sayılıyor |
| **LeetCode** | Problem setleri, yarışmalar, şirket etiketli sorular | Premium ~$35/ay veya ~$159/yıl (üçüncü taraf) | Mülakat hazırlığı | Mülakat **ezberine** yönelik, gerçek işe değil | Mülakat kapısının öbür tarafı: kurumla doğrudan pilot |
| **Brilliant** | Kısa etkileşimli matematik, bilim ve CS dersleri | Abonelik; 10 milyon+ öğrenen (şirket beyanı) | Kavramsal anlama | Kariyer çıktısı yok | — |
| **Codecademy** (Skillsoft) | Etkileşimli kodlama kursları, kariyer yolları | Abonelik. Skillsoft ~$525 milyona satın aldı (2022); ~40 milyon kayıtlı öğrenen (o tarihte) | Yapılandırılmış müfredat | Sertifika ≠ üretim kanıtı | — |
| **Mimo / Sololearn** | Mobil mikro-ders, seri, puan, lig, rozet | Freemium. Sololearn 30–35 milyon **kayıt** (şirket beyanı). Mimo kullanıcı sayısı **doğrulanamadı** | Cepte kodlama alışkanlığı | Kayıt sayısı aktif kullanıcı demek değil; üretim yok | — |
| **Frontend Mentor** | Gerçek tasarım dosyasından proje; puanla **işe alım profili**; işverene ayrı hiring platformu | Pro abonelik + işveren aboneliği (14 gün deneme). Eski bir profilde ücretliye dönüşüm %1'in altında | Portfolyo projesi, işverene görünürlük | Projeler herkes için aynı → ayırt ediciliği düşük | **Yöne en yakın rakip.** Fark: Nirengi'de iş gerçek bir kurumun gerçek ihtiyacı ve kurum sonucu imzalıyor |
| **Tarih ve genel kültür örnekleri** (Assassin's Creed Discovery Tour, Kahoot tarih koleksiyonu, Seterra) | Çatışmasız tarih turu + quiz; sınıf içi yarışmalı quiz; harita quiz'i | Oyun satışı / freemium | Merak ve motivasyon | Öğrenme etkisi kanıtı zayıf. Montreal çalışmasında (~330 öğrenci) tur öğretmenden daha az öğretti. Kariyer bağlantısı hiç yok | Nirengi bir öğrenme uygulaması değil. Ders: **oyunlaştırma tek başına beceri kanıtı üretmiyor** |

**Bu kategoriden çıkan ders:** Gençler oyunlaştırılmış uygulamalara alışkın. Bu yüzden "neden burada uğraşayım" sorusunun cevabı daha eğlenceli olmak değil, **"burada kazandığım şey dışarıda geçerli"** olmalı. Duolingo'nun XP'si bir işverenin gözünde sıfır değer taşıyor. Nirengi'nin XP'si ise tanımı gereği bir kanıt makbuzu. Kod bunu destekliyor: `activeDay` 10, `evidence` (S2) 40, `milestone` (S3) 120 XP; açık kaynak görevi PR birleşince sayılıyor; günlük tavan 200 XP.

**Kaynaklar (1.3)**
- Duolingo: https://www.sec.gov/Archives/edgar/data/1562088/000156208825000165/q2fy25duolingo6-30x25share.htm
- Codewars: https://docs.codewars.com/gamification/ranks/ · https://docs.codewars.com/gamification/honor
- Exercism: https://exercism.org/about/impact
- LeetCode: https://www.lodely.com/blog/leetcode-premium-cost · https://www.designgurus.io/answers/detail/is-leetcode-free-or-paid
- Brilliant: https://apps.apple.com/MX/app/id913335252
- Codecademy: https://www.codecademy.com/resources/blog/codecademy-skillsoft-acquisition · https://www.nasdaq.com/press-release/skillsoft-to-acquire-codecademy-a-leading-platform-for-learning-high-demand-technical
- Sololearn / Mimo: https://pulse2.com/sololearn-yeva-hyusyan-profile/ · https://skillnation.in/posts/mimo-learn-to-code/
- Frontend Mentor: https://www.frontendmentor.io/guides/free-vs-premium-challenges · https://hiring.frontendmentor.io
- Tarih: https://variety.com/2018/gaming/news/assassins-creed-origins-discovery-tour-effectiveness-1202861325 · https://techcrunch.com/2019/09/10/assassins-creed-odyssey-gets-an-educational-mode-complete-with-quizzes/ · https://kahoot.com/blog/2017/10/23/history-games-ready-to-play-kahoot-collection/ · https://www.universityxp.com/research/2022/4/2/gamification-in-history-learning-a-literature-review

### 1.4 Türkiye

| Platform | Ne yapar (doğrulandı) | İş modeli | Somut fayda | Zayıf yanı | Nirengi'nin farkı |
|---|---|---|---|---|---|
| **Youthall** | 18–35 yaş için staj, yeni mezun ve MT ilanları; şirket profilleri, anonim şirket yorumları, etkinlikler | Kurumsal paketler (ilan, aday havuzu, kredi); genç için ücretsiz | Gence: profil ile hızlı başvuru, CV şart değil. Kuruma: 1.200+ şirket (şirket beyanı). 2022'de 1.365 ilana 752.368 başvuru (şirket blogu). 1,3 milyon+ aktif kullanıcı (tarihsiz, üçüncü taraf) | İlan başına ~550 başvuru: **gürültü**. Kanıt yerine beyan. Kurum adayı ayırt etmekte zorlanıyor | İlan değil ihtiyaç; başvuru yığını değil, gerekçeli kısa liste |
| **Anbean Kampüs** | Kariyer platformu: etkinlik (meetup, ideathon, hackathon, iş simülasyonu), ilan, kulüp ağı, CV oluşturucu, not hesaplayıcı | Genç için ücretsiz; şirketler sayfa, ilan ve etkinlik açıyor | Etkinlik, network, sertifika | Etkinlik katılımı ≠ yetkinlik. Ürün dili bilinçli olarak "kariyer sitesi"; ekip de bu görünümden ayrışmak istiyor (PRODUCT.md) | Etkinlik yerine ölçülen pilot |
| **Kariyer.net** (stajyer ilanları) | Genel iş ilanı sitesinin staj ve stajyer kategorisi | Kurum ilan paketi | Geniş erişim | Genç için ayrı bir kanıt veya değerlendirme katmanı **doğrulanamadı**; ilan modeli | — |
| **Coderspace** | Yazılımcı profili (GitHub/LinkedIn bağlanabiliyor), HackerRank entegre testler, "ters işe alım", hackathon, datathon, şirket sponsorlu ücretsiz bootcamp, teknik işe alım danışmanlığı | Kurum öder (işe alım, işveren markası, bootcamp). 200 bin+ yetenek, 500+ ekip (şirket beyanı) | Genç: ücretsiz bootcamp → iş teklifi. Kurum: önceden test edilmiş aday | Test + etkinlik modeli; kanıt Coderspace'in içinde kalıyor. KOBİ ve kamu ihtiyacı için yapılandırılmış bir araç yok | **Türkiye'de en doğrudan rakip.** Fark: ihtiyaç kanvası, kör keşif, pilot defteri, açık kaynak altyapı |
| **Patika.dev** | 6–7 haftalık şirket ortaklı ücretsiz bootcamp'ler; ücretli Patika+ (12 ayda iş bulamayana iade) | Kurum bootcamp'i finanse eder; Patika+ ücretli | Pazarama: 2.000+ başvuru → 80 katılımcı → 7 işe alım. FMSS: 13 işe alım (şirket vaka çalışmaları) | Kabul oranı ~%4, işe alım ~%0,35 (Pazarama örneği) → gençlerin çoğu **görünmez kalıyor** | Bootcamp'e giremeyen genç bile kanıt biriktirip görünür olur. Bootcamp mezunu da S3 kanıtla öne çıkar |
| **Techcareer.net** | Online 6–8 haftalık bootcamp'ler, hackathon, etkinlik; bazı ilanlarda "İş Fırsatı" etiketi | Kurum sponsorluğu (ayrıntı **doğrulanamadı**) | Ücretsiz eğitim vaadi | Mezun ve yerleşme oranı **doğrulanamadı** | — |
| **Kodluyoruz** (dernek) | Ücretsiz yazılım bootcamp'leri; Patika 2021'de Kodluyoruz'dan ayrıldı | Bağış ve hibe, kurum iş birliği | 2016'dan beri 2.000+ mezun, mezunların %60'ı 3 ayda iş buldu (tarihsiz röportaj) | Eğitim kurumu; eşleşme altyapısı değil | Doğal **ortak**: mezunları Nirengi'de kanıt biriktirebilir |
| **TalentGrid** | Yazılımcılarla şirketleri 20+ veri noktasıyla eşleştiren kapalı profil; "Askıda Kod" (derneklere gönüllü yazılımcı) | Kurum işe alım hizmeti; 40 bin+ geliştirici (şirket beyanı) | Gizlilik, otomatik uyum | Deneyimli geliştirici odaklı; genç ve ilk iş odağı yok. Güncel durumu **doğrulanamadı** | "Askıda Kod" fikri Nirengi'nin STK ve kamu ihtiyacı tarafına çok yakın: kanıtlanmış talep sinyali |
| **Toptalent.co** | Öğrenci ve yeni mezun ilanları, vaka yarışmaları, işveren markası | Kurum öder. 2018'de 250 bin aktif üye (Webrazzi) | Vaka yarışmaları | Güncel faaliyet ve üye sayısı **doğrulanamadı** (kaynaklar 2015–2018) | — |
| **Bionluk** | Freelance pazar yeri (tasarım, yazılım, çeviri…) | Satıcıdan ~%20 hizmet bedeli (tarihsiz üçüncü taraf) | Genç: ilk para, ilk müşteri | Fiyat yarışı; iş kanıtı müşteri yorumuyla sınırlı. Kullanıcı sayısı **doğrulanamadı** | Kurum onayı **kriter bazında ve imzalı**; yıldız puanı değil |
| **TEKNOFEST / girişim ekosistemi** | 2025'te 50+ ana kategoride teknoloji yarışmaları; 2018'den bu yana ~4 milyon başvuru (kümülatif); TEKNOFEST Girişim Programı 2026 | Kamu ve vakıf | Ödül, görünürlük | Yarışma bitince takımın ürettiği kanıt dağılıyor; kurumla süreklilik yok | Yarışma çıktısı Nirengi'de S2/S3 kanıta dönüşebilir: **ortaklık fırsatı** |
| **GİRVAK programları** (Fellow, Challenger) | 17–24 yaş girişimci gençler; Fellow programına ~1 milyon başvuru, ~1.000 fellow ve mezun (10. yıl açıklaması) | Vakıf | Ağ, mentorluk | Seçicilik çok yüksek (~%0,1) | Organizatörün kendi ağındaki **seçilmeyen 999 bin** genç için ölçeklenebilir bir görünürlük katmanı |

**Kaynaklar (1.4)**
- Youthall: https://www.youthall.com/companies/ · https://www.youthall.com/tr/page/isveren-kullanici-sozlesmesi · https://www.youthall.com/tr/company/blog/detail/2022-de-neler-yaptik · https://www.betterteam.com/tr/youthall
- Anbean Kampüs: https://anbeankampus.co/ · https://anbeankampus.co/sirketler-icin/ · https://anbeankampus.co/yardim-merkezi/
- Kariyer.net: https://www.kariyer.net/is-ilanlari/stajyer
- Coderspace: https://coderspace.io/en/ · https://www.coderspace.io/en/ise-alim · https://coderspace.io/sirketler/atolye15
- Patika.dev: https://patika.dev/blog/pazarama-continues-to-launch-bootcamps-as-its-young-talent-hiring-strategy · https://www.patika.dev/case-study/boosting-careers-in-mobile-software-development-the-success-of-fmss-bilisims-7-week-ios-and-android-bootcamps-with-13-hirings · https://patika.dev/en/test-sayfalari/patikaplus-ve
- Techcareer: https://www.techcareer.net/events
- Kodluyoruz: https://www.gazetevatan.com/bilim-ve-teknoloji/genclere-kodlama-ogrenin-tavsiyesi-1418848 · https://eksisozluk.com/patika-dev--6852298
- TalentGrid: https://webrazzi.com/2021/03/02/yazilimcilarla-teknoloji-sirketlerini-eslestiren-hr-tech-platformu-talentgrid/ · https://webrazzi.com/2021/04/28/talentgrid-askida-kod/ · https://tech.eu/2022/03/21/uk-based-tech-talent-matching-platform-unlocks-400000-for-european-expansion
- Toptalent: https://webrazzi.com/2018/01/08/250-bin-aktif-uyeye-sahip-olan-toptalent-2018de-5-milyon-yetenegi-agirlamayi-hedefliyor/
- Bionluk: https://www.betterteam.com/tr/bionluk
- TEKNOFEST: https://bilimgenc.tubitak.gov.tr/makale/teknofest-2025-teknoloji-yarismalari-basvurulari-basladi · https://tim.org.tr/tr/teknofest-2025-teknoloji-yarismalari-basvuru-suresi-uzatildi
- GİRVAK: https://www.haberturk.com/girvak-10-uncu-yilini-kutladi-3689589-ekonomi · https://www.youthall.com/tr/girisimcilikvakfi/girvak-fellow-ve-challenger-programlari-2026_15/

### 1.5 Açık inovasyon (kurum problemi → çözücü)

| Platform | Ne yapar | İş modeli | Somut fayda | Zayıf yanı | Nirengi'nin farkı |
|---|---|---|---|---|---|
| **InnoCentive → Wazoku** | Kurum problemini "Challenge"a çevirir, küresel çözücü ağına açar | Kurum öder; ödüller ortalama ~$20.000, bazen $100.000+. PhD'li uzmanlar problemi formüle eder | 380–500 bin çözücü (tarihe göre değişiyor); %75–80 başarı iddiası (şirket beyanı, bağımsız doğrulama yok) | Büyük kurum ve yüksek bütçe. Problem formülasyonu **pahalı bir danışmanlık hizmeti** | Formülasyonu **yazılım yapıyor**: 7 alanlı kanvas, çözülebilirlik skoru, 70 puan yayın eşiği. KOBİ, kamu birimi ve STK'nın erişebileceği ölçek |
| **HeroX** | Ödüllü yarışma platformu; tasarım desteği | Yarışma yayınlanınca ödül değerinin bir yüzdesi (oran **doğrulanamadı**) | Ortalama 2–4 ay süren yarışmalar | Kazanan-her-şeyi-alır; uzun süreç | Bire bir pilot, haftalar içinde |
| **Zindi** (Afrika) | Kurumların veri problemleri için yarışma; topluluk 85 bin+ (şirket beyanı) | Yarışmayı açan kurum Zindi'ye ücret öder; ilk 3 çözümün fikri mülkiyeti kurumun | Zimnat sigorta vakası: müşteri kaybı %30 azaldı, kazanan işe alındı (şirket beyanı) | Yalnız veri bilimi | **Bölgesel ekosistem modeli Nirengi'ye en çok benzeyen örnek**: yerel gençler + yerel kurum problemleri + işe alım yan ürünü |
| **Türkiye: Türk Telekom PİLOT, Plug and Play İstanbul (MEXT), Turcorn 100, İnovaLİG, TÜBİTAK Kamu YZ Ekosistemi çağrısı** | Kurum ve kamu problemlerini **girişimlerle** eşleştiren hızlandırıcı ve çağrılar | Kurum ve kamu fonlu | PoC, ücretli pilot, yatırım | **Şirketleşmiş girişimlere** yönelik; tek bir genç ya da öğrenci ekibi için giriş eşiği yüksek. Sürekli açık bir "ihtiyaç → genç" platformu **bulunamadı** | Nirengi bu boşluğu dolduruyor: girişim öncesi, bireysel ya da küçük ekip ölçeği |

**Kaynaklar (1.5)**
- InnoCentive / Wazoku: https://en.wikipedia.org/wiki/InnoCentive · https://sifted.eu/articles/wazoku-innocentive-us-market · https://www.uktech.news/news/wazoku-acquires-us-open-innovation-leader-innocentive-and-raises-additional-125m-to-support-global-growth-20200710
- HeroX: https://www.herox.com/pricing · https://www.herox.com/faq
- Zindi: https://techcrunch.com/2020/02/17/african-crowdsolving-startup-zindi-scales-10000-data-scientists · https://siteselection.com/a-workforce-of-85000-international-data-scientists/
- Türkiye: https://www.hurriyet.com.tr/teknoloji/turk-telekom-pilott-girisimcilik-zirvesi-sona-erdi-30089855 · https://www.ntv.com.tr/ekonomi/video-dunyanin-en-buyuk-inovasyon-ve-girisimcilik-platformu-plug-and-play-mext-ile-istanbula-geliyor,PmkV38JNWUK3tFLjhKWeuw · https://www.turcorn.gov.tr/en/100486/Turcorn-Startups-Join-OPEN-Brazil-2025-Program · https://tubitak.gov.tr/tr/duyuru?page=4

---

## 2. Pazar verisi

### 2.1 Türkiye: gençlerin durumu

| Gösterge | Değer | Dönem | Not |
|---|---|---|---|
| Genel işsizlik (mevsimsellikten arındırılmış) | **%7,8** | Ağustos 2026 | TÜİK, 30 Eylül 2026 |
| Genç (15–24) işsizlik | **%13,0** (erkek %9,7, kadın **%19,4**) | Ağustos 2026 | Bir önceki ay %14,1–14,5 (kaynaklar farklı yazıyor) |
| Atıl işgücü oranı | **%31,0** | Ağustos 2026 | Gizli işsizlik ile birlikte |
| Genç (15–24) işsizlik, yıllık | **%15,3** | 2025 | Genel işsizlik %8,3 |
| NEET: ne eğitimde ne istihdamda (15–24) | **%23,3** | 2025 yıllık | TÜİK verisine dayanan soru önergesi ve basın. 2024: %22,9 |
| NEET, AB karşılaştırması | 2024'te 15–24 yaşta Türkiye AB ülkeleri arasında **1. sırada** (ikinci sıradaki Romanya ~%17) | 2024 | Betam / Eurostat |
| 2026 için güncel NEET | **doğrulanamadı** | — | Çeyreklik bülten bulunamadı |

**Kaynaklar (2.1)**
- https://www.alomaliye.com/2026/09/30/issizlik-orani-aciklandi-agustos-2026/
- https://gazeteoksijen.com/ekonomi/tuik-acikladi-issizlik-orani-agustosta-yuzde-7-8e-geriledi-291095
- https://www.alomaliye.com/2026/03/25/tuik-2025-isgucu-istatistikleri-issizlik-yuzde-8-3e-geriledi-atil-isgucu-yuzde-29-7ye-yukseldi/
- https://www.24saatgazetesi.com/tuik-acikladi-genclerin-yuzde-233u-ne-egitimde-ne-istihdamda
- https://betam.bahcesehir.edu.tr/wp-content/uploads/2025/10/ArastirmaNotu282.pdf

### 2.2 İlk iş deneyimi sorunu: "deneyim yok → iş yok → deneyim yok"

- **Türkiye, kurum tarafı (en güçlü veri):** TÜİK'in Girişimlerde Bilişim Teknolojileri Kullanım Araştırması'na göre 2025'te BİT uzmanı işe almaya çalışan girişimlerin **%31,7'si güçlük yaşadı**. Güçlük nedenleri: yüksek ücret beklentisi **%82,6**, gerekli niteliklere sahip olmama **%71,8**, **ilgili iş deneyimi olmaması %71,0**, yeterli ya da uygun başvuru olmaması **%55,7**. → Nirengi'nin pilotu tam olarak bu üç nedeni hedefliyor: deneyim üretir, niteliği kanıtlar, aday havuzunu genişletir.
- **Küresel, yapay zekâ etkisi:** Stanford'un Ağustos 2025 tarihli "Canaries in the Coal Mine" çalışması (ADP bordro verisi), yapay zekâya en açık mesleklerde **22–25 yaş** çalışanlarda istihdamın görece **%13** düştüğünü buldu. 22–25 yaş yazılım geliştiricilerinde düşüş Temmuz 2025 itibarıyla ~%20. Deneyimli çalışanlarda düşüş yok. Giriş seviyesi işler daralıyor; "ilk deneyimi nereden bulacağım" sorusu büyüyor.
- **Arz:** YASAD'ın aktardığına göre Türkiye'de 2023'te bilgisayar mühendisliğinden 9.576 kişi mezun oldu (kontenjan 13.906). İkincil kaynak, bir köşe yazısı.

**Kaynaklar (2.2)**
- https://www.alomaliye.com/2026/09/10/sabit-internet-kullanimi-yuzde-92-7ye-ulasti/ (TÜİK BİT bülteni özeti)
- https://siepr.stanford.edu/publications/working-paper/canaries-coal-mine-six-facts-about-recent-employment-effects-artificial
- https://www.ekonomigazetesi.com/kose-yazisi/yazilim-ile-istihdam-ve-kalkinma-saglamak-57872

### 2.3 KOBİ'lerin dijital yeteneğe erişimi

| Gösterge | Değer | Kaynak yılı |
|---|---|---|
| KOBİ'lerin girişimler içindeki payı | **%99,6** (3,93 milyon girişim) | 2024 |
| KOBİ'lerin istihdam payı | **%68,5** | 2024 |
| BİT uzmanı istihdam eden girişim oranı | **%15,2** (2024'te %13,4) | 2026 bülteni |
| … 10–49 çalışanlı girişimlerde | **%10,8** | 2026 bülteni |
| … 50–249 çalışanlılarda | %29,8 | 2026 bülteni |
| … 250+ çalışanlılarda | %73,3 | 2026 bülteni |
| BİT uzmanı işe almaya çalışan girişim | %6,4 | 2025 |

**Çıkarım:** Küçük işletmelerin ~%89'unda tek bir BİT uzmanı bile yok. Tam zamanlı bir uzman almak hem pahalı (%82,6 ücret beklentisi engeli) hem riskli. Bu kitle için doğru ürün bir ilan değil, **kısa, kapsamı belli, ölçülebilir bir pilot**. KOBİ'ye özgü ve sayısal bir "dijital yetenek açığı" anketi (2025) **bulunamadı**; nitelikli işgücü sorunu sektör temsilcilerinin açıklamalarında sık geçiyor (SEDEFED 2023).

**Kaynaklar (2.3)**
- https://www.alomaliye.com/2025/12/24/kobi-istatistikleri-2024-girisim-sayisi-istihdam-ciro-dis-ticaret-ve-ar-ge/
- https://www.alomaliye.com/2026/09/10/sabit-internet-kullanimi-yuzde-92-7ye-ulasti/
- https://www.bloomberght.com/sedefed-baskani-erdem-dijital-donusum-yetkin-isgucuyle-saglanabilir-2342962

### 2.4 Beceri temelli işe alım (skills-based hiring): söylem ile uygulama arasındaki fark

| Bulgu | Değer | Kaynak |
|---|---|---|
| Beceri temelli işe alım kullanan işveren (ABD ve Birleşik Krallık) | **%85** (bir önceki yıl %81); beceri testi kullanan %76; diploma şartını kaldıran %53 | TestGorilla 2025 (2.160 katılımcı) |
| Diploma şartını kaldırmanın gerçek etkisi | **700 işe alımdan 1'inden az** değişti; firmaların ~%45'i "sadece isimde" değiştirdi | Harvard Business School + Burning Glass Institute, Şubat 2024 |
| Beceri öncelikli yaklaşımın aday havuzuna etkisi | ABD'de ~**19–20 kat** büyüme; Z kuşağı için **10,3 kat** | LinkedIn Economic Graph, 2023 |
| İşverenlerin dönüşümdeki 1 numaralı engeli | **Beceri açığı, %63** | WEF Future of Jobs 2025 |

**Çıkarım (Nirengi için kritik):** HBS/BGI raporuna göre şirketler diploma şartını kaldırsa da yine eski vekil göstergelere dönüyor, çünkü **beceriyi tek tek değerlendirmek zor**. Nirengi'nin S1/S2/S3 merdiveni ve açıklanabilir skoru tam bu "zor iş"i ucuzlatmaya çalışıyor. Jüriye söylenecek veri bu: niyet var, ölçüm aracı eksik.

**Kaynaklar (2.4)**
- https://www.testgorilla.com/skills-based-hiring/state-of-skills-based-hiring-2025/
- https://burningglassinstitute.org/research/skills-based-hiring-2024 · https://www.burningglassinstitute.org/s/Skills-Based-Hiring-02122024-vF-srmp.pdf
- https://economicgraph.linkedin.com/research/skills-first-report
- https://www.weforum.org/press/2025/01/future-of-jobs-report-2025-78-million-new-job-opportunities-by-2030-but-urgent-upskilling-needed-to-prepare-workforces/

### 2.5 Mikro-staj pazarı

- **Pazar büyüklüğü: doğrulanamadı.** Bağımsız bir mikro-staj pazar raporu bulunamadı. Bulunan "microlearning" raporları (ör. IMARC) farklı bir pazarı ölçüyor ve karıştırılmamalı.
- Parker Dewey: 2022'de şirketlerin açtığı mikro-staj sayısında **%40 artış** (tek platform verisi, eski). Proje başına çoğunlukla $200–600, saat başı öğrenciye $20 hedefi. İşe alım maliyetinde %40–80 tasarruf iddiası (şirket beyanı).
- Riipen: ücretsiz ve ders kredili model. 53 bin işveren projesi, 760+ eğitim kurumu (şirket beyanı).
- Türkiye'de mikro-staj diye adlandırılmış, ölçeği yayımlanmış bir pazar **bulunamadı**. En yakın örnekler şirket sponsorlu bootcamp'ler (Patika, Coderspace, Techcareer) ve freelance (Bionluk).

**Kaynaklar (2.5)**
- https://www.parkerdewey.com/blog/micro-internships-by-the-numbers-2022 · https://www.parkerdewey.com/pricing
- https://www.riipen.com/program/futurepath
- https://www.imarcgroup.com/global-micro-learning-market (yalnızca ayrım için)

---

## 3. Maskot stratejisi

### 3.1 Duolingo ve Duo: ne işe yaradı (kaynaklı)

| Olay | Ölçülen etki | Kaynak türü |
|---|---|---|
| **"Duo öldü" kampanyası** (11 Şubat 2025, Cybertruck; kullanıcılar ders yapıp XP toplayarak Duo'yu "diriltti") | 4–17 Şubat arası ~169 bin anma; #ripduo 45 bin+ kullanım; Instagram duyurusu 2 milyon+ beğeni | Meltwater |
| | Android'de kampanyanın ertesi günü indirmeler **+%38**, web aramaları +%58; Android aylık aktif kullanıcıları yıllık +%25 | Similarweb (TechCrunch üzerinden) |
| | iOS'ta yılın o tarihe kadarki en yüksek günlük indirmesi (~172 bin, yıl ortalamasından +%15) | Appfigures (TechCrunch üzerinden) |
| | Q1 2025: **46,6 milyon DAU, +%49**, "şimdiye kadarki en fazla DAU eklenen çeyrek". CEO, DAU için yönlendirme yapmalarının sebebinin "özellikle dead Duo kampanyası sayesinde güçlü geçen Q1" olduğunu söyledi | SEC 8-K; Q2 kazanç çağrısı dökümü |
| **Riskin kanıtı**: 2025 baharında CEO'nun "AI-first" açıklamasına sosyal medyada tepki geldi; şirket "edgy" paylaşımlara ara verdi; Q2 DAU büyümesi hedef aralığın alt ucunda (+%40) kaldı | Maskot kişiliği marka duygusunu taşıyor; duygu tersine dönünce aynı kanal zarar veriyor | Q2 2025 kazanç çağrısı |
| **TikTok "unhinged Duo"** | Yaklaşık 4 yılda 50 bin → **16 milyon** takipçi (Şubat 2025) | The Drum |
| **Bildirim zekâsı** (Duo'nun "pasif agresif" hatırlatmaları) | Bandit algoritması: toplam DAU'da +%0,5, yeni kullanıcı tutmada +%2 (güçlü bir taban çizgisine göre) | Duolingo, KDD 2020 makalesi |
| **Organik büyüme** | Yeni kullanıcıların %90'a kadarı ücretli reklam olmadan geliyor (2024 tarihli ikincil kaynak). 2024 satış ve pazarlama gideri $90,5 milyon, yani gelirin ~%12'si (10-K'dan hesaplandı) | Motley Fool; SEC 10-K |

**Duo'dan çıkan dersler**
1. **Maskot ürün mekaniğine bağlı.** "Duo'yu kurtar" kampanyası kullanıcıyı derse soktu; maskot hikâyesi doğrudan çekirdek eyleme (ders = XP) dönüştü. Nirengi karşılığı: *"Niri'yi bir sonraki nirengi noktasına taşı"* ancak **doğrulanmış bir kanıtla** ilerlesin.
2. **Kişilik + ritim.** Seri, hatırlatma ve lig, bildirimin yapay zekâyla seçilmesi. Ölçülen etki küçük ama Duolingo ölçeğinde birikiyor (KDD 2020).
3. **Sosyal medya maskotun sahnesi.** Duo TikTok'ta bir karakter; uygulamada bir rehber. Bu ikisi aynı şey değil.
4. **Ters tepme riski gerçek.** Duygusal bağ kuran bir karakter, kriz anında duyguyu büyütür.

### 3.2 Diğer maskotlar, B2C ve B2B

| Maskot | Bağlam | Ne işe yaradı | Nirengi'ye çıkarım |
|---|---|---|---|
| **GitHub Octocat** (B2B/geliştirici) | Stoktan alınmış "Octopuss" çizimi önce hata sayfalarına kondu, sonra tescillendi. Adı Git'teki "octopus merge"e gönderme. Octodex'te topluluk yüzlerce türev üretti | Maskot **topluluğun katıldığı bir kültüre** dönüştü (kostümler, etkinlikler). Microsoft satın aldıktan sonra da korundu | Niri'nin **"Nirengidex"i**: lig kademeleri (Zemin → Tepe → Sırt → Doruk → Zirve) ve açık kaynak katkıları için topluluk kostümleri. Niri'nin kökeni (nirengi üçgeni) zaten teknik bir gönderme |
| **Mailchimp Freddie** (B2B SaaS) | 2018'de Collins ile marka yenilemesi: Freddie korundu ama **sadeleştirildi** (tek renk silüet), kelime markasının yanına konabilir oldu. İlke: "büyüdük diye büyümek zorunda değiliz" | Kurumsal müşteriye satarken bile oyunbazlık, ama disiplinli bir sistem içinde | Kurum tarafında Niri **silüet ve ikon** olarak kalmalı: tam karakter değil, imza |
| **Microsoft Clippy** (ters örnek) | Basit tetiklerle araya giren, bağlamı anlamayan asistan; Office XP'de varsayılan olarak kapatıldı, 2007'de kaldırıldı | Kullanıcı testleri sorunu göstermesine rağmen piyasaya çıktı | **Kurum ekranında Niri asla iş akışını kesmemeli**, skora yorum katmamalı. Yardım ancak istenince ("Niri'ye sor"). Mevcut kod zaten bu yönde: tur yalnızca ilk ziyarette, sonrasında düğmenin arkasında |
| **Reklam araştırması** | System1 + IPA Databank: karakterli kampanyaların pazar payını büyük ölçüde artırma ihtimali ~%37–41, kâr kazanımı ihtimali ~%30–34 daha yüksek. Karakter kullanımı reklamlarda 1992'de %41'den bugün ~%12'ye düşmüş | İkincil kaynaklar ve ajans raporları; hakemli çalışma değil. Uyarı: karakter fiyatlama gücü kazandırmıyor | Maskot farkındalık ve hatırlanma aracı. Kurum tarafında **güven** ise ölçümden ve şeffaflıktan gelmeli |

### 3.3 Niri için önerilen kullanım kuralları

| Bağlam | Genç tarafı | Kurum tarafı |
|---|---|---|
| Görünüm | Tam karakter: ifade, animasyon, kostüm (lig kademesi) | Sadeleştirilmiş üçgen silüet / imza (Freddie modeli) |
| Ses tonu | Esprili, cesaretlendiren, hafif "Duo" ısrarı (seri hatırlatma) | Sessiz, net, yalnızca durum bilgisi ("2 kilometre taşı onay bekliyor") |
| Nerede görünür | Bugün ekranı, seri, lig değişimi, PR birleşme kutlaması, sosyal medya | Boş durumlar, ilk kurulum, **pilot kapanış kartı** (tek kutlama anı) |
| Nerede asla görünmez | Doğrulama sonucu ve itiraz ekranları (ciddiyet) | Aday skor kartı, gerekçe, defter, kör keşif listesi |
| Bildirim | Kişisel hedef ve seri hatırlatma; günlük XP tavanı tükenmişlik yaratmamalı | Yalnızca somut nedenli tetikler: sessizlik göstergesi, onay bekleyen kilometre taşı |
| Hikâye kancası | "Niri haritayı çiziyor; her doğrulanmış kanıt yeni bir nirengi noktası." | "Nirengi: ölçümün güvenle başladığı nokta." |
| Sosyal medya (Türkiye) | Niri karakteri: "Beyan değil, kanıt" esprileri, CV klişelerine taşlama, PR birleşme anları | LinkedIn: veri ve pilot vakaları; maskot yalnızca imza olarak |

**Uyarı:** Duo'nun gücü 10 yılda biriken ürün ritminden geliyor. Hackathonda maskotu **kimlik ve tutarlılık** aracı olarak konumlandırmak (aynı karakter her iki rolde, farklı yoğunlukta) "Duolingo kopyası" algısından daha güvenli.

**Kaynaklar (3)**
- https://www.meltwater.com/en/blog/duolingo-dead-mascot-campaign
- https://techcrunch.com/2025/02/18/duolingo-killed-its-mascot-with-a-cybertruck-and-its-going-weirdly-well
- https://npr.org/2025/02/26/nx-s1-5309785/duolingo-owl-mascot-lives
- https://www.sec.gov/Archives/edgar/data/1562088/000156208825000098/q1fy25duolingo3-31x25share.htm
- https://www.sec.gov/Archives/edgar/data/1562088/000156208825000165/q2fy25duolingo6-30x25share.htm
- https://www.marketbeat.com/earnings/reports/2025-8-6-duolingo-inc-stock (Q2 2025 çağrı dökümü)
- https://www.thedrum.com/news/2025/02/25/duolingo-s-tiktok-mastermind-its-unhinged-social-strategy-and-killing-its-mascot
- https://research.duolingo.com/papers/yancey.kdd20.pdf
- https://www.sec.gov/Archives/edgar/data/1562088/000156208825000042/duol-20241231.htm · https://www.fool.com/investing/2024/03/04/up-233-is-it-too-late-to-buy-duolingo
- https://en.wikipedia.org/wiki/Simon_Oxley · https://cameronmcefee.com/work/the-octocat/
- https://www.creativereview.co.uk/mailchimp-goes-yellow-in-rebrand-by-collins/ · https://www.designweek.co.uk/issues/1-7-october-2018/mailchimp-rebrand-aims-to-unify-bran · https://creativebloq.com/news/mailchimp-rebrand-does-away-with-script-wordmark
- https://www.mentalfloss.com/article/504767/tragic-life-clippy-worlds-most-hated-virtual-assistant · https://en.wikipedia.org/wiki/Clippy
- https://campaignasia.com/article/brand-mascots-will-send-your-profits-and-emotional-connection-soaring/472774 · https://www.warc.com/content/article/Brand_characters_boost_the_effectiveness_of_TV_ads/126913 · https://lbbonline.com/news/lbb-and-mpc-release-exciting-new-research-on-the-advertising-value-of-mascots-characters

---

## 4. Sentez

### (a) Genç neden girsin: 5 somut gerekçe

1. **XP'n burada para eder, çünkü dışarıda doğrulanabilir.** Duolingo'da ya da Codewars'ta kazandığın puanı işverene gösteremezsin. Nirengi'de her puan bir makbuz: birleşmiş PR, doğrulanmış alan adı, kurumun imzaladığı kilometre taşı. Seri ve lig var, ama "boş tıklama" ile kazanılmıyor (günlük 200 XP tavanı).
2. **CV'siz ve önyargısız görünürlük.** Kurum ilk temasta adını, yaşını, okulunu görmüyor (kör keşif). Türkiye'de 15–24 yaş kadın işsizliğinin %19,4 olduğu bir tabloda bu somut bir eşitlik aracı. Okul ya da şehir yüzünden elenmiyorsun.
3. **"Deneyimin yok" duvarını delmek.** TÜİK'e göre BİT işe alımında zorlanan girişimlerin %71'i "ilgili iş deneyimi yok" diyor. Nirengi'deki pilot, deneyimin kendisi: kapsamı belli, kurum onaylı, profiline kalıcı S3 kanıt olarak yazılan bir iş.
4. **Neden eşleşmediğini öğrenirsin.** Youthall'da 550 başvurudan biri olup cevap alamamak yerine "bu ihtiyaca %70 uyuyorsun, şu alanda doğrulanmış kanıtın eksik" geri bildirimi ve bu eksiği kapatan gelişim görevleri.
5. **Kanıtın senindir ve taşınabilir.** Açık kaynak altyapı, herkese açık özet kartı, yol haritasında Open Badges 3.0 / W3C VC dışa aktarımı. Platform kapansa bile imzalı kanıt seninle kalır. Bootcamp'e (Patika örneğinde ~%4 kabul) ya da Fellow programına (~%0,1) seçilmesen de birikirsin.

### (b) Kurum neden ihtiyaç yüklesin: 5 somut gerekçe

1. **İlan yerine problem yazarsın; sistem problemi netleştirir.** Yedi alanlı kanvas, serbest metinden taslak ve çözülebilirlik skoru. InnoCentive'in pahalı danışmanlıkla yaptığı problem formülasyonunu dakikalar içinde ve ücretsiz yaparsın.
2. **Tam zamanlı riski almadan dene.** Küçük işletmelerin %89'unda BİT uzmanı yok; aday ücret beklentisi engeli %82,6. Kilometre taşlı küçük bir pilot, bir kadronun maliyetini ve riskini üstlenmeden işi görmeni sağlar. Parker Dewey ABD'de bu modelin işe yaradığını gösteriyor.
3. **Başvuru yığını değil, gerekçeli kısa liste.** Dört bileşenli skor (kanıt, bağlam, kapasite, geçmiş) ve her adayın yanında açık gerekçe. Beyan değil doğrulanmış kanıt, kopya portfolyo tespiti. HBS/BGI'nin işaret ettiği "beceriyi değerlendirmek zor" sorununu ucuzlatır.
4. **İş birliği kaydı tutarlı ve paylaşılabilir.** Çift onaylı kilometre taşları, hash zincirli defter, sessizlik uyarısı, adil kapanış. Kamu birimi, STK ya da İSTKA/GİRVAK fonlu projeler için **hesap verebilirlik çıktısı** hazır gelir.
5. **Önyargısız, savunulabilir seçim ve işveren markası.** Kör keşif ve formülü açık skor, "neden bu adayı seçtiniz" sorusuna veriyle cevap verir. Kamuya açık pilot kartları kurumu "gençlere gerçek iş veren kurum" olarak görünür kılar.

### (c) Boşluk: rakiplerin yapmadığı ve Nirengi'nin sahiplenebileceği konumlar

| # | Konum | Neden boş |
|---|---|---|
| 1 | **"Oyunlaştırılmış kanıt": XP = doğrulanmış dış dünya çıktısı** | Oyunlaştırılmış öğrenme uygulamaları kapalı devre puan üretiyor; işe alım platformları oyun ritmini kullanmıyor. Frontend Mentor yaklaşıyor ama projeler herkes için aynı ve kurgusal |
| 2 | **KOBİ, kamu ve STK için "problem yazdıran" ücretsiz araç + genç çözücü** | Açık inovasyon (Wazoku, HeroX, Türk Telekom PİLOT, Plug and Play) büyük kurumlar ve şirketleşmiş girişimler için. Türkiye'de sürekli açık, bireysel ölçekte "ihtiyaç → genç" platformu bulunamadı |
| 3 | **İki tarafın imzaladığı, taşınabilir iş kanıtı (S3)** | Rozetler (Credly, Prosple) katılımı, testler (HackerRank, Coderspace) anlık performansı gösteriyor. Gerçek bir kurumun belirli bir kriteri sağlandı diye imzaladığı kayıt yok |
| 4 | **Açık kaynak, açıklanabilir, kör eşleşme altyapısı (kamu yararı konumu)** | Ticari rakiplerin skoru kara kutu ve mülkiyet altında. Kamu ve vakıf fonlu bir ekosistem (GİRVAK, İSTKA) için denetlenebilir, taşınabilir bir altyapı Türkiye'de yok. Eğitim kurumları (Kodluyoruz, Patika, TEKNOFEST takımları) için ortak "kanıt katmanı" olarak rakip değil, **tamamlayıcı** olma şansı var |

### (d) Nirengi'nin şu an zayıf kaldığı yerler

| Zayıflık | Kime göre | Not ve öneri |
|---|---|---|
| **Soğuk başlangıç (cold start)**: kullanıcı yok, kurum yok, veri kurgusal | Herkes (Youthall 1.200+ şirket, Coderspace 200 bin+ yetenek) | Jüriye dürüst anlatılmalı (PRODUCT.md de böyle istiyor). Tohum planı: GİRVAK/Zemin360 kurumlarıyla ilk ihtiyaç turu, Kodluyoruz/Patika mezunları ve TEKNOFEST takımları |
| **Para akışı yok**: ücret, escrow, sözleşme, sigorta tanımlı değil | Parker Dewey (escrow, %90 öğrenciye), Bionluk | Ücretsiz pilotun **emek sömürüsü** gibi algılanma riski var. En azından "ücretli / gönüllü / ders kredili" etiketi ve kurum taahhüt alanı gerekli |
| **Kanıt yüzeyi koda dar**: S2 bugün yalnızca GitHub ve DNS | Tasarım, içerik, tarih/sosyal bilim, saha işi yapan gençler | Behance, Figma, DOI ve mağaza doğrulayıcıları yol haritasında. Hackathonda bunu açıkça "faz 2" diye göstermek gerekli |
| **Sahiplik ≠ yazarlık**: GitHub hesabı sahipliği, kodu yapay zekânın yazmadığını kanıtlamıyor | HackerRank, Codility (canlı test ve intihal) | S3 (kurum onayı) bu açığı kısmen kapatıyor. Gerekirse kısa canlı savunma veya kod incelemesi mikro-etkileşimi |
| **Ölçek ve marka tanınırlığı yok**; Niri'nin hikâyesi henüz yok | Duolingo, Youthall, Anbean | Maskot ancak tutarlı içerikle değer kazanır. Hackathonda tek bir güçlü an yeterli (ör. pilot kapanışında Niri'nin yeni nirengi noktası dikmesi) |
| **Kurum açısından iş modeli belirsiz** | Hepsi gelir modelli | Seçenekler: kurum ücretsiz + kamu/vakıf fonu (kamu yararı), sonra KOBİ için pilot başına küçük platform ücreti ya da kurumsal "ihtiyaç turu" paketi. Doğrulanmadı, varsayım |
| **Kalıcılık tarayıcıda** (localStorage), gerçek kurum kimliği yok | Tüm üretim platformları | Yol haritası maddesi 1 (Workers + D1, OAuth, kurum hesapları) |
| **Duolingo kopyası algısı** riski | Jüri | Fark tek cümlede söylenmeli: "Duolingo'da XP uygulamada kalır, Nirengi'de XP bir kanıt makbuzudur." |

### (e) Jüriye tek cümlelik konumlandırma önerileri

1. **"Nirengi, gençlerin oyun gibi biriktirdiği ama kurumların imzayla doğruladığı bir iş kanıtı altyapısıdır: beyan değil, kanıt."**
2. "Duolingo'da XP uygulamada kalır; Nirengi'de her XP, bir kurumun ya da makinenin doğruladığı bir iş makbuzudur."
3. "Türkiye'de BİT işe alımında zorlanan girişimlerin %71'i 'deneyim yok' diyor. Nirengi deneyimi pilotla üretir, kanıtla kaydeder."
4. "Şirketler diploma şartını kaldırdı ama işe alım 700'de 1 değişti, çünkü beceriyi ölçecek araç yok. Nirengi o ölçüm aracı."
5. "Kurum ilan değil ölçülebilir ihtiyaç yazar, adayı ismiyle değil kanıtıyla görür, işbirliğini iki tarafın imzasıyla kapatır."
6. (Kamu yararı vurgusu) "Açık kaynak, açıklanabilir ve önyargıya kapalı. Gençlerin yüzde 23'ünün ne okulda ne işte olduğu bir ülkede görünmez yetenek için ortak bir kanıt katmanı."

**Kaynaklar (4)**: Bu bölümdeki rakamlar §1–§3'teki kaynaklardan alındı. "~%89 BİT uzmanı yok" çıkarımı, 10–49 çalışanlı girişimlerde %10,8 olan BİT uzmanı oranından hesaplandı. Patika kabul oranı (80/2.000) ve GİRVAK seçicilik oranı (~1.000/~1 milyon) şirketlerin kendi açıkladığı rakamlardan hesaplandı.

---

### Ek: Doğrulanamayan veya çelişkili kalan bilgiler

- Zemin360 Hackathon'un kamuya açık bir sayfası web aramasında bulunamadı; etkinlik bilgileri iç belgelerden (BASVURU.md, teknik tasarım belgesi) alındı.
- Mimo, Bionluk, Kariyer.net (genç segmenti), Techcareer, Toptalent için güncel kullanıcı sayısı bulunamadı.
- Mikro-staj pazarının büyüklüğü (küresel ve Türkiye) bulunamadı.
- 2026 dönemi için NEET oranı bulunamadı; en son yıllık veri 2025.
- HackerRank 2026 fiyatları, Topcoder topluluk büyüklüğü ve HeroX ücret oranı kaynaklar arasında çelişkili.
- Duolingo "Duo öldü" kampanyasının DAU'ya etkisi şirketin ölçtüğü bir değer değil; CEO'nun nitel atfı ve üçüncü taraf indirme verileri var.
- System1/IPA maskot etkinliği rakamları ikincil kaynaklardan (ajans raporları ve basın) geldi; birincil rapor okunmadı.
