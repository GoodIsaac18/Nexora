import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 lg:rounded-3xl lg:border-2 lg:bg-card/80 lg:backdrop-blur-sm lg:p-8 lg:shadow-lg lg:hover:shadow-xl lg:hover:shadow-primary/10 animate-scale-in",
      className
    )}>
      {children}
    </div>
  )
}

export function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium transition-colors hover:text-primary lg:mb-3 lg:text-base lg:font-semibold">
      {children}
    </label>
  )
}

export const inputClass = () =>
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10 hover:border-primary/30 lg:rounded-2xl lg:border-2 lg:bg-background/50 lg:backdrop-blur-sm lg:px-5 lg:py-4 lg:text-base lg:focus:bg-background"

export const textAreaClass = (extraClasses = "") =>
  `w-full min-h-[200px] rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10 resize-y hover:border-primary/30 lg:rounded-2xl lg:border-2 lg:bg-background/50 lg:backdrop-blur-sm lg:px-5 lg:py-4 lg:text-base ${extraClasses}`

export function ActionButton({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className,
  disabled,
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "outline"
  type?: "button" | "submit"
  className?: string
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-sm font-medium transition-all duration-300 lg:h-14 lg:gap-3 lg:rounded-2xl lg:px-8 lg:text-base lg:font-semibold",
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-95 disabled:pointer-events-none disabled:opacity-50 lg:hover:scale-105 lg:hover:shadow-xl lg:hover:shadow-primary/30 lg:bg-gradient-to-r lg:from-primary lg:to-primary/80"
          : "border border-border bg-background hover:bg-muted active:scale-95 disabled:pointer-events-none disabled:opacity-50 lg:border-2 lg:bg-background/50 lg:backdrop-blur-sm lg:hover:border-primary/50 lg:hover:scale-105",
        className,
      )}
    >
      {children}
    </button>
  )
}
