// Speaker notes, keyed by slide id: what the team says while Niri says one line.
// Shown in the presenter window (N on the deck, or /sunum?notlar) and mirrored in
// docs/SUNUM-NOTLARI.md. Plain data so a script can read it without React.
// Every number here is on the slide, in docs/PAZAR-ANALIZI.md with its source, or
// computed by the engine (the AI slides). Appendix notes are for questions.

export interface Note {
  /** Suggested speaking time in seconds. */
  sec: number;
  say: string[];
}

export const NOTES: Record<string, Note> = {
  baslik: {
    sec: 15,
    say: [
      'Merhaba, biz Nirengi: Sezer Uzun ve Emirhan Açık.',
      'Nirengi noktası, haritacının üzerine güvenle ölçüm yaptığı sabit noktadır. Biz gençlerin işi için o noktayı kuruyoruz.',
    ],
  },
  problem: {
    sec: 30,
    say: [
      'Döngüyü hepimiz biliyoruz: deneyim yoksa iş yok, iş yoksa deneyim yok.',
      '15–24 yaşta her 100 gençten 23’ü ne okulda ne işte. Avrupa’yla kıyaslandığında en yüksek oran bizde.',
      'Öbür tarafta, BİT uzmanı almakta zorlanan şirketlerin %71’i aynı şeyi söylüyor: ilgili deneyim yok.',
      'Genç görünmüyor, kurum kime güveneceğini bilmiyor.',
    ],
  },
  'kim-icin': {
    sec: 25,
    say: [
      'İki kullanıcımız var.',
      'Birincisi üreten ama kanıtı olmayan genç. Tek bir seçici programa bir milyon başvuru geliyor; kapıdan giremeyenlerin de gösterecek bir işi olmalı.',
      'İkincisi BİT uzmanı olmayan küçük kurum. Türkiye’deki 3,93 milyon girişimin %99,6’sı KOBİ. İhtiyacı var ama tarif edemiyor, kadro riskini alamıyor.',
    ],
  },
  kanit: {
    sec: 25,
    say: [
      'Bunu nereden biliyoruz?',
      'Diploma şartını kaldıran şirketlerde bile işe alım 700’de 1’den az değişti. Niyet var, ölçme aracı yok.',
      'İşverenlerin %63’ü beceri açığını bir numaralı engel görüyor. Yapay zekâya açık mesleklerde ise en çok gençlerin istihdamı düşüyor.',
      'Bir de 37 platform ve programı tek tek inceledik. Oyun ritmini, dışarıda doğrulanmış işi ve kurum imzasını bir araya getiren bir örnek bulamadık.',
    ],
  },
  cozum: {
    sec: 25,
    say: [
      'Çözümümüz tek cümle: genç gerçek işiyle görünür, kurum ihtiyacını ölçülebilir yazar, ikisi küçük bir pilotta buluşur.',
      'Pilotta onaylanan her aşama, gencin profiline kurum onaylı kanıt olarak döner.',
      'Ekranlar gerçek. Ama onları biz değil, maskotumuz anlatsın: sözü Niri’ye bırakıyorum.',
    ],
  },
  demo: {
    sec: 80,
    say: [
      '(Video oynar; konuşma yok. Bitince → ile devam.)',
      'Süre kalırsa canlı göster: hazır kurum penceresinde Örnekle doldur → Taslağa dönüştür → Metninden çıkardıklarım.',
      'Video açılmazsa slayt kendiliğinden canlı demo paneline döner; Sunum klasöründeki mp4 de yedekte.',
    ],
  },
  'yz-ne': {
    sec: 30,
    say: [
      'Videoda gördüğünüz yapay zekâ adımı şu: kurum derdini kendi sözleriyle yazıyor.',
      'Açık ağırlıklı bir model, Gemma 4, bu metni yedi alanlı ihtiyaç kanvasına çeviriyor: mevcut durum, sorun, sorunun ölçüsü, hedef, kısıtlar, karar verici ve kapsam.',
      'Her alanın yanında metindeki hangi cümleden geldiği yazıyor. Kurum taslağı okurken kaynağını da görüyor.',
    ],
  },
  'yz-fark': {
    sec: 25,
    say: [
      'Fark ne? Aynı metni önceki kural motorumuz da okuyordu.',
      'Kural motoru beş alan buldu: netlik 60, yayımlanamaz.',
      'Model yedi alanı doldurdu, karar vericiyi ve kapsamı da buldu: 75. Üstüne ölçülebilir iki başarı kriteri önerdi; kurum ikisini ekleyince 100 ve yayımlanabilir.',
      'Bu sayılar tahmin değil; testlerimizde sabit.',
    ],
  },
  'yz-onlem': {
    sec: 30,
    say: [
      'Model yanılırsa? Cevabını doğrudan kullanmıyoruz; dört kapıdan geçiyor.',
      'Şemaya uymalı, her alanın alıntısı metinde birebir geçmeli, alandaki her sayı metinde yazmalı, her kriter ölçülebilir olmalı.',
      'Testten bir örnek: model “Genel Müdür onaylar” diye uydurursa alan boş kalır, Niri kuruma kimin onaylayacağını sorar.',
      'Reddedilen her şey kuruma gösterilir. Model hiç cevap vermezse aynı ekranı kural motoru doldurur.',
    ],
  },
  tasarim: {
    sec: 25,
    say: [
      'Tasarımda beş karar verdik.',
      'Her ekranda tek iş, ve önce telefon.',
      'Oyun yalnız genç tarafında; kurum ekranı sakin, XP yok.',
      'Kurum adayı temasa kadar isimsiz görür.',
      'Niri yol gösterir ama kimseyi bekletmez.',
    ],
  },
  bitti: {
    sec: 25,
    say: [
      'Altı problemin altısına çalışan bir ekranımız var. GitHub ve DNS doğrulaması, yapay zekâ taslağı ve denetimi canlıda.',
      'Bilerek bıraktıklarımız da belli: kalıcı veritabanı yok, veri tarayıcıda. Demo kişileri kurgusal ve ekranda öyle yazıyor.',
      'Finalden sonraki dört ayın planı: kalıcılık, ilk ihtiyaç turu, kod dışı kanıt, taşınabilir rozet ve fon verene pilot raporu.',
    ],
  },
  kapanis: {
    sec: 15,
    say: [
      'Tek bir isteğimiz var: bu salondan bir kurumun gerçek bir ihtiyacı. İlk kanvası birlikte yazalım.',
      'Beyan değil, kanıt. Teşekkürler; sorularınızı bekliyoruz.',
    ],
  },

  // Appendix: open with the key when a question comes.
  fark: {
    sec: 30,
    say: [
      'Başka yerlerde XP uygulamanın içinde kalır; Nirengi’de her XP bir iş makbuzudur.',
      'Üretim yaptığın gün 10, doğrulanmış kanıt 40, kurum onaylı aşama 120 XP. Günlük tavan 200. Boş tıklama sıfır.',
      'Her satırın arkasında dışarıda kontrol edilebilen bir olay var: birleşmiş bir PR, doğrulanmış bir alan adı ya da bir kurum imzası.',
    ],
  },
  dongu: {
    sec: 30,
    say: [
      'Sistem üç nesneden oluşuyor: Kanıt, İhtiyaç, Pilot.',
      'Kanıtın üç seviyesi var: Beyan, Doğrulandı, Kurum onaylı.',
      'Kurum ilan yazmaz; yedi alanlı kanvasla ihtiyaç yazar. Çözülebilirlik puanı 70’i geçmeden ihtiyaç yayımlanmaz.',
      'Pilot aşamalara bölünür: genç teslim eder, kurum onaylar. Onaylanan aşama gencin profiline Kurum onaylı kanıt olarak döner.',
    ],
  },
  'iki-yuz': {
    sec: 35,
    say: [
      'Genç için tanıdık bir oyun ritmi: haftalık hedef, seri, lig ve Niri’nin kostümleri. Ama hepsini yalnızca gerçek iş kazandırır.',
      'Eşleşmediğinde nedenini görür: hangi kanıt eksik, hangi görev o eksiği kapatır.',
      'Kurum tarafı sakin: oyun yok, ölçüm var. Şikâyetten ihtiyaca, gerekçeli kısa listeye, küçük bir pilota ve hesap verebilir kayda.',
    ],
  },
  guven: {
    sec: 40,
    say: [
      'Uyum puanı dört parçadan oluşur ve ağırlıkları açıktır: kanıt 45, bağlam 20, kapasite 15, iş birliği geçmişi 20 puan.',
      'İlk temasta isim, okul, şehir görünmez. Kurum önce işi görür; kimlik pilot teklifiyle açılır.',
      'Her aşama iki tarafın onayıyla deftere yazılır; kayıtlar SHA-256 ile zincirlenir. Biri geçmişi kurcalarsa zincir kırılır.',
      'Kod açık: her formülü herkes okuyabilir.',
    ],
  },
  pazar: {
    sec: 30,
    say: [
      'Bağımsız bir mikro staj pazar büyüklüğü bulamadık; uydurma bir rakam göstermiyoruz. Bunun yerine kimden başlayacağımızı söylüyoruz.',
      'İlk tur: Zemin360 ve GİRVAK ağındaki kurumlar ve gençler.',
      'İlk pazar: BİT uzmanı olmayan küçük işletmeler, kamu birimleri, STK’lar. 10–49 çalışanlı girişimlerin yalnızca %10,8’i BİT uzmanı çalıştırıyor.',
    ],
  },
  rekabet: {
    sec: 25,
    say: [
      'Pazarda iki dünya var. Oyunlaştırılmış öğrenme alışkanlık kurar ama puanı dışarıda geçmez.',
      'İlan siteleri, testler, bootcamp’ler, mikro staj ve açık inovasyon programları ise tek seferlik bir eşik; kanıt çoğu zaman platformun içinde kalır.',
      'Sağ üst köşe boş: hem alışkanlık kuran hem dışarıda doğrulanmış işe dayanan. Türkiye’de bu bileşimi sunan bir platform bulamadık.',
    ],
  },
  model: {
    sec: 35,
    say: [
      'Gence ücret yok. Kod MIT lisanslı ve açık; kanıt gencindir.',
      'Bugün gelirimiz yok. Pilotta sınayacağımız dört seçenek var; hiçbiri henüz gelir değil.',
      'Kamu ve vakıf fonları, kalkınma ajansları, üniversite kariyer merkezleri ve kurum tarafında barındırma ile destek.',
      'Yapay zekâ da ücretsiz kotayla çalışıyor: Workers AI’ın günlük ücretsiz payı, taslak başına yaklaşık 28 nöron, günde 350 civarı taslak. Kota dolarsa kural motoru devralır; fatura çıkmaz.',
    ],
  },
  olcum: {
    sec: 25,
    say: [
      'Pilotta dört şeyi ölçeceğiz; hedef rakam koymuyoruz, önce taban çizgisini ölçeceğiz.',
      'Kayıttan ilk doğrulanmış işe kaç gün geçiyor; yayımlanan ihtiyaçların kaçı pilota dönüşüyor.',
      'Pilotlarda çift onaylanan aşamalar ve tamamlanma oranı; eşleşmeyen gençlerin geri bildirimden sonra yeni kanıt ekleme oranı.',
    ],
  },
};
