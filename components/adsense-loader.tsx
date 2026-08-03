"use client"

import Script from "next/script"
import { adsenseClientId } from "@/lib/ads"

/** Carga el script de AdSense una sola vez cuando hay client ID configurado. */
export function AdSenseScript() {
  const client = adsenseClientId()

  if (!client) return null

  return (
    <Script
      id="adsense-script"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}
