import { mkdir, writeFile } from 'node:fs/promises';
// Explicitly selected public photographs. Decode/re-encode to discard metadata.
const assets = [
  ['legion-group', 'https://butserlegion.co.uk/wp-content/uploads/2023/08/cropped-Legion-2023-08-27-1-scaled-2.jpg'],
  ['roman-life', 'https://butserlegion.co.uk/wp-content/uploads/2016/11/IMG_1078-Compressed-1024x683.jpg'],
  ['join-the-legion', 'https://butserlegion.co.uk/wp-content/uploads/2016/11/IMG_1099-compressed-1024x683.jpg'],
  ['standard-bearer', 'https://butserlegion.co.uk/wp-content/uploads/2016/11/WillWithAquila-compressed-1024x681.jpg'],
];
await mkdir('src/assets/images', { recursive: true });
const { default: sharp } = await import('sharp');
for (const [name, url] of assets) {
  const r = await fetch(url);
  if (!r.ok || !r.headers.get('content-type')?.startsWith('image/')) throw new Error(`Invalid image: ${url}`);
  const buffer = Buffer.from(await r.arrayBuffer());
  await writeFile(`src/assets/images/${name}.webp`, await sharp(buffer, { limitInputPixels: 30000000 }).resize({ width: 2000, withoutEnlargement: true }).webp({ quality: 85 }).toBuffer());
  console.log(name, url);
}
