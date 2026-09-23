import { describe, expect, it } from 'vitest'

import { youtubeId } from '../../src/blocks/YouTube'
import { cleanMarkdown } from '../../src/endpoints/importJekyll'
import { slugify } from '../../src/fields/slug'
import { srcSet } from '../../src/lib/media'
import type { Media } from '../../src/payload-types'

describe('slugify', () => {
  it('produit les mêmes adresses que Jekyll', () => {
    expect(slugify('Netis Technology Day')).toBe('netis-technology-day')
    expect(slugify('Boya Food × Edzrom Cuisine')).toBe('boya-food-edzrom-cuisine')
    expect(slugify('  Semaine des SHERQ ! ')).toBe('semaine-des-sherq')
    expect(slugify('Événements & PLV')).toBe('evenements-et-plv')
  })
})

describe('youtubeId', () => {
  it('accepte les différentes formes de lien', () => {
    expect(youtubeId('https://www.youtube.com/watch?v=aqz-KE-bpKQ')).toBe('aqz-KE-bpKQ')
    expect(youtubeId('https://youtu.be/aqz-KE-bpKQ?t=3')).toBe('aqz-KE-bpKQ')
    expect(youtubeId('https://www.youtube.com/shorts/aqz-KE-bpKQ')).toBe('aqz-KE-bpKQ')
    expect(youtubeId('aqz-KE-bpKQ')).toBe('aqz-KE-bpKQ')
  })
})

describe('cleanMarkdown', () => {
  it('retire commentaires HTML et balises Liquid de l’ancien site', () => {
    const md = '## Titre\n\nTexte.\n\n<!-- à compléter -->\n{% include media.html src="x.jpg" %}\n\nFin.'
    expect(cleanMarkdown(md)).toBe('## Titre\n\nTexte.\n\nFin.')
  })
})

describe('srcSet', () => {
  it('liste les tailles générées puis l’original', () => {
    const media = {
      url: 'https://m/x.jpg',
      width: 2000,
      sizes: { small: { url: 'https://m/x-480.webp', width: 480 }, medium: { url: null, width: null } },
    } as unknown as Media
    expect(srcSet(media)).toBe('https://m/x-480.webp 480w, https://m/x.jpg 2000w')
  })
})
