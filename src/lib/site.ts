export const SITE_URL = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
export const SITE_ENV = process.env.SITE_ENV || 'development'
export const isStaging = SITE_ENV === 'staging'
export const SITE_TITLE = 'Jémima Egla'
export const SITE_DESCRIPTION = 'Communication, brand content & activation — portfolio de Jémima Egla, Paris.'

/** "01", "02"… comme sur l'ancien site. */
export const pad = (n: number) => String(n).padStart(2, '0')
