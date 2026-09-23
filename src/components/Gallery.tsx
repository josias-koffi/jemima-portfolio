import { asMedia, bestUrl, isVideo, srcSet } from '../lib/media'
import { pad } from '../lib/site'
import type { Media } from '../payload-types'

/**
 * Mosaïque de visuels (photos, affiches, vidéos) sous le texte d'un projet.
 * Agrandissement au clic via l'API Popover : aucun JavaScript, Échap ou clic
 * à l'extérieur pour fermer.
 */
export function Gallery({ items }: { items: (number | Media)[] | null | undefined }) {
  const media = (items ?? []).map(asMedia).filter((m): m is Media => Boolean(m?.url))
  if (!media.length) return null

  return (
    <section className="gallery wrap" aria-label="Galerie">
      <header className="section-head reveal">
        <h2 className="section-title">
          En <em>images</em>
        </h2>
        <p className="label">({pad(media.length)})</p>
      </header>

      <ul className="gallery__grid">
        {media.map((m) => {
          const id = `visuel-${m.id}`
          const caption = m.caption || undefined
          return (
            <li className="gallery__item reveal" key={m.id}>
              {isVideo(m) ? (
                <figure>
                  <video src={m.url!} autoPlay muted loop playsInline preload="metadata" aria-label={caption || m.alt || undefined} />
                  {caption && <figcaption>{caption}</figcaption>}
                </figure>
              ) : (
                <>
                  <button className="gallery__open" type="button" popoverTarget={id} aria-label={`Agrandir : ${m.alt || caption || 'visuel'}`}>
                    <img
                      src={m.sizes?.medium?.url || m.url!}
                      srcSet={srcSet(m)}
                      sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      alt={m.alt ?? ''}
                      width={m.width ?? undefined}
                      height={m.height ?? undefined}
                      loading="lazy"
                    />
                  </button>
                  {caption && <p className="gallery__caption">{caption}</p>}
                  <div className="lightbox" id={id} popover="auto">
                    <figure>
                      <img src={bestUrl(m)} alt={m.alt ?? ''} loading="lazy" />
                      {caption && <figcaption>{caption}</figcaption>}
                    </figure>
                    <button className="lightbox__close" type="button" popoverTarget={id} popoverTargetAction="hide">
                      Fermer <span aria-hidden="true">×</span>
                    </button>
                  </div>
                </>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
