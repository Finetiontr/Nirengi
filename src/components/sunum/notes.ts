// Speaker notes, keyed by slide id: what the team says while Niri says one line,
// and short answers for the questions most likely to come after the close.
// Shown in the presenter window (N on the deck, or /sunum?notlar) and mirrored in
// docs/SUNUM-NOTLARI.md. Plain data so a script can read it without React.
// Every number here is on the slide, in docs/PAZAR-ANALIZI.md with its source, or
// computed by the engine (the AI slides and the answers on XP and the fit score).

export interface Note {
  /** Suggested speaking time in seconds; 0 for appendix pages, which sit outside the talk. */
  sec: number;
  say: string[];
}

export const NOTES: Record<string, Note> = {
  baslik: {
    sec: 12,
    say: [
      'Merhaba, biz Nirengi: Sezer Uzun ve Emirhan Açık.',
      'Nirengi noktası, haritacının güvenle ölçtüğü sabit noktadır. Biz gençlerin işi için o noktayı kuruyoruz: açık kaynak bir web sitesi, telefonda da uygulama olarak çalışıyor.',
    ],
  },
  problem: {
    sec: 18,
    say: [
      'Deneyim yoksa iş yok, iş yoksa deneyim yok.',
      'Her 100 gençten 23’ü ne okulda ne işte.',
      'Öbür tarafta, BİT uzmanı almakta zorlanan her 100 girişimden 71’i aynı şeyi söylüyor: ilgili iş deneyimi yok.',
    ],
  },
  'kim-icin': {
    sec: 20,
    say: [
      'Odağımız girişim ekosistemi.',
      'Bir yanda üreten ama kanıtı olmayan genç: tek bir seçici programa bir milyon başvuru geliyor, kapıda kalan görünmüyor.',
      'Öbür yanda ekip kuran erken aşama girişim: İK’sı yok, yanlış işe alımı kaldıramaz. İlk tur Zemin360 ve GİRVAK ağı.',
    ],
  },
  kanit: {
    sec: 16,
    say: [
      'Bunu nereden biliyoruz?',
      'Diploma şartını kaldıran şirketlerde bile işe alım 700’de 1’den az değişti: niyet var, ölçme aracı yok.',
      '37 platform ve programı inceledik; doğrulanmış işi ve kurum imzasını bir arada sunanı Türkiye’de bulamadık.',
    ],
  },
  cozum: {
    sec: 22,
    say: [
      'Ne çözüyoruz? Gencin yaptığı işi ve kurumun ihtiyacını beyandan kanıta çeviriyoruz; ikisi küçük bir pilotta buluşuyor.',
      'Beş durak var ve yarışmanın altı problemi bu duraklarda, her biri çalışan bir ekranla.',
      'Ve Nirengi bir web sitesi: adresi açan hemen kullanıyor, kurum genelde masaüstünden çalışıyor. Telefonda da var: aynı adres ana ekrana yükleniyor, internetsiz açılıyor. Filmde telefondan gezeceğiz; aynı sayfalar masaüstünde de.',
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
  eslesme: {
    sec: 25,
    say: [
      'Jürinin en çok sorduğu yer: eşleşme. Kurum adayları isimsiz görüyor: Aday 9C03, iki Kurum onaylı iş, 86 puan.',
      'Puan kara kutu değil: dört parçası ve ağırlıkları açık, her parçanın gerekçesi “Neden bu uyum?” ekranında yazıyor. Kimlik ancak deneme projesi teklif edilince açılıyor.',
      'Eşleşmeyen genç de boş dönmüyor: hangi işi eklerse hangi ihtiyaca yaklaşacağını görüyor; Flutter’da bir iş eklerse 63’ten 72’ye.',
    ],
  },
  'yz-ne': {
    sec: 25,
    say: [
      'Yapay zekâ ne yapıyor? Kurum derdini kendi sözleriyle yazıyor; açık ağırlıklı bir model, Gemma 4, metni yedi alanlı kanvasa çeviriyor. Her alan metindeki bir cümleye dayanıyor: “ayda 6.000 arama” sorunun ölçüsü oluyor.',
      'Farkı sağ altta: aynı metni kural motoru okuyunca netlik 60, yayımlanamıyor; modelle 75, kurum önerileri ekleyince 100. Bu sayıları ürünün kendi kuralları hesaplıyor.',
      'Gemma’yı açık olduğu, ücretsiz kotada çalıştığı ve denediğimiz dört model içinde Türkçeyi en iyi ayırdığı için seçtik. Yayın kararı ve puanlar kurallarda.',
    ],
  },
  'yz-onlem': {
    sec: 20,
    say: [
      'Model yanılırsa? Cevabı dört kapıdan geçiyor: şema, alıntı, sayı, ölçülebilirlik.',
      'Model “Genel Müdür onaylar” diye uydurursa, bu cümle metinde olmadığı için alan boş kalır; Niri kuruma sorar.',
      'Model hiç cevap vermezse kural motoru devralır.',
    ],
  },
  tasarim: {
    sec: 22,
    say: [
      'Tasarımın tek fikri: gence oyun, kuruma ölçüm.',
      'Genç her hafta hedef, seri ve ligle geri geliyor; ama her XP bir iş makbuzu. Gençler birbirine de yardım ediyor, yardım eden XP kazanıyor. Niri her hafta en yakın kapıyı gösteriyor.',
      'Kurum adayı isimsiz görüyor, puanın dört parçası açık, her aşama iki onayla zincirli deftere yazılıyor. Kurum ekranında oyun yok.',
    ],
  },
  bitti: {
    sec: 22,
    say: [
      'Bunların hepsi web sitemizde canlı: her problemin kendi sayfası var, ekrandakiler sitenin gerçek görüntüleri; aynı site telefonda uygulama olarak da açılıyor. GitHub ve DNS doğrulaması gerçek, motor 55 testle sınanıyor.',
      'Bilerek bıraktıklarımız: kalıcı veritabanı, gerçek kullanıcı ve pilot, kod dışı işte makine doğrulaması, bildirim ve mağaza sürümü.',
      'Finalden sonraki dört ay: kalıcılık, ilk ihtiyaç turu, kod dışı doğrulama ve pilot raporu.',
    ],
  },
  kapanis: {
    sec: 14,
    say: [
      'Adresimiz ekranda; sitemiz şu an açık, deneyebilirsiniz. Tek bir isteğimiz var: bu salondan bir girişimin ya da kurumun gerçek bir ihtiyacı. İlk kanvası birlikte yazalım.',
      'Beyan değil, kanıt. Teşekkürler.',
    ],
  },
  'ek-dogrulama': {
    sec: 0,
    say: [
      '(Ek sayfa: “Doğrulama nasıl işliyor?” gelirse.) Beyan, Doğrulandı, Kurum onaylı; eşleşmede 0,3, 0,8 ve 1 ağırlıkla sayılır.',
      'GitHub depolarını genç kendisi seçer; alan adı DNS kaydıyla doğrulanır. Behance, ArtStation, LinkedIn Beyan olarak gelir.',
    ],
  },
  'ek-xp': {
    sec: 0,
    say: [
      '(Ek sayfa: “Oyunlaştırma ne?” gelirse.) Hedef üretim günüdür, commit değil; seri, lig, görevler ve Niri’nin kostümleri.',
      'XP yalnız doğrulanmış işten: 10, 40, 120; günde en çok 200. Kurum tarafında oyun yok.',
    ],
  },
  'ek-analiz': {
    sec: 0,
    say: [
      '(Ek sayfa: “Analiz ne gösteriyor?” gelirse.) Niri’nin haftalık notu ve en yakın kapı: “Flutter’da bir doğrulanmış iş eklersen uyumun 63 → 72.”',
      'Analiz kural tabanlı; formülü /yontem sayfasında.',
    ],
  },
  'ek-topluluk': {
    sec: 0,
    say: [
      '(Ek sayfa: “Gençler birbirine nasıl yardım ediyor?” gelirse.) Soru, cevap, teşekkür: soran “İşe yaradı” derse yanıtlayan 15 XP alır.',
      'Bu haftanın yardımcıları beğeniyle değil, işe yarayan cevap sayısıyla sıralanır.',
    ],
  },
  'ek-ihtiyac': {
    sec: 0,
    say: [
      '(Ek sayfa: “Kurum ihtiyacı nasıl yazıyor?” gelirse.) Kurum derdini düz metinle anlatır; Niri yedi alanlı kanvasa çevirir.',
      'Netlik 70’in altındaysa ihtiyaç yayımlanmaz; benzer ihtiyaçların sonucu aynı ekranda.',
    ],
  },
  'ek-defter': {
    sec: 0,
    say: [
      '(Ek sayfa: “Pilot nasıl takip ediliyor?” gelirse.) Kriterler aşamaya dönüşür; genç teslim eder, kurum onaylar.',
      'Her kaydın özeti bir sonrakine yazılır; sonradan tek harf değişirse zincir o kayıtta kırılır.',
    ],
  },
  'ek-donus': {
    sec: 0,
    say: [
      '(Ek sayfa: “Pilot bitince ne oluyor?” gelirse.) Onaylanan aşama gencin profiline Kurum onaylı kanıt olarak geçer, imzalayanıyla.',
      'Kapanan projenin özeti herkese açık bir sayfada kalır; genç bir sonraki ihtiyaca daha yakındır.',
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
    q: 'Neden bu model?',
    say: [
      'Gemma 4 açık ağırlıklı ve Apache 2.0 lisanslı: açık kaynak bir hizmetin modeli de açık, istenirse kendi sunucumuzda çalışır.',
      'Örnek metinde dört açık model denedik; JSON şemasına uyan, Türkçe metni doğru alanlara ayıran en hızlı model buydu.',
    ],
  },
  {
    q: 'İnternet ya da model giderse ne olur?',
    say: [
      'Taslağı kural motoru çıkarır ve ekran bunu açıkça söyler; akış kesilmez.',
      'Örnek metin için modelin gerçek, kayıtlı bir cevabı var: model ulaşılamazsa o gösterilir ve ekranda “kayıttan” yazar.',
    ],
  },
  {
    q: 'Kurum az yazarsa ne olur?',
    say: [
      'Model metinde olmayan her alan için kurumun derdine özel bir öneri getirir; kutuda “Niri’nin önerisi” olarak soluk durur.',
      'Öneride sayı uydurmaz, yerine “…” koyar; rakamı kurum yazar. Kurum kullanmadan hiçbir öneri kanvasa girmez.',
    ],
  },
  {
    q: 'Mobil uygulama var mı?',
    say: [
      'Var. Nirengi bir web uygulaması (PWA): adresi telefonda açıp ya da ana sayfadaki QR’ı okutup Uygulamayı yükle’ye dokununca ana ekrana gelir, tam ekran açılır ve sayfaları telefonda tuttuğu için internetsiz de çalışır.',
      'Android’de paylaş menüsünden Behance ya da YouTube bağlantısı doğrudan eser olarak gelir; simgeye basılı tutunca Bugün, Eser ekle, İhtiyaç yaz kısayolları çıkar.',
      'Mağaza yerine bunu seçtik: iki gün içinde, sıfır maliyetle, tek kodla hem gence hem kuruma. Bildirim göndermiyoruz; kalıcı sunucu gelince sıradaki iş o.',
    ],
  },
  {
    q: 'Yalnız yazılımcılar için mi?',
    say: [
      'Hayır. Kanıt bağla önce işin nerede durduğunu sorar: kodu GitHub’da olan depolarını bağlar; tasarımcı, animasyoncu, çevirmen LinkedIn, Behance, ArtStation, YouTube profillerini ve eserlerini ekler.',
      'Bu sitelerde hesabın kime ait olduğunu dışarıdan kontrol edemiyoruz; o yüzden Beyan diyoruz, uydurma bir doğrulama göstermiyoruz. Her alanda en güçlü kanıt aynı: kurumun onayladığı deneme projesi.',
    ],
  },
  {
    q: 'İlk pazarınız kim?',
    say: [
      'Odak girişim ekosistemi. İlk tur: Zemin360 ve GİRVAK ağındaki girişimler ve gençler. Sonra BİT uzmanı olmayan küçük işletmeler, kamu birimleri ve STK’lar.',
      'Bağımsız bir mikro staj pazar büyüklüğü bulamadık; uydurma bir rakam vermiyoruz.',
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
