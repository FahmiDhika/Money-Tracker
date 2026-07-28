"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CustomRangePicker() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const applyRange = () => {
    if (!start || !end) return;
    const params = new URLSearchParams();
    params.set("start", start);
    params.set("end", end);
    router.push(`/history?${params.toString()}`);
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="shrink-0 rounded-full border border-dashed border-stone-300 px-4 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-50"
      >
        Custom range
      </button>
    );
  }

  return (
    <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap">
      <Input
        type="date"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        className="min-w-0 flex-1 sm:w-36 sm:flex-none"
      />
      <span className="text-stone-400">–</span>
      <Input
        type="date"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        className="min-w-0 flex-1 sm:w-36 sm:flex-none"
      />
      <div className="flex shrink-0 gap-1.5">
        <Button
          size="sm"
          onClick={applyRange}
          className="bg-emerald-700 hover:bg-emerald-800"
        >
          Apply
        </Button>
        <button
          onClick={() => setOpen(false)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-stone-200 text-stone-500 hover:bg-stone-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
