import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true });
const routes = ['/', '/events/', '/events/hayling-light-railway-2026/', '/about/', '/join/', '/gallery/', '/contact/', '/book-the-legion/', '/events/archive/', '/visitors-said/', '/privacy/', '/404.html'];
const results = [];
await mkdir('artifacts', {recursive:true});
try {
  for (const width of [1440, 390, 768, 320]) {
    const context = await browser.newContext({ viewport:{width,height:1000}, reducedMotion:'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e=>errors.push(e.message));
    for (const route of routes) {
      const response = await page.goto(`http://127.0.0.1:4321${route}`);
      assert.ok(response.status() < 400 || route === '/404.html', route);
      await page.evaluate(()=>document.fonts.ready);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth), `Overflow ${width} ${route}`);
      assert.ok(await page.locator('img').evaluateAll(imgs => imgs.every(i=>i.complete && i.naturalWidth>0)), `Broken image ${route}`);
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
  await page.goto('http://127.0.0.1:4321/');
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
  console.log(`Passed: ${routes.length} routes at 4 widths, ${results.length} axe scans, loaded images, no overflow, no browser errors, keyboard menu and event navigation with JavaScript disabled.`);
} finally { await browser.close(); }
