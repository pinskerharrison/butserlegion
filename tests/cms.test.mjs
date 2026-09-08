import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { parse } from 'yaml';
const config = parse(readFileSync('.pages.yml', 'utf8'));
test('every CMS path and stored field matches real content, including images', () => {
  for (const entry of config.content) {
    assert.ok(existsSync(entry.path), entry.path);
    const files = entry.type === 'collection' ? readdirSync(entry.path).map(f => `${entry.path}/${f}`) : [entry.path];
    const fields = new Set(entry.fields.map(f => f.name));
    for (const file of files) {
      const text = readFileSync(file, 'utf8');
      const data = parse(file.endsWith('.md') ? text.split('---')[1] : text);
      for (const key of Object.keys(data)) assert.ok(fields.has(key), `${file}: no CMS field for ${key}`);
      for (const field of entry.fields.filter(f => f.required && f.name !== 'body')) assert.ok(data[field.name] !== undefined && data[field.name] !== '', `${file}: missing ${field.name}`);
      if (data.image) {
        assert.ok(data.image.startsWith(config.media.output));
        assert.ok(existsSync(data.image.slice(1)), data.image);
        assert.ok(data.imageAlt?.length);
      }
    }
  }
});
test('all required event controls exist with date widgets and image picker', () => {
  const fields = config.content.find(e => e.name === 'events').fields;
  for (const name of ['title','slug','startDate','endDate','startTime','endTime','venue','address','summary','body','image','imageAlt','externalUrl','featured','cancelled']) assert.ok(fields.some(f=>f.name===name), name);
  assert.equal(fields.find(f=>f.name==='startDate').type,'date');
  assert.equal(fields.find(f=>f.name==='image').type,'image');
  assert.equal(fields.find(f=>f.name==='body').type,'rich-text');
});
test('deployment builds main and scheduled updates, with restricted deployment permission', () => {
  const workflow = parse(readFileSync('.github/workflows/deploy.yml','utf8'));
  assert.deepEqual(workflow.on.push.branches,['main']);
  assert.ok(workflow.on.schedule.length);
  assert.ok(Object.hasOwn(workflow.on,'workflow_dispatch'));
  assert.match(workflow.jobs.build.steps[1].with['build-cmd'], /verify/);
  assert.equal(workflow.permissions.contents,'read');
  assert.equal(workflow.jobs.deploy.permissions.pages,'write');
  assert.match(workflow.jobs.deploy.if,/refs\/heads\/main/);
});
