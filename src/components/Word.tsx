import type { Media } from '../payload-types'

type Props = { label: string; image?: Media; note?: string | null; tilt?: string | null }

/** Mot en gras qui révèle une image (ou une note) au survol — ex-_includes/word.html. */
export function Word({ label, image, note, tilt }: Props) {
  return (
    <span className="word" tabIndex={0}>
      <strong>{label}</strong>
      <span className={`word__pop word__pop--${tilt === 'r' ? 'r' : 'l'}`} aria-hidden="true">
        {image?.url ? <img src={image.url} alt="" loading="lazy" /> : <em>{note}</em>}
      </span>
    </span>
  )
}
