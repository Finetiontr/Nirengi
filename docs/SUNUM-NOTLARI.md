# Sunum notları

*Zemin360 finali · 12 slayt · planlanan süre 4:24 (film 0:48, konuşma 3:36)*

Bu dosya `src/components/sunum/notes.ts` dosyasından üretildi; notları orada düzeltin. Sunum sırasında aynı notlar konuşmacı penceresinde görünür: sunumda **N** tuşu ya da `/sunum?notlar` adresi. Pencere sunumu izler, ok tuşlarıyla sunumu yönetir, **R** süreyi sıfırlar.

Konuşma, organizasyonun önerdiği 12 adımı izler ve beş dakikaya sığar. 5. slayt ne çözdüğümüzü (beş durak, altı problem) ve ürünün bir web sitesi olduğunu (tarayıcıda ve telefona yüklü) gösterir; 6. slaytta tanıtım filmi müziğiyle oynar, Niri ve sayaç o sırada çekilir; 7. slayt jürinin en sevdiği eşleşmeyi gerçek ekranıyla açar; 11. slayt her problemden bir gerçek ekranla bitenleri gösterir. Kapanıştan sonra konuşmanın dışında 7 ek sayfa var: filmin öbür sahneleri gerçek ekranı ve üç mekanizmasıyla; soru gelince açılır, paylaşılan PDF’te de durur. Kısa cevaplar aşağıda ve kapanıştan itibaren konuşmacı penceresinde.

Slaytlardaki her sayı `docs/PAZAR-ANALIZI.md` içindeki kaynağıyla birlikte slaytın üzerinde yazar ya da ürünün kendi kodundan gelir (XP tablosu, uyum ağırlıkları, kanıt düzeylerinin ağırlığı, yayın eşiği); yapay zekâ slaytlarındaki sonuçları ürünün kendi kodu, gerçek bir model cevabıyla hesaplar. Planlar plan olarak etiketli; kullanıcı, pilot ya da gelir rakamı yok.

## 1. Nirengi

*0:00 – 0:12 · Niri: “Merhaba, ben Niri! Bugün size haritamı göstereceğim.”*

- Merhaba, biz Nirengi: Sezer Uzun ve Emirhan Açık.
- Nirengi noktası, haritacının güvenle ölçtüğü sabit noktadır. Biz gençlerin işi için o noktayı kuruyoruz: web’de ve telefonda çalışan açık kaynak bir uygulama.

## 2. Problem

*0:12 – 0:30 · Niri: “Gençler görünmüyor, kurumlar emin olamıyor.”*

- Deneyim yoksa iş yok, iş yoksa deneyim yok.
- Her 100 gençten 23’ü ne okulda ne işte.
- Öbür tarafta, BİT uzmanı almakta zorlanan her 100 girişimden 71’i aynı şeyi söylüyor: ilgili iş deneyimi yok.

## 3. Kim için

*0:30 – 0:50 · Niri: “Biri kanıt arıyor, öbürü güvenilir bir ekip.”*

- Odağımız girişim ekosistemi.
- Bir yanda üreten ama kanıtı olmayan genç: tek bir seçici programa bir milyon başvuru geliyor, kapıda kalan görünmüyor.
- Öbür yanda ekip kuran erken aşama girişim: İK’sı yok, yanlış işe alımı kaldıramaz. İlk tur Zemin360 ve GİRVAK ağı.

## 4. Kanıt

*0:50 – 1:06 · Niri: “Rakamları uydurmadım; kaynakları altında.”*

- Bunu nereden biliyoruz?
- Diploma şartını kaldıran şirketlerde bile işe alım 700’de 1’den az değişti: niyet var, ölçme aracı yok.
- 37 platform ve programı inceledik; doğrulanmış işi ve kurum imzasını bir arada sunanı Türkiye’de bulamadık.

## 5. Ne çözüyoruz

*1:06 – 1:28 · Niri: “Beş durak, altı problem. Tarayıcıda da cebinde de.”*

- Ne çözüyoruz? Gencin yaptığı işi ve kurumun ihtiyacını beyandan kanıta çeviriyoruz; ikisi küçük bir pilotta buluşuyor.
- Beş durak var ve yarışmanın altı problemi bu duraklarda, her biri çalışan bir ekranla.
- Ve bu bir web sitesi: tarayıcıda açılıyor, telefona uygulama olarak yükleniyor, internetsiz de çalışıyor. Şimdi 48 saniyelik filmle gezelim.

## 6. Tanıtım filmi

*1:28 – 2:16 · Niri: “Sahne benim! Ürünü telefonda göstereyim.”*

- (Film müzikle oynar; konuşma yok. Bitince → ile devam.)
- Ses gelmezse filme bir kez tıkla.
- Film açılmazsa slayt kendiliğinden canlı demo paneline döner; Sunum klasöründeki mp4 de yedekte.

## 7. Eşleşme

*2:16 – 2:41 · Niri: “İsmi değil, işi tartarım.”*

- Jürinin en çok sorduğu yer: eşleşme. Kurum adayları isimsiz görüyor: Aday 9C03, iki Kurum onaylı iş, 86 puan.
- Puan kara kutu değil: dört parçası ve ağırlıkları açık, her parçanın gerekçesi “Neden bu uyum?” ekranında yazıyor. Kimlik ancak deneme projesi teklif edilince açılıyor.
- Eşleşmeyen genç de boş dönmüyor: hangi işi eklerse hangi ihtiyaca yaklaşacağını görüyor; Flutter’da bir iş eklerse 63’ten 72’ye.

## 8. Yapay zekâ ne yapıyor

*2:41 – 3:06 · Niri: “Derdini yaz, ben okuyayım. Uydurmam.”*

- Yapay zekâ ne yapıyor? Kurum derdini kendi sözleriyle yazıyor; açık ağırlıklı bir model, Gemma 4, metni yedi alanlı kanvasa çeviriyor. Her alan metindeki bir cümleye dayanıyor: “ayda 6.000 arama” sorunun ölçüsü oluyor.
- Farkı sağ altta: aynı metni kural motoru okuyunca netlik 60, yayımlanamıyor; modelle 75, kurum önerileri ekleyince 100. Bu sayıları ürünün kendi kuralları hesaplıyor.
- Gemma’yı açık olduğu, ücretsiz kotada çalıştığı ve denediğimiz dört model içinde Türkçeyi en iyi ayırdığı için seçtik. Yayın kararı ve puanlar kurallarda.

## 9. Hatalı çıktıya karşı

*3:06 – 3:26 · Niri: “Metinde yoksa almam, sorarım.”*

- Model yanılırsa? Cevabı dört kapıdan geçiyor: şema, alıntı, sayı, ölçülebilirlik.
- Model “Genel Müdür onaylar” diye uydurursa, bu cümle metinde olmadığı için alan boş kalır; Niri kuruma sorar.
- Model hiç cevap vermezse kural motoru devralır.

## 10. Tasarım kararları

*3:26 – 3:48 · Niri: “Gence oyun, kuruma sakin bir ölçüm.”*

- Tasarımın tek fikri: gence oyun, kuruma ölçüm.
- Genç her hafta hedef, seri ve ligle geri geliyor; ama her XP bir iş makbuzu. Gençler birbirine de yardım ediyor, yardım eden XP kazanıyor. Niri her hafta en yakın kapıyı gösteriyor.
- Kurum adayı isimsiz görüyor, puanın dört parçası açık, her aşama iki onayla zincirli deftere yazılıyor. Kurum ekranında oyun yok.

## 11. Bitti ve bırakılan

*3:48 – 4:10 · Niri: “Prototipim çalışıyor. Gerisini pilotta kanıtlayacağım.”*

- Bunların hepsi canlıda çalışıyor: her problemin kendi ekranı var, ekrandakiler ürünün gerçek görüntüleri. GitHub ve DNS doğrulaması gerçek, motor 55 testle sınanıyor.
- Bilerek bıraktıklarımız: kalıcı veritabanı, gerçek kullanıcı ve pilot, kod dışı işte makine doğrulaması, bildirim ve mağaza sürümü.
- Finalden sonraki dört ay: kalıcılık, ilk ihtiyaç turu, kod dışı doğrulama ve pilot raporu.

## 12. Teşekkürler

*4:10 – 4:24 · Niri: “Zirvedeyim! İlk noktayı birlikte koyalım.”*

- Tek bir isteğimiz var: bu salondan bir girişimin ya da kurumun gerçek bir ihtiyacı. İlk kanvası birlikte yazalım.
- Beyan değil, kanıt. Teşekkürler.

## Ek sayfalar (konuşmanın dışında)

### Ek 1. İşin, kaynağında doğrulanır

- (Ek sayfa: “Doğrulama nasıl işliyor?” gelirse.) Beyan, Doğrulandı, Kurum onaylı; eşleşmede 0,3, 0,8 ve 1 ağırlıkla sayılır.
- GitHub depolarını genç kendisi seçer; alan adı DNS kaydıyla doğrulanır. Behance, ArtStation, LinkedIn Beyan olarak gelir.

### Ek 2. XP yalnız gerçek işten

- (Ek sayfa: “Oyunlaştırma ne?” gelirse.) Hedef üretim günüdür, commit değil; seri, lig, görevler ve Niri’nin kostümleri.
- XP yalnız doğrulanmış işten: 10, 40, 120; günde en çok 200. Kurum tarafında oyun yok.

### Ek 3. Eksiğini gör

- (Ek sayfa: “Analiz ne gösteriyor?” gelirse.) Niri’nin haftalık notu ve en yakın kapı: “Flutter’da bir doğrulanmış iş eklersen uyumun 63 → 72.”
- Analiz kural tabanlı; formülü /yontem sayfasında.

### Ek 4. Gençler birbirine yardım eder

- (Ek sayfa: “Gençler birbirine nasıl yardım ediyor?” gelirse.) Soru, cevap, teşekkür: soran “İşe yaradı” derse yanıtlayan 15 XP alır.
- Bu haftanın yardımcıları beğeniyle değil, işe yarayan cevap sayısıyla sıralanır.

### Ek 5. Kurum derdini yazar

- (Ek sayfa: “Kurum ihtiyacı nasıl yazıyor?” gelirse.) Kurum derdini düz metinle anlatır; Niri yedi alanlı kanvasa çevirir.
- Netlik 70’in altındaysa ihtiyaç yayımlanmaz; benzer ihtiyaçların sonucu aynı ekranda.

### Ek 6. İki onay, zincirli kayıt

- (Ek sayfa: “Pilot nasıl takip ediliyor?” gelirse.) Kriterler aşamaya dönüşür; genç teslim eder, kurum onaylar.
- Her kaydın özeti bir sonrakine yazılır; sonradan tek harf değişirse zincir o kayıtta kırılır.

### Ek 7. Onay, gencin kanıtı olur

- (Ek sayfa: “Pilot bitince ne oluyor?” gelirse.) Onaylanan aşama gencin profiline Kurum onaylı kanıt olarak geçer, imzalayanıyla.
- Kapanan projenin özeti herkese açık bir sayfada kalır; genç bir sonraki ihtiyaca daha yakındır.

## Soru gelirse

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
