export function ProductCardSkeleton() {
  return (
    <div className="border border-neutral-200 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-neutral-200" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-neutral-200 w-3/4" />
        <div className="h-3 bg-neutral-200 w-full" />
        <div className="h-3 bg-neutral-200 w-2/3" />
        <div className="h-8 bg-neutral-200 w-1/3 mt-2" />
      </div>
    </div>
  )
}

export function ProductPageSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-12 animate-pulse">
      <div className="aspect-square bg-neutral-200" />
      <div className="space-y-6">
        <div className="h-10 bg-neutral-200 w-3/4" />
        <div className="h-6 bg-neutral-200 w-1/2" />
        <div className="h-12 bg-neutral-200 w-1/3 border-y border-neutral-200 py-6" />
        <div className="h-4 bg-neutral-200 w-full" />
        <div className="h-4 bg-neutral-200 w-full" />
        <div className="h-14 bg-neutral-200 w-full mt-6 border-t border-neutral-200 pt-6" />
      </div>
    </div>
  )
}

export function CartItemSkeleton() {
  return (
    <div className="flex items-center gap-6 border border-neutral-200 p-6 animate-pulse">
      <div className="w-24 h-24 bg-neutral-200" />
      <div className="flex-1 space-y-3">
        <div className="h-5 bg-neutral-200 w-2/3" />
        <div className="h-4 bg-neutral-200 w-1/3" />
        <div className="h-8 bg-neutral-200 w-1/4 mt-3" />
      </div>
    </div>
  )
}

