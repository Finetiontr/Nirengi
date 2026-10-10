# NİRENGİ: devir-teslim

**Son güncelleme:** 10 Ekim 2026
**Hackathon:** 9–11 Ekim 2026, İstanbul (Zemin360 · GİRVAK + İSTKA + Bilgi Üniversitesi)
**Ödül:** 200.000 TL geliştirme bütçesi + 4 aylık GİRVAK süreci · koşul: açık kaynak web hizmeti

Ürün, mimari, yapay zekâ ve kurulum → `README.md`. Tasarım dili (Pafta) → `DESIGN.md`. Ürün ilkeleri → `PRODUCT.md`.
Sahne akışı → `docs/DEMO.md`. Konuşma metni → `docs/SUNUM-NOTLARI.md`. Pazar ve rakipler → `docs/PAZAR-ANALIZI.md`.
Worker → `worker/README.md`.

## Bugün nerede

- **Canlı:** https://finetiontr.github.io/Nirengi/ (GitHub Pages, `pages.yml`). Tek sunucu parçası `worker/` (Cloudflare
  Worker, ücretsiz plan): GitHub uygulamasının token değişimi ve yapay zekâ taslağı.
- **Genç yüzü:** Bugün, Şimdi şeridi, görevler, lig, topluluk, Saha defteri, analiz. GitHub uygulamasıyla seçilen
  depolar ve DNS TXT ile alan adı doğrulanır.
- **Kurum yüzü:** ihtiyaç sihirbazı (Niri kurumun metnini açık bir modelle okur, `src/lib/engine/ground.ts` metne
  karşı denetler), isimsiz kısa liste, çift onaylı pilot ve SHA-256 zincirli defter, haftalık özet.
- **Telefonda:** nirengi bir PWA. `/uygulama` (QR’ın açtığı sayfa) ve tanıtım sayfası **Uygulamayı yükle** der; ana ekrandan
  ilk açılışta genç/kurum sorulur. `src/sw.js` sayfaları telefonda tutar (yalnız `build:pages`), Android’de paylaş menüsü
  bağlantıyı “Eser ekle”ye getirir. Bildirim ve mağaza sürümü yok.
- **Sunum:** `/sunum`, organizasyonun 12 adımlık akışı, slayt başına az söz; 6. slaytta müzikli tanıtım filmi. Olası soruların kısa cevapları konuşmacı penceresinde, kapanış slaytında.
- **Kontrol:** `npm run typecheck`, `npm test`, `npm run build`, `npm run build:pages`; CI aynılarını çalıştırır.

## Sırada (finalden sonra 4 ay)

1. Kalıcılık: gerçek hesaplar, kurum hesapları, kalıcı veritabanı.
2. Zemin360 ve GİRVAK ağındaki kurumlarla ilk ihtiyaç turu.
3. Kod dışı kanıtlar, Open Badges 3.0 ile taşınabilir kayıt, fon verene pilot raporu.

## Bilinen sınırlar

- Demo verisi tarayıcıda (`localStorage`); tarayıcı ya da cihaz değişince başlangıç verisi yüklenir. Panelden “Sıfırla”.
- GitHub’a ulaşılamazsa `/kanit-bagla` → “Örnek profille devam et” (örnek veri olarak etiketlenir).
- Yüklenen uygulamada yeni sürüm, sayfalar ağdan geldiği için hemen görünür; telefondaki kopya, uygulama tamamen kapanıp
  açılınca yenilenir. QR kodu canlı adrese (`finetiontr.github.io/Nirengi/uygulama`) sabittir; site taşınırsa
  `public/pwa/qr.svg` yeniden üretilir.
- İhtiyaç taslağını açık bir model (Gemma 4, Workers AI) çıkarır. Günlük ücretsiz kota (10.000 nöron, taslak başına
  yaklaşık 28) dolarsa ya da ağ yoksa taslağı kural motoru çıkarır; ücretsiz planda fatura çıkmaz. Ayrıntı: README
  “Yapay zekâ kullanımı”.
