import { mkdir, writeFile } from 'node:fs/promises';
// Reviewed, explicitly enumerated migration. This does not crawl or import raw HTML.
const events = [
  ['hayling-light-railway-2026', 'Hayling Light Railway', '2026-09-20', 'Hayling Seaside Railway', 'Eastoke station, Hayling Island, PO11 9HL', 'Meet the Legion at Hayling Light Railway.', 'https://haylinglightrailway.wixsite.com/ehlr', true],
  ['west-berkshire-museum-2026', 'West Berkshire Museum', '2026-10-03', 'West Berkshire Museum', 'The Wharf, Newbury, Berkshire, RG14 5AS', 'The Legion visits West Berkshire Museum. Please confirm the location before travelling.', 'https://visitnewbury.org.uk/attractions/west-berkshire-museum/', true],
  ['west-berkshire-schools-2026', 'West Berkshire Museum: schools event', '2026-10-05', 'West Berkshire Museum', 'The Wharf, Newbury, Berkshire, RG14 5AS', 'A prebooked schools event only; this is not a public drop-in session.', 'https://visitnewbury.org.uk/attractions/west-berkshire-museum/', false],
  ...['17', '18', '31'].map(day => [`butser-ancient-farm-2026-10-${day}`, 'Legion at Butser Ancient Farm', `2026-10-${day}`, 'Butser Ancient Farm', 'Chalton Lane, Chalton, Waterlooville, Hampshire, PO8 0BG', 'Meet the Butser IX Legion at our home in Hampshire.', 'https://www.butserancientfarm.co.uk/', true]),
];
await mkdir('src/content/events', { recursive: true });
for (const [slug, title, startDate, venue, address, summary, externalUrl, featured] of events) {
  const values = { title, slug, startDate, startTime: '10:00', endTime: '16:00', venue, address, summary, externalUrl, featured, cancelled: false };
  const body = venue === 'West Berkshire Museum'
    ? 'The original listing gives a Newbury venue address but includes “Andover” in its title. Please check the location with the organiser before travelling.\n\n' + (featured ? 'Contact the venue for visitor arrangements and admission.' : 'Attendance is for prebooked schools only. Contact the organiser about arrangements.')
    : 'Visit the venue website for admission, opening information and accessibility details. Check with the organiser before travelling, as arrangements can change.';
  await writeFile(`src/content/events/${slug}.md`, '---\n' + Object.entries(values).map(([k,v]) => `${k}: ${JSON.stringify(v)}`).join('\n') + '\n---\n' + body + '\n');
}
