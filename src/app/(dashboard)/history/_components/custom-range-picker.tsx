"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <div className="flex shrink-0 items-center gap-2">
      <Input
        type="date"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        className="w-36"
      />
      <span className="text-stone-400">–</span>
      <Input
        type="date"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        className="w-36"
      />
      <Button
        size="sm"
        onClick={applyRange}
        className="bg-emerald-700 hover:bg-emerald-800"
      >
        Apply
      </Button>
    </div>
  );
}
