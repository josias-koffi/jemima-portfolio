import type { TextField } from 'payload'

export const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' et ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** Adresse de la page (/projets/<slug>/), générée depuis le titre si vide. */
export const slugField = (source = 'title'): TextField => ({
  name: 'slug',
  label: 'Adresse de la page',
  type: 'text',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'Générée depuis le titre. Ex. « netis-group » → /projets/netis-group/',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.trim()) return slugify(value)
        const from = data?.[source]
        return typeof from === 'string' ? slugify(from) : value
      },
    ],
  },
})
