import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import type { Profile, Project } from '../payload-types'

/**
 * Lectures mises en cache et taguées ; les hooks Payload (lib/revalidate.ts)
 * invalident les tags à chaque modification dans l'admin.
 */

export const getProfile = unstable_cache(
  async (): Promise<Profile> => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: 'profile', depth: 1 })
  },
  ['profile'],
  { tags: ['profile'] },
)

export const getProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'projects',
      where: { _status: { equals: 'published' } },
      draft: false,
      sort: 'order',
      depth: 2,
      limit: 200,
      pagination: false,
    })
    return docs
  },
  ['projects'],
  { tags: ['projects'] },
)
