import { notFound } from 'next/navigation'

/** Toute URL inconnue affiche la 404 avec le gabarit du site. */
export default function CatchAll() {
  notFound()
}
