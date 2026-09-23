import type { Metadata } from 'next'
import { Fragment, type CSSProperties } from 'react'

import { Cover } from '../../components/Cover'
import { Marquee } from '../../components/Marquee'
import { Word } from '../../components/Word'
import { getProfile, getProjects } from '../../lib/data'
import { asMedia } from '../../lib/media'
import { pad } from '../../lib/site'

export const metadata: Metadata = { alternates: { canonical: '/' } }

const d = (n: number) => ({ '--d': n }) as CSSProperties

export default async function HomePage() {
  const [p, projects] = await Promise.all([getProfile(), getProjects()])
  const hero = asMedia(p.heroPhoto)
  const portrait = asMedia(p.portrait)
  const year = new Date().getFullYear()

  return (
    <>
      <section className="hero wrap">
        <p className="hero__top label intro" style={d(0)}>
          <span>{p.location}</span>
          <span>{p.role}</span>
          <span>Portfolio {year}</span>
        </p>

        <div className="hero__stage">
          <h1 className="hero__name" aria-label={`${p.firstName} ${p.lastName}`}>
            <span className="line" aria-hidden="true">
              <span style={d(1)}>{p.firstName}</span>
            </span>
            <span className="line line--indent" aria-hidden="true">
              <span style={d(2)}>
                <em>{p.lastName}</em>
                <span className="hero__dot">.</span>
              </span>
            </span>
          </h1>

          {hero?.url && (
            <figure className="hero__photo intro" style={d(3)}>
              <div className="hero__float">
                <div className="hero__tilt">
                  <span className="hero__back" aria-hidden="true" />
                  <img className="hero__img" src={hero.sizes?.medium?.url || hero.url} alt={hero.alt ?? ''} fetchPriority="high" />
                  <span className="hero__badge" aria-hidden="true">
                    ✺
                  </span>
                </div>
              </div>
              <span className="hero__zones" aria-hidden="true">
                {Array.from({ length: 9 }, (_, i) => (
                  <span key={i} />
                ))}
              </span>
            </figure>
          )}
        </div>

        <div className="hero__bottom">
          <p className="hero__intro intro" style={d(4)}>
            {(p.intro ?? []).map((block, i) =>
              block.blockType === 'text' ? (
                <span key={i}>{block.text}</span>
              ) : (
                <Word key={i} label={block.label} image={asMedia(block.image)} note={block.note} tilt={block.tilt} />
              ),
            )}
          </p>
          <div className="hero__aside intro" style={d(5)}>
            {p.availability && (
              <p className="status">
                <span className="status__dot" aria-hidden="true" />
                {p.availability}
              </p>
            )}
            <p className="hint">
              <span className="hint__hover">(survolez les mots en gras)</span>
              <span className="hint__touch">(touchez les mots en gras)</span>
            </p>
            <a className="btn btn--accent" href="#projets">
              Voir les projets <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>

      <Marquee items={(p.marquee ?? []).map((m) => m.label)} />

      <section className="work" id="projets">
        <div className="wrap">
          <header className="section-head reveal">
            <h2 className="section-title">
              Projets <em>choisis</em>
            </h2>
            <p className="label">({pad(projects.length)})</p>
          </header>

          <ol className="work__list">
            {projects.map((pr, i) => (
              <li className="work__item reveal" key={pr.id}>
                <a className="work__link" href={`/projets/${pr.slug}`}>
                  <span className="work__num">{pad(i + 1)}</span>
                  <span className="work__text">
                    <span className="work__title">{pr.title}</span>
                    {pr.tagline && <span className="work__tagline">{pr.tagline}</span>}
                  </span>
                  <span className="work__meta">
                    {pr.expertises?.[0] && <span>{pr.expertises[0].label}</span>}
                    {pr.year && <span>{pr.year}</span>}
                  </span>
                  <Cover project={pr} className="work__cover" sizes="(max-width: 760px) 100vw, 320px" />
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="about" id="a-propos">
        <div className="wrap about__grid">
          <figure className="about__portrait reveal">
            {portrait?.url && (
              <img src={portrait.sizes?.medium?.url || portrait.url} alt={portrait.alt ?? ''} loading="lazy" />
            )}
            {p.status && <figcaption className="label">{p.status}</figcaption>}
          </figure>
          <div className="about__text">
            <p className="label reveal">À propos</p>
            <h2 className="section-title reveal">
              Créer. Structurer. <em>Valoriser.</em>
            </h2>
            {(p.about ?? []).map((para) => (
              <p className="reveal" key={para.id}>
                {para.text}
              </p>
            ))}
            {p.drive && <p className="drive reveal">{p.drive}</p>}
          </div>
        </div>

        <div className="wrap">
          <ul className="expertises">
            {(p.expertises ?? []).map((e, i) => (
              <li className="expertise reveal" key={e.id}>
                <p className="label">
                  {pad(i + 1)} — {e.label}
                </p>
                <h3>{e.title}</h3>
                <p>{(e.items ?? []).map((it) => it.label).join(' · ')}</p>
              </li>
            ))}
          </ul>

          {(p.tools ?? []).length > 0 && (
            <div className="tools reveal">
              <p className="label">Boîte à outils</p>
              <dl className="tools__list">
                {p.tools!.map((t) => (
                  <div key={t.id}>
                    <dt>{t.label}</dt>
                    <dd>{(t.items ?? []).map((it) => it.label).join(' · ')}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <p className="process reveal" aria-label="Ma méthode">
            {(p.process ?? []).map((step, i, all) => (
              <Fragment key={step.id}>
                <span>{step.label}</span>
                {i < all.length - 1 && (
                  <span className="process__arrow" aria-hidden="true">
                    →
                  </span>
                )}
              </Fragment>
            ))}
          </p>

          {(p.testimonials ?? []).length > 0 && (
            <ul className="quotes" aria-label="Ils en parlent">
              {p.testimonials!.map((t) => (
                <li className="quote reveal" key={t.id}>
                  <blockquote>
                    <p>{t.quote}</p>
                  </blockquote>
                  <p className="label">
                    {t.author}
                    {t.context && <> — {t.context}</>}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
