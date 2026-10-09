# worker/: nirengi-api

NİRENGİ'nin tek sunucu parçası, küçük bir Cloudflare Worker. Site GitHub Pages'te statik çalışır; tarayıcıda
yapılamayan iki işi worker yapar:

- **GitHub'a bağlan:** GitHub'ın verdiği tek kullanımlık kodu token'a çevirmek için uygulamanın gizli anahtarı
  (client secret) gerekir ve GitHub'ın token ucu tarayıcıya CORS izni vermez. Worker bu anahtarı tutar.
- **İhtiyaç taslağı:** kurumun metnini Workers AI'daki açık modele (Gemma 4 26B) okutur. İstem ve JSON şeması
  `draft.ts` içinde sabittir; tarayıcı yalnız metni gönderir. Cevabı site `src/lib/engine/ground.ts` ile
  metne karşı denetler.

Durum tutmaz, veritabanı kullanmaz, kod içinde hesap kimliği yoktur.

| Uç | Ne yapar |
|---|---|
| `GET /` | `{ ok, github, ai }`: GitHub ve Workers AI ayarlı mı |
| `POST /github/token` `{ code }` | `{ token, expiresAt }`. Token yalnız seçilen depoları okur ve birkaç saat geçerlidir. |
| `POST /github/revoke` `{ token }` | Çıkışta token'ı GitHub'da iptal eder. |
| `POST /ai/draft` `{ text }` | `{ draft, model, label }`. Metin 30–2.000 karakter. Kota dolduysa `{ error: 'quota' }`, ziyaretçi sınırı aşıldıysa `429`. |

Yalnız `ALLOWED_ORIGINS` listesindeki siteler çağırabilir (`wrangler.toml`).

## Ücret

Workers AI anahtar istemez; hesabın günlük ücretsiz kotası (10.000 nöron) kullanılır. Bir taslak yaklaşık 28
nöron eder. Hesap **Workers Free** planındaysa kota dolunca istek reddedilir, fatura çıkmaz; site o gün
taslağı kural motoruyla çıkarır. Workers Paid planına geçen bir hesapta kotanın üstü ücretlendirilir.
`DRAFT_LIMIT` ziyaretçi başına dakikada 20 istekle tek bir döngünün kotayı bitirmesini önler.

## Akış

1. Sitede kullanıcı **GitHub'a bağlan**'a basar ve `github.com/apps/nirengi360/installations/new` sayfasına
   gider. Bu, GitHub'ın kendi sayfasıdır.
2. Kullanıcı orada **Only select repositories**'i seçer ve göstermek istediği depoları (özel depolar
   dahil) işaretler.
3. GitHub kullanıcıyı `…/kanit-bagla?code=…&state=…` adresine geri gönderir. Site `state` değerini
   kontrol eder ve kodu `POST /github/token` ucuna yollar.
4. Site token'la `api.github.com/user/installations/…/repositories` adresinden yalnız seçilen depoları
   okur.

GitHub uygulamasının izni yalnız **Metadata: read**'dir. Kodu okuyamaz, hiçbir şeye yazamaz.

## Yapılandırma

| Ad | Nerede | Not |
|---|---|---|
| `GITHUB_CLIENT_ID` | `wrangler.toml` `[vars]` | GitHub uygulamasının açık kimliği; `src/lib/auth.ts` ile aynı olmalı. |
| `GITHUB_CLIENT_SECRET` | `wrangler secret put` | Depoya girmez. |
| `ALLOWED_ORIGINS` | `wrangler.toml` `[vars]` | Virgülle ayrılmış site kökenleri. |
| `AI` | `wrangler.toml` `[ai]` | Workers AI bağlantısı; anahtar gerekmez. |
| `DRAFT_LIMIT` | `wrangler.toml` `[[ratelimits]]` | Ziyaretçi başına sınır. `namespace_id` hesap içi bir etikettir, hesap kimliği değildir. |
| `PUBLIC_API_URL` | GitHub depo değişkeni (Settings → Variables) | Sitenin worker adresi; `pages.yml` derlemeye geçirir. |

## Kurulum ya da başka bir Cloudflare hesabına taşıma

```bash
cd worker
npx wrangler@4 login                                  # hedef hesapla
npx wrangler@4 deploy                                 # → https://nirengi-api.<hesap>.workers.dev
npx wrangler@4 secret put GITHUB_CLIENT_SECRET        # GitHub uygulamasının client secret'ı
gh variable set PUBLIC_API_URL -R Finetiontr/Nirengi -b https://nirengi-api.<hesap>.workers.dev
gh workflow run pages -R Finetiontr/Nirengi           # site yeni adresle yeniden derlenir
```

- Birden çok hesabı olan bir oturumda `CLOUDFLARE_ACCOUNT_ID=<id>` ile hangi hesabın kullanılacağı
  seçilir.
- GitHub uygulamasının ayarları (callback adresleri) hesaba bağlı değildir. Taşımada değişmez, çünkü
  GitHub kullanıcıyı siteye döndürür, worker'a değil.
- Eski hesaptaki worker en son silinir.

## Yerelde deneme

```bash
cd worker
printf 'GITHUB_CLIENT_SECRET=…\n' > .dev.vars         # .gitignore'da
npx wrangler@4 dev --port 8787                        # Workers AI yerelde de uzak çalışır, kotadan düşer
# Kök dizinde: PUBLIC_API_URL=http://127.0.0.1:8787 npm run dev
```

Testler GitHub'a ve modele hiç gitmez: `npm test` (`tests/worker.test.ts`, `tests/ground.test.ts`).
