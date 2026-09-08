# GitHub Pages deployment and domain

## First publication

1. Create an organisation-owned public GitHub repository. Push the reviewed files and lockfile to **main**, and set main as the default branch. This local folder began with no commits on master; no remote is assumed.
2. Open Settings → Pages. Choose **GitHub Actions** as the publishing source. Ensure Actions is enabled and the github-pages environment permits deployments from main.
3. Verify ownership of `butserlegion.co.uk` in GitHub before changing DNS. Add this domain to the repository's Pages settings as well.
4. Run **Build and deploy website** or push a reviewed change to main. Inspect the build and deploy jobs. The workflow uses the official [Astro Pages action](https://docs.astro.build/en/guides/deploy/github/), runs `npm run verify`, uploads `dist`, then deploys with GitHub's Pages action. Pull requests build but do not deploy.
5. Complete Pages CMS setup and one genuine content-save-to-published-page test. A local build does not verify GitHub or CMS permissions.
6. Once reviewed, change DNS as below. Enable **Enforce HTTPS** when GitHub's certificate is ready. Verify apex and www addresses, mobile navigation, images, events and legacy redirects over HTTPS.

`astro.config.mjs` uses `https://butserlegion.co.uk` and root paths. `public/CNAME` is copied to the output, but **Actions deployments also need the custom domain set in GitHub's Pages settings**; the file alone does not configure the account. There is no repository-name base prefix. Until custom-domain routing is ready, use the local preview; publishing under `owner.github.io/repository/` would require coordinated base-path changes and is not this site's production configuration.

## DNS

Follow [GitHub's current custom-domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). Add the domain to GitHub before pointing DNS at it.

For the apex (`@`), use your provider's supported ALIAS/ANAME to `YOUR-OWNER.github.io`, or the GitHub Pages A records:

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

For `www`, create a CNAME to `YOUR-OWNER.github.io` (the actual owner, with no repository path). Do not use wildcard records. Replace conflicting old web A/AAAA/CNAME records, but preserve mail/MX/TXT records and unrelated services. Verify values against GitHub's current guide when doing the cutover. DNS propagation and certificate issuance may take time.

## Automatic event expiry

The workflow rebuilds daily at 00:17 UTC. Dates are compared in Europe/London. Events remain listed until the end of their final day, then move to the archive on the next successful build. Scheduled runs may be delayed or dropped by GitHub; a static snapshot cannot change until rebuilt. This is not an exact-midnight or high-availability scheduler.

**GitHub disables scheduled workflows after 60 days of repository inactivity in public repositories.** Check Actions routinely, especially during the off-season; re-enable the workflow if GitHub disables it. A maintainer can also run the workflow manually. Content changes on main trigger publication independently. Keep GitHub failure notifications enabled for a responsible maintainer. See [GitHub schedule documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).

## Retire the compromised installation

After the new site is confirmed live, have the existing hosting administrator retire the old WordPress/PHP service and its public admin endpoints, remove obsolete hosting access, and address any reused credentials. Do not copy its database or server code into this repository. Retain only an isolated administrative backup if the owner needs one; never publish it. This implementation has not changed DNS, old hosting, accounts or credentials.

## Recovery and maintenance

Failed validation prevents the deploy job; the previous deployment remains served. Revert the offending content/code commit or correct it and rebuild. Cancelling an event is preferable to deleting its URL. Keep administrator access and domain renewals under organisational control. `contents: read` is the workflow default; only the deploy job receives Pages write and OIDC permissions. There are no personal access tokens or custom secrets to configure.

Astro's static redirect pages use HTML refresh and canonical links. GitHub Pages does not offer arbitrary server-side 301 rules. Existing query-string calendar modes are replaced by `/events/`; unrecognised historical paths receive a useful 404. Add additional explicit mappings if analytics or Search Console later reveals valuable URLs.
