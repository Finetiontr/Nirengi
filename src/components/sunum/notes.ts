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
    sec: 23,
    key: 'Asıl problem tek: deneyim yoksa iş yok, iş yoksa deneyim yok.',
    beats: [
      { text: 'Merhaba, ben Niri! Bugün tek bir problem var.', say: 'Merhaba, biz Sezer Uzun, Emirhan Açık ve Ayça Güder; Nirengi’yi Zemin360 Hackathon’unda yaptık, sonra açık kaynak olarak kendimiz yayınlamaya karar verdik.' },
      { text: 'Deneyim yoksa iş yok, iş yoksa deneyim yok.', say: 'Bugün tek bir problemi konuşacağız: deneyim yoksa iş yok, iş yoksa deneyim yok. Geri kalan her şey bunun çözümünden türüyor.' },
    ],
  },
  genc: {
    sec: 16,
    key: 'Gencin tarafı: her dört gençten biri ne okulda ne işte.',
    beats: [
      { text: 'Her dört gençten biri ne okulda ne işte.', say: 'Türkiye’de 15–24 yaşta her 100 gençten 23’ü ne okulda ne işte; genç kadınlarda 31.' },
      { text: 'İlk kayıtlı iş ortalama 14 ay sürüyor.', say: 'Lisans mezunu ilk kayıtlı işini ortalama 14,4 ayda buluyor. Bu gençlerin çoğu yeteneksiz değil, görünmez.' },
    ],
  },
  kurum: {
    sec: 15,
    key: 'Kurum aynı cümleyi kuruyor: ilgili iş deneyimi yok.',
    beats: [
      { text: 'Kurum da aynı cümleyi kuruyor.', say: 'Kurum tarafı aynı duvarı öbür taraftan görüyor.' },
      { text: '100 şirketten 71’i: “deneyim yok.”', say: 'Bilişim uzmanı almakta zorlanan her 100 şirketten 71’i nedeni “ilgili iş deneyimi yok” diye gösteriyor. Aynı cümle, iki taraftan.' },
    ],
  },
  olcum: {
    sec: 17,
    key: 'Kök neden ölçüm: deneyim yılının öngörme gücü 0,07.',
    beats: [
      { text: 'Sorun niyet değil, ölçüm.', say: 'Kök neden bir ölçüm sorunu: kurum deneyimi ölçemediği için yıla bakıyor.' },
      { text: 'Deneyim yılı neredeyse hiçbir şey söylemiyor.', say: 'Deneyim yılının iş performansını öngörme gücü 0,07, neredeyse sıfır. Gerçek bir iş örneği 0,33, yapılandırılmış değerlendirme 0,42.' },
    ],
  },
  dayi: {
    sec: 15,
    key: 'Tanıdık mülakat şansını yaklaşık 13 katına çıkarıyor.',
    beats: [
      { text: 'Ölçemeyince boşluğu tanıdık dolduruyor.', say: 'Kurum ölçemeyince boşluğu tanıdık dolduruyor.' },
      { text: 'Normalde 100’de 3, referansla 100’de 40.', say: 'Her 100 normal başvurudan 3’ü mülakata çağrılıyor; referanslıda 40. Referanslar başvuruların yüzde 1’i ama işe alımların yüzde 18’i.' },
    ],
  },
  turkiye: {
    sec: 19,
    key: 'Türkiye’de gençler tanıdığı işe girişin şartı sayıyor.',
    beats: [
      { text: 'Türkiye’de bunun adı torpil.', say: 'Türkiye’de bunun adı torpil, dayı: ne okulda ne işte olan gençlerin yüzde 86’sı “tanıdığın yoksa iş bulmak zor” diyor.' },
      { text: 'İsim bile geri dönüşü değiştiriyor.', say: 'İstanbul’daki bir saha deneyinde aynı nitelikteki CV’lerde Türk kadın, Kürt kadından 2,5 kat fazla geri dönüş aldı.' },
    ],
  },
  yer: {
    sec: 22,
    key: 'Problemin düğümlendiği yer: ilk eleme.',
    beats: [
      { text: 'Her şey ilk elemede düğümleniyor.', say: 'Asıl problemin yeri belli: ilk eleme. CV’lerin çoğu açılmıyor, deneyim yılı burada soruluyor, tanıdık burada öne geçiyor.' },
      { text: 'Nirengi tam buraya müdahale ediyor.', say: 'İlanların beşte biri de doldurulmak için açılmıyor. Nirengi bu iki noktaya dokunuyor: ihtiyacı netleştiriyor, ilk elemeyi isimsiz ve işe dayalı yapıyor.' },
    ],
  },
  kirilir: {
    sec: 20,
    key: 'İlk iş ve açık değerlendirme döngüyü kırıyor.',
    beats: [
      { text: 'Döngü kırılabiliyor.', say: 'Döngü kırılabiliyor: hiç iş almamış kişilere tek bir küçük iş ve açık değerlendirme verilince iş bulma yüzde 12’den 30’a çıktı.' },
      { text: 'Açık kanıt, dayının işini görebiliyor.', say: 'Kefil olan bir aracı deneyimsizin şansını yüzde 75 artırıyor; ama açık iyi puan biriktikçe aracıya gerek kalmıyor.' },
    ],
  },
  herkesin: {
    sec: 13,
    key: 'Nirengi: herkesin dayısı.',
    beats: [
      { text: 'Nirengi, herkesin dayısı.', say: 'Dayının yaptığı işi yazılıma çeviriyoruz: kefil olmak, kapıyı açmak, ihtiyacı bilmek.' },
      { text: 'Tanıdığı olana değil, işini gösterene.', say: 'Tanıdığı olana değil, işini gösterene; herkese aynı kuralla.' },
    ],
  },
  cozum: {
    sec: 23,
    key: 'Kurum gerçek bir case verir; gençler işleriyle ölçülür; en uyumlusu onu deneme projesinde gerçekten çözer.',
    beats: [
      { text: 'Kurumun gerçek derdi, gencin gerçek işiyle buluşur.', say: 'Çözümümüz tek cümle: kurum gerçek bir case verir, genç onu gerçekten çözer.' },
      { text: 'Genç işini bağlar, deneyimi ölçülür.', say: 'Genç işini bağlar: kod, tasarım, video ya da yazı. Doğrulanan her iş deneyim puanı olur.' },
      { text: 'Kurum case’ini yazar, en uyumlu genç çözer.', say: 'Kurum case’ini kendi sözleriyle yazar, Niri ölçülebilir yapar; en uyumlu genç deneme projesinde çözer. Filmde görelim.' },
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
    sec: 15,
    key: 'Bugün çalışan dört cevap, dört problemi kapatıyor.',
    beats: [
      { text: 'Dört problem, dört cevap.', say: 'Bunlar bugün sitede çalışıyor.' },
      { text: 'Yıl değil iş; isim değil kanıt.', say: 'Deneyim yılı yerine işi ölçen merdiven, isim yerine isimsiz ilk temas, muğlak ilan yerine netlik eşiği, ilk iş yerine kurum onaylı deneme projesi.' },
    ],
  },
  'yol-guven': {
    sec: 19,
    key: 'Sırada güven: kurum doğrulama, adil deneme, canlı savunma.',
    beats: [
      { text: 'Sırada güven var.', say: 'Çalışmamız gereken alanlar; önce güven.' },
      { text: 'Kurum da doğrulanmalı, deneme adil olmalı.', say: 'Kurumun ihtiyacı gerçek mi diye alan adıyla doğrulama ve pilota dönüşme oranı; deneme projesi ucuz emeğe dönmesin diye ücretli, gönüllü ya da kredili etiketi; yazarlık için kısa bir canlı savunma.' },
    ],
  },
  'yol-olcek': {
    sec: 15,
    key: 'Sırada ölçek: kalıcı hesaplar, usta rolü, taşınabilir kanıt.',
    beats: [
      { text: 'Sonra ölçek.', say: 'Sonra ölçeğe hazırlanıyoruz.' },
      { text: 'Usta ile çırak arasında köprü.', say: 'Kalıcı hesaplar ve veritabanı; kurumdan bağımsız bir usta rolü: profesyonel gence yol gösterir ve işini onaylar; kanıt Open Badges ile gencin olur.' },
    ],
  },
  pilot: {
    sec: 18,
    key: 'Tek ölçüt: kayıttan ilk onaylanmış işe kaç gün.',
    beats: [
      { text: 'Bunu birlikte ölçelim.', say: 'Bunu bir kez gerçek kurumlarla ölçmek istiyoruz: Zemin360’tan 2–3 kurum, GİRVAK ağından 20–30 genç.' },
      { text: 'Kayıttan ilk onaylı işe kaç gün?', say: 'Ölçeceğimiz tek şey: gencin kayıttan ilk onaylanmış işine kaç günde geldiği. Hedef rakam koymuyoruz, önce taban çizgisi.' },
    ],
  },
  kapanis: {
    sec: 14,
    key: 'Çağrı: ilk ihtiyaç turunu birlikte ölçmek.',
    beats: [
      { text: 'Zirvedeyim! İlk noktayı birlikte koyalım.', say: 'Zemin360’taki bir kurumun gerçek ihtiyacı, bir gencin ilk imzalı deneyimi olabilir. İlk turu birlikte ölçelim.' },
      { text: 'Her çaban haritada bir nokta. Teşekkürler!', say: 'Her çaban haritada bir nokta. Teşekkürler.' },
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
