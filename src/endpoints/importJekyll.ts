import fs from 'node:fs/promises'
import path from 'node:path'

import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import matter from 'gray-matter'
import type { Endpoint, PayloadRequest } from 'payload'
import YAML from 'yaml'

/**
 * POST /api/import-jekyll — importe le contenu de l'ancien site Jekyll (dossier seed/).
 * Réservé aux admins connectés. Idempotent : un projet dont le slug existe déjà
 * est ignoré, le profil n'est rempli que s'il est vide (sauf ?force=1).
 */

const SEED_DIR = path.resolve(process.cwd(), 'seed')

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
}

type Report = { media: string[]; projects: string[]; skipped: string[]; profile: string }

async function uploadOnce(req: PayloadRequest, file: string, alt: string, report: Report) {
  const name = path.basename(file)
  const existing = await req.payload.find({
    collection: 'media',
    where: { filename: { equals: name } },
    limit: 1,
    req,
  })
  if (existing.docs[0]) return existing.docs[0].id

  const data = await fs.readFile(path.join(SEED_DIR, file))
  const doc = await req.payload.create({
    collection: 'media',
    data: { alt },
    file: { data, name, mimetype: MIME[path.extname(name).toLowerCase()] ?? 'application/octet-stream', size: data.length },
    req,
  })
  report.media.push(name)
  return doc.id
}

/** Retire les commentaires HTML et les balises Liquid de l'ancien Markdown. */
export const cleanMarkdown = (md: string) =>
  md
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^\{%.*%\}\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

const blank = (v: unknown) => (typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined)

async function importProfile(req: PayloadRequest, force: boolean, report: Report) {
  const current = await req.payload.findGlobal({ slug: 'profile', req })
  if (current.firstName && !force) {
    report.profile = 'déjà rempli (utiliser ?force=1 pour écraser)'
    return
  }
  const p = YAML.parse(await fs.readFile(path.join(SEED_DIR, 'profile.yml'), 'utf8'))
  const img = (file: string | undefined, alt: string) =>
    file ? uploadOnce(req, `img/${path.basename(file)}`, alt, report) : undefined

  const hero = await img(p.hero_photo, p.hero_photo_alt ?? '')
  const portrait = await img(p.portrait, p.portrait_alt ?? '')
  const share = p.share_image === p.portrait ? portrait : await img(p.share_image, p.portrait_alt ?? '')

  await req.payload.updateGlobal({
    slug: 'profile',
    req,
    data: {
      firstName: p.name_first,
      lastName: p.name_last,
      location: p.location,
      role: p.role,
      status: p.status,
      heroPhoto: hero,
      portrait,
      shareImage: share,
      email: blank(p.email),
      phone: blank(p.phone),
      linkedin: blank(p.linkedin),
      instagram: blank(p.instagram),
      instagramLabel: blank(p.instagram_label),
      marquee: (p.marquee ?? []).map((label: string) => ({ label })),
      about: (p.about ?? []).map((text: string) => ({ text })),
      process: (p.process ?? []).map((label: string) => ({ label })),
      expertises: (p.expertises ?? []).map((e: { label: string; title: string; items: string[] }) => ({
        label: e.label,
        title: e.title,
        items: e.items.map((label) => ({ label })),
      })),
      // Accroche du hero, reprise de l'ancien index.html
      intro: [
        { blockType: 'text', text: 'Moi, c’est ' },
        { blockType: 'word', label: 'Jémima', image: portrait, tilt: 'r' },
        { blockType: 'text', text: '. Je transforme un brief en ' },
        { blockType: 'word', label: 'campagnes 360°', note: 'Netis Group — télécoms & énergie', tilt: 'l' },
        { blockType: 'text', text: ', en ' },
        { blockType: 'word', label: 'contenus', note: 'Boya Food — Instagram, TikTok, Facebook', tilt: 'r' },
        { blockType: 'text', text: ' qui accrochent et en ' },
        { blockType: 'word', label: 'événements', note: 'Salon International de l’Agriculture', tilt: 'l' },
        { blockType: 'text', text: ' dont on se souvient.' },
      ],
    },
  })
  report.profile = 'importé'
}

async function importProjects(req: PayloadRequest, report: Report) {
  const editorConfig = await editorConfigFactory.default({ config: req.payload.config })
  const dir = path.join(SEED_DIR, 'projects')
  for (const file of (await fs.readdir(dir)).filter((f) => f.endsWith('.md')).sort()) {
    const slug = file.replace(/\.md$/, '')
    const exists = await req.payload.find({
      collection: 'projects',
      where: { slug: { equals: slug } },
      limit: 1,
      draft: true,
      req,
    })
    if (exists.docs[0]) {
      report.skipped.push(slug)
      continue
    }
    const { data: fm, content } = matter(await fs.readFile(path.join(dir, file), 'utf8'))
    const cover = blank(fm.cover)
      ? await uploadOnce(req, `projects/${slug}/${path.basename(fm.cover)}`, fm.cover_alt ?? fm.title, report)
      : undefined

    await req.payload.create({
      collection: 'projects',
      req,
      draft: false,
      data: {
        _status: 'published',
        title: fm.title,
        slug,
        order: fm.order ?? 99,
        client: blank(fm.client),
        year: blank(fm.year),
        tagline: blank(fm.tagline),
        role: blank(fm.role),
        tone: ['accent', 'ink', 'sand'].includes(fm.tone) ? fm.tone : 'accent',
        expertises: (fm.expertises ?? []).map((label: string) => ({ label })),
        cover,
        coverAlt: blank(fm.cover_alt),
        links: (fm.links ?? []).map((l: { label: string; url: string }) => ({ label: l.label, url: l.url })),
        content: convertMarkdownToLexical({ editorConfig, markdown: cleanMarkdown(content) }),
      },
    })
    report.projects.push(slug)
  }
}

export const importJekyllEndpoint: Endpoint = {
  path: '/import-jekyll',
  method: 'post',
  handler: async (req) => {
    if (!req.user) return Response.json({ error: 'Connexion admin requise' }, { status: 401 })
    const force = new URL(req.url ?? 'http://x').searchParams.get('force') === '1'
    const report: Report = { media: [], projects: [], skipped: [], profile: '' }
    await importProfile(req, force, report)
    await importProjects(req, report)
    return Response.json(report)
  },
}
