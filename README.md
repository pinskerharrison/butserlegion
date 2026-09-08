# Butser IX Legion

A complete static replacement for the compromised WordPress website, built with Astro and published to GitHub Pages. Editors use the hosted Pages CMS service; the public site has no admin login, database, PHP or server runtime. No browser JavaScript is needed, including for mobile navigation.

## Start locally

Install Node.js 24 LTS and npm, then run from this folder:

```sh
npm ci
npm run dev
```

Open http://localhost:4321. To review the actual production output:

```sh
npm run verify
npm run preview
```

`npm run verify` runs Astro type checks, automated content/calendar/CMS checks, builds all pages and checks the generated internal links, images, redirects and metadata. Build output is in `dist/` and is not committed. The lockfile is committed for reproducible installs. On restricted Windows hosts, the build needs permission to start subprocesses; that is a host permission issue. Set `ASTRO_TELEMETRY_DISABLED=1` if desired.

## Where things live

| Location | Purpose |
| --- | --- |
| `src/content/pages/` | Homepage, About, Join, Booking, Contact and visitor memories, in Markdown |
| `src/content/events/` | One Markdown file per event |
| `src/content/gallery/` | Gallery captions, image descriptions and display order |
| `src/content/settings/contact.yaml` | Shared public email, venue and address |
| `.pages.yml` | Pages CMS forms, image picker and content locations |
| `src/content.config.ts` | Validated Astro Content Collection schemas |
| `src/lib/events.mjs` | UK date handling and event sorting |
| `src/assets/images/` | CMS-managed local photographs, processed by Astro |
| `src/components/Photo.astro` | Responsive images with dimensions and lazy loading |
| `src/pages/`, `src/layouts/`, `src/styles/` | Static routes, shared layout and design |
| `src/data/redirects.mjs` | Explicit old-to-new URL mappings |
| `.github/workflows/deploy.yml` | Validation and GitHub Pages publishing |
| `docs/` | Migration evidence, editing guide and launch instructions |

No credentials, `.env` file or environment variables are required for the site. `private: true` in package.json prevents accidental npm publication; it does not require a private GitHub repository.

## Publishing and editing

The intended production branch is **main**. This newly initialised checkout started on **master**, with no commits or remote; it has deliberately not been committed, pushed or renamed. When ready, create your GitHub repository and make main its default branch before enabling deployment. Do not upload `node_modules`, `dist` or local `artifacts`.

1. Follow [deployment and DNS setup](docs/deployment.md).
2. Sign in to [Pages CMS](https://app.pagescms.org/), authorise its GitHub App for this repository, and select **main**.
3. Invite content editors in Pages CMS. See [the editing guide](docs/editing.md).
4. An editor saves a change in a labelled form. Pages CMS writes a GitHub commit.
5. GitHub Actions validates and rebuilds. A successful build publishes the new site; a failed build leaves the previous site available.

Editors do not need to clone, use Git, edit frontmatter, run npm or operate GitHub Actions. An administrator handles initial access and any build failures. Give editors the direct CMS repository link after setup. There is no embedded CMS or private token in the public website.

## How the calendar works

Events are sorted at build time by start date, then start time. The homepage shows the next four non-cancelled events, and the full list groups upcoming events by month. Featured is a label, not a sorting override. Schools-only attendance is explicitly stated in the migrated summary.

An event remains upcoming through its final **Europe/London calendar day**, including multi-day events. The next daily build moves it to `/events/archive/`; its own page remains available. There is no browser clock dependency or JavaScript sorting. `startTime` and `endTime` are local UK `HH:mm` values; structured data adds GMT/BST offsets. Overnight events need an end date. Event slugs must be unique, and `archive` is reserved.

The scheduled rebuild runs at 00:17 UTC (00:17 GMT / 01:17 BST). This intentionally trades instant midnight removal for zero browser scripts and minimal infrastructure. GitHub may delay scheduled runs and disables schedules in inactive public repositories after 60 days. Administrators must monitor workflow health and re-enable a disabled schedule; until a successful build, the previous snapshot remains live. See [deployment notes](docs/deployment.md). No editor needs to delete an expired event.

## Maintenance

- Run `npm run verify` before publishing developer changes. Dependabot groups monthly npm updates and separately checks Actions updates; review and test them.
- Keep a clone or repository backup. Reverting a content commit and rebuilding restores earlier content.
- Do not change published event slugs without adding a redirect in `src/data/redirects.mjs`. Prefer **Cancelled** over deleting a cancelled event, so visitors following a link see what happened.
- Update schemas, CMS forms and tests together when adding a field.
- Keep photos local. Astro produces responsive WebP variants. Provide meaningful image descriptions and confirm rights/consent before upload. Font files are self-hosted from `@fontsource/cinzel` under its bundled OFL license.
- Remove departing editors from Pages CMS and any GitHub access separately. Use two-factor authentication for administrators.

For repeatable browser checks, `node scripts/browser-check.mjs` uses the local preview and installed Microsoft Edge. Set `BROWSER_CHANNEL=chrome` to use Chrome. The check covers four widths, axe checks and keyboard navigation with JavaScript disabled; screenshots are written to ignored `artifacts/`. See [validation notes](docs/validation.md) for the latest recorded results and limits.

## Before launch

Review [migration notes](docs/migration-notes.md), especially the conflicting museum location, old membership terms and photograph rights. Validate one real CMS save and deployment before changing DNS. This repository is ready for local review, but configuring CMS access, deploying on GitHub, DNS changes and retiring WordPress are owner actions and have not been performed here.

## External dependencies

Build time: npm packages in the lockfile (Astro, sitemap, schema tooling, image tooling and tests), GitHub Actions and its official Astro deployment action. Editing: hosted Pages CMS and GitHub authentication/storage. Hosting: GitHub Pages and your domain provider. Visitors load no third-party scripts, fonts, maps or social embeds. Venue links and email links only leave the site when selected.

The hosted Pages CMS provider has its own backend and authentication infrastructure; there is no CMS backend or database to deploy or maintain in this repository. The public website remains available independently of the CMS service.
