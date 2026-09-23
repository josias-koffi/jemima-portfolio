import type { MetadataRoute } from 'next'

import { isStaging, SITE_URL } from '../lib/site'

export const dynamic = 'force-dynamic'

/** Staging : rien d'indexable. Prod : tout sauf l'admin et l'API. */
export default function robots(): MetadataRoute.Robots {
  if (isStaging) return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
