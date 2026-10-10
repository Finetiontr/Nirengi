// Speaker notes, keyed by slide id: what the team says while Niri says one line,
// and short answers for the questions most likely to come after the close.
// Shown in the presenter window (N on the deck, or /sunum?notlar) and mirrored in
// docs/SUNUM-NOTLARI.md. Plain data so a script can read it without React.
// Every number here is on the slide, in docs/PAZAR-ANALIZI.md with its source, or
// computed by the engine (the AI slides and the answers on XP and the fit score).
// The film's lines carry the second of the shot they belong to (Video/src/film/cues.json).

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
      'Nirengi, gencin gerçek işini kanıta çeviren ve onu girişimlerin gerçek case’leriyle buluşturan açık kaynak bir web sitesi; telefonda da uygulama olarak çalışıyor.',
    ],
  },
  problem: {
    sec: 15,
    say: [
      'Deneyim yoksa iş yok, iş yoksa deneyim yok. Türkiye’de her 100 gençten 23’ü ne okulda ne işte.',
      'Öbür tarafta BİT uzmanı almakta zorlanan her 100 girişimden 71’i aynı gerekçeyi söylüyor: ilgili iş deneyimi yok. İki taraf birbirini arıyor ama bulamıyor.',
    ],
  },
  'kim-icin': {
    sec: 15,
    say: [
      'Odağımız startuplar ve küçük ekipler: İK’sı yok, yanlış bir işe alımı kaldıramıyor.',
      'Öbür yanda üreten ama bunu kanıtlayamayan genç: tek bir seçici programa bir milyon başvuru geliyor, kapıda kalan görünmüyor.',
    ],
  },
  kanit: {
    sec: 12,
    say: [
      'Diploma şartını kaldıran şirketlerde bile işe alım 700’de 1’den az değişti; çünkü yerine koyacak bir ölçme aracı yok.',
      '37 platform ve programı inceledik; doğrulanmış işi ve kurum imzasını bir arada sunanı Türkiye’de bulamadık.',
    ],
  },
  cozum: {
    sec: 26,
    say: [
      'Çözümümüz tek cümle: kurum gerçek bir case verir, genç onu gerçekten çözer.',
      'Genç işini bağlar; GitHub’daki iş kaynağında doğrulanır. Kurum case’ini kendi sözleriyle yazar; Niri onu açık bir modelle ölçülebilir hale getirir. Gençler bu case’e göre isimsiz ölçülür.',
      'En uyumlu genç case’i küçük bir deneme projesinde gerçekten çözer: genç teslim eder, kurum onaylar. Onaylanan iş gencin profiline imzalı deneyim olarak döner.',
      'Ve bu bir web sitesi: adresi açan hemen kullanır; telefonda da ana ekrana yüklenir.',
    ],
  },
  demo: {
    sec: 58,
    say: [
      '(Film oynarken üstüne konuş; ekrandaki yazıyı okuma, onu tamamla. Müzik kısık çalar. P durdurur ve devam ettirir; film bitince →.)',
      '0:00 Şimdi bir case’in baştan sona yolculuğunu izleyeceksiniz; gördüğünüz her ekran ürünün gerçek ekranı.',
      '0:08 Emirhan GitHub’ını bağlıyor; depoları kaynağında doğrulanıyor, doğrulayanı ve tarihi yazıyor.',
      '0:14 Puanı yalnız gerçek işten geliyor: üretim yaptığı günler seri oluyor, haftalık ligde yükseliyor.',
      '0:18 Niri ona eksiğini söylüyor: hangi iş onu hangi kurum ihtiyacına yaklaştırır.',
      '0:22 Şimdi kurum tarafı: Kuzey Lojistik ilan yazmıyor, derdini anlatıyor.',
      '0:26 Niri metni açık model Gemma 4 ile okuyor; her alan kurumun bir cümlesine dayanıyor. Metinde olmayan bir satır uydurulursa denetimde siliniyor.',
      '0:34 Gençler bu case’e göre isimsiz ölçülüyor; puanın her parçasının gerekçesi yazıyor.',
      '0:40 En uyumlu genç case’i deneme projesinde çözüyor: genç teslim ediyor, kurum onaylıyor, kayıt zincirleniyor.',
      '0:46 Onaylanan iş gencin profilinde imzalayanıyla duruyor; bir sonraki kurum bunu görüyor.',
    ],
  },
  'yz-ne': {
    sec: 22,
    say: [
      'Yapay zekâ ne yapıyor? Kurumun kendi sözlerini okuyup yedi alanlı ihtiyaç kanvasına çeviriyor; her alanı metindeki bir cümleye bağlıyor.',
      'Model açık kaynak: Google’ın Gemma 4’ü, ağırlıkları açık. Kapalı bir yapay zekâ şirketine veri göndermiyoruz. Model açık olduğu için bizim ya da kurumun kendi sunucusunda çalışabilir; o zaman veri hiç dışarı çıkmaz. Bugünkü demo ücretsiz Workers AI’da çalışıyor ve metni saklamıyoruz.',
      'Karar modelde değil: yayın, puan ve sıralama açık kurallarda.',
    ],
  },
  'yz-fark': {
    sec: 22,
    say: [
      'Farkı ne? Aynı metin: kural motoru 60 puan çıkarıyor, eşiğin altında, yayımlanamıyor. Niri okuyunca 75, yayına hazır; kurum Niri’nin önerilerini ekleyince 100.',
      'Case ölçülebilir olunca genç de ölçülebiliyor: case’in becerileri cetvel oluyor, gençlerin doğrulanmış işi bu cetvelle ölçülüyor. Liste isimsiz; puan yapay zekâ değil, açık bir formül.',
    ],
  },
  'yz-onlem': {
    sec: 18,
    say: [
      'Model yanılırsa? Cevap dört kapıdan geçiyor: şemaya uyuyor mu, alıntı metinde mi, sayı metinde mi, kriter ölçülebilir mi.',
      'Metinde olmayan bir karar verici uydurursa o alan alınmıyor, Niri kuruma soruyor. Model hiç cevap vermezse aynı ekranı kural motoru dolduruyor; akış kesilmiyor.',
    ],
  },
  tasarim: {
    sec: 18,
    say: [
      'Tasarım kararımız: gence oyun gibi bir ritim, kuruma sakin bir ölçüm.',
      'Genç tarafında her XP bir iş makbuzu; seri, lig, topluluk ve haftalık analiz var. Kurum tarafında oyun yok: isimsiz liste, açık puan, iki onay, kurcalanamaz kayıt. Her ekranda tek iş; Niri yol gösteriyor.',
    ],
  },
  bitti: {
    sec: 14,
    say: [
      'Bunların hepsi web sitemizde canlı; altı problemin altısı çalışıyor, motor ve sunucu 59 otomatik testle sınanıyor.',
      'Bilerek bıraktıklarımız: kalıcı veritabanı, gerçek pilot, kod dışı işlerde makine doğrulaması. Sıradaki iş ilk gerçek ihtiyaç turu.',
    ],
  },
  kapanis: {
    sec: 10,
    say: [
      'Tek isteğimiz: bu salondan bir girişimin gerçek bir case’i. İlk kanvası birlikte yazalım.',
      'Niri’nin dediği gibi: her çaban haritada bir nokta. Teşekkürler.',
    ],
  },
  dogrulama: {
    sec: 0,
    say: [
      '(Ek: “Kanıtı nasıl doğruluyorsunuz?” gelirse.) Emirhan GitHub’da hangi depoları göstereceğini kendisi seçiyor; hepsi Doğrulandı geliyor, doğrulayanı yazıyor.',
      'Behance ya da ArtStation’daki iş dürüstçe Beyan yazıyor ve eşleşmede daha az sayılıyor.',
    ],
  },
  xp: {
    sec: 0,
    say: [
      '(Ek: oyunlaştırma sorulursa.) GitHub’a push attığın günler kendiliğinden seriye yazılıyor; commit sayısı değil, üretim günü.',
      'Haftalık ligde yükselen üst lige çıkıyor; düzenli üretim kurumun listesinde öne çıkıyor. Her XP bir iş makbuzu.',
    ],
  },
  analiz: {
    sec: 0,
    say: [
      '(Ek: analiz sorulursa.) Niri her hafta gencin haftasını okuyor ve en yakın kapıyı gösteriyor: Flutter’da bir iş eklersen uyumun 63’ten 72’ye çıkar.',
      'Eşleşmeyen genç neyin eksik olduğunu biliyor. Analiz kural tabanlı, formülü açık.',
    ],
  },
  topluluk: {
    sec: 0,
    say: [
      '(Ek: topluluk sorulursa.) Gençler birbirine de yardım ediyor: takılan soruyor, o işi yapmış biri cevaplıyor.',
      'Soran “İşe yaradı” deyince yanıtlayan 15 XP kazanıyor; yardım eden de görünür oluyor.',
    ],
  },
  ihtiyac: {
    sec: 0,
    say: [
      '(Ek: “Kurum ihtiyacı nasıl yazıyor?” gelirse.) Kuzey Lojistik ilan yazmıyor, derdini anlatıyor: “kargom nerede” aramaları ayda 6.000.',
      'Niri bunu yedi alanlı kanvasa çeviriyor; netlik 70’i geçmeden yayın yok. Benzer ihtiyaçların nasıl sonuçlandığı aynı ekranda.',
    ],
  },
  eslesme: {
    sec: 0,
    say: [
      '(Ek: eşleşme sorulursa.) Kurum adayları isimsiz görüyor: Aday 9C03, 86 puan. Önce iş, sonra isim.',
      'Puanın dört parçası açık, her birinin gerekçesi yazıyor; kimlik deneme projesi teklif edilince açılıyor.',
    ],
  },
  defter: {
    sec: 0,
    say: [
      '(Ek: deneme projesi sorulursa.) Case’in başarı kriterleri aşamaya dönüşüyor: Emirhan teslim ediyor, Kuzey Lojistik onaylıyor.',
      'Her kayıt öncekine zincirli; biri sonradan tek harf değiştirse zincir orada kırılıyor.',
    ],
  },
  donus: {
    sec: 0,
    say: [
      '(Ek: “Genç bundan ne kazanıyor?” gelirse.) Şirketler işe almadan önce bir case ister; bu iş genelde sözde bir deneyim olarak kalır. Nirengi’de case bir deneme projesi: onaylanan aşama Emirhan’ın profiline Kurum onaylı deneyim olarak, imzalayanıyla yazılıyor.',
      'İşe girmese bile bu deneyimi taşıyor; döngü kapanıyor.',
    ],
  },
  niri: {
    sec: 0,
    say: [
      '(Ek: vakit kalırsa ya da “kullanıcıya ne vaat ediyorsunuz?” gelirse.)',
      'Gençlere: CV yazma, işini bağla; eksiğini söylerim; işe alım için yaptığın case de boşa gitmez, imzalı deneyim olur.',
      'Kurumlara, önce startuplara: İK’n yoksa da olur; adayı yaptığı işle gör; kadro riski yerine küçük bir deneme projesiyle başla.',
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
    q: 'Veri nereye gidiyor, model sizin sunucunuzda mı?',
    say: [
      'Bugünkü demo ücretsiz Cloudflare Workers AI üzerinde çalışıyor. Metni kaydetmiyoruz. Kapalı bir yapay zekâ şirketinin servisine hiçbir metin gitmiyor.',
      'Model açık ağırlıklı olduğu için aynı modeli kendi sunucumuzda ya da kurumun sunucusunda çalıştırabiliriz; o zaman metin kurumdan hiç çıkmaz. Bunu henüz kurmadık; ilk pilotta kurumla birlikte kuracağız.',
    ],
  },
  {
    q: 'Genç bir şirketin problemini gerçekten çözebilir mi?',
    say: [
      'Bu yüzden önce küçük bir deneme projesi var, kadro değil. Case’in başarı kriterleri aşamalara bölünüyor; her aşamayı genç teslim ediyor, kurum onaylıyor. Kurum onaylamadan aşama kapanmıyor.',
      'Örnekte Kuzey Lojistik’in rota case’i: 3.000 noktalık rotanın 5 dakikanın altında hesaplanması. Onaylanan aşama gencin profiline imzalı deneyim olarak yazılıyor; işe girmese bile bu deneyimi taşıyor.',
    ],
  },
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
