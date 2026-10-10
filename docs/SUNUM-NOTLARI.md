# Sunum notları

*Zemin360 finali · 12 slayt · planlanan süre 4:18 (film 0:48, konuşma 3:30)*

Bu dosya `src/components/sunum/notes.ts` dosyasından üretildi; notları orada düzeltin. Sunum sırasında aynı notlar konuşmacı penceresinde görünür: sunumda **N** tuşu ya da `/sunum?notlar` adresi. Pencere sunumu izler, ok tuşlarıyla sunumu yönetir, **R** süreyi sıfırlar.

Akış, organizasyonun önerdiği 12 adımı izler. Slaytta az söz var; ayrıntıyı konuşmacı söyler. 6. slaytta tanıtım filmi müziğiyle kendiliğinden oynar; Niri ve sayaç o sırada çekilir. Sorular için ayrı slayt yok: kısa cevaplar aşağıda ve kapanışta konuşmacı penceresinde.

Slaytlardaki her sayı `docs/PAZAR-ANALIZI.md` içindeki kaynağıyla birlikte slaytın üzerinde yazar; yapay zekâ slaytlarındaki sonuçları ürünün kendi kodu, gerçek bir model cevabıyla hesaplar. Planlar plan olarak etiketli; kullanıcı, pilot ya da gelir rakamı yok.

## 1. Nirengi

*0:00 – 0:12 · Niri: “Merhaba, ben Niri! Bugün size haritamı göstereceğim.”*

- Merhaba, biz Nirengi: Sezer Uzun ve Emirhan Açık.
- Nirengi noktası, haritacının güvenle ölçtüğü sabit noktadır. Biz gençlerin işi için o noktayı kuruyoruz.

## 2. Problem

*0:12 – 0:32 · Niri: “Gençler görünmüyor, kurumlar emin olamıyor.”*

- Deneyim yoksa iş yok, iş yoksa deneyim yok.
- Her 100 gençten 23’ü ne okulda ne işte.
- Öbür tarafta, BİT uzmanı almakta zorlanan her 100 şirketten 71’i aynı şeyi söylüyor: ilgili iş deneyimi yok.

## 3. Kim için

*0:32 – 0:52 · Niri: “Biri kanıt arıyor, öbürü güven.”*

- İki kullanıcımız var.
- Birincisi, üreten ama kanıtı olmayan genç: tek bir seçici programa bir milyon başvuru geliyor, kapıda kalan görünmüyor.
- İkincisi, BİT uzmanı olmayan küçük kurum: ihtiyacı var ama tarif edemiyor, kadro riskini alamıyor.

## 4. Kanıt

*0:52 – 1:12 · Niri: “Rakamları uydurmadım; kaynakları altında.”*

- Bunu nereden biliyoruz?
- Diploma şartını kaldıran şirketlerde bile işe alım 700’de 1’den az değişti: niyet var, ölçme aracı yok.
- 37 platform ve programı inceledik; doğrulanmış işi ve kurum imzasını bir arada sunanı Türkiye’de bulamadık.

## 5. Çözüm

*1:12 – 1:32 · Niri: “Kanıt, ihtiyaç, pilot: tek döngü.”*

- Çözümümüz tek cümle: genç gerçek işiyle görünür, kurum ihtiyacını ölçülebilir yazar, ikisi küçük bir pilotta buluşur.
- Onaylanan her aşama, gencin profiline kurum onaylı kanıt olarak döner.
- Ürünü 48 saniyelik filmle gösterelim.

## 6. Tanıtım filmi

*1:32 – 2:20 · Niri: “Sahne benim! Ürünü telefonda göstereyim.”*

- (Film müzikle oynar; konuşma yok. Bitince → ile devam.)
- Ses gelmezse filme bir kez tıkla.
- Film açılmazsa slayt kendiliğinden canlı demo paneline döner; Sunum klasöründeki mp4 de yedekte.

## 7. Yapay zekâ ne yapıyor

*2:20 – 2:40 · Niri: “Derdini yaz, ben okuyayım. Uydurmam.”*

- Filmdeki yapay zekâ adımı şu: kurum derdini kendi sözleriyle yazıyor.
- Açık ağırlıklı bir model, Gemma 4, bu metni yedi alanlı ihtiyaç kanvasına çeviriyor.
- Her alan metindeki bir cümleye dayanıyor: “ayda 6.000 arama” sorunun ölçüsü oluyor.

## 8. Önce ve sonra

*2:40 – 2:58 · Niri: “Aynı metinden daha dolu bir taslak.”*

- Aynı metni kural motorumuz da okuyor: beş alan, netlik 60, yayımlanamaz.
- Model yedi alanı dolduruyor ve iki ölçülebilir kriter öneriyor: 75. Kurum önerileri ekleyince 100.
- Bu sayıları ürünün kendi kuralları hesaplıyor.

## 9. Hatalı çıktıya karşı

*2:58 – 3:22 · Niri: “Metinde yoksa almam, sorarım.”*

- Model yanılırsa? Cevabı dört kapıdan geçiyor: şema, alıntı, sayı, ölçülebilirlik.
- Model “Genel Müdür onaylar” diye uydurursa, bu cümle metinde olmadığı için alan boş kalır; Niri kuruma sorar.
- Yayın kararını model değil, kurallar veriyor. Model hiç cevap vermezse kural motoru devralır.

## 10. Tasarım kararları

*3:22 – 3:40 · Niri: “Gence oyun, kuruma sakin bir ölçüm.”*

- Tasarımda beş karar verdik.
- Her ekranda tek iş, ve önce telefon.
- Oyun yalnız genç tarafında; kurum ekranı sakin.
- Kurum adayı temasa kadar isimsiz görür. Niri yol gösterir ama kimseyi bekletmez.

## 11. Bitti ve bırakılan

*3:40 – 4:06 · Niri: “Prototipim çalışıyor. Gerisini pilotta kanıtlayacağım.”*

- Altı problemin altısına çalışan bir ekranımız var. GitHub ve DNS doğrulaması, yapay zekâ taslağı canlıda; eşleşme ve kayıt defteri testli.
- Yalnız yazılımcılar için değil: tasarımcı da çevirmen de LinkedIn, Behance, ArtStation bağlantılarıyla profilini kuruyor.
- Bilerek bıraktıklarımız: kalıcı veritabanı, gerçek kullanıcı ve pilot. Kod dışı bağlantıları makineyle doğrulamıyoruz, Beyan diyoruz. Demo kişileri kurgusal, ekranda da öyle yazıyor.
- Finalden sonraki dört ay: kalıcılık, ilk ihtiyaç turu, kod dışı doğrulama ve pilot raporu.

## 12. Teşekkürler

*4:06 – 4:18 · Niri: “Zirvedeyim! Teşekkürler, haritada görüşmek üzere.”*

- Tek bir isteğimiz var: bu salondan bir kurumun gerçek bir ihtiyacı. İlk kanvası birlikte yazalım.
- Beyan değil, kanıt. Teşekkürler.

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

### Yalnız yazılımcılar için mi?

- Hayır. Kanıt bağla önce işin nerede durduğunu sorar: kodu GitHub’da olan depolarını bağlar; tasarımcı, animasyoncu, çevirmen LinkedIn, Behance, ArtStation, YouTube profillerini ve eserlerini ekler.
- Bu sitelerde hesabın kime ait olduğunu dışarıdan kontrol edemiyoruz; o yüzden Beyan diyoruz, uydurma bir doğrulama göstermiyoruz. Her alanda en güçlü kanıt aynı: kurumun onayladığı deneme projesi.

### İlk pazarınız kim?

- Bağımsız bir mikro staj pazar büyüklüğü bulamadık; uydurma bir rakam vermiyoruz.
- İlk tur: Zemin360 ve GİRVAK ağındaki kurumlar ve gençler. Sonra BİT uzmanı olmayan küçük işletmeler, kamu birimleri ve STK’lar.

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
