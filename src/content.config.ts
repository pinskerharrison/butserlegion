import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const optional = <T extends z.ZodType>(schema: T) => z.preprocess(v => v === '' || v === null ? undefined : v, schema.optional());
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v => !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v, 'Enter a real calendar date.');
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use 24-hour time, for example 10:00.');
const localImage = z.string().regex(/^\/src\/assets\/images\/[a-zA-Z0-9_./-]+\.(webp|png|jpe?g|avif)$/).refine(v => !v.includes('..'), 'Select a local image.');
const external = z.url({ protocol: /^https$/ });
const events = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string().min(1), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    startDate: date, endDate: optional(date), startTime: time, endTime: optional(time),
    venue: z.string().min(1), address: z.string().min(1), summary: z.string().min(1),
    image: optional(localImage), imageAlt: optional(z.string()), externalUrl: optional(external),
    featured: z.boolean().default(false), cancelled: z.boolean().default(false),
  }).superRefine((event, ctx) => {
    if (event.endDate && event.endDate < event.startDate) ctx.addIssue({ code: 'custom', path: ['endDate'], message: 'End date must not precede start date.' });
    if ((!event.endDate || event.endDate === event.startDate) && event.endTime && event.endTime <= event.startTime) ctx.addIssue({ code: 'custom', path: ['endTime'], message: 'End time must follow start time. For overnight events set an end date.' });
    if (event.image && !event.imageAlt?.trim()) ctx.addIssue({ code: 'custom', path: ['imageAlt'], message: 'Describe the event image.' });
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
