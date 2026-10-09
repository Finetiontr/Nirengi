# Sunum notları

*Zemin360 finali · 12 slayt ve 8 ek · planlanan süre 5:50 (video 1:20, konuşma 4:30)*

Bu dosya `src/components/sunum/notes.ts` dosyasından üretildi; notları orada düzeltin. Sunum sırasında aynı notlar konuşmacı penceresinde görünür: sunumda **N** tuşu ya da `/sunum?notlar` adresi. Pencere sunumu izler, ok tuşlarıyla sunumu yönetir, **R** süreyi sıfırlar.

Akış, organizasyonun önerdiği 12 adımı izler. 6. slaytta tanıtım videosu kendiliğinden oynar; Niri ve sayaç o sırada çekilir. Kapanıştan sonra → ile ek slaytlara geçilir; **End** kapanışa döner.

Slaytlardaki her sayı `docs/PAZAR-ANALIZI.md` içindeki kaynağıyla birlikte slaytın üzerinde yazar; yapay zekâ slaytlarındaki sonuçları ürünün kendi kodu, gerçek bir model cevabıyla hesaplar. Planlar plan, hipotezler hipotez olarak etiketli; kullanıcı, pilot ya da gelir rakamı yok.

## 1. Nirengi

*0:00 – 0:15 · Niri: “Merhaba, ben Niri! Bugün size haritamı göstereceğim.”*

- Merhaba, biz Nirengi: Sezer Uzun ve Emirhan Açık.
- Nirengi noktası, haritacının üzerine güvenle ölçüm yaptığı sabit noktadır. Biz gençlerin işi için o noktayı kuruyoruz.

## 2. Problem

*0:15 – 0:45 · Niri: “Gençler görünmüyor, kurumlar emin olamıyor.”*

- Döngüyü hepimiz biliyoruz: deneyim yoksa iş yok, iş yoksa deneyim yok.
- 15–24 yaşta her 100 gençten 23’ü ne okulda ne işte. Avrupa’yla kıyaslandığında en yüksek oran bizde.
- Öbür tarafta, BİT uzmanı almakta zorlanan şirketlerin %71’i aynı şeyi söylüyor: ilgili deneyim yok.
- Genç görünmüyor, kurum kime güveneceğini bilmiyor.

## 3. Kim için

*0:45 – 1:10 · Niri: “Biri kanıt arıyor, öbürü güven.”*

- İki kullanıcımız var.
- Birincisi üreten ama kanıtı olmayan genç. Tek bir seçici programa bir milyon başvuru geliyor; kapıdan giremeyenlerin de gösterecek bir işi olmalı.
- İkincisi BİT uzmanı olmayan küçük kurum. Türkiye’deki 3,93 milyon girişimin %99,6’sı KOBİ. İhtiyacı var ama tarif edemiyor, kadro riskini alamıyor.

## 4. Kanıt

*1:10 – 1:35 · Niri: “Rakamları uydurmadım; kaynakları altında.”*

- Bunu nereden biliyoruz?
- Diploma şartını kaldıran şirketlerde bile işe alım 700’de 1’den az değişti. Niyet var, ölçme aracı yok.
- İşverenlerin %63’ü beceri açığını bir numaralı engel görüyor. Yapay zekâya açık mesleklerde ise en çok gençlerin istihdamı düşüyor.
- Bir de 37 platform ve programı tek tek inceledik. Oyun ritmini, dışarıda doğrulanmış işi ve kurum imzasını bir araya getiren bir örnek bulamadık.

## 5. Çözüm

*1:35 – 2:00 · Niri: “Kanıt, ihtiyaç, pilot: tek döngü.”*

- Çözümümüz tek cümle: genç gerçek işiyle görünür, kurum ihtiyacını ölçülebilir yazar, ikisi küçük bir pilotta buluşur.
- Pilotta onaylanan her aşama, gencin profiline kurum onaylı kanıt olarak döner.
- Ekranlar gerçek. Ama onları biz değil, maskotumuz anlatsın: sözü Niri’ye bırakıyorum.

## 6. Niri anlatıyor

*2:00 – 3:20 · Niri: “Sahne benim! Ürünü telefonda göstereyim.”*

- (Video oynar; konuşma yok. Bitince → ile devam.)
- Süre kalırsa canlı göster: hazır kurum penceresinde Örnekle doldur → Taslağa dönüştür → Metninden çıkardıklarım.
- Video açılmazsa slayt kendiliğinden canlı demo paneline döner; Sunum klasöründeki mp4 de yedekte.

## 7. Yapay zekâ ne yapıyor

*3:20 – 3:50 · Niri: “Derdini yaz, ben okuyayım. Uydurmam.”*

- Videoda gördüğünüz yapay zekâ adımı şu: kurum derdini kendi sözleriyle yazıyor.
- Açık ağırlıklı bir model, Gemma 4, bu metni yedi alanlı ihtiyaç kanvasına çeviriyor: mevcut durum, sorun, sorunun ölçüsü, hedef, kısıtlar, karar verici ve kapsam.
- Her alanın yanında metindeki hangi cümleden geldiği yazıyor. Kurum taslağı okurken kaynağını da görüyor.

## 8. Önce ve sonra

*3:50 – 4:15 · Niri: “Aynı metinden daha dolu bir taslak.”*

- Fark ne? Aynı metni önceki kural motorumuz da okuyordu.
- Kural motoru beş alan buldu: netlik 60, yayımlanamaz.
- Model yedi alanı doldurdu, karar vericiyi ve kapsamı da buldu: 75. Üstüne ölçülebilir iki başarı kriteri önerdi; kurum ikisini ekleyince 100 ve yayımlanabilir.
- Bu sayılar tahmin değil; testlerimizde sabit.

## 9. Hatalı çıktıya karşı

*4:15 – 4:45 · Niri: “Metinde yoksa almam, sorarım.”*

- Model yanılırsa? Cevabını doğrudan kullanmıyoruz; dört kapıdan geçiyor.
- Şemaya uymalı, her alanın alıntısı metinde birebir geçmeli, alandaki her sayı metinde yazmalı, her kriter ölçülebilir olmalı.
- Testten bir örnek: model “Genel Müdür onaylar” diye uydurursa alan boş kalır, Niri kuruma kimin onaylayacağını sorar.
- Reddedilen her şey kuruma gösterilir. Model hiç cevap vermezse aynı ekranı kural motoru doldurur.

## 10. Tasarım kararları

*4:45 – 5:10 · Niri: “Gence oyun, kuruma sakin bir ölçüm.”*

- Tasarımda beş karar verdik.
- Her ekranda tek iş, ve önce telefon.
- Oyun yalnız genç tarafında; kurum ekranı sakin, XP yok.
- Kurum adayı temasa kadar isimsiz görür.
- Niri yol gösterir ama kimseyi bekletmez.

## 11. Bitti ve bırakılan

*5:10 – 5:35 · Niri: “Prototipim çalışıyor. Gerisini pilotta kanıtlayacağım.”*

- Altı problemin altısına çalışan bir ekranımız var. GitHub ve DNS doğrulaması, yapay zekâ taslağı ve denetimi canlıda.
- Bilerek bıraktıklarımız da belli: kalıcı veritabanı yok, veri tarayıcıda. Demo kişileri kurgusal ve ekranda öyle yazıyor.
- Finalden sonraki dört ayın planı: kalıcılık, ilk ihtiyaç turu, kod dışı kanıt, taşınabilir rozet ve fon verene pilot raporu.

## 12. Teşekkürler

*5:35 – 5:50 · Niri: “Zirvedeyim! Teşekkürler, haritada görüşmek üzere.”*

- Tek bir isteğimiz var: bu salondan bir kurumun gerçek bir ihtiyacı. İlk kanvası birlikte yazalım.
- Beyan değil, kanıt. Teşekkürler; sorularınızı bekliyoruz.

## Ek: sorular için

Bir soru gelirse kapanıştan → ile açılır.

### Ek 1. XP makbuzu

*Niri: “Benim XP’m boş tıklamayla gelmez.”*

- Başka yerlerde XP uygulamanın içinde kalır; Nirengi’de her XP bir iş makbuzudur.
- Üretim yaptığın gün 10, doğrulanmış kanıt 40, kurum onaylı aşama 120 XP. Günlük tavan 200. Boş tıklama sıfır.
- Her satırın arkasında dışarıda kontrol edilebilen bir olay var: birleşmiş bir PR, doğrulanmış bir alan adı ya da bir kurum imzası.

### Ek 2. Üç nesne, tek döngü

*Niri: “İş bitince kanıtın bir basamak yükselir.”*

- Sistem üç nesneden oluşuyor: Kanıt, İhtiyaç, Pilot.
- Kanıtın üç seviyesi var: Beyan, Doğrulandı, Kurum onaylı.
- Kurum ilan yazmaz; yedi alanlı kanvasla ihtiyaç yazar. Çözülebilirlik puanı 70’i geçmeden ihtiyaç yayımlanmaz.
- Pilot aşamalara bölünür: genç teslim eder, kurum onaylar. Onaylanan aşama gencin profiline Kurum onaylı kanıt olarak döner.

### Ek 3. Genç ve kurum

*Niri: “Gence oyun, kuruma ölçüm; ikisi de aynı kanıttan.”*

- Genç için tanıdık bir oyun ritmi: haftalık hedef, seri, lig ve Niri’nin kostümleri. Ama hepsini yalnızca gerçek iş kazandırır.
- Eşleşmediğinde nedenini görür: hangi kanıt eksik, hangi görev o eksiği kapatır.
- Kurum tarafı sakin: oyun yok, ölçüm var. Şikâyetten ihtiyaca, gerekçeli kısa listeye, küçük bir pilota ve hesap verebilir kayda.

### Ek 4. Neden güvenilir

*Niri: “Her puanımın nedenini sorabilirsiniz.”*

- Uyum puanı dört parçadan oluşur ve ağırlıkları açıktır: kanıt 45, bağlam 20, kapasite 15, iş birliği geçmişi 20 puan.
- İlk temasta isim, okul, şehir görünmez. Kurum önce işi görür; kimlik pilot teklifiyle açılır.
- Her aşama iki tarafın onayıyla deftere yazılır; kayıtlar SHA-256 ile zincirlenir. Biri geçmişi kurcalarsa zincir kırılır.
- Kod açık: her formülü herkes okuyabilir.

### Ek 5. Önce kim

*Niri: “Haritayı en yakın tepeden çizmeye başlıyorum.”*

- Bağımsız bir mikro staj pazar büyüklüğü bulamadık; uydurma bir rakam göstermiyoruz. Bunun yerine kimden başlayacağımızı söylüyoruz.
- İlk tur: Zemin360 ve GİRVAK ağındaki kurumlar ve gençler.
- İlk pazar: BİT uzmanı olmayan küçük işletmeler, kamu birimleri, STK’lar. 10–49 çalışanlı girişimlerin yalnızca %10,8’i BİT uzmanı çalıştırıyor.

### Ek 6. Rekabet

*Niri: “İkisinin buluştuğu köşe boştu. Oraya yerleştim.”*

- Pazarda iki dünya var. Oyunlaştırılmış öğrenme alışkanlık kurar ama puanı dışarıda geçmez.
- İlan siteleri, testler, bootcamp’ler, mikro staj ve açık inovasyon programları ise tek seferlik bir eşik; kanıt çoğu zaman platformun içinde kalır.
- Sağ üst köşe boş: hem alışkanlık kuran hem dışarıda doğrulanmış işe dayanan. Türkiye’de bu bileşimi sunan bir platform bulamadık.

### Ek 7. Nasıl yaşar

*Niri: “Gence ücret yok. Gerisini pilotta sınayacağız.”*

- Gence ücret yok. Kod MIT lisanslı ve açık; kanıt gencindir.
- Bugün gelirimiz yok. Pilotta sınayacağımız dört seçenek var; hiçbiri henüz gelir değil.
- Kamu ve vakıf fonları, kalkınma ajansları, üniversite kariyer merkezleri ve kurum tarafında barındırma ile destek.
- Yapay zekâ da ücretsiz kotayla çalışıyor: Workers AI’ın günlük ücretsiz payı, taslak başına yaklaşık 28 nöron, günde 350 civarı taslak. Kota dolarsa kural motoru devralır; fatura çıkmaz.

### Ek 8. Pilotta ölçülecekler

*Niri: “Rakam uydurmak yok; ölçüp size getireceğim.”*

- Pilotta dört şeyi ölçeceğiz; hedef rakam koymuyoruz, önce taban çizgisini ölçeceğiz.
- Kayıttan ilk doğrulanmış işe kaç gün geçiyor; yayımlanan ihtiyaçların kaçı pilota dönüşüyor.
- Pilotlarda çift onaylanan aşamalar ve tamamlanma oranı; eşleşmeyen gençlerin geri bildirimden sonra yeni kanıt ekleme oranı.
