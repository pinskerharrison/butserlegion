import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseDocument } from 'yaml';

const writeChanges = process.argv.includes('--write');
const directory = 'src/content/events';
const files = (await readdir(directory)).filter(file => file.endsWith('.md')).sort();
let changes = 0;

for (const file of files) {
  const path = join(directory, file);
  const source = await readFile(path, 'utf8');
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`${file}: expected YAML frontmatter.`);

  const document = parseDocument(match[1]);
  if (document.errors.length) throw new Error(`${file}: invalid YAML frontmatter.`);
  const event = document.toJS();
  const mode = event.mapLocationMode ?? 'automatic';
  const latitude = Number(event.latitude);
  const longitude = Number(event.longitude);
  const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);

  if (mode === 'none') {
    if (hasCoordinates) throw new Error(`${file}: no-map events must not contain coordinates.`);
    continue;
  }
  if (mode === 'manual') {
    if (!hasCoordinates) throw new Error(`${file}: manual map pins need latitude and longitude.`);
    continue;
  }
  if (mode !== 'automatic') throw new Error(`${file}: mapLocationMode must be automatic, manual or none.`);
  if (!event.address?.trim() || !event.venue?.trim()) throw new Error(`${file}: an automatic map needs a venue and public address.`);
  if (hasCoordinates && event.geocodedAddress === event.address) continue;

  const query = new URLSearchParams({ q: `${event.venue}, ${event.address}, United Kingdom`, format: 'jsonv2', limit: '1', addressdetails: '1' });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${query}`, { headers: { 'User-Agent': 'ButserIXLegionEventMap/1.0 (+https://butserlegion.co.uk)' } });
  if (!response.ok) throw new Error(`${file}: address validation service returned ${response.status}.`);
  const [place] = await response.json();
  const resolvedLatitude = Number(place?.lat);
  const resolvedLongitude = Number(place?.lon);
  if (!Number.isFinite(resolvedLatitude) || !Number.isFinite(resolvedLongitude)) throw new Error(`${file}: the public address could not be validated. Use a fuller address, choose a manual pin, or select no map.`);

  document.set('latitude', Number(resolvedLatitude.toFixed(6)));
  document.set('longitude', Number(resolvedLongitude.toFixed(6)));
  document.set('geocodedAddress', event.address);
  const output = `---\n${String(document).trimEnd()}\n---\n${match[2]}`;
  changes++;
  if (writeChanges) await writeFile(path, output);
  console.log(`${writeChanges ? 'Validated and saved' : 'Would validate'} ${file}: ${place.display_name}`);
}

console.log(changes ? `${changes} event map location${changes === 1 ? '' : 's'} ${writeChanges ? 'updated' : 'need updating'}.` : 'Event map locations are already validated.');
