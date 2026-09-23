import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { Footer } from '../../components/Footer'
import { Nav } from '../../components/Nav'
import { getProfile } from '../../lib/data'
import { asMedia, bestUrl } from '../../lib/media'
import { isStaging, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '../../lib/site'
import './main.css'

// Rendu à la demande (le build Docker n'a pas accès à la base) ; les données
// sont mises en cache et invalidées par les hooks Payload.
export const dynamic = 'force-dynamic'

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%238A1C33'/%3E%3Ctext x='50%25' y='56%25' text-anchor='middle' dominant-baseline='middle' font-family='Georgia,serif' font-style='italic' font-size='40' fill='%23F4F1EA'%3EJ%3C/text%3E%3C/svg%3E"

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#F4F1EA',
}

export async function generateMetadata(): Promise<Metadata> {
  const p = await getProfile()
  const share = asMedia(p.shareImage) ?? asMedia(p.portrait)
  const shareUrl = share ? bestUrl(share) : undefined
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${SITE_TITLE} — ${p.role ?? ''}`, template: `%s — ${SITE_TITLE}` },
    description: SITE_DESCRIPTION,
    icons: { icon: FAVICON },
    robots: isStaging ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      siteName: SITE_TITLE,
      images: shareUrl ? [{ url: shareUrl, alt: share?.alt ?? '' }] : undefined,
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const profile = await getProfile()
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <Nav profile={profile} />
        <main id="contenu">{children}</main>
        <Footer profile={profile} />
        {isStaging && <p className="staging-badge">Staging · develop</p>}
      </body>
    </html>
  )
}
