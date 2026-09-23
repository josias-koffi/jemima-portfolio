import { BlocksFeature, lexicalEditor, UploadFeature } from '@payloadcms/richtext-lexical'

import { YouTubeBlock } from '../blocks/YouTube'

/**
 * Éditeur du texte des projets : fonctions par défaut + images/vidéos de la
 * médiathèque glissées entre deux paragraphes + bloc YouTube.
 */
export const projectEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    UploadFeature({
      collections: {
        media: {
          fields: [
            { name: 'caption', label: 'Légende', type: 'text' },
            {
              name: 'loop',
              label: 'Vidéo : lecture automatique en boucle, sans son',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      },
    }),
    BlocksFeature({ blocks: [YouTubeBlock] }),
  ],
})
