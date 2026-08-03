"use client"

import { useEffect } from "react"
import { adsenseClientId } from "@/lib/ads"

/** Carga el script de AdSense una sola vez cuando hay client ID configurado. */
export function AdSenseScript() {
  const client = adsenseClientId()

  useEffect(() => {
    if (!client || typeof document === "undefined") return
    // Check if script is already loaded by Next.js Script component
    if (document.querySelector('#adsense-script')) return
    if (document.querySelector('script[data-adsense="true"]')) return
    const s = document.createElement("script")
    s.async = true
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`
    s.crossOrigin = "anonymous"
    s.dataset.adsense = "true"
    document.head.appendChild(s)
  }, [client])

  if (!client) return null
  return null
}
