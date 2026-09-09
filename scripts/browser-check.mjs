import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import config from '../astro.config.mjs';
const base = (config.base || '').replace(/\/$/, '');
const origin = process.env.PREVIEW_ORIGIN || 'http://127.0.0.1:4321';
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true });
const routes = ['/', '/events/', '/events/hayling-light-railway-2026/', '/about/', '/join/', '/gallery/', '/contact/', '/book-the-legion/', '/events/archive/', '/visitors-said/', '/privacy/', '/404.html'];
const results = [];
await mkdir('artifacts', {recursive:true});
try {
  for (const width of [1440, 1200, 1024, 768, 700, 390, 320]) {
    const context = await browser.newContext({ viewport:{width,height:1000}, reducedMotion:'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e=>errors.push(e.message));
    for (const route of routes) {
      const response = await page.goto(`${origin}${base}${route}`);
      assert.ok(response.status() < 400 || route === '/404.html', route);
      await page.evaluate(()=>document.fonts.ready);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth), `Overflow ${width} ${route}`);
      // Lazy images are not broken just because they are below the viewport.
      for (const img of await page.locator('img').all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(img => img.decode());
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      assert.ok(await page.locator('img').evaluateAll(imgs => imgs.every(i=>i.complete && i.naturalWidth>0)), `Broken image ${route}`);
      const headerPaths = await page.locator('header nav a').evaluateAll(links => [...new Set(links.map(link => new URL(link.href).pathname))]);
      for (const path of routes.filter(path => !path.includes('hayling') && path !== '/404.html')) assert.ok(headerPaths.includes(`${base}${path}`), `Missing header link: ${path}`);
      if (route !== '/404.html') {
        const visibleNav = width > 1150 ? '.header-navigation' : '.mobile-menu';
        assert.equal(await page.locator(`${visibleNav} [aria-current="page"]`).count(), 1, `Current page: ${route}`);
        if (route !== '/') assert.equal(await page.locator(`${visibleNav} a[href="${base}/"][aria-current]`).count(), 0);
      }
      if (route === '/' && width <= 760) {
        const photo = await page.locator('.hero-photo img').evaluate(img => ({width:img.clientWidth,height:img.clientHeight,ratio:img.naturalWidth/img.naturalHeight}));
        assert.ok(Math.abs(photo.width/photo.height-photo.ratio)<0.01, `Cropped cover photo at ${width}px`);
      }
      if (width === 1440 || width === 390) {
        const axe = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
        results.push({width,route,violations:axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))});
        if (['/','/events/','/events/hayling-light-railway-2026/','/join/','/gallery/'].includes(route)) await page.screenshot({path:`artifacts/${width}-${route === '/' ? 'home' : route.split('/').filter(Boolean).join('-')}.png`,fullPage:true});
      }
    }
    assert.deepEqual(errors,[]);
    await context.close();
  }
  const context = await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page = await context.newPage();
  await page.goto(`${origin}${base}/`);
  await page.locator('.mobile-menu summary').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.mobile-menu').getAttribute('open'),'');
  await page.locator('.mobile-menu nav').getByRole('link',{name:'Events',exact:true}).click();
  assert.match(page.url(),/\/events\/$/);
  await page.locator('.event-info h3 a').first().click();
  assert.match(page.url(),/hayling-light-railway/);
  await context.close();
  await writeFile('artifacts/browser-results.json',JSON.stringify(results,null,2));
  const violations=results.flatMap(r=>r.violations.map(v=>({...v,width:r.width,route:r.route})));
  assert.deepEqual(violations,[],JSON.stringify(violations,null,2));
  console.log(`Passed: ${routes.length} routes at 7 widths, ${results.length} axe scans, all header links, active navigation, uncropped mobile cover, loaded images, no overflow, no browser errors, keyboard menu and event navigation with JavaScript disabled.`);
} finally { await browser.close(); }
