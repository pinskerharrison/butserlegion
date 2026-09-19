import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const optional = <T extends z.ZodType>(schema: T) => z.preprocess(v => v === '' || v === null ? undefined : v, schema.optional());
const date = z.preprocess(value => value instanceof Date ? value.toISOString().slice(0, 10) : value, z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v => !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v, 'Enter a real calendar date.'));
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use 24-hour time, for example 10:00.');
const latitude = optional(z.coerce.number().gte(-90).lte(90));
const longitude = optional(z.coerce.number().gte(-180).lte(180));
const mapLocationMode = z.enum(['automatic', 'manual', 'none']).default('automatic');
const localImage = z.string().regex(/^\/src\/assets\/images\/[a-zA-Z0-9_./-]+\.(webp|png|jpe?g|avif)$/).refine(v => !v.includes('..'), 'Select a local image.');
const external = z.url({ protocol: /^https$/ });
const events = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string().min(1), slug: optional(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)),
    startDate: date, endDate: optional(date), startTime: time, endTime: optional(time),
    venue: z.string().min(1), address: z.string().min(1), mapLocationMode, latitude, longitude, geocodedAddress: optional(z.string()), summary: z.string().min(1),
    image: optional(localImage), imageAlt: optional(z.string()), externalUrl: optional(external),
    featured: z.boolean().default(false), cancelled: z.boolean().default(false),
  }).superRefine((event, ctx) => {
    if (event.endDate && event.endDate < event.startDate) ctx.addIssue({ code: 'custom', path: ['endDate'], message: 'End date must not precede start date.' });
    if ((!event.endDate || event.endDate === event.startDate) && event.endTime && event.endTime <= event.startTime) ctx.addIssue({ code: 'custom', path: ['endTime'], message: 'End time must follow start time. For overnight events set an end date.' });
    if (event.image && !event.imageAlt?.trim()) ctx.addIssue({ code: 'custom', path: ['imageAlt'], message: 'Describe the event image.' });
    if ((event.latitude === undefined) !== (event.longitude === undefined)) ctx.addIssue({ code: 'custom', path: ['latitude'], message: 'Enter both map coordinates, or leave both blank for a private location.' });
    if (event.mapLocationMode === 'manual' && event.latitude === undefined) ctx.addIssue({ code: 'custom', path: ['latitude'], message: 'A manual map pin needs both coordinates.' });
    if (event.mapLocationMode === 'none' && event.latitude !== undefined) ctx.addIssue({ code: 'custom', path: ['mapLocationMode'], message: 'Remove the coordinates when no map should be published.' });
  }),
});
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string().min(1), description: z.string().min(1), intro: z.string().min(1),
    image: optional(localImage), imageAlt: optional(z.string()), ctaText: optional(z.string()),
  }).refine(p => !p.image || !!p.imageAlt?.trim(), { message: 'Describe the page image.', path: ['imageAlt'] }),
});
const settings = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/settings' }),
  schema: z.object({ email: z.email(), venue: z.string(), address: z.string(), venueUrl: external }),
});
const gallery = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/gallery' }),
  schema: z.object({ title: z.string(), image: localImage, imageAlt: z.string().min(1), order: z.number().int() }),
});
export const collections = { events, pages, settings, gallery };
