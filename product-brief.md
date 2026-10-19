# Spooky-G — Product Brief

**Status:** Revised scope for approval
**Prepared by:** Creatives
**Date:** 2026-10-19 (revision 3)
**Build source of truth:** `implementation.md`
**Related:** `features.md`, `ux-design.md`, `content-model.md`

---

## 1. Who We Are

**Spooky-G** — *just a kewl ghost hanging around, reviewing things — No fluff just assurance. Boo ~*

Spooky-G is a small, independent product-review website for people buying on TikTok Shop in the Philippines.

The idea is simple: when someone sees a product in a TikTok video, they should be able to check **which exact item** it is, **what the honest verdict** is, **what the seller looks like**, and **whether the link still works** — before they tap checkout.

This is not a marketplace. There is no cart, no account, and no database. It is a handful of well-written review pages that a single person can publish from a simple CMS.

### 1.1 Brand personality

| Trait | How it shows up |
|---|---|
| Cool and casual | Lowercase, plain language; no corporate filler |
| Friendly with light humor | Occasional “boo”, the sunglasses-and-cap mascot, light headings |
| Straightforward and trustworthy | Disclosures, dates, and caveats stay plain and serious |
| Minimalist and modern | White/soft-neutral backgrounds, rounded cards, lots of space |
| Not childish | Playfulness stops where money, safety, or honesty is involved |

**Voice rule:** playful in the framing, factual in the facts. A seller disclaimer is never a joke.

---

## 2. The Problem

1. **Wrong item.** A video shows a product; the viewer cannot tell the exact variant, pack size, or which store it comes from. Search returns lookalikes.
2. **No evidence.** Short videos do not show specifications, limitations, or a considered opinion.
3. **Seller uncertainty.** The same product appears across stores with different photos, prices, and claims.
4. **Broken links.** Affiliate links expire or point at something other than what was reviewed.

---

## 3. Who We Serve

### 3.1 Primary — the TikTok viewer

Mobile-first shopper, roughly 18–44, comfortable buying on TikTok Shop. Arrives from a video, bio link, or a shared link. Wants a fast answer: *is this the real one, and is it worth it?*

Tolerates: pop-ups, autoplay, fake urgency, unexplained ratings, broken links.
Does not tolerate: being sent to the wrong product.

### 3.2 Secondary — the returning browser

Comes back or searches Google to compare a few products in one category. Needs consistent cards, plain verdicts, and dates.

### 3.3 Admin — the owner

One person. Publishes from Pages CMS. Does not write code. Needs a form that is impossible to get badly wrong.

---

## 4. Value Proposition

> **Find the exact item. Read the honest bit. Check the seller. Then buy.**

Five promises the site keeps:

1. **Exact item.** Brand, product name, variant, pack size, and the store it came from.
2. **Plain verdict.** One line, three possible labels, no star ratings.
3. **Honest basis.** Every review says whether it was hands-on or research-based.
4. **Dated seller check.** Store name, check date, and what was actually observed. Every review carries the line: *a seller check is what we saw on that date — it is not proof of authenticity.*
5. **Honest links.** The official TikTok Shop affiliate link, disclosed, with a clear message when it is missing or expired.

### 4.1 What we never do

No invented reviews, ratings, purchase counts, or seller approvals. No “guaranteed authentic”. No fake urgency. No TikTok logos or claims of endorsement. No prices (they go stale instantly).

---

## 5. Business Flow

```mermaid
flowchart LR
    A[TikTok video / bio link] --> B[Review page on Spooky-G]
    B --> C[Verdict + exact item]
    C --> D[Seller check + date]
    D --> E{Affiliate link valid?}
    E -- Yes --> F[TikTok Shop link]
    E -- No --> G[Honest message, no link]
    F --> H[Checkout on TikTok Shop]
    H --> I[Fulfilled order → commission]
```

- **Revenue:** TikTok Shop affiliate commission, paid on fulfilled orders.
- **Primary conversion:** an outbound click to a valid official affiliate link.
- **Secondary:** reading another review or browsing another category.
- **Traffic:** TikTok video/bio links first, Google search and shared links second.

---

## 6. MVP — The Smallest Useful Site

### 6.1 Four core pages

| Page | Route | Purpose |
|---|---|---|
| Homepage | `/` | Who Spooky-G is, mascot hero, latest reviews |
| Review listing | `/reviews/` | All reviews as cards, filter by category |
| Review detail | `/reviews/[slug]/` | One full review |
| About | `/about/` | Brand mission, honest approach, contact |

### 6.2 Two small support pages (not features, just required pages)

| Page | Route | Why it exists |
|---|---|---|
| Affiliate disclosure | `/affiliate-disclosure/` | The site earns commission; visitors must be told |
| Not found | `/404` | A dead link should still help |

These exist because disclosure is a requirement and a useful 404 is basic reliability. They are not scope expansion.

### 6.3 What ships

- 10 real reviews.
- 5 fixed categories (a dropdown list in the CMS config).
- Site settings edited in Pages CMS: brand intro, about text, contact email, TikTok profile link, mascot image, default disclosure.
- Every review: product, images, verdict, pros/cons, short review, seller check, optional affiliate link, review date.
- Publishing flow: **Login → Add review → Upload images → Write → Seller info → Affiliate link → Publish.** No code, no manual page creation.

### 6.4 Technical shape

Astro static site + TypeScript + Tailwind CSS + Pages CMS + GitHub + Cloudflare Pages. Markdown content collections. No backend, no database, no auth, no server runtime.

**Cost: ₱0.** Every service used has a free tier that covers this site — Pages CMS (free and open source), GitHub (free repository), Cloudflare Pages (free static hosting and CDN). Hosting stays on the free `pages.dev` domain; a custom domain is optional and not budgeted.

---

## 7. Launch Criteria

- [ ] 10 real reviews published, each with verdict, pros/cons, seller check, and a date.
- [ ] Every affiliate link was generated in TikTok and verified before publishing.
- [ ] Disclosure visible next to every link and on the disclosure page.
- [ ] Seller check never implies authenticity; the disclaimer is visible.
- [ ] Works on a 320 px phone screen with no horizontal scrolling.
- [ ] Keyboard navigable; visible focus; alt text on all images.
- [ ] Sitemap, robots, canonical URLs, and 404 working.
- [ ] Owner publishes a new review without developer help.
- [ ] Cloudflare deploy and rollback both tested.
- [ ] No paid service required to run the site.

---

## 8. Deferred — Not Part of This Launch

Each item was considered and deliberately cut. Triggers are noted so they can be revived with intent.

| Deferred | Why not now | Trigger to revisit |
|---|---|---|
| Text search | A category filter is enough at ~10–30 reviews | More than 40 reviews, or search demand |
| Category pages | Extra routes, extra template, near-zero value at this size | More than 3 categories with 5+ reviews each |
| Related reviews | Needs a query and can feel random | Catalog passes 30 reviews |
| Site analytics | Adds a privacy surface and a script; TikTok already reports affiliate activity | Owner wants traffic data independent of TikTok |
| Newsletter | Needs an email provider and consent flow | A real subscriber list |
| Comparison pages | Needs a defensible comparison method | Repeated head-to-head demand |
| TikTok video embeds | Third-party script, slower pages | A lightweight facade is designed |
| Related Product/Review schema | Risk of misleading search results | SEO review after search data exists |
| Expired-link email alerts | Needs scheduled jobs | More than 25 reviews or a first expiry miss |
| Seller directory | Only useful if one store appears repeatedly | Same store in 8+ reviews |
| Price or stock display | Changes constantly; goes stale | Never, without a reliable data source |

### 8.1 Excluded entirely

User accounts, comments, community ratings, wishlists, live price tracking, recommendations, notification systems, custom dashboards, user-generated reviews, checkout, payments, scraping, and AI chat.

---

## 9. Assumptions

1. The owner is a Philippine TikTok Shop affiliate with age verification completed.
2. Product affiliate links can be generated in the app and shared on a website (confirmed in TikTok Shop PH documentation; the exact link format still needs V-01 verification).
3. TikTok Shop PH affiliate links have a maximum 100-day validity, so they need periodic refreshing.
4. The owner can photograph or screenshot products they are reviewing.
5. Reviews are written in English (Philippines).
6. A `pages.dev` address is acceptable for launch; a custom domain is optional and not budgeted.
7. Pages CMS stays free and usable for one editor.
8. One person maintains the site a few times a month.

---

## 10. Risks

| Risk | Level | Response |
|---|---|---|
| Affiliate link format unknown until verified | High | V-01 runs first; until then the site shows “no link” rather than guessing |
| Links expire (max 100 days) | High | Date stored per link; old/expired states shown; manual refresh quarterly |
| Seller info goes stale | Medium | Check date shown on every review; quarterly re-check |
| Owner publishes an unsupported claim | Medium | Short required field set + build-time validation + the “hands-on vs research” badge |
| Mascot artwork needs background removal | Low | The supplied render has a studio backdrop; V-03 produces a transparent version and a head crop, with a CSS fallback if that fails |
| Free-tier limits | Low | Cloudflare Pages: 500 builds/month, 20,000 files; a 10-review site uses a fraction |
| Owner stops maintaining | Medium | Quarterly checklist; unpublish instead of leaving stale pages live |

---

## 11. Success Measures

Keep it small and honest:

- **Does the site work?** No broken links, no failed deploys, no stale reviews live.
- **Does it help?** Outbound clicks to valid affiliate links.
- **Can the owner run it?** A new review published in under 15 minutes, unaided.
- **Does it stay fast?** Page loads quickly on a phone; no page feels heavy.

Vanity metrics (page views, time on site, follower counts) are not goals. The site is a tool, not a destination.

---

## 12. Decisions Still Open

| Question | Default until answered |
|---|---|
| Custom domain? | Launch on `pages.dev` |
| Real contact email? | Owner supplies one before launch |
| Exact affiliate link host? | V-01 verifies; no host allowlist until then |
| Mascot background removal | Produces `mascot.png` (transparent) and `mascot-head.png`; the palette is already matched to the artwork |
| Add categories later? | Requires a one-line edit in `.pages.yml` by a developer |
| PH legal disclosure wording? | Use plain disclosure; confirm before scaling traffic |

---

## 13. Sources

Verified 2026-10-19:

- TikTok Shop Academy PH — Affiliate Links Guide for Creators (affiliate links work on websites; age verification required; links valid up to 100 days). https://seller-ph.tiktok.com/university/essay?knowledge_id=1614664065681153&lang=en
- TikTok Shop Academy PH — TikTok Shop Affiliate Links Programme (no “TikTok Shop” in site/channel names; no TikTok logos or trademarks without permission). https://seller-ph.tiktok.com/university/essay?knowledge_id=304203273848577&lang=en
- Pages CMS documentation — free, GitHub-backed, `.pages.yml` driven. https://pagescms.org/docs/
- Astro documentation — content collections and static output. https://docs.astro.build/
- Cloudflare Pages limits — 500 builds/month free, 20,000 files, 25 MiB per file. https://developers.cloudflare.com/pages/platform/limits/

Not yet verified: the exact affiliate link host/domain; Pages CMS upload size limits; PH-specific legal wording.
