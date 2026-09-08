/** UK calendar dates, independent of the build machine's timezone. */
export function londonToday(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}
/** @param {{startDate: string, endDate?: string}} event */
export function isUpcoming(event, today = londonToday()) {
  return (event.endDate || event.startDate) >= today;
}
/** @template {{data: {startDate: string, startTime: string, endDate?: string}}} T @param {T[]} entries */
export function sortEvents(entries) {
  return [...entries].sort((a, b) => `${a.data.startDate}T${a.data.startTime}`.localeCompare(`${b.data.startDate}T${b.data.startTime}`));
}
/** @param {string} day @param {Intl.DateTimeFormatOptions} [options] */
export function formatDate(day, options = { day: 'numeric', month: 'long', year: 'numeric' }) {
  return new Intl.DateTimeFormat('en-GB', { ...options, timeZone: 'UTC' }).format(new Date(`${day}T12:00:00Z`));
}
/** Preserve advertised wall-clock times; WordPress incorrectly labels summer times +00:00. */
export function londonDateTime(day, time) {
  const noon = new Date(`${day}T12:00:00Z`);
  const zone = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', timeZoneName: 'shortOffset' }).formatToParts(noon).find(p => p.type === 'timeZoneName')?.value;
  return `${day}T${time}:00${zone === 'GMT+1' ? '+01:00' : '+00:00'}`;
}
