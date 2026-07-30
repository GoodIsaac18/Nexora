import { cn } from "@/lib/utils"

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className,
      )}
      {...props}
    />
  )
}

export function ToolCardSkeleton() {
  return (
    <div className="group relative flex flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-300 lg:rounded-3xl lg:border-2 lg:bg-card/80 lg:backdrop-blur-sm lg:p-6 lg:duration-500">
      <div className="flex items-start justify-between gap-3 lg:gap-4">
        <Skeleton className="size-11 rounded-xl lg:size-14 lg:rounded-2xl" />
        <Skeleton className="size-5 rounded-full lg:size-6" />
      </div>
      <Skeleton className="mt-4 h-5 w-3/4 rounded lg:mt-5 lg:h-6" />
      <Skeleton className="mt-1 h-4 w-full rounded lg:mt-2" />
      <Skeleton className="mt-1 h-4 w-1/2 rounded" />
    </div>
  )
}

export function ToolShellSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-7xl lg:py-16 xl:py-20">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 lg:mb-8 lg:gap-3">
        <Skeleton className="h-8 w-20 rounded-lg lg:h-10 lg:w-24 lg:rounded-xl" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-lg lg:h-10 lg:w-32 lg:rounded-xl" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-8 w-32 rounded-lg bg-primary/10 lg:h-10 lg:w-40 lg:rounded-xl" />
      </div>

      <div className="grid gap-8 lg:gap-12 lg:grid-cols-[minmax(0,1fr)_350px] lg:items-start">
        <div className="min-w-0">
          {/* Header */}
          <div className="mb-6 flex items-start gap-4 lg:mb-8 lg:gap-6">
            <Skeleton className="size-14 shrink-0 rounded-2xl lg:size-20 lg:rounded-3xl" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-3/4 rounded lg:h-12 lg:w-1/2" />
              <Skeleton className="h-4 w-full rounded lg:h-6" />
              <Skeleton className="h-4 w-2/3 rounded lg:h-6" />
            </div>
          </div>

          {/* Tool Content */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:rounded-3xl lg:border-2 lg:bg-card/50 lg:backdrop-blur-sm lg:p-8 lg:shadow-xl">
            <div className="space-y-4">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-12 w-1/2 rounded-xl" />
            </div>
          </div>

          {/* Related Tools */}
          <div className="mt-12 space-y-4 lg:mt-16">
            <Skeleton className="h-6 w-32 rounded lg:h-8 lg:w-40" />
            <div className="grid gap-4 sm:grid-cols-2 lg:gap-6 lg:grid-cols-3">
              <ToolCardSkeleton />
              <ToolCardSkeleton />
              <ToolCardSkeleton />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block space-y-6">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-40 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  )
}

export function ToolBrowserSkeleton() {
  return (
    <div className="space-y-12">
      {/* Search bar */}
      <Skeleton className="h-14 w-full rounded-2xl lg:h-16 lg:rounded-3xl" />

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 lg:gap-3">
        <Skeleton className="h-8 w-16 rounded-full lg:h-10 lg:w-20" />
        <Skeleton className="h-8 w-20 rounded-full lg:h-10 lg:w-24" />
        <Skeleton className="h-8 w-16 rounded-full lg:h-10 lg:w-20" />
        <Skeleton className="h-8 w-24 rounded-full lg:h-10 lg:w-28" />
        <Skeleton className="h-8 w-20 rounded-full lg:h-10 lg:w-24" />
      </div>

      {/* Results */}
      <div className="space-y-16">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <div className="flex items-baseline justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40 rounded lg:h-8 lg:w-48" />
                <Skeleton className="h-4 w-64 rounded lg:h-5 lg:w-80" />
              </div>
              <Skeleton className="h-6 w-8 rounded-full lg:h-8 lg:w-10" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              <ToolCardSkeleton />
              <ToolCardSkeleton />
              <ToolCardSkeleton />
              <ToolCardSkeleton />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
