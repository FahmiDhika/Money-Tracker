import { Skeleton } from "@/components/ui/skeleton";

export default function UserLoading() {
  return (
    <div className="mx-auto max-w-sm space-y-5">
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-stone-100 p-6">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="space-y-3 rounded-xl border border-stone-200 p-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      <div className="space-y-2 rounded-xl border border-stone-200 p-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </div>
  );
}
