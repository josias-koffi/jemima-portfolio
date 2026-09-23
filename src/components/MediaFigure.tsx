import { isVideo, srcSet } from '../lib/media'
import type { Media } from '../payload-types'

type Props = { media: Media; caption?: string | null; loop?: boolean | null }

/** Image ou vidéo glissée dans le texte d'un projet — ex-_includes/media.html. */
export function MediaFigure({ media, caption, loop }: Props) {
  if (!media.url) return null
  return (
    <figure className="media">
      {isVideo(media) ? (
        <video
          src={media.url}
          preload="metadata"
          playsInline
          aria-label={caption || media.alt || undefined}
          {...(loop ? { autoPlay: true, muted: true, loop: true } : { controls: true })}
        />
      ) : (
        <img
          src={media.url}
          srcSet={srcSet(media)}
          sizes="(max-width: 1000px) 100vw, 66ch"
          alt={media.alt || ''}
          width={media.width ?? undefined}
          height={media.height ?? undefined}
          loading="lazy"
        />
      )}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
