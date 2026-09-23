import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

export type CacheTag = 'projects' | 'profile'

/**
 * Invalide immédiatement le cache des pages publiques après une modification
 * dans l'admin. Hors contexte Next (script d'import, tests) revalidateTag
 * lève une erreur : on l'ignore, il n'y a alors rien à invalider.
 */
function invalidate(tags: CacheTag[], context: Record<string, unknown> | undefined) {
  if (context?.disableRevalidate) return
  for (const tag of tags) {
    try {
      revalidateTag(tag, { expire: 0 })
    } catch {
      // pas de cache Next disponible
    }
  }
}

export const revalidateAfterChange =
  (...tags: CacheTag[]): CollectionAfterChangeHook =>
  ({ doc, req }) => {
    invalidate(tags, req.context)
    return doc
  }

export const revalidateAfterDelete =
  (...tags: CacheTag[]): CollectionAfterDeleteHook =>
  ({ doc, req }) => {
    invalidate(tags, req.context)
    return doc
  }

export const revalidateGlobal =
  (...tags: CacheTag[]): GlobalAfterChangeHook =>
  ({ doc, req }) => {
    invalidate(tags, req.context)
    return doc
  }
