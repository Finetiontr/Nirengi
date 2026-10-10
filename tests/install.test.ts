// Installing the app (src/lib/install.ts): which way each browser installs, from its user agent
// and what it has offered, so the key raises a real prompt or shows the right steps.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installWay } from '../src/lib/install.ts';

const UA = {
  androidChrome: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36',
  iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  ipad: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
  instagram: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 350.0',
  desktopFirefox: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0',
};
const env = (o: Partial<{ standalone: boolean; installed: boolean; prompt: boolean; touch: boolean }> = {}) => ({ standalone: false, prompt: false, touch: false, ...o });

test('install: the browser’s own prompt wins wherever it is offered', () => {
  assert.equal(installWay(UA.androidChrome, env({ prompt: true, touch: true })), 'prompt');
  assert.equal(installWay(UA.desktopFirefox, env({ prompt: true })), 'prompt');
});

test('install: browsers without a prompt get their own steps', () => {
  assert.equal(installWay(UA.iphone, env({ touch: true })), 'ios');
  assert.equal(installWay(UA.ipad, env({ touch: true })), 'ios', 'iPadOS reports a Mac but has a touch screen');
  assert.equal(installWay(UA.instagram, env({ touch: true, prompt: true })), 'inapp', 'inside another app the page must open in a browser first');
  assert.equal(installWay(UA.androidChrome, env({ touch: true })), 'menu');
  assert.equal(installWay(UA.ipad, env()), 'desktop', 'a Mac without touch is a computer');
});

test('install: from the home screen there is nothing to install', () => {
  assert.equal(installWay(UA.androidChrome, env({ standalone: true, prompt: true })), 'app');
  assert.equal(installWay(UA.androidChrome, env({ installed: true })), 'done');
});
