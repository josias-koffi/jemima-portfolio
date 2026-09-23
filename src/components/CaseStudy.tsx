import type { Project } from '../payload-types'
import { pad } from '../lib/site'

type Step = { title: string; method: string; body?: string | null; items?: string[]; highlight?: boolean }

/** Défi → Stratégie → Réalisations → Impact, calés sur la méthode (Comprendre → … → Valoriser). */
export function CaseStudy({ data }: { data: Project['caseStudy'] }) {
  const list = (rows?: { text: string }[] | null) => (rows ?? []).map((r) => r.text).filter(Boolean)
  const steps: Step[] = [
    { title: 'Le défi', method: 'Comprendre', body: data?.challenge },
    { title: 'La stratégie', method: 'Structurer', items: list(data?.strategy) },
    { title: 'Réalisations', method: 'Créer', items: list(data?.deliverables) },
    { title: 'Impact', method: 'Valoriser', items: list(data?.impact), highlight: true },
  ].filter((s) => s.body || s.items?.length)

  if (!steps.length) return null

  return (
    <section className="case wrap" aria-label="Étude de cas">
      {steps.map((s, i) => (
        <div className={`case__step reveal${s.highlight ? ' case__step--impact' : ''}`} key={s.title}>
          <header className="case__head">
            <p className="label">
              {pad(i + 1)} — {s.method}
            </p>
            <h2 className="case__title">{s.title}</h2>
          </header>
          <div className="case__body">
            {s.body && <p className="case__lead">{s.body}</p>}
            {s.items && s.items.length > 0 && (
              <ul className="case__list">
                {s.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </section>
  )
}
