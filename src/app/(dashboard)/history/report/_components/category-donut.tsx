"use client";

import { getCategoryIcon } from "@/components/common/transaction/category-icons";
import { formatCurrency } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const SOLID_TO_HEX: Record<string, string> = {
  "bg-amber-500": "#f59e0b",
  "bg-blue-500": "#3b82f6",
  "bg-indigo-500": "#6366f1",
  "bg-cyan-500": "#06b6d4",
  "bg-violet-500": "#8b5cf6",
  "bg-teal-500": "#14b8a6",
  "bg-orange-500": "#f97316",
  "bg-rose-500": "#f43f5e",
  "bg-yellow-500": "#eab308",
  "bg-sky-500": "#0ea5e9",
  "bg-slate-500": "#64748b",
  "bg-emerald-600": "#059669",
  "bg-red-500": "#ef4444",
};

type CategoryData = { category: string; amount: number; percentage: number };
export function CategoryDonut({
  title,
  data,
  type,
}: {
  title: string;
  data: CategoryData[];
  type: "income" | "expense";
}) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-stone-200 p-4 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-stone-900">{title}</p>
        <p className="py-8 text-center text-sm text-stone-400">No data</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 p-4 shadow-sm">
      <p className="mb-3 text-sm font-semibold text-stone-900">{title}</p>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              innerRadius={45}
              outerRadius={65}
              paddingAngle={2}
            >
              {data.map((item) => {
                const { solid } = getCategoryIcon(item.category, type);
                // Tailwind class -> hex, karena recharts butuh warna langsung, bukan className
                return (
                  <Cell
                    key={item.category}
                    fill={SOLID_TO_HEX[solid] ?? "#a8a29e"}
                  />
                );
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 space-y-2">
        {data.map((item) => {
          const { icon: Icon, bg, text } = getCategoryIcon(item.category, type);
          return (
            <div
              key={item.category}
              className="flex items-center justify-between text-xs"
            >
              <span className="flex items-center gap-2 text-stone-600">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${bg}`}
                >
                  <Icon className={`h-3.5 w-3.5 ${text}`} />
                </span>
                {item.category}
              </span>
              <span className="text-stone-900">
                {formatCurrency(item.amount)} · {item.percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
