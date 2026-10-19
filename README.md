# Spooky-G

*No fluff. Just assurance. Boo ~*

A static, mobile-first review site for TikTok Shop shoppers in the Philippines. Each review
names the exact item, states whether it was hands-on or research-based, shows which store was
checked and when, and only shows an affiliate link when that link is still worth sending anyone to.

No backend. No database. No accounts. No analytics. Cost: ₱0.

---

## Stack

| | |
|---|---|
| Framework | Astro 5, static output, strict TypeScript |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite`, system fonts only |
| Content | Astro content collections — `reviews` (Markdown) + `site` (`src/data/site.yml`) |
| CMS | Pages CMS (`.pages.yml`) |
| Hosting | Cloudflare Pages, free plan, `pages.dev` |
| Dependencies | Five, and no more: `astro`, `typescript`, `tailwindcss`, `@tailwindcss/vite`, `@astrojs/check`, `@astrojs/sitemap` |

## Commands

```bash
npm install
npm run dev        # local preview at http://localhost:4321
npm run check      # astro check — types and content schemas
npm run build      # astro check + astro build + image size guard
npm run preview    # serve the built dist/ folder
```

`npm run build` is the gate. Nothing reaches production unless it passes.

---

## Repository structure

```text
/
├── .pages.yml                  # Pages CMS configuration (reviews + site settings)
├── astro.config.mjs            # site URL, trailing slashes, sitemap, Tailwind
├── scripts/check-images.mjs    # fails the build for any image over 1.5 MB
├── public/
│   ├── _headers                # Cloudflare security headers + cache rules
│   ├── favicon.svg
│   └── images/
│       ├── reviews/            # product photos (uploaded through the CMS)
│       └── site/               # mascot.png, mascot-head.png, og-image.png
└── src/
    ├── components/             # 16 components
    ├── content.config.ts       # Zod schemas — every build-time rule lives here
    ├── content/reviews/        # one Markdown file per review, <slug>.md
    ├── data/site.yml           # brand intro, about text, contact, disclosure
    ├── layouts/BaseLayout.astro
    ├── lib/                    # reviews, affiliate, format, markdown, site
    ├── pages/                  # /, /reviews/, /reviews/[slug]/, /about/, /affiliate-disclosure/, 404, robots.txt
    └── styles/global.css       # design tokens and shared component classes
```

### Routes

| Route | Indexable |
|---|---|
| `/` | yes |
| `/reviews/` | yes |
| `/reviews/<slug>/` | yes |
| `/about/` | yes |
| `/affiliate-disclosure/` | yes |
| `/404` | no (`noindex`, returns HTTP 404) |
| `/robots.txt`, `/sitemap-index.xml` | no |

Every URL ends with a trailing slash and has a self-referencing canonical tag.

---

## Content model

### Review — `src/content/reviews/<slug>.md`

24 fields. Required: `title`, `slug`, `category`, `reviewedFrom`, `verdictLabel`, `verdict`,
`pros`, `cons`, `image`, `imageAlt`, `reviewedAt`, `sellerName`, `sellerCheckedAt`,
`sellerNotes`, `draft`, and a body of at least 100 characters.
Optional: `brand`, `gallery`, `specs`, `sellerUrl`, `sellerStatus`, `affiliateUrl`,
`affiliateAddedAt`, `tiktokVideoUrl`.

The file name **is** the slug. Pages CMS writes `{fields.slug}.md`, so the URL is automatic and
stable; renaming is disabled so published links never break.

Fixed choices: 5 categories, review basis (`hands-on` / `research`), verdict label
(`worth-it` / `mixed` / `skip-it`), seller status (`looks-ok` / `caution` / `not-checked`).

`draft` defaults to `true`. A new review is never live until the owner says so.

### Site settings — `src/data/site.yml`

`siteName`, `tagline`, `brandIntro`, `about`, `contactEmail`, `tiktokProfileUrl`,
`defaultDisclosure`, `mascotImage`, `ogImage`. Everything on the homepage, the About page, the
disclosure page and the footer comes from this one file.

> The file wraps its fields in a single `settings:` key. Astro's loader needs one root object,
> and Pages CMS renders that key as a group. The owner sees one form either way.

---

## What the build rejects

Every rule below fails `npm run build` with the file and field named. Nothing is silently fixed.

- a missing required field, or a wrong value for a fixed list
- a slug that breaks the pattern, or a slug that does not match the file name
- missing alt text on the hero photo or any gallery photo
- an image path that does not exist in `public/images/`
- an image over 1.5 MB (`scripts/check-images.mjs`)
- a URL field that does not start with `https://`
- an `affiliateUrl` without an `affiliateAddedAt`
- a date in the future, a date that is not `yyyy-MM-dd`, or a date that is not a real day
- an empty `pros` or `cons` list, or more than six items
- a review body under 100 characters

## What the build only warns about

- an affiliate link older than 90 days — refresh it
- a seller check older than 60 days — re-check the store

Both appear as `[spooky-g] <file>: ...` lines in the build log. The build still succeeds.

---

## Affiliate states

Computed in `src/lib/affiliate.ts` from `affiliateUrl`, `affiliateAddedAt` and `sellerStatus`.

| State | When | What the visitor sees |
|---|---|---|
| `active` | link 90 days old or younger, seller checked | button + disclosure |
| `old` | link 91–100 days old | button + "This link is old. Availability may have changed." |
| `expired` | link over 100 days old | no button, "This link expired…" |
| `none` | no link saved | no button, "No affiliate link for this one right now." |
| `hidden` | seller status is `not-checked` | no button, "We haven't checked this store yet…" |

Links are always the official TikTok Shop link, copied unchanged, served with
`rel="sponsored nofollow noopener"`, never shortened, wrapped or redirected, and always
disclosed next to the button and on `/affiliate-disclosure/`.

---

## Images

- JPG, PNG or WebP, stored flat in `public/images/`, max **1.5 MB** per file.
- Recommended about 1600 px wide. Resize a phone photo before uploading.
- Name files after the product slug: `<slug>-hero.webp`.
- Alt text is required for the hero and every gallery photo.
- Space is reserved with a fixed aspect ratio (4:3 hero, 1:1 gallery) so nothing shifts while
  images load. Below-the-fold images load lazily; the hero loads first.
- Crop personal details out of any screenshot.

`npm run build` fails on an oversized image and names it. `node scripts/check-images.mjs` runs
the same check on its own.

---

## Owner runbook

Everything here is done from the browser. You never write code and never open a terminal.

### Publish a review

1. Sign in to Pages CMS with GitHub.
2. Open **Reviews → Create**.
3. Fill in the product name, the slug, the brand and the category.
   The slug becomes the page URL — keep it short and descriptive.
4. Pick the review basis, the verdict label, and write the one-line verdict.
5. Add at least one pro and one con. "None found." is an honest answer and is allowed.
6. Upload the main photo, then write what it shows in the alt text.
7. Write the review itself: what you used it for, what you did not test, who it is not for.
8. Add the store name, the date you checked it, the status, and notes describing **what you
   saw** — not what you concluded. "Photos matched our own, shop had a PH address" is fine.
   "Looks legit" is not.
9. Add the affiliate link and the date you generated it, or add neither.
10. Leave **Draft** on, save, and wait for the build.
11. Open the preview build and read it once.
12. Turn **Draft** off and save. Cloudflare builds and the page goes live.

A save is a commit plus a build. It is not instant — usually a couple of minutes.

### Change an existing review

Open **Reviews**, pick the entry, change the fields, save. The live page updates on the next
successful build.

### Take a review down

Open it, turn **Draft** back on, save. The page, its listing entry and its sitemap entry all
disappear on the next successful build.

### Delete a review

Delete the entry. The page disappears on the next build and Git history keeps the old file, so
it can be brought back.

### Edit site text

Open **Site settings** to change the tagline, the homepage intro, the About page, the contact
email and the commission note.

### Fix a failed build

A failed build does not touch the live site — the previous version stays up. Cloudflare's
deploy log names the file and the field that failed. Open that entry in the CMS, correct the
field, save. Common causes: a missing alt text, a URL without `https://`, an affiliate link
without its date, a date in the future, or a photo over 1.5 MB.

### Roll back

Cloudflare dashboard → **Deployments** → pick the previous successful deployment →
**Rollback to this deployment**. Or revert the commit on GitHub.

### Quarterly check, about 20 minutes

- [ ] Re-check every seller; update `sellerCheckedAt` and `sellerNotes`.
- [ ] Refresh affiliate links older than 90 days; update `affiliateAddedAt`.
- [ ] Remove or update reviews for products that no longer exist.
- [ ] Open every live link to confirm it still works.

---

## Deployment

1. Push the repository to GitHub.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages**, connect the repository.
3. Build command `npm run build`, output directory `dist`.
4. Deploy and note the `pages.dev` address.
5. If the address differs from `astro.config.mjs`, update `site` there and redeploy.
6. Install the Pages CMS GitHub App on this repository only, then open the site in Pages CMS.
7. Walk through one review end to end before launch.

There are no secrets, no environment variables and no `.env` file. `public/_headers` sets the
security headers and one-year caching for `/_astro/*` and `/images/*`; HTML is revalidated.

---

## Accessibility and performance, verified by hand

- Landmarks, one `h1` per page, sequential headings, skip link to `#main`.
- Focus ring on everything interactive; the whole site works from the keyboard.
- Body text 16 px and up, tap targets 44 px and up, no horizontal scroll at 320 px.
- Colour is never the only signal — every status chip carries its label as text.
- System fonts only, no web-font download, no framework JavaScript.
- One small external script for the category filter; the site works without it.
- `prefers-reduced-motion` disables transitions.

---

## Known gaps and deviations

**Still to do before launch (tickets T-14 → T-17)**

- [ ] **The sample review must be replaced or deleted.** `src/content/reviews/adjustable-phone-stand.md`
      is placeholder content on purpose. It is `draft: true`, so it cannot reach the public site,
      but it must not ship.
- [ ] `contactEmail` is the reserved placeholder `hello@spooky-g.example` and must be replaced
      with a real address.
- [ ] The 10 real reviews, each with a real seller check and a real, verified affiliate link.
- [ ] V-01 (confirm the TikTok affiliate link host and 100-day expiry), V-02 (confirm Pages CMS
      media uploads), V-03 (final mascot assets and launch inputs).
- [ ] Deploy to Cloudflare Pages, run the rollback drill, walk the launch checklist.

**Deviations from the build documents**

| Deviation | Why |
|---|---|
| `src/data/site.yml` nests its fields under `settings:` | Astro's loader reads one root object per file. Pages CMS supports nested object fields, so the owner still edits one flat form. |
| `ReviewCard` takes an optional `headingLevel` | Keeps headings sequential: cards are `h2` under the listing title and `h3` under the homepage's "Latest reviews" heading. |
| "More reviews" is not shown at the bottom of a review | `implementation.md` §1.2 and §11.1 put related-review modules out of scope, even though the `ux-design.md` sketch shows one. |
| The About page markdown is rendered by a small in-project renderer (`src/lib/markdown.ts`) | Astro only renders Markdown for content-collection entries. Adding a Markdown dependency was ruled out by the five-dependency budget. It supports headings, lists, bold, italic and links, and escapes HTML first. |
| `vite.build.assetsInlineLimit` is set to `0` | Keeps the filter script in an external file so `script-src 'self'` in `_headers` does not block it. |
| `--muted` is not used for small text | `#7B8193` on white is 3.9:1, below the 4.5:1 minimum for body-size text. Dates and captions use `--ink-soft` instead (`#454A57`, 8.9:1). |
| Affiliate link order is `none` → `hidden` → `expired` → `old` → `active` | When a store is unchecked *and* a link is expired, the visitor is told the store was not checked, which is the more useful of the two messages. Neither state ever shows a button. |
| Mascot artwork sits on `--bg-soft` panels | The supplied PNGs have no alpha channel (studio backdrop `#F0F1F3`). Per `ux-design.md` §0.1 the mascot is therefore only placed on a soft panel, and the small masthead mark gets a soft pill behind it. Drop in transparent PNGs and the treatment switches itself off. |
