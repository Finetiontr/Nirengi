// Speaker notes, keyed by slide id: what the team says while Niri says one line.
// Shown in the presenter window (N on the deck, or /sunum?notlar) and mirrored in
// docs/SUNUM-NOTLARI.md. Plain data so a script can read it without React.
// Every number here is on the slide or in docs/PAZAR-ANALIZI.md with its source.

export interface Note {
  /** Suggested speaking time in seconds. */
  sec: number;
  say: string[];
}

export const NOTES: Record<string, Note> = {
  baslik: {
    sec: 20,
    say: [
      'Merhaba, biz Nirengi ekibiyiz: Sezer Uzun ve Emirhan Açık.',
      'Nirengi noktası, haritacılıkta üzerine güvenle ölçüm yapılan sabit referanstır. Biz gençlerin işi için o referansı kuruyoruz.',
      'Tek cümle: gençlerin doğrulanmış işini kurumların ihtiyaçlarıyla buluşturan açık kaynak altyapı.',
    ],
  },
  problem: {
    sec: 40,
    say: [
      'Döngüyü hepimiz biliyoruz: deneyim yoksa iş yok, iş yoksa deneyim yok.',
      'Genç tarafı: 15–24 yaşta her 100 gençten 23’ü ne eğitimde ne istihdamda (TÜİK, 2025). 2024’te AB ülkeleriyle kıyaslandığında en yüksek oran bizde.',
      'Genç işsizliği %13; genç kadınlarda %19,4 (TÜİK, Ağustos 2026).',
      'Kurum tarafı: BİT uzmanı almakta zorlanan girişimlerin %71’i “ilgili iş deneyimi yok” diyor. 10–49 çalışanlı girişimlerin yalnızca %10,8’inde BİT uzmanı var.',
      'Kısacası genç görünmüyor, kurum da kime güveneceğini bilemiyor.',
    ],
  },
  'neden-simdi': {
    sec: 35,
    say: [
      'Şubat 2024: diploma şartını kaldıran şirketlerde bile gerçekten değişen işe alım 700’de 1’den az. Niyet var, ölçüm aracı yok.',
      'Ocak 2025: Dünya Ekonomik Forumu’na göre işverenlerin dönüşümdeki 1 numaralı engeli beceri açığı, %63.',
      'Ağustos 2025: yapay zekâya en açık mesleklerde 22–25 yaş istihdamı görece %13 düştü; deneyimlilerde düşüş yok. İlk deneyimin kapısı daralıyor.',
      'Bugün: taşınabilir kanıt için açık bir standart (Open Badges 3.0) hazır. Ölçüm aracını kurmanın zamanı.',
    ],
  },
  fark: {
    sec: 30,
    say: [
      'Çözümün tek cümlesi: başka yerlerde XP uygulamanın içinde kalır; Nirengi’de her XP bir iş makbuzudur.',
      'Makbuzu okuyalım: üretim yaptığın gün 10, doğrulanmış kanıt 40, kurum onaylı aşama 120 XP. Günlük tavan 200. Boş tıklama sıfır.',
      'Her satırın arkasında dışarıda kontrol edilebilen bir olay var: birleşmiş bir PR, doğrulanmış bir alan adı ya da bir kurum imzası.',
    ],
  },
  dongu: {
    sec: 30,
    say: [
      'Sistem üç nesneden oluşuyor: Kanıt, İhtiyaç, Pilot.',
      'Kanıtın üç seviyesi var: Beyan, Doğrulandı, Kurum onaylı.',
      'Kurum ilan yazmaz; yedi alanlı kanvasla ihtiyaç yazar. Çözülebilirlik puanı 70’i geçmeden ihtiyaç yayımlanmaz.',
      'Pilot aşamalara bölünür: genç teslim eder, kurum onaylar. Onaylanan aşama gencin profiline Kurum onaylı kanıt olarak döner. Döngü bu.',
    ],
  },
  'iki-yuz': {
    sec: 35,
    say: [
      'Aynı kanıt iki yüzle görünüyor.',
      'Genç için tanıdık bir oyun ritmi: haftalık hedef, seri, lig ve Niri’nin kostümleri. Ama hepsini yalnızca gerçek iş kazandırır.',
      'Eşleşmediğinde nedenini görür: hangi kanıt eksik, hangi görev o eksiği kapatır.',
      'Kurum tarafı sakin: oyun yok, ölçüm var. Şikâyetten ihtiyaca, gerekçeli kısa listeye, küçük bir pilota ve hesap verebilir kayda.',
    ],
  },
  guven: {
    sec: 40,
    say: [
      '“Neden bu aday?” sorusunun cevabı hazır: uyum puanı dört parçadan oluşur ve ağırlıkları açıktır. Kanıt 45, bağlam 20, kapasite 15, iş birliği geçmişi 20 puan.',
      'İlk temasta isim, okul, şehir görünmez. Kurum önce işi görür; kimlik pilot teklifiyle açılır.',
      'Her aşama iki tarafın onayıyla deftere yazılır; kayıtlar SHA-256 ile zincirlenir. Biri geçmişi kurcalarsa zincir kırılır. Bunu demoda göstereceğiz.',
      'Kod açık: her formülü herkes okuyabilir.',
    ],
  },
  demo: {
    sec: 150,
    say: [
      'Sahneye çıkmadan: demo panelinden Sıfırla; solda Kurum, sağda Genç penceresi.',
      'Genç: GitHub hesabını bağla, Kontrol et, kanıt Doğrulandı.',
      'Kurum: /ihtiyaclar/yeni, Örnekle doldur, Taslağa dönüştür; çubuk 70’i geçince Yayımla.',
      'Adaylar: isim yok, iş var. Bir adaya dokun, “Neden bu uyum?”, Pilot teklif et.',
      'Pilot: genç Teslim et, kurum Onayla. Defterde Zinciri doğrula, sonra Kurcalamayı dene: zincir kırılır.',
      'Profil: onaylanan aşama Kurum onaylı kanıt olarak görünür.',
      'Takılırsa yedek: /pilotlar/pl-rota; bir aşama kurum onayı bekliyor.',
      'Demodaki kişiler ve kurumlar kurgusal; GitHub ve DNS doğrulaması gerçek.',
    ],
  },
  pazar: {
    sec: 30,
    say: [
      'Bağımsız bir mikro staj pazar büyüklüğü bulamadık, bu yüzden uydurma bir pazar rakamı göstermiyoruz. Bunun yerine kimden başlayacağımızı söylüyoruz.',
      'İlk tur: Zemin360 ve GİRVAK ağındaki kurumlar ve gençler.',
      'İlk pazar: BİT uzmanı olmayan küçük işletmeler, kamu birimleri, STK’lar. 10–49 çalışanlı girişimlerin yalnızca %10,8’i BİT uzmanı çalıştırıyor.',
      'Ölçek: Türkiye’de 3,93 milyon girişim, %99,6’sı KOBİ (2024).',
      'Genç tarafında talep zaten var: GİRVAK Fellow’a ~1 milyon başvuru, ~1.000 fellow ve mezun. Programa sığmayan gençler de kanıt biriktirebilmeli.',
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
      'Bugün gelirimiz yok, bunu açıkça söylüyoruz. Sürdürülebilirlik için pilotta sınayacağımız dört seçenek var; hiçbiri henüz gelir değil.',
      'Kamu ve vakıf fonları: fonlu gençlik ve istihdam programlarına hazır pilot raporu.',
      'Kalkınma ajansları: bölgesel ihtiyaç turları.',
      'Üniversite kariyer merkezleri: öğrencilerinin doğrulanmış kanıtlarını kendi sistemlerine alması.',
      'Kurum tarafında barındırma ve destek: çekirdek açık ve ücretsiz kalır; kurulum, barındırma ve ihtiyaç turu desteği isteyen kuruma hizmet.',
    ],
  },
  bugun: {
    sec: 25,
    say: [
      'Bu bir hackathon prototipi ve çalışıyor: başvurudaki altı problemin altısı için çalışan ekran var.',
      'GitHub hesap sahipliği ve DNS TXT doğrulaması gerçek servislere gidiyor. Eşleşme, kanvas ve defter motoru otomatik testlerle korunuyor (sahneden önce npm test ile kontrol edin).',
      'Henüz yok: gerçek kullanıcı, kurum ya da pilot. Demo verisi kurgusal ve ekranda öyle yazıyor. Veri şimdilik tarayıcıda.',
      'Bunu saklamıyoruz; ürünün sözü zaten “beyan değil, kanıt”.',
    ],
  },
  olcum: {
    sec: 25,
    say: [
      'Pilotta dört şeyi ölçeceğiz. Hedef rakam koymuyoruz; önce taban çizgisini ölçeceğiz.',
      'Bir: kayıttan ilk doğrulanmış işe kaç gün geçiyor. İki: yayımlanan ihtiyaçların kaçı pilota dönüşüyor.',
      'Üç: pilotlarda çift onaylanan aşamalar ve tamamlanma oranı. Dört: eşleşmeyen gençlerin, eksik geri bildiriminden sonra yeni kanıt ekleme oranı.',
      'Sonuçları da kanıt gibi paylaşacağız: kaynağıyla.',
    ],
  },
  yol: {
    sec: 20,
    say: [
      'Finalden sonraki dört ay: önce kalıcılık, gerçek hesaplar ve kurum hesapları.',
      'Sonra Zemin360 ve GİRVAK ağındaki kurumlarla ilk ihtiyaç turu.',
      'Kod dışı kanıtlar, Open Badges 3.0 ile taşınabilir kayıt ve fon verenler için hazır pilot raporu.',
    ],
  },
  istek: {
    sec: 25,
    say: [
      'Sizden üç şey istiyoruz.',
      'Bir: ilk ihtiyaç turuna katılacak kurumlar. Gerçek bir ihtiyacını kanvasa yazacak bir KOBİ, kamu birimi ya da STK.',
      'İki: mentorluk. Kamu fonlu programların raporlaması, kurum tarafında benimseme ve kişisel veri uyumu.',
      'Üç: pilotu taşıyacak bir kuluçka programı ya da hibe için yönlendirme.',
      'En somut istek: bu salondan bir kurumun gerçek bir ihtiyacı. İlk kanvası birlikte yazalım.',
    ],
  },
  kapanis: {
    sec: 10,
    say: ['Beyan değil, kanıt. Teşekkürler; sorularınızı bekliyoruz.'],
  },
};
