import type { Media } from '../payload-types'

type MaybeMedia = Media | number | null | undefined

/** Un champ upload est peuplé (objet) ou non (id) selon la profondeur de la requête. */
export const asMedia = (m: MaybeMedia): Media | undefined => (m && typeof m === 'object' ? m : undefined)

export const isVideo = (m: Media) => Boolean(m.mimeType?.startsWith('video/'))

/** srcset à partir des tailles générées (480/960/1600 en WebP) + l'original. */
export function srcSet(m: Media): string | undefined {
  const entries = Object.values(m.sizes ?? {})
    .filter((s): s is { url: string; width: number } => Boolean(s?.url && s?.width))
    .map((s) => `${s.url} ${s.width}w`)
  if (m.url && m.width) entries.push(`${m.url} ${m.width}w`)
  return entries.length ? entries.join(', ') : undefined
}

/** URL la plus adaptée pour un usage donné (partage : ~1600px). */
export const bestUrl = (m: Media, size: 'small' | 'medium' | 'large' = 'large') =>
  m.sizes?.[size]?.url || m.url || undefined
