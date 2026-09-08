# Migration inventory — 8 September 2026

## Method

Read the public navigation and legitimate page text, then fetched selected HTML as inert text (no scripts executed). The homepage is visibly compromised with extensive unrelated gambling affiliate paragraphs and outbound links. Only an explicit allowlist of content and image URLs was retained. No WordPress/theme/plugin code, CSS, JavaScript, database, feeds or raw HTML is included in the replacement.

Search-cached `/events/` showed 2025 dates. A direct HTTPS fetch of the live list and individual pages confirmed six 2026 entries. Migration uses the live 2026 programme, not guessed anniversaries of old events. `scripts/audit-source.mjs` is an optional read-only evidence helper; it is not part of any build. Its console output may contain untrusted source text. Do not turn it into an automatic importer.

## Pages

| Original URL | Result | Decision |
| --- | --- | --- |
| `/` | `/` and `/about/` | Retained Roman-life purpose, activities and reconstructed-villa setting; rewrote concise copy and replaced the entire design |
| `/events/` | `/events/`, `/events/archive/` and six detail pages | Retained six current listings; replaced plugin calendar with chronological static rows |
| `/contact-us/` | `/contact/` | Retained organisation email and home venue; corrected Chalton spelling using venue address; HTML redirect |
| `/how-to-join-the-legion/` | `/join/` | Retained welcome to non-soldier interests and membership information; old £20/age terms explicitly require confirmation; HTML redirect |
| `/book-the-legion-for-your-event/` | `/book-the-legion/` | Retained booking invitation and historic example venues; current insurance/risk assessment must be requested; HTML redirect |
| `/visitors-said/` | Same URL | Short anonymous quotation and paraphrased historical feedback; omitted personal details and long repetitive quotes |
| No old gallery navigation item | `/gallery/` | New page using four inspected existing photographs |
| No old privacy page in inspected navigation | `/privacy/` | New notice describing the replacement's actual behaviour |

No additional legitimate top-level pages appeared in the inspected navigation. WordPress archive/category/search/author pages and old plugin views are not treated as content. Old `/events/list/`, `/events/month/` and `/events/today/` lead to the new events list. Historical event URLs beyond the six current records were not exhaustively crawled. Check Search Console for further valuable paths before launch.

## Events

All six advertise **10:00–16:00 local UK time**. The source plugin's JSON-LD used +00:00 even for summer dates; the replacement preserves visible clock times and uses Europe/London offsets for metadata.

| Source under `/event/` | Date | New slug under `/events/` |
| --- | --- | --- |
| `hayling-light-railway/` | 20 Sep 2026 | `hayling-light-railway-2026/` |
| `west-berkshire-museum-andover/` | 3 Oct 2026 | `west-berkshire-museum-2026/` |
| `west-berkshire-museum-andover-schools-event/` | 5 Oct 2026 | `west-berkshire-schools-2026/` |
| `legion-at-butser-ancient-farm-17/` | 17 Oct 2026 | `butser-ancient-farm-2026-10-17/` |
| `legion-at-butser-ancient-farm-18/` | 18 Oct 2026 | `butser-ancient-farm-2026-10-18/` |
| `legion-at-butser-ancient-farm-19/` | 31 Oct 2026 | `butser-ancient-farm-2026-10-31/` |

Every listed source URL has an HTML redirect. The schools event is explicitly prebooked, not a public drop-in. Museum listings are titled “West Berkshire Museum” in the replacement: the original title's “Andover” conflicts with its Newbury address. Both detail pages retain a visible request to confirm location, and the public event summary also flags it. Owner confirmation is required; no location has been independently certified here.

The old site supplies very little event description. Short migration summaries do not promise particular activities, tickets or prices. No sample/fake future events have been published. The initial archive is therefore empty; expired current records will populate it.

## Photographs

Four decoded photographs were visually inspected, re-encoded as WebP with metadata discarded, stored locally and processed into responsive variants by Astro. The former content used another domain for three images; matching same-site upload URLs worked and were used. No hotlinks remain.

| Original path at `https://butserlegion.co.uk` | Local file in `src/assets/images/` | Observed content |
| --- | --- | --- |
| `/wp-content/uploads/2023/08/cropped-Legion-2023-08-27-1-scaled-2.jpg` | `legion-group.webp` | Group outside the villa, including younger members |
| `/wp-content/uploads/2016/11/IMG_1078-Compressed-1024x683.jpg` | `roman-life.webp` | Five members in front of the villa |
| `/wp-content/uploads/2016/11/IMG_1099-compressed-1024x683.jpg` | `join-the-legion.webp` | Two members in Roman dress beside a shield |
| `/wp-content/uploads/2016/11/WillWithAquila-compressed-1024x681.jpg` | `standard-bearer.webp` | Reenactor carrying an eagle standard |

`public/social.jpg` is a social-share crop of the first image. `scripts/migrate-assets.mjs` records the exact allowlist; it is not run during publishing. Existing publication is evidence of provenance, not proof of a transferable license. The owner must confirm photographer rights and consent, especially for younger people, before making the repository public. No general stock/photo license is asserted.

## Discarded

- Injected gambling, betting and casino promotion, unrelated outbound affiliate links and foreign-language spam. None is stored as site content.
- WordPress resources, event-plugin JavaScript/loading images, database material, map embeds, calendar subscription integrations and theme assets.
- Personal contact names/telephone numbers; retained only the published organisation email. No private information was needed.
- Stale statements phrased as current facts: the 2016 booking examples are historical; £20 membership and insurance need current confirmation.
- Unverified 2025 search-cached event listings. Their original pages may be migrated later if the owner wants a historical archive.

## Owner review before cutover

Confirm all six event dates and admission arrangements, resolve the museum location mismatch, confirm current membership fees/ages, insurance and risk assessment arrangements, confirm the public email, and approve photograph rights/consent. Test real CMS access and deployment. Review old indexed URLs using Search Console if available. Configure GitHub, domain and DNS only after this review.

Source pages: [Home](https://butserlegion.co.uk/), [Events](https://butserlegion.co.uk/events/), [Contact](https://butserlegion.co.uk/contact-us/), [Membership](https://butserlegion.co.uk/how-to-join-the-legion/), [Booking](https://butserlegion.co.uk/book-the-legion-for-your-event/), [Visitor feedback](https://butserlegion.co.uk/visitors-said/). The site remains untrusted; these references document provenance only.
