import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { fr } from '@payloadcms/translations/languages/fr'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Users } from './collections/Users'
import { healthEndpoint } from './endpoints/health'
import { importJekyllEndpoint } from './endpoints/importJekyll'
import { Profile } from './globals/Profile'
import { projectEditor } from './lib/editor'
import { seedAdmin } from './lib/seedAdmin'
import { storageS3 } from './lib/storage'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const smtpHost = process.env.SMTP_HOST

export default buildConfig({
  serverURL: process.env.SITE_URL || '',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' — Portfolio Jémima' },
  },
  i18n: { supportedLanguages: { fr }, fallbackLanguage: 'fr' },
  collections: [Projects, Media, Users],
  globals: [Profile],
  endpoints: [healthEndpoint, importJekyllEndpoint],
  editor: projectEditor,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
    prodMigrations: migrations,
  }),
  upload: { limits: { fileSize: 200 * 1024 * 1024 } },
  // Sans SMTP (dev, vérification CI de l'image), pas d'adaptateur : les e-mails vont dans les logs.
  email: smtpHost
    ? nodemailerAdapter({
        defaultFromAddress: process.env.EMAIL_FROM || 'no-reply@koklo.dev',
        defaultFromName: 'Portfolio Jémima',
        transportOptions: {
          host: smtpHost,
          port: Number(process.env.SMTP_PORT || 587),
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
        },
      })
    : undefined,
  sharp,
  plugins: [storageS3()],
  onInit: seedAdmin,
})
