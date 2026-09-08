import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';
import { redirects } from '../src/data/redirects.mjs';
async function walk(dir) {
  const entries = await readdir(dir, {withFileTypes:true});
  return (await Promise.all(entries.map(e => e.isDirectory() ? walk(join(dir,e.name)) : join(dir,e.name)))).flat();
}
const files = await walk('dist');
const htmlFiles = files.filter(f=>f.endsWith('.html'));
let links = 0;
for (const file of htmlFiles) {
  const html = await readFile(file,'utf8');
  assert.ok(!/gamstop|casino|gambling|wp-content|wp-includes|butserixlegion\.com/i.test(html), `Unwanted old-site content in ${file}`);
  assert.ok(!/<script\b(?![^>]*type="application\/ld\+json")/i.test(html), `Unexpected browser script in ${file}`);
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
    const value = match[1].replace(/&amp;/g,'&');
    if (!value.startsWith('/') || value.startsWith('//')) continue;
      const url = new URL(value, 'https://pinskerharrison.github.io');

      const base = '/butserlegion';
      let pathname = decodeURIComponent(url.pathname);

      // GitHub Pages serves the site under /butserlegion,
      // but that prefix does not exist inside dist/.
      if (pathname === base) {
        pathname = '/';
      } else if (pathname.startsWith(base + '/')) {
        pathname = pathname.slice(base.length);
      }

      const local = resolve('dist', '.' + pathname);
      const target = pathname.endsWith('/') ? join(local, 'index.html') : local;
    try { assert.ok((await stat(target)).isFile()); } catch { throw new Error(`Broken internal link: ${file} → ${value}`); }
    links++;
  }
  for (const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
  if (!html.includes('http-equiv="refresh"')) {
    assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1, `One h1 required: ${file}`);
    assert.ok(html.includes('rel="canonical"'), `Canonical missing: ${file}`);
    for (const image of html.matchAll(/<img\b[^>]*>/g)) {
      assert.ok(/alt="[^"]+"/.test(image[0]), `Missing image description: ${file}`);
      assert.ok(/width="\d+"/.test(image[0]) && /height="\d+"/.test(image[0]), `Image dimensions missing: ${file}`);
    }
  }
}
for (const [from,to] of Object.entries(redirects)) {
  const html = await readFile(join('dist',from,'index.html'),'utf8');
  assert.ok(html.includes(to), `Redirect target missing: ${from}`);
}
assert.equal((await readFile('dist/CNAME','utf8')).trim(),'butserlegion.co.uk');
assert.ok(files.some(f=>f.endsWith('sitemap-index.xml')));
console.log(`Verified ${htmlFiles.length} HTML files, ${links} internal links/assets, redirects, metadata, image dimensions and clean static output.`);
