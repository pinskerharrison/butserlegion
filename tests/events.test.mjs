import test from 'node:test';
import assert from 'node:assert/strict';
import { isUpcoming, sortEvents, londonToday, londonDateTime } from '../src/lib/events.mjs';

test('events expire after their final UK calendar day, including multi-day events', () => {
  assert.equal(isUpcoming({startDate:'2026-09-08'}, '2026-09-08'), true);
  assert.equal(isUpcoming({startDate:'2026-09-07'}, '2026-09-08'), false);
  assert.equal(isUpcoming({startDate:'2026-09-07', endDate:'2026-09-09'}, '2026-09-08'), true);
  assert.equal(isUpcoming({startDate:'2026-09-07', endDate:'2026-09-09'}, '2026-09-10'), false);
});
test('UK day boundary and daylight saving are independent of the build timezone', () => {
  assert.equal(londonToday(new Date('2026-09-08T23:05:00Z')), '2026-09-09');
  assert.equal(londonToday(new Date('2026-12-08T23:05:00Z')), '2026-12-08');
  assert.equal(londonDateTime('2026-09-20','10:00'), '2026-09-20T10:00:00+01:00');
  assert.equal(londonDateTime('2026-10-31','10:00'), '2026-10-31T10:00:00+00:00');
});
test('chronological sorting uses start time and does not prioritise featured events', () => {
  const items = [
    {data:{startDate:'2026-10-03', startTime:'10:00', featured:true}},
    {data:{startDate:'2026-09-20', startTime:'14:00'}},
    {data:{startDate:'2026-09-20', startTime:'10:00'}},
  ];
  assert.deepEqual(sortEvents(items), [items[2],items[1],items[0]]);
  assert.equal(items[0].data.startDate, '2026-10-03');
});
