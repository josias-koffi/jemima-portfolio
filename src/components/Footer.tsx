import type { Profile } from '../payload-types'

export function Footer({ profile: p }: { profile: Profile }) {
  const year = new Date().getFullYear()
  return (
    <footer className="footer" id="contact">
      <div className="wrap">
        <p className="label reveal">Contact</p>
        <h2 className="footer__title reveal">
          Parlons-<em>en.</em>
        </h2>
        <p className="footer__lead reveal">Un projet, une alternance, une idée de campagne&nbsp;? Écrivez-moi, je réponds vite.</p>
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
