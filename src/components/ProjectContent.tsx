import type { SerializedBlockNode } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { type JSXConvertersFunction, RichText } from '@payloadcms/richtext-lexical/react'

import { youtubeId } from '../blocks/YouTube'
import { asMedia } from '../lib/media'
import type { Media } from '../payload-types'
import { MediaFigure } from './MediaFigure'

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: ({ node }) => {
    const media = asMedia(node.value as Media | number)
    if (!media) return null
    const fields = (node.fields ?? {}) as { caption?: string; loop?: boolean }
    return <MediaFigure media={media} caption={fields.caption || media.caption} loop={fields.loop} />
  },
  blocks: {
    youtube: ({ node }: { node: SerializedBlockNode<{ url: string; caption?: string }> }) => {
      const { url, caption } = node.fields
      return (
        <figure className="media">
          <div className="media__embed">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId(url)}`}
              title={caption || 'Vidéo'}
              loading="lazy"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      )
    },
  },
})

export function ProjectContent({ data }: { data: SerializedEditorState }) {
  return <RichText className="prose" data={data} converters={converters} disableIndent disableTextAlign />
}
