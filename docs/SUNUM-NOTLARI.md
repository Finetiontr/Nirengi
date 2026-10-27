# Sunum notları

*Zemin360 finali · 16 slayt · planlanan süre 5:55 (film 1:31, konuşma 4:24)*

Bu dosya `src/components/sunum/notes.ts` dosyasından `node scripts/sunum-export/notes-md.mjs` ile üretildi; notları orada düzeltin. Niri sessizdir; konuşan ekiptir. Her slaytta Niri’nin iki ya da üç kısa balonu var: her balon, konuşmacının sıradaki cümlesinin başlığı. Balonlar kendiliğinden ilerler: her biri, altındaki cümleyi sakin bir hızla söylemek için gereken süre (saniyede yaklaşık 14 harf) ve kısa bir nefes boyunca kalır; slaytın son balonundan sonra Niri bekler. Konuşmacılar yalnız sayfa değiştirir: **→** (ya da boşluk, tıklama) sıradaki sayfa, **←** önceki sayfa, **P** balonları (film slaytında filmi) duraklatır ve devam ettirir. Her slaytın bir kritik noktası var: jürinin o slayttan aklında tutması gereken tek cümle. Konuşmacı penceresi (**N** ya da `/sunum?notlar`) her balonun altında söylenecekleri ve balonun kalma süresini, sahnedekini çerçeveli gösterir ve saati plana göre tutar; **R** süreyi sıfırlar.

Konuşma organizasyonun önerdiği on iki adımı izler ve beş dakikaya sığar. Omurgası tek bir fikir: kurum gerçek bir case verir, gençler doğrulanmış işleriyle bu case’e göre isimsiz ölçülür, en uyumlusu onu küçük bir deneme projesinde gerçekten çözer ve onaylanan iş profiline imzalı deneyim olarak döner. Deneyimi ölçülebilir bir değere dönüştürüyoruz: ürünün ekranlarında XP diye yazan puan, sunumda deneyim puanı diye anılır ve yalnız gerçek işten gelir. Gençler her alandan: yazılımcı, tasarımcı, animasyoncu, çevirmen. Kurum adayları isimsiz görür; referans ya da tanıdık puana girmez. Altıncı slayt canlı demo olarak 1:30 süren filmi oynatır: önce gencin, sonra kurumun gözünden; müzik kısık çalar, konuşmacı üstüne konuşur. Kapanıştan sonra konuşmanın dışında ek sayfalar var; soru gelince açılır, orada balon kendiliğinden ilerlemez. Kısa cevaplar aşağıda ve kapanıştan itibaren konuşmacı penceresinde.

Planlanan süreler cümlelerin uzunluğundan hesaplanır (`src/components/sunum/timing.ts`): Niri’nin slayta dönüşü, cümleler saniyede 14 harfle ve aralarında 0,6 saniyelik nefes, bir de tuşa basma. Slaytlardaki her sayı `docs/PAZAR-ANALIZI.md` içindeki kaynağıyla birlikte slaytın üzerinde yazar ya da ürünün kendi kodundan gelir (deneyim puanı tablosu, uyum ağırlıkları, kanıt düzeylerinin ağırlığı, yayın eşiği); yapay zekâ slaytlarındaki sonuçları ürünün kendi kodu, gerçek bir model cevabıyla hesaplar. Planlar plan olarak etiketli; kullanıcı, pilot ya da gelir rakamı yok.

## 1. Deneyim yoksa iş yok

*0:00 – 0:23*

**Kritik nokta:** Asıl problem tek: deneyim yoksa iş yok, iş yoksa deneyim yok.

- **Balon:** “Merhaba, ben Niri! Bugün tek bir problem var.” *(11,7 sn)*  
  Söyle: Merhaba, biz Sezer Uzun, Emirhan Açık ve Ayça Güder; Nirengi’yi Zemin360 Hackathon’unda yaptık, sonra açık kaynak olarak kendimiz yayınlamaya karar verdik.
- **Balon:** “Deneyim yoksa iş yok, iş yoksa deneyim yok.” *(9,5 sn)*  
  Söyle: Bugün tek bir problemi konuşacağız: deneyim yoksa iş yok, iş yoksa deneyim yok. Geri kalan her şey bunun çözümünden türüyor.

## 2. Problem: genç

*0:23 – 0:39*

**Kritik nokta:** Gencin tarafı: her dört gençten biri ne okulda ne işte.

- **Balon:** “Her dört gençten biri ne okulda ne işte.” *(6,5 sn)*  
  Söyle: Türkiye’de 15–24 yaşta her 100 gençten 23’ü ne okulda ne işte; genç kadınlarda 31.
- **Balon:** “İlk kayıtlı iş ortalama 14 ay sürüyor.” *(8,1 sn)*  
  Söyle: Lisans mezunu ilk kayıtlı işini ortalama 14,4 ayda buluyor. Bu gençlerin çoğu yeteneksiz değil, görünmez.

## 3. Problem: kurum

*0:39 – 0:54*

**Kritik nokta:** Kurum aynı cümleyi kuruyor: ilgili iş deneyimi yok.

- **Balon:** “Kurum da aynı cümleyi kuruyor.” *(4,0 sn)*  
  Söyle: Kurum tarafı aynı duvarı öbür taraftan görüyor.
- **Balon:** “100 şirketten 71’i: “deneyim yok.”” *(9,8 sn)*  
  Söyle: Bilişim uzmanı almakta zorlanan her 100 şirketten 71’i nedeni “ilgili iş deneyimi yok” diye gösteriyor. Aynı cümle, iki taraftan.

## 4. Kök neden: ölçüm

*0:54 – 1:11*

**Kritik nokta:** Kök neden ölçüm: deneyim yılının öngörme gücü 0,07.

- **Balon:** “Sorun niyet değil, ölçüm.” *(5,7 sn)*  
  Söyle: Kök neden bir ölçüm sorunu: kurum deneyimi ölçemediği için yıla bakıyor.
- **Balon:** “Deneyim yılı neredeyse hiçbir şey söylemiyor.” *(10,0 sn)*  
  Söyle: Deneyim yılının iş performansını öngörme gücü 0,07, neredeyse sıfır. Gerçek bir iş örneği 0,33, yapılandırılmış değerlendirme 0,42.

## 5. Kök neden: tanıdık

*1:11 – 1:26*

**Kritik nokta:** Tanıdık mülakat şansını yaklaşık 13 katına çıkarıyor.

- **Balon:** “Ölçemeyince boşluğu tanıdık dolduruyor.” *(3,8 sn)*  
  Söyle: Kurum ölçemeyince boşluğu tanıdık dolduruyor.
- **Balon:** “Normalde 100’de 3, referansla 100’de 40.” *(10,0 sn)*  
  Söyle: Her 100 normal başvurudan 3’ü mülakata çağrılıyor; referanslıda 40. Referanslar başvuruların yüzde 1’i ama işe alımların yüzde 18’i.

## 6. Türkiye’de tanıdık

*1:26 – 1:45*

**Kritik nokta:** Türkiye’de gençler tanıdığı işe girişin şartı sayıyor.

- **Balon:** “Türkiye’de bunun adı torpil.” *(9,0 sn)*  
  Söyle: Türkiye’de bunun adı torpil, dayı: ne okulda ne işte olan gençlerin yüzde 86’sı “tanıdığın yoksa iş bulmak zor” diyor.
- **Balon:** “İsim bile geri dönüşü değiştiriyor.” *(8,8 sn)*  
  Söyle: İstanbul’daki bir saha deneyinde aynı nitelikteki CV’lerde Türk kadın, Kürt kadından 2,5 kat fazla geri dönüş aldı.

## 7. Problemin yeri: ilk eleme

*1:45 – 2:07*

**Kritik nokta:** Problemin düğümlendiği yer: ilk eleme.

- **Balon:** “Her şey ilk elemede düğümleniyor.” *(9,2 sn)*  
  Söyle: Asıl problemin yeri belli: ilk eleme. CV’lerin çoğu açılmıyor, deneyim yılı burada soruluyor, tanıdık burada öne geçiyor.
- **Balon:** “Nirengi tam buraya müdahale ediyor.” *(11,5 sn)*  
  Söyle: İlanların beşte biri de doldurulmak için açılmıyor. Nirengi bu iki noktaya dokunuyor: ihtiyacı netleştiriyor, ilk elemeyi isimsiz ve işe dayalı yapıyor.

## 8. Döngü kırılabilir

*2:07 – 2:27*

**Kritik nokta:** İlk iş ve açık değerlendirme döngüyü kırıyor.

- **Balon:** “Döngü kırılabiliyor.” *(9,7 sn)*  
  Söyle: Döngü kırılabiliyor: hiç iş almamış kişilere tek bir küçük iş ve açık değerlendirme verilince iş bulma yüzde 12’den 30’a çıktı.
- **Balon:** “Açık kanıt, dayının işini görebiliyor.” *(8,7 sn)*  
  Söyle: Kefil olan bir aracı deneyimsizin şansını yüzde 75 artırıyor; ama açık iyi puan biriktikçe aracıya gerek kalmıyor.

## 9. Herkesin dayısı

*2:27 – 2:40*

**Kritik nokta:** Nirengi: herkesin dayısı.

- **Balon:** “Nirengi, herkesin dayısı.” *(6,7 sn)*  
  Söyle: Dayının yaptığı işi yazılıma çeviriyoruz: kefil olmak, kapıyı açmak, ihtiyacı bilmek.
- **Balon:** “Tanıdığı olana değil, işini gösterene.” *(4,9 sn)*  
  Söyle: Tanıdığı olana değil, işini gösterene; herkese aynı kuralla.

## 10. Nasıl çalışır

*2:40 – 3:03*

**Kritik nokta:** Kurum gerçek bir case verir; gençler işleriyle ölçülür; en uyumlusu onu deneme projesinde gerçekten çözer.

- **Balon:** “Kurumun gerçek derdi, gencin gerçek işiyle buluşur.” *(6,0 sn)*  
  Söyle: Çözümümüz tek cümle: kurum gerçek bir case verir, genç onu gerçekten çözer.
- **Balon:** “Genç işini bağlar, deneyimi ölçülür.” *(6,9 sn)*  
  Söyle: Genç işini bağlar: kod, tasarım, video ya da yazı. Doğrulanan her iş deneyim puanı olur.
- **Balon:** “Kurum case’ini yazar, en uyumlu genç çözer.” *(9,0 sn)*  
  Söyle: Kurum case’ini kendi sözleriyle yazar, Niri ölçülebilir yapar; en uyumlu genç deneme projesinde çözer. Filmde görelim.

## 11. Canlı demo: film

*3:03 – 4:34*

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

## 12. Bugün çalışan

*4:34 – 4:49*

**Kritik nokta:** Bugün çalışan dört cevap, dört problemi kapatıyor.

- **Balon:** “Dört problem, dört cevap.” *(2,7 sn)*  
  Söyle: Bunlar bugün sitede çalışıyor.
- **Balon:** “Yıl değil iş; isim değil kanıt.” *(11,0 sn)*  
  Söyle: Deneyim yılı yerine işi ölçen merdiven, isim yerine isimsiz ilk temas, muğlak ilan yerine netlik eşiği, ilk iş yerine kurum onaylı deneme projesi.

## 13. Sırada: güven

*4:49 – 5:08*

**Kritik nokta:** Sırada güven: kurum doğrulama, adil deneme, canlı savunma.

- **Balon:** “Sırada güven var.” *(3,4 sn)*  
  Söyle: Çalışmamız gereken alanlar; önce güven.
- **Balon:** “Kurum da doğrulanmalı, deneme adil olmalı.” *(14,6 sn)*  
  Söyle: Kurumun ihtiyacı gerçek mi diye alan adıyla doğrulama ve pilota dönüşme oranı; deneme projesi ucuz emeğe dönmesin diye ücretli, gönüllü ya da kredili etiketi; yazarlık için kısa bir canlı savunma.

## 14. Sırada: ölçek

*5:08 – 5:23*

**Kritik nokta:** Sırada ölçek: kalıcı hesaplar, usta rolü, taşınabilir kanıt.

- **Balon:** “Sonra ölçek.” *(2,6 sn)*  
  Söyle: Sonra ölçeğe hazırlanıyoruz.
- **Balon:** “Usta ile çırak arasında köprü.” *(11,1 sn)*  
  Söyle: Kalıcı hesaplar ve veritabanı; kurumdan bağımsız bir usta rolü: profesyonel gence yol gösterir ve işini onaylar; kanıt Open Badges ile gencin olur.

## 15. Pilot önerisi

*5:23 – 5:41*

**Kritik nokta:** Tek ölçüt: kayıttan ilk onaylanmış işe kaç gün.

- **Balon:** “Bunu birlikte ölçelim.” *(7,7 sn)*  
  Söyle: Bunu bir kez gerçek kurumlarla ölçmek istiyoruz: Zemin360’tan 2–3 kurum, GİRVAK ağından 20–30 genç.
- **Balon:** “Kayıttan ilk onaylı işe kaç gün?” *(9,2 sn)*  
  Söyle: Ölçeceğimiz tek şey: gencin kayıttan ilk onaylanmış işine kaç günde geldiği. Hedef rakam koymuyoruz, önce taban çizgisi.

## 16. Teşekkürler

*5:41 – 5:55*

**Kritik nokta:** Çağrı: ilk ihtiyaç turunu birlikte ölçmek.

- **Balon:** “Zirvedeyim! İlk noktayı birlikte koyalım.” *(8,5 sn)*  
  Söyle: Zemin360’taki bir kurumun gerçek ihtiyacı, bir gencin ilk imzalı deneyimi olabilir. İlk turu birlikte ölçelim.
- **Balon:** “Her çaban haritada bir nokta. Teşekkürler!” *(3,6 sn)*  
  Söyle: Her çaban haritada bir nokta. Teşekkürler.

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
