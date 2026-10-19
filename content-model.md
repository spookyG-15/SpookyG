# Spooky-G — Content Model

**Status:** Revised scope for approval
**Prepared by:** Creatives
**Date:** 2026-10-19 (revision 3)
**Build source of truth:** `implementation.md`

---

## 1. The Simple Model

Two things. That's it.

| Thing | Where it lives | What it is |
|---|---|---|
| **Reviews** | `src/content/reviews/*.md` | One Markdown file per product review |
| **Site settings** | `src/data/site.yml` | Brand intro, about text, contact, mascot, default disclosure |

Everything a review needs — product, images, verdict, seller check, affiliate link — lives in that one file.

**No categories collection.** Categories are a fixed dropdown list defined in `.pages.yml`. A review picks one. Adding a category later is a one-line edit by a developer.

**No pages collection.** The About page and the disclosure page are built from site settings.

**No cross-file references.** Nothing points at anything else, so nothing can break.

### 1.1 Why this is the right amount of structure

| Option | Verdict |
|---|---|
| One review file with everything inside | **Chosen.** One save, one page, no broken links between files |
| Separate Product / Review / Seller collections | Rejected. Three places to edit for one publish |
| Categories as a CMS collection | Rejected. A dropdown is enough at this size |
| Trust pages as CMS files | Rejected. About and disclosure live in site settings |

---

## 2. Review Fields

24 fields. 16 required, 8 optional. All flat — no nested objects except two short repeatable lists.

### 2.1 Identity

| Field | Type | Required | Rules | What it's for |
|---|---|---|---|---|
| `title` | string | Yes | 3–80 chars | Product name, shown as the page heading |
| `slug` | string | Yes | `^[a-z0-9]+(?:-[a-z0-9]+)*$`, 3–80 | Becomes the filename and the URL |
| `brand` | string | No | 1–40 chars | Shown under the title |
| `category` | select | Yes | One of the fixed list | Used for filtering |

### 2.2 The verdict

| Field | Type | Required | Rules | What it's for |
|---|---|---|---|---|
| `reviewedFrom` | select | Yes | `hands-on` or `research` | The honesty badge |
| `verdictLabel` | select | Yes | `worth-it`, `mixed`, `skip-it` | The coloured pill |
| `verdict` | text | Yes | 20–280 chars | One honest sentence |
| `pros` | string list | Yes | 1–6 items, 3–120 chars each | What worked |
| `cons` | string list | Yes | 1–6 items, 3–120 chars each | What didn't |

> If there are no real pros or cons, write **“None found.”** That is an honest answer and keeps publishing simple — no conditional required fields.

### 2.3 Images

| Field | Type | Required | Rules | What it's for |
|---|---|---|---|---|
| `image` | image | Yes | JPG/PNG/WebP, ≤ 1.5 MB | Main product photo |
| `imageAlt` | string | Yes | 5–160 chars | Describes the photo |
| `gallery` | list of {image, alt} | No | Max 4 | Extra photos |

### 2.4 The review itself

| Field | Type | Required | Rules | What it's for |
|---|---|---|---|---|
| `body` | rich text (Markdown) | Yes | 100+ chars | The short, honest write-up |
| `reviewedAt` | date | Yes | `yyyy-MM-dd`, not in the future | When the review was written |

Specs are optional and only used when they matter:

| Field | Type | Required | Rules |
|---|---|---|---|
| `specs` | list of {label, value} | No | Max 10; label 1–40 chars, value 1–80 chars |

### 2.5 Seller check

One store per review. Flat fields — no nested objects.

| Field | Type | Required | Rules | What it's for |
|---|---|---|---|---|
| `sellerName` | string | Yes | 1–80 chars | The store checked |
| `sellerUrl` | string | No | Must start with `https://` | Link to the listing |
| `sellerCheckedAt` | date | Yes | `yyyy-MM-dd`, not in the future | When it was checked |
| `sellerStatus` | select | No (default `looks-ok`) | `looks-ok`, `caution`, `not-checked` | The status chip |
| `sellerNotes` | text | Yes | 10–600 chars | What was actually observed |

> **Language rule:** describe what was seen, not what was concluded. “Photos matched the item, shop had a PH address” is fine. “Looks legit” is not.
>
> **Every published review must display this line verbatim:** *a seller check is what we saw on that date — it is not proof of authenticity.*

### 2.6 Affiliate link

| Field | Type | Required | Rules | What it's for |
|---|---|---|---|---|
| `affiliateUrl` | string | No | Must start with `https://` | The official TikTok Shop link |
| `affiliateAddedAt` | date | If URL is set | `yyyy-MM-dd` | Drives the Active/Old/Expired states |

> Required **only when** `affiliateUrl` is filled in. A review with no link still publishes — the page simply shows "no affiliate link for this one right now".

**States the page can show** (computed from these two fields):

| State | Condition |
|---|---|
| `active` | URL set, `affiliateAddedAt` ≤ 90 days ago, seller checked |
| `old` | 91–100 days |
| `expired` | Over 100 days |
| `none` | No URL saved |
| `hidden` | Seller status is `not-checked` |

### 2.7 Optional extras

| Field | Type | Required | Rules | What it's for |
|---|---|---|---|---|
| `tiktokVideoUrl` | string | No | Must start with `https://` | Plain text link to the source video — never embedded |

### 2.8 Draft control

| Field | Type | Required | Default | What it's for |
|---|---|---|---|---|
| `draft` | boolean | Yes | `true` | `true` keeps the review off the live site |

One boolean runs the entire publish/unpublish workflow.

### 2.9 Fields we deliberately removed

| Removed | Why |
|---|---|
| `score` / `scoreBasis` | False precision; the verdict label is enough |
| `evidence` list | Photos and measurements can sit in the review body |
| `sources` list | Links belong in the body text |
| `publishedAt` / `updatedAt` | `reviewedAt` covers both |
| `tags` | The filter uses category only |
| `seoTitle` / `seoDescription` | Generated automatically from title and verdict |
| `bestFor` / `notFor` | Kept as two optional lines inside the body |
| Nested `sellerChecks` list | One store per review; a flat block is simpler |
| Nested `affiliate` object | Two flat fields are simpler |

---

## 3. Site Settings (`src/data/site.yml`)

| Field | Type | Required | What it's for |
|---|---|---|---|
| `siteName` | string | Yes | `Spooky-G` |
| `tagline` | string | Yes | “No fluff. Just assurance. Boo ~” |
| `brandIntro` | text | Yes | 1–2 lines under the homepage hero |
| `about` | rich text | Yes | The About page body |
| `contactEmail` | string | Yes | Shown on About and in the footer |
| `tiktokProfileUrl` | string | No | Footer link |
| `defaultDisclosure` | text | Yes | The commission note used next to every link |
| `mascotImage` | image | Yes | Full mascot, transparent background, in `public/images/site/` |
| `ogImage` | image | Yes | Social preview image (`public/images/site/`) |

`siteUrl` deliberately lives in `astro.config.mjs`, not here, so sitemap and canonical URLs have one source of truth.

---

## 4. Categories

A fixed list in `.pages.yml`. Launch values:

```
Home & Kitchen
Beauty & Personal Care
Phone & Gadgets
Fashion & Accessories
Health & Wellness
```

Adding one later = add a line to the `select` options in `.pages.yml`. A developer task, done once, low risk. Existing reviews are unaffected.

---

## 5. Slug Rules

- Lowercase words separated by single hyphens.
- 3–80 characters.
- Must be unique across `src/content/reviews/`.
- The slug becomes the filename, so the URL is automatic: `/reviews/my-slug/`.
- The slug field must equal the filename. If they ever disagree, the build fails with a clear message.
- Review slugs are not renamed after publishing; the filename is the URL.

---

## 6. Validation

### 6.1 Fails the build

- Any required field missing.
- Wrong type or wrong select value.
- Slug pattern broken, duplicated, or different from the filename.
- `imageAlt` or a gallery `alt` missing.
- Image file missing from `public/images/reviews/`.
- Image over 1.5 MB.
- A URL field that does not start with `https://`.
- `affiliateUrl` set without `affiliateAddedAt`.
- Dates in the future, or `sellerCheckedAt`/`reviewedAt` in the future.
- `pros` or `cons` empty.

### 6.2 Build warning only

- `affiliateAddedAt` older than 90 days (owner should refresh).
- `sellerCheckedAt` older than 60 days (page shows a quiet note).

### 6.3 Where validation lives

Astro's content collections with Zod run this at build time. The CMS blocks empty required fields so the owner rarely hits an error, but the build is the authority.

---

## 7. Sample Review

> Example only. Not real content. Replace everything.

```yaml
---
title: "Adjustable Phone Stand"
slug: "adjustable-phone-stand"
brand: "ExampleBrand"
category: "Phone & Gadgets"
reviewedFrom: "hands-on"
verdictLabel: "worth-it"
verdict: "Steady on a desk and cheap. Pointless if you want to charge your phone at the same time."
pros:
  - "Base didn't slide on a wooden desk"
  - "Hinge held position after repeated adjustment"
cons:
  - "No cable management"
  - "Wobbles with a tablet over 700 g"
image: "/images/reviews/adjustable-phone-stand-hero.webp"
imageAlt: "Aluminium phone stand holding a black phone on a wooden desk."
gallery:
  - image: "/images/reviews/adjustable-phone-stand-side.webp"
    alt: "Side view showing the hinge and base."
specs:
  - label: "Material"
    value: "Aluminium alloy, silicone"
  - label: "Height range"
    value: "14–28 cm"
reviewedAt: "2026-10-12"
sellerName: "Example Store PH"
sellerUrl: "https://example.com/listing/placeholder"
sellerCheckedAt: "2026-10-12"
sellerStatus: "looks-ok"
sellerNotes: "Title, variant and pack size matched the item we used. Photos on the listing matched our own photos."
affiliateUrl: "https://example.com/affiliate-placeholder"
affiliateAddedAt: "2026-10-12"
tiktokVideoUrl: "https://www.tiktok.com/@example/video/0000000000000000000"
draft: true
---

Used this stand at a desk and bedside for three days with a 6.7-inch phone in a thick case. The base stayed put and the hinge kept its position.

Not tested: long-term wear past two weeks, and anything heavier than a large phone.

If you want MagSafe charging while you watch, skip it — this one has no charging coil.
```

### 7.1 Notes

- `draft: true` so an example can never go live by accident.
- The affiliate URL is a placeholder.
- `sellerNotes` describes observations, never conclusions.

---

## 8. Planning-Level `.pages.yml`

```yaml
media:
  - name: product_images
    label: Product photos
    input: public/images/reviews
    output: /images/reviews
    rename: safe
    extensions: [jpg, jpeg, png, webp]
  - name: site_images
    label: Site images
    input: public/images/site
    output: /images/site
    rename: safe
    extensions: [png, jpg, webp]

content:
  - name: reviews
    label: Reviews
    type: collection
    path: src/content/reviews
    format: yaml-frontmatter
    filename:
      template: "{fields.slug}.md"
      field: false
    operations:
      rename: false
      delete: true
    view:
      primary: title
      sort: reviewedAt
      order: desc
    fields:
      - name: title
        type: string
        required: true
        options:
          minlength: 3
          maxlength: 80
      - name: slug
        type: string
        required: true
        pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$"
        options:
          minlength: 3
          maxlength: 80
      - name: brand
        type: string
      - name: category
        type: select
        required: true
        options:
          values:
            - { name: "Home & Kitchen", label: "Home & Kitchen" }
            - { name: "Beauty & Personal Care", label: "Beauty & Personal Care" }
            - { name: "Phone & Gadgets", label: "Phone & Gadgets" }
            - { name: "Fashion & Accessories", label: "Fashion & Accessories" }
            - { name: "Health & Wellness", label: "Health & Wellness" }
      - name: reviewedFrom
        type: select
        required: true
        options:
          values:
            - { name: "hands-on", label: "Hands-on tested" }
            - { name: "research", label: "Research-based" }
      - name: verdictLabel
        type: select
        required: true
        options:
          values:
            - { name: "worth-it", label: "Worth it" }
            - { name: "mixed", label: "Mixed" }
            - { name: "skip-it", label: "Skip it" }
      - name: verdict
        type: text
        required: true
      - name: pros
        type: string
        list: true
        required: true
      - name: cons
        type: string
        list: true
        required: true
      - name: image
        type: image
        required: true
        options:
          media: product_images
      - name: imageAlt
        type: string
        required: true
      - name: gallery
        type: object
        list: true
        fields:
          - name: image
            type: image
            options:
              media: product_images
          - name: alt
            type: string
            required: true
      - name: specs
        type: object
        list: true
        fields:
          - name: label
            type: string
            required: true
          - name: value
            type: string
            required: true
      - name: reviewedAt
        type: date
        required: true
        options:
          format: yyyy-MM-dd
      - name: sellerName
        type: string
        required: true
      - name: sellerUrl
        type: string
      - name: sellerCheckedAt
        type: date
        required: true
        options:
          format: yyyy-MM-dd
      - name: sellerStatus
        type: select
        default: "looks-ok"
        options:
          values:
            - { name: "looks-ok", label: "Looks ok" }
            - { name: "caution", label: "Caution" }
            - { name: "not-checked", label: "Not checked" }
      - name: sellerNotes
        type: text
        required: true
      - name: affiliateUrl
        type: string
      - name: affiliateAddedAt
        type: date
        default: ""
        options:
          format: yyyy-MM-dd
      - name: tiktokVideoUrl
        type: string
      - name: draft
        type: boolean
        default: true
      - name: body
        type: rich-text
        required: true
        options:
          format: markdown
          media: false

  - name: site
    label: Site settings
    type: file
    path: src/data/site.yml
    format: yaml
    operations:
      delete: false
    fields:
      - name: siteName
        type: string
        required: true
      - name: tagline
        type: string
        required: true
      - name: brandIntro
        type: text
        required: true
      - name: about
        type: rich-text
        required: true
        options:
          format: markdown
          media: false
      - name: contactEmail
        type: string
        required: true
      - name: tiktokProfileUrl
        type: string
      - name: defaultDisclosure
        type: text
        required: true
      - name: mascotImage
        type: image
        required: true
        options:
          media: site_images
      - name: ogImage
        type: image
        required: true
        options:
          media: site_images
```

**Design notes**

- No `components` block. The two small object lists are written inline.
- No `settings.content.merge`. With this small a schema, strict rewriting is safer than preserving unknown keys.
- No `reference` fields. Nothing points at another file.
- Rename is disabled on reviews so published URLs stay stable.
- Delete stays enabled so the owner can remove a review.

---

## 9. Publishing Workflow

**Login → Add review → Upload images → Write → Seller info → Affiliate link → Publish**

| Step | What the owner does |
|---|---|
| 1 | Signs in to Pages CMS with GitHub |
| 2 | Opens **Reviews → Create** |
| 3 | Title, slug, brand, category |
| 4 | Verdict label, one-line verdict, pros, cons |
| 5 | Uploads the hero photo, writes alt text, adds gallery photos |
| 6 | Writes the review body |
| 7 | Seller name, check date, status, notes (listing link optional) |
| 8 | Pastes the affiliate link and the date it was generated (or skips both) |
| 9 | Leaves **Draft** on, saves, checks the preview build |
| 10 | Turns **Draft** off, saves |
| 11 | Cloudflare builds and deploys automatically |
| 12 | Opens the live page to confirm |

| Action | How | Result |
|---|---|---|
| Edit | Open the review, change fields, save | New build, live in a few minutes |
| Unpublish | Turn **Draft** back on | Page disappears on the next build |
| Delete | Delete the entry | Page disappears; Git history keeps the file |
| Add a category | Developer adds a line to `.pages.yml` | New option appears in the dropdown |
| Fix site text | Edit **Site settings** | About, hero intro, contact, disclosure update |

**Honest limitation:** saving is not instant. A commit triggers a build; the live site updates when the build succeeds. If a build fails, the previous version stays live.

---

## 10. Image Rules

- Stored in `public/images/reviews/`, served from the CDN.
- JPG, PNG, or WebP.
- **1.5 MB maximum per file.** The build fails above this with the filename, so the owner knows exactly which photo to fix.
- Recommended: about 1600 px wide. Phone photos should be resized before upload.
- Alt text required for the hero and every gallery image.
- Name files with the product slug first: `adjustable-phone-stand-hero.webp`.
- Personal details must be cropped out of screenshots.
- No web-font or script is added for images. Layout space is reserved with a fixed aspect ratio so nothing jumps while loading.

> Images below the fold load lazily; the hero loads first. That is the entire optimisation strategy — no image pipeline, no CDN service, no cost.

---

## 11. Permissions and Access

| System | Access | Notes |
|---|---|---|
| GitHub | Owner, 2FA | Repository owner |
| Pages CMS | GitHub App on this repo only | Reads and writes content |
| Cloudflare Pages | GitHub App on this repo | Builds on push |
| Collaborators | None at launch | Single editor |

No TikTok credentials, cookies, or tokens are stored anywhere in this project. The affiliate link is a public URL.

---

## 12. Deployment and Recovery

| Event | What happens |
|---|---|
| Save in CMS | Commit to GitHub → Cloudflare build → live site updates |
| Build fails | Previous deployment stays live; log names the file and field |
| Bad content published | Turn Draft on, or delete, and save |
| Need the old version back | Roll back in Cloudflare, or revert in Git |
| Link or image breaks | Edit the review and save |

---

## 13. Quarterly Check

Once every three months the owner spends about 20 minutes:

- [ ] Re-check each seller; update `sellerCheckedAt` and `sellerNotes`.
- [ ] Refresh affiliate links older than 90 days; update `affiliateAddedAt`.
- [ ] Remove or update reviews for products that no longer exist.
- [ ] Confirm every live link still opens.

---

## 14. Content Acceptance Checks

| ID | Check | Expected |
|---|---|---|
| CT-01 | Create a review with all required fields | File appears, build generates `/reviews/<slug>/` |
| CT-02 | `draft: true` | No public page, not in listing or sitemap |
| CT-03 | `draft: false` | Page, listing entry, and sitemap entry appear |
| CT-04 | Missing alt text | Build fails naming the file and field |
| CT-05 | Image over 1.5 MB | Build fails naming the file |
| CT-06 | Affiliate URL without a date | Build fails |
| CT-07 | Affiliate link over 100 days old | Build warning; page shows the expired state |
| CT-08 | Seller check over 60 days old | Build warning; page shows the re-check note |
| CT-09 | URL not starting with `https://` | Build fails |
| CT-10 | Slug and filename disagree | Build fails |
| CT-11 | Edit site settings | About, hero intro, contact, and disclosure update |
| CT-12 | Delete a review | Page disappears; Git history retains the file |
