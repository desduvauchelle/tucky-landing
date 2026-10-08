'use client'

import { useState } from 'react'
import type { Dictionary } from '@/i18n'
import { trackEvent, type EventLocation } from '@/components/analytics/GoogleAnalytics'

import { INSTALL_CMD } from '@/lib/tucky-repository'
export { INSTALL_CMD } from '@/lib/tucky-repository'

export function InstallBox({ dict, location = 'cta_section' }: { dict: Dictionary; location?: EventLocation }) {
	const [copied, setCopied] = useState(false)

	async function copy() {
		await navigator.clipboard.writeText(INSTALL_CMD)
		// The macOS install conversion — copying the command is as far as the site can take them.
		trackEvent('install_copy', { method: 'curl', platform: 'macos', location })
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<div className="inline-flex max-w-full flex-wrap items-center gap-3 rounded-[14px] border border-base-content/18 bg-elevated px-5.5 py-4.5 shadow-[0_24px_70px_rgba(18,59,45,0.10)]">
			<code className="text-left font-mono text-[13px] break-all text-primary">{INSTALL_CMD}</code>
			<button
				type="button"
				onClick={copy}
				aria-label={dict['cta.copy.aria']}
				className="btn btn-primary btn-sm shrink-0 gap-1.5 rounded-lg font-medium"
			>
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
					<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
					<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
				</svg>
				{copied ? dict['cta.copied'] : dict['cta.copy']}
			</button>
		</div>
	)
}
