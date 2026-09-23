import type { MetadataRoute } from 'next'

import { getProjects } from '../lib/data'
import { SITE_URL } from '../lib/site'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects()
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 },
    ...projects.map((p) => ({
      url: `${SITE_URL}/projets/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
