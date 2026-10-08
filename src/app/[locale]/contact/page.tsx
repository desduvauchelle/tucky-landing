import type { Metadata } from 'next'
import { getDictionary } from '@/i18n'
import type { Dictionary, DictionaryKey } from '@/i18n'
import { buildPageMetadata } from '@/lib/seo'
import { breadcrumbLd } from '@/lib/structured-data'
import { JsonLd } from '@/components/seo/JsonLd'
import { Eyebrow } from '@/components/landing/Eyebrow'
import { ScrollReveal } from '@/components/landing/ScrollReveal'
import { InstallBox } from '@/components/landing/InstallBox'

import { GITHUB_URL } from '@/lib/tucky-repository'

/**
 * Tucky is free, needs no account, and installs with one Terminal line —
 * so there is nothing to "get in touch" about before using it. This page is the
 * adoption path, not a contact form: install command first, support second.
 *
 * The route stays `/contact` because it is already indexed, sitemapped, and
 * referenced from the legal pages. The header links `/contact#support` so a
 * visitor who clicks "Support" lands on the help section rather than the install.
 */
const HELP_LINKS: { href: string; title: DictionaryKey; desc: DictionaryKey; cta: DictionaryKey }[] = [
	{
		href: `${GITHUB_URL}/issues`,
		title: 'support.help.issues.title',
		desc: 'support.help.issues.desc',
		cta: 'support.help.issues.cta',
	},
	{
		href: `${GITHUB_URL}/releases`,
		title: 'support.help.releases.title',
		desc: 'support.help.releases.desc',
		cta: 'support.help.releases.cta',
	},
	{
		href: GITHUB_URL,
		title: 'support.help.source.title',
		desc: 'support.help.source.desc',
		cta: 'support.help.source.cta',
	},
]

/**
 * Install/troubleshooting FAQ. `/contact` carries no form by design, which left
 * it the thinnest page on the site — this is the substance that belongs on an
 * adoption page: what the command does, what it needs, and how to undo it.
 * Also emits FAQPage JSON-LD.
 */
const INSTALL_FAQS: { q: DictionaryKey; a: DictionaryKey }[] = [1, 2, 3, 4, 5, 6].map((n) => ({
	q: `support.faq${n}.q` as DictionaryKey,
	a: `support.faq${n}.a` as DictionaryKey,
}))

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>
}): Promise<Metadata> {
	const { locale } = await params
	const dict = await getDictionary(locale)
	return buildPageMetadata({
		path: '/contact',
		locale,
		title: dict['support.heading'],
		description: dict['support.meta.description'],
	})
}

export default async function GetTuckyPage({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const dict: Dictionary = await getDictionary(locale)

	const requirements = [
		dict['cta.meta.macos'],
		dict['cta.meta.chips'],
		dict['cta.meta.update'],
		dict['cta.meta.models'],
	]

	return (
		<main>
			<JsonLd
				data={breadcrumbLd(
					[
						{ name: dict['nav.home'], path: '' },
						{ name: dict['support.heading'], path: '/contact' },
					],
					locale,
				)}
			/>
			<JsonLd
				data={{
					'@context': 'https://schema.org',
					'@type': 'FAQPage',
					mainEntity: INSTALL_FAQS.map((f) => ({
						'@type': 'Question',
						name: dict[f.q],
						acceptedAnswer: { '@type': 'Answer', text: dict[f.a] },
					})),
				}}
			/>
			{/* Install — the actual conversion. Copying the command is as far as
			    the site can take someone; `install_copy` fires on that click. */}
			<section className="border-b border-base-content/10 bg-base-100 py-20 text-center">
				<div className="container mx-auto max-w-[1080px] px-6">
					<ScrollReveal y={30}>
						<Eyebrow className="mb-5">{dict['support.eyebrow']}</Eyebrow>

						<h1 className="mb-3.5 text-[clamp(28px,4vw,46px)] font-extrabold tracking-[-0.03em]">
							{dict['support.heading']}
						</h1>
						<p className="mx-auto mb-10 max-w-2xl text-lg text-base-content/70">{dict['support.subtitle']}</p>

						<InstallBox dict={dict} location="contact_page" />


						<div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-1 text-[13px] text-base-content/50">
							{requirements.map((item, i) => (
								<span key={item} className="flex items-center gap-5">
									{i > 0 && <span aria-hidden="true">·</span>}
									{item}
								</span>
							))}
						</div>
					</ScrollReveal>
				</div>
			</section>

			{/* Support — GitHub is the real channel for a free, no-account app. */}
			<section id="support" className="scroll-mt-20 bg-base-200 py-20">
				<div className="container mx-auto max-w-[1080px] px-6">
					<ScrollReveal y={30}>
						<div className="mb-12 text-center">
							<Eyebrow className="mb-5">{dict['support.help.eyebrow']}</Eyebrow>
							<h2 className="mb-3.5 text-[clamp(24px,3vw,36px)] font-extrabold tracking-[-0.03em]">
								{dict['support.help.heading']}
							</h2>
							<p className="mx-auto max-w-2xl text-base-content/70">{dict['support.help.subtitle']}</p>
						</div>

						<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
							{HELP_LINKS.map((link) => (
								<div key={link.href} className="card border border-base-content/10 bg-base-100 p-6">
									<h3 className="mb-2 text-lg font-bold tracking-[-0.01em]">{dict[link.title]}</h3>
									<p className="mb-5 grow text-sm text-base-content/70">{dict[link.desc]}</p>
									<a
										href={link.href}
										target="_blank"
										rel="noreferrer"
										className="btn btn-outline btn-sm w-fit gap-1.5 rounded-lg font-medium"
									>
										{dict[link.cta]}
										<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
											<path d="M7 17 17 7" />
											<path d="M8 7h9v9" />
										</svg>
									</a>
								</div>
							))}
						</div>
					</ScrollReveal>
				</div>
			</section>

			{/* Install FAQ — the questions that otherwise become GitHub issues. */}
			<section className="border-t border-base-content/10 bg-base-100 py-20">
				<div className="container mx-auto max-w-[760px] px-6">
					<ScrollReveal y={30}>
						<Eyebrow className="mb-5">{dict['faq.eyebrow']}</Eyebrow>
						<h2 className="mb-10 text-[clamp(24px,3vw,36px)] font-extrabold tracking-[-0.03em]">
							{dict['support.faq.heading']}
						</h2>
					</ScrollReveal>
					<ScrollReveal y={20} stagger={0.08} className="flex flex-col gap-3">
						{INSTALL_FAQS.map((f) => (
							<details key={f.q} className="group rounded-[12px] border border-base-content/10 bg-base-200 px-6 py-5">
								<summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold marker:hidden">
									{dict[f.q]}
									<span className="text-primary transition-transform group-open:rotate-45" aria-hidden="true">+</span>
								</summary>
								<p className="mt-3 text-[15px] leading-[1.7] text-base-content/70">{dict[f.a]}</p>
							</details>
						))}
					</ScrollReveal>
				</div>
			</section>
		</main>
	)
}
