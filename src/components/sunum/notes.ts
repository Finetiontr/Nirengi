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
    sec: 8,
    say: [
      'Merhaba, biz Nirengi: Sezer Uzun ve Emirhan Açık.',
      'Nirengi noktası, haritacının güvenle ölçtüğü sabit noktadır; biz gençlerin işi için o noktayı kuruyoruz.',
    ],
  },
  problem: {
    sec: 12,
    say: [
      'Deneyim yoksa iş yok, iş yoksa deneyim yok. Her 100 gençten 23’ü ne okulda ne işte.',
      'BİT uzmanı almakta zorlanan her 100 girişimden 71’i aynı şeyi söylüyor: ilgili iş deneyimi yok.',
    ],
  },
  'kim-icin': {
    sec: 13,
    say: [
      'Odağımız girişim ekosistemi. Bir yanda üreten ama kanıtı olmayan genç: tek bir seçici programa bir milyon başvuru geliyor.',
      'Öbür yanda ekip kuran erken aşama girişim: İK’sı yok, yanlış işe alımı kaldıramaz. İlk tur Zemin360 ve GİRVAK ağı.',
    ],
  },
  kanit: {
    sec: 10,
    say: [
      'Diploma şartını kaldıran şirketlerde bile işe alım 700’de 1’den az değişti: niyet var, ölçme aracı yok.',
      '37 platformu inceledik; doğrulanmış işi ve kurum imzasını birlikte sunanı bulamadık.',
    ],
  },
  cozum: {
    sec: 12,
    say: [
      'Ne çözüyoruz? Gencin yaptığı işi ve kurumun ihtiyacını beyandan kanıta çeviriyoruz; ikisi küçük bir pilotta buluşuyor.',
      'Yarışmanın altı problemi bu beş durakta, her biri çalışan bir ekranla.',
    ],
  },
  web: {
    sec: 12,
    say: [
      'Nirengi bir web sitesi: tarayıcıda açılıyor, kurulum yok. Aynı adres telefona uygulama olarak yükleniyor ve internetsiz çalışıyor.',
      'Şimdi videomuzdaki her sahneyi yavaşça açalım. Hikâyenin genci Emirhan: adı bizden, profil kurgusal.',
    ],
  },
  'sayfa-dogrulama': {
    sec: 13,
    say: [
      'Önce kanıt. Emirhan GitHub’da hangi depoları göstereceğini kendisi seçiyor; hepsi Doğrulandı geliyor, yanında doğrulayanı yazıyor.',
      'Behance ya da ArtStation’daki iş dürüstçe Beyan yazıyor; eşleşmede de daha az sayılıyor.',
    ],
  },
  'sayfa-xp': {
    sec: 13,
    say: [
      'Oyunlaştırma burada: haftalık hedef, seri, lig, görevler ve Niri’nin kostümleri.',
      'Ama XP yalnız gerçek işten geliyor; her XP bir iş makbuzu. Kurum tarafında oyun yok.',
    ],
  },
  'sayfa-analiz': {
    sec: 12,
    say: [
      'Niri her hafta gencin haftasını okuyor ve en yakın kapıyı gösteriyor: Flutter’da bir doğrulanmış iş eklersen uyumun 63’ten 72’ye çıkar.',
      'Eşleşmeyen genç neyin eksik olduğunu biliyor.',
    ],
  },
  'sayfa-topluluk': {
    sec: 12,
    say: [
      'Gençler yalnız kurumlarla değil, birbirleriyle de çalışıyor: Baran soruyor, Emirhan cevaplıyor.',
      'Baran “İşe yaradı” deyince Emirhan 15 XP kazanıyor; yardım da üretim sayılıyor.',
    ],
  },
  'sayfa-ihtiyac': {
    sec: 12,
    say: [
      'Şimdi kurum tarafı. Kuzey Lojistik ilan yazmıyor, derdini anlatıyor: “kargom nerede” aramaları ayda 6.000.',
      'Niri bunu yedi alanlı kanvasa çeviriyor; netlik 70’i geçmeden ihtiyaç yayına çıkmıyor.',
    ],
  },
  'sayfa-aday': {
    sec: 13,
    say: [
      'Kurum adayları isimsiz görüyor: Aday 9C03, iki Kurum onaylı iş, 86 puan.',
      'Puanın dört parçası açık, her birinin gerekçesi yazıyor. Kimlik ancak deneme projesi teklif edilince açılıyor.',
    ],
  },
  'sayfa-defter': {
    sec: 13,
    say: [
      'Deneme projesinde kriterler aşamaya dönüşüyor: Emirhan teslim ediyor, Kuzey Lojistik onaylıyor.',
      'Her kaydın özeti bir sonrakine yazılıyor; biri sonradan tek harf değiştirse zincir tam orada kırılıyor.',
    ],
  },
  'sayfa-donus': {
    sec: 11,
    say: [
      'Onaylanan aşama Emirhan’ın profiline Kurum onaylı kanıt olarak dönüyor, imzalayanıyla.',
      'Döngü kapanıyor; Emirhan bir sonraki ihtiyaca daha yakın.',
    ],
  },
  'yz-ne': {
    sec: 13,
    say: [
      'Kurumun metnini kim okuyor? Açık ağırlıklı bir model, Gemma 4.',
      'Metni yedi alana ayırıyor ve her alanı metindeki bir cümleye bağlıyor: “ayda 6.000 arama” sorunun ölçüsü oluyor.',
    ],
  },
  'yz-model': {
    sec: 13,
    say: [
      'Neden Gemma? Açık ağırlıklı ve Apache lisanslı; denediğimiz dört açık model içinde Türkçeyi doğru ayıran en hızlısı oydu.',
      'Ücretsiz kotada çalışıyor. Model okuyor ve öneriyor; yayın kararı, puan ve sıralama kurallarda.',
    ],
  },
  'yz-fark': {
    sec: 10,
    say: [
      'Aynı metni kural motoru okuyunca netlik 60, yayımlanamıyor. Modelle 75; kurum önerileri ekleyince 100.',
      'Bu sayıları ürünün kendi kuralları hesaplıyor.',
    ],
  },
  'yz-onlem': {
    sec: 12,
    say: [
      'Model yanılırsa? Cevap dört kapıdan geçiyor: şema, alıntı, sayı, ölçülebilirlik.',
      'Metinde olmayan bir karar verici uydurursa alan boş kalıyor, Niri kuruma soruyor. Model susarsa kural motoru devralıyor.',
    ],
  },
  tasarim: {
    sec: 8,
    say: [
      'Tasarımda kararımız net: her ekranda tek iş, önce telefon; oyun yalnız gençte, kurum ekranı sakin; aday temasa kadar isimsiz.',
    ],
  },
  bitti: {
    sec: 13,
    say: [
      'Gördüğünüz her şey canlıda çalışıyor; motor 55 testle sınanıyor.',
      'Bilerek bıraktıklarımız: kalıcı veritabanı, gerçek kullanıcı ve pilot, kod dışı işte makine doğrulaması. Sonraki dört ay bunlar.',
    ],
  },
  demo: {
    sec: 48,
    say: [
      '(Süre darsa bu slaytı → ile geç: sayfalar filmin sahneleri. Oynarsa müzikle oynar, konuşma yok; bitince → ile devam.)',
      'Ses gelmezse filme bir kez tıkla.',
      'Film açılmazsa slayt kendiliğinden canlı demo paneline döner; Sunum klasöründeki mp4 de yedekte.',
    ],
  },
  kapanis: {
    sec: 10,
    say: [
      'Tek bir isteğimiz var: bu salondan bir girişimin ya da kurumun gerçek bir ihtiyacı. İlk kanvası birlikte yazalım.',
      'Ekrandaki kodu okutursanız Nirengi şimdi telefonunuza gelir.',
      'Beyan değil, kanıt. Teşekkürler.',
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
      'Var. Nirengi bir web uygulaması (PWA): QR’ı okutup Uygulamayı yükle’ye dokununca ana ekrana gelir, tam ekran açılır ve sayfaları telefonda tuttuğu için internetsiz de çalışır.',
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
