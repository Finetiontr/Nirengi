# Sahne akışı — 5 dakika

Kenardaki **Demo turu** paneli adımları gerçek durum değişikliklerinden işaretler; genç ve kurum için iki tur vardır. Başlamadan önce panelden **Sıfırla**.

## Hazırlık (sunumdan önce)

- [ ] Canlı adresi aç: https://finetiontr.github.io/Nirengi/ (worker bağlı). Yerel yedek: `PUBLIC_API_URL=<worker adresi> npm run build && npm run preview`; adres verilmezse taslağı kural motoru çıkarır.
- [ ] Kurum penceresinde yapay zekâ taslağını bir kez önceden çalıştır (**Örnekle doldur** → **Taslağa dönüştür**), sonra sihirbazdan kaydetmeden çık. Cevap tarayıcıda saklanır; sahnede ağ yavaş olsa da anında gelir ve ekranda “daha önce verdiği cevap” yazar.
- [ ] Sunumda bağlanacak GitHub hesabında tarayıcıda oturum açık olsun. Nirengi uygulaması o hesaba daha önce kurulduysa GitHub’da **Configure** ile göstereceğin depoları (bir özel depo dahil) hazırla.
- [ ] İki tarayıcı penceresi: solda **Kurum**, sağda **Genç** (sol menüdeki Genç/Kurum seçimi sekme başınadır, veri anında senkronlanır).
- [ ] Sahneden önce `/sunum`’u bir kez aç: tanıtım filmi iki saniye sonra arka planda iner, 6. slaytta beklemeden oynar. Film müziklidir: bilgisayarın sesi salona bağlı olsun ve sunum penceresinde başta bir kez **F**’ye bas ya da tıkla (tarayıcı sesi ancak bir dokunuştan sonra açar; yine sessiz başlarsa filme bir kez tıkla). Film açılmazsa o slayt canlı demo paneline döner; mp4’ün yerel bir kopyası da sunum bilgisayarında dursun.
- [ ] İnternet ya da GitHub sorgu sınırı sorunu olursa: `/kanit-bagla` → **Örnek profille devam et** (örnek veri olarak etiketlenir).

## Akış

| Süre | Ekran | Söylenecek |
|------|-------|------------|
| 0:00 | `/bugun` (Genç) | Haftalık hedef, haftalık seri, sıradaki adım ve yol. “Commit sayısı değil, üretim yaptığın gün sayılır.” |
| 0:40 | `/kanit-bagla` | **GitHub’a bağlan** → GitHub’ın kendi sayfasında **Only select repositories** → depoları seç → **Install** → geri dönüş: “N eserin bulundu”, özel depo “Özel” etiketiyle, hepsi Doğrulandı. “Kod kopyalamadık, anahtar yapıştırmadık; hangi depoyu göstereceğine genç karar verdi.” |
| 1:30 | `/kurum` → `/ihtiyaclar/yeni` (Kurum) | “Sırada ne var” kartı. Sihirbazda **Örnekle doldur** → **Taslağa dönüştür**: Niri metni açık modeliyle okur. **Metninden çıkardıklarım**: yedi alan, her birinin altında metindeki cümlesi. “Uydurmasın diye her alanı metindeki cümleye ve sayıya bağlıyoruz; tutmayanı almıyoruz.” **Eksikleri tamamla** → kriter adımında iki öneriye **Ekle** → netlik 100 → **Özeti gör** → **Yayımla**. |
| 2:30 | `/ihtiyaclar/:id#adaylar` | Kör keşif: isim yok, iş var. Adaya dokun → “Neden bu uyum?” dört parça ve eksikler. **Pilot teklif et** → kimlik açılır. |
| 3:20 | `/pilotlar/:id` | Kriterler aşamalara dönüştü. Genç pencerede **Teslim et**, kurum penceresinde **Onayla** → mühür. Defter: **Zinciri doğrula** → **Kurcalamayı dene** → zincir kırılır. |
| 4:10 | `/profil/:kullanici` | Onaylanan aşama profilde Kurum onaylı kanıt olarak görünür; rozetler ve son 10 hafta. |
| 4:30 | `/gorevler`, `/lig`, `/topluluk`, `/yontem` | Gerçek GitHub “good first issue” görevleri, benzer seviyedeki lig, “İşe yaradı” ile XP kazandıran topluluk. Her sayının kuralı `/yontem`’de. |

## Yedek senaryo

Canlı akış takılırsa: `/pilotlar/pl-rota` hazır bekler; bir aşama kurum onayı bekliyor. Kurum rolünde **Onayla** → `/profil/canaksoy` yeni Kurum onaylı kanıtı gösterir.
