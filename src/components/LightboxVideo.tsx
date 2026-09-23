'use client'

import { useEffect, useRef } from 'react'

/**
 * Vidéo de la visionneuse : lue avec le son à l'ouverture du popover parent,
 * mise en pause et rembobinée à sa fermeture (sinon le son continue, caché).
 */
export function LightboxVideo({ src, label }: { src: string; label?: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    const popover = video?.closest<HTMLElement>('[popover]')
    if (!video || !popover) return
    const onToggle = (e: Event) => {
      if ((e as ToggleEvent).newState === 'open') {
        video.muted = false
        // Le clic qui ouvre compte comme geste utilisateur : le son est autorisé.
        video.play().catch((err: DOMException) => {
          // Son refusé par le navigateur : on relance en muet. Une AbortError
          // (fermeture pendant le chargement) ne doit surtout pas relancer.
          if (err.name !== 'NotAllowedError' || !popover.matches(':popover-open')) return
          video.muted = true
          void video.play()
        })
      } else {
        video.pause()
        video.currentTime = 0
      }
    }
    popover.addEventListener('toggle', onToggle)
    return () => popover.removeEventListener('toggle', onToggle)
  }, [])

  return <video ref={ref} src={src} controls playsInline loop preload="none" aria-label={label} />
}
