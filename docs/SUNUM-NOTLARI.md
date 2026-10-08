# Sunum notları

*Zemin360 finali · 16 slayt · planlanan süre 9:35 (demo 2:30, konuşma 7:05)*

Bu dosya `src/components/sunum/notes.ts` dosyasından üretildi; notları orada düzeltin. Sunum sırasında aynı notlar konuşmacı penceresinde görünür: sunumda **N** tuşu ya da `/sunum?notlar` adresi. Pencere sunumu izler, ok tuşlarıyla sunumu yönetir, **R** süreyi sıfırlar.

Slaytlardaki her sayı `docs/PAZAR-ANALIZI.md` içindeki kaynağıyla birlikte slaytın üzerinde yazar. Planlar plan, hipotezler hipotez olarak etiketli; kullanıcı, pilot ya da gelir rakamı yok.

## 1. Beyan değil, kanıt

*0:00 – 0:20 · Niri: “Merhaba, ben Niri! Bugün size haritamı göstereceğim.”*

- Merhaba, biz Nirengi ekibiyiz: Sezer Uzun ve Emirhan Açık.
- Nirengi noktası, haritacılıkta üzerine güvenle ölçüm yapılan sabit referanstır. Biz gençlerin işi için o referansı kuruyoruz.
- Tek cümle: gençlerin doğrulanmış işini kurumların ihtiyaçlarıyla buluşturan açık kaynak altyapı.

## 2. Problem

*0:20 – 1:00 · Niri: “Gençler görünmüyor, kurumlar emin olamıyor.”*

- Döngüyü hepimiz biliyoruz: deneyim yoksa iş yok, iş yoksa deneyim yok.
- Genç tarafı: 15–24 yaşta her 100 gençten 23’ü ne eğitimde ne istihdamda (TÜİK, 2025). 2024’te AB ülkeleriyle kıyaslandığında en yüksek oran bizde.
- Genç işsizliği %13; genç kadınlarda %19,4 (TÜİK, Ağustos 2026).
- Kurum tarafı: BİT uzmanı almakta zorlanan girişimlerin %71’i “ilgili iş deneyimi yok” diyor. 10–49 çalışanlı girişimlerin yalnızca %10,8’inde BİT uzmanı var.
- Kısacası genç görünmüyor, kurum da kime güveneceğini bilemiyor.

## 3. Neden şimdi

*1:00 – 1:35 · Niri: “Kapı daralırken kanıt her zamankinden değerli.”*

- Şubat 2024: diploma şartını kaldıran şirketlerde bile gerçekten değişen işe alım 700’de 1’den az. Niyet var, ölçüm aracı yok.
- Ocak 2025: Dünya Ekonomik Forumu’na göre işverenlerin dönüşümdeki 1 numaralı engeli beceri açığı, %63.
- Ağustos 2025: yapay zekâya en açık mesleklerde 22–25 yaş istihdamı görece %13 düştü; deneyimlilerde düşüş yok. İlk deneyimin kapısı daralıyor.
- Bugün: taşınabilir kanıt için açık bir standart (Open Badges 3.0) hazır. Ölçüm aracını kurmanın zamanı.

## 4. Çözüm

*1:35 – 2:05 · Niri: “Benim XP’m boş tıklamayla gelmez.”*

- Çözümün tek cümlesi: başka yerlerde XP uygulamanın içinde kalır; Nirengi’de her XP bir iş makbuzudur.
- Makbuzu okuyalım: üretim yaptığın gün 10, doğrulanmış kanıt 40, kurum onaylı aşama 120 XP. Günlük tavan 200. Boş tıklama sıfır.
- Her satırın arkasında dışarıda kontrol edilebilen bir olay var: birleşmiş bir PR, doğrulanmış bir alan adı ya da bir kurum imzası.

## 5. Üç nesne, tek döngü

*2:05 – 2:35 · Niri: “İş bitince kanıtın bir basamak yükselir.”*

- Sistem üç nesneden oluşuyor: Kanıt, İhtiyaç, Pilot.
- Kanıtın üç seviyesi var: Beyan, Doğrulandı, Kurum onaylı.
- Kurum ilan yazmaz; yedi alanlı kanvasla ihtiyaç yazar. Çözülebilirlik puanı 70’i geçmeden ihtiyaç yayımlanmaz.
- Pilot aşamalara bölünür: genç teslim eder, kurum onaylar. Onaylanan aşama gencin profiline Kurum onaylı kanıt olarak döner. Döngü bu.

## 6. Genç ve kurum

*2:35 – 3:10 · Niri: “Gence oyun, kuruma ölçüm; ikisi de aynı kanıttan.”*

- Aynı kanıt iki yüzle görünüyor.
- Genç için tanıdık bir oyun ritmi: haftalık hedef, seri, lig ve Niri’nin kostümleri. Ama hepsini yalnızca gerçek iş kazandırır.
- Eşleşmediğinde nedenini görür: hangi kanıt eksik, hangi görev o eksiği kapatır.
- Kurum tarafı sakin: oyun yok, ölçüm var. Şikâyetten ihtiyaca, gerekçeli kısa listeye, küçük bir pilota ve hesap verebilir kayda.

## 7. Neden güvenilir

*3:10 – 3:50 · Niri: “Her puanımın nedenini sorabilirsiniz.”*

- “Neden bu aday?” sorusunun cevabı hazır: uyum puanı dört parçadan oluşur ve ağırlıkları açıktır. Kanıt 45, bağlam 20, kapasite 15, iş birliği geçmişi 20 puan.
- İlk temasta isim, okul, şehir görünmez. Kurum önce işi görür; kimlik pilot teklifiyle açılır.
- Her aşama iki tarafın onayıyla deftere yazılır; kayıtlar SHA-256 ile zincirlenir. Biri geçmişi kurcalarsa zincir kırılır. Bunu demoda göstereceğiz.
- Kod açık: her formülü herkes okuyabilir.

## 8. Canlı demo

*3:50 – 6:20 · Niri: “Lafı bırakalım, ekrana geçelim.”*

- Sahneye çıkmadan: demo panelinden Sıfırla; solda Kurum, sağda Genç penceresi.
- Genç: GitHub hesabını bağla, Kontrol et, kanıt Doğrulandı.
- Kurum: /ihtiyaclar/yeni, Örnekle doldur, Taslağa dönüştür; çubuk 70’i geçince Yayımla.
- Adaylar: isim yok, iş var. Bir adaya dokun, “Neden bu uyum?”, Pilot teklif et.
- Pilot: genç Teslim et, kurum Onayla. Defterde Zinciri doğrula, sonra Kurcalamayı dene: zincir kırılır.
- Profil: onaylanan aşama Kurum onaylı kanıt olarak görünür.
- Takılırsa yedek: /pilotlar/pl-rota; bir aşama kurum onayı bekliyor.
- Demodaki kişiler ve kurumlar kurgusal; GitHub ve DNS doğrulaması gerçek.

## 9. Önce kim

*6:20 – 6:50 · Niri: “Haritayı en yakın tepeden çizmeye başlıyorum.”*

- Bağımsız bir mikro staj pazar büyüklüğü bulamadık, bu yüzden uydurma bir pazar rakamı göstermiyoruz. Bunun yerine kimden başlayacağımızı söylüyoruz.
- İlk tur: Zemin360 ve GİRVAK ağındaki kurumlar ve gençler.
- İlk pazar: BİT uzmanı olmayan küçük işletmeler, kamu birimleri, STK’lar. 10–49 çalışanlı girişimlerin yalnızca %10,8’i BİT uzmanı çalıştırıyor.
- Ölçek: Türkiye’de 3,93 milyon girişim, %99,6’sı KOBİ (2024).
- Genç tarafında talep zaten var: GİRVAK Fellow’a ~1 milyon başvuru, ~1.000 fellow ve mezun. Programa sığmayan gençler de kanıt biriktirebilmeli.

## 10. Rekabet

*6:50 – 7:15 · Niri: “İkisinin buluştuğu köşe boştu. Oraya yerleştim.”*

- Pazarda iki dünya var. Oyunlaştırılmış öğrenme alışkanlık kurar ama puanı dışarıda geçmez.
- İlan siteleri, testler, bootcamp’ler, mikro staj ve açık inovasyon programları ise tek seferlik bir eşik; kanıt çoğu zaman platformun içinde kalır.
- Sağ üst köşe boş: hem alışkanlık kuran hem dışarıda doğrulanmış işe dayanan. Türkiye’de bu bileşimi sunan bir platform bulamadık.

## 11. Nasıl yaşar

*7:15 – 7:50 · Niri: “Gence ücret yok. Gerisini pilotta sınayacağız.”*

- Gence ücret yok. Kod MIT lisanslı ve açık; kanıt gencindir.
- Bugün gelirimiz yok, bunu açıkça söylüyoruz. Sürdürülebilirlik için pilotta sınayacağımız dört seçenek var; hiçbiri henüz gelir değil.
- Kamu ve vakıf fonları: fonlu gençlik ve istihdam programlarına hazır pilot raporu.
- Kalkınma ajansları: bölgesel ihtiyaç turları.
- Üniversite kariyer merkezleri: öğrencilerinin doğrulanmış kanıtlarını kendi sistemlerine alması.
- Kurum tarafında barındırma ve destek: çekirdek açık ve ücretsiz kalır; kurulum, barındırma ve ihtiyaç turu desteği isteyen kuruma hizmet.

## 12. Bugün neredeyiz

*7:50 – 8:15 · Niri: “Prototipim çalışıyor. Kullanıcılarımı pilotta bulacağım.”*

- Bu bir hackathon prototipi ve çalışıyor: başvurudaki altı problemin altısı için çalışan ekran var.
- GitHub hesap sahipliği ve DNS TXT doğrulaması gerçek servislere gidiyor. Eşleşme, kanvas ve defter motoru otomatik testlerle korunuyor (sahneden önce npm test ile kontrol edin).
- Henüz yok: gerçek kullanıcı, kurum ya da pilot. Demo verisi kurgusal ve ekranda öyle yazıyor. Veri şimdilik tarayıcıda.
- Bunu saklamıyoruz; ürünün sözü zaten “beyan değil, kanıt”.

## 13. Pilotta ölçülecekler

*8:15 – 8:40 · Niri: “Rakam uydurmak yok; ölçüp size getireceğim.”*

- Pilotta dört şeyi ölçeceğiz. Hedef rakam koymuyoruz; önce taban çizgisini ölçeceğiz.
- Bir: kayıttan ilk doğrulanmış işe kaç gün geçiyor. İki: yayımlanan ihtiyaçların kaçı pilota dönüşüyor.
- Üç: pilotlarda çift onaylanan aşamalar ve tamamlanma oranı. Dört: eşleşmeyen gençlerin, eksik geri bildiriminden sonra yeni kanıt ekleme oranı.
- Sonuçları da kanıt gibi paylaşacağız: kaynağıyla.

## 14. Yol haritası

*8:40 – 9:00 · Niri: “Sıradaki nirengi noktalarım bunlar.”*

- Finalden sonraki dört ay: önce kalıcılık, gerçek hesaplar ve kurum hesapları.
- Sonra Zemin360 ve GİRVAK ağındaki kurumlarla ilk ihtiyaç turu.
- Kod dışı kanıtlar, Open Badges 3.0 ile taşınabilir kayıt ve fon verenler için hazır pilot raporu.

## 15. Sizden istediğimiz

*9:00 – 9:25 · Niri: “Bir ihtiyacınızı yazın, ilk pilotu birlikte kuralım.”*

- Sizden üç şey istiyoruz.
- Bir: ilk ihtiyaç turuna katılacak kurumlar. Gerçek bir ihtiyacını kanvasa yazacak bir KOBİ, kamu birimi ya da STK.
- İki: mentorluk. Kamu fonlu programların raporlaması, kurum tarafında benimseme ve kişisel veri uyumu.
- Üç: pilotu taşıyacak bir kuluçka programı ya da hibe için yönlendirme.
- En somut istek: bu salondan bir kurumun gerçek bir ihtiyacı. İlk kanvası birlikte yazalım.

## 16. Teşekkürler

*9:25 – 9:35 · Niri: “Zirvedeyim! Teşekkürler, haritada görüşmek üzere.”*

- Beyan değil, kanıt. Teşekkürler; sorularınızı bekliyoruz.

