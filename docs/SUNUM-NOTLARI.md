# Sunum notları

*Zemin360 finali · 17 slayt · planlanan süre 6:35 (film 1:31, konuşma 5:04)*

Bu dosya `src/components/sunum/notes.ts` dosyasından `node scripts/sunum-export/notes-md.mjs` ile üretildi; notları orada düzeltin. Niri sessizdir; konuşan ekiptir. Her slaytta Niri’nin iki ya da üç kısa balonu var: her balon, konuşmacının sıradaki cümlesinin başlığı. Balonlar kendiliğinden ilerler: her biri, altındaki cümleyi sakin bir hızla söylemek için gereken süre (saniyede yaklaşık 14 harf) ve kısa bir nefes boyunca kalır; slaytın son balonundan sonra Niri bekler. Konuşmacılar yalnız sayfa değiştirir: **→** (ya da boşluk, tıklama) sıradaki sayfa, **←** önceki sayfa, **P** balonları (film slaytında filmi) duraklatır ve devam ettirir. Her slaytın bir kritik noktası var: jürinin o slayttan aklında tutması gereken tek cümle. Konuşmacı penceresi (**N** ya da `/sunum?notlar`) her balonun altında söylenecekleri ve balonun kalma süresini, sahnedekini çerçeveli gösterir ve saati plana göre tutar; **R** süreyi sıfırlar.

Konuşma organizasyonun önerdiği on iki adımı izler ve beş dakikaya sığar. Omurgası tek bir fikir: kurum gerçek bir case verir, gençler doğrulanmış işleriyle bu case’e göre isimsiz ölçülür, en uyumlusu onu küçük bir deneme projesinde gerçekten çözer ve onaylanan iş profiline imzalı deneyim olarak döner. Deneyimi ölçülebilir bir değere dönüştürüyoruz: ürünün ekranlarında XP diye yazan puan, sunumda deneyim puanı diye anılır ve yalnız gerçek işten gelir. Gençler her alandan: yazılımcı, tasarımcı, animasyoncu, çevirmen. Kurum adayları isimsiz görür; referans ya da tanıdık puana girmez. Altıncı slayt canlı demo olarak 1:30 süren filmi oynatır: önce gencin, sonra kurumun gözünden; müzik kısık çalar, konuşmacı üstüne konuşur. Kapanıştan sonra konuşmanın dışında ek sayfalar var; soru gelince açılır, orada balon kendiliğinden ilerlemez. Kısa cevaplar aşağıda ve kapanıştan itibaren konuşmacı penceresinde.

Planlanan süreler cümlelerin uzunluğundan hesaplanır (`src/components/sunum/timing.ts`): Niri’nin slayta dönüşü, cümleler saniyede 14 harfle ve aralarında 0,6 saniyelik nefes, bir de tuşa basma. Slaytlardaki her sayı `docs/PAZAR-ANALIZI.md` içindeki kaynağıyla birlikte slaytın üzerinde yazar ya da ürünün kendi kodundan gelir (deneyim puanı tablosu, uyum ağırlıkları, kanıt düzeylerinin ağırlığı, yayın eşiği); yapay zekâ slaytlarındaki sonuçları ürünün kendi kodu, gerçek bir model cevabıyla hesaplar. Planlar plan olarak etiketli; kullanıcı, pilot ya da gelir rakamı yok.

## 1. Deneyim yoksa iş yok

*0:00 – 0:22*

**Kritik nokta:** Asıl sorun tek: deneyim yoksa iş yok, iş yoksa deneyim yok.

- **Balon:** “Merhaba, ben Niri.” *(11,9 sn)*  
  Söyle: Merhaba, biz Sezer Uzun, Emirhan Açık ve Ayça Güder. Nirengi’yi Zemin360 Hackathon’unda geliştirdik ve sonrasında açık kaynak olarak yayınlamaya karar verdik.
- **Balon:** “Bugün tek bir sorunu konuşacağız.” *(8,2 sn)*  
  Söyle: Bugün tek bir sorunu konuşacağız: deneyim yoksa iş bulunamıyor, iş bulunamayınca da deneyim kazanılamıyor.

## 2. Problem: genç

*0:22 – 0:42*

**Kritik nokta:** Gençlerin dörtte biri ne öğrenci ne de çalışan.

- **Balon:** “Gençlerin dörtte biri ne öğrenci ne çalışan.” *(8,5 sn)*  
  Söyle: Türkiye’de 15–24 yaş arasındaki her 100 gençten 23’ü ne eğitimde ne de istihdamda. Genç kadınlarda bu oran 31.
- **Balon:** “İlk kayıtlı iş ortalama 14 ayda bulunuyor.” *(10,4 sn)*  
  Söyle: Lisans mezunları ilk kayıtlı işlerini ortalama 14,4 ayda buluyor. Bu gençlerin önemli bir kısmı yeteneksiz değil, yalnızca görünür değil.

## 3. Problem: kurum

*0:42 – 0:57*

**Kritik nokta:** İşverenler de aynı engeli görüyor: adayların ilgili iş deneyimi yok.

- **Balon:** “İşverenler de aynı engeli görüyor.” *(4,3 sn)*  
  Söyle: İşverenler de aynı engeli farklı bir yönden görüyor.
- **Balon:** “Her 100 işverenden 71’i: deneyim yok.” *(9,2 sn)*  
  Söyle: Bilişim uzmanı alırken zorlanan girişimlerin yüzde 71’i, adayların ilgili iş deneyimi olmamasını neden olarak gösteriyor.

## 4. Kök neden: ölçüm

*0:57 – 1:19*

**Kritik nokta:** Deneyim yılı, işteki performansı neredeyse hiç öngörmüyor (0,07).

- **Balon:** “Asıl sorun ölçme biçiminde.” *(8,2 sn)*  
  Söyle: Asıl sorun ölçme biçiminde. Kurumlar deneyimi doğrudan ölçemediği için adayın kaç yıl çalıştığına bakıyor.
- **Balon:** “Deneyim yılı performansı neredeyse öngörmüyor.” *(12,1 sn)*  
  Söyle: Oysa deneyim yılı, işteki performansı 0 ile 1 arasında yalnızca 0,07 düzeyinde öngörüyor. Adaya işin bir parçasını yaptırmak 0,33 ile çok daha iyi sonuç veriyor.

## 5. Kök neden: tanıdık

*1:19 – 1:33*

**Kritik nokta:** Çalışan önerisiyle gelen aday, mülakata yaklaşık 13 kat daha sık çağrılıyor.

- **Balon:** “Ölçülemeyen yeri tanıdık dolduruyor.” *(4,1 sn)*  
  Söyle: Deneyim ölçülemeyince boşluğu tanıdık dolduruyor.
- **Balon:** “Önerilen aday 13 kat daha sık çağrılıyor.” *(8,4 sn)*  
  Söyle: Normal başvuruların yüzde 3’ü mülakata çağrılıyor. Şirket çalışanlarının önerdiği adaylarda bu oran yüzde 40.

## 6. Türkiye’de tanıdık

*1:33 – 1:54*

**Kritik nokta:** Türkiye’de gençler iş bulmayı tanıdığa bağlı görüyor; bunu ölçen bir veri yok.

- **Balon:** “Gençler iş bulmayı tanıdığa bağlı görüyor.” *(8,5 sn)*  
  Söyle: Eğitimde ya da istihdamda olmayan gençlerin yüzde 86’sı, tanıdığı olmayanın iş bulmakta zorlandığını düşünüyor.
- **Balon:** “İsim bile sonucu değiştirebiliyor.” *(10,6 sn)*  
  Söyle: İstanbul’daki bir deneyde nitelikleri aynı iki kadın adaydan, ismi farklı bir etnik kökeni çağrıştıran aday 2,5 kat daha az geri dönüş aldı.

## 7. Problemin yeri: ilk eleme

*1:54 – 2:18*

**Kritik nokta:** Döngü, başvuruların ilk elendiği aşamada kilitleniyor.

- **Balon:** “Döngü ilk elemede kilitleniyor.” *(9,2 sn)*  
  Söyle: Sorunun kilitlendiği yer ilk eleme. CV’lerin çoğu açılmıyor, deneyim yılına bakılıyor ve tanıdığı olan aday öne geçiyor.
- **Balon:** “Nirengi bu aşamayı değiştirmeyi öneriyor.” *(13,4 sn)*  
  Söyle: İlanların beşte biri de gerçekte doldurulmayacak pozisyonlar için açılıyor. Nirengi, ihtiyacın açık yazılmasını ve ilk değerlendirmenin isimsiz ve işe dayalı yapılmasını öneriyor.

## 8. Döngü kırılabilir

*2:18 – 2:42*

**Kritik nokta:** İlk fırsat ve herkese açık değerlendirme döngüyü kırıyor.

- **Balon:** “İlk fırsat döngüyü kırıyor.” *(10,9 sn)*  
  Söyle: Döngü kırılabiliyor. Hiç iş almamış kişilere küçük bir iş verilip işleri herkese açık puanlandığında, iş bulma oranları yüzde 12’den 30’a çıktı.
- **Balon:** “Doğrulanmış iş, tanıdığın yerini tutabiliyor.” *(11,7 sn)*  
  Söyle: Kefil olan bir aracı kurum, deneyimsiz kişinin iş bulma olasılığını yüzde 75 artırıyor. Kişi herkese açık iyi puanlar biriktirdikçe bu farka gerek kalmıyor.

## 9. Niri: herkesin referansı

*2:42 – 3:00*

**Kritik nokta:** Niri, tanıdığı olmayan herkesin referansı.

- **Balon:** “Tanıdığın yoksa referansın ben olurum.” *(8,6 sn)*  
  Söyle: Niri, tanıdığı olmayan herkes için referans görevi görüyor: kişiyi kim olduğuyla değil, ne yaptığıyla tanıtıyor.
- **Balon:** “Herkese aynı kural.” *(7,5 sn)*  
  Söyle: Bir tanıdığın sağladığı güveni doğrulanmış iş kaydıyla sağlıyor ve herkese aynı kuralı uyguluyor.

## 10. Nasıl çalışır

*3:00 – 3:19*

**Kritik nokta:** Dört adım: ihtiyaç, isimsiz değerlendirme, deneme projesi, kayıt.

- **Balon:** “Dört adım: ihtiyaç, değerlendirme, deneme, kayıt.” *(8,6 sn)*  
  Söyle: Nirengi dört adımda çalışıyor. Önce kurum ihtiyacını yazıyor, ardından gençler isimsiz olarak değerlendiriliyor.
- **Balon:** “Onaylanan iş gencin deneyimi olur.” *(9,2 sn)*  
  Söyle: En uygun aday işi küçük bir deneme projesinde yapıyor. Kurumun onayladığı iş, gencin profiline deneyim olarak ekleniyor.

## 11. Usta–çırak: senior ve junior

*3:19 – 3:39*

**Kritik nokta:** Usta–çırak ilişkisi, yazılımdaki senior–junior modeliyle her aşamada kuruluyor.

- **Balon:** “Usta–çırak, senior–junior olarak.” *(9,1 sn)*  
  Söyle: Usta–çırak ilişkisini yazılımdaki senior–junior modeliyle kuruyoruz. Junior işi yapıyor, senior inceliyor ve onaylıyor.
- **Balon:** “Her aşamada bir senior var.” *(9,9 sn)*  
  Söyle: Bu ilişki her aşamada var: ihtiyacı parçalara bölen, teslimi inceleyen ve onayı veren hep deneyimli bir kişi. Bunu filmde görelim.

## 12. Canlı demo: film

*3:39 – 5:10*

**Kritik nokta:** Filmde iki göz var: önce genç, sonra kurum; her ekran ürünün gerçek ekranı.

(Film kendi oynar; Niri’nin sesi yok, söyleyeceği balonunda yazar. Üstüne konuş, ekrandaki yazıyı okuma, tamamla; müzik kısık çalar. P durdurur ve devam ettirir. Film bitince →.)

- **0:00 · Filmde:** “Deneyim yoksa iş yok. İş yoksa deneyim yok.”  
  Bu döngüyü hepimiz biliyoruz; Nirengi onu kırmak için var.
- **0:06 · Filmde:** “nirengi · Deneyimi ölçülebilir bir değere dönüştüren açık kaynak web sitesi.”  
  Gençlerin yaptığı işi ölçülebilir deneyime çeviren açık kaynak bir web sitesi.
- **0:12 · Filmde:** “Gencin gözünden”  
  Önce gencin gözünden bakalım.
- **0:15 · Filmde:** “Yazılım, tasarım, video ya da çeviri: işin neyse onunla görün.”  
  Genç işini nerede yapıyorsa oradan bağlıyor: kod GitHub’dan, tasarım Behance’ten, animasyon YouTube’dan.
- **0:22 · Filmde:** “Doğrulanan her iş deneyim puanı olur; en değerlisi kurum onayı.”  
  Ece’nin kodu yok; animasyonunu bir sağlık kurumu onayladı, bu ona 120 deneyim puanı getirdi. Doğrulanmış iş 40, üretim yapılan gün 10.
- **0:29 · Filmde:** “Flutter’da bir iş eklersen bu ihtiyaca uyumun 63’ten 72’ye çıkar.”  
  Niri her gence hangi işin onu hangi ihtiyaca yaklaştıracağını söylüyor.
- **0:36 · Filmde:** “Kurumun gözünden”  
  Şimdi kurumun gözünden.
- **0:39 · Filmde:** “İlan değil: derdini kendi cümlelerinle anlat.”  
  Kuzey Lojistik ilan yazmıyor; derdini kendi cümleleriyle anlatıyor.
- **0:45 · Filmde:** “Niri açık bir modelle okur. (Gemma 4 · açık model)”  
  Niri metni açık kaynak Gemma 4 ile okuyor; her alan kurumun bir cümlesine dayanıyor, metin saklanmıyor.
- **0:50 · Filmde:** “Metinde olmayanı yazmaz.”  
  Model metinde olmayan bir karar verici uydurursa denetim onu almıyor; Niri kuruma soruyor.
- **0:55 · Filmde:** “Referans, tanıdık, okul değil: yalnız yaptığı iş tartılır.”  
  Adaylar isimsiz: isim, yaş, okul, şehir ilk temasa kadar gizli; referans ya da tanıdık puana hiç girmiyor.
- **0:59 · Filmde:** “Neden bu uyum?”  
  Puanın dört parçası var: yaptığı iş, sektör, zaman, ortak geçmiş; her birinin gerekçesi yazıyor.
- **1:03 · Filmde:** “Genç teslim eder, kurum onaylar: iki imza, değişmeyen kayıt.”  
  En uyumlu genç case’i küçük bir deneme projesinde çözüyor; her aşama iki imzayla zincire yazılıyor.
- **1:10 · Filmde:** “Kurum onayı profiline imzalı yazılır: +120 deneyim puanı.”  
  Onaylanan iş gencin profiline imzalı deneyim olarak dönüyor.
- **1:18 · Filmde:** “Yaptığın iş, deneyimin olur. Deneyimin, yeni işin olur.”  
  Döngü böylece tersine dönüyor.
- **1:25 · Filmde:** “Emirhan, sıradaki sayfaya geçelim mi?”  
  (Film bitince →.)

## 13. Bugün çalışan

*5:10 – 5:27*

**Kritik nokta:** Bugün sitede çalışan dört çözüm, dört sorunu karşılıyor.

- **Balon:** “Bunlar bugün sitede çalışıyor.” *(5,1 sn)*  
  Söyle: Bu dört çözüm bugün sitede çalışıyor ve herkes inceleyebiliyor.
- **Balon:** “Yıl yerine iş, isim yerine kanıt.” *(10,3 sn)*  
  Söyle: Deneyim yılı yerine doğrulanmış iş, isim yerine isimsiz değerlendirme, belirsiz ilan yerine açık ihtiyaç ve kadro yerine deneme projesi.

## 14. Sırada: güven

*5:27 – 5:46*

**Kritik nokta:** Sırada güven: kurum doğrulaması, karşılıksız emeğin önlenmesi, canlı görüşme.

- **Balon:** “Sırada güveni güçlendirmek var.” *(4,3 sn)*  
  Söyle: Üzerinde çalışmamız gereken alanlar var. İlki güven.
- **Balon:** “Kurum doğrulanmalı, emek karşılıksız kalmamalı.” *(12,9 sn)*  
  Söyle: Kurumun gerçekliğini alan adıyla doğrulamak, deneme projesinin karşılıksız emeğe dönüşmesini önlemek ve işi yapanın gerçekten aday olduğunu kısa bir görüşmeyle teyit etmek.

## 15. Sırada: ölçek

*5:46 – 6:00*

**Kritik nokta:** Sırada ölçek: kalıcı hesaplar, kurumdan bağımsız senior’lar, taşınabilir belge.

- **Balon:** “Sonra daha çok kişiye ulaşmak.” *(3,2 sn)*  
  Söyle: İkinci alan, daha çok kişiye ulaşmak.
- **Balon:** “Kurumdan bağımsız senior’lar da ağda.” *(9,2 sn)*  
  Söyle: Kalıcı hesaplar, junior’lara yol gösteren kurumdan bağımsız senior profesyoneller ve her yerde geçerli bir dijital belge.

## 16. Pilot önerisi

*6:00 – 6:20*

**Kritik nokta:** Tek ölçüt: bir gencin kayıttan ilk onaylı işine kaç günde ulaştığı.

- **Balon:** “Bunu birlikte ölçmeyi öneriyoruz.” *(8,1 sn)*  
  Söyle: Bunu gerçek kurumlarla bir kez ölçmek istiyoruz: Zemin360 ağından 2–3 kurum ve GİRVAK ağından 20–30 genç.
- **Balon:** “Kayıttan ilk onaylı işe kaç gün?” *(10,8 sn)*  
  Söyle: Ölçeceğimiz temel şey, bir gencin kayıt olduktan kaç gün sonra ilk onaylı işine ulaştığı. Önce mevcut durumu ölçeceğiz, hedefi sonra koyacağız.

## 17. Teşekkürler

*6:20 – 6:35*

**Kritik nokta:** Çağrı: ilk ihtiyaç turunu birlikte ölçmek.

- **Balon:** “İlk noktayı birlikte koyalım.” *(9,2 sn)*  
  Söyle: Zemin360’taki bir kurumun gerçek ihtiyacı, bir gencin ilk onaylı deneyimi olabilir. İlk turu birlikte ölçmeyi öneriyoruz.
- **Balon:** “Her çaban haritada bir nokta. Teşekkürler!” *(3,9 sn)*  
  Söyle: Her çaban haritada bir nokta. Teşekkür ederiz.

## Ek sayfalar (konuşmanın dışında)

### Ek 1. Niri açık bir modelle okur

**Kritik nokta:** Açık kaynak model: veri kapalı bir yapay zekâ şirketine gitmez; istenirse tamamen kendi sunucumuzda çalışır.

- **Balon:** “Şimdi yapay zekâya yakından bakalım.”  
  Cevap: Yapay zekâ kurumun dağınık metnini okuyor, her alanı bir cümleye dayanan bir ihtiyaç kanvasına çeviriyor.
- **Balon:** “Açık bir modelle okurum; metni saklamam.”  
  Cevap: Model Google’ın açık kaynak Gemma 4’ü. Metin kapalı bir şirkete gitmiyor; kendi sunucumuzda çalışabilir. Demo Cloudflare’de, metni saklamıyoruz.
- **Balon:** “Ben okur, öneririm; kararı kurallar verir.”  
  Cevap: Yayın, puan ve sıralama kurallarda; model yalnız okuyor ve öneriyor.

### Ek 2. Case ölçülebilir olur

**Kritik nokta:** Yapay zekâ case’i ölçülebilir yapar; gençler bu case’e isimsiz, referanssız ve açık bir formülle ölçülür.

- **Balon:** “Okuyunca case netleşir: 60’tan 75’e.”  
  Cevap: Aynı metin kural motoruyla 60 puan alıp yayımlanamıyor; Niri okuyunca 75, önerilerle 100.
- **Balon:** “Sonra gençleri isimsiz, işleriyle tartarım.”  
  Cevap: Gençler bu case’e göre isimsiz ölçülüyor; referans ya da tanıdık puana girmiyor.
- **Balon:** “Puan açık bir formül; her parçası yazar.”  
  Cevap: Puan açık bir formül: yaptığı iş 45, sektör 20, zaman 15, ortak geçmiş 20.

### Ek 3. Metinde olmayanı almaz

**Kritik nokta:** Model uydurursa alınmaz, Niri sorar; model yoksa kural motoru devralır.

- **Balon:** “Model yanılırsa dört kapıdan geçemez.”  
  Cevap: Modelin cevabı dört denetimden geçiyor: şema, alıntı, sayı, ölçülebilirlik.
- **Balon:** “Metinde yoksa almam, kuruma sorarım.”  
  Cevap: Metinde olmayan bir şey uydurursa alınmıyor, Niri kuruma soruyor. Model susarsa kural motoru devralıyor.

### Ek 4. Bitti ve pilotta tamamlanacak

**Kritik nokta:** Altı problemin altısı canlıda çalışıyor; pilotta tamamlanacaklar belli.

- **Balon:** “Prototipim çalışıyor: altı problemin altısı canlıda.”  
  Cevap: Gördüğünüz her şey canlı: altı problemin altısı çalışıyor, 63 otomatik testle sınanıyor.
- **Balon:** “Gerisini pilotta, gerçek kurumlarla kanıtlayacağım.”  
  Cevap: Pilotta: kalıcı veritabanı, gerçek kurumlarla ilk tur, kod dışı işlerde otomatik doğrulama.

### Ek 5. İşin, kaynağında doğrulanır

**Kritik nokta:** Her işin yanında ne kadar güvenilir olduğu yazar.

(Ek: “Kanıtı nasıl doğruluyorsunuz?” gelirse.)

- **Balon:** “İşin nerede duruyorsa oradan doğrularım.”  
  Cevap: Her işin yanında üç düzeyden biri yazar: Beyan, gencin kendi söylediği; Doğrulandı, kaynağından kontrol edildi; Kurum onaylı, bir kurum imzaladı. GitHub’da projenin gerçekten gencin hesabında olduğunu kontrol ederiz, kodunu almayız. Behance ya da ArtStation’daki işin sahipliğini dışarıdan doğrulayamadığımız için dürüstçe Beyan yazıyoruz; her alanda en güçlü kanıt kurum onayı.

### Ek 6. Deneyim puanı yalnız gerçek işten

**Kritik nokta:** Oyunun her parçası gerçek işe bağlı: deneyim ölçülebilir bir değer olur.

(Ek: oyunlaştırma ya da deneyim puanı sorulursa.)

- **Balon:** “Her deneyim puanının arkasında bir iş var.”  
  Cevap: Haftalık ligde genç benzer tempodaki 18 kişiyle yarışır; ilk 5 üst lige çıkar. Seri, üretim yaptığın günlerden oluşur. Ekranda XP diye yazan deneyim puanı bir iş makbuzu: üretim günü 10, doğrulanmış iş 40, kurum onaylı aşama 120.

### Ek 7. Eksiğini gör

**Kritik nokta:** Eşleşmeyen genç neyin eksik olduğunu bilir.

(Ek: analiz sorulursa.)

- **Balon:** “Uyumunu artıracak en yakın kapıyı gösteririm.”  
  Cevap: Niri her hafta gencin haftasını okur ve en yakın kapıyı gösterir: Flutter’da bir doğrulanmış iş eklersen uyumun 63’ten 72’ye çıkar. Bu analiz kural tabanlı ve formülü açık; ona yapay zekâ demiyoruz.

### Ek 8. Gençler birbirine yardım eder

**Kritik nokta:** Yardım eden de görünür olur.

(Ek: topluluk sorulursa.)

- **Balon:** “Burada yardım eden de kazanır.”  
  Cevap: Takılan genç soruyor, o işi daha önce yapmış biri cevaplıyor. Soran “İşe yaradı” deyince yanıtlayan 15 deneyim puanı kazanıyor; haftanın yardımcıları işe yarayan cevap sayısıyla sıralanıyor.

### Ek 9. Kurum derdini yazar

**Kritik nokta:** Kurum ilan değil, derdini yazar.

(Ek: “Kurum ihtiyacı nasıl yazıyor?” gelirse.)

- **Balon:** “Derdini anlat, alanları ben doldururum.”  
  Cevap: Kuzey Lojistik ilan yazmıyor, derdini anlatıyor. Niri bunu yedi alanlı kanvasa çeviriyor: durum, sorun, sorunun ölçüsü, beklenen sonuç, kısıtlar, karar verici, kapsam. Netlik 70’i geçmeden ihtiyaç yayımlanmıyor.

### Ek 10. Adaylar isimsiz

**Kritik nokta:** Önce iş, sonra isim; referans puana girmez.

(Ek: eşleşme sorulursa.)

- **Balon:** “İsmi değil, işi tartarım.”  
  Cevap: Kurum adayları isimsiz görüyor: isim, okul ve şehir ilk temasa kadar gizli; referans ya da tanıdık puana girmiyor. Puan dört parçadan oluşuyor: yaptığı iş 45, sektör ve ölçek 20, zaman 15, ortak geçmiş 20; her parçanın gerekçesi yazıyor.

### Ek 11. İki onay, zincirli kayıt

**Kritik nokta:** İki imza; sonradan kimse değiştiremez.

(Ek: deneme projesi sorulursa.)

- **Balon:** “İki imza, bir mühür. Sonradan kimse değiştiremez.”  
  Cevap: Case’in başarı kriterleri aşamalara dönüşüyor: genç teslim ediyor, kurum onaylıyor. Her kayıt bir öncekine SHA-256 ile bağlı; biri sonradan tek harf değiştirse zincir tam o kayıtta kırılıyor.

### Ek 12. Onay, gencin kanıtı olur

**Kritik nokta:** Case boşa gitmez; imzalı deneyim olur.

(Ek: “Genç bundan ne kazanıyor?” gelirse.)

- **Balon:** “Onaylanan iş, haritanda yeni bir nokta.”  
  Cevap: Şirketler işe almadan önce çoğu zaman bir case ister ve o emek boşa gider. Nirengi’de case bir deneme projesi; onaylanan aşama gencin profiline Kurum onaylı deneyim olarak, imzalayan kurum ve tarihle yazılıyor ve 120 deneyim puanı getiriyor.

### Ek 13. Niri’nin söyleyecekleri

**Kritik nokta:** Haritada herkese yer var: gence de, küçük bir ekibe de.

(Ek: vakit kalırsa ya da “kullanıcıya ne vaat ediyorsunuz?” gelirse.)

- **Balon:** “Haritamda herkese yer var: gence de, küçük bir ekibe de.”  
  Cevap: Gençlere: CV yazma, işini bağla; eksiğini söylerim; işe alım için yaptığın case de boşa gitmez. Kurumlara, önce startuplara: İK’n yoksa da olur; adayı yaptığı işle gör, kadro riski yerine küçük bir deneme projesiyle başla.

## Soru gelirse

### Veri nereye gidiyor, model sizin sunucunuzda mı?

- Bugünkü demo ücretsiz Cloudflare Workers AI üzerinde çalışıyor. Metni kaydetmiyoruz. Kapalı bir yapay zekâ şirketinin servisine hiçbir metin gitmiyor.
- Model açık ağırlıklı olduğu için aynı modeli kendi sunucumuzda ya da kurumun sunucusunda çalıştırabiliriz; o zaman metin kurumdan hiç çıkmaz. Bunu henüz kurmadık; ilk pilotta kurumla birlikte kuracağız.

### Genç bir şirketin problemini gerçekten çözebilir mi?

- Bu yüzden önce küçük bir deneme projesi var, kadro değil. Case’in başarı kriterleri aşamalara bölünüyor; her aşamayı genç teslim ediyor, kurum onaylıyor. Kurum onaylamadan aşama kapanmıyor.
- Örnekte Kuzey Lojistik’in rota case’i: 3.000 noktalık rotanın 5 dakikanın altında hesaplanması. Onaylanan aşama gencin profiline imzalı deneyim olarak yazılıyor; işe girmese bile bu deneyimi taşıyor.

### Deneyim puanı neyle kazanılıyor?

- Ekranda XP diye yazan deneyim puanı bir iş makbuzu: üretim yaptığın gün 10, doğrulanmış kanıt 40, kurum onaylı aşama 120 puan. Günlük tavan 200.
- Her satırın arkasında dışarıda kontrol edilebilen bir olay var: birleşmiş bir PR, doğrulanmış bir alan adı ya da bir kurum imzası. Deneyimi böyle ölçülebilir bir değere dönüştürüyoruz.

### Sistem nasıl işliyor?

- Üç nesne var: Kanıt, İhtiyaç, Pilot. Kanıtın üç seviyesi var: Beyan, Doğrulandı, Kurum onaylı.
- Kurum ilan yazmaz; yedi alanlı kanvasla ihtiyaç yazar. Netlik puanı 70’i geçmeden ihtiyaç yayımlanmaz.
- Pilot aşamalara bölünür: genç teslim eder, kurum onaylar. Onaylanan aşama gencin profiline Kurum onaylı kanıt olarak döner.

### Genç ve kurum tarafı neden farklı?

- Genç ritim ister: haftalık hedef, seri, lig ve Niri’nin kostümleri. Ama hepsini yalnızca gerçek iş kazandırır.
- Kurum ölçüm ister, oyun yok: şikâyetten ihtiyaca, gerekçeli kısa listeye, küçük bir pilota ve hesap verebilir kayda.

### Uyum puanına neden güvenelim?

- Puan dört parçadan oluşur ve ağırlıkları açıktır: kanıt 45, bağlam 20, kapasite 15, iş birliği geçmişi 20 puan.
- İlk temasta isim, okul, şehir görünmez; referans ya da tanıdık puanın hiçbir parçasına girmez. Kimlik pilot teklifiyle açılır.
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
- Örnekte Ece animasyoncu: kodla işi yok, animasyonunu bir sağlık kurumu onayladı; profilinde Kurum onaylı duruyor ve ona 120 deneyim puanı getirdi.

### İlk pazarınız kim?

- Odak girişim ekosistemi. İlk tur: Zemin360 ve GİRVAK ağındaki girişimler ve gençler. Sonra bilişim uzmanı olmayan küçük işletmeler, kamu birimleri ve STK’lar.
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
