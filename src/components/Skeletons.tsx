"use client";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col space-y-4 w-full">
      {/* Image Skeleton */}
      <div className="relative aspect-[3/4] w-full bg-zinc-100 animate-pulse border border-zinc-200" />

      {/* Meta Skeleton */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="h-3.5 bg-zinc-200 animate-pulse w-2/3" />
          <div className="h-3.5 bg-zinc-200 animate-pulse w-12" />
        </div>
        <div className="h-3 bg-zinc-100 animate-pulse w-4/5" />
        <div className="flex justify-between items-center pt-1.5">
          <div className="h-2.5 bg-zinc-100 animate-pulse w-1/3" />
          <div className="h-3 bg-zinc-100 animate-pulse w-10" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}
