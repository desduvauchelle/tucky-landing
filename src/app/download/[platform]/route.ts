import { NextResponse } from 'next/server'

// Direct-download resolver. GitHub release asset filenames carry the version
// (e.g. `Tucky-aarch64.tar.gz`), so a hardcoded asset URL breaks on
// every release. Instead we ask the GitHub API for the latest release at request
// time and 302 the browser straight at the matching asset — always current, no
// GitHub page, no picking. Falls back to the releases page if anything fails.

import { GITHUB_REPO } from '@/lib/tucky-repository'
const LATEST_RELEASE_API = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`
const RELEASES_PAGE = `https://github.com/${GITHUB_REPO}/releases/latest`

// Cache the resolved redirect for an hour: new releases propagate within an hour
// and GitHub's unauthenticated API rate limit (60/h) is never a concern.
export const revalidate = 3600

type GithubAsset = { name: string; browser_download_url: string }

// Match an asset filename to a platform, ignoring version/arch noise in the name.
const PLATFORM_MATCHERS: Record<string, (name: string) => boolean> = {
	mac: (name) => name.endsWith('.dmg') || name.endsWith('.tar.gz'),
}

export function selectMacAsset(assets: GithubAsset[]): GithubAsset | undefined {
	const matchingAssets = assets.filter((asset) => PLATFORM_MATCHERS.mac(asset.name))
	return matchingAssets.find((asset) => /^Tucky-/i.test(asset.name)) ?? matchingAssets[0]
}

export async function GET(_req: Request, { params }: { params: Promise<{ platform: string }> }) {
	const { platform } = await params
	if (platform === 'windows') return new NextResponse(null, { status: 404 })
	const matcher = PLATFORM_MATCHERS[platform]
	if (!matcher) return NextResponse.redirect(RELEASES_PAGE, 302)

	try {
		const res = await fetch(LATEST_RELEASE_API, {
			headers: {
				Accept: 'application/vnd.github+json',
				'User-Agent': 'tucky-landing',
			},
			next: { revalidate },
		})
		if (!res.ok) throw new Error(`GitHub API responded ${res.status}`)

		const release = (await res.json()) as { assets?: GithubAsset[] }
		// A compatibility EchoScribe archive is published beside the Tucky
		// archive for older app updaters. Prefer the visibly branded asset here.
		const asset = platform === 'mac'
			? selectMacAsset(release.assets ?? [])
			: release.assets?.find((candidate) => matcher(candidate.name))
		if (!asset) throw new Error(`No ${platform} asset in latest release`)

		return NextResponse.redirect(asset.browser_download_url, 302)
	} catch {
		// GitHub unreachable or no matching asset — send them to the releases page.
		return NextResponse.redirect(RELEASES_PAGE, 302)
	}
}
