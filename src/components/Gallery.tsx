import { asMedia, bestUrl, isVideo, srcSet } from '../lib/media'
import { pad } from '../lib/site'
import type { Media } from '../payload-types'
import { LightboxVideo } from './LightboxVideo'

/**
 * Mosaïque de visuels (photos, affiches, vidéos) sous le texte d'un projet.
 * Agrandissement au clic via l'API Popover (Échap ou clic à l'extérieur pour
 * fermer) ; les vidéos, muettes dans la mosaïque, s'y lisent avec le son.
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
          const label = m.alt || caption || 'visuel'
          const video = isVideo(m)
          return (
            <li className="gallery__item reveal" key={m.id}>
              <button
                className="gallery__open"
                type="button"
                popoverTarget={id}
                aria-label={`${video ? 'Lire avec le son' : 'Agrandir'} : ${label}`}
              >
                {video ? (
                  <>
                    <video src={m.url!} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
                    <span className="gallery__badge" aria-hidden="true">
                      ▶ Son
                    </span>
                  </>
                ) : (
                  <img
                    src={m.sizes?.medium?.url || m.url!}
                    srcSet={srcSet(m)}
                    sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    alt={m.alt ?? ''}
                    width={m.width ?? undefined}
                    height={m.height ?? undefined}
                    loading="lazy"
                  />
                )}
              </button>
              {caption && <p className="gallery__caption">{caption}</p>}
              <div className="lightbox" id={id} popover="auto">
                <figure>
                  {video ? <LightboxVideo src={m.url!} label={label} /> : <img src={bestUrl(m)} alt={m.alt ?? ''} loading="lazy" />}
                  {caption && <figcaption>{caption}</figcaption>}
                </figure>
                <button className="lightbox__close" type="button" popoverTarget={id} popoverTargetAction="hide">
                  Fermer <span aria-hidden="true">×</span>
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
