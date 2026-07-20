"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Sun,
  CalendarDays,
  CalendarRange,
  Calendar,
  LayoutGrid,
  CalendarClock,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PeriodType } from "@/lib/period";
import { CustomRangePicker } from "./custom-range-picker";

const TYPES: { value: PeriodType; label: string; icon: typeof Sun }[] = [
  { value: "day", label: "Day", icon: Sun },
  { value: "week", label: "Week", icon: CalendarDays },
  { value: "2week", label: "2 Week", icon: CalendarRange },
  { value: "month", label: "Month", icon: Calendar },
  { value: "quarter", label: "Quarter", icon: LayoutGrid },
  { value: "year", label: "Year", icon: CalendarClock },
];

export function PeriodTypeSelector({
  currentType,
}: {
  currentType: PeriodType;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (type: PeriodType | null) => {
    if (!type) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", type);
    params.delete("offset");
    params.delete("start");
    params.delete("end");
    router.push(`/history?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={currentType} onValueChange={handleSelect}>
        <SelectTrigger className="w-36 border-stone-200">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TYPES.map(({ value, label, icon: Icon }) => (
            <SelectItem key={value} value={value}>
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-stone-500" />
                {label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <CustomRangePicker />
    </div>
  );
}
