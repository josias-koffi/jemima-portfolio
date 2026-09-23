import { asMedia } from '../lib/media'
import type { Profile } from '../payload-types'

const DEFAULT_LEAD = 'Un projet, une alternance, une idée de campagne\u00a0? Écrivez-moi, je réponds vite.'
const MAIL_SUBJECT = encodeURIComponent('Opportunité — prise de contact via votre portfolio')

export function Footer({ profile: p }: { profile: Profile }) {
  const year = new Date().getFullYear()
  const cv = asMedia(p.cv)
  return (
    <footer className="footer" id="contact">
      <div className="wrap">
        <p className="label reveal">Contact</p>
        <h2 className="footer__title reveal">
          Parlons-<em>en.</em>
        </h2>
        <p className="footer__lead reveal">{p.contactLead || DEFAULT_LEAD}</p>
        {(cv?.url || p.email) && (
          <p className="footer__actions reveal">
            {cv?.url && (
              <a className="btn btn--accent" href={cv.url} target="_blank" rel="noopener">
                Télécharger mon CV (PDF) <span aria-hidden="true">↓</span>
              </a>
            )}
            {p.email && (
              <a className="btn btn--light" href={`mailto:${p.email}?subject=${MAIL_SUBJECT}`}>
                Discutons d’une opportunité <span aria-hidden="true">→</span>
              </a>
            )}
          </p>
        )}
        {p.email && (
          <a className="footer__mail reveal" href={`mailto:${p.email}`}>
            {p.email} <span aria-hidden="true">↗</span>
          </a>
        )}
        <ul className="footer__links">
          {p.linkedin && (
            <li>
              <a href={p.linkedin} target="_blank" rel="noopener">
                LinkedIn
              </a>
            </li>
          )}
          {p.instagram && (
            <li>
              <a href={p.instagram} target="_blank" rel="noopener">
                {p.instagramLabel || 'Instagram'}
              </a>
            </li>
          )}
          {p.phone && (
            <li>
              <a href={`tel:${p.phone.replace(/\s/g, '')}`}>{p.phone}</a>
            </li>
          )}
        </ul>
        <p className="footer__meta">
          <span>
            © {year} {p.firstName} {p.lastName}
          </span>
          <span>{p.location}</span>
        </p>
      </div>
    </footer>
  )
}
