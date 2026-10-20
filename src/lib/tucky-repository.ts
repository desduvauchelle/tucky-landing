// Shared repository identity for downloads and public links.
// Next embeds NEXT_PUBLIC values in client bundles, so changes need a rebuild.
export const GITHUB_REPO = process.env.NEXT_PUBLIC_TUCKY_GITHUB_REPO || 'desduvauchelle/tucky'
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`
export const DOWNLOAD_URL = `${GITHUB_URL}/releases/latest/download/Tucky-arm64.dmg`
