import { s3Storage } from '@payloadcms/storage-s3'

/**
 * Médias dans MinIO. L'upload passe par l'endpoint interne (S3_ENDPOINT),
 * les navigateurs lisent les fichiers directement sur le domaine média public
 * (MEDIA_PUBLIC_URL = https://<domaine-media>/<bucket>), bucket en lecture anonyme.
 */
export const storageS3 = () =>
  s3Storage({
    enabled: Boolean(process.env.S3_ENDPOINT),
    bucket: process.env.S3_BUCKET || 'media',
    collections: {
      media: {
        disablePayloadAccessControl: true,
        generateFileURL: ({ filename, prefix }) =>
          `${process.env.MEDIA_PUBLIC_URL}/${prefix ? `${prefix}/` : ''}${filename}`,
      },
    },
    config: {
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION || 'us-east-1',
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET_KEY || '',
      },
    },
  })
