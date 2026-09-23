import type { CSSProperties } from 'react'

import { asMedia, srcSet } from '../lib/media'
import type { Project } from '../payload-types'

type Props = { project: Project; className: string; eager?: boolean; sizes?: string }

/**
 * Couverture d'un projet ; sans image → bloc typographique coloré.
 * Même view-transition-name sur l'accueil et la page projet → effet « morph ».
 */
export function Cover({ project, className, eager, sizes = '100vw' }: Props) {
  const img = asMedia(project.cover)
  const style = { viewTransitionName: `vt-${project.slug}` } as CSSProperties
  return (
    <figure className={`cover ${className} cover--${project.tone || 'accent'}`} style={style}>
      {img?.url ? (
        <img
          src={img.url}
          srcSet={srcSet(img)}
          sizes={sizes}
          alt={project.coverAlt || img.alt || project.title}
          {...(eager ? { fetchPriority: 'high' as const } : { loading: 'lazy' as const })}
        />
      ) : (
        <span className="cover__type" aria-hidden="true">
          <em>{project.title}</em>
        </span>
      )}
    </figure>
  )
}
