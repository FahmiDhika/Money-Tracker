"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { getPeriodRange, getPeriodOffsetRange, PeriodType } from "@/lib/period";

export function PeriodStrip({
  type,
  currentOffset,
}: {
  type: PeriodType;
  currentOffset: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeRef = useRef<HTMLButtonElement>(null);

  const { past, future } = getPeriodOffsetRange(type);
  const offsets = Array.from({ length: past + future + 1 }, (_, i) => i - past);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [type]);

  const handleSelect = (offset: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", type);
    params.set("offset", String(offset));
    params.delete("start");
    params.delete("end");
    router.push(`/history?${params.toString()}`);
  };

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      {offsets.map((offset) => {
        const { label } = getPeriodRange(type, offset);
        const isActive = offset === currentOffset;

        return (
          <button
            key={offset}
            ref={isActive ? activeRef : undefined}
            onClick={() => handleSelect(offset)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-sm font-medium transition-colors",
              isActive
                ? "border-emerald-700 bg-emerald-700 text-white"
                : "border-stone-200 text-stone-600 hover:bg-stone-50",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
