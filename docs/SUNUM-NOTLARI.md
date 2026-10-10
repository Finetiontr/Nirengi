# Sunum notları

*Zemin360 finali · 12 slayt · planlanan süre 5:08 (film 0:48, konuşma 4:20)*

Bu dosya `src/components/sunum/notes.ts` dosyasından üretildi; notları orada düzeltin. Sunum sırasında aynı notlar konuşmacı penceresinde görünür: sunumda **N** tuşu ya da `/sunum?notlar` adresi. Pencere sunumu izler, ok tuşlarıyla sunumu yönetir, **R** süreyi sıfırlar.

Akış, organizasyonun önerdiği 12 adımı izler. Slaytta az söz var; ayrıntıyı konuşmacı söyler. 6. slaytta tanıtım filmi müziğiyle kendiliğinden oynar; Niri ve sayaç o sırada çekilir. Sorular için ayrı slayt yok: kısa cevaplar aşağıda ve kapanışta konuşmacı penceresinde.

Slaytlardaki her sayı `docs/PAZAR-ANALIZI.md` içindeki kaynağıyla birlikte slaytın üzerinde yazar; yapay zekâ slaytlarındaki sonuçları ürünün kendi kodu, gerçek bir model cevabıyla hesaplar. Planlar plan olarak etiketli; kullanıcı, pilot ya da gelir rakamı yok.

## 1. Nirengi

*0:00 – 0:15 · Niri: “Merhaba, ben Niri! Bugün size haritamı göstereceğim.”*

- Merhaba, biz Nirengi: Sezer Uzun ve Emirhan Açık.
- Nirengi noktası, haritacının üzerine güvenle ölçüm yaptığı sabit noktadır. Biz gençlerin işi için o noktayı kuruyoruz.

## 2. Problem

*0:15 – 0:40 · Niri: “Gençler görünmüyor, kurumlar emin olamıyor.”*

- Döngüyü hepimiz biliyoruz: deneyim yoksa iş yok, iş yoksa deneyim yok.
- Her 100 gençten 23’ü ne okulda ne işte; Avrupa’yla kıyaslandığında en yüksek oran bizde.
- Öbür tarafta, BİT uzmanı almakta zorlanan her 100 şirketten 71’i aynı şeyi söylüyor: ilgili iş deneyimi yok.

## 3. Kim için

*0:40 – 1:05 · Niri: “Biri kanıt arıyor, öbürü güven.”*

- İki kullanıcımız var.
- Birincisi üreten ama kanıtı olmayan genç. Tek bir seçici programa bir milyon başvuru geliyor; kapıda kalanın da gösterecek bir işi olmalı.
- İkincisi BİT uzmanı olmayan küçük kurum: 10–49 çalışanlı girişimlerin yalnız %10,8’inde BİT uzmanı var. İhtiyacı var ama tarif edemiyor, kadro riskini alamıyor.

## 4. Kanıt

*1:05 – 1:30 · Niri: “Rakamları uydurmadım; kaynakları altında.”*

- Bunu nereden biliyoruz?
- Diploma şartını kaldıran şirketlerde bile işe alım 700’de 1’den az değişti: niyet var, ölçme aracı yok.
- İşverenlerin %63’ü beceri açığını bir numaralı engel görüyor.
- Biz de 37 platform ve programı tek tek inceledik. Oyun ritmini, doğrulanmış işi ve kurum imzasını bir arada sunan birini Türkiye’de bulamadık.

## 5. Çözüm

*1:30 – 1:55 · Niri: “Kanıt, ihtiyaç, pilot: tek döngü.”*

- Çözümümüz tek cümle: genç gerçek işiyle görünür, kurum ihtiyacını ölçülebilir yazar, ikisi küçük bir pilotta buluşur.
- Pilotta onaylanan her aşama, gencin profiline kurum onaylı kanıt olarak döner.
- Ekranlar gerçek. Ama onları biz değil, maskotumuz anlatsın: sözü Niri’ye bırakıyorum.

## 6. Tanıtım filmi

*1:55 – 2:43 · Niri: “Sahne benim! Ürünü telefonda göstereyim.”*

- (Film müzikle oynar; konuşma yok. Bitince → ile devam.)
- Ses gelmezse filme bir kez tıkla.
- Film açılmazsa slayt kendiliğinden canlı demo paneline döner; Sunum klasöründeki mp4 de yedekte.

## 7. Yapay zekâ ne yapıyor

*2:43 – 3:08 · Niri: “Derdini yaz, ben okuyayım. Uydurmam.”*

- Filmde gördüğünüz yapay zekâ adımı şu: kurum derdini kendi sözleriyle yazıyor.
- Açık ağırlıklı bir model, Gemma 4, bu metni yedi alanlı ihtiyaç kanvasına çeviriyor.
- Her alan metindeki bir cümleye dayanıyor: “ayda 6.000 arama” sorunun ölçüsü, operasyon direktörü karar verici oluyor.

## 8. Önce ve sonra

*3:08 – 3:33 · Niri: “Aynı metinden daha dolu bir taslak.”*

- Aynı metni önceki kural motorumuz da okuyordu: beş alan, netlik 60, yayımlanamaz.
- Model yedi alanı doldurdu ve iki ölçülebilir başarı kriteri önerdi: 75. Kurum önerileri ekleyince 100, yayımlanabilir.
- Bu sayıları ürünün kendi kuralları hesaplıyor; testlerimizde sabit.

## 9. Hatalı çıktıya karşı

*3:33 – 4:03 · Niri: “Metinde yoksa almam, sorarım.”*

- Model yanılırsa? Cevabını doğrudan kullanmıyoruz; dört kapıdan geçiyor: şema, alıntı, sayı ve ölçülebilirlik.
- Testten bir örnek: model “Genel Müdür onaylar” diye uydurursa bu cümle metinde olmadığı için alan boş kalır, Niri kuruma kimin onaylayacağını sorar.
- Öneriler kurum “Ekle” demeden kanvasa girmez; reddedilen her şey kuruma gösterilir. Model hiç cevap vermezse aynı ekranı kural motoru doldurur.

## 10. Tasarım kararları

*4:03 – 4:28 · Niri: “Gence oyun, kuruma sakin bir ölçüm.”*

- Tasarımda beş karar verdik.
- Her ekranda tek iş, ve önce telefon: her ekran önce 390 pikselde tasarlandı.
- Oyun yalnız genç tarafında; kurum ekranı sakin, XP yok.
- Kurum adayı temasa kadar isimsiz görür.
- Niri yol gösterir ama kimseyi bekletmez.

## 11. Bitti ve bırakılan

*4:28 – 4:53 · Niri: “Prototipim çalışıyor. Gerisini pilotta kanıtlayacağım.”*

- Altı problemin altısına çalışan bir ekranımız var. GitHub ve DNS doğrulaması, yapay zekâ taslağı ve denetimi canlıda; eşleşme, defter ve denetim testli.
- Bilerek bıraktıklarımız: kalıcı veritabanı yok, veri tarayıcıda. Demo kişileri kurgusal ve ekranda öyle yazıyor. Kod dışı kanıt sırada.
- Finalden sonraki dört ay: kalıcılık, ilk ihtiyaç turu, kod dışı kanıt ve fon verene pilot raporu.

## 12. Teşekkürler

*4:53 – 5:08 · Niri: “Zirvedeyim! Teşekkürler, haritada görüşmek üzere.”*

- Tek bir isteğimiz var: bu salondan bir kurumun gerçek bir ihtiyacı. İlk kanvası birlikte yazalım.
- Beyan değil, kanıt. Teşekkürler; sorularınızı bekliyoruz.

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
