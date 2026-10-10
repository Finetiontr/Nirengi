// Speaker notes, keyed by slide id: what the team says while Niri says one line,
// and short answers for the questions most likely to come after the close.
// Shown in the presenter window (N on the deck, or /sunum?notlar) and mirrored in
// docs/SUNUM-NOTLARI.md. Plain data so a script can read it without React.
// Every number here is on the slide, in docs/PAZAR-ANALIZI.md with its source, or
// computed by the engine (the AI slides and the answers on XP and the fit score).

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
    sec: 25,
    say: [
      'Döngüyü hepimiz biliyoruz: deneyim yoksa iş yok, iş yoksa deneyim yok.',
      'Her 100 gençten 23’ü ne okulda ne işte; Avrupa’yla kıyaslandığında en yüksek oran bizde.',
      'Öbür tarafta, BİT uzmanı almakta zorlanan her 100 şirketten 71’i aynı şeyi söylüyor: ilgili iş deneyimi yok.',
    ],
  },
  'kim-icin': {
    sec: 25,
    say: [
      'İki kullanıcımız var.',
      'Birincisi üreten ama kanıtı olmayan genç. Tek bir seçici programa bir milyon başvuru geliyor; kapıda kalanın da gösterecek bir işi olmalı.',
      'İkincisi BİT uzmanı olmayan küçük kurum: 10–49 çalışanlı girişimlerin yalnız %10,8’inde BİT uzmanı var. İhtiyacı var ama tarif edemiyor, kadro riskini alamıyor.',
    ],
  },
  kanit: {
    sec: 25,
    say: [
      'Bunu nereden biliyoruz?',
      'Diploma şartını kaldıran şirketlerde bile işe alım 700’de 1’den az değişti: niyet var, ölçme aracı yok.',
      'İşverenlerin %63’ü beceri açığını bir numaralı engel görüyor.',
      'Biz de 37 platform ve programı tek tek inceledik. Oyun ritmini, doğrulanmış işi ve kurum imzasını bir arada sunan birini Türkiye’de bulamadık.',
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
    sec: 48,
    say: [
      '(Film müzikle oynar; konuşma yok. Bitince → ile devam.)',
      'Ses gelmezse filme bir kez tıkla.',
      'Film açılmazsa slayt kendiliğinden canlı demo paneline döner; Sunum klasöründeki mp4 de yedekte.',
    ],
  },
  'yz-ne': {
    sec: 25,
    say: [
      'Filmde gördüğünüz yapay zekâ adımı şu: kurum derdini kendi sözleriyle yazıyor.',
      'Açık ağırlıklı bir model, Gemma 4, bu metni yedi alanlı ihtiyaç kanvasına çeviriyor.',
      'Her alan metindeki bir cümleye dayanıyor: “ayda 6.000 arama” sorunun ölçüsü, operasyon direktörü karar verici oluyor.',
    ],
  },
  'yz-fark': {
    sec: 25,
    say: [
      'Aynı metni önceki kural motorumuz da okuyordu: beş alan, netlik 60, yayımlanamaz.',
      'Model yedi alanı doldurdu ve iki ölçülebilir başarı kriteri önerdi: 75. Kurum önerileri ekleyince 100, yayımlanabilir.',
      'Bu sayıları ürünün kendi kuralları hesaplıyor; testlerimizde sabit.',
    ],
  },
  'yz-onlem': {
    sec: 30,
    say: [
      'Model yanılırsa? Cevabını doğrudan kullanmıyoruz; dört kapıdan geçiyor: şema, alıntı, sayı ve ölçülebilirlik.',
      'Testten bir örnek: model “Genel Müdür onaylar” diye uydurursa bu cümle metinde olmadığı için alan boş kalır, Niri kuruma kimin onaylayacağını sorar.',
      'Öneriler kurum “Ekle” demeden kanvasa girmez; reddedilen her şey kuruma gösterilir. Model hiç cevap vermezse aynı ekranı kural motoru doldurur.',
    ],
  },
  tasarim: {
    sec: 25,
    say: [
      'Tasarımda beş karar verdik.',
      'Her ekranda tek iş, ve önce telefon: her ekran önce 390 pikselde tasarlandı.',
      'Oyun yalnız genç tarafında; kurum ekranı sakin, XP yok.',
      'Kurum adayı temasa kadar isimsiz görür.',
      'Niri yol gösterir ama kimseyi bekletmez.',
    ],
  },
  bitti: {
    sec: 25,
    say: [
      'Altı problemin altısına çalışan bir ekranımız var. GitHub ve DNS doğrulaması, yapay zekâ taslağı ve denetimi canlıda; eşleşme, defter ve denetim testli.',
      'Bilerek bıraktıklarımız: kalıcı veritabanı yok, veri tarayıcıda. Demo kişileri kurgusal ve ekranda öyle yazıyor. Kod dışı kanıt sırada.',
      'Finalden sonraki dört ay: kalıcılık, ilk ihtiyaç turu, kod dışı kanıt ve fon verene pilot raporu.',
    ],
  },
  kapanis: {
    sec: 15,
    say: [
      'Tek bir isteğimiz var: bu salondan bir kurumun gerçek bir ihtiyacı. İlk kanvası birlikte yazalım.',
      'Beyan değil, kanıt. Teşekkürler; sorularınızı bekliyoruz.',
    ],
  },
};

export interface Answer {
  q: string;
  say: string[];
}

/** Likely questions after the close, answered aloud; the presenter window shows them on the last slide. */
export const QA: Answer[] = [
  {
    q: 'XP neyle kazanılıyor?',
    say: [
      'Her XP bir iş makbuzu: üretim yaptığın gün 10, doğrulanmış kanıt 40, kurum onaylı aşama 120 XP. Günlük tavan 200.',
      'Her satırın arkasında dışarıda kontrol edilebilen bir olay var: birleşmiş bir PR, doğrulanmış bir alan adı ya da bir kurum imzası.',
    ],
  },
  {
    q: 'Sistem nasıl işliyor?',
    say: [
      'Üç nesne var: Kanıt, İhtiyaç, Pilot. Kanıtın üç seviyesi var: Beyan, Doğrulandı, Kurum onaylı.',
      'Kurum ilan yazmaz; yedi alanlı kanvasla ihtiyaç yazar. Netlik puanı 70’i geçmeden ihtiyaç yayımlanmaz.',
      'Pilot aşamalara bölünür: genç teslim eder, kurum onaylar. Onaylanan aşama gencin profiline Kurum onaylı kanıt olarak döner.',
    ],
  },
  {
    q: 'Genç ve kurum tarafı neden farklı?',
    say: [
      'Genç ritim ister: haftalık hedef, seri, lig ve Niri’nin kostümleri. Ama hepsini yalnızca gerçek iş kazandırır.',
      'Kurum ölçüm ister, oyun yok: şikâyetten ihtiyaca, gerekçeli kısa listeye, küçük bir pilota ve hesap verebilir kayda.',
    ],
  },
  {
    q: 'Uyum puanına neden güvenelim?',
    say: [
      'Puan dört parçadan oluşur ve ağırlıkları açıktır: kanıt 45, bağlam 20, kapasite 15, iş birliği geçmişi 20 puan.',
      'İlk temasta isim, okul, şehir görünmez; kimlik pilot teklifiyle açılır.',
      'Her aşama iki tarafın onayıyla deftere yazılır; kayıtlar SHA-256 ile zincirlenir. Kod açık: her formülü herkes okuyabilir.',
    ],
  },
  {
    q: 'İlk pazarınız kim?',
    say: [
      'Bağımsız bir mikro staj pazar büyüklüğü bulamadık; uydurma bir rakam vermiyoruz.',
      'İlk tur: Zemin360 ve GİRVAK ağındaki kurumlar ve gençler. Sonra BİT uzmanı olmayan küçük işletmeler, kamu birimleri ve STK’lar.',
    ],
  },
  {
    q: 'Rakipleriniz kim?',
    say: [
      'Pazarda iki dünya var. Oyunlaştırılmış öğrenme alışkanlık kurar ama puanı dışarıda geçmez.',
      'İlan siteleri, testler, bootcamp’ler ve mikro staj programları tek seferlik bir eşik; kanıt çoğu zaman platformun içinde kalır. İkisini birleştiren bir platformu Türkiye’de bulamadık.',
    ],
  },
  {
    q: 'Nasıl yaşayacak, ücret var mı?',
    say: [
      'Gence ücret yok. Kod MIT lisanslı ve açık; kanıt gencindir. Bugün gelirimiz yok.',
      'Pilotta dört seçenek sınayacağız: kamu ve vakıf fonları, kalkınma ajansları, üniversite kariyer merkezleri, kurum tarafında barındırma ve destek.',
      'Yapay zekâ da ücretsiz kotayla çalışıyor: Workers AI’ın günlük ücretsiz payı, taslak başına yaklaşık 28 nöron, günde 350 civarı taslak. Kota dolarsa kural motoru devralır; fatura çıkmaz.',
    ],
  },
  {
    q: 'Başarıyı nasıl ölçeceksiniz?',
    say: [
      'Hedef rakam koymuyoruz, önce taban çizgisini ölçeceğiz.',
      'Kayıttan ilk doğrulanmış işe kaç gün geçtiği, yayımlanan ihtiyaçların kaçının pilota dönüştüğü, pilotların tamamlanma oranı ve eşleşmeyen gençlerin geri bildirimden sonra yeni kanıt ekleme oranı.',
    ],
  },
];
