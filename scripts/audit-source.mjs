// Read-only audit helper. Never executes or stores source-site scripts.
const urls = ['/', '/events/', '/event/hayling-light-railway/', '/event/west-berkshire-museum-andover/', '/event/legion-at-butser-ancient-farm-17/', '/event/legion-at-butser-ancient-farm-18/', '/event/legion-at-butser-ancient-farm-19/', '/how-to-join-the-legion/', '/book-the-legion-for-your-event/'];
for (const path of urls) {
  const response = await fetch(new URL(path, 'https://butserlegion.co.uk'));
  const html = await response.text();
  console.log('\nPAGE', path, response.status);
  console.log('IMAGES', [...html.matchAll(/<img[^>]+src=["']([^"']+)/g)].map(m => m[1]));
  console.log('EVENT DATA', [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]));
  if (path !== '/') console.log(html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').slice(0, 18000));
}
