import type { Block } from 'payload'

/** Extrait l'identifiant d'une URL YouTube (ou renvoie la valeur si c'est déjà un id). */
export const youtubeId = (value: string): string => {
  const match = value.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)
  return match ? match[1] : value.trim()
}

export const YouTubeBlock: Block = {
  slug: 'youtube',
  labels: { singular: 'Vidéo YouTube', plural: 'Vidéos YouTube' },
  fields: [
    {
      name: 'url',
      label: 'Lien ou identifiant YouTube',
      type: 'text',
      required: true,
      admin: { description: 'Ex. https://www.youtube.com/watch?v=XXXXXXXXXXX' },
    },
    { name: 'caption', label: 'Légende', type: 'text' },
  ],
}
