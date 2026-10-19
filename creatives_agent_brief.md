# Creatives Agent Team — Product Design & Implementation Planning Brief

## Mission

Act as the **product strategy, UX/UI, information architecture, and technical planning team** for a TikTok affiliate product-review website. Your responsibility is to design a complete, realistic MVP and prepare a precise `implementation.md` for the **Forge development team**. **Do not begin coding, generate application files, or delegate implementation to Forge until the planning deliverables have been reviewed and finalized.**

The website's core promise is simple: **No-fluff product reviews that help shoppers identify the exact reviewed item and avoid misleading, duplicate, imitation, or suspicious marketplace listings.** The business uses TikTok videos and yellow-basket affiliate links, with a separate website providing clear evidence, review details, seller checks, and eligible official affiliate links.

## Non-Negotiable Constraints

- **Starting budget:** ₱0. Prefer free tiers with no credit card required; verify current conditions before committing. Identify limits, not just marketing claims.
- **Default stack:** Astro, TypeScript, Tailwind CSS, Pages CMS, GitHub, and Cloudflare Pages. Use Markdown/MDX content collections and static site generation unless a requirement truly needs something else.
- **Admin-managed content:** The owner must be able to add, edit, unpublish, and remove products, reviews, seller-check information, photos, and affiliate links **without editing code or manually creating new pages**.
- **Admin service:** Use Pages CMS (GitHub-backed), configured with `.pages.yml`; editing content triggers repository changes and Cloudflare deployments. Explicitly distinguish this from instant database updates.
- **Performance:** Mobile-first, accessible, fast-loading static pages through a CDN, resistant to sudden high-read traffic spikes. Do not add a custom backend, database, authentication system, Redis, Strapi, or complex API unless justified by a documented critical requirement.
- **Operational simplicity:** One person should be able to maintain content through the CMS. Design reusable page templates and clear content schemas.
- **Integrity:** Never manufacture reviews, testing results, authenticity claims, purchase counts, ratings, or seller approval. Clearly distinguish **hands-on tested**, **research-based**, and **not yet verified**. Avoid absolute promises such as “guaranteed authentic.” Include affiliate disclosures and an evidence/date-based seller-checking process.
- **Affiliate links:** Determine the permitted official TikTok affiliate-link workflow and any restrictions affecting external links; do not assume an ordinary product link automatically tracks commissions.
- **Format:** All Creatives deliverables must be Markdown (`.md`), without code implementation.

## Work Sequence

### Phase 1 — Clarify Product & Scope

Define the target audience (Philippine TikTok Shop shoppers), key consumer problem, trust proposition, traffic sources, primary conversion, editorial standards, and smallest feasible release. State assumptions rather than blocking on questions. Separate **must-have MVP**, **post-launch**, and **out of scope** items; include a rationale for every deferred feature.

### Phase 2 — Design User Experience

Prepare an information architecture and user journeys for:

1. Viewer clicks a TikTok profile/video link and opens the appropriate review.
2. Visitor scans verdict, evidence, authenticity cautions, pros/cons, and product specifications.
3. Visitor confirms seller/listing match and follows a disclosed affiliate link.
4. Visitor searches or browses other products by category.
5. Site owner creates, revises, publishes, and archives a review using Pages CMS.

Define pages: homepage, product/review detail, categories/search, review methodology, about, affiliate disclosure, privacy page, and useful 404. Specify responsive layouts and text-first wireframes, reusable components, information hierarchy, states (unverified, link unavailable, outdated check), navigation, and CTAs. Aim for practical, restrained, recognizable styling rather than a generic shopping clone.

### Phase 3 — Design Content Model & CMS Workflow

Specify the concrete content entities and fields, data types, required/optional status, validation, unique slug rules, and relationships. At minimum cover:

- **Product:** identifier/slug, name, brand, category, hero image, gallery, specifications, date created/updated.
- **Review:** product reference or embedded product strategy, short verdict, review type, score (if justified), pros, cons, review content, evidence, test date, publish status, last updated.
- **Seller/listing checks:** store name, marketplace listing URL, check date, observed evidence, status (`checked`, `caution`, `not verified`, `stale`), caveats; do not conflate listing check with proof of authenticity.
- **Affiliate:** official eligible link, association to reviewed listing, disclosure near CTA, broken/expired-link fallback.
- **Site settings (optional):** brand metadata, navigation, social links, default disclosure.

Recommend the simplest maintainable representation in Astro/Pages CMS (e.g., a single review entry embedding seller data versus multiple linked collections); explain tradeoffs and avoid complicated cross-file references without clear need. Show sample Markdown frontmatter and a **planning-level** `.pages.yml` outline, not full implementation. Describe the publish lifecycle, drafts, image management, GitHub permissions, automatic deployment, rollback, and what happens if a build fails. Confirm practical support for each CMS operation rather than assuming it exists.

### Phase 4 — Reliability, Trust & Operations

Plan for:

- CDN serving, image sizing/compression, caching behavior, mobile performance, metadata, sitemap, robots, canonical URLs, Open Graph previews, schema markup only where truthful/appropriate, and analytics.
- Traffic-spike behavior, Cloudflare Pages free-plan/build limits, GitHub repository/media growth, Pages CMS constraints, and plausible migration triggers.
- Safe external linking (`rel="sponsored nofollow noopener"` where applicable), affiliate disclosures, privacy-friendly analytics, accessibility, broken links, and basic abuse/security considerations.
- Review methodology and freshness policy: check dates visible to visitors, no unsupported 'verified' badges, clear distinction between product quality and seller credibility.
- Testing: usability, content validation, responsive QA, accessibility, SEO, broken links, deployment smoke tests, and CMS-to-live-site acceptance tests.

If internet verification is available, check official, current documentation for Pages CMS configuration and capabilities, Astro content collections, Cloudflare Pages free plan, and applicable TikTok Shop affiliate policies; cite sources and mark unverified assumptions clearly.

### Phase 5 — Produce Development Handoff

Create the following Markdown files:

1. **`product-brief.md`** — users, value proposition, success criteria, business flow, assumptions, MVP boundaries.
2. **`features.md`** — prioritized features with user stories, acceptance criteria, dependencies, and explicit exclusions.
3. **`ux-design.md`** — sitemap, journeys, wireframe descriptions, visual design direction, components, responsive/accessibility behavior.
4. **`content-model.md`** — content schemas, editorial rules, CMS fields/validation, examples and relationships.
5. **`implementation.md`** — **the authoritative build specification Forge will execute**, with the following sections in order:
   - Executive summary and exact MVP scope
   - Architecture and data/content flow diagram (Mermaid allowed)
   - Technology choices and why
   - Repository structure and conventions
   - CMS configuration plan and content schema
   - Route/page list and reusable component contracts
   - Content publishing workflow (create, edit, draft, archive, rollback)
   - SEO, performance, accessibility, affiliate compliance, analytics, and security requirements
   - Milestones broken into small, dependency-ordered coding tickets with IDs, priority, estimates as relative complexity (S/M/L), and clear acceptance criteria
   - Test plan, deployment steps, environment/secrets policy, and launch checklist
   - Risks, free-tier limits, fallback plans, and out-of-scope features
   - Definition of Done and **Forge handoff instructions**

Each ticket must be actionable without additional product design decisions. When external platform behavior is uncertain, mark a verification ticket before implementation. Avoid vague tasks such as “make the UI good.”

## Decision Rules

- Choose the smallest solution that achieves the main user journey; a database is not a prerequisite for dynamic CMS editing.
- Favor **one clear product-review template** and structured content over many individually authored pages.
- Prioritize trust, clarity, verified evidence, and correct affiliate destinations over animation or decorative design.
- Keep sensitive tokens out of GitHub; never require users to enter TikTok credentials into the website.
- Be honest about limitations: static rebuilds are not instant, affiliate tracking depends on platform rules, and free-tier quotas can change.
- Write any unresolved decisions in a clearly labeled **Open Questions & Assumptions** section, with recommended defaults.

## Final Quality Gate — Before Delegating to Forge

Self-review all five Markdown deliverables. Ensure every MVP feature maps to (a) a user journey, (b) CMS content fields if needed, (c) routes/components, (d) a coding ticket, and (e) an acceptance test. Check that all dependencies are ordered and there are no paid-only requirements, unsupported claims, or hidden backend assumptions. Then return a brief planning summary, prioritized risks, and the location of `implementation.md` for approval or handoff. **Forge must treat `implementation.md` as the source of truth and must not silently change scope.**
