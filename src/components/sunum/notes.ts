// The talk, keyed by slide id in deck order: Niri's bubbles on each slide with what the team says
// under each, and short answers for the questions most likely to come after the close. Niri is
// silent: its bubbles move on by themselves at the pace the team speaks (timing.ts), each one the
// headline of the presenter's next line, so the presenters only press → to change the page.
// Shown in the presenter window (N on the deck, or /sunum?notlar) and written to
// docs/SUNUM-NOTLARI.md by scripts/sunum-export/notes-md.mjs. Plain data so scripts can read it without React.
// Every number here is on the slide, in docs/PAZAR-ANALIZI.md with its source, or
// computed by the engine (the AI slides and the answers on the deneyim puanı (XP) and the fit score).
// The film's lines carry the second of the film they belong to (Video/src/film/cues.json).

export interface Beat {
  /** Niri's bubble: what the room reads (at most 60 characters), the headline of the presenter's line. On the film slide, the film's own line at `at`. */
  text: string;
  /** What the presenter says while the bubble is up; its length sets how long the bubble stays. On appendix pages, the team's answer. */
  say: string;
  /** Film slide only: the second of the film the line belongs to. The film plays it; the deck does not step through it. */
  at?: number;
}

export interface Note {
  /** Planned seconds on the slide (timing.ts: Niri's turn, the lines at a calm pace with a breath between, the key press); 0 for appendix pages, which sit outside the talk. */
  sec: number;
  /** The one thing the jury should take away from the slide; shown above the notes in the presenter window. */
  key?: string;
  /** A stage direction for the presenters: how the film runs, when a page is opened. */
  lead?: string;
  beats: Beat[];
}

export const NOTES: Record<string, Note> = {
  kapak: {
    sec: 22,
    key: 'Asıl sorun tek: deneyim yoksa iş yok, iş yoksa deneyim yok.',
    beats: [
      { text: 'Merhaba, ben Niri.', say: 'Merhaba, biz Sezer Uzun, Emirhan Açık ve Ayça Güder. Nirengi’yi Zemin360 Hackathon’unda geliştirdik ve sonrasında açık kaynak olarak yayınlamaya karar verdik.' },
      { text: 'Bugün tek bir sorunu konuşacağız.', say: 'Bugün tek bir sorunu konuşacağız: deneyim yoksa iş bulunamıyor, iş bulunamayınca da deneyim kazanılamıyor.' },
    ],
  },
  genc: {
    sec: 20,
    key: 'Gençlerin dörtte biri ne öğrenci ne de çalışan.',
    beats: [
      { text: 'Gençlerin dörtte biri ne öğrenci ne çalışan.', say: 'Türkiye’de 15–24 yaş arasındaki her 100 gençten 23’ü ne eğitimde ne de istihdamda. Genç kadınlarda bu oran 31.' },
      { text: 'İlk kayıtlı iş ortalama 14 ayda bulunuyor.', say: 'Lisans mezunları ilk kayıtlı işlerini ortalama 14,4 ayda buluyor. Bu gençlerin önemli bir kısmı yeteneksiz değil, yalnızca görünür değil.' },
    ],
  },
  kurum: {
    sec: 15,
    key: 'İşverenler de aynı engeli görüyor: adayların ilgili iş deneyimi yok.',
    beats: [
      { text: 'İşverenler de aynı engeli görüyor.', say: 'İşverenler de aynı engeli farklı bir yönden görüyor.' },
      { text: 'Her 100 işverenden 71’i: deneyim yok.', say: 'Bilişim uzmanı alırken zorlanan girişimlerin yüzde 71’i, adayların ilgili iş deneyimi olmamasını neden olarak gösteriyor.' },
    ],
  },
  olcum: {
    sec: 22,
    key: 'Deneyim yılı, işteki performansı neredeyse hiç öngörmüyor (0,07).',
    beats: [
      { text: 'Asıl sorun ölçme biçiminde.', say: 'Asıl sorun ölçme biçiminde. Kurumlar deneyimi doğrudan ölçemediği için adayın kaç yıl çalıştığına bakıyor.' },
      { text: 'Deneyim yılı performansı neredeyse öngörmüyor.', say: 'Oysa deneyim yılı, işteki performansı 0 ile 1 arasında yalnızca 0,07 düzeyinde öngörüyor. Adaya işin bir parçasını yaptırmak 0,33 ile çok daha iyi sonuç veriyor.' },
    ],
  },
  dayi: {
    sec: 14,
    key: 'Çalışan önerisiyle gelen aday, mülakata yaklaşık 13 kat daha sık çağrılıyor.',
    beats: [
      { text: 'Ölçülemeyen yeri tanıdık dolduruyor.', say: 'Deneyim ölçülemeyince boşluğu tanıdık dolduruyor.' },
      { text: 'Önerilen aday 13 kat daha sık çağrılıyor.', say: 'Normal başvuruların yüzde 3’ü mülakata çağrılıyor. Şirket çalışanlarının önerdiği adaylarda bu oran yüzde 40.' },
    ],
  },
  turkiye: {
    sec: 21,
    key: 'Türkiye’de gençler iş bulmayı tanıdığa bağlı görüyor; bunu ölçen bir veri yok.',
    beats: [
      { text: 'Gençler iş bulmayı tanıdığa bağlı görüyor.', say: 'Eğitimde ya da istihdamda olmayan gençlerin yüzde 86’sı, tanıdığı olmayanın iş bulmakta zorlandığını düşünüyor.' },
      { text: 'İsim bile sonucu değiştirebiliyor.', say: 'İstanbul’daki bir deneyde nitelikleri aynı iki kadın adaydan, ismi farklı bir etnik kökeni çağrıştıran aday 2,5 kat daha az geri dönüş aldı.' },
    ],
  },
  yer: {
    sec: 24,
    key: 'Döngü, başvuruların ilk elendiği aşamada kilitleniyor.',
    beats: [
      { text: 'Döngü ilk elemede kilitleniyor.', say: 'Sorunun kilitlendiği yer ilk eleme. CV’lerin çoğu açılmıyor, deneyim yılına bakılıyor ve tanıdığı olan aday öne geçiyor.' },
      { text: 'Nirengi bu aşamayı değiştirmeyi öneriyor.', say: 'İlanların beşte biri de gerçekte doldurulmayacak pozisyonlar için açılıyor. Nirengi, ihtiyacın açık yazılmasını ve ilk değerlendirmenin isimsiz ve işe dayalı yapılmasını öneriyor.' },
    ],
  },
  kirilir: {
    sec: 24,
    key: 'İlk fırsat ve herkese açık değerlendirme döngüyü kırıyor.',
    beats: [
      { text: 'İlk fırsat döngüyü kırıyor.', say: 'Döngü kırılabiliyor. Hiç iş almamış kişilere küçük bir iş verilip işleri herkese açık puanlandığında, iş bulma oranları yüzde 12’den 30’a çıktı.' },
      { text: 'Doğrulanmış iş, tanıdığın yerini tutabiliyor.', say: 'Kefil olan bir aracı kurum, deneyimsiz kişinin iş bulma olasılığını yüzde 75 artırıyor. Kişi herkese açık iyi puanlar biriktirdikçe bu farka gerek kalmıyor.' },
    ],
  },
  herkesin: {
    sec: 18,
    key: 'Niri, tanıdığı olmayan herkesin referansı.',
    beats: [
      { text: 'Tanıdığın yoksa referansın ben olurum.', say: 'Niri, tanıdığı olmayan herkes için referans görevi görüyor: kişiyi kim olduğuyla değil, ne yaptığıyla tanıtıyor.' },
      { text: 'Herkese aynı kural.', say: 'Bir tanıdığın sağladığı güveni doğrulanmış iş kaydıyla sağlıyor ve herkese aynı kuralı uyguluyor.' },
    ],
  },
  cozum: {
    sec: 19,
    key: 'Dört adım: ihtiyaç, isimsiz değerlendirme, deneme projesi, kayıt.',
    beats: [
      { text: 'Dört adım: ihtiyaç, değerlendirme, deneme, kayıt.', say: 'Nirengi dört adımda çalışıyor. Önce kurum ihtiyacını yazıyor, ardından gençler isimsiz olarak değerlendiriliyor.' },
      { text: 'Onaylanan iş gencin deneyimi olur.', say: 'En uygun aday işi küçük bir deneme projesinde yapıyor. Kurumun onayladığı iş, gencin profiline deneyim olarak ekleniyor.' },
    ],
  },
  usta: {
    sec: 20,
    key: 'Usta–çırak ilişkisi, yazılımdaki senior–junior modeliyle her aşamada kuruluyor.',
    beats: [
      { text: 'Usta–çırak, senior–junior olarak.', say: 'Usta–çırak ilişkisini yazılımdaki senior–junior modeliyle kuruyoruz. Junior işi yapıyor, senior inceliyor ve onaylıyor.' },
      { text: 'Her aşamada bir senior var.', say: 'Bu ilişki her aşamada var: ihtiyacı parçalara bölen, teslimi inceleyen ve onayı veren hep deneyimli bir kişi. Bunu filmde görelim.' },
    ],
  },
  demo: {
    sec: 91,
    key: 'Filmde iki göz var: önce genç, sonra kurum; her ekran ürünün gerçek ekranı.',
    lead: '(Film kendi oynar; Niri’nin sesi yok, söyleyeceği balonunda yazar. Üstüne konuş, ekrandaki yazıyı okuma, tamamla; müzik kısık çalar. P durdurur ve devam ettirir. Film bitince →.)',
    beats: [
      { at: 0, text: 'Deneyim yoksa iş yok. İş yoksa deneyim yok.', say: 'Bu döngüyü hepimiz biliyoruz; Nirengi onu kırmak için var.' },
      { at: 6.5, text: 'nirengi · Deneyimi ölçülebilir bir değere dönüştüren açık kaynak web sitesi.', say: 'Gençlerin yaptığı işi ölçülebilir deneyime çeviren açık kaynak bir web sitesi.' },
      { at: 12, text: 'Gencin gözünden', say: 'Önce gencin gözünden bakalım.' },
      { at: 15.4, text: 'Yazılım, tasarım, video ya da çeviri: işin neyse onunla görün.', say: 'Genç işini nerede yapıyorsa oradan bağlıyor: kod GitHub’dan, tasarım Behance’ten, animasyon YouTube’dan.' },
      { at: 22.4, text: 'Doğrulanan her iş deneyim puanı olur; en değerlisi kurum onayı.', say: 'Ece’nin kodu yok; animasyonunu bir sağlık kurumu onayladı, bu ona 120 deneyim puanı getirdi. Doğrulanmış iş 40, üretim yapılan gün 10.' },
      { at: 29.4, text: 'Flutter’da bir iş eklersen bu ihtiyaca uyumun 63’ten 72’ye çıkar.', say: 'Niri her gence hangi işin onu hangi ihtiyaca yaklaştıracağını söylüyor.' },
      { at: 36, text: 'Kurumun gözünden', say: 'Şimdi kurumun gözünden.' },
      { at: 39.4, text: 'İlan değil: derdini kendi cümlelerinle anlat.', say: 'Kuzey Lojistik ilan yazmıyor; derdini kendi cümleleriyle anlatıyor.' },
      { at: 45.6, text: 'Niri açık bir modelle okur. (Gemma 4 · açık model)', say: 'Niri metni açık kaynak Gemma 4 ile okuyor; her alan kurumun bir cümlesine dayanıyor, metin saklanmıyor.' },
      { at: 50.6, text: 'Metinde olmayanı yazmaz.', say: 'Model metinde olmayan bir karar verici uydurursa denetim onu almıyor; Niri kuruma soruyor.' },
      { at: 55.4, text: 'Referans, tanıdık, okul değil: yalnız yaptığı iş tartılır.', say: 'Adaylar isimsiz: isim, yaş, okul, şehir ilk temasa kadar gizli; referans ya da tanıdık puana hiç girmiyor.' },
      { at: 59.5, text: 'Neden bu uyum?', say: 'Puanın dört parçası var: yaptığı iş, sektör, zaman, ortak geçmiş; her birinin gerekçesi yazıyor.' },
      { at: 63.4, text: 'Genç teslim eder, kurum onaylar: iki imza, değişmeyen kayıt.', say: 'En uyumlu genç case’i küçük bir deneme projesinde çözüyor; her aşama iki imzayla zincire yazılıyor.' },
      { at: 70.4, text: 'Kurum onayı profiline imzalı yazılır: +120 deneyim puanı.', say: 'Onaylanan iş gencin profiline imzalı deneyim olarak dönüyor.' },
      { at: 78.5, text: 'Yaptığın iş, deneyimin olur. Deneyimin, yeni işin olur.', say: 'Döngü böylece tersine dönüyor.' },
      { at: 85, text: 'Emirhan, sıradaki sayfaya geçelim mi?', say: '(Film bitince →.)' },
    ],
  },

  'yz-ne': {
    sec: 0,
    key: 'Açık kaynak model: veri kapalı bir yapay zekâ şirketine gitmez; istenirse tamamen kendi sunucumuzda çalışır.',
    beats: [
      { text: 'Şimdi yapay zekâya yakından bakalım.', say: 'Yapay zekâ kurumun dağınık metnini okuyor, her alanı bir cümleye dayanan bir ihtiyaç kanvasına çeviriyor.' },
      { text: 'Açık bir modelle okurum; metni saklamam.', say: 'Model Google’ın açık kaynak Gemma 4’ü. Metin kapalı bir şirkete gitmiyor; kendi sunucumuzda çalışabilir. Demo Cloudflare’de, metni saklamıyoruz.' },
      { text: 'Ben okur, öneririm; kararı kurallar verir.', say: 'Yayın, puan ve sıralama kurallarda; model yalnız okuyor ve öneriyor.' },
    ],
  },
  'yz-fark': {
    sec: 0,
    key: 'Yapay zekâ case’i ölçülebilir yapar; gençler bu case’e isimsiz, referanssız ve açık bir formülle ölçülür.',
    beats: [
      { text: 'Okuyunca case netleşir: 60’tan 75’e.', say: 'Aynı metin kural motoruyla 60 puan alıp yayımlanamıyor; Niri okuyunca 75, önerilerle 100.' },
      { text: 'Sonra gençleri isimsiz, işleriyle tartarım.', say: 'Gençler bu case’e göre isimsiz ölçülüyor; referans ya da tanıdık puana girmiyor.' },
      { text: 'Puan açık bir formül; her parçası yazar.', say: 'Puan açık bir formül: yaptığı iş 45, sektör 20, zaman 15, ortak geçmiş 20.' },
    ],
  },
  'yz-onlem': {
    sec: 0,
    key: 'Model uydurursa alınmaz, Niri sorar; model yoksa kural motoru devralır.',
    beats: [
      { text: 'Model yanılırsa dört kapıdan geçemez.', say: 'Modelin cevabı dört denetimden geçiyor: şema, alıntı, sayı, ölçülebilirlik.' },
      { text: 'Metinde yoksa almam, kuruma sorarım.', say: 'Metinde olmayan bir şey uydurursa alınmıyor, Niri kuruma soruyor. Model susarsa kural motoru devralıyor.' },
    ],
  },
  tasarim: {
    sec: 0,
    key: 'Niri her gence eksiğine göre kişisel bir yol haritası çizer; deneyim puanı yalnız gerçek işten gelir.',
    beats: [
      { text: 'Gence oyun gibi bir ritim, kuruma sakin bir ölçüm.', say: 'Gence oyun gibi bir ritim, kuruma sakin bir ölçüm verdik.' },
      { text: 'Her gence eksiğine göre bir rota çizerim.', say: 'Niri her gence eksiğine göre yol çiziyor: Emirhan bugün 63 uyumlu, Flutter’da bir işle 72.' },
      { text: 'Deneyim puanı yalnız gerçek işten gelir.', say: 'Ekrandaki XP, deneyim puanı demek: yalnız gerçek işten gelir. Kurum tarafında oyun yok.' },
    ],
  },
  bitti: {
    sec: 0,
    key: 'Altı problemin altısı canlıda çalışıyor; pilotta tamamlanacaklar belli.',
    beats: [
      { text: 'Prototipim çalışıyor: altı problemin altısı canlıda.', say: 'Gördüğünüz her şey canlı: altı problemin altısı çalışıyor, 63 otomatik testle sınanıyor.' },
      { text: 'Gerisini pilotta, gerçek kurumlarla kanıtlayacağım.', say: 'Pilotta: kalıcı veritabanı, gerçek kurumlarla ilk tur, kod dışı işlerde otomatik doğrulama.' },
    ],
  },
  bugun: {
    sec: 17,
    key: 'Bugün sitede çalışan dört çözüm, dört sorunu karşılıyor.',
    beats: [
      { text: 'Bunlar bugün sitede çalışıyor.', say: 'Bu dört çözüm bugün sitede çalışıyor ve herkes inceleyebiliyor.' },
      { text: 'Yıl yerine iş, isim yerine kanıt.', say: 'Deneyim yılı yerine doğrulanmış iş, isim yerine isimsiz değerlendirme, belirsiz ilan yerine açık ihtiyaç ve kadro yerine deneme projesi.' },
    ],
  },
  'yol-guven': {
    sec: 19,
    key: 'Sırada güven: kurum doğrulaması, karşılıksız emeğin önlenmesi, canlı görüşme.',
    beats: [
      { text: 'Sırada güveni güçlendirmek var.', say: 'Üzerinde çalışmamız gereken alanlar var. İlki güven.' },
      { text: 'Kurum doğrulanmalı, emek karşılıksız kalmamalı.', say: 'Kurumun gerçekliğini alan adıyla doğrulamak, deneme projesinin karşılıksız emeğe dönüşmesini önlemek ve işi yapanın gerçekten aday olduğunu kısa bir görüşmeyle teyit etmek.' },
    ],
  },
  'yol-olcek': {
    sec: 14,
    key: 'Sırada ölçek: kalıcı hesaplar, kurumdan bağımsız senior’lar, taşınabilir belge.',
    beats: [
      { text: 'Sonra daha çok kişiye ulaşmak.', say: 'İkinci alan, daha çok kişiye ulaşmak.' },
      { text: 'Kurumdan bağımsız senior’lar da ağda.', say: 'Kalıcı hesaplar, junior’lara yol gösteren kurumdan bağımsız senior profesyoneller ve her yerde geçerli bir dijital belge.' },
    ],
  },
  pilot: {
    sec: 20,
    key: 'Tek ölçüt: bir gencin kayıttan ilk onaylı işine kaç günde ulaştığı.',
    beats: [
      { text: 'Bunu birlikte ölçmeyi öneriyoruz.', say: 'Bunu gerçek kurumlarla bir kez ölçmek istiyoruz: Zemin360 ağından 2–3 kurum ve GİRVAK ağından 20–30 genç.' },
      { text: 'Kayıttan ilk onaylı işe kaç gün?', say: 'Ölçeceğimiz temel şey, bir gencin kayıt olduktan kaç gün sonra ilk onaylı işine ulaştığı. Önce mevcut durumu ölçeceğiz, hedefi sonra koyacağız.' },
    ],
  },
  kapanis: {
    sec: 15,
    key: 'Çağrı: ilk ihtiyaç turunu birlikte ölçmek.',
    beats: [
      { text: 'İlk noktayı birlikte koyalım.', say: 'Zemin360’taki bir kurumun gerçek ihtiyacı, bir gencin ilk onaylı deneyimi olabilir. İlk turu birlikte ölçmeyi öneriyoruz.' },
      { text: 'Her çaban haritada bir nokta. Teşekkürler!', say: 'Her çaban haritada bir nokta. Teşekkür ederiz.' },
    ],
  },
  dogrulama: {
    sec: 0,
    key: 'Her işin yanında ne kadar güvenilir olduğu yazar.',
    lead: '(Ek: “Kanıtı nasıl doğruluyorsunuz?” gelirse.)',
    beats: [
      {
        text: 'İşin nerede duruyorsa oradan doğrularım.',
        say:
          'Her işin yanında üç düzeyden biri yazar: Beyan, gencin kendi söylediği; Doğrulandı, kaynağından kontrol edildi; Kurum onaylı, bir kurum imzaladı. GitHub’da projenin gerçekten gencin hesabında olduğunu kontrol ederiz, kodunu almayız. Behance ya da ArtStation’daki işin sahipliğini dışarıdan doğrulayamadığımız için dürüstçe Beyan yazıyoruz; her alanda en güçlü kanıt kurum onayı.',
      },
    ],
  },
  deneyim: {
    sec: 0,
    key: 'Oyunun her parçası gerçek işe bağlı: deneyim ölçülebilir bir değer olur.',
    lead: '(Ek: oyunlaştırma ya da deneyim puanı sorulursa.)',
    beats: [
      {
        text: 'Her deneyim puanının arkasında bir iş var.',
        say:
          'Haftalık ligde genç benzer tempodaki 18 kişiyle yarışır; ilk 5 üst lige çıkar. Seri, üretim yaptığın günlerden oluşur. Ekranda XP diye yazan deneyim puanı bir iş makbuzu: üretim günü 10, doğrulanmış iş 40, kurum onaylı aşama 120.',
      },
    ],
  },
  analiz: {
    sec: 0,
    key: 'Eşleşmeyen genç neyin eksik olduğunu bilir.',
    lead: '(Ek: analiz sorulursa.)',
    beats: [
      {
        text: 'Uyumunu artıracak en yakın kapıyı gösteririm.',
        say: 'Niri her hafta gencin haftasını okur ve en yakın kapıyı gösterir: Flutter’da bir doğrulanmış iş eklersen uyumun 63’ten 72’ye çıkar. Bu analiz kural tabanlı ve formülü açık; ona yapay zekâ demiyoruz.',
      },
    ],
  },
  topluluk: {
    sec: 0,
    key: 'Yardım eden de görünür olur.',
    lead: '(Ek: topluluk sorulursa.)',
    beats: [
      {
        text: 'Burada yardım eden de kazanır.',
        say: 'Takılan genç soruyor, o işi daha önce yapmış biri cevaplıyor. Soran “İşe yaradı” deyince yanıtlayan 15 deneyim puanı kazanıyor; haftanın yardımcıları işe yarayan cevap sayısıyla sıralanıyor.',
      },
    ],
  },
  ihtiyac: {
    sec: 0,
    key: 'Kurum ilan değil, derdini yazar.',
    lead: '(Ek: “Kurum ihtiyacı nasıl yazıyor?” gelirse.)',
    beats: [
      {
        text: 'Derdini anlat, alanları ben doldururum.',
        say: 'Kuzey Lojistik ilan yazmıyor, derdini anlatıyor. Niri bunu yedi alanlı kanvasa çeviriyor: durum, sorun, sorunun ölçüsü, beklenen sonuç, kısıtlar, karar verici, kapsam. Netlik 70’i geçmeden ihtiyaç yayımlanmıyor.',
      },
    ],
  },
  eslesme: {
    sec: 0,
    key: 'Önce iş, sonra isim; referans puana girmez.',
    lead: '(Ek: eşleşme sorulursa.)',
    beats: [
      {
        text: 'İsmi değil, işi tartarım.',
        say: 'Kurum adayları isimsiz görüyor: isim, okul ve şehir ilk temasa kadar gizli; referans ya da tanıdık puana girmiyor. Puan dört parçadan oluşuyor: yaptığı iş 45, sektör ve ölçek 20, zaman 15, ortak geçmiş 20; her parçanın gerekçesi yazıyor.',
      },
    ],
  },
  defter: {
    sec: 0,
    key: 'İki imza; sonradan kimse değiştiremez.',
    lead: '(Ek: deneme projesi sorulursa.)',
    beats: [
      {
        text: 'İki imza, bir mühür. Sonradan kimse değiştiremez.',
        say: 'Case’in başarı kriterleri aşamalara dönüşüyor: genç teslim ediyor, kurum onaylıyor. Her kayıt bir öncekine SHA-256 ile bağlı; biri sonradan tek harf değiştirse zincir tam o kayıtta kırılıyor.',
      },
    ],
  },
  donus: {
    sec: 0,
    key: 'Case boşa gitmez; imzalı deneyim olur.',
    lead: '(Ek: “Genç bundan ne kazanıyor?” gelirse.)',
    beats: [
      {
        text: 'Onaylanan iş, haritanda yeni bir nokta.',
        say: 'Şirketler işe almadan önce çoğu zaman bir case ister ve o emek boşa gider. Nirengi’de case bir deneme projesi; onaylanan aşama gencin profiline Kurum onaylı deneyim olarak, imzalayan kurum ve tarihle yazılıyor ve 120 deneyim puanı getiriyor.',
      },
    ],
  },
  niri: {
    sec: 0,
    key: 'Haritada herkese yer var: gence de, küçük bir ekibe de.',
    lead: '(Ek: vakit kalırsa ya da “kullanıcıya ne vaat ediyorsunuz?” gelirse.)',
    beats: [
      {
        text: 'Haritamda herkese yer var: gence de, küçük bir ekibe de.',
        say: 'Gençlere: CV yazma, işini bağla; eksiğini söylerim; işe alım için yaptığın case de boşa gitmez. Kurumlara, önce startuplara: İK’n yoksa da olur; adayı yaptığı işle gör, kadro riski yerine küçük bir deneme projesiyle başla.',
      },
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
    q: 'Deneyim puanı neyle kazanılıyor?',
    say: [
      'Ekranda XP diye yazan deneyim puanı bir iş makbuzu: üretim yaptığın gün 10, doğrulanmış kanıt 40, kurum onaylı aşama 120 puan. Günlük tavan 200.',
      'Her satırın arkasında dışarıda kontrol edilebilen bir olay var: birleşmiş bir PR, doğrulanmış bir alan adı ya da bir kurum imzası. Deneyimi böyle ölçülebilir bir değere dönüştürüyoruz.',
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
      'İlk temasta isim, okul, şehir görünmez; referans ya da tanıdık puanın hiçbir parçasına girmez. Kimlik pilot teklifiyle açılır.',
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
      'Örnekte Ece animasyoncu: kodla işi yok, animasyonunu bir sağlık kurumu onayladı; profilinde Kurum onaylı duruyor ve ona 120 deneyim puanı getirdi.',
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
