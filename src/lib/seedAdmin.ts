import type { Payload } from 'payload'

/** Crée le premier compte admin depuis ADMIN_EMAIL / ADMIN_PASSWORD si la base n'en a aucun. */
export async function seedAdmin(payload: Payload) {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) return
  const { totalDocs } = await payload.count({ collection: 'users', overrideAccess: true })
  if (totalDocs > 0) return
  await payload.create({ collection: 'users', data: { email, password, name: 'Admin' }, overrideAccess: true })
  payload.logger.info(`Compte admin initial créé : ${email}`)
}
