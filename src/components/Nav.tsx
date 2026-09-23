import type { Profile } from '../payload-types'

/** Liens <a> natifs (pas next/link) : rechargement complet → transitions de page CSS. */
export function Nav({ profile }: { profile: Profile }) {
  return (
    <>
      <a className="skip" href="#contenu">
        Aller au contenu
      </a>
      <header className="nav">
        <a className="nav__brand" href="/">
          {profile.firstName} {profile.lastName}
        </a>
        <nav className="nav__links" aria-label="Navigation principale">
          <a href="/#projets">Projets</a>
          <a href="/#a-propos">À propos</a>
          <a className="nav__cta" href="#contact">
            Contact
          </a>
        </nav>
      </header>
    </>
  )
}
