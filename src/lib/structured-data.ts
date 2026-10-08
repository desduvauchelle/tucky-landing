import type { Dictionary } from '@/i18n'
import { SITE_NAME } from './seo'
import { SITE_URL, buildUrl } from './sitemap-shared'

/**
 * Page-level schema.org builders (fixes the crawl's `missing_structured_data`
 * notices on template pages; blog posts carry their own BlogPosting/FAQ
 * markup).
 *
 * Every URL in every node goes through `buildUrl`, so structured data points at
 * the exact same URL form as the canonical tag, internal links, and sitemap —
 * the alignment invariant the whole SEO setup depends on. Never hand-compose an
 * absolute URL here.
 */

/** Public code/profile home. Also linked from the Footer and /contact. */
import { GITHUB_URL } from '@/lib/tucky-repository'

/** Stable Organization node id that other nodes reference via `@id`. */
const ORG_ID = `${SITE_URL}/#organization`

/** Stable WebSite node id, so the site is one entity across pages. */
const SITE_ID = `${SITE_URL}/#website`

export interface Crumb {
	/** Localized label for this step of the trail. */
	name: string
	/** Locale-AGNOSTIC path (`''` = home, `'/use-cases'`, …); resolved via `buildUrl`. */
	path: string
}

/**
 * BreadcrumbList for one page. Pass the full trail from Home down to (and
 * including) the page itself — search results then show the site hierarchy
 * instead of a raw URL, and answer engines can place the page in the site's
 * topology.
 */
export function breadcrumbLd(crumbs: Crumb[], locale: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: crumbs.map((crumb, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: crumb.name,
			item: buildUrl(crumb.path, locale),
		})),
	}
}

/**
 * Homepage entity graph: who publishes the site (Organization), what the site
 * is (WebSite), and what the product is (SoftwareApplication). One connected
 * graph — WebSite and SoftwareApplication point back at the Organization via
 * `@id` — so engines resolve a single brand entity, not three disconnected
 * nodes.
 *
 * Only claims the site itself makes: free (price 0, "Download free"
 * everywhere), macOS (the supported install path on /contact). Do NOT add
 * `aggregateRating`/`review` without real collected ratings — fabricated review
 * markup risks a Google manual action.
 */
export function homeJsonLd(locale: string, dict: Dictionary) {
	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				'@id': ORG_ID,
				name: SITE_NAME,
				url: SITE_URL,
				description: dict['home.meta.description'],
				logo: `${SITE_URL}/tucky.jpeg`,
				sameAs: [GITHUB_URL],
			},
			{
				'@type': 'WebSite',
				'@id': SITE_ID,
				name: SITE_NAME,
				url: SITE_URL,
				// Which language THIS rendering of the homepage is in — the hreflang
				// set already tells engines the other renderings exist.
				inLanguage: locale,
				publisher: { '@id': ORG_ID },
			},
			{
				'@type': 'SoftwareApplication',
				name: SITE_NAME,
				description: dict['home.meta.description'],
				url: buildUrl('', locale),
				applicationCategory: 'BusinessApplication',
				operatingSystem: 'macOS',
				// The adoption page ("Get Tucky"): install command + installers.
				downloadUrl: buildUrl('/contact', locale),
				offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
				publisher: { '@id': ORG_ID },
			},
		],
	}
}
