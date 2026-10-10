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
    sec: 10,
    say: [
      'Merhaba, biz Nirengi: Sezer Uzun ve Emirhan Açık.',
      'Nirengi açık kaynak bir web sitesi; telefonda da uygulama olarak çalışıyor. Size videomuzu bu kez adım adım anlatacağız.',
    ],
  },
  problem: {
    sec: 14,
    say: [
      'Deneyim yoksa iş yok, iş yoksa deneyim yok. Her 100 gençten 23’ü ne okulda ne işte.',
      'BİT uzmanı almakta zorlanan her 100 girişimden 71’i aynı şeyi söylüyor: ilgili iş deneyimi yok.',
    ],
  },
  'kim-icin': {
    sec: 15,
    say: [
      'Odağımız startuplar ve küçük ölçekli kurumlar: İK’sı yok, yanlış işe alımı kaldıramıyor.',
      'Öbür yanda üreten ama kanıtı olmayan genç: tek bir seçici programa bir milyon başvuru geliyor.',
    ],
  },
  kanit: {
    sec: 10,
    say: [
      'Diploma şartını kaldıran şirketlerde bile işe alım 700’de 1’den az değişti: ölçme aracı yok.',
      '37 platformu inceledik; doğrulanmış işi ve kurum imzasını birlikte sunanı bulamadık.',
    ],
  },
  cozum: {
    sec: 16,
    say: [
      'Ne çözüyoruz? Gencin yaptığı işi ve kurumun ihtiyacını beyandan kanıta çeviriyoruz; ikisi küçük bir pilotta buluşuyor.',
      'Altı problem bu beş durakta. Ve bu bir web sitesi: adresi açan kullanıyor; telefonda da yükleniyor.',
    ],
  },
  dogrulama: {
    sec: 14,
    say: [
      'Önce kanıt. Emirhan GitHub’da hangi depoları göstereceğini kendisi seçiyor; hepsi Doğrulandı geliyor, doğrulayanı yazıyor.',
      'Behance ya da ArtStation’daki iş dürüstçe Beyan yazıyor ve eşleşmede daha az sayılıyor.',
    ],
  },
  xp: {
    sec: 15,
    say: [
      'Oyunlaştırma: GitHub’a push attığın günler kendiliğinden seriye yazılıyor; commit sayısı değil, üretim günü.',
      'Haftalık ligde yükselen üst lige çıkıyor; düzenli üretim kurumun listesinde öne çıkıyor. Her XP bir iş makbuzu.',
    ],
  },
  analiz: {
    sec: 13,
    say: [
      'Niri her hafta gencin haftasını okuyor ve en yakın kapıyı gösteriyor: Flutter’da bir iş eklersen uyumun 63’ten 72’ye çıkar.',
      'Eşleşmeyen genç neyin eksik olduğunu biliyor.',
    ],
  },
  topluluk: {
    sec: 13,
    say: [
      'Gençler birbirine de yardım ediyor: takılan soruyor, o işi yapmış biri cevaplıyor.',
      'Soran “İşe yaradı” deyince yanıtlayan 15 XP kazanıyor; yardım eden de görünür oluyor.',
    ],
  },
  ihtiyac: {
    sec: 13,
    say: [
      'Şimdi kurum tarafı. Kuzey Lojistik ilan yazmıyor, derdini anlatıyor: “kargom nerede” aramaları ayda 6.000.',
      'Niri bunu yedi alanlı kanvasa çeviriyor; netlik 70’i geçmeden yayın yok.',
    ],
  },
  'yz-ne': {
    sec: 17,
    say: [
      'Metni açık ağırlıklı bir model okuyor: Gemma 4. Her alan metindeki bir cümleye dayanıyor.',
      'Model açık olduğu için veri bizde kalabilir: aynı model kendi sunucumuzda çalışır. Kural motoru aynı metne 60 veriyor, model 75; öneriler eklenince 100.',
    ],
  },
  'yz-onlem': {
    sec: 13,
    say: [
      'Model yanılırsa? Cevap dört kapıdan geçiyor: şema, alıntı, sayı, ölçülebilirlik.',
      'Metinde olmayan bir karar verici uydurursa alan boş kalıyor, Niri kuruma soruyor.',
    ],
  },
  eslesme: {
    sec: 15,
    say: [
      'Kurum adayları isimsiz görüyor: Aday 9C03, 86 puan. Önce iş, sonra isim.',
      'Puanın dört parçası açık, her birinin gerekçesi yazıyor; kimlik deneme projesi teklif edilince açılıyor.',
    ],
  },
  defter: {
    sec: 13,
    say: [
      'Deneme projesinde kriterler aşamaya dönüşüyor: Emirhan teslim ediyor, Kuzey Lojistik onaylıyor.',
      'Her kayıt öncekine zincirli; biri sonradan tek harf değiştirse zincir orada kırılıyor.',
    ],
  },
  donus: {
    sec: 14,
    say: [
      'Şirketler işe almadan önce bir case ister; bu iş genelde sözde bir deneyim olarak kalır. Nirengi’de case bir deneme projesi: onaylanan aşama Emirhan’ın profiline Kurum onaylı deneyim olarak, imzalayanıyla yazılıyor.',
      'İşe girmese bile bu deneyimi taşıyor; döngü kapanıyor.',
    ],
  },
  niri: {
    sec: 20,
    say: [
      'Ve Niri’nin size söyleyecekleri var.',
      'Gençlere: CV yazma, işini bağla; eksiğini söylerim; işe alım için yaptığın case de boşa gitmez, imzalı deneyim olur.',
      'Kurumlara, önce startuplara: İK’n yoksa da olur; adayı yaptığı işle gör; kadro riski yerine küçük bir deneme projesiyle başla.',
    ],
  },
  bitti: {
    sec: 12,
    say: [
      'Bunların hepsi web sitemizde canlı; motor 55 testle sınanıyor.',
      'Bilerek bıraktıklarımız: kalıcı veritabanı, gerçek kullanıcı ve pilot, kod dışı işte makine doğrulaması.',
    ],
  },
  kapanis: {
    sec: 8,
    say: [
      'Tek isteğimiz: bu salondan bir startupın ya da kurumun gerçek bir ihtiyacı. İlk kanvası birlikte yazalım.',
      'Beyan değil, kanıt. Teşekkürler.',
    ],
  },
  'ek-film': {
    sec: 0,
    say: [
      '(Ek: soru gelirse ya da vakit kalırsa 48 saniyelik film. Müzikle oynar; bitince → ile devam.)',
      'Ses gelmezse filme bir kez tıkla. Film açılmazsa slayt canlı demo paneline döner.',
    ],
  },
  'ek-tasarim': {
    sec: 0,
    say: [
      '(Ek: “Tasarım kararlarınız neler?” gelirse.) Gence oyun, kuruma ölçüm: XP makbuzu, seri ve lig, topluluk, haftalık analiz; kurumda isimsiz liste, açık puan, iki onay, oyun yok.',
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
