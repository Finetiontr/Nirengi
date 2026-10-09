# nirengi-auth

GitHub ile tek tıkla giriş için küçük bir Cloudflare Worker. GitHub’ın token değişimi
istemci sırrı ister ve CORS vermez; statik site bunu tek başına yapamaz. Worker sırrı
tutar, kodu token’a çevirir ve token’ı siteye URL’nin `#` kısmında geri verir.
Kapsam (scope) istenmez: yalnız herkese açık profil ve depolar okunur.

| Uç | Ne yapar |
|---|---|
| `GET /` | `{ ok, configured }` |
| `GET /login?return=URL` | GitHub onay ekranına gönderir (`return` izinli kökenlerden olmalı) |
| `GET /callback` | `URL#gh_token=…` ya da `URL#gh_error=…` ile siteye döner |
| `POST /logout` | `{ token }` → token’ı GitHub’da iptal eder |

İzinli kökenler `worker.js` içindeki `ALLOWED` listesinde: `https://finetiontr.github.io`
ve yerel `127.0.0.1` / `localhost` (4321, 4399).

## Kurulum

1. `npx wrangler login`, sonra bu klasörde `npx wrangler deploy` → adres
   `https://nirengi-auth.<hesap>.workers.dev`.
2. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App:
   - Application name: `Nirengi`
   - Homepage URL: `https://finetiontr.github.io/Nirengi/`
   - Authorization callback URL: `https://nirengi-auth.<hesap>.workers.dev/callback`
3. Client ID’yi `wrangler.toml` içindeki `GITHUB_CLIENT_ID`’ye yaz; yeni bir client
   secret üretip `npx wrangler secret put GITHUB_CLIENT_SECRET` ile ver; tekrar `npx wrangler deploy`.
4. Sitede `PUBLIC_AUTH_URL` worker adresi olur (`src/lib/auth.ts`).

Yerel deneme: `node auth/test.mjs` (GitHub çağrılmaz) ya da `npx wrangler dev`.
