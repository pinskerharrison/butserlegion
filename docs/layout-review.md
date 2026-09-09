# Layout and copy review — 9 September 2026

Reviewed the clean main checkout at f5f21d2 and the live project site at https://pinskerharrison.github.io/butserlegion/. The temporary GitHub Pages site and `/butserlegion/` base are preserved.

## Changes

- Header links now include visitor comments and booking alongside Home, The Legion, Events, Gallery, Join us and Contact. Past events and Privacy sit in a smaller header row. All ten pages are available from the mobile menu, which scrolls on short screens.
- The active-page indicator selects the matching page, rather than also highlighting Home on every route. Home's destination retains the required project prefix.
- Below 761px, the homepage cover uses the photograph's natural proportions instead of a fixed-height crop. Its caption sits below the photograph. Information-page photographs also retain their natural proportions on phones.
- Headings, calls to action, introductory text and gallery captions use plainer language. Membership no longer gives an exact fee or refers to the previous website. Museum pages retain the instruction to confirm arrangements, without discussing the source-site mismatch; the underlying uncertainty remains documented in migration notes.
- Remaining event, archive and 404 links, favicon and social image references now retain the project prefix. Legacy redirects do too, and redirected paths are excluded from the sitemap. The generated-link check rejects accidental root-domain links.

## Validation

- Astro check: no errors, warnings or hints. All six existing unit/content tests pass.
- Production build and output check: 29 HTML files and 530 internal links/assets checked.
- Browser checks: 12 routes at 320, 390, 700, 768, 1024, 1200 and 1440px; no horizontal overflow, unloaded images or browser errors. Header destinations and active-page indicators checked, with the cover aspect ratio checked at phone widths.
- 24 axe scans across desktop and phone layouts: no WCAG A/AA violations reported. This is an automated check, not a full accessibility certification or physical-phone test.
- Keyboard menu and event navigation checked with JavaScript disabled. Desktop and phone screenshots inspected; local screenshots are in ignored `artifacts/`.

Changes are local and uncommitted. GitHub Actions and the public deployment have not been changed by this review. Use `npm run preview` and open `/butserlegion/` locally to review the built site before publishing.
