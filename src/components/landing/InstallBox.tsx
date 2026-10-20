'use client'

import type { Dictionary } from '@/i18n'
import { trackEvent, type EventLocation } from '@/components/analytics/GoogleAnalytics'

import { DOWNLOAD_URL } from '@/lib/tucky-repository'

export function InstallBox({ dict, location = 'cta_section' }: { dict: Dictionary; location?: EventLocation }) {

	return (
		<div className="mx-auto flex max-w-xl flex-col items-center gap-4">
			<a
				href={DOWNLOAD_URL}
				onClick={() => trackEvent('app_download', { method: 'dmg', platform: 'macos', location })}
				className="btn btn-primary min-h-12 rounded-xl px-7 text-base font-semibold"
			>
				{dict['nav.download']} <span aria-hidden="true">↓</span>
			</a>
			<p className="text-sm text-base-content/70">{dict['cta.instructions']}</p>
			<p className="text-xs text-base-content/60">{dict['cta.security']}</p>
		</div>
	)
}
