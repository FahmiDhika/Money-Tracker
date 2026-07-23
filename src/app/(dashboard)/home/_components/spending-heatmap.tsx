import { buildHeatmapWeeks, getHeatmapColor } from "@/lib/heatmap";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function SpendingHeatmap({
  days,
}: {
  days: { date: string; net: number }[];
}) {
  const weeks = buildHeatmapWeeks(days, 12);
  const maxAbs = Math.max(...days.map((d) => Math.abs(d.net)), 1);

  const monthLabels = weeks.map((week) => {
    const firstOfMonth = week.find(
      (day) => new Date(`${day.date}T00:00:00`).getDate() === 1,
    );
    if (!firstOfMonth) return null;
    return new Date(`${firstOfMonth.date}T00:00:00`).toLocaleDateString(
      "en-US",
      { month: "short" },
    );
  });

  return (
    <div className="rounded-xl border border-stone-200 p-4 shadow-sm">
      <p className="mb-3 text-sm font-semibold text-stone-900">
        Activity (last 12 weeks)
      </p>

      <div className="overflow-x-auto pb-1">
        <div className="mb-1 flex gap-1">
          {monthLabels.map((label, i) => (
            <div
              key={i}
              className="w-3 shrink-0 text-[9px] leading-none text-stone-400"
            >
              {label ?? ""}
            </div>
          ))}
        </div>

        <div className="flex gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day) => (
                <div
                  key={day.date}
                  title={`${day.date}: ${formatCurrency(day.net)}`}
                  className={`h-3 w-3 rounded-sm ${day.inFuture ? "bg-transparent" : getHeatmapColor(day.net, maxAbs)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-start gap-1.5 text-[10px] text-stone-400">
        <span>Loss</span>
        <span className="h-3 w-3 rounded-sm bg-red-600" />
        <span className="h-3 w-3 rounded-sm bg-red-200" />
        <span className="h-3 w-3 rounded-sm bg-stone-100" />
        <span className="h-3 w-3 rounded-sm bg-emerald-200" />
        <span className="h-3 w-3 rounded-sm bg-emerald-600" />
        <span>Surplus</span>
      </div>
    </div>
  );
}
