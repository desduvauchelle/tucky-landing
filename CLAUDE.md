# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working on this client site.

## Project Overview

This is a Next.js 15 client site built on the Growth Engine platform. It connects to the Brain backend via two SDK packages: `@growth-engine/sdk-client` (browser-safe React hooks) and `@growth-engine/sdk-server` (Node.js route handler). All SDK calls flow through `/api/rs/[...route]` which delegates to `GrowthEngineHandler`.

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm pull-forms` | Generate form Zod schemas into `src/generated/forms.ts`. **Broken on SDK 0.1.100** — the package's `bin` points at `dist/pull-forms.js`, which the GitHub release tarball does not have (the file sits at the package root). Nothing here depends on it; run the generator from the SDK directly, or fix it upstream |

## Tech Stack

- **Framework**: Next.js 15 (React 19, App Router)
- **Language**: TypeScript strict mode
- **Styling**: Tailwind CSS 4 + DaisyUI 5 component classes
- **Animations**: GSAP 3.12 + ScrollTrigger
- **Validation**: Zod
- **SDK**: `@growth-engine/sdk-client` (browser) + `@growth-engine/sdk-server` (server)

## Code Style

- No semicolons, single quotes, trailing commas
- `import type { ... }` for type-only imports
- Prefix unused vars with `_`
- Use `cn()` from `@/lib/utils` for conditional class names (clsx + twMerge)
- DaisyUI semantic classes (`btn`, `btn-primary`, `card`, `input`, `alert`, `loading`, `navbar`, `hero`, `join`, `form-control`, `label`, `label-text`) over raw Tailwind equivalents for UI elements
- Theme colors via DaisyUI tokens: `base-100`, `base-200`, `base-content`, `primary`, `error`, `success`
- Dark mode via `data-theme="dark"` attribute on `<html>`, toggled by `ThemeToggle` component
- Blog content uses `prose prose-lg` from `@tailwindcss/typography`

## Key Files

| Path | Purpose |
|------|---------|
| `src/app/api/rs/[...route]/route.ts` | SDK route handler — all SDK calls proxy through here |
| `src/app/layout.tsx` | Root layout: `GrowthEngineProvider`, `GoogleAnalytics` |
| `src/app/[locale]/layout.tsx` | Locale layout: passes `dict`/`locale` props to `Header`, `Footer` |
| `src/app/[locale]/page.tsx` | Landing page (Hero, Features, CTA, latest blog posts) |
| `src/app/[locale]/blog/page.tsx` | Blog listing with search + pagination |
| `src/app/[locale]/blog/[slug]/page.tsx` | Blog detail with `getBlogPost()` + local `RelatedPosts` |
| `src/app/[locale]/blog/authors/page.tsx` | Author index page |
| `src/app/[locale]/blog/authors/[slug]/page.tsx` | Author detail with bio + their posts |
| `src/app/[locale]/contact/page.tsx` | "Get Tucky" — install command first, GitHub support second. **No form** (see Adoption path below) |
| `src/app/[locale]/forms/[slug]/page.tsx` | Dynamic form page — renders any form by slug |
| `src/app/[locale]/privacy/page.tsx` | Privacy policy |
| `src/app/[locale]/legal/page.tsx` | Terms of service |
| `src/app/[locale]/cookies/page.tsx` | Cookie policy |
| `src/components/landing/` | Hero, Features, CTA (with scroll reveal animations) |
| `src/components/blog/` | RelatedPosts (local — replaces the SDK's), AllPostsIndex, AuthorByline, AuthorCard, AuthorChips. BlogList/BlogCard/BlogContent/BlogSearch come from the SDK |
| `src/app/[locale]/blog/topic/[slug]/page.tsx` | Topic hub (pillar) page — every post sharing a keyword, 404 for a non-hub slug |
| `src/lib/related-posts.ts` | The coverage cycle that keeps any post from becoming an orphan. Relevance ranking is the SDK's `getRelatedPosts` |
| `src/lib/post-keywords.ts` | `parseKeywords()` — Brain stores `keywords` as a JSON string; SDK 0.1.100's JSON-LD calls `.join()` on it |
| `src/components/layout/` | Header, Footer, ThemeToggle, LanguageSwitcher |
| `src/components/landing/InstallBox.tsx` | The curl install command + copy button. Fires `install_copy` — the site's primary conversion |
| `src/components/analytics/GoogleAnalytics.tsx` | GA4 script loader + `trackEvent()` helper |
| `src/hooks/useGsap.ts` | `useScrollReveal()` and `useGsap()` hooks, re-exports `gsap` |
| `src/i18n/config.ts` | `defaultLocale`, `supportedLocales`, `isMultiLang` from env vars |
| `src/i18n/index.ts` | `getDictionary()` server function with caching, `Dictionary` and `DictionaryKey` types |
| `src/i18n/dictionaries/{locale}.ts` | Flat key-value translation dictionaries |
| `src/lib/utils.ts` | `cn()` helper (clsx + twMerge) |
| `src/lib/env.ts` | Runtime env var checker (logs missing vars on startup) |
| `src/lib/i18n-utils.ts` | `formatDate(date, locale)`, `localizedPath(path, locale)` + `localePrefix(locale)` — the default-locale-is-bare URL rule for all internal links |
| `src/lib/seo.ts` | `buildPageMetadata({ path, locale, title, … })` — self-referencing canonical + hreflang + OG/Twitter for every page's `generateMetadata` |
| `src/lib/structured-data.ts` | `homeJsonLd` (Organization/WebSite/SoftwareApplication graph) + `breadcrumbLd` — page-level schema.org builders, all URLs via `buildUrl`. Rendered through `src/components/seo/JsonLd.tsx` |
| `src/proxy.ts` | CORS protection for `/api/` + locale detection/routing + 301 redirect of default-locale-prefixed URLs (`/en/…` → `/…`) |
| `src/generated/forms.ts` | Auto-generated form Zod schemas (via `pnpm pull-forms`) |
| `src/app/globals.css` | Tailwind + DaisyUI + typography plugin imports |
| `src/app/sitemap.xml/route.ts` | Sitemap index — points at `/sitemap/{id}.xml` shards |
| `src/app/sitemap/[file]/route.ts` | Sitemap shards: id 0 = static pages, 1..N = blog batches, N+1 = authors, N+2 = topic hubs |
| `src/components/product/hub-links.unit.test.ts` | Fails the build if `/features` or `/use-cases` stops linking to a subpage, reuses one generic anchor label, or lets a hub slab's `desc` fall back to the subpage `subtitle` |
| `src/lib/product-page-meta-title.unit.test.ts` | Fails the build if a `/features` or `/use-cases` page puts its H1 slogan in `<title>` instead of a `*.meta.title` key |
| `src/lib/sitemap-shared.ts` | Sitemap builders, hreflang grouping, XML serializers (manual route handlers — do NOT add `src/app/sitemap.ts`; Next 16 + `[locale]` segment makes the metadata convention unreliable) |
| `src/app/rss.xml/route.ts` | Blog RSS 2.0 feed. Served with `X-Robots-Tag: noindex` — feeds belong in readers, not the search index. The literal `rss.xml` segment wins over `[locale]`, so `/rss.xml` is the feed (not a phantom locale page). |
| `src/lib/rss-shared.ts` | Pure RSS renderer (`renderRssFeed`) + `FeedPost` shape. Item links use the same `buildUrl('/blog/<slug>', defaultLocale)` as the sitemap/canonical. |
| `src/app/robots.ts` | Robots.txt (allows all, disallows `/api/`) |

## SDK Reference

### sdk-client (browser-safe — only use in `'use client'` components)

| Hook / Function | Signature | Returns |
|---|---|---|
| `useContent` | `useContent('blog', { locale })` | `{ posts, loading, error }` |
| `fetchBlog` | `fetchBlog(slug, locale?)` | `Promise<BlogPost \| null>` — use in `useEffect`, not top level |
| `getBlogUrl` | `getBlogUrl(post)` | URL path string (`/blog/{urlPath or slug}`) |
| `getSocialPosts` | `getSocialPosts(platform)` | `Promise<SocialPost[]>` |
| `useAuthors` | `useAuthors()` | `{ authors, loading, error }` |
| `fetchAuthor` | `fetchAuthor(slug)` | `Promise<BlogAuthor \| null>` |
| `fetchAuthorPosts` | `fetchAuthorPosts(authorSlug, { locale?, limit?, offset? })` | `Promise<BlogPost[]>` |
| `useBusinessConfig` | `useBusinessConfig()` | `{ config, loading, error }` — hours, contact, address, SEO |
| `getHours` | `getHours()` | `Promise<object \| null>` |
| `getContactInfo` | `getContactInfo()` | `Promise<object \| null>` |
| `useForms` | `useForms()` | `{ forms, loading, error }` |
| `useForm` | `useForm(slug)` | `{ form, schema, loading, error }` — schema is a Zod object |
| `submitForm` | `submitForm(slug, data)` | `{ ok, id?, error?, validationErrors? }` |
| `buildFormSchema` | `buildFormSchema(fields)` | `z.ZodObject` from `FormField[]` |
| `pushLead` | `pushLead(data)` | `{ ok, contactId?, existing?, error? }` |
| `triggerBlogGen` | `triggerBlogGen(payload)` | Job response with `jobId` |
| `triggerSocialSync` | `triggerSocialSync(platforms?)` | Job response with `jobId` |
| `useJobStatus` | `useJobStatus(jobId)` | `{ job, loading, error, refresh }` |
| `useSDKStatus` | `useSDKStatus()` | `{ manifest, loading, error }` |
| `onAnalyticsEvent` | `onAnalyticsEvent({ eventType, page?, sessionId? })` | `Promise<void>` |
| `SDK_VERSION` | Constant | Current SDK version string |

### sdk-server (Node.js only — never import in client components)

Used exclusively in `src/app/api/rs/[...route]/route.ts`:

```ts
import { GrowthEngineHandler } from '@growth-engine/sdk-server'
export const { GET, POST } = GrowthEngineHandler({ brainApiUrl, brainApiKey, tursoUrl, tursoAuthToken })
```

This is listed in `serverExternalPackages` in `next.config.ts`.

## i18n

Locale routing uses a `[locale]` segment in all pages under `src/app/[locale]/`.

**How it works:**

- `src/i18n/config.ts` reads `DEFAULT_LANGUAGE` and `ADDITIONAL_LANGUAGES` env vars
- Single-language mode: middleware rewrites all paths to `/{defaultLocale}/...` transparently (no locale in URL)
- Multi-language mode: middleware detects locale from cookie (`ge-locale`) → `?lang=` param → `Accept-Language` header → default, then redirects to `/{locale}/path`

**Using translations in server components (pages and layouts):**

```tsx
import { getDictionary } from '@/i18n'
const dict = await getDictionary(locale)
dict['hero.title.line1']                              // simple lookup
dict['blog.load.error'].replace('{error}', msg)       // with variable interpolation ({varName} syntax)
```

**Passing translations to child components:**

```tsx
// In a page or layout (server component):
<Hero dict={dict} locale={locale} />
<Footer dict={dict} locale={locale} />
```

**Server-side (layouts):**

```tsx
import { getDictionary } from '@/i18n'
const dict = await getDictionary(locale)
```

**Translated locales that ship today:** `en` (source) plus `fr`, `es`, `de`, `pt`, `it`, `nl`, `pl`. A dictionary file existing is not enough — a locale is only routable once it is listed in `ADDITIONAL_LANGUAGES`.

**Adding a language:**

1. Create `src/i18n/dictionaries/{code}.ts` exporting a `Dictionary` object with all keys from `en.ts`
2. Add a `{code}: () => import('./dictionaries/{code}')` line to the `loaders` map in `src/i18n/index.ts`. Keep the specifier a string literal — a template literal would break bundler code-splitting. Anything not in the map falls back to English.
3. Set env: `ADDITIONAL_LANGUAGES=fr,{code}`
4. Add the endonym to `LOCALE_NAMES` in `src/components/layout/LanguageSwitcher.tsx` (that map, not the `lang.*` dictionary keys, is what the picker renders)

**Dictionary key convention:** flat dot-separated keys like `'blog.search.placeholder'`. All keys must exist in every dictionary (type-checked via `DictionaryKey` union from `en.ts`).

## Adoption path (read before adding a form or a "contact us" CTA)

**Tucky is free, needs no account, and installs with one Terminal line. There is nothing to ask us for before using it — so the site has no contact form, by design.**

The scaffold ships a generic "Contact Us" form (slug `contact-form`: name / email / message). It ran on `/contact` and took **0 submissions across 44 sessions**, because it does not match how anyone adopts this product. It was removed on 2026-08-03. `/contact` is now "Get Tucky": the install command first, GitHub support second.

**The conversion metric is `install_copy` and `app_download`, not form submissions.** Both carry a `location` param (`EventLocation` in `GoogleAnalytics.tsx`) so intent can be segmented by page. Mark both as key events in GA4. If you are ever asked why "conversions" are zero, check that the metric is not still pointed at `form_submit`.

Before adding any form here, it must clear one bar: *what does the visitor get that the install command does not already give them?* "Get in touch", "request a demo", and "join the waitlist" all fail that bar for a free, instantly-installable app.

**The form definition is server-authoritative and cannot be changed from this repo.** `submitForm()` re-fetches the form from Brain and validates against the *server's* field list, and `settings.successMessage` from the server overrides `translations.defaultSuccessMessage`. sdk-server exposes only `getFormBySlug`/`getActiveForms` — no create/update. Shrinking or relabelling a form's fields means editing it in the Brain admin UI; overriding `form.fields` in the `FormRenderer` prop changes only what renders, and submission will then fail validation against the untouched server schema.

**Note:** `contact-form` still exists in Brain and is still reachable at `/forms/contact-form` (and listed on `/forms`). Deactivate it in Brain if you want it gone entirely.

## Forms

`/forms/[slug]` — dynamic form page that renders any form by slug. Kept as scaffold infrastructure; nothing links to it.

**Usage pattern:**

```tsx
const { form, schema, loading } = useForm('contact-form')
// form.fields sorted by field.order, schema is a Zod object for validation
const result = await submitForm('contact-form', formData)
// result: { ok: true, id } | { ok: false, error?, validationErrors? }
```

Form fields must be sorted by `field.order` before rendering: `[...form.fields].sort((a, b) => a.order - b.order)`.

Supported field types: `text`, `email`, `tel`, `textarea`, `select`, `checkbox`, `number`, `url`.

Submissions automatically create CRM contacts (if email/name fields present) and trigger email notifications (if `notifyEmails` configured in form settings). Both are best-effort.

Run `pnpm pull-forms` to generate typed Zod schemas in `src/generated/forms.ts` for compile-time safety.

## Blog

- `useContent('blog', { locale })` fetches all published posts for the current locale
- `fetchBlog(slug, locale?)` fetches a single post — use inside `useEffect`, not at component top level
- `BlogList` handles client-side search filtering + pagination (9 posts per page)
- `BlogContent` renders HTML via `dangerouslySetInnerHTML` with `prose prose-lg` classes
- `RelatedPosts` — the LOCAL one ([src/components/blog/RelatedPosts.tsx](src/components/blog/RelatedPosts.tsx)), not the SDK's. See "Internal linking" below before switching back.
- `AllPostsIndex` renders every post as a plain link under the `/blog` grid — the crawlable half of the index
- `BlogPostCTA` ([src/components/blog/BlogPostCTA.tsx](src/components/blog/BlogPostCTA.tsx)) closes every post: install command (`install_copy`, `location: 'blog_post'`) + links to `/`, `/features`, `/use-cases`. It replaces the SDK `RelatedArticles` `cta` slot, which would point at the retired contact form
- Blog detail page uses `useParams()` to get `slug` and `locale`

### Internal linking (do not regress this)

**Structural internal linking, ported from the create-client-app template on 2026-09-17 with SDK 0.1.100.** Every post now carries 3–5 crawlable links to siblings plus links up to its topic hubs, all server-rendered anchors computed by the SDK from stored keywords — nothing to curate. Measured locally across 42 posts after the port: **every post has at least 3 inbound links (min 3, max 22), zero below the floor**, counting only post→post and hub→post anchors.

The four moving parts, all required together:

- **`<RelatedArticles>`** on `/blog/{slug}`, fed by `getRelatedPosts(db, post, { locale })`. Replaces the local `RelatedPosts` component (deleted): the SDK now ranks keyword/title overlap per post rather than slicing the same three posts, and — the reason not to re-rank here — it is the SAME ranking the seo-improvement loop re-runs, so the links it counts are the links really on the page.
- **`<TopicChips>`** on `/blog/{slug}` ("Filed under") and on `/blog` ("Browse by topic"), from `getBlogTopicsForPost` / `getBlogTopics`.
- **`/blog/topic/[slug]`** — the hub (pillar) pages. A hub appears automatically once two published posts share a keyword, lists all of them, and 404s for any slug that is not a hub. Listed in the sitemap by `buildTopicEntries` (shard `blogSitemapCount + 2`).
- **`structuralLinks: true`** in [src/app/api/rs/[...route]/route.ts](src/app/api/rs/[...route]/route.ts). Brain gates orphan detection on this flag, NOT on the SDK version, because bumping the dependency ports none of the pages above. `/api/rs/sdk-status` reports it. **If you remove any of the three pieces above, set this back to `false` in the same commit** — a wrong yes hides every orphan on the blog.

**The coverage cycle survived the port, in [src/lib/related-posts.ts](src/lib/related-posts.ts).** `getRelatedPosts` answers "what should this post link to", never "does anything link to that post", and those come apart: a post nothing resembles, too old to win a newest-first fallback slot, can be linked from nowhere. That is the failure measured here at 31 posts under the old SDK (three posts held 90 of 93 links; a crawl reported nine `orphan_page` findings). `withCoveragePost()` gives one of the 3–5 slots to the post's **successor in canonical order**, threading a cycle through every post so an orphan is structurally impossible — including a post that belongs to no topic hub. It replaces the weakest ranked slot, never adds a sixth, so the rendered set stays within the SDK's contract.

Still true, and still worked around:

- **`BlogList` paginates with `<button onClick={setPage}>`, not links.** There is no page-2 URL — `/blog?page=2` serves the same nine posts — so a crawler reading `/blog` sees nine of 42. `AllPostsIndex` below the grid is what makes the rest reachable. The topic hub page sets `postsPerPage` to its whole post count for the same reason: a pillar page that paginates hides the links it exists to hand out.

If you replace any of these, re-check that every published post still has an inbound link from a server-rendered `<a>` — the unit tests cover the selection rules, not the wiring.

**SDK 0.1.100 landmine — `post.keywords` is a STRING.** `getBlogPost()` returns the raw database row, and Brain stores `keywords` as a JSON-encoded array *string*. SDK 0.1.100 added `keywords` to the `BlogPosting` JSON-LD that `BlogContent` emits and calls `.join(', ')` on whatever it gets, so every post page threw during render and Next served its error shell: HTTP 200, `<meta name="robots" content="noindex">`, no article, no links. The post page normalises the field with `parseKeywords()` from [src/lib/post-keywords.ts](src/lib/post-keywords.ts) before handing the post to `BlogContent`. Keep that call. Anything else passing a raw post into an SDK component that reads `keywords` needs the same treatment.

## Authors

- `getBlogAuthors(db)` lists all authors; `getBlogAuthor(db, slug)` looks one up by slug; `getBlogAuthorById(db, id)` looks one up by id (used to resolve `post.authorId`).
- `getAuthorPosts(db, slug, { locale, limit })` returns published posts for an author in a given locale.
- The blog list page (`/blog`) renders `<AuthorChips />` above the post grid; each chip links to `/blog/authors/{slug}`.
- The blog detail page (`/blog/{slug}`) renders `<AuthorByline />` between the date and the content, and passes the author into `<BlogContent />` for `Person` JSON-LD.
- v1 limitation: `BlogAuthor.bio` is locale-agnostic. UI chrome translates; bio text does not.

## GSAP Animations

Two hooks in `src/hooks/useGsap.ts`:

**`useScrollReveal(options?)`** — attach ref to element, it animates in on scroll:

```tsx
const ref = useScrollReveal<HTMLDivElement>({ y: 40, stagger: 0.15 })
<div ref={ref}>...</div>
```

Options (defaults): `y` (40), `x` (0), `opacity` (0), `duration` (0.8), `delay` (0), `stagger` (none — set to animate children), `start` ('top 85%'), `ease` ('power2.out').

**`useGsap(callback, scope, deps)`** — full GSAP control with auto-cleanup:

```tsx
const container = useRef<HTMLDivElement>(null)
useGsap(() => {
  gsap.from('.card', { opacity: 0, y: 40, stagger: 0.1 })
}, container, [])
```

Import `gsap` and `ScrollTrigger` from `@/hooks/useGsap` (re-exported with plugin registered).

## Analytics

GA4 via `NEXT_PUBLIC_GA_MEASUREMENT_ID` env var. No scripts loaded when unset.

```tsx
import { trackEvent } from '@/components/analytics/GoogleAnalytics'
trackEvent('install_copy', { method: 'curl', platform: 'macos', location: 'hero' })  // no-op when GA not configured
```

Events: `install_copy` and `app_download` are the conversions — mark both as key events in GA4. `install_cta_click` and `cta_click` are intent only (they scroll to the install section). Every one takes a `location` param from the `EventLocation` union.

## Environment Variables

| Variable | Required | Scope | Purpose |
|----------|----------|-------|---------|
| `BRAIN_API_URL` | Yes | Server | Brain instance URL |
| `BRAIN_API_KEY` | Yes | Server | API key (`brain_live_...` or `brain_test_...`) |
| `TURSO_DATABASE_URL` | Yes | Server | Client Turso SQLite URL |
| `TURSO_AUTH_TOKEN` | Yes | Server | Turso auth token |
| `SITE_URL` | No | Server | Base URL for sitemap/robots (falls back to Vercel URL) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Client | GA4 measurement ID (`G-XXXXXXXXXX`) |
| `DEFAULT_LANGUAGE` | No | Server | Default locale (default: `en`) |
| `ADDITIONAL_LANGUAGES` | No | Server | Comma-separated locales (e.g. `fr,es,de`) |

The four required vars are server-only. Never prefix them with `NEXT_PUBLIC_`.

## Gotchas

- **sdk-client is browser-only.** Only import `@growth-engine/sdk-client` in `'use client'` components. It uses React hooks internally.
- **sdk-server is server-only.** Listed in `serverExternalPackages` in `next.config.ts`. Never import it in client components.
- **All pages are under `[locale]`.** Even in single-language mode, the file structure uses `src/app/[locale]/`. Middleware handles the rewrite so URLs don't show the locale prefix.
- **`params` is a Promise in Next.js 15.** Always `const { locale } = await params` in layouts and pages.
- **`fetchBlog` is not a hook.** Use it inside `useEffect`, not at component top level. It returns a `Promise<BlogPost | null>`.
- **Form field order matters.** Always sort by `field.order` before rendering: `[...form.fields].sort((a, b) => a.order - b.order)`.
- **DaisyUI 5 class names.** Use DaisyUI component classes (`btn`, `card`, `input`, `alert`, `navbar`, `hero`, `join`, `loading`, `form-control`, `label`, `label-text`), not raw Tailwind equivalents, for UI elements.
- **Tailwind v4 CSS syntax.** `globals.css` uses `@import 'tailwindcss'` and `@plugin 'daisyui'` — not `@tailwind base/components/utilities`.
- **`cn()` for class merging.** Use `cn()` from `@/lib/utils` instead of raw string concatenation when combining conditional classes.
- **Theme uses `data-theme` attribute**, not CSS `prefers-color-scheme`. Toggle is in `ThemeToggle` component, persisted in `localStorage`.

## Common Patterns

**New page:** Create `src/app/[locale]/your-page/page.tsx` as an async server component. Use `getDictionary(locale)` for translations. Add dictionary keys to all locale files. **Always** export a `generateMetadata` that returns `buildPageMetadata({ path, locale, title, description })` (see SEO below) — this gives the page a self-referencing canonical and a unique title.

**New component:** Place in `src/components/{category}/`. Use DaisyUI classes. Accept props — let pages fetch via SDK hooks and pass data down.

**Links between pages:** ALWAYS build hrefs with `localizedPath(path, locale)` from `@/lib/i18n-utils` — e.g. `` <Link href={localizedPath('/blog', locale)}> ``. NEVER hand-write `` `/${locale}/blog` ``. See the SEO section for why.

**Loading states:** Use DaisyUI spinner: `<span className="loading loading-spinner loading-lg" />`

**Error states:** Use DaisyUI alert: `<div className="alert alert-error"><span>{error}</span></div>`

## SEO & URLs (read before adding any page or link)

**The one rule: the default language lives at the site root with NO locale segment; secondary languages are prefixed.** `DEFAULT_LANGUAGE` (default `en`) → `/blog/my-post`. `ADDITIONAL_LANGUAGES` (e.g. `fr`) → `/fr/blog/my-post`. There is no `/en/...`.

**Why this matters (the bug this prevents):** if internal links point at one URL form (`/en/blog/x`) while the `<link rel="canonical">` and `sitemap.xml` point at another (`/blog/x`), Google sees the "canonical" URL has zero internal links, assigns it near-zero crawl priority, and leaves pages in *"Discovered – currently not indexed."* All three signals — internal links, canonical, sitemap — MUST point at the same URL.

**How the template keeps them aligned — never break these:**

- **Links:** build every href with `localizedPath(path, locale)` ([src/lib/i18n-utils.ts](src/lib/i18n-utils.ts)). For SDK blog/form components (`BlogCard`, `BlogList`, `FormCard`), pass `localePrefix={localePrefix(locale)}`. The local `RelatedPosts` and `AllPostsIndex` derive it from `locale` themselves. Never hand-write `` `/${locale}/...` `` — a unit test ([src/lib/no-hardcoded-locale-links.unit.test.ts](src/lib/no-hardcoded-locale-links.unit.test.ts)) fails the build if you do.
- **Canonical + title:** every page's `generateMetadata` returns `buildPageMetadata({ path, locale, title, description })` ([src/lib/seo.ts](src/lib/seo.ts)). It emits a self-referencing canonical (`buildUrl(path, locale)`), unique branded title, hreflang `alternates.languages` (+ `x-default`) in multi-lang mode, and OpenGraph/Twitter tags. The path is the **locale-agnostic** path (`''`, `/blog`, `/blog/${slug}`).
- **Sitemap:** generated from the same `buildUrl` in [src/lib/sitemap-shared.ts](src/lib/sitemap-shared.ts) — already bare for the default locale. Add any new static route to `STATIC_PAGES`.
- **Redirect:** [src/proxy.ts](src/proxy.ts) 301-redirects any default-locale-prefixed URL (`/en/...` → `/...`, `/en` → `/`) so the prefixed form can't become an indexable duplicate. Secondary locales (`/fr/...`) are served as-is.
- **Host:** `SITE_URL` must be the single canonical host (pick www-or-apex, configure the apex→www 301 in Vercel domains). `metadataBase` in [src/app/layout.tsx](src/app/layout.tsx) makes all absolute asset/OG URLs use it.
- **Structured data:** page-level schema.org lives in [src/lib/structured-data.ts](src/lib/structured-data.ts), rendered via `<JsonLd />` ([src/components/seo/JsonLd.tsx](src/components/seo/JsonLd.tsx)): the homepage emits an Organization/WebSite/SoftwareApplication graph (`homeJsonLd`), and use-case/blog/authors/contact pages emit `BreadcrumbList` (`breadcrumbLd`; use-case pages pass `breadcrumbs` through `ProductPageProps`). Every URL in every node goes through `buildUrl` so JSON-LD matches canonical/sitemap URL forms — locked by [src/lib/structured-data.unit.test.ts](src/lib/structured-data.unit.test.ts). Blog posts get `BlogPosting` JSON-LD via `<BlogContent canonicalUrl={buildUrl(...)} />`; features + /loops + the use-cases hub emit `FAQPage`. The `BusinessJsonLd` in [src/app/[locale]/layout.tsx](src/app/[locale]/layout.tsx) renders ONLY when the Brain business config has a `name` — it is currently empty, so it emits nothing (which is why the 2026-08 crawl flagged `missing_structured_data` despite the layout wiring). Never fabricate `aggregateRating`/`review` markup.
- **Locale guard (do NOT remove):** the `[locale]` segment matches ANY first path segment, so bogus requests (`/rss.xml/legal`, `/index.iml/...` from bot probes or stale links on a prior site) would otherwise render a real page at HTTP 200 with a self-referencing canonical to the garbage URL — the GSC *"Duplicate without user-selected canonical"* bug. [src/app/[locale]/layout.tsx](src/app/[locale]/layout.tsx) calls `notFound()` for any segment that isn't a configured locale (`isSupportedLocale` in [src/i18n/config.ts](src/i18n/config.ts)), so phantom URLs return 404 and Google drops them. Covered by [src/i18n/config.unit.test.ts](src/i18n/config.unit.test.ts) + the scaffold integration test's bogus-segment 404 cases.
- **RSS feed is `noindex`:** the blog feed at `/rss.xml` ([src/app/rss.xml/route.ts](src/app/rss.xml/route.ts)) is served with an `X-Robots-Tag: noindex` header so it (and any `/rss.xml/...` URLs crawlers derive from it) stays out of Google's index — feeds are for readers, not search. Pages advertise it via a site-wide `<link rel="alternate" type="application/rss+xml">` (added in `buildPageMetadata`'s `alternates.types`). If you ever add a second feed (Atom, per-locale), serve it `noindex` too.
- **AI crawlers are explicitly allowed:** [src/app/robots.ts](src/app/robots.ts) emits two groups — the `*` group, and a named `AI_CRAWLERS` group (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, PerplexityBot, CCBot, …) that declares the allow-posture rather than leaving it incidental. Being cited by ChatGPT/Claude/Perplexity is a primary discovery channel for this product. `Google-Extended` and `Applebot-Extended` are robots.txt-**only** tokens with no live user-agent — naming them here is the only way to declare their posture, and you cannot test them with a request. **The footgun: robots.txt is most-specific-group-wins, NOT merge.** A crawler named in the AI group obeys *only* that group and ignores `*` entirely, which is why the AI group repeats `Disallow: /api/`. Drop that line and every AI crawler gains `/api/`. [src/app/robots.unit.test.ts](src/app/robots.unit.test.ts) locks this invariant.

## Indexing: why pages sit in "Crawled – currently not indexed" (investigated 2026-08-30)

Search Console showed **48 known pages, 12 indexed**, stuck at exactly 12 since 2026-08-14 — the
homepage plus 18 others in *Crawled – currently not indexed*, and 15 in *Discovered – currently not
indexed*. A full sweep of all 55 sitemap URLs was run to find the cause. **The technical layer is not
the blocker — do not go looking for one again.** Verified live, every URL:

| Checked | Result |
|---|---|
| HTTP status | 55/55 return 200 |
| Canonical | 55/55 self-referencing, exact string match to the sitemap `<loc>` |
| `noindex` / robots.txt | none anywhere; robots.txt allows all but `/api/` |
| Server-rendered body | 1,300–2,400 words on every blog post; 186–1,711 on statics — nothing client-only |
| Titles / descriptions | zero duplicates across all 55 |
| `<h1>` | exactly one per page |
| JSON-LD | present on 52/55 (only `/privacy`, `/legal`, `/cookies` have none, correctly) |
| Internal links | `/blog` server-renders anchors to all 36 posts — no orphans |
| TTFB | 0.22–0.40s |
| Locale guard | `/bogus/legal` → 404; `/en/blog` → 301 `/blog` |

**The two real causes, in order of weight:**

1. **Host authority.** `tucky.ai-juicing.com` (formerly `echo-scribe.ai-juicing.com`; Search Console property re-based to `sc-domain:tucky.ai-juicing.com` around 2026-09-22) is a young subdomain of a platform domain with
   essentially no external inbound links. Google evaluates a subdomain largely on its own signals, and
   with near-zero authority it applies a low indexing quota — it will crawl a page, judge it not worth
   an index slot *yet*, and move on. That is precisely the "Crawled – currently not indexed" state, and
   **no change in this repo can fix it.** It is fixed off-site: earn real inbound links, get the app
   listed in Mac software directories/aggregators, and — the highest-leverage move — **serve the site
   from its own apex domain** rather than a subdomain of a shared platform host.
2. **Topical redundancy inside the blog.** Google indexes one representative from a redundant cluster.
   There are at least three clusters competing with themselves, measured at 36 posts:
   - **Granola ×4** — `granola-vs-echoscribe`, `granola-vs-echoscribe-ai-meeting-assistant`,
     `echoscribe-free-alternative-to-granola`, `echoscribe-granola-alternative-privacy`
   - **Wispr Flow ×4** — `wispr-flow-vs-echo-scribe`,
     `wispr-flow-vs-echo-scribe-cloud-dictation-private-voice`,
     `the-best-free-alternative-to-wispr-flow-for-mac-users`,
     `5-wispr-flow-alternatives-for-every-kind-of-voice-worker`
   - **local-vs-cloud ×2+** — `local-ai-meeting-assistant-vs-cloud`,
     `local-vs-cloud-meeting-assistant-privacy`

   The prose is NOT copy-pasted (8-gram Jaccard between any pair is ≤0.013 — they were written
   independently), so this is *keyword cannibalization*, not duplicate content. The fix is editorial and
   **lives in Brain/Turso, not in this repo** (see the blog-content note): merge each cluster into one
   strong post and 301 the losers via `PERMANENT_REDIRECTS` in [src/proxy.ts](src/proxy.ts). Adding a
   fifth post to any of these clusters makes the problem worse, not better.

**What WAS fixed in the repo (2026-08-30), and why each mattered:**

- **Five ProductPages shipped their H1 slogan as `<title>`.** `/features/capture` was literally
  `<title>It all starts with your voice. | Tucky</title>`; `/use-cases` was "Built for the way
  you actually work."; `/blog/authors` was the bare word **"Authors"** with no brand at all (a
  `brand: false` meant for the homepage). Five sibling pages already had a `*.meta.title` key written
  for exactly this reason — the convention existed and half the section missed it. Titles that name no
  product, platform, or query are a direct negative when Google is deciding whether a page earns an
  index slot. Locked by [src/lib/product-page-meta-title.unit.test.ts](src/lib/product-page-meta-title.unit.test.ts).
- **`/forms` and `/forms/contact-form` were fully indexable orphans.** 200, self-canonical, no
  `noindex`, nothing linking to them, not in the sitemap — and `contact-form` is the very form retired
  from `/contact` for taking 0 submissions in 44 sessions. Thin orphan URLs are the exact shape of
  "Crawled – currently not indexed", and on a host this short of authority they spend crawl budget the
  blog needs. Both now emit `robots: { index: false, follow: true }`.
- **All 18 static sitemap entries had no `<lastmod>`.** Blog and author URLs carry a real one from the
  CMS; the statics — the pages that sat longest in *Discovered – currently not indexed* — threw away the
  one crawl-scheduling signal the site controls. Now supplied by the hand-maintained
  `STATIC_PAGE_LASTMOD` map in [src/lib/sitemap-shared.ts](src/lib/sitemap-shared.ts). **Update a
  page's date when you change its copy, headings, or metadata.** Never wire it to `new Date()` — a
  sitemap whose `lastmod` is always "now" gets the field ignored site-wide.

**Two known-open items, deliberately not changed:**

- **Nothing on the site is ever cached.** Every HTML response is
  `cache-control: private, no-cache, no-store` with `x-vercel-cache: MISS`, including the 18 static
  marketing pages, because `[locale]/layout.tsx` hits Turso via `getBusinessConfig` on every render and
  the layout sets no `revalidate`. It does not block indexing, but it makes every Googlebot fetch a
  live DB round-trip. Worth fixing; needs a real production build to verify, which is why it was left.
- **Thin static pages.** `/blog/authors` (107 words, one author), `/cookies` (186), `/legal` (194),
  `/privacy` (236), `/contact` (273), and the four use-case pages (325–396) are all well under the
  1,300+ the blog posts carry. Boilerplate legal pages going unindexed is normal and harmless; the
  use-case pages going unindexed is not — they are the commercial pages and they need more substance.

## Third-party SEO audits: what was verified false (2026-09-02)

An external audit reported 11 issues on the Next.js pages. Most did not survive being checked
against the code, and the same claims tend to recur — **measure before acting on any of them again:**

| Claim | Reality |
|---|---|
| "No `<link rel=canonical>`; add one" | Every page has emitted a self-referencing canonical since `buildPageMetadata` — [src/lib/seo.ts](src/lib/seo.ts) |
| "`/` and `/` are duplicates; add a trailing-slash 301" | `trailingSlash: false` is pinned in [next.config.ts](next.config.ts) and Next already 308s `/blog/` → `/blog`. A bare domain and a domain with `/` are the same URL (RFC 3986) |
| "`/features/capture` repeats the homepage (~40%)" | **0.0%** 8-gram overlap |
| "`/use-cases/consultants` and `/use-cases/sales-teams` repeat `/features/capture` (~60%)" | **0.0%** both |
| "`/loops` restates the homepage" | **0.0%** |
| "`/features` and `/use-cases` are card lists with no unique substance" | Both already carried ~2 intro paragraphs + 3 FAQs with `FAQPage` JSON-LD |
| "Give `/contact` a contact form" | Contradicts a measured decision — see **Adoption path**. The form took 0 submissions in 44 sessions and was removed |

No two pages on this site share meaningful prose. The thin-content problem here has never been
duplication; it was **word count and internal linking**, which is what was actually fixed.

**What the audit missed, and what was fixed instead:**

- **The hubs linked to nothing.** `Slab` had no href, so `/features` and `/use-cases` — pages whose
  entire job is to introduce the eight pages beneath them — contained zero body links to those pages;
  their only internal link was the header dropdown. Each hub slab now carries `href` + a descriptive
  `linkLabel` built from `product.slab.explore` (`'Explore {name}'`), so the anchor text names the
  destination instead of repeating "Learn more" four times. Locked by
  [src/components/product/hub-links.unit.test.ts](src/components/product/hub-links.unit.test.ts).
- **Hub slabs duplicated their subpage's `subtitle` verbatim.** That was the only real duplication on
  the site. Each now has its own `*.hubdesc` key; the test above fails if a slab `desc` ever equals a
  `*.subtitle` again.
- **The four use-case pages were the only ProductPages with no `intro` and no `faqs`** — which is
  precisely why they measured thinnest (205–284 words). They now use the same `introFor`/`faqsFor`
  helpers every `/features/*` page already used: 530–617 words each, plus `FAQPage` JSON-LD.
- **`/contact` gained an install FAQ** (187 → 562 words) covering what the curl command does, system
  requirements, the absence of a Homebrew formula, updating, and data location/removal. Substance that
  serves adoption — not a form.

**The metric to watch is the indexed count in GSC, not the crawl score.** The crawl score was already
99/100 while 36 of 48 pages went unindexed — it measures the layer that was never broken.

**Checklist when adding a page:** ① links via `localizedPath` ② `generateMetadata` → `buildPageMetadata` with the locale-agnostic path ③ add to `STATIC_PAGES` if it's a static route ④ unique title/description — and if the page's `*.title` key is an H1 slogan (every `ProductPage` under `/features` and `/use-cases` is), give it a separate `*.meta.title` key that names the product and the query, never the slogan. If it should NOT be indexed (demo/preview), add `robots: { index: false }` to its metadata.
