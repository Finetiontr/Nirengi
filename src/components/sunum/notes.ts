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
  /** The one thing the jury should take away from the slide; shown above the notes in the presenter window. */
  key?: string;
  say: string[];
}

export const NOTES: Record<string, Note> = {
  baslik: {
    sec: 16,
    key: 'Nirengi: gencin gerçek işi, şirketin gerçek case’i, imzalı deneyim.',
    say: [
      'Merhaba, biz Sezer Uzun ve Emirhan Açık; bugün size Nirengi’yi tanıtacağız.',
      'Nirengi, gençlerin gerçek işini doğrulayan ve onları şirketlerin gerçek case’leriyle buluşturan açık kaynak bir web sitesi. Kısaca: yaptığın iş, deneyimin olsun.',
    ],
  },
  problem: {
    sec: 16,
    key: 'Kısır döngü: deneyim yoksa iş yok, iş yoksa deneyim yok.',
    say: [
      'Hepimizin bildiği bir döngü var: deneyim yoksa iş yok, iş yoksa deneyim yok.',
      'Türkiye’de her 100 gençten 23’ü ne okulda ne işte. Bilişim uzmanı almakta zorlanan her 100 şirketten 71’i de aynı şeyi söylüyor: ilgili iş deneyimi yok.',
    ],
  },
  'kim-icin': {
    sec: 16,
    key: 'Odak: İK’sı olmayan startuplar ve kanıtı olmayan genç üreticiler.',
    say: [
      'Odağımız startuplar ve küçük ekipler: İK’ları yok, yanlış bir işe alımı kaldıramıyorlar.',
      'Diğer yanda üreten ama bunu kanıtlayamayan genç var: tek bir seçici programa bir milyon başvuru geliyor, kapıda kalan görünmüyor.',
    ],
  },
  kanit: {
    sec: 14,
    key: 'Sorun niyet değil: beceriyi ölçecek bir araç yok. Nirengi o araç.',
    say: [
      'Şirketler diploma şartını kaldırmayı denedi; ama bu karar her 700 işe alımdan 1’ini bile değiştirmedi, çünkü beceriyi ölçecek bir araç yok.',
      '37 platform ve programı inceledik; doğrulanmış işi ve kurum imzasını birlikte sunanı bulamadık.',
    ],
  },
  cozum: {
    sec: 28,
    key: 'Kurum gerçek bir case verir; gençler işleriyle ölçülür; en uyumlusu onu deneme projesinde gerçekten çözer.',
    say: [
      'Çözümümüz tek cümle: kurum gerçek bir case verir, genç onu gerçekten çözer.',
      'Genç işini bağlar; GitHub’daki projeleri kaynağında doğrulanır. Kurum case’ini kendi sözleriyle yazar; Niri onu açık bir yapay zekâ modeliyle ölçülebilir yapar.',
      'Gençler bu case’e göre isimsiz ölçülür. En uyumlusu case’i küçük bir deneme projesinde çözer; kurum onaylayınca bu iş profiline imzalı deneyim olarak yazılır.',
      'Hepsi bir web sitesinde; telefonda da uygulama gibi çalışıyor.',
    ],
  },
  demo: {
    sec: 58,
    key: 'Filmde tek bir case’in baştan sona yolculuğu var; her ekran ürünün gerçek ekranı.',
    say: [
      '(Film oynarken üstüne konuş; ekrandaki yazıyı okuma, tamamla. Müzik kısık çalar. P durdurur ve devam ettirir; film bitince →.)',
      '0:00 Şimdi bir case’in yolculuğunu baştan sona izleyeceğiz; gördüğünüz her ekran ürünün gerçek ekranı.',
      '0:08 Emirhan GitHub’ını bağlıyor; projeleri kaynağında doğrulanıyor, kimin ve ne zaman doğruladığı yazıyor.',
      '0:14 Puanı yalnız gerçek işten geliyor: ürettiği günler seri oluyor, haftalık ligde yükseliyor.',
      '0:18 Niri eksiğini söylüyor: Flutter’da bir iş eklerse uyumu 63’ten 72’ye çıkıyor.',
      '0:22 Kurum tarafı: Kuzey Lojistik ilan yazmıyor, derdini kendi cümleleriyle anlatıyor.',
      '0:26 Niri metni açık kaynak Gemma 4 ile okuyor; her alan kurumun bir cümlesine dayanıyor. Uydurulan satır denetimde siliniyor.',
      '0:34 Gençler bu case’e göre isimsiz ölçülüyor; puanın her parçasının gerekçesi açık.',
      '0:40 En uyumlu genç case’i deneme projesinde çözüyor: teslim, onay ve sonradan değiştirilemeyen kayıt.',
      '0:46 Onaylanan iş gencin profilinde imzalı deneyim olarak kalıyor; bir sonraki kurum bunu görüyor.',
    ],
  },
  'yz-ne': {
    sec: 26,
    key: 'Açık kaynak model: veri kapalı bir yapay zekâ şirketine gitmez; istenirse tamamen kendi sunucumuzda çalışır.',
    say: [
      'Yapay zekâ ne yapıyor? Kurumun dağınık metnini okuyup her alanı bir cümleye dayanan bir ihtiyaç kanvasına çeviriyor.',
      'Kritik nokta veri: model Google’ın açık kaynak modeli Gemma 4. Kapalı bir yapay zekâ şirketine metin göndermiyoruz. Model açık olduğu için kendi sunucumuzda, hatta kurumun sunucusunda çalışabilir; o zaman veri hiç dışarı çıkmaz.',
      'Bugünkü demo Cloudflare’de çalışıyor ve metni saklamıyoruz.',
    ],
  },
  'yz-fark': {
    sec: 22,
    key: 'Yapay zekâ case’i ölçülebilir yapar; gençler bu case’e isimsiz ve açık bir formülle ölçülür.',
    say: [
      'Farkı şu: aynı metin kural motoruyla 60 puan alıyor ve yayımlanamıyor. Niri okuyunca 75, önerileri eklenince 100.',
      'Case ölçülebilir olunca gençler de ona göre ölçülüyor: case’in istediği beceriler cetvel oluyor. Liste isimsiz; puan yapay zekâ değil, herkesin okuyabildiği açık bir formül.',
    ],
  },
  'yz-onlem': {
    sec: 18,
    key: 'Model uydurursa alınmaz, Niri sorar; model yoksa kural motoru devralır.',
    say: [
      'Model yanılırsa? Cevabı dört denetimden geçiyor: şema, alıntı, sayı ve ölçülebilirlik.',
      'Metinde olmayan bir karar verici uydurursa o alan alınmıyor, Niri kuruma soruyor. Model hiç cevap vermezse kural motoru devralıyor; akış kesilmiyor.',
    ],
  },
  tasarim: {
    sec: 25,
    key: 'Niri her gence eksiğine göre kişisel bir yol haritası çizer.',
    say: [
      'Tasarımda gence oyun gibi bir ritim, kuruma sakin bir ölçüm verdik.',
      'Niri her gence eksiğine göre bir yol haritası çiziyor: Emirhan bu ihtiyaca bugün 63 uyumlu; Flutter’da tek bir doğrulanmış iş eklerse 72’ye çıkıyor.',
      'Haftalık ligde benzer tempodaki gençlerle yarışıyor; her XP gerçek bir işin makbuzu. Kurum tarafında oyun yok: isimsiz liste, açık puan, iki onay.',
    ],
  },
  bitti: {
    sec: 15,
    key: 'Altı problemin altısı canlıda çalışıyor; pilotta tamamlanacaklar belli.',
    say: [
      'Gördüğünüz her şey web sitemizde canlı: altı problemin altısı çalışıyor, 59 otomatik testle sınanıyor.',
      'Pilotta tamamlayacaklarımız: kalıcı veritabanı, gerçek kurumlarla ilk ihtiyaç turu, kod dışı işlerde otomatik doğrulama ve pilot raporu.',
    ],
  },
  kapanis: {
    sec: 12,
    key: 'Çağrı: salondaki bir girişimin gerçek case’i.',
    say: [
      'Bu salondaki bir girişimin gerçek bir case’i, bir gencin ilk imzalı deneyimi olabilir. Gelin, ilkini birlikte yazalım.',
      'Her çaban haritada bir nokta. Teşekkürler.',
    ],
  },
  dogrulama: {
    sec: 0,
    key: 'Her işin yanında ne kadar güvenilir olduğu yazar.',
    say: [
      '(Ek: “Kanıtı nasıl doğruluyorsunuz?” gelirse.) Her işin yanında üç düzeyden biri yazar: Beyan, gencin kendi söylediği; Doğrulandı, kaynağından kontrol edildi; Kurum onaylı, bir kurum imzaladı. Eşleşmede güçlü olan daha ağır sayılır.',
      'GitHub’da genç hangi projeleri göstereceğini kendisi seçer; projenin gerçekten onun hesabında olduğunu GitHub’dan kontrol ederiz, kodunu almayız. Behance ya da ArtStation’daki işin sahipliğini dışarıdan doğrulayamadığımız için dürüstçe Beyan yazıyoruz.',
    ],
  },
  xp: {
    sec: 0,
    key: 'Oyunun her parçası gerçek işe bağlı.',
    say: [
      '(Ek: oyunlaştırma sorulursa.) Haftalık ligde genç benzer tempodaki 18 kişiyle yarışır; ilk 5 üst lige çıkar. Zemin’den Zirve’ye beş lig var ve Niri her ligde yeni bir kostüm giyer.',
      'Seri, üretim yaptığın günlerden oluşur: GitHub’a push, PR ya da sürüm attığın gün kendiliğinden yazılır. XP bir iş makbuzu: üretim günü 10, doğrulanmış iş 40, kurum onaylı aşama 120 XP.',
    ],
  },
  analiz: {
    sec: 0,
    key: 'Eşleşmeyen genç neyin eksik olduğunu bilir.',
    say: [
      '(Ek: analiz sorulursa.) Niri her hafta gencin haftasını okur: kaç gün üretti, ne doğrulandı, ona uyan kaç yeni ihtiyaç çıktı.',
      'En yakın kapıyı gösterir: Flutter’da bir doğrulanmış iş eklersen uyumun 63’ten 72’ye çıkar. Bu analiz kural tabanlı ve formülü açık; ona yapay zekâ demiyoruz.',
    ],
  },
  topluluk: {
    sec: 0,
    key: 'Yardım eden de görünür olur.',
    say: [
      '(Ek: topluluk sorulursa.) Takılan genç soruyor, o işi daha önce yapmış biri cevaplıyor; kurumdan önce akran desteği.',
      'Soran “İşe yaradı” deyince yanıtlayan 15 XP kazanıyor; haftanın yardımcıları beğeniyle değil, işe yarayan cevap sayısıyla sıralanıyor.',
    ],
  },
  ihtiyac: {
    sec: 0,
    key: 'Kurum ilan değil, derdini yazar.',
    say: [
      '(Ek: “Kurum ihtiyacı nasıl yazıyor?” gelirse.) Kuzey Lojistik ilan yazmıyor, derdini anlatıyor: “kargom nerede” aramaları ayda 6.000.',
      'Niri bunu yedi alanlı kanvasa çeviriyor: durum, sorun, sorunun ölçüsü, beklenen sonuç, kısıtlar, karar verici, kapsam. Netlik 70’i geçmeden ihtiyaç yayımlanmıyor.',
    ],
  },
  eslesme: {
    sec: 0,
    key: 'Önce iş, sonra isim.',
    say: [
      '(Ek: eşleşme sorulursa.) Kurum adayları isimsiz görüyor: Aday 9C03, 86 puan. İsim, okul ve şehir ilk temasa kadar gizli.',
      'Puan dört parçadan oluşuyor: yaptığı iş 45, sektör ve ölçek 20, zaman 15, ortak geçmiş 20. Her parçanın neden o kadar olduğu yazıyor; eşleşmeyen gence de eksiği söyleniyor.',
    ],
  },
  defter: {
    sec: 0,
    key: 'İki imza; sonradan kimse değiştiremez.',
    say: [
      '(Ek: deneme projesi sorulursa.) Case’in başarı kriterleri aşamalara dönüşüyor: genç teslim ediyor, kurum onaylıyor; iki onay olmadan aşama kapanmıyor.',
      'Her kayıt bir öncekine SHA-256 ile bağlı; biri sonradan tek harf değiştirse zincir tam o kayıtta kırılıyor.',
    ],
  },
  donus: {
    sec: 0,
    key: 'Case boşa gitmez; imzalı deneyim olur.',
    say: [
      '(Ek: “Genç bundan ne kazanıyor?” gelirse.) Şirketler işe almadan önce çoğu zaman bir case ister ve o emek boşa gider. Nirengi’de case bir deneme projesi.',
      'Onaylanan aşama gencin profiline Kurum onaylı deneyim olarak, imzalayan kurum ve tarihle yazılıyor. İşe girmese bile bu deneyimi taşıyor.',
    ],
  },
  niri: {
    sec: 0,
    key: 'Haritada herkese yer var: gence de, küçük bir ekibe de.',
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
      'Odak girişim ekosistemi. İlk tur: Zemin360 ve GİRVAK ağındaki girişimler ve gençler. Sonra bilişim uzmanı olmayan küçük işletmeler, kamu birimleri ve STK’lar.',
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
