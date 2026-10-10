# Sunum notları

*Zemin360 finali · 12 slayt · planlanan süre 4:00 (film 0:58, konuşma 3:02)*

Bu dosya `src/components/sunum/notes.ts` dosyasından üretildi; notları orada düzeltin. Sunum sırasında aynı notlar konuşmacı penceresinde görünür: sunumda **N** tuşu ya da `/sunum?notlar` adresi. Pencere sunumu izler, ok tuşlarıyla sunumu yönetir, **R** süreyi sıfırlar.

Konuşma organizasyonun önerdiği on iki adımı izler ve beş dakikaya sığar. Omurgası tek bir fikir: kurum gerçek bir case verir, gençler doğrulanmış işleriyle bu case’e göre ölçülür, en uyumlusu onu küçük bir deneme projesinde gerçekten çözer ve onaylanan iş profiline imzalı deneyim olarak döner. Beşinci slayt bu döngüyü beş durakta anlatır; altıncı slayt canlı demo olarak 56 saniyelik filmi oynatır, konuşmacı filmin üstüne konuşur (aşağıda saniyesiyle). Film ürünü masaüstü tarayıcıda, gerçek ekranlarla gösterir; müzik kısık çalar, **P** filmi durdurur ve devam ettirir. Yapay zekâ slaytları açık modeli (Gemma 4), verinin nerede kaldığını, önce/sonra farkını ve hatalı çıktıya karşı önlemi gösterir. Hikâye tek bir genç (Emirhan, adı takımdan, profil kurgusal) ve tek bir kurumla (Kuzey Lojistik) ilerler. Kapanıştan sonra konuşmanın dışında 9 ek sayfa var: filmin her sahnesi gerçek ekranı ve üç mekanizmasıyla, bir de Niri’nin gençlere ve kurumlara söyledikleri; soru gelince açılır. Kısa cevaplar aşağıda ve kapanıştan itibaren konuşmacı penceresinde.

Slaytlardaki her sayı `docs/PAZAR-ANALIZI.md` içindeki kaynağıyla birlikte slaytın üzerinde yazar ya da ürünün kendi kodundan gelir (XP tablosu, uyum ağırlıkları, kanıt düzeylerinin ağırlığı, yayın eşiği); yapay zekâ slaytlarındaki sonuçları ürünün kendi kodu, gerçek bir model cevabıyla hesaplar. Planlar plan olarak etiketli; kullanıcı, pilot ya da gelir rakamı yok.

## 1. Nirengi

*0:00 – 0:10 · Niri: “Merhaba, ben Niri! Bugün size haritamı göstereceğim.”*

- Merhaba, biz Nirengi: Sezer Uzun ve Emirhan Açık.
- Nirengi, gencin gerçek işini kanıta çeviren ve onu girişimlerin gerçek case’leriyle buluşturan açık kaynak bir web sitesi; telefonda da uygulama olarak çalışıyor.

## 2. Problem

*0:10 – 0:25 · Niri: “Gençler görünmüyor, kurumlar emin olamıyor.”*

- Deneyim yoksa iş yok, iş yoksa deneyim yok. Türkiye’de her 100 gençten 23’ü ne okulda ne işte.
- Öbür tarafta BİT uzmanı almakta zorlanan her 100 girişimden 71’i aynı gerekçeyi söylüyor: ilgili iş deneyimi yok. İki taraf birbirini arıyor ama bulamıyor.

## 3. Kim için

*0:25 – 0:40 · Niri: “Biri kanıt arıyor, öbürü güvenilir bir ekip.”*

- Odağımız startuplar ve küçük ekipler: İK’sı yok, yanlış bir işe alımı kaldıramıyor.
- Öbür yanda üreten ama bunu kanıtlayamayan genç: tek bir seçici programa bir milyon başvuru geliyor, kapıda kalan görünmüyor.

## 4. Kanıt

*0:40 – 0:52 · Niri: “Rakamları uydurmadım; kaynakları altında.”*

- Diploma şartını kaldıran şirketlerde bile işe alım 700’de 1’den az değişti; çünkü yerine koyacak bir ölçme aracı yok.
- 37 platform ve programı inceledik; doğrulanmış işi ve kurum imzasını bir arada sunanı Türkiye’de bulamadık.

## 5. Ne çözüyoruz

*0:52 – 1:18 · Niri: “Kurumun gerçek derdi, gencin gerçek işiyle buluşur.”*

- Çözümümüz tek cümle: kurum gerçek bir case verir, genç onu gerçekten çözer.
- Genç işini bağlar; GitHub’daki iş kaynağında doğrulanır. Kurum case’ini kendi sözleriyle yazar; Niri onu açık bir modelle ölçülebilir hale getirir. Gençler bu case’e göre isimsiz ölçülür.
- En uyumlu genç case’i küçük bir deneme projesinde gerçekten çözer: genç teslim eder, kurum onaylar. Onaylanan iş gencin profiline imzalı deneyim olarak döner.
- Ve bu bir web sitesi: adresi açan hemen kullanır; telefonda da ana ekrana yüklenir.

## 6. Canlı demo: film

*1:18 – 2:16 · film oynar, Niri sahneden çekilir*

- (Film oynarken üstüne konuş; ekrandaki yazıyı okuma, onu tamamla. Müzik kısık çalar. P durdurur ve devam ettirir; film bitince →.)
- 0:00 Şimdi bir case’in baştan sona yolculuğunu izleyeceksiniz; gördüğünüz her ekran ürünün gerçek ekranı.
- 0:08 Emirhan GitHub’ını bağlıyor; depoları kaynağında doğrulanıyor, doğrulayanı ve tarihi yazıyor.
- 0:14 Puanı yalnız gerçek işten geliyor: üretim yaptığı günler seri oluyor, haftalık ligde yükseliyor.
- 0:18 Niri ona eksiğini söylüyor: hangi iş onu hangi kurum ihtiyacına yaklaştırır.
- 0:22 Şimdi kurum tarafı: Kuzey Lojistik ilan yazmıyor, derdini anlatıyor.
- 0:26 Niri metni açık model Gemma 4 ile okuyor; her alan kurumun bir cümlesine dayanıyor. Metinde olmayan bir satır uydurulursa denetimde siliniyor.
- 0:34 Gençler bu case’e göre isimsiz ölçülüyor; puanın her parçasının gerekçesi yazıyor.
- 0:40 En uyumlu genç case’i deneme projesinde çözüyor: genç teslim ediyor, kurum onaylıyor, kayıt zincirleniyor.
- 0:46 Onaylanan iş gencin profilinde imzalayanıyla duruyor; bir sonraki kurum bunu görüyor.

## 7. Niri açık bir modelle okur

*2:16 – 2:38 · Niri: “Açık bir modelle okurum; metni saklamam.”*

- Yapay zekâ ne yapıyor? Kurumun kendi sözlerini okuyup yedi alanlı ihtiyaç kanvasına çeviriyor; her alanı metindeki bir cümleye bağlıyor.
- Model açık kaynak: Google’ın Gemma 4’ü, ağırlıkları açık. Kapalı bir yapay zekâ şirketine veri göndermiyoruz. Model açık olduğu için bizim ya da kurumun kendi sunucusunda çalışabilir; o zaman veri hiç dışarı çıkmaz. Bugünkü demo ücretsiz Workers AI’da çalışıyor ve metni saklamıyoruz.
- Karar modelde değil: yayın, puan ve sıralama açık kurallarda.

## 8. Case ölçülebilir olur

*2:38 – 3:00 · Niri: “Case netleşince kimin uyduğunu gösterebilirim.”*

- Farkı ne? Aynı metin: kural motoru 60 puan çıkarıyor, eşiğin altında, yayımlanamıyor. Niri okuyunca 75, yayına hazır; kurum Niri’nin önerilerini ekleyince 100.
- Case ölçülebilir olunca genç de ölçülebiliyor: case’in becerileri cetvel oluyor, gençlerin doğrulanmış işi bu cetvelle ölçülüyor. Liste isimsiz; puan yapay zekâ değil, açık bir formül.

## 9. Metinde olmayanı almaz

*3:00 – 3:18 · Niri: “Metinde yoksa almam, sorarım.”*

- Model yanılırsa? Cevap dört kapıdan geçiyor: şemaya uyuyor mu, alıntı metinde mi, sayı metinde mi, kriter ölçülebilir mi.
- Metinde olmayan bir karar verici uydurursa o alan alınmıyor, Niri kuruma soruyor. Model hiç cevap vermezse aynı ekranı kural motoru dolduruyor; akış kesilmiyor.

## 10. Tasarım kararları

*3:18 – 3:36 · Niri: “Gence ritim veririm, kurumu hiç bekletmem.”*

- Tasarım kararımız: gence oyun gibi bir ritim, kuruma sakin bir ölçüm.
- Genç tarafında her XP bir iş makbuzu; seri, lig, topluluk ve haftalık analiz var. Kurum tarafında oyun yok: isimsiz liste, açık puan, iki onay, kurcalanamaz kayıt. Her ekranda tek iş; Niri yol gösteriyor.

## 11. Bitti ve bırakılan

*3:36 – 3:50 · Niri: “Prototipim çalışıyor. Gerisini pilotta kanıtlayacağım.”*

- Bunların hepsi web sitemizde canlı; altı problemin altısı çalışıyor, motor ve sunucu 59 otomatik testle sınanıyor.
- Bilerek bıraktıklarımız: kalıcı veritabanı, gerçek pilot, kod dışı işlerde makine doğrulaması. Sıradaki iş ilk gerçek ihtiyaç turu.

## 12. Teşekkürler

*3:50 – 4:00 · Niri: “Zirvedeyim! İlk noktayı birlikte koyalım.”*

- Tek isteğimiz: bu salondan bir girişimin gerçek bir case’i. İlk kanvası birlikte yazalım.
- Niri’nin dediği gibi: her çaban haritada bir nokta. Teşekkürler.

## Ek sayfalar (konuşmanın dışında)

### Ek 1. İşin, kaynağında doğrulanır

- (Ek: “Kanıtı nasıl doğruluyorsunuz?” gelirse.) Emirhan GitHub’da hangi depoları göstereceğini kendisi seçiyor; hepsi Doğrulandı geliyor, doğrulayanı yazıyor.
- Behance ya da ArtStation’daki iş dürüstçe Beyan yazıyor ve eşleşmede daha az sayılıyor.

### Ek 2. XP yalnız gerçek işten

- (Ek: oyunlaştırma sorulursa.) GitHub’a push attığın günler kendiliğinden seriye yazılıyor; commit sayısı değil, üretim günü.
- Haftalık ligde yükselen üst lige çıkıyor; düzenli üretim kurumun listesinde öne çıkıyor. Her XP bir iş makbuzu.

### Ek 3. Eksiğini gör

- (Ek: analiz sorulursa.) Niri her hafta gencin haftasını okuyor ve en yakın kapıyı gösteriyor: Flutter’da bir iş eklersen uyumun 63’ten 72’ye çıkar.
- Eşleşmeyen genç neyin eksik olduğunu biliyor. Analiz kural tabanlı, formülü açık.

### Ek 4. Gençler birbirine yardım eder

- (Ek: topluluk sorulursa.) Gençler birbirine de yardım ediyor: takılan soruyor, o işi yapmış biri cevaplıyor.
- Soran “İşe yaradı” deyince yanıtlayan 15 XP kazanıyor; yardım eden de görünür oluyor.

### Ek 5. Kurum derdini yazar

- (Ek: “Kurum ihtiyacı nasıl yazıyor?” gelirse.) Kuzey Lojistik ilan yazmıyor, derdini anlatıyor: “kargom nerede” aramaları ayda 6.000.
- Niri bunu yedi alanlı kanvasa çeviriyor; netlik 70’i geçmeden yayın yok. Benzer ihtiyaçların nasıl sonuçlandığı aynı ekranda.

### Ek 6. Adaylar isimsiz

- (Ek: eşleşme sorulursa.) Kurum adayları isimsiz görüyor: Aday 9C03, 86 puan. Önce iş, sonra isim.
- Puanın dört parçası açık, her birinin gerekçesi yazıyor; kimlik deneme projesi teklif edilince açılıyor.

### Ek 7. İki onay, zincirli kayıt

- (Ek: deneme projesi sorulursa.) Case’in başarı kriterleri aşamaya dönüşüyor: Emirhan teslim ediyor, Kuzey Lojistik onaylıyor.
- Her kayıt öncekine zincirli; biri sonradan tek harf değiştirse zincir orada kırılıyor.

### Ek 8. Onay, gencin kanıtı olur

- (Ek: “Genç bundan ne kazanıyor?” gelirse.) Şirketler işe almadan önce bir case ister; bu iş genelde sözde bir deneyim olarak kalır. Nirengi’de case bir deneme projesi: onaylanan aşama Emirhan’ın profiline Kurum onaylı deneyim olarak, imzalayanıyla yazılıyor.
- İşe girmese bile bu deneyimi taşıyor; döngü kapanıyor.

### Ek 9. Niri’nin söyleyecekleri

- (Ek: vakit kalırsa ya da “kullanıcıya ne vaat ediyorsunuz?” gelirse.)
- Gençlere: CV yazma, işini bağla; eksiğini söylerim; işe alım için yaptığın case de boşa gitmez, imzalı deneyim olur.
- Kurumlara, önce startuplara: İK’n yoksa da olur; adayı yaptığı işle gör; kadro riski yerine küçük bir deneme projesiyle başla.

## Soru gelirse

### Veri nereye gidiyor, model sizin sunucunuzda mı?

- Bugünkü demo ücretsiz Cloudflare Workers AI üzerinde çalışıyor. Metni kaydetmiyoruz. Kapalı bir yapay zekâ şirketinin servisine hiçbir metin gitmiyor.
- Model açık ağırlıklı olduğu için aynı modeli kendi sunucumuzda ya da kurumun sunucusunda çalıştırabiliriz; o zaman metin kurumdan hiç çıkmaz. Bunu henüz kurmadık; ilk pilotta kurumla birlikte kuracağız.

### Genç bir şirketin problemini gerçekten çözebilir mi?

- Bu yüzden önce küçük bir deneme projesi var, kadro değil. Case’in başarı kriterleri aşamalara bölünüyor; her aşamayı genç teslim ediyor, kurum onaylıyor. Kurum onaylamadan aşama kapanmıyor.
- Örnekte Kuzey Lojistik’in rota case’i: 3.000 noktalık rotanın 5 dakikanın altında hesaplanması. Onaylanan aşama gencin profiline imzalı deneyim olarak yazılıyor; işe girmese bile bu deneyimi taşıyor.

### XP neyle kazanılıyor?

- Her XP bir iş makbuzu: üretim yaptığın gün 10, doğrulanmış kanıt 40, kurum onaylı aşama 120 XP. Günlük tavan 200.
- Her satırın arkasında dışarıda kontrol edilebilen bir olay var: birleşmiş bir PR, doğrulanmış bir alan adı ya da bir kurum imzası.

### Sistem nasıl işliyor?

- Üç nesne var: Kanıt, İhtiyaç, Pilot. Kanıtın üç seviyesi var: Beyan, Doğrulandı, Kurum onaylı.
- Kurum ilan yazmaz; yedi alanlı kanvasla ihtiyaç yazar. Netlik puanı 70’i geçmeden ihtiyaç yayımlanmaz.
- Pilot aşamalara bölünür: genç teslim eder, kurum onaylar. Onaylanan aşama gencin profiline Kurum onaylı kanıt olarak döner.

### Genç ve kurum tarafı neden farklı?

- Genç ritim ister: haftalık hedef, seri, lig ve Niri’nin kostümleri. Ama hepsini yalnızca gerçek iş kazandırır.
- Kurum ölçüm ister, oyun yok: şikâyetten ihtiyaca, gerekçeli kısa listeye, küçük bir pilota ve hesap verebilir kayda.

### Uyum puanına neden güvenelim?

- Puan dört parçadan oluşur ve ağırlıkları açıktır: kanıt 45, bağlam 20, kapasite 15, iş birliği geçmişi 20 puan.
- İlk temasta isim, okul, şehir görünmez; kimlik pilot teklifiyle açılır.
- Her aşama iki tarafın onayıyla deftere yazılır; kayıtlar SHA-256 ile zincirlenir. Kod açık: her formülü herkes okuyabilir.

### Neden bu model?

- Gemma 4 açık ağırlıklı ve Apache 2.0 lisanslı: açık kaynak bir hizmetin modeli de açık, istenirse kendi sunucumuzda çalışır.
- Örnek metinde dört açık model denedik; JSON şemasına uyan, Türkçe metni doğru alanlara ayıran en hızlı model buydu.

### İnternet ya da model giderse ne olur?

- Taslağı kural motoru çıkarır ve ekran bunu açıkça söyler; akış kesilmez.
- Örnek metin için modelin gerçek, kayıtlı bir cevabı var: model ulaşılamazsa o gösterilir ve ekranda “kayıttan” yazar.

### Kurum az yazarsa ne olur?

- Model metinde olmayan her alan için kurumun derdine özel bir öneri getirir; kutuda “Niri’nin önerisi” olarak soluk durur.
- Öneride sayı uydurmaz, yerine “…” koyar; rakamı kurum yazar. Kurum kullanmadan hiçbir öneri kanvasa girmez.

### Mobil uygulama var mı?

- Var. Nirengi bir web uygulaması (PWA): adresi telefonda açıp ya da ana sayfadaki QR’ı okutup Uygulamayı yükle’ye dokununca ana ekrana gelir, tam ekran açılır ve sayfaları telefonda tuttuğu için internetsiz de çalışır.
- Android’de paylaş menüsünden Behance ya da YouTube bağlantısı doğrudan eser olarak gelir; simgeye basılı tutunca Bugün, Eser ekle, İhtiyaç yaz kısayolları çıkar.
- Mağaza yerine bunu seçtik: iki gün içinde, sıfır maliyetle, tek kodla hem gence hem kuruma. Bildirim göndermiyoruz; kalıcı sunucu gelince sıradaki iş o.

### Yalnız yazılımcılar için mi?

- Hayır. Kanıt bağla önce işin nerede durduğunu sorar: kodu GitHub’da olan depolarını bağlar; tasarımcı, animasyoncu, çevirmen LinkedIn, Behance, ArtStation, YouTube profillerini ve eserlerini ekler.
- Bu sitelerde hesabın kime ait olduğunu dışarıdan kontrol edemiyoruz; o yüzden Beyan diyoruz, uydurma bir doğrulama göstermiyoruz. Her alanda en güçlü kanıt aynı: kurumun onayladığı deneme projesi.

### İlk pazarınız kim?

- Odak girişim ekosistemi. İlk tur: Zemin360 ve GİRVAK ağındaki girişimler ve gençler. Sonra BİT uzmanı olmayan küçük işletmeler, kamu birimleri ve STK’lar.
- Bağımsız bir mikro staj pazar büyüklüğü bulamadık; uydurma bir rakam vermiyoruz.

### Rakipleriniz kim?

- Pazarda iki dünya var. Oyunlaştırılmış öğrenme alışkanlık kurar ama puanı dışarıda geçmez.
- İlan siteleri, testler, bootcamp’ler ve mikro staj programları tek seferlik bir eşik; kanıt çoğu zaman platformun içinde kalır. İkisini birleştiren bir platformu Türkiye’de bulamadık.

### Nasıl yaşayacak, ücret var mı?

- Gence ücret yok. Kod MIT lisanslı ve açık; kanıt gencindir. Bugün gelirimiz yok.
- Pilotta dört seçenek sınayacağız: kamu ve vakıf fonları, kalkınma ajansları, üniversite kariyer merkezleri, kurum tarafında barındırma ve destek.
- Yapay zekâ da ücretsiz kotayla çalışıyor: Workers AI’ın günlük ücretsiz payı, taslak başına yaklaşık 28 nöron, günde 350 civarı taslak. Kota dolarsa kural motoru devralır; fatura çıkmaz.

### Başarıyı nasıl ölçeceksiniz?

- Hedef rakam koymuyoruz, önce taban çizgisini ölçeceğiz.
- Kayıttan ilk doğrulanmış işe kaç gün geçtiği, yayımlanan ihtiyaçların kaçının pilota dönüştüğü, pilotların tamamlanma oranı ve eşleşmeyen gençlerin geri bildirimden sonra yeni kanıt ekleme oranı.
