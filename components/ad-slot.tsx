"use client"

import { useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  type AdPlacement,
  AD_SLOTS,
  adsenseClientId,
  getAdSlotId,
} from "@/lib/ads"

type AdSlotProps = {
  placement: AdPlacement
  className?: string
  sticky?: boolean
}

export function AdSlot({ placement, className, sticky }: AdSlotProps) {
  const config = AD_SLOTS[placement]
  const client = adsenseClientId()
  const slotId = getAdSlotId(placement)

  useEffect(() => {
    if (!client || !slotId) return
    try {
      ;((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle =
        (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || []).push({})
    } catch {}
  }, [client, slotId])

  if (client && slotId) {
    return (
      <aside
        className={cn(
          "ad-slot flex justify-center",
          sticky && "lg:sticky lg:top-24",
          className,
        )}
        aria-label="Publicidad"
      >
        <ins
          className={cn(
            "adsbygoogle block w-full max-w-full overflow-hidden rounded-xl border border-border/60 bg-muted/20",
            config.minHeight,
          )}
          style={{ display: "block" }}
          data-ad-client={client}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </aside>
    )
  }

  return (
    <aside
      className={cn(
        "ad-slot flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/25 px-4 py-3 text-center",
        config.minHeight,
        sticky && "lg:sticky lg:top-24",
        className,
      )}
      aria-label="Espacio reservado para publicidad"
    >
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
        Publicidad
      </span>
      <span className="mt-1 text-xs text-muted-foreground">{config.label}</span>
    </aside>
  )
}
