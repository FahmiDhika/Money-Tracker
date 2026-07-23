import { toDateString } from "./period";

export type HeatmapDay = { date: string; net: number };

export function buildHeatmapWeeks(days: HeatmapDay[], weeksCount = 12) {
  const map = new Map(days.map((d) => [d.date, d.net]));

  const today = new Date();
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

  const totalDays = weeksCount * 7;
  const start = new Date(endOfWeek);
  start.setDate(endOfWeek.getDate() - totalDays + 1);

  const weeks: { date: string; net: number; inFuture: boolean }[][] = [];
  let currentWeek: { date: string; net: number; inFuture: boolean }[] = [];

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dateStr = toDateString(d);
    currentWeek.push({
      date: dateStr,
      net: map.get(dateStr) ?? 0,
      inFuture: d > today,
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  return weeks;
}

export function getHeatmapColor(net: number, maxAbs: number): string {
  if (maxAbs === 0 || net === 0) return "bg-stone-100";
  const intensity = Math.min(Math.abs(net) / maxAbs, 1);

  if (net > 0) {
    if (intensity > 0.66) return "bg-emerald-600";
    if (intensity > 0.33) return "bg-emerald-400";
    return "bg-emerald-200";
  }
  if (intensity > 0.66) return "bg-red-600";
  if (intensity > 0.33) return "bg-red-400";
  return "bg-red-200";
}
