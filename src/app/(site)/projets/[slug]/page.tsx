import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { CSSProperties } from 'react'

import { CaseStudy } from '../../../../components/CaseStudy'
import { Cover } from '../../../../components/Cover'
import { Gallery } from '../../../../components/Gallery'
import { ProjectContent } from '../../../../components/ProjectContent'
import { getProjects } from '../../../../lib/data'
import { asMedia, bestUrl } from '../../../../lib/media'
import { pad } from '../../../../lib/site'

type Params = { params: Promise<{ slug: string }> }

const d = (n: number) => ({ '--d': n }) as CSSProperties

async function findProject(slug: string) {
  const projects = await getProjects()
  const index = projects.findIndex((p) => p.slug === slug)
  return { projects, index, project: projects[index] }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const { project } = await findProject(slug)
  if (!project) return {}
  const cover = asMedia(project.cover)
  const coverUrl = cover ? bestUrl(cover) : undefined
  return {
    title: project.title,
    description: project.tagline ?? undefined,
    alternates: { canonical: `/projets/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.tagline ?? undefined,
      url: `/projets/${project.slug}`,
      ...(coverUrl ? { images: [{ url: coverUrl, alt: project.coverAlt || cover?.alt || project.title }] } : {}),
    },
  }
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params
  const { projects, index, project } = await findProject(slug)
  if (!project) notFound()

  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : undefined
  const expertises = (project.expertises ?? []).map((e) => e.label)

  return (
    <article className="project">
      <header className="project__head wrap">
        <p className="label intro" style={d(0)}>
          <a className="back" href="/#projets">
            ← Tous les projets
          </a>
          <span>
            {pad(index + 1)} / {pad(projects.length)}
          </span>
        </p>
        <h1 className="project__title intro" style={d(1)}>
          {project.title}
        </h1>
        {project.tagline && (
          <p className="project__excerpt intro" style={d(2)}>
            {project.tagline}
          </p>
        )}
        <dl className="project__meta intro" style={d(3)}>
          {project.client && (
            <div>
              <dt>Client</dt>
              <dd>{project.client}</dd>
            </div>
          )}
          {project.year && (
            <div>
              <dt>Année</dt>
              <dd>{project.year}</dd>
            </div>
          )}
          {project.role && (
            <div>
              <dt>Mon rôle</dt>
              <dd>{project.role}</dd>
            </div>
          )}
          {expertises.length > 0 && (
            <div>
              <dt>Expertises</dt>
              <dd>{expertises.join(' · ')}</dd>
            </div>
          )}
        </dl>
      </header>

      <Cover project={project} className="project__cover" eager sizes="(max-width: 1360px) 100vw, 1360px" />

      <CaseStudy data={project.caseStudy} />

      <div className="project__body wrap">
        {project.content && <ProjectContent data={project.content as SerializedEditorState} />}

        {(project.links ?? []).length > 0 && (
          <ul className="project__links">
            {project.links!.map((l) => (
              <li key={l.id}>
                <a className="btn" href={l.url} target="_blank" rel="noopener">
                  {l.label} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Gallery items={project.gallery} />

      {next && (
        <a className="next" href={`/projets/${next.slug}`}>
          <span className="label">Projet suivant — {pad(projects.indexOf(next) + 1)}</span>
          <span className="next__title">
            {next.title}{' '}
            <span className="next__arrow" aria-hidden="true">
              →
            </span>
          </span>
        </a>
      )}
    </article>
  )
}
