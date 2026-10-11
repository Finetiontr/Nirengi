// Writes the talk as Markdown from src/components/sunum/notes.ts (the slide titles and which
// pages are appendix come from the SLIDES list in slides.tsx, how long each bubble stays from
// timing.ts): docs/SUNUM-NOTLARI.md, plus a copy for every --out path (the printed notes beside
// the exported deck).
//
//   node scripts/sunum-export/notes-md.mjs [--out <file.md> ...]
// Needs Node 23.6+ (reads notes.ts directly).

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const { NOTES, QA } = await import(pathToFileURL(join(repo, 'src/components/sunum/notes.ts')).href);
const { beatSec } = await import(pathToFileURL(join(repo, 'src/components/sunum/timing.ts')).href);

// Titles in deck order, read from the SLIDES list (plain object literals, one per line).
const src = readFileSync(join(repo, 'src/components/sunum/slides.tsx'), 'utf8');
const list = src.slice(src.indexOf('export const SLIDES'));
const slides = [...list.matchAll(/\{ id: '([^']+)', title: '([^']+)',(.*)View: \w+ \},/g)].map(([, id, title, rest]) => ({ id, title, extra: rest.includes('extra: true') }));
for (const s of slides) if (!NOTES[s.id]) throw new Error(`no notes for ${s.id}`);

const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const sec = (s) => `${s.toFixed(1).replace('.', ',')} sn`;
const talk = slides.filter((s) => !s.extra);
const film = talk.find((s) => NOTES[s.id].beats.some((b) => b.at !== undefined));
const total = talk.reduce((t, s) => t + NOTES[s.id].sec, 0);
const filmSec = film ? NOTES[film.id].sec : 0;

const out = [];
out.push('# Sunum notları', '');
out.push(`*Zemin360 finali · ${talk.length} slayt · planlanan süre ${mmss(total)} (film ${mmss(filmSec)}, konuşma ${mmss(total - filmSec)})*`, '');
out.push(
  'Bu dosya `src/components/sunum/notes.ts` dosyasından `node scripts/sunum-export/notes-md.mjs` ile üretildi; notları orada düzeltin. Niri sessizdir; konuşan ekiptir. Her slaytta Niri’nin iki ya da üç kısa balonu var: her balon, konuşmacının sıradaki cümlesinin başlığı. Balonlar kendiliğinden ilerler: her biri, altındaki cümleyi sakin bir hızla söylemek için gereken süre (saniyede yaklaşık 14 harf) ve kısa bir nefes boyunca kalır; slaytın son balonundan sonra Niri bekler. Konuşmacılar yalnız sayfa değiştirir: **→** (ya da boşluk, tıklama) sıradaki sayfa, **←** önceki sayfa, **P** balonları (film slaytında filmi) duraklatır ve devam ettirir. Her slaytın bir kritik noktası var: jürinin o slayttan aklında tutması gereken tek cümle. Konuşmacı penceresi (**N** ya da `/sunum?notlar`) her balonun altında söylenecekleri ve balonun kalma süresini, sahnedekini çerçeveli gösterir ve saati plana göre tutar; **R** süreyi sıfırlar.',
  '',
);
out.push(
  `Konuşma organizasyonun önerdiği on iki adımı izler ve beş dakikaya sığar. Omurgası tek bir fikir: kurum gerçek bir case verir, gençler doğrulanmış işleriyle bu case’e göre isimsiz ölçülür, en uyumlusu onu küçük bir deneme projesinde gerçekten çözer ve onaylanan iş profiline imzalı deneyim olarak döner. Deneyimi ölçülebilir bir değere dönüştürüyoruz: ürünün ekranlarında XP diye yazan puan, sunumda deneyim puanı diye anılır ve yalnız gerçek işten gelir. Gençler her alandan: yazılımcı, tasarımcı, animasyoncu, çevirmen. Kurum adayları isimsiz görür; referans ya da tanıdık puana girmez. Altıncı slayt canlı demo olarak ${mmss(filmSec - 1)} süren filmi oynatır: önce gencin, sonra kurumun gözünden; müzik kısık çalar, konuşmacı üstüne konuşur. Kapanıştan sonra konuşmanın dışında ek sayfalar var; soru gelince açılır, orada balon kendiliğinden ilerlemez. Kısa cevaplar aşağıda ve kapanıştan itibaren konuşmacı penceresinde.`,
  '',
);
out.push(
  'Planlanan süreler cümlelerin uzunluğundan hesaplanır (`src/components/sunum/timing.ts`): Niri’nin slayta dönüşü, cümleler saniyede 14 harfle ve aralarında 0,6 saniyelik nefes, bir de tuşa basma. Slaytlardaki her sayı `docs/PAZAR-ANALIZI.md` içindeki kaynağıyla birlikte slaytın üzerinde yazar ya da ürünün kendi kodundan gelir (deneyim puanı tablosu, uyum ağırlıkları, kanıt düzeylerinin ağırlığı, yayın eşiği); yapay zekâ slaytlarındaki sonuçları ürünün kendi kodu, gerçek bir model cevabıyla hesaplar. Planlar plan olarak etiketli; kullanıcı, pilot ya da gelir rakamı yok.',
  '',
);

const beats = (n) => {
  if (n.lead) out.push(n.lead, '');
  for (const b of n.beats) {
    if (b.at !== undefined) out.push(`- **${mmss(b.at)} · Filmde:** “${b.text}”  `, `  ${b.say}`);
    else if (n.sec) out.push(`- **Balon:** “${b.text}” *(${sec(beatSec(b.say))})*  `, `  Söyle: ${b.say}`);
    else out.push(`- **Balon:** “${b.text}”  `, `  Cevap: ${b.say}`);
  }
  out.push('');
};

let t = 0;
talk.forEach((s, k) => {
  const n = NOTES[s.id];
  out.push(`## ${k + 1}. ${s.title}`, '', `*${mmss(t)} – ${mmss(t + n.sec)}*`, '');
  if (n.key) out.push(`**Kritik nokta:** ${n.key}`, '');
  beats(n);
  t += n.sec;
});

out.push('## Ek sayfalar (konuşmanın dışında)', '');
slides
  .filter((s) => s.extra)
  .forEach((s, k) => {
    const n = NOTES[s.id];
    out.push(`### Ek ${k + 1}. ${s.title}`, '');
    if (n.key) out.push(`**Kritik nokta:** ${n.key}`, '');
    beats(n);
  });

out.push('## Soru gelirse', '');
for (const a of QA) {
  out.push(`### ${a.q}`, '');
  for (const line of a.say) out.push(`- ${line}`);
  out.push('');
}

const md = out.join('\n').replace(/\n+$/, '\n');
const targets = [join(repo, 'docs/SUNUM-NOTLARI.md')];
for (let k = process.argv.indexOf('--out'); k > 0; k = process.argv.indexOf('--out', k + 1)) targets.push(resolve(process.argv[k + 1]));
for (const f of targets) {
  writeFileSync(f, md);
  console.log(f);
}
