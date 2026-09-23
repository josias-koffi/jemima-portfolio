import type { CollectionConfig } from 'payload'

import { revalidateAfterChange, revalidateAfterDelete } from '../lib/revalidate'

const webp = { format: 'webp' as const, options: { quality: 80 } }

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Média', plural: 'Médiathèque' },
  admin: {
    group: 'Contenu',
    description: 'Images (JPG, PNG, WebP…), vidéos MP4/WebM et PDF (CV). Stockées dans MinIO.',
  },
  access: { read: () => true },
  hooks: {
    afterChange: [revalidateAfterChange('projects', 'profile')],
    afterDelete: [revalidateAfterDelete('projects', 'profile')],
  },
  fields: [
    {
      name: 'alt',
      label: 'Description de l’image',
      type: 'text',
      admin: { description: 'Pour les images : ce que l’on voit (lu par les lecteurs d’écran).' },
    },
    { name: 'caption', label: 'Légende par défaut', type: 'text' },
  ],
  upload: {
    mimeTypes: ['image/*', 'video/mp4', 'video/webm', 'application/pdf'],
    adminThumbnail: 'small',
    focalPoint: true,
    imageSizes: [
      { name: 'small', width: 480, formatOptions: webp },
      { name: 'medium', width: 960, formatOptions: webp },
      { name: 'large', width: 1600, formatOptions: webp },
    ],
  },
}
