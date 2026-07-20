import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-28 rounded-2xl" />

      <div className="space-y-3 rounded-xl border border-stone-200 p-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </div>

      <div className="space-y-3 rounded-xl border border-stone-200 p-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-full rounded-xl" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-36 w-full rounded-lg" />
      </div>

      <div className="space-y-3 rounded-xl border border-stone-200 p-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-3 rounded-xl border border-stone-200 p-4">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
