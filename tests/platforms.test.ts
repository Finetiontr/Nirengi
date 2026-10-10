// Profile links from any field (src/lib/platforms.ts): what a pasted address becomes, which
// network it belongs to, and what is refused before it can reach a profile page.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isProfile, normalizeUrl, platformOf, shortUrl, withProfile } from '../src/lib/platforms.ts';
import { slugify } from '../src/lib/format.ts';
import { skillsInText } from '../src/lib/skills.ts';

test('platforms: a pasted address becomes a clean https link', () => {
  assert.equal(normalizeUrl('  behance.net/defne/ '), 'https://behance.net/defne');
  assert.equal(normalizeUrl('https://www.linkedin.com/in/ece/#about'), 'https://www.linkedin.com/in/ece');
  assert.equal(normalizeUrl('http://ornek.dev'), 'http://ornek.dev');
});

test('platforms: only web links are kept, never script or credentials', () => {
  assert.equal(normalizeUrl('javascript:alert(1)'), null);
  assert.equal(normalizeUrl('data:text/html,<b>x</b>'), null);
  assert.equal(normalizeUrl('ftp://ornek.dev'), null);
  assert.equal(normalizeUrl('https://kullanici:parola@ornek.dev'), null);
  assert.equal(normalizeUrl('localhost:3000'), null, 'a host needs a dot');
  assert.equal(normalizeUrl('benim sitem'), null);
  assert.equal(normalizeUrl(''), null);
});

test('platforms: the network is read from the host, subdomains included', () => {
  assert.equal(platformOf('https://www.linkedin.com/in/ece'), 'linkedin');
  assert.equal(platformOf('https://tr.linkedin.com/in/ece'), 'linkedin');
  assert.equal(platformOf('https://eceyildiz.artstation.com'), 'artstation');
  assert.equal(platformOf('https://youtu.be/abc'), 'youtube');
  assert.equal(platformOf('https://bulten.substack.com'), 'substack');
  assert.equal(platformOf('https://notlinkedin.com/in/x'), 'web', 'a look-alike host is not the network');
  assert.equal(platformOf('https://ornek.dev'), 'web');
});

test('platforms: a profile must point at someone, not at the network itself', () => {
  assert.ok(isProfile('https://www.linkedin.com/in/ece'));
  assert.ok(!isProfile('https://www.linkedin.com/in'));
  assert.ok(!isProfile('https://linkedin.com'));
  assert.ok(isProfile('https://www.youtube.com/@eceyildizanim'));
  assert.ok(!isProfile('https://www.youtube.com/@'));
  assert.ok(isProfile('https://ornek.dev'), 'a site of one’s own is a profile');
});

test('platforms: one entry per address, LinkedIn and the suggested networks first', () => {
  let list = withProfile([], 'https://ornek.dev');
  list = withProfile(list, 'https://www.artstation.com/ece');
  list = withProfile(list, 'https://www.linkedin.com/in/ece');
  list = withProfile(list, 'https://www.linkedin.com/in/ece');
  assert.deepEqual(
    list.map((p) => p.platform),
    ['linkedin', 'artstation', 'web'],
  );
  assert.equal(shortUrl('https://www.linkedin.com/in/ece'), 'linkedin.com/in/ece');
});

test('platforms: a Turkish name becomes a profile address', () => {
  assert.equal(slugify('Ece Yıldız'), 'ece-yildiz');
  assert.equal(slugify('  Şule Çağlar Öztürk  '), 'sule-caglar-ozturk');
  assert.equal(slugify('İ.'), 'i');
});

test('skills: work outside software is read from the text too', () => {
  assert.deepEqual(skillsInText('Çocuk kitabı için karakter tasarımı ve animasyon'), ['illustration', 'animation']);
  assert.deepEqual(skillsInText('Belgeselin altyazı çevirisi'), ['translation']);
  assert.ok(!skillsInText('Okul kurgusu üzerine bir deneme').includes('video'), 'a loose word is not a skill');
});
