import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules() })

describe('coordinated repository cutover', () => {
    it('uses the renamed Tucky repository by default', async () => {
        vi.stubEnv('NEXT_PUBLIC_TUCKY_GITHUB_REPO', '')
        const config = await import('./tucky-repository')
        expect(config.GITHUB_REPO).toBe('desduvauchelle/tucky')
        expect(config.DOWNLOAD_URL).toBe('https://github.com/desduvauchelle/tucky/releases/latest/download/Tucky-arm64.dmg')
    })
    it('supports an explicit repository override', async () => {
        vi.stubEnv('NEXT_PUBLIC_TUCKY_GITHUB_REPO', 'desduvauchelle/tucky-test')
        const config = await import('./tucky-repository')
        expect(config.GITHUB_URL).toBe('https://github.com/desduvauchelle/tucky-test')
        expect(config.DOWNLOAD_URL).toBe('https://github.com/desduvauchelle/tucky-test/releases/latest/download/Tucky-arm64.dmg')
    })
})
