import type { Endpoint } from 'payload'

/** GET /api/health — la base répond (et les migrations sont passées). */
export const healthEndpoint: Endpoint = {
  path: '/health',
  method: 'get',
  handler: async (req) => {
    try {
      await req.payload.count({ collection: 'users', overrideAccess: true })
      return Response.json(
        { status: 'ok', version: process.env.APP_VERSION || 'dev' },
        { headers: { 'Cache-Control': 'no-store' } },
      )
    } catch (error) {
      req.payload.logger.error({ err: error }, 'healthcheck failed')
      return Response.json({ status: 'error' }, { status: 503 })
    }
  },
}
