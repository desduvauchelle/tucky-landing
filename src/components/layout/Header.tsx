import { GITHUB_URL } from '@/lib/tucky-repository'
import Link from 'next/link'
import Image from 'next/image'
import type { Dictionary } from '@/i18n'
import { localizedPath } from '@/lib/i18n-utils'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileMenu } from './MobileMenu'
import { NavDropdown } from './NavDropdown'
import { NAV_GROUPS } from './nav.config'
import { TrackedLink } from '@/components/analytics/TrackedLink'

function GitHubLink() {
	return (
		<a
			href={GITHUB_URL}
			aria-label="Tucky on GitHub"
			title="Tucky on GitHub"
			className="btn btn-ghost btn-square shrink-0 text-base-content/70 hover:text-primary"
		>
			<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M12 .297a12 12 0 0 0-3.793 23.385c.6.111.82-.261.82-.577v-2.234c-3.338.726-4.043-1.416-4.043-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.839 1.237 1.839 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.419-1.305.762-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.323 3.301 1.23A11.52 11.52 0 0 1 12 6.098c1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.655 1.652.243 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.216.694.825.576A12.001 12.001 0 0 0 12 .297Z" />
			</svg>
		</a>
	)
}

export function Header({ dict, locale }: { dict: Dictionary; locale: string }) {
	const NAV_LINKS = [
		{ href: localizedPath('/', locale), label: dict['nav.home'] },
		{ href: localizedPath('/blog', locale), label: dict['nav.blog'] },
		{ href: localizedPath('/compare', 'en'), label: dict['nav.compare'] },
		{ href: `${localizedPath('/contact', locale)}#support`, label: dict['nav.support'] },
	]

	const mobileGroups = NAV_GROUPS.map((group) => ({
		label: dict[group.labelKey],
		href: localizedPath(group.hubPath, locale),
		items: group.itemKeys.map((item) => ({
			href: localizedPath(item.path, locale),
			label: dict[item.labelKey],
		})),
	}))

	return (
		<header className="navbar sticky top-0 z-50 border-b border-base-content/10 bg-base-100/85 backdrop-blur-xl">
			<div className="container mx-auto flex items-center justify-between px-4">
				<Link href={localizedPath('/', locale)} className="flex items-center gap-2.5 text-[17px] font-bold tracking-[-0.02em]">
					<Image src="/tucky.jpeg" alt="Tucky app icon" width={30} height={30} className="rounded-[7px]" />
					{'Tucky'}
				</Link>

				{/* Desktop nav */}
				<nav className="hidden items-center gap-4 xl:gap-6 lg:flex">
					<Link href={localizedPath('/', locale)} className="text-base-content/70 transition-colors hover:text-primary">
						{dict['nav.home']}
					</Link>
					{NAV_GROUPS.map((group) => (
						<NavDropdown key={group.hubPath} group={group} dict={dict} locale={locale} />
					))}
					<Link href={localizedPath('/blog', locale)} className="text-base-content/70 transition-colors hover:text-primary">
						{dict['nav.blog']}
					</Link>
					<Link href={localizedPath('/compare', 'en')} className="text-base-content/70 transition-colors hover:text-primary">{dict['nav.compare']}</Link>
					{/* Anchored at #support: the page leads with the install command,
					    but someone clicking "Support" wants the help section. */}
					<Link href={`${localizedPath('/contact', locale)}#support`} className="text-base-content/70 transition-colors hover:text-primary">
						{dict['nav.support']}
					</Link>
					<LanguageSwitcher locale={locale} />
					<ThemeToggle />
					<GitHubLink />
					<TrackedLink
						href={`${localizedPath('/', locale)}#install`}
						className="btn btn-primary btn-sm gap-2 rounded-[9px] font-semibold"
						eventName="install_cta_click"
						eventParams={{ location: 'header' }}
					>
						<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
							<polyline points="7 10 12 15 17 10" />
							<line x1="12" y1="15" x2="12" y2="3" />
						</svg>
						{dict['nav.download']}
					</TrackedLink>
				</nav>

				{/* Mobile nav — client component handles toggle state */}
				<div className="flex items-center gap-1 lg:hidden">
					<GitHubLink />
					<MobileMenu links={NAV_LINKS} groups={mobileGroups} locale={locale} />
				</div>
			</div>
		</header>
	)
}
