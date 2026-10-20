import type { Dictionary } from '@/i18n'
import { InstallBox } from '@/components/landing/InstallBox'

export function CompareInstall({ dict }: { dict: Dictionary }) {
	return <section id="install" className="scroll-mt-20 border-t border-base-content/15 bg-base-200 px-5 py-16 text-center sm:px-8 md:py-24">
		<div className="mx-auto max-w-4xl">
			<p className="mb-4 font-semibold text-primary">Private. Local. Free.</p>
			<h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Make room for Tucky on your Mac.</h2>
			<p className="mt-4 mb-8 text-lg text-base-content/80">{dict['cta.subtitle']}</p>
			<InstallBox dict={dict} />
			<p className="mt-6 text-sm leading-relaxed text-base-content/70">Apple Silicon · macOS 14 or later · No account required</p>
			<p className="mt-2 text-sm leading-relaxed text-base-content/70">Follow setup to download your local models and grant recording permissions. Models need several GB; size varies.</p>
		</div>
	</section>
}
