/**
 * Configuración de espacios publicitarios.
 *
 * Ubicaciones en la UI (no intrusivas):
 * - home-leaderboard: debajo del hero (728×90 / responsive)
 * - home-infeed: entre categorías en el listado (solo 1ª sección)
 * - tool-top: banner compacto bajo el título en móvil/tablet
 * - tool-sidebar: columna derecha en pantallas lg+ (300×250)
 * - footer-banner: sobre el pie de página (opcional, sitewide)
 *
 * Producción: define NEXT_PUBLIC_ADSENSE_CLIENT y los IDs de slot por variante.
 * Si no hay IDs, se muestra un marcador visual discreto para maquetación.
 */

export type AdPlacement =
  | "home-leaderboard"
  | "home-infeed"
  | "tool-top"
  | "tool-sidebar"
  | "footer-banner"

export const AD_SLOTS: Record<
  AdPlacement,
  { label: string; minHeight: string; slotEnvKey?: string }
> = {
  "home-leaderboard": {
    label: "728×90 Leaderboard",
    minHeight: "min-h-[90px]",
    slotEnvKey: "NEXT_PUBLIC_ADS_SLOT_HOME_LEADERBOARD",
  },
  "home-infeed": {
    label: "In-feed",
    minHeight: "min-h-[120px]",
    slotEnvKey: "NEXT_PUBLIC_ADS_SLOT_HOME_INFEED",
  },
  "tool-top": {
    label: "728×90",
    minHeight: "min-h-[70px]",
    slotEnvKey: "NEXT_PUBLIC_ADS_SLOT_TOOL_TOP",
  },
  "tool-sidebar": {
    label: "300×250",
    minHeight: "min-h-[250px]",
    slotEnvKey: "NEXT_PUBLIC_ADS_SLOT_TOOL_SIDEBAR",
  },
  "footer-banner": {
    label: "728×90",
    minHeight: "min-h-[90px]",
    slotEnvKey: "NEXT_PUBLIC_ADS_SLOT_FOOTER",
  },
}

export function getAdSlotId(placement: AdPlacement): string | undefined {
  const key = AD_SLOTS[placement].slotEnvKey
  if (!key) return undefined
  return process.env[key]?.trim() || undefined
}

export function adsenseClientId(): string | undefined {
  return process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || undefined
}
