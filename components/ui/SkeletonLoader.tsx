import { Skeleton } from "./skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-4 premium-shadow">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center space-y-3">
      <Skeleton className="h-20 w-20 md:h-24 md:w-24 rounded-full" />
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="w-full min-h-[500px] bg-gray-50 flex items-center px-4 py-20">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-24 w-3/4" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-32 rounded-lg" />
            <Skeleton className="h-12 w-32 rounded-lg" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full rounded-2xl hidden lg:block" />
      </div>
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-100 premium-shadow space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  );
}
