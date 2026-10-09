# worker/: nirengi-api

NİRENGİ'nin tek sunucu parçası, küçük bir Cloudflare Worker. Site GitHub Pages'te statik çalışır. Ancak
"GitHub'a bağlan" akışında GitHub'ın verdiği tek kullanımlık kodu token'a çevirmek için uygulamanın gizli
anahtarı (client secret) gerekir ve GitHub'ın token ucu tarayıcıya CORS izni vermez. Worker bu anahtarı
tutar ve yalnız bu işi yapar. Durum tutmaz, veritabanı kullanmaz, kod içinde hesap kimliği yoktur.

| Uç | Ne yapar |
|---|---|
| `GET /` | `{ ok, github }`: GitHub ayarlı mı |
| `POST /github/token` `{ code }` | `{ token, expiresAt }`. Token yalnız seçilen depoları okur ve birkaç saat geçerlidir. |
| `POST /github/revoke` `{ token }` | Çıkışta token'ı GitHub'da iptal eder. |

Yalnız `ALLOWED_ORIGINS` listesindeki siteler çağırabilir (`wrangler.toml`).

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
npx wrangler@4 dev --port 8787
# Kök dizinde: PUBLIC_API_URL=http://127.0.0.1:8787 npm run dev
```

Testler GitHub'a hiç gitmez: `npm test` (`tests/worker.test.ts`).
