# Spooky-G — Features

**Status:** Approved for build
**Prepared by:** Creatives
**Date:** 2026-10-19 (revision 3)
**Build source of truth:** `implementation.md`

---

## 1. What Changed

| | Before | Now |
|---|---|---|
| P0 features | 19 | **10** |
| Total tracked features | 35 | 10 (launch) + 10 (deferred with triggers) |
| Public pages | 13 | **6** (4 core + disclosure + 404) |
| Content collections | 4 (reviews, categories, pages, site) | **2** (reviews, site) |
| Review schema fields | ~35 | **22**, all flat |
| Cross-file references | 1 | **0** |
| Client-side features | search + filter | filter only |
| Automated test tooling | Vitest, Playwright, axe | none required (manual checklist) |

Everything cut was cut because it added maintenance, dependencies, or failure modes without serving the single job: *help a TikTok viewer trust a product link.*

---

## 2. Launch Features (P0)

### F-01 — Homepage

**Story:** As a visitor from TikTok, I want to immediately understand what Spooky-G is and see recent reviews.

**Acceptance criteria**

- [ ] Masthead shows the Spooky-G wordmark and the mascot head mark.
- [ ] Hero shows the mascot on a soft panel, the tagline (“No fluff. Just assurance. Boo ~”), and one clear primary action to `/reviews/`.
- [ ] Below the hero: the brand intro (CMS-editable), the latest 3–6 reviews, and simple navigation.
- [ ] No animation beyond hover/focus feedback.
- [ ] Works at 320 px with no horizontal scroll.
- [ ] Unique title, description, canonical URL, and Open Graph image.

**Not included:** carousels, testimonials, newsletter pop-ups, animated mascot.

---

### F-02 — Review Listing + Category Filter

**Story:** As a browser, I want to scan reviews as cards and filter by category, so I can find something relevant fast.

**Acceptance criteria**

- [ ] `/reviews/` lists every published review, newest first.
- [ ] Each card shows: product image, title, brand (if set), category, verdict label, and review date.
- [ ] A simple category filter appears above the cards. “All” is the default.
- [ ] Filtering is instant and works without page reload.
- [ ] The full list is readable with JavaScript disabled; the filter is an enhancement.
- [ ] Empty state: “No reviews here yet. Check back soon, boo.”
- [ ] No search box, no sorting controls, no pagination (catalog is small).

**Not included:** full-text search, sort menus, pagination, faceted filters, infinite scroll.

---

### F-03 — Review Detail Page

**Story:** As a viewer, I want one page with the exact item, a plain verdict, the short review, and the facts I need to decide.

**Acceptance criteria**

- [ ] `/reviews/[slug]/` renders one published review as static HTML.
- [ ] Shows: product image, gallery (if any), title, brand, category, and variant/pack details (if set).
- [ ] Shows the verdict label and the one-line verdict near the top.
- [ ] Shows pros and cons as two short lists.
- [ ] Shows the short review body.
- [ ] Shows a “hands-on tested” or “research-based” badge so the basis is never ambiguous.
- [ ] Shows the review date.
- [ ] Draft reviews never generate a page.
- [ ] Unknown slugs return the 404 page.
- [ ] No star rating, no numeric score, no price, no product carousel.

**Not included:** scores, ratings, comparison widgets, related reviews, video embeds, comments.

---

### F-04 — Seller Check + Authenticity Disclaimer

**Story:** As a cautious buyer, I want to know which store was checked and when, so I can judge the listing myself.

**Acceptance criteria**

- [ ] Every published review shows store name, check date, and the notes taken at the time.
- [ ] A status chip appears: “Looks ok”, “Caution”, or “Not checked”.
- [ ] “Not checked” hides the affiliate link (`hidden` state, see F-05).
- [ ] The line **“A seller check is what we saw on that date. It is not proof of authenticity.”** appears on every review.
- [ ] A link to the store listing is shown when provided; it opens in a new tab with `rel="noopener"`.
- [ ] No “verified seller”, “guaranteed”, or authenticity badges.

**Not included:** seller ratings, automated checks, reputation scores, multiple sellers per review.

---

### F-05 — Affiliate Link, Disclosure, and Safe Fallback

**Story:** As a ready buyer, I want a clearly disclosed link to the reviewed product, and an honest message when there isn't one.

**Acceptance criteria**

- [ ] Link appears only when `affiliateUrl` is set and the seller check is not “Not checked”.
- [ ] Link uses `rel="sponsored nofollow noopener"` and `target="_blank"`.
- [ ] Visible disclosure sits next to the link: “We may earn a commission if you buy through this link. You pay no extra.” with a link to `/affiliate-disclosure/`.
- [ ] Five states, all plain-spoken:
  - **Active** (`active`): link ≤ 90 days old — normal button.
  - **Old** (`old`): 91–100 days — button plus “this link is old, availability may have changed”.
  - **Expired** (`expired`): > 100 days — no button, “this link expired — look for the product in TikTok Shop”.
  - **None** (`none`): no link saved — no button, “no affiliate link for this one right now”.
  - **Hidden** (`hidden`): seller check is “Not checked” — no button, “we haven't checked this store yet”.
- [ ] Age is measured from `affiliateAddedAt`. No link is ever shortened, redirected, or wrapped.
- [ ] A seller check older than 60 days adds a quiet note: “we haven't re-checked this store in a while”.
- [ ] No countdown, no urgency wording, no price claim.

**Not included:** click tracking, coupon codes, price display, shop-wide links, link cloaking, redirect service.

---

### F-06 — About Page

**Story:** As a visitor deciding whether to trust the site, I want to know who Spooky-G is and how reviews are written.

**Acceptance criteria**

- [ ] `/about/` shows the mascot at full size, the brand bio, the mission, and how reviews are made.
- [ ] Explains the two review bases (hands-on vs research) in plain language.
- [ ] States that seller checks are observations, not authenticity guarantees.
- [ ] Includes the owner's contact email.
- [ ] Includes a one-line privacy note: the MVP sets no cookies and runs no analytics.
- [ ] Content is editable in Pages CMS (site settings), not hardcoded in the page.
- [ ] Unique metadata and canonical URL.

**Not included:** editorial board, legal entity page, separate methodology page, careers page.

---

### F-07 — Pages CMS Publishing Workflow

**Story:** As the owner, I want to publish a review from a browser form — no code, no manual page creation.

**Acceptance criteria**

- [ ] Flow: Login → Add review → Upload images → Write verdict, pros/cons and body → Add seller info → Add affiliate link → Publish.
- [ ] One Markdown file per review; the filename comes from the slug, so the page URL is automatic.
- [ ] A `Draft` toggle keeps unfinished reviews off the live site.
- [ ] Image upload through the CMS (hero + optional gallery), with alt text required.
- [ ] Site settings (brand intro, about, contact, mascot, default disclosure) are editable in the same CMS.
- [ ] Adding a category is a one-line edit in `.pages.yml` by a developer; not an owner task.
- [ ] Saving commits to GitHub; Cloudflare deploys automatically.
- [ ] Owner can edit, unpublish (set Draft), and delete a review without help.
- [ ] No approval workflow, no scheduling, no preview server required.

**Not included:** page-builder blocks, multi-editor roles, scheduled publishing, custom navigation editor.

---

### F-08 — Routing, 404, and Search Basics

**Story:** As a search engine or a lost visitor, I want correct URLs and a useful dead end.

**Acceptance criteria**

- [ ] Routes: `/`, `/reviews/`, `/reviews/[slug]/`, `/about/`, `/affiliate-disclosure/`, `404`.
- [ ] Every page has a self-referencing canonical URL with a trailing slash.
- [ ] Unique title and meta description per page; Open Graph and Twitter card tags present.
- [ ] `sitemap.xml` lists every published page and excludes drafts and the 404.
- [ ] `robots.txt` allows crawling and points to the sitemap.
- [ ] The 404 page returns HTTP 404, is `noindex`, and offers “Browse reviews” plus the latest reviews.
- [ ] Draft review URLs do not exist.

**Not included:** category pages, sitemap segmentation, hreflang, structured review/product markup.

---

### F-09 — Responsive and Accessible Basics

**Story:** As a phone user or a keyboard/screen-reader user, I want the site to be readable and operable.

**Acceptance criteria**

- [ ] Usable at 320, 375, 390, 768, 1024, and 1440 px with no horizontal scrolling.
- [ ] Tap targets at least 44×44 px; body text at least 16 px.
- [ ] Semantic landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, sequential headings.
- [ ] Skip link to main content.
- [ ] Visible focus on all interactive elements; all navigation and filters keyboard-operable.
- [ ] Text contrast at least 4.5:1; status never conveyed by colour alone.
- [ ] Every image has meaningful alt text or is marked decorative.
- [ ] Reduced-motion preference respected; no autoplay, no flashing.
- [ ] Usable at 200% zoom.

**Not included:** automated axe/Playwright gates, dark mode, high-contrast theme, screen-reader-specific pages.

---

### F-10 — Cloudflare Deploy, Unpublish, and Rollback

**Story:** As the owner, I want saves to go live reliably and mistakes to be fixable.

**Acceptance criteria**

- [ ] GitHub push triggers a Cloudflare Pages build (`npm run build`, output `dist`).
- [ ] A failed build leaves the previous successful deployment live.
- [ ] Setting a review to Draft removes it from listing, category filter, and sitemap on the next build.
- [ ] Deleting a review removes its page on the next build; Git history keeps the old version.
- [ ] Rollback is possible from the Cloudflare dashboard and from Git history.
- [ ] Deployment steps and the failure/rollback procedure are written down for a non-developer.
- [ ] Build stays within the free plan (500 builds/month, 20,000 files).

**Not included:** preview environments per editor, custom CI/CD, multi-region config, automatic rollback on error.

---

## 3. Cross-Cutting Requirements (part of the features above)

| Requirement | Where it lives | Note |
|---|---|---|
| Basic content validation | F-07, F-08 | Required fields, dates, URL format, image presence, slug pattern |
| Lightweight image handling | F-03, F-07 | Owner-facing size cap enforced at build; reserved aspect ratio; lazy loading below the fold |
| Affiliate link verification | F-05 | Verification ticket V-01 runs before any link ships |
| Pages CMS media verification | F-07 | Verification ticket V-02 |
| Affiliate disclosure | F-05, F-06 | Inline plus dedicated page |

---

## 4. Traceability

| ID | Feature | Journey | Content | Route / component | Ticket | Test |
|---|---|---|---|---|---|---|
| F-01 | Homepage | J1 | `site.*`, latest `reviews` | `/` · `SiteHeader`, `Hero`, `ReviewCard` | T-04, T-09 | AT-01 |
| F-02 | Listing + filter | J2 | `reviews.title`, `category`, `verdictLabel`, `reviewedAt`, `image` | `/reviews/` · `ReviewCard`, `CategoryFilter` | T-08 | AT-02 |
| F-03 | Review detail | J2, J3 | `reviews.*` | `/reviews/[slug]/` · `ReviewHeader`, `Verdict`, `ProsCons`, `ReviewBody` | T-05 | AT-03 |
| F-04 | Seller check | J3 | `sellerName`, `sellerUrl`, `sellerCheckedAt`, `sellerStatus`, `sellerNotes` | `SellerCheck` | T-06 | AT-04 |
| F-05 | Affiliate + disclosure | J3 | `affiliateUrl`, `affiliateAddedAt` | `AffiliateCta`, `Disclosure` | T-07 | AT-05 |
| F-06 | About | J4 | `site.about`, `site.contactEmail` | `/about/` | T-10 | AT-06 |
| F-07 | CMS workflow | J5 | all `reviews.*`, `site.*` | `.pages.yml`, collections | T-02, T-03, T-12, T-16 | AT-12 |
| F-08 | Routing + SEO | J1–J4 | routes, `site.siteName` | sitemap, robots, `404.astro` | T-11 | AT-07, AT-08 |
| F-09 | Responsive + a11y | all | presentation only | layout + components | T-13 | AT-10 |
| F-10 | Deploy + rollback | J5 | all content | GitHub + Cloudflare Pages | T-01, T-16, T-17 | AT-12 |

---

## 5. Acceptance Tests

| ID | Scenario | Expected |
|---|---|---|
| AT-01 | Open homepage | Mascot hero, brand intro, latest reviews, valid metadata |
| AT-02 | Open listing, use filter | Cards correct; filter works; list readable without JS; empty state |
| AT-03 | Open a review | Exact item, verdict, pros/cons, body, badge, date all present |
| AT-04 | Seller check | Store, date, notes, status chip, authenticity disclaimer visible |
| AT-05 | Affiliate states | Active / Old / Expired / None render correctly; rel attributes and disclosure present |
| AT-06 | About page | Brand, mission, review basis, contact, privacy note |
| AT-07 | Bad URL | 404 page, HTTP 404, noindex, recovery links |
| AT-08 | SEO basics | Titles, descriptions, canonical, OG, sitemap, robots correct |
| AT-09 | Images | Uploaded images render, alt text present, size guard enforced |
| AT-10 | Responsive + a11y | 320 px, keyboard, focus, contrast, zoom |
| AT-11 | Invalid content | Build fails with a clear message naming the file and field |
| AT-12 | CMS end-to-end | Create → publish → edit → unpublish → delete; deploy and rollback verified |

---

## 6. Deferred With Triggers

Not built now. Revisit only when the trigger is met.

| Feature | Trigger |
|---|---|
| Text search | More than 40 reviews |
| Category pages | More than 3 categories with 5+ reviews each |
| Related reviews | More than 30 reviews |
| Site analytics | Owner wants traffic data separate from TikTok |
| Newsletter | A real subscriber list exists |
| Comparison pages | Repeated head-to-head demand |
| TikTok video embeds | A lightweight, privacy-reviewed facade exists |
| Product/Review structured data | SEO review after search data exists |
| Expired-link alerts | More than 25 reviews, or a missed expiry |
| Seller directory | Same store in 8+ reviews |

---

## 7. Explicitly Out of Scope

Accounts, comments, community ratings, wishlists, live price tracking, recommendations, notifications, dashboards, user reviews, checkout, payments, scraping, AI chat, dark mode, multi-language, and anything requiring a backend or database.
