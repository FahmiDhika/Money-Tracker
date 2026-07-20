import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionLoading() {
  return (
    <div className="mx-auto max-w-sm space-y-5">
      <Skeleton className="h-6 w-40" />

      <div className="space-y-3 rounded-2xl border border-stone-200 p-4">
        <Skeleton className="h-9 w-full rounded-xl" />
        <Skeleton className="mx-auto h-10 w-40" />
      </div>

      <Skeleton className="h-4 w-20" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>

      <Skeleton className="h-4 w-32" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>

      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-11 w-full rounded-md" />
    </div>
  );
}
