import { GrowthEngineHandler } from '@growth-engine/sdk-server'

export const { GET, HEAD, POST } = GrowthEngineHandler({
	brainApiUrl: process.env.BRAIN_API_URL,
	brainApiKey: process.env.BRAIN_API_KEY,
	tursoUrl: process.env.TURSO_DATABASE_URL,
	tursoAuthToken: process.env.TURSO_AUTH_TOKEN,
	// Declares that THIS repo renders the structural internal links — the
	// `<RelatedArticles>` block and `<TopicChips>` on every post, the chips on
	// /blog, and the `/blog/topic/[slug]` hubs — not merely that it installs an
	// SDK version that ships them. `/api/rs/sdk-status` reports this flag and
	// Brain's orphan detection counts structural links only when it is true;
	// anything else counts links written into post bodies alone, which
	// over-reports orphans (the safe direction to be wrong in).
	//
	// If any of those pieces is ever removed from this repo, set this back to
	// false in the same commit. A wrong yes hides every orphan on the blog.
	structuralLinks: true,
})
