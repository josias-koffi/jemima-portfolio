/** Version déployée (tag d'image), vérifiée par le workflow de déploiement. */
export const dynamic = 'force-dynamic'

export function GET() {
  return Response.json(
    { service: 'jemima-portfolio', status: 'ok', version: process.env.APP_VERSION || 'dev' },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
